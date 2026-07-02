export { formatSlug as slugify } from '@/fields/slug/formatSlug'

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
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
