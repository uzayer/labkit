import { normalizeTitle } from './normalize'

function trigrams(value: string): Set<string> {
  const grams = new Set<string>()
  for (let i = 0; i < value.length - 2; i++) {
    grams.add(value.slice(i, i + 3))
  }
  return grams
}

/** Sørensen–Dice coefficient over character trigrams — cheap, no dependency. */
export function diceCoefficient(a: string, b: string): number {
  const gramsA = trigrams(a)
  const gramsB = trigrams(b)
  if (gramsA.size === 0 || gramsB.size === 0) return 0

  let intersection = 0
  for (const gram of gramsA) {
    if (gramsB.has(gram)) intersection++
  }
  return (2 * intersection) / (gramsA.size + gramsB.size)
}

export interface TitleCandidate {
  id: string
  title: string
}

export interface TitleMatchResult {
  candidate: TitleCandidate | null
  method: 'exact' | 'prefix' | 'fuzzy' | 'none'
  score?: number
}

const FUZZY_THRESHOLD = 0.85

/**
 * Matches a (possibly truncated or paraphrased) title string against a list
 * of real titles. DIAL's source data sometimes truncates titles at the first
 * colon (see awards.md `linkedPublication`), so prefix matches count before
 * falling back to trigram similarity. Never returns a low-confidence guess
 * silently — callers should report `method === 'none'` rather than link.
 */
export function matchTitle(query: string, candidates: TitleCandidate[]): TitleMatchResult {
  const normalizedQuery = normalizeTitle(query)

  for (const candidate of candidates) {
    if (normalizeTitle(candidate.title) === normalizedQuery) {
      return { candidate, method: 'exact', score: 1 }
    }
  }

  const prefixMatches = candidates.filter((candidate) => {
    const normalizedCandidate = normalizeTitle(candidate.title)
    return (
      normalizedCandidate.startsWith(normalizedQuery) ||
      normalizedQuery.startsWith(normalizedCandidate)
    )
  })
  if (prefixMatches.length === 1) {
    return { candidate: prefixMatches[0], method: 'prefix', score: 1 }
  }

  let best: TitleCandidate | null = null
  let bestScore = 0
  for (const candidate of candidates) {
    const score = diceCoefficient(normalizedQuery, normalizeTitle(candidate.title))
    if (score > bestScore) {
      bestScore = score
      best = candidate
    }
  }
  if (best && bestScore >= FUZZY_THRESHOLD) {
    return { candidate: best, method: 'fuzzy', score: bestScore }
  }

  return { candidate: null, method: 'none' }
}

export interface NameLookupEntry {
  id: string
  name: string
  shortName?: string
  alternateNames?: string[]
}

/** Resolves a free-text name against name/shortName/alternateNames, case-insensitively. */
export function resolveByName(query: string, entries: NameLookupEntry[]): NameLookupEntry | null {
  const normalizedQuery = query.trim().toLowerCase()
  for (const entry of entries) {
    if (entry.name.trim().toLowerCase() === normalizedQuery) return entry
  }
  for (const entry of entries) {
    if (entry.shortName && entry.shortName.trim().toLowerCase() === normalizedQuery) return entry
  }
  for (const entry of entries) {
    if (entry.alternateNames?.some((alt) => alt.trim().toLowerCase() === normalizedQuery)) {
      return entry
    }
  }
  return null
}
