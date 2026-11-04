'use client'

import { useMemo } from 'react'
import { BookOpen, Calendar, FileStack, LockOpen, Search, Shapes, Users, X } from 'lucide-react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { SegmentedControl, type SegmentedOption } from '@/components/dial/segmented-control'
import { cn } from '@/lib/utils'

/**
 * The publication list's filter model, and the bar that drives it.
 *
 * Two mechanisms live here and they are deliberately kept apart in the UI:
 * `view` changes how the list is *arranged* (it is a sort, not a filter), and
 * everything else changes *which papers are in it*. They used to sit side by
 * side as identical-looking controls, which read as six filters that do two
 * different things.
 *
 * Everything narrows through one faceted model, so a venue can be grouped by
 * *or* filtered to, and the counts shown against every option are computed the
 * way faceted search expects: each facet's counts ignore that facet's own
 * selection, so a count never reads zero for something you can plainly see.
 */

export type ViewMode = 'all' | 'venue' | 'theme' | 'type'

/**
 * The minimum a record needs in order to be filtered. `Publication` satisfies
 * this structurally, which is what keeps this module free of an import back
 * into `publications1.tsx`.
 */
export interface Filterable {
  id: string
  title: string
  authors: string
  venue?: string | null
  themes?: string[] | null
  type?: string | null
  isOpenAccess?: boolean | null
  isCollaboration?: boolean | null
}

/** A publication with its year, which the year facet needs and the row lacks. */
export interface Entry<P extends Filterable = Filterable> {
  pub: P
  year: number
}

export interface PubFilters {
  view: ViewMode
  q: string
  years: number[]
  venues: string[]
  themes: string[]
  types: string[]
  openAccess: boolean
  collaboration: boolean
}

export const NO_FILTERS: PubFilters = {
  view: 'all',
  q: '',
  years: [],
  venues: [],
  themes: [],
  types: [],
  openAccess: false,
  collaboration: false,
}

export const TYPE_LABELS: Record<string, string> = {
  conference: 'Conference',
  journal: 'Journal',
  workshop: 'Workshop',
  preprint: 'Preprint',
  'extended-abstract': 'Ext. Abstract',
  'study-protocol': 'Study Protocol',
  'book-chapter': 'Book Chapter',
}

export const TYPE_GROUP_LABELS: Record<string, string> = {
  conference: 'Conference Papers',
  journal: 'Journal Articles',
  workshop: 'Workshop Papers',
  preprint: 'Preprints',
  'extended-abstract': 'Extended Abstracts',
  'study-protocol': 'Study Protocols',
  'book-chapter': 'Book Chapters',
}

// ─── Model ───────────────────────────────────────────────────────────────────

type Facet = 'q' | 'years' | 'venues' | 'themes' | 'types' | 'openAccess' | 'collaboration'

const FACETS: Facet[] = ['q', 'years', 'venues', 'themes', 'types', 'openAccess', 'collaboration']

/** Value lists behave the same everywhere: click to add, click again to drop. */
export function toggleIn<T>(list: T[], value: T): T[] {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

export function isFiltered(f: PubFilters): boolean {
  return (
    f.q.trim() !== '' ||
    f.years.length > 0 ||
    f.venues.length > 0 ||
    f.themes.length > 0 ||
    f.types.length > 0 ||
    f.openAccess ||
    f.collaboration
  )
}

// Built once per publication and kept on the record itself: the search runs on
// every keystroke over the whole corpus, and re-lowercasing 250 abstracts of
// author names each time is the one thing here that would actually be felt.
const searchIndex = new WeakMap<object, string>()

function haystack(entry: Entry): string {
  let text = searchIndex.get(entry.pub)
  if (text === undefined) {
    text = [
      entry.pub.title,
      entry.pub.authors,
      entry.pub.venue ?? '',
      (entry.pub.themes ?? []).join(' '),
      String(entry.year),
    ]
      .join(' ')
      .toLowerCase()
    searchIndex.set(entry.pub, text)
  }
  return text
}

const PASS = () => true

const PREDICATES: Record<Facet, (f: PubFilters) => (e: Entry) => boolean> = {
  q: (f) => {
    const needle = f.q.trim().toLowerCase()
    return needle ? (e) => haystack(e).includes(needle) : PASS
  },
  years: (f) => (f.years.length ? (e) => f.years.includes(e.year) : PASS),
  venues: (f) =>
    f.venues.length ? (e) => Boolean(e.pub.venue) && f.venues.includes(e.pub.venue!) : PASS,
  themes: (f) =>
    f.themes.length ? (e) => (e.pub.themes ?? []).some((t) => f.themes.includes(t)) : PASS,
  types: (f) =>
    f.types.length ? (e) => Boolean(e.pub.type) && f.types.includes(e.pub.type!) : PASS,
  openAccess: (f) => (f.openAccess ? (e) => Boolean(e.pub.isOpenAccess) : PASS),
  collaboration: (f) => (f.collaboration ? (e) => Boolean(e.pub.isCollaboration) : PASS),
}

/**
 * `except` leaves one facet out of the pass. That is what makes the counts
 * honest: the number beside "CHI" is how many papers you would get by picking
 * CHI *given everything else*, not how many survive the venue filter you
 * already have.
 */
export function applyFilters<P extends Filterable>(
  entries: Entry<P>[],
  f: PubFilters,
  except?: Facet,
): Entry<P>[] {
  const predicates = FACETS.filter((k) => k !== except).map((k) => PREDICATES[k](f))
  return entries.filter((e) => predicates.every((p) => p(e)))
}

export interface FacetCounts {
  years: Map<number, number>
  venues: Map<string, number>
  themes: Map<string, number>
  types: Map<string, number>
  openAccess: number
  collaboration: number
}

function tally<K>(entries: Entry[], key: (e: Entry) => K[]): Map<K, number> {
  const counts = new Map<K, number>()
  for (const e of entries) {
    for (const k of key(e)) counts.set(k, (counts.get(k) ?? 0) + 1)
  }
  return counts
}

export function facetCounts<P extends Filterable>(entries: Entry<P>[], f: PubFilters): FacetCounts {
  return {
    years: tally(applyFilters(entries, f, 'years'), (e) => [e.year]),
    venues: tally(applyFilters(entries, f, 'venues'), (e) => (e.pub.venue ? [e.pub.venue] : [])),
    themes: tally(applyFilters(entries, f, 'themes'), (e) => e.pub.themes ?? []),
    types: tally(applyFilters(entries, f, 'types'), (e) => (e.pub.type ? [e.pub.type] : [])),
    openAccess: applyFilters(entries, f, 'openAccess').filter((e) => e.pub.isOpenAccess).length,
    collaboration: applyFilters(entries, f, 'collaboration').filter((e) => e.pub.isCollaboration)
      .length,
  }
}

/** How many distinct groups a given arrangement would produce, after filtering. */
export function groupCounts<P extends Filterable>(visible: Entry<P>[]): Record<ViewMode, number> {
  const distinct = (key: (e: Entry<P>) => string[]) => new Set(visible.flatMap(key)).size
  return {
    all: distinct((e) => [String(e.year)]),
    venue: distinct((e) => [e.pub.venue ?? 'Other']),
    theme: distinct((e) => (e.pub.themes?.length ? e.pub.themes : ['Uncategorized'])),
    type: distinct((e) => [e.pub.type ?? 'other']),
  }
}

/**
 * The four arrangements, as the segmented control takes them. Exported because
 * the sticky bar shows the same control and the two must not drift apart.
 */
export function viewOptions(counts: Record<ViewMode, number>): SegmentedOption<ViewMode>[] {
  return [
    { value: 'all', label: 'Year', count: counts.all, icon: Calendar },
    { value: 'venue', label: 'Venue', count: counts.venue, icon: BookOpen },
    { value: 'theme', label: 'Theme', count: counts.theme, icon: Shapes },
    { value: 'type', label: 'Type', count: counts.type, icon: FileStack },
  ]
}

export interface Chip {
  id: string
  label: string
  next: PubFilters
}

/** One removable chip per active narrowing, in the order they read best. */
export function activeChips(f: PubFilters): Chip[] {
  const chips: Chip[] = []
  if (f.q.trim()) chips.push({ id: 'q', label: `“${f.q.trim()}”`, next: { ...f, q: '' } })
  for (const y of f.years)
    chips.push({ id: `year-${y}`, label: String(y), next: { ...f, years: toggleIn(f.years, y) } })
  for (const v of f.venues)
    chips.push({ id: `venue-${v}`, label: v, next: { ...f, venues: toggleIn(f.venues, v) } })
  for (const t of f.themes)
    chips.push({ id: `theme-${t}`, label: t, next: { ...f, themes: toggleIn(f.themes, t) } })
  for (const t of f.types)
    chips.push({
      id: `type-${t}`,
      label: TYPE_LABELS[t] ?? t,
      next: { ...f, types: toggleIn(f.types, t) },
    })
  if (f.openAccess)
    chips.push({ id: 'open', label: 'Open access', next: { ...f, openAccess: false } })
  if (f.collaboration)
    chips.push({ id: 'collab', label: 'Collaborations', next: { ...f, collaboration: false } })
  return chips
}

// ─── Bar ─────────────────────────────────────────────────────────────────────

function SearchField({
  value,
  onChange,
  resultCount,
}: {
  value: string
  onChange: (v: string) => void
  resultCount: number
}) {
  return (
    <div className="relative flex w-full items-center">
      <Search
        aria-hidden
        className="pointer-events-none absolute left-3.5 size-4 text-muted-foreground"
      />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search titles, authors, venues…"
        aria-label="Search publications"
        // The browser's own search affordance duplicates the clear button.
        className="ease-snappy h-10 w-full rounded-full border border-border bg-transparent pr-24 pl-10 text-sm transition-colors duration-150 outline-none placeholder:text-muted-foreground focus:border-foreground/40 [&::-webkit-search-cancel-button]:hidden"
      />
      <div className="absolute right-3 flex items-center gap-2">
        {value.trim() && (
          <>
            <span className="ease-snappy text-xs text-muted-foreground tabular-nums transition-opacity duration-150 starting:opacity-0">
              {resultCount}
            </span>
            <button
              type="button"
              onClick={() => onChange('')}
              aria-label="Clear search"
              className="ease-snappy grid size-5 place-items-center rounded-full text-muted-foreground transition-[color,background-color,opacity,scale] duration-150 hover:bg-muted hover:text-foreground active:scale-90 starting:scale-75 starting:opacity-0"
            >
              <X className="size-3.5" />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

/**
 * The years, as a histogram you can click. Doubles as the shape of the Lab's
 * output over time, which is a thing a visitor wants to see anyway — a plain
 * row of year pills would take the same space and say nothing.
 */
function YearStrip({
  years,
  counts,
  selected,
  onToggle,
}: {
  years: number[]
  counts: Map<number, number>
  selected: number[]
  onToggle: (year: number) => void
}) {
  const reduceMotion = useReducedMotion()
  const max = Math.max(1, ...years.map((y) => counts.get(y) ?? 0))
  // Every fifth year, plus the ends — a label under all seventeen is a smear.
  const labelled = (year: number, i: number) => i === 0 || i === years.length - 1 || year % 5 === 0

  return (
    <div className="flex items-end gap-px" role="group" aria-label="Filter by year">
      {years.map((year, i) => {
        const count = counts.get(year) ?? 0
        const on = selected.includes(year)
        return (
          <button
            key={year}
            type="button"
            aria-pressed={on}
            disabled={count === 0 && !on}
            onClick={() => onToggle(year)}
            className="group/year flex flex-1 cursor-pointer flex-col items-center gap-1 disabled:cursor-default"
            title={`${year} · ${count}`}
          >
            {/* The full year is the name. The two-digit label under the bar
                abbreviates it (and is invisible for most years), so it is
                kept out of the name rather than read as "12 2012". */}
            <span className="sr-only">
              {year}, {count} publications
            </span>
            <span className="flex h-8 w-full items-end">
              <motion.span
                className={cn(
                  'ease-snappy w-full rounded-t-[2px] transition-colors duration-150',
                  on
                    ? 'bg-brand'
                    : count === 0
                      ? 'bg-foreground/8'
                      : 'bg-foreground/20 group-hover/year:bg-foreground/45',
                )}
                initial={false}
                animate={{ height: `${Math.max(count === 0 ? 2 : 12, (count / max) * 100)}%` }}
                transition={
                  reduceMotion ? { duration: 0 } : { duration: 0.35, ease: [0.23, 1, 0.32, 1] }
                }
              />
            </span>
            <span
              aria-hidden
              className={cn(
                'text-[0.65rem] tabular-nums transition-colors duration-150',
                on ? 'text-foreground' : 'text-muted-foreground',
                labelled(year, i) || on ? 'opacity-100' : 'opacity-0',
              )}
            >
              {String(year).slice(2)}
            </span>
          </button>
        )
      })}
    </div>
  )
}

function FacetToggle({
  icon: Icon,
  label,
  on,
  count,
  onToggle,
}: {
  icon: typeof LockOpen
  label: string
  on: boolean
  count: number
  onToggle: () => void
}) {
  // A facet that would empty the list is shown, not hidden: its absence is
  // information too ("this lab has no external collaborations on file").
  const dead = count === 0 && !on
  return (
    <button
      type="button"
      aria-pressed={on}
      disabled={dead}
      onClick={onToggle}
      className={cn(
        'ease-snappy inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-sm transition-colors duration-150',
        on
          ? 'border-brand bg-brand/10 text-foreground'
          : dead
            ? 'border-border/60 text-muted-foreground/40'
            : 'border-border text-muted-foreground hover:border-foreground/40 hover:text-foreground',
      )}
    >
      <Icon className={cn('size-3.5', on && 'text-brand')} aria-hidden />
      {label}
      {/* Full strength: at 60% the count fell below 4.5:1 in both themes. */}
      <span className="tabular-nums">{count}</span>
    </button>
  )
}

function ChipRow({
  chips,
  onApply,
  onClear,
  showing,
  total,
}: {
  chips: Chip[]
  onApply: (next: PubFilters) => void
  onClear: () => void
  showing: number
  total: number
}) {
  const reduceMotion = useReducedMotion()
  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <AnimatePresence initial={false} mode="popLayout">
        {chips.map((chip) => (
          <motion.button
            key={chip.id}
            type="button"
            layout={!reduceMotion}
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            onClick={() => onApply(chip.next)}
            className="group/chip ease-snappy inline-flex max-w-[16rem] items-center gap-1.5 rounded-full border border-foreground/25 bg-foreground/5 py-0.5 pr-1.5 pl-2.5 transition-colors duration-150 hover:border-foreground/50"
          >
            <span className="truncate">{chip.label}</span>
            <X
              aria-hidden
              className="size-3.5 shrink-0 text-muted-foreground transition-colors duration-150 group-hover/chip:text-foreground"
            />
            <span className="sr-only">Remove filter</span>
          </motion.button>
        ))}
      </AnimatePresence>
      <span className="text-muted-foreground tabular-nums">
        {showing} of {total}
      </span>
      {chips.length > 1 && (
        <button
          type="button"
          onClick={onClear}
          className="text-muted-foreground underline decoration-border underline-offset-4 transition-colors duration-150 hover:text-foreground hover:decoration-current"
        >
          Clear all
        </button>
      )}
    </div>
  )
}

export function PublicationFilterBar<P extends Filterable>({
  entries,
  filters,
  onChange,
  allYears,
}: {
  entries: Entry<P>[]
  filters: PubFilters
  onChange: (next: PubFilters) => void
  /** Every year in the corpus, ascending — the strip's x-axis stays fixed. */
  allYears: number[]
}) {
  const counts = useMemo(() => facetCounts(entries, filters), [entries, filters])
  const visible = useMemo(() => applyFilters(entries, filters), [entries, filters])
  const groups = useMemo(() => groupCounts(visible), [visible])
  const chips = activeChips(filters)

  return (
    <div className="flex flex-col gap-4 border-b border-border pb-4">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:gap-6">
        <div className="sm:flex-1">
          <SearchField
            value={filters.q}
            onChange={(q) => onChange({ ...filters, q })}
            resultCount={visible.length}
          />
        </div>
        {allYears.length > 1 && (
          <div className="sm:w-2/5 sm:max-w-xs">
            <YearStrip
              years={allYears}
              counts={counts.years}
              selected={filters.years}
              onToggle={(year) => onChange({ ...filters, years: toggleIn(filters.years, year) })}
            />
          </div>
        )}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <SegmentedControl
          label="Group publications"
          prefix="By"
          options={viewOptions(groups)}
          value={filters.view}
          onChange={(view) => onChange({ ...filters, view })}
        />
        <div className="flex flex-wrap gap-2">
          <FacetToggle
            icon={LockOpen}
            label="Open access"
            on={filters.openAccess}
            count={counts.openAccess}
            onToggle={() => onChange({ ...filters, openAccess: !filters.openAccess })}
          />
          <FacetToggle
            icon={Users}
            label="Collaborations"
            on={filters.collaboration}
            count={counts.collaboration}
            onToggle={() => onChange({ ...filters, collaboration: !filters.collaboration })}
          />
        </div>
      </div>

      {chips.length > 0 && (
        <ChipRow
          chips={chips}
          onApply={onChange}
          onClear={() => onChange({ ...NO_FILTERS, view: filters.view })}
          showing={visible.length}
          total={entries.length}
        />
      )}
    </div>
  )
}
