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

export async function fetchJsonWithRetry(url: string, init: RequestInit): Promise<unknown | null> {
  let delayMs = INITIAL_RETRY_DELAY_MS

  for (let attempt = 1; attempt <= MAX_ATTEMPTS; attempt++) {
    try {
      const response = await fetch(url, init)
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
          return await response.json()
        } catch {
          // Malformed body — retrying will not repair it.
          return null
        }
      }

      if (attempt === MAX_ATTEMPTS || !isRetryableStatus(response.status)) {
        return null
      }
    } catch {
      if (attempt === MAX_ATTEMPTS) {
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
