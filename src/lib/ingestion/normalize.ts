export { formatSlug as slugify } from '@/fields/slug/formatSlug'

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Strips the "https://orcid.org/" prefix ORCID/OpenAlex/Crossref all wrap the bare ID in. */
export function normalizeOrcid(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.replace(/^https?:\/\/orcid\.org\//i, '').trim()
  return trimmed || undefined
}

/**
 * Lowercases a DOI before any uniqueness check. `Publications.doi` is
 * `unique: true` with a case-insensitive format validator, but nothing
 * normalizes case before the check — "10.1145/ABC" and "10.1145/abc" would
 * otherwise be treated as different values by Mongo's case-sensitive index.
 */
export function normalizeDoi(raw: string): string {
  return raw
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .trim()
    .toLowerCase()
}

export function splitCommaList(value?: string): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * DIAL's grant dates are quoted year-only strings (e.g. "2019"). Convert to
 * an ISO date so they fit the Grants collection's `date` fields.
 */
export function yearToDate(year: string | number, endOfYear = false): string {
  const y = typeof year === 'string' ? parseInt(year, 10) : year
  return endOfYear
    ? new Date(Date.UTC(y, 11, 31)).toISOString()
    : new Date(Date.UTC(y, 0, 1)).toISOString()
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
}

/** One pass of HTML entity decoding — named (common subset) and numeric. Unknown names are left as-is. */
function decodeEntitiesOnce(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match
  })
}

/**
 * Cleans a title / venue name / abstract from Crossref or OpenAlex into plain
 * text. Publisher metadata is sometimes escaped more than once (`&amp;amp;`,
 * `&lt;sub&gt;`), so decoding repeats until the string stops changing —
 * bounded at 3 passes so a pathological input cannot loop. Tags are stripped
 * only after decoding, because an escaped `&lt;p&gt;` only becomes a tag once
 * decoded.
 */
export function cleanText(raw: string): string {
  let text = raw
  for (let pass = 0; pass < 3; pass++) {
    const decoded = decodeEntitiesOnce(text)
    if (decoded === text) break
    text = decoded
  }
  return text
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Key for exact venue matching (a Safe Match for venues): two strings match
 * only if they are identical after this deterministic normalisation. Never
 * used for similarity — there is no fuzzy step anywhere in venue matching.
 */
export function normalizeVenueName(raw: string): string {
  return (
    cleanText(raw) // Crossref container-titles carry escaped entities ("Information &amp; Communication")
      .toLowerCase()
      // "Information & Communication" and "Information and Communication" are the same venue.
      .replace(/&/g, ' and ')
      // Punctuation varies across years and sources ("SIGCAS/SIGCHI", "Electronics, and Vision (ICIEV)").
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      // Per-edition years ("the 2023 CHI Conference") name one edition, not a different venue.
      .replace(/\b\d{4}\b/g, ' ')
      // Numeric edition ordinals ("13th International Conference ...") — word ordinals are out of scope.
      .replace(/\b\d+(st|nd|rd|th)\b/g, ' ')
      // Crossref prefixes some editions with "Proceedings of the" and not others.
      .replace(/\bproceedings\s+of(\s+the)?\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}
