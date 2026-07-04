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
