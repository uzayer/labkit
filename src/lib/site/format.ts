/**
 * Labels and formatting the site's pages share. Plain functions over stored
 * values; relabel freely, but the keys are stored select values (ADR-0002) and
 * never change.
 */
import { TEAM_ROLES } from '@labkit/core'
import { PUBLICATION_TYPES } from '@labkit/core/publication-types'

import type { Award, Grant, News, Publication, Team } from '@/payload-types'

export const ROLE_LABELS: Record<string, string> = Object.fromEntries(
  TEAM_ROLES.map((role) => [role.value, role.label]),
)

const PUBLICATION_TYPE_LABELS: Record<string, string> = Object.fromEntries(
  PUBLICATION_TYPES.map((type) => [type.value, type.label]),
)

export const publicationTypeLabel = (type: Publication['type']) =>
  type ? (PUBLICATION_TYPE_LABELS[type] ?? null) : null

/** Only a Publication that isn't out yet says so; `published` is the default state. */
export const PUBLICATION_STATUS_LABELS: Partial<Record<Publication['status'], string>> = {
  'accepted-in-press': 'In press',
  submitted: 'Submitted',
  preprint: 'Preprint',
}

export const NEWS_TYPE_LABELS: Record<News['type'], string> = {
  academic: 'Academic',
  event: 'Event',
  community: 'Community',
}

export const AWARD_CATEGORY_LABELS: Record<NonNullable<Award['category']>, string> = {
  'best-paper': 'Best paper',
  'honorable-mention': 'Honorable mention',
  'best-presentation': 'Best presentation',
  'best-demo': 'Best demo',
  'best-poster': 'Best poster',
  impact: 'Impact',
  'research-grant': 'Research grant',
  scholarship: 'Scholarship',
  recognition: 'Recognition',
  fellowship: 'Fellowship',
  competition: 'Competition',
  other: 'Award',
}

export const GRANT_STATUS_LABELS: Record<NonNullable<Grant['status']>, string> = {
  active: 'Active',
  pending: 'Pending',
  completed: 'Completed',
}

export const INVESTIGATOR_ROLE_LABELS: Record<string, string> = {
  pi: 'PI',
  'co-pi': 'Co-PI',
  collaborator: 'Collaborator',
  supported: 'Supported',
}

export const teamMemberName = (
  member: Pick<Team, 'name' | 'firstName' | 'middleName' | 'lastName'>,
) => member.name || [member.firstName, member.middleName, member.lastName].filter(Boolean).join(' ')

/**
 * A record's URL segment: its slug, or its id where it has none. Records made
 * outside the admin (ingestion, scripts) can be saved without a slug: Team
 * slugs come from `name`, which a hook fills in after the slug is formatted.
 */
export const slugOf = (doc: { slug?: string | null; id: string }) => doc.slug || doc.id

const year = (iso: string) => new Date(iso).getUTCFullYear()

/**
 * A News Item's date, to the precision it is known (ADR-0002): never a day
 * the source didn't give. Formatted in UTC, so a year- or month-only date
 * never shifts into the previous month west of Greenwich.
 */
export function formatNewsDate(item: Pick<News, 'date' | 'datePrecision'>): string {
  if (item.datePrecision === 'year') return String(year(item.date))
  return new Date(item.date).toLocaleDateString('en-US', {
    month: 'long',
    ...(item.datePrecision === 'day' ? { day: 'numeric' as const } : {}),
    year: 'numeric',
    timeZone: 'UTC',
  })
}

export const newsYear = (item: Pick<News, 'date'>) => year(item.date)

/** A day the Lab picked in the admin (a recruitment deadline), in UTC. */
export const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

/** "2021–2024", "2023–present" for ongoing work, or a single year. */
export function yearRange(
  start: string | null | undefined,
  end: string | null | undefined,
  ongoing = false,
): string | null {
  const from = start ? year(start) : null
  const to = end ? year(end) : null
  if (from && to) return from === to ? String(from) : `${from}–${to}`
  if (from) return ongoing ? `${from}–present` : String(from)
  if (to) return String(to)
  return null
}

/**
 * A Grant's amount: the exact value in its currency when recorded, else the
 * free-text `amountLabel` (labels next to values, ADR-0002), else nothing.
 */
export function formatAmount(
  grant: Pick<Grant, 'amountValue' | 'amountCurrency' | 'amountLabel'>,
): string | null {
  if (grant.amountValue != null && grant.amountCurrency) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: grant.amountCurrency,
      maximumFractionDigits: 0,
    }).format(grant.amountValue)
  }
  return grant.amountLabel || null
}

export const plural = (n: number, word: string, many = `${word}s`) =>
  `${n} ${n === 1 ? word : many}`

/** Pages and sections ordered by year, newest first. */
export function groupByYear<T>(items: T[], yearOf: (item: T) => number) {
  const groups = new Map<number, T[]>()
  for (const item of items) {
    const y = yearOf(item)
    groups.set(y, [...(groups.get(y) ?? []), item])
  }
  return [...groups.entries()].sort(([a], [b]) => b - a).map(([year, items]) => ({ year, items }))
}

/**
 * Where LabInfo's recruitment window stands today, or null when none is
 * announced. A day-only window: it opens at the start of `opens` and closes at
 * the end of `closes`, in UTC.
 */
export function recruitmentWindow(
  recruitment: { opens?: string | null; closes?: string | null } | null | undefined,
  now = new Date(),
): { state: 'upcoming' | 'open' | 'closed'; opens: string; closes: string } | null {
  if (!recruitment?.opens || !recruitment.closes) return null
  const day = (iso: string) => iso.slice(0, 10)
  const today = now.toISOString().slice(0, 10)
  const { opens, closes } = recruitment
  const state = today < day(opens) ? 'upcoming' : today > day(closes) ? 'closed' : 'open'
  return { state, opens, closes }
}
