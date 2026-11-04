import { defaultHeaders, fetchJsonWithRetry } from './fetch'
import { diceCoefficient } from './match'
import { normalizeDoi, normalizeTitle } from './normalize'

/**
 * DBLP embeds already-disambiguated author identifiers (pid) per publication
 * record — structural evidence from a third party, not a name-similarity
 * guess. CS-venue coverage only (ACM/IEEE/CS journals); a miss here is the
 * expected common case for non-CS papers, not an error.
 */
const DBLP_TITLE_SCORE_THRESHOLD = 0.85

export interface DblpAuthor {
  name: string
  pid: string
}

export interface DblpMatch {
  title: string
  year: number
  authors: DblpAuthor[]
}

interface DblpAuthorEntry {
  '@pid': string
  text: string
}

interface DblpHitInfo {
  title?: string
  year?: string
  doi?: string
  authors?: {
    author?: DblpAuthorEntry | DblpAuthorEntry[]
  }
}

interface DblpHit {
  info?: DblpHitInfo
}

/** DBLP's XML-to-JSON conversion collapses a single-item list to a bare object instead of a one-element array. */
function asArray<T>(value: T | T[] | undefined): T[] {
  if (value === undefined) return []
  return Array.isArray(value) ? value : [value]
}

const DBLP_FAILURES_BEFORE_DISABLE = 3
let consecutiveDblpFailures = 0
let dblpDisabled = false

/**
 * Looks a paper up on DBLP by title, then identifies the record by DOI when
 * the paper has one. DBLP's search has no DOI query, and a title search can
 * return a different paper with the same title (a CHI paper and its CHI
 * Extended Abstract), whose author pids would then attach to the wrong
 * people. So a hit carrying the paper's DOI wins, a hit carrying another DOI
 * is never used, and the same-year title match is the fallback only for hits
 * DBLP lists without a DOI.
 */
export async function fetchDblpRecordByTitle(
  title: string,
  year: number,
  doi?: string,
): Promise<DblpMatch | null> {
  if (dblpDisabled) return null

  const url = `https://dblp.org/search/publ/api?q=${encodeURIComponent(title)}&format=json&h=5`
  // DBLP is optional enrichment (author pids only) and the slowest, least
  // reliable source: measured stalling ~40s then dropping the connection. A
  // short timeout, no retry on a stall, one retry when DBLP asks for one with
  // 429/503 + Retry-After, and a circuit breaker so a DBLP outage costs a run
  // a few seconds instead of minutes.
  const json = await fetchJsonWithRetry(
    url,
    { headers: defaultHeaders() },
    { attempts: 2, timeoutMs: 8_000, retryOnNetworkError: false },
  )
  if (json === null) {
    consecutiveDblpFailures++
    // `!dblpDisabled`: prefetch runs lookups concurrently, so requests already
    // in flight when the breaker trips would otherwise each log it again.
    if (!dblpDisabled && consecutiveDblpFailures >= DBLP_FAILURES_BEFORE_DISABLE) {
      dblpDisabled = true
      console.warn(
        `[dblp] ${consecutiveDblpFailures} consecutive failures — skipping DBLP for the rest of this run`,
      )
    }
    return null
  }
  consecutiveDblpFailures = 0

  const hits = asArray(
    (json as { result?: { hits?: { hit?: DblpHit | DblpHit[] } } })?.result?.hits?.hit,
  )

  const wantedDoi = doi ? normalizeDoi(doi) : undefined
  const byDoi = wantedDoi
    ? hits.find((hit) => hit.info?.doi && normalizeDoi(hit.info.doi) === wantedDoi)?.info
    : undefined
  if (byDoi?.title) return toMatch(byDoi)

  const normalizedQuery = normalizeTitle(title)
  let best: { info: DblpHitInfo; score: number } | null = null

  for (const hit of hits) {
    const info = hit.info
    if (!info?.title || !info.year) continue
    if (wantedDoi && info.doi) continue // a different DOI is a different record

    if (Number(info.year) !== year) continue // same-year gate — never match across years

    const score = diceCoefficient(normalizedQuery, normalizeTitle(info.title))
    if (!best || score > best.score) {
      best = { info, score }
    }
  }

  if (!best || best.score < DBLP_TITLE_SCORE_THRESHOLD) return null
  return toMatch(best.info)
}

function toMatch(info: DblpHitInfo): DblpMatch {
  const authors = asArray(info.authors?.author).map((author) => ({
    name: author.text,
    pid: author['@pid'],
  }))
  return { title: info.title!, year: Number(info.year), authors }
}
