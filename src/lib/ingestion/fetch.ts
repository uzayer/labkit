import { createHash } from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'

const CONTACT_EMAIL = 'uzayer.masud@dearasianyouth.org'
const USER_AGENT = `LabKit-Ingestion/0.1 (mailto:${CONTACT_EMAIL})`
const RETRYABLE_STATUS_CODES = new Set([408, 429, 500, 502, 503, 504])
const MAX_ATTEMPTS = 3
const INITIAL_RETRY_DELAY_MS = 250
const CROSSREF_TITLE_SCORE_THRESHOLD = 50

export interface CrossrefTitleSearchCandidate {
  title: string
  doi: string
  score: number
}

export interface CrossrefTitleResolution {
  candidate: { title: string; doi: string } | null
  method: 'crossref' | 'none'
  score?: number
}

function isRetryableStatus(status: number): boolean {
  return RETRYABLE_STATUS_CODES.has(status)
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export interface FetchOptions {
  /** Total tries, including the first. Default 3. */
  attempts?: number
  /** Per-attempt timeout. Default 10s — without one, a stalled request waits for undici's 5-minute default. */
  timeoutMs?: number
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
 * GET JSON with retry, a per-attempt timeout, and (when configured) caching.
 *
 * Returns null on any miss. Only *definitive* answers are cached — a JSON body,
 * or a 404/410 (the source genuinely has nothing). Timeouts, 5xx, and non-JSON
 * interstitials (DBLP's anti-bot page) are not cached, so a flaky source gets
 * another chance on the next run instead of being remembered as empty.
 */
export async function fetchJsonWithRetry(
  url: string,
  init: RequestInit,
  options: FetchOptions = {},
): Promise<unknown | null> {
  const cached = readCache(url)
  if (cached.hit) return cached.value

  const attempts = options.attempts ?? MAX_ATTEMPTS
  const timeoutMs = options.timeoutMs ?? DEFAULT_TIMEOUT_MS
  let delayMs = INITIAL_RETRY_DELAY_MS

  for (let attempt = 1; attempt <= attempts; attempt++) {
    try {
      const response = await fetch(url, { ...init, signal: AbortSignal.timeout(timeoutMs) })
      if (response.ok) {
        // A 200 that isn't JSON is an interstitial, not data — DBLP serves an
        // anti-bot challenge page this way. Treat it as a miss rather than
        // letting `.json()` reject: this helper is the shared path for
        // Crossref, OpenAlex and DBLP, and a throw here kills the whole run.
        const contentType = response.headers.get('content-type') ?? ''
        if (!contentType.toLowerCase().includes('json')) {
          return null
        }

        try {
          const json = (await response.json()) as unknown
          writeCache(url, json)
          return json
        } catch {
          // Malformed body — retrying will not repair it.
          return null
        }
      }

      if (response.status === 404 || response.status === 410) {
        writeCache(url, null)
        return null
      }

      if (attempt === attempts || !isRetryableStatus(response.status)) {
        return null
      }
    } catch {
      // Network error or timeout (AbortSignal.timeout rejects with TimeoutError).
      if (attempt === attempts) {
        return null
      }
    }

    await sleep(delayMs)
    delayMs *= 2
  }

  return null
}

export function defaultHeaders(headers?: HeadersInit): Headers {
  const merged = new Headers(headers)
  merged.set('User-Agent', USER_AGENT)
  return merged
}

export async function fetchCrossrefByDoi(doi: string): Promise<unknown | null> {
  return fetchJsonWithRetry(`https://api.crossref.org/works/${encodeURIComponent(doi)}`, {
    headers: defaultHeaders(),
  })
}

export async function fetchOpenAlexByDoi(doi: string): Promise<unknown | null> {
  const url = `https://api.openalex.org/works/https://doi.org/${encodeURIComponent(doi)}?mailto=${encodeURIComponent(CONTACT_EMAIL)}`
  return fetchJsonWithRetry(url, {
    headers: defaultHeaders(),
  })
}

export async function searchCrossrefByTitle(
  query: string,
  rows = 3,
): Promise<CrossrefTitleSearchCandidate[]> {
  const url = `https://api.crossref.org/works?query.bibliographic=${encodeURIComponent(query)}&rows=${rows}`
  const json = await fetchJsonWithRetry(url, {
    headers: defaultHeaders(),
  })

  const items =
    (json as { message?: { items?: Array<{ title?: string[]; DOI?: string; score?: number }> } })
      ?.message?.items ?? []

  return items.flatMap((item) => {
    const title = Array.isArray(item.title) ? item.title[0] : undefined
    if (!title || typeof item.DOI !== 'string' || typeof item.score !== 'number') {
      return []
    }

    return [{ title, doi: item.DOI, score: item.score }]
  })
}

export async function resolveCrossrefTitle(
  query: string,
  rows = 3,
): Promise<CrossrefTitleResolution> {
  const candidates = await searchCrossrefByTitle(query, rows)
  const best = candidates[0]

  if (!best || best.score < CROSSREF_TITLE_SCORE_THRESHOLD) {
    return { candidate: null, method: 'none', score: best?.score }
  }

  return {
    candidate: { title: best.title, doi: best.doi },
    method: 'crossref',
    score: best.score,
  }
}
