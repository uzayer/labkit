import { defaultHeaders, fetchJsonWithRetry } from './fetch'
import { diceCoefficient } from './match'
import { normalizeTitle } from './normalize'

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

export async function fetchDblpRecordByTitle(
  title: string,
  year: number,
): Promise<DblpMatch | null> {
  const url = `https://dblp.org/search/publ/api?q=${encodeURIComponent(title)}&format=json&h=5`
  const json = await fetchJsonWithRetry(url, { headers: defaultHeaders() })

  const hits = asArray(
    (json as { result?: { hits?: { hit?: DblpHit | DblpHit[] } } })?.result?.hits?.hit,
  )

  const normalizedQuery = normalizeTitle(title)
  let best: { info: DblpHitInfo; score: number } | null = null

  for (const hit of hits) {
    const info = hit.info
    if (!info?.title || !info.year) continue
    if (Number(info.year) !== year) continue // same-year gate — never match across years

    const score = diceCoefficient(normalizedQuery, normalizeTitle(info.title))
    if (!best || score > best.score) {
      best = { info, score }
    }
  }

  if (!best || best.score < DBLP_TITLE_SCORE_THRESHOLD) return null

  const authors = asArray(best.info.authors?.author).map((author) => ({
    name: author.text,
    pid: author['@pid'],
  }))

  return { title: best.info.title!, year: Number(best.info.year), authors }
}
