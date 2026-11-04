import { crossrefUrl, defaultHeaders, fetchJsonWithRetry } from './fetch'
import { nameTokens, normalizeDoi, normalizeTitle, normalizeVenueName } from './normalize'

/**
 * Crossref title and citation search with validation, after Crossref's own
 * search-based matching with validation (Tkaczyk, CrossRef/
 * reference-matching-evaluation). Crossref's search is a relevance ranking,
 * not a matcher: for a DOI-less regional paper its top hit is often a
 * different paper by the same authors, or the paper's preprint. So a hit is
 * auto-applied only when several independent fields agree, and everything
 * else becomes a Review Item listing the top candidates for a person to pick.
 *
 * The thresholds below were tuned on the labelled corpus in
 * scripts/ingestion/fixtures/search (DIAL's BibTeX, title and citation-line
 * queries), choosing the most recall that keeps precision at 100%. Re-tune
 * there, never on a live import.
 */

/** Candidate selection: SBMV keeps the top hit plus any hit at or above this `score / query length`. */
export const SELECT_NORMALIZED_SCORE = 0.4
/** A title "agrees" at or above this token similarity. */
export const TITLE_AGREEMENT = 0.8
/**
 * Auto-apply needs the mean field similarity at or above this. At 0.7 a hit
 * with an agreeing title may miss on one field (usually the venue, which
 * BibTeX and Crossref spell differently) but not on two. On the corpus, every
 * hit that passed at 0.6 was right too, but the two extra ones had an
 * off-by-one year as well as a venue miss: too thin to auto-apply.
 */
export const ACCEPT_SIMILARITY = 0.7
/** Auto-apply needs this many agreeing fields, the title always among them. */
const MIN_SUPPORT = 3
const ROWS = 20
const REVIEW_CANDIDATES = 3

export interface BibliographicInput {
  /** Structured input (BibTeX): the fields are compared one by one. */
  title?: string
  year?: number
  /** Full names, in order. */
  authors?: string[]
  venue?: string
  /** Unstructured input (a pasted citation line): fields are looked for inside it. */
  chunk?: string
}

interface CrossrefSearchItem {
  DOI?: string
  score?: number
  type?: string
  title?: string[]
  subtitle?: string[]
  author?: Array<{ given?: string; family?: string; name?: string }>
  issued?: { 'date-parts'?: number[][] }
  published?: { 'date-parts'?: number[][] }
  'container-title'?: string[]
  'short-container-title'?: string[]
  event?: { name?: string }
}

export interface SearchCandidate {
  doi: string
  title: string
  year?: number
  type?: string
  score: number
  normalizedScore: number
  /** Mean of the evaluated field similarities, 0–1. */
  similarity: number
  /** Fields that agree: title, year, author, venue. */
  support: string[]
  /** Why it can never be auto-applied, if it can't. */
  blocked?: string
}

export type SearchDecision =
  | { status: 'accepted'; doi: string; candidates: SearchCandidate[] }
  | { status: 'review'; candidates: SearchCandidate[] }
  | { status: 'none'; candidates: [] }

// Records that are containers or by-products, never a Lab's work.
const NON_WORK_TYPES = new Set([
  'journal',
  'journal-issue',
  'journal-volume',
  'proceedings',
  'proceedings-series',
  'book-series',
  'book-set',
  'report-series',
  'component',
  'dataset',
  'database',
  'peer-review',
  'grant',
  'standard',
])

// Preprint servers deposit with Crossref as posted-content, or (SSRN) as a
// journal-article in "SSRN Electronic Journal".
const PREPRINT_VENUE = /\b(ssrn|research square|preprints?|arxiv|biorxiv|medrxiv|psyarxiv|osf)\b/i

// Venue words that say a record is a lesser track of the same conference: a
// CHI Extended Abstract is not a CHI paper, though the titles often match.
const TRACK_QUALIFIERS = ['extended abstracts', 'adjunct', 'companion']

const TITLE_STOPWORDS = new Set([
  'a',
  'an',
  'the',
  'of',
  'in',
  'on',
  'for',
  'and',
  'to',
  'with',
  'by',
  'at',
  'from',
])
const VENUE_STOPWORDS = new Set([
  ...TITLE_STOPWORDS,
  'international',
  'conference',
  'symposium',
  'journal',
  'ieee',
  'acm',
  'annual',
  'joint',
  'workshop',
  'transactions',
])

const titleTokens = (text: string) =>
  new Set(
    normalizeTitle(text)
      .split(' ')
      .filter((token) => token && !TITLE_STOPWORDS.has(token)),
  )
const venueTokens = (text: string) =>
  new Set(
    normalizeVenueName(text)
      .split(' ')
      .filter((token) => token && !VENUE_STOPWORDS.has(token)),
  )

function overlap(a: Set<string>, b: Set<string>): number {
  let shared = 0
  for (const token of a) if (b.has(token)) shared++
  return shared
}

function yearOf(item: CrossrefSearchItem): number | undefined {
  return (
    item.issued?.['date-parts']?.[0]?.[0] ?? item.published?.['date-parts']?.[0]?.[0] ?? undefined
  )
}

/** Structured search input from a staged BibTeX Candidate (stageBibtexCandidates' `raw`). */
export function bibtexSearchInput(candidate: {
  title: string
  year?: number
  raw?: Record<string, unknown>
}): BibliographicInput {
  const authors = Array.isArray(candidate.raw?.authors)
    ? (candidate.raw.authors as Array<{ fullName?: unknown }>).flatMap((author) =>
        typeof author.fullName === 'string' ? [author.fullName] : [],
      )
    : []
  const venue = typeof candidate.raw?.venue === 'string' ? candidate.raw.venue : undefined
  return { title: candidate.title, year: candidate.year, authors, venue }
}

/** The query sent to Crossref: the title for structured input, the whole line otherwise. */
export function bibliographicQuery(input: BibliographicInput): string {
  return (input.chunk ?? input.title ?? '').replace(/\s+/g, ' ').trim()
}

export function scoreCandidates(
  input: BibliographicInput,
  query: string,
  items: unknown[],
): SearchCandidate[] {
  const chunk = input.chunk
  const chunkTitleTokens = chunk ? titleTokens(chunk) : null
  const chunkNameTokens = chunk ? new Set(nameTokens(chunk)) : null
  const chunkVenueTokens = chunk ? venueTokens(chunk) : null
  const inputYears = chunk
    ? [...chunk.matchAll(/\b(19|20)\d{2}\b/g)].map((match) => Number(match[0]))
    : input.year
      ? [input.year]
      : []
  const inputTitle = input.title ? titleTokens(input.title) : null
  const inputFirstAuthor = input.authors?.[0] ? new Set(nameTokens(input.authors[0])) : null
  const inputVenue = input.venue ? venueTokens(input.venue) : null
  const inputVenueText = (chunk ?? input.venue ?? '').toLowerCase()

  return (items as CrossrefSearchItem[]).flatMap((item): SearchCandidate[] => {
    const title = item.title?.[0]
    if (!item.DOI || !title || typeof item.score !== 'number') return []
    const subtitle = item.subtitle?.[0]

    // Title: compare with and without Crossref's separate subtitle and keep
    // the better. A citation line holds more than the title, so there the
    // question is how much of the candidate's title it contains.
    const variants = [subtitle ? `${title} ${subtitle}` : title, title].map(titleTokens)
    const titleSimilarity = Math.max(
      ...variants.map((tokens) => {
        if (tokens.size === 0) return 0
        if (chunkTitleTokens)
          return tokens.size >= 3 ? overlap(tokens, chunkTitleTokens) / tokens.size : 0
        return overlap(tokens, inputTitle!) / Math.max(tokens.size, inputTitle!.size)
      }),
    )

    const year = yearOf(item)
    const yearScore =
      inputYears.length === 0
        ? null
        : year === undefined
          ? 0
          : inputYears.includes(year)
            ? 1
            : inputYears.some((y) => Math.abs(y - year) === 1)
              ? 0.5
              : 0

    // In a citation line the candidate's own title words must not count as
    // author or venue evidence: a family name like "Hall" or a venue word
    // like "Health" would otherwise "agree" by appearing in the title.
    const ownTitleWords = new Set(
      normalizeTitle(subtitle ? `${title} ${subtitle}` : title).split(' '),
    )
    const outsideTitle = (tokens: Set<string> | null) =>
      tokens && new Set([...tokens].filter((token) => !ownTitleWords.has(token)))
    const lineNames = outsideTitle(chunkNameTokens)
    const lineVenue = outsideTitle(chunkVenueTokens)

    const first = item.author?.[0]
    const family = new Set(nameTokens(first?.family ?? first?.name ?? ''))
    const against = lineNames ?? inputFirstAuthor
    const authorScore = !against ? null : [...family].some((token) => against.has(token)) ? 1 : 0

    const venues = [
      item['container-title']?.[0],
      item['short-container-title']?.[0],
      item.event?.name,
    ].filter((name): name is string => Boolean(name))
    let venueScore: number | null = null
    if (lineVenue || inputVenue) {
      venueScore = venues.some((name) => {
        const tokens = venueTokens(name)
        if (tokens.size === 0) return false
        if (lineVenue) return overlap(tokens, lineVenue) / tokens.size >= 0.6
        const smaller = Math.min(tokens.size, inputVenue!.size)
        return smaller > 0 && overlap(tokens, inputVenue!) / smaller >= 0.6
      })
        ? 1
        : 0
      const candidateVenueText = venues.join(' ').toLowerCase()
      const trackMismatch = TRACK_QUALIFIERS.some(
        (qualifier) =>
          candidateVenueText.includes(qualifier) !== inputVenueText.includes(qualifier),
      )
      if (trackMismatch) venueScore = 0
    }

    const scores = [titleSimilarity, yearScore, authorScore, venueScore].filter(
      (score): score is number => score !== null,
    )
    const support = [
      titleSimilarity >= TITLE_AGREEMENT ? 'title' : null,
      // An off-by-one year lifts the similarity but is not agreement.
      yearScore === 1 ? 'year' : null,
      authorScore === 1 ? 'author' : null,
      venueScore === 1 ? 'venue' : null,
    ].filter((field): field is string => field !== null)

    let blocked: string | undefined
    const isPreprint = item.type === 'posted-content' || PREPRINT_VENUE.test(venues.join(' '))
    if (item.type && NON_WORK_TYPES.has(item.type)) blocked = `not a work (${item.type})`
    else if (isPreprint && !PREPRINT_VENUE.test(inputVenueText)) {
      // The input names a real venue (or none), the hit is a preprint copy.
      // It may well be the same work, but it is not the version of record:
      // a person picks, ingestion doesn't.
      blocked = 'preprint of a work cited from another venue'
    }

    return [
      {
        doi: normalizeDoi(item.DOI),
        title: subtitle ? `${title}: ${subtitle}` : title,
        year,
        type: item.type,
        score: item.score,
        normalizedScore: query.length > 0 ? item.score / query.length : 0,
        similarity: scores.reduce((sum, score) => sum + score, 0) / scores.length,
        support,
        blocked,
      },
    ]
  })
}

/**
 * Decides one search. Pure, so scripts/ingestion/verify-fixtures.ts runs it
 * on recorded responses.
 */
export function decideCrossrefSearch(
  input: BibliographicInput,
  query: string,
  items: unknown[],
): SearchDecision {
  const scored = scoreCandidates(input, query, items)
  if (scored.length === 0) return { status: 'none', candidates: [] }

  // SBMV candidate selection: the top hit plus anything scoring well for the
  // query's length (Crossref's raw score grows with query length).
  const selected = scored.filter(
    (candidate, index) => index === 0 || candidate.normalizedScore >= SELECT_NORMALIZED_SCORE,
  )
  const passing = selected.filter(
    (candidate) =>
      !candidate.blocked &&
      candidate.support.includes('title') &&
      candidate.support.length >= MIN_SUPPORT &&
      candidate.similarity >= ACCEPT_SIMILARITY,
  )
  const ranked = [...selected].sort((a, b) => b.similarity - a.similarity || b.score - a.score)
  const candidates = ranked.slice(0, REVIEW_CANDIDATES)

  // Exactly one passing record. Two (a journal that deposited an article
  // twice, a paper and its abstract) is a choice for a person.
  if (passing.length === 1) return { status: 'accepted', doi: passing[0].doi, candidates }
  return { status: 'review', candidates }
}

export async function searchCrossrefBibliographic(query: string): Promise<unknown[]> {
  const json = await fetchJsonWithRetry(
    crossrefUrl('/works', { 'query.bibliographic': query, rows: String(ROWS) }),
    { headers: defaultHeaders() },
  )
  return (json as { message?: { items?: unknown[] } } | null)?.message?.items ?? []
}

export async function resolveCrossrefSearch(input: BibliographicInput): Promise<SearchDecision> {
  const query = bibliographicQuery(input)
  if (!query) return { status: 'none', candidates: [] }
  return decideCrossrefSearch(input, query, await searchCrossrefBibliographic(query))
}

/** The Review Item payload for a search that wasn't auto-applied. */
export function searchReviewData(decision: SearchDecision): Record<string, unknown> | undefined {
  if (decision.candidates.length === 0) return undefined
  return {
    crossrefCandidates: decision.candidates.map((candidate) => ({
      doi: candidate.doi,
      title: candidate.title,
      year: candidate.year ?? null,
      similarity: Number(candidate.similarity.toFixed(2)),
      support: candidate.support,
      blocked: candidate.blocked ?? null,
    })),
  }
}
