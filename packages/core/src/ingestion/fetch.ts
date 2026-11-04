import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

// Crossref and OpenAlex route requests that carry a contact email to their
// "polite pool" (faster, more reliable). Without LABKIT_CONTACT_EMAIL we send no
// mailto at all rather than someone else's address, and fall back to the public
// pool: slower, but every lookup still works.
// Read per call, not at import, so it doesn't depend on when env files load.
const contactEmail = (): string | null => process.env.LABKIT_CONTACT_EMAIL?.trim() || null
// OpenAlex has required a key for real volumes since 2026-02: without one a
// client gets 100 credits a day. Singleton /works/{doi} lookups (all LabKit
// does) cost nothing, so the key is optional; set it before any batching.
const openalexApiKey = (): string | null => process.env.OPENALEX_API_KEY?.trim() || null

const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])
const MAX_ATTEMPTS = 3
const BASE_RETRY_DELAY_MS = 500
const MAX_RETRY_DELAY_MS = 30_000
// A Retry-After longer than this means "come back much later", not "pause":
// give up on this request rather than stall a whole import behind it.
const MAX_RETRY_AFTER_MS = 60_000

function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUS_CODES.has(status)
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

/**
 * Full-jitter backoff: a random wait in [0, min(cap, base·2^n)). Plain
 * doubling makes every worker that hit the same 429 retry in lockstep.
 */
function backoffMs(attempt: number): number {
  return Math.random() * Math.min(MAX_RETRY_DELAY_MS, BASE_RETRY_DELAY_MS * 2 ** (attempt - 1))
}

/** Retry-After is either delta-seconds or an HTTP date. */
function retryAfterMs(header: string | null): number | null {
  if (!header) return null
  const seconds = Number(header)
  if (Number.isFinite(seconds)) return Math.max(0, seconds * 1000)
  const date = Date.parse(header)
  return Number.isNaN(date) ? null : Math.max(0, date - Date.now())
}

// ─── Per-host concurrency ───────────────────────────────────────────────────
//
// Crossref's polite pool allows 3 concurrent requests; more earns 429s. DBLP
// asks bulk users to go slowly and walls off clients that don't. The cap
// applies to requests in flight only, never to a backoff wait.

const HOST_CONCURRENCY: Record<string, number> = {
  'api.crossref.org': 3,
  'dblp.org': 1,
}
const DEFAULT_HOST_CONCURRENCY = 5
const hostSlots = new Map<string, { active: number; waiting: Array<() => void> }>()

async function withHostSlot<T>(host: string, run: () => Promise<T>): Promise<T> {
  const limit = HOST_CONCURRENCY[host] ?? DEFAULT_HOST_CONCURRENCY
  let slot = hostSlots.get(host)
  if (!slot) {
    slot = { active: 0, waiting: [] }
    hostSlots.set(host, slot)
  }
  if (slot.active >= limit) {
    await new Promise<void>((resolve) => slot!.waiting.push(resolve))
  } else {
    slot.active++
  }
  try {
    return await run()
  } finally {
    // Hand the slot straight to the next waiter, or free it.
    const next = slot.waiting.shift()
    if (next) next()
    else slot.active--
  }
}

export interface FetchOptions {
  /** Total tries, including the first. Default 3. */
  attempts?: number
  /** Per-attempt timeout. Default 10s — without one, a stalled request waits for undici's 5-minute default. */
  timeoutMs?: number
  /**
   * Retry after a network error or timeout, not only after a retryable
   * status. Default true. DBLP turns it off: it stalls rather than errors,
   * so a second attempt doubles the stall, but a 429 with Retry-After is
   * still worth one polite retry.
   */
  retryOnNetworkError?: boolean
  /** Cache key when the URL carries a secret (an API key) that must stay out of it. */
  cacheKey?: string
  /** Set false for answers that must be fresh on every run even when a CLI enabled the cache. */
  cache?: boolean
}

const DEFAULT_TIMEOUT_MS = 10_000

// ─── Response cache ─────────────────────────────────────────────────────────
//
// Off unless a CLI turns it on (configureFetchCache). The Operator's loop is
// dry-run → read the preview → fix → dry-run again over the same works; without
// a cache every iteration re-fetches identical Crossref/OpenAlex/DBLP answers.
// The job path in the running app never enables it: no writable disk on a
// serverless host, and a long-lived process must not grow an unbounded map.

interface FetchCacheConfig {
  /** Directory for on-disk entries; omit for a process-lifetime memory cache only. */
  dir?: string
  /** Max age of a disk entry. Default 7 days. */
  ttlMs?: number
}

let cacheConfig: FetchCacheConfig | null = null
const memoryCache = new Map<string, unknown | null>()

export function configureFetchCache(config: FetchCacheConfig): void {
  cacheConfig = { ttlMs: 7 * 24 * 60 * 60 * 1000, ...config }
  if (config.dir) fs.mkdirSync(config.dir, { recursive: true })
}

function cacheFile(url: string): string | null {
  if (!cacheConfig?.dir) return null
  return path.join(cacheConfig.dir, `${createHash('sha1').update(url).digest('hex')}.json`)
}

function readCache(url: string): { hit: boolean; value: unknown | null } {
  if (!cacheConfig) return { hit: false, value: null }
  if (memoryCache.has(url)) return { hit: true, value: memoryCache.get(url) ?? null }
  const file = cacheFile(url)
  if (!file) return { hit: false, value: null }
  try {
    const stat = fs.statSync(file)
    if (Date.now() - stat.mtimeMs > cacheConfig.ttlMs!) return { hit: false, value: null }
    const value = JSON.parse(fs.readFileSync(file, 'utf8')) as unknown | null
    memoryCache.set(url, value)
    return { hit: true, value }
  } catch {
    return { hit: false, value: null }
  }
}

function writeCache(url: string, value: unknown | null): void {
  if (!cacheConfig) return
  memoryCache.set(url, value)
  const file = cacheFile(url)
  if (file) fs.writeFileSync(file, JSON.stringify(value))
}

/**
 * GET JSON with retry, a per-attempt timeout, a per-host concurrency cap, and
 * (when configured) caching.
 *
 * Returns null on any miss. Only *definitive* answers are cached — a JSON body,
 * or a 404/410 (the source genuinely has nothing). Timeouts, 5xx, and non-JSON
 * interstitials (DBLP's anti-bot page) are not cached, so a flaky source gets
 * another chance on the next run instead of being remembered as empty.
 *
 * A Retry-After header sets the wait before the next attempt; otherwise the
 * wait is jittered exponential backoff.
 */
export async function fetchJsonWithRetry(
  url: string,
  init: RequestInit,
  options: FetchOptions = {},
): Promise<unknown | null> {
  const useCache = options.cache ?? true
  const cacheKey = options.cacheKey ?? url
  const cached = useCache ? readCache(cacheKey) : { hit: false, value: null }
  if (cached.hit) return cached.value
  const store = (value: unknown | null) => {
    if (useCache) writeCache(cacheKey, value)
  }

  const attempts = options.attempts ?? MAX_ATTEMPTS
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  const retryOnNetworkError = options.retryOnNetworkError ?? true
  const host = new URL(url).hostname

  for (let attempt = 1; attempt <= attempts; attempt++) {
    let waitMs = backoffMs(attempt)
    try {
      const outcome = await withHostSlot(host, async () => {
        const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
        if (response.ok) {
          // A 200 that isn't JSON is an interstitial, not data — DBLP serves an
          // anti-bot challenge page this way. Treat it as a miss rather than
          // letting `.json()` reject: this helper is the shared path for every
          // source, and a throw here kills the whole run.
          const contentType = response.headers.get('content-type') ?? ''
          if (!contentType.toLowerCase().includes('json')) return { done: true, value: null }
          try {
            const json = (await response.json()) as unknown
            store(json)
            return { done: true, value: json }
          } catch {
            // Malformed body — retrying will not repair it.
            return { done: true, value: null }
          }
        }
        if (response.status === 404 || response.status === 410) {
          store(null)
          return { done: true, value: null }
        }
        if (!isRetryableStatus(response.status)) return { done: true, value: null }
        return { done: false, retryAfter: retryAfterMs(response.headers.get('retry-after')) }
      })
      if (outcome.done) return outcome.value
      if (outcome.retryAfter !== null && outcome.retryAfter !== undefined) {
        if (outcome.retryAfter > MAX_RETRY_AFTER_MS) return null
        waitMs = outcome.retryAfter
      }
    } catch {
      // Network error or timeout (AbortSignal.timeout rejects with TimeoutError).
      if (!retryOnNetworkError) return null
    }

    if (attempt === attempts) return null
    await sleep(waitMs)
  }

  return null
}

export function defaultHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers)
  const email = contactEmail()
  merged.set(
    'User-Agent',
    email ? `LabKit-Ingestion/0.1 (mailto:${email})` : 'LabKit-Ingestion/0.1',
  )
  return merged
}

/**
 * A Crossref REST URL with `mailto` as a query parameter as well as in the
 * User-Agent: Crossref documents both, and the parameter is what places a
 * request in the polite pool reliably.
 */
export function crossrefUrl(pathname: string, params: Record<string, string> = {}): string {
  const url = new URL(pathname, 'https://api.crossref.org')
  for (const [key, value] of Object.entries(params)) url.searchParams.set(key, value)
  const email = contactEmail()
  if (email) url.searchParams.set('mailto', email)
  return url.href
}

export async function fetchCrossrefByDoi(doi: string): Promise<unknown | null> {
  return fetchJsonWithRetry(crossrefUrl(`/works/${encodeURIComponent(doi)}`), {
    headers: defaultHeaders(),
  })
}

/** A DOI in a URL path, its `/` kept literal (10.48550/arXiv.x, not 10.48550%2FarXiv.x). */
function doiPath(doi: string): string {
  return doi.split('/').map(encodeURIComponent).join('/')
}

/**
 * The registration agency holding a DOI ("Crossref", "DataCite", "mEDRA"…),
 * from doi.org. Asked only after Crossref has no record, so a DOI is never
 * reported failed when it is simply registered elsewhere.
 */
export async function fetchRegistrationAgency(doi: string): Promise<string | null> {
  const json = await fetchJsonWithRetry(`https://doi.org/ra/${doiPath(doi)}`, {
    headers: defaultHeaders(),
  })
  const ra = Array.isArray(json) ? (json[0] as { RA?: unknown } | undefined)?.RA : undefined
  return typeof ra === 'string' ? ra : null
}

export async function fetchDataciteByDoi(doi: string): Promise<unknown | null> {
  return fetchJsonWithRetry(`https://api.datacite.org/dois/${doiPath(doi)}`, {
    headers: defaultHeaders(),
  })
}

/** A ROR record by its full id ("https://ror.org/05wdbfp45"), from ROR's v2 API. */
export async function fetchRorOrganization(rorId: string): Promise<unknown | null> {
  const id = rorId.replace(/^https?:\/\/ror\.org\//i, '').trim()
  if (!/^0[a-z0-9]{8}$/i.test(id)) return null
  return fetchJsonWithRetry(`https://api.ror.org/v2/organizations/${id}`, {
    headers: defaultHeaders(),
  })
}

export async function fetchOpenAlexByDoi(doi: string): Promise<unknown | null> {
  const url = new URL(`https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}`)
  const email = contactEmail()
  if (email) url.searchParams.set('mailto', email)
  const cacheKey = url.href
  const key = openalexApiKey()
  if (key) url.searchParams.set('api_key', key)
  return fetchJsonWithRetry(url.href, { headers: defaultHeaders() }, { cacheKey })
}
