/**
 * The shared vocabulary for news: the entry shape, one press ink and one
 * printed composition per kind of activity, and the date formatting.
 *
 * It sits outside the components so the archive (a client component, because
 * it filters) and the entry page (a server component) can both read it without
 * the page pulling the feed's client bundle in behind it.
 */
import type { RisoVariant } from '@/components/dial/riso'

export type NewsType = 'academic' | 'event' | 'community'

export interface NewsEntry {
  /** The entry's own page: `/news/<slug>`. */
  slug: string
  type: NewsType
  title: string
  /** ISO date string: "YYYY-MM-DD", or "YYYY-MM" / "YYYY" when that is all the source gives. */
  date: string
  /** How much of `date` is known; defaults to "day". */
  datePrecision?: 'day' | 'month' | 'year'
  description: string
  photo?: string
  /** An external record of the same thing — an announcement, a programme. */
  url?: string
}

export const TYPE_LABELS: Record<NewsType, string> = {
  academic: 'Academic',
  event: 'Event',
  community: 'Community',
}

/** One press ink per kind of activity, so the archive reads at a glance. */
export const TYPE_INK: Record<NewsType, string> = {
  academic: 'text-ink-blue',
  event: 'text-ink-violet',
  community: 'text-brand',
}

/** The same inks as CSS values, for a page that sets `--header-ink`. */
export const NEWS_INK_VAR: Record<NewsType, string> = {
  academic: 'var(--ink-blue)',
  event: 'var(--ink-violet)',
  community: 'var(--brand)',
}

/** One composition per kind, so three entry pages are not one template. */
export const NEWS_ART: Record<NewsType, RisoVariant> = {
  academic: 'strata',
  event: 'signal',
  community: 'bloom',
}

export function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) > new Date()
}

export function getYear(dateStr: string): number {
  return new Date(dateStr).getUTCFullYear()
}

// Dates are formatted in UTC so a year- or month-only ISO string never shifts
// into the previous day/month in western time zones.
export function formatFull(dateStr: string, precision: NewsEntry['datePrecision'] = 'day'): string {
  if (precision === 'year') return String(getYear(dateStr))
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    ...(precision === 'day' ? { day: 'numeric' as const } : {}),
    year: 'numeric',
    timeZone: 'UTC',
  })
}

/** Date without its year, for rows already grouped under a year heading. */
export function formatInYear(
  dateStr: string,
  precision: NewsEntry['datePrecision'] = 'day',
): string {
  if (precision === 'year') return 'Date not recorded'
  return new Date(dateStr).toLocaleDateString('en-US', {
    month: 'long',
    ...(precision === 'day' ? { day: 'numeric' as const } : {}),
    timeZone: 'UTC',
  })
}
