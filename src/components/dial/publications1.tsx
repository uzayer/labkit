'use client'

import { ArrowUpRight, LockOpen, Users } from 'lucide-react'
import { Fragment, useEffect, useMemo, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/dial/ui/button'
import { Separator } from '@/components/dial/ui/separator'
import { SegmentedControl } from '@/components/dial/segmented-control'
import {
  type Entry,
  NO_FILTERS,
  type PubFilters,
  PublicationFilterBar,
  TYPE_GROUP_LABELS,
  TYPE_LABELS,
  type ViewMode,
  applyFilters,
  groupCounts,
  isFiltered,
  toggleIn,
  viewOptions,
} from '@/components/dial/publication-filters'
import { CiteButton } from '@/components/dial/publication-cite'
import { RosetteMark } from '@/components/dial/marks'
import { PersonFaces, type Person } from '@/components/dial/person-chip'
import { displaySectionTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export type Publication = {
  id: string
  title: string
  /** The publication's own page; rows link their title to it. */
  href?: string | null
  authors: string
  /**
   * The Lab's own people among the authors, in author order. Faces, not a
   * count: the names stay in `authors`, which still carries every author,
   * inside the Lab and out.
   */
  authorFaces?: Person[] | null
  venue?: string | null
  /**
   * The venue written out, where the short form is an acronym. The list prints
   * the acronym — "ACM CHI Conference on Human Factors in Computing Systems" on
   * every row would bury the titles — and carries this as the expansion.
   */
  venueFull?: string | null
  award?: string | null
  pdfLink?: string | null
  projectLink?: string | null
  doi?: string | null
  themes?: string[] | null
  isOpenAccess?: boolean | null
  isCollaboration?: boolean | null
  type?:
    | 'conference'
    | 'journal'
    | 'workshop'
    | 'preprint'
    | 'extended-abstract'
    | 'study-protocol'
    | 'book-chapter'
    | null
}

export type PublicationYear = {
  year: number
  publications: Publication[]
}

/** Names to emphasise in author lists (the Lab's PI); supplied by the page. */
function AuthorList({ authors, highlight = [] }: { authors: string; highlight?: string[] }) {
  const parts = authors.split(', ')
  return (
    <>
      {parts.map((name, i) => {
        const bold = highlight.includes(name.trim())
        return (
          <Fragment key={i}>
            {i > 0 && ', '}
            {bold ? <strong className="font-semibold text-foreground">{name}</strong> : name}
          </Fragment>
        )
      })}
    </>
  )
}

/**
 * Where else the paper lives: its PDF, its DOI, its project. These leave the
 * site, so they are set as links — words with an outbound arrow. Cite follows
 * them on the same line, with no arrow, because it stays.
 */
function PubLinks({ pub }: { pub: Publication }) {
  const links = [
    pub.pdfLink && { label: 'PDF', href: pub.pdfLink },
    pub.doi && { label: 'DOI', href: `https://doi.org/${pub.doi}` },
    pub.projectLink && { label: 'Project', href: pub.projectLink },
  ].filter((l): l is { label: string; href: string } => Boolean(l))
  if (links.length === 0) return null
  return (
    <ul className="relative z-10 flex flex-wrap items-center gap-x-4 gap-y-1 text-sm">
      {links.map((l) => (
        <li key={l.label}>
          <a
            href={l.href}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 rounded-sm font-medium text-foreground decoration-foreground/40 underline-offset-4 outline-none hover:underline focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            {l.label}
            <ArrowUpRight className="size-3.5 text-muted-foreground" aria-hidden />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
        </li>
      ))}
    </ul>
  )
}

/**
 * Marks every occurrence of the active search term in a title, so a hit is
 * visible in place. Colour only — no change of weight or size, which would
 * reflow the title as the query is typed.
 */
function MarkedTitle({ text, term }: { text: string; term?: string }) {
  const needle = term?.trim().toLowerCase()
  if (!needle) return <>{text}</>
  const parts: React.ReactNode[] = []
  const haystack = text.toLowerCase()
  let at = 0
  for (let found = haystack.indexOf(needle); found !== -1; found = haystack.indexOf(needle, at)) {
    if (found > at) parts.push(text.slice(at, found))
    parts.push(
      <mark key={found} className="bg-brand/20 rounded-[2px] text-inherit">
        {text.slice(found, found + needle.length)}
      </mark>,
    )
    at = found + needle.length
  }
  parts.push(text.slice(at))
  return <>{parts}</>
}

/**
 * Short venues (CHI, TOCHI, ACM JCSS) are set in mono, like a stamp; anything
 * longer ("JMIR Preprints", or a venue with no short form, spelt out) is set
 * in the sans, where it wraps like words instead of like a code. The case is
 * the venue's own — forcing capitals turned HCIxB into HCIXB.
 */
const isShortVenue = (venue: string) => venue.length <= 10

/**
 * The venue, as the reader scans for it. `abbr` carries the written-out name
 * into the accessibility tree and onto hover; the dotted rule is the long-
 * standing sign that a word can be expanded.
 */
function VenueName({ pub, className }: { pub: Publication; className?: string }) {
  if (!pub.venue) return null
  const type = cn(
    isShortVenue(pub.venue)
      ? 'font-mono text-[0.8rem] font-medium tracking-[0.06em]'
      : 'text-sm font-medium',
    'text-foreground',
    className,
  )
  return pub.venueFull ? (
    <abbr
      title={pub.venueFull}
      className={cn(
        type,
        'no-underline decoration-border decoration-dotted underline-offset-4 hover:underline',
      )}
    >
      {pub.venue}
    </abbr>
  ) : (
    <span className={type}>{pub.venue}</span>
  )
}

// One publication, as listed everywhere. This is the unit that maps to a
// Payload Publication, so it exists exactly once.
//
// Where it appeared and what kind of paper it is — TOCHI, a journal; ICTD, a
// conference — is what a visitor from the field scans a bibliography for, and
// it used to share one grey line with "Open access" and "Collaboration". So
// the venue now has a place of its own: a ledger column in the row's left
// margin wherever the row has the width (sized by the row's container, not the
// window, so a list in a narrow column falls back cleanly), and a kicker above
// the title where it does not. Down a long list the venues read as one column.
function PublicationRow({
  pub,
  year,
  showYear = false,
  highlightAuthors,
  query,
}: {
  pub: Publication
  year: number
  showYear?: boolean
  highlightAuthors?: string[]
  /** Active search term, marked inside the title so a hit is visible in place. */
  query?: string
}) {
  const typeLabel = pub.type ? (TYPE_LABELS[pub.type] ?? pub.type) : null
  const title = (
    <span className="font-display block max-w-4xl text-xl leading-snug text-pretty md:text-2xl">
      <MarkedTitle text={pub.title} term={query} />
    </span>
  )

  return (
    <div className="@container">
      {/* Hover draws an ink rule down the left margin, beside the whole
          entry, the way a reader brackets the reference they mean. A title
          runs to three lines; a squiggle under every line of every title was
          more ink than the words, and the paper no longer darkens behind a
          row (see "Hover vocabulary" in globals.css). */}
      <div className="group relative py-6 @2xl:grid @2xl:grid-cols-[7rem_minmax(0,1fr)] @2xl:gap-x-8">
        <span
          aria-hidden
          className="bg-ink ease-snappy pointer-events-none absolute inset-y-6 -left-3 w-0.5 origin-top scale-y-0 rounded-full transition-transform duration-150 group-focus-within:scale-y-100 group-hover:scale-y-100 group-hover:duration-200 motion-reduce:transition-none md:-left-5"
        />

        {/* The ledger: venue over type, in the margin. */}
        <div className="hidden flex-col gap-1 pt-1.5 @2xl:flex">
          <VenueName pub={pub} className="leading-tight break-words" />
          {typeLabel && <span className="text-xs text-muted-foreground">{typeLabel}</span>}
        </div>

        <div className="flex min-w-0 flex-col gap-3">
          {/* The same two facts as a kicker, where there is no margin. */}
          {(pub.venue || typeLabel) && (
            <p className="flex flex-wrap items-baseline gap-x-2 text-xs @2xl:hidden">
              <VenueName pub={pub} className="text-xs" />
              {pub.venue && typeLabel && (
                <span aria-hidden className="text-muted-foreground/60">
                  ·
                </span>
              )}
              {typeLabel && <span className="text-muted-foreground">{typeLabel}</span>}
            </p>
          )}

          <div className="flex flex-col gap-2">
            {/* The title is the row's link, stretched over the whole row by a
                pseudo-element so the entry is one target. The action buttons
                and links sit above it on z-10, so a click on PDF or Cite is
                still a click on PDF or Cite. */}
            {pub.href ? (
              <Link
                href={pub.href}
                className="outline-none before:absolute before:inset-0 before:rounded-lg focus-visible:before:ring-3 focus-visible:before:ring-ring/50"
              >
                {title}
              </Link>
            ) : (
              title
            )}
            {/* A div, not a p: the portraits carry their own frame element, which
                is not valid inside a paragraph and breaks hydration there. */}
            <div className="text-sm text-muted-foreground">
              {/* Faces lead the author line where the Lab has people on the paper:
                  a publication list is otherwise a wall of names, and these are
                  the names a visitor is looking for. Set inside the paragraph, so
                  a long author list wraps under them instead of pushing every
                  name onto a line of its own. */}
              {pub.authorFaces && pub.authorFaces.length > 0 && (
                <PersonFaces people={pub.authorFaces} size="sm" className="mr-2 align-middle" />
              )}
              <AuthorList authors={pub.authors} highlight={highlightAuthors} />
              {showYear && <span className="before:mx-2 before:content-['·']">{year}</span>}
            </div>
          </div>

          {/* Secondary facts, then the links out, then Cite: the row's one
              in-page action, last on the line it shares with DOI. An award is
              the one secondary fact that stays loud. */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
              {pub.award && (
                <span className="border-ink/35 bg-ink/8 text-ink inline-flex items-center gap-1.5 rounded-[0.8rem] border py-0.5 pr-2.5 pl-1.5">
                  <RosetteMark className="size-4" />
                  {pub.award}
                </span>
              )}
              {pub.isOpenAccess && (
                <span title="Open Access" className="inline-flex items-center gap-1">
                  <LockOpen className="size-3.5" aria-hidden />
                  Open access
                </span>
              )}
              {pub.isCollaboration && (
                <span title="External Collaboration" className="inline-flex items-center gap-1">
                  <Users className="size-3.5" aria-hidden />
                  Collaboration
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <PubLinks pub={pub} />
              <CiteButton id={pub.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

type Group = {
  /** The facet value this group stands for — what clicking its header filters to. */
  key: string
  label: string
  /** Set in the venue view: the acronym written out, under the heading. */
  sublabel?: string | null
  /** False for the synthetic catch-alls ("Other", "Uncategorized"), which name no facet value. */
  filterable: boolean
  publications: Publication[]
}

/**
 * Layout animation is per-row, so it costs something on a long list. DIAL's
 * real corpus is ~250 papers; below this many the reflow is worth watching,
 * above it the list just crossfades.
 */
const LAYOUT_ANIMATION_LIMIT = 60

function buildGroups(visible: Entry<Publication>[], view: ViewMode): Group[] {
  const map = new Map<string, Group>()
  const add = (
    key: string,
    label: string,
    filterable: boolean,
    pub: Publication,
    sublabel?: string | null,
  ) => {
    const group = map.get(key) ?? { key, label, filterable, sublabel, publications: [] }
    group.publications.push(pub)
    map.set(key, group)
  }

  for (const { pub, year } of visible) {
    if (view === 'all') {
      add(String(year), String(year), true, pub)
    } else if (view === 'venue') {
      if (pub.venue) add(pub.venue, pub.venue, true, pub, pub.venueFull)
      else add('\u0000other', 'Other', false, pub)
    } else if (view === 'theme') {
      if (pub.themes?.length) for (const theme of pub.themes) add(theme, theme, true, pub)
      else add('\u0000uncategorized', 'Uncategorized', false, pub)
    } else {
      if (pub.type) add(pub.type, TYPE_GROUP_LABELS[pub.type] ?? pub.type, true, pub)
      else add('\u0000other', 'Other', false, pub)
    }
  }

  const groups = [...map.values()]
  // Years read newest-first; every other arrangement is alphabetical, with the
  // synthetic catch-all pushed to the bottom where it belongs.
  return groups.sort((a, b) => {
    if (a.filterable !== b.filterable) return a.filterable ? -1 : 1
    if (view === 'all') return Number(b.key) - Number(a.key)
    return a.label.localeCompare(b.label)
  })
}

/** Clicking a group's name narrows the list to it — grouping and filtering, one gesture. */
function withGroupSelected(filters: PubFilters, group: Group): PubFilters {
  switch (filters.view) {
    case 'all':
      return { ...filters, years: toggleIn(filters.years, Number(group.key)) }
    case 'venue':
      return { ...filters, venues: toggleIn(filters.venues, group.key) }
    case 'theme':
      return { ...filters, themes: toggleIn(filters.themes, group.key) }
    case 'type':
      return { ...filters, types: toggleIn(filters.types, group.key) }
  }
}

function groupIsSelected(filters: PubFilters, group: Group): boolean {
  switch (filters.view) {
    case 'all':
      return filters.years.includes(Number(group.key))
    case 'venue':
      return filters.venues.includes(group.key)
    case 'theme':
      return filters.themes.includes(group.key)
    case 'type':
      return filters.types.includes(group.key)
  }
}

// Sticky "you are here" header for the grouped list (after skiper74): tracks
// which group section is under the header's bottom edge.
const ACTIVE_GROUP_LINE = 80 // px — the sticky header's height (h-20)

function useActiveGroup(groupKeys: string) {
  const sectionRefs = useRef(new Map<string, HTMLElement>())
  const [active, setActive] = useState<string | null>(null)

  useEffect(() => {
    const intersecting = new Set<string>()
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const key = (entry.target as HTMLElement).dataset.groupKey!
          if (entry.isIntersecting) intersecting.add(key)
          else intersecting.delete(key)
        }
        setActive(intersecting.values().next().value ?? null)
      },
      {
        rootMargin: `-${ACTIVE_GROUP_LINE}px 0px -${Math.max(window.innerHeight - ACTIVE_GROUP_LINE - 1, 0)}px 0px`,
      },
    )
    for (const el of sectionRefs.current.values()) observer.observe(el)
    return () => observer.disconnect()
  }, [groupKeys])

  const register = (key: string) => (el: HTMLElement | null) => {
    if (el) sectionRefs.current.set(key, el)
    else sectionRefs.current.delete(key)
  }

  return { active, register }
}

function groupCountLabel(group: Group) {
  const n = group.publications.length
  return `${n} ${n === 1 ? 'publication' : 'publications'}`
}

/**
 * True once `ref`'s element has scrolled up past the sticky line.
 *
 * This is what hands the arrangement control over: the filter bar's copy and
 * the sticky bar's copy are the same control — both read and write
 * `filters.view`, so they always agree — and showing both at once reads as two
 * controls fighting. The sticky one appears only once the real one is gone.
 */
function useScrolledPast(enabled: boolean) {
  const ref = useRef<HTMLDivElement>(null)
  const [past, setPast] = useState(false)

  useEffect(() => {
    if (!enabled) return

    // Measured on scroll rather than watched with an IntersectionObserver.
    // An observer only reports threshold *crossings*, so anything that moves
    // the page without crossing one — scroll restoration on reload, a jump
    // straight to an anchor, a zoom or layout shift under a stationary
    // scrollTop — leaves it reporting the position the page no longer has,
    // and the control never appears. Reading the rect always answers for the
    // position the page is actually at; it is one rect per animation frame,
    // and only while scrolling.
    let frame = 0
    const measure = () => {
      frame = 0
      const el = ref.current
      if (el) setPast(el.getBoundingClientRect().bottom <= ACTIVE_GROUP_LINE)
    }
    const schedule = () => {
      frame ||= requestAnimationFrame(measure)
    }

    // Scheduled rather than called: a synchronous setState inside an effect
    // is a second render before paint, and the first frame is soon enough.
    schedule()
    window.addEventListener('scroll', schedule, { passive: true })
    window.addEventListener('resize', schedule)
    return () => {
      if (frame) cancelAnimationFrame(frame)
      window.removeEventListener('scroll', schedule)
      window.removeEventListener('resize', schedule)
    }
  }, [enabled])

  // `enabled` gates the result rather than resetting the state, so turning the
  // filter bar off needs no extra render to forget where it used to be.
  return { ref, past: enabled && past }
}

/**
 * The sticky bar: where you are in the list, and — once you have scrolled past
 * the filter bar — the arrangement control that put you there. Those were two
 * separate things, which meant that regrouping a long list began with scrolling
 * back to the top of it.
 *
 * The group name keeps the skiper74 treatment (active group in full colour,
 * its count muted) and stays `aria-hidden`: it restates the real group header
 * scrolling underneath it. The control beside it is the live one.
 */
function StickyBar({
  group,
  filters,
  onFiltersChange,
  groupCounts: counts,
  showControl,
}: {
  group: Group | undefined
  filters: PubFilters
  onFiltersChange: (f: PubFilters) => void
  groupCounts: Record<ViewMode, number>
  /** Only once the filter bar's own copy of this control is off screen. */
  showControl: boolean
}) {
  const reduceMotion = useReducedMotion()
  return (
    <header className="sticky top-0 z-10 flex h-20 items-end justify-between gap-4 border-b border-foreground/20 bg-background pb-2">
      {/* Two flex items, not one truncating line: the name is the part that
          can run long (a spelt-out journal title), so it is the part that gets
          clipped. The count is three characters and always worth keeping.

          Set exactly as the group header below it (sans, text-xl, "/ count"),
          not a size up in the display serif: the two are the same heading —
          this one restates whichever group is scrolling under it — and at two
          sizes the year jumped as the real header slid beneath its copy. The
          slash keeps the count reading as a count, not as part of the name. */}
      <span
        aria-hidden
        className="flex min-w-0 items-baseline gap-1 text-xl font-medium tracking-tight text-foreground/60"
      >
        {group && (
          <>
            <motion.span
              key={group.label}
              initial={reduceMotion ? { opacity: 0 } : { x: -5, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.2, ease: 'easeOut' }}
              className="mr-1 min-w-0 truncate text-foreground"
            >
              {group.label}
            </motion.span>
            <span className="shrink-0">/ {groupCountLabel(group)}</span>
          </>
        )}
      </span>
      <AnimatePresence initial={false}>
        {showControl && (
          <motion.div
            key="arrangement"
            initial={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="hidden shrink-0 md:block"
          >
            <SegmentedControl
              label="Group publications"
              size="sm"
              options={viewOptions(counts)}
              value={filters.view}
              onChange={(view) => onFiltersChange({ ...filters, view })}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}

interface PublicationsSectionProps {
  yearGroups: PublicationYear[]
  highlightAuthors?: string[]
  /** null when the page header already names the list. */
  heading?: string | null
  viewAllHref?: string
  viewAllLabel?: string
  showFilters?: boolean
  /** Supply both to drive the filters from outside (the URL wrapper does). */
  filters?: PubFilters
  onFiltersChange?: (filters: PubFilters) => void
}

const PublicationsSection = ({
  yearGroups,
  highlightAuthors,
  heading = 'Publications',
  viewAllHref,
  viewAllLabel = 'View all publications',
  showFilters = false,
  filters: controlledFilters,
  onFiltersChange,
}: PublicationsSectionProps) => {
  const reduceMotion = useReducedMotion()
  const [ownFilters, setOwnFilters] = useState<PubFilters>(NO_FILTERS)
  const filters = controlledFilters ?? ownFilters
  const setFilters = onFiltersChange ?? setOwnFilters

  // One flat list of {publication, year} is the shape every facet works on;
  // the year-grouped input is just how the page happens to hand it over.
  const entries = useMemo<Entry<Publication>[]>(
    () => yearGroups.flatMap((yg) => yg.publications.map((pub) => ({ pub, year: yg.year }))),
    [yearGroups],
  )
  const pubYear = useMemo(() => new Map(entries.map((e) => [e.pub.id, e.year])), [entries])
  const allYears = useMemo(
    () => [...new Set(entries.map((e) => e.year))].sort((a, b) => a - b),
    [entries],
  )

  const visible = useMemo(() => applyFilters(entries, filters), [entries, filters])
  const counts = useMemo(() => groupCounts(visible), [visible])
  const groups = useMemo(() => buildGroups(visible, filters.view), [visible, filters.view])

  const { active, register } = useActiveGroup(groups.map((g) => g.key).join('\u0000'))
  const activeGroup = groups.find((g) => g.key === active) ?? groups[0]

  // Embedded lists have no filter bar at all, so there is nothing to take over
  // from and nothing to put in the sticky bar.
  const { ref: filterBarRef, past: filterBarGone } = useScrolledPast(showFilters)

  const query = filters.q.trim()
  const animateRows = !reduceMotion && visible.length <= LAYOUT_ANIMATION_LIMIT

  return (
    <>
      <section className="pt-12 md:pt-16">
        <div className="container flex items-center justify-between">
          {heading ? <h2 className={displaySectionTitle}>{heading}</h2> : <span />}
          {viewAllHref && (
            <Button
              variant="outline"
              render={<Link href={viewAllHref} />}
              className="rounded-full"
              nativeButton={false}
              role="link"
            >
              {viewAllLabel}
              <ArrowUpRight className="size-4" />
            </Button>
          )}
        </div>

        {showFilters && (
          <div className="container mt-6" ref={filterBarRef}>
            <PublicationFilterBar
              entries={entries}
              filters={filters}
              onChange={setFilters}
              allYears={allYears}
            />
          </div>
        )}
      </section>

      {groups.length === 0 ? (
        <section className="py-8 lg:py-16">
          <div className="container">
            <p className="text-muted-foreground">
              No publications match the current filters.{' '}
              {isFiltered(filters) && (
                <button
                  type="button"
                  onClick={() => setFilters({ ...NO_FILTERS, view: filters.view })}
                  className="text-foreground underline decoration-border underline-offset-4 transition-colors hover:decoration-current"
                >
                  Clear them
                </button>
              )}
            </p>
          </div>
        </section>
      ) : (
        <div className="container pt-8 pb-12 md:pb-16">
          <div className="max-w-4xl">
            <StickyBar
              group={activeGroup}
              filters={filters}
              onFiltersChange={setFilters}
              groupCounts={counts}
              showControl={showFilters && filterBarGone}
            />
            {/* Keyed on the arrangement so switching it crossfades the whole
                list: rows cannot slide from a pile of years into a pile of
                venues, and pretending otherwise reads as a glitch. Narrowing
                *within* an arrangement is the case the row layout animation
                below handles. Pulled up under the sticky bar so the first
                group's own header hides behind it, as in skiper74. */}
            <motion.div
              key={filters.view}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25, ease: [0.23, 1, 0.32, 1] }}
              className="-mt-20"
            >
              {groups.map((group) => {
                const selected = groupIsSelected(filters, group)
                return (
                  <section
                    key={group.key}
                    ref={register(group.key)}
                    data-group-key={group.key}
                    className="pt-8 first:pt-0 lg:pt-16"
                  >
                    {/* The header's height is load-bearing: it is exactly the
                        sticky bar's `h-20`, and the list is pulled up by
                        `-mt-20` so the first group's own header hides behind
                        it. The expansion therefore goes *inside* the row,
                        opposite the name, rather than on a line above it.
                        The "/ count" is foreground at 60%, not 50%: it is
                        text, and 50% was 3.4:1 on paper. The sticky copy
                        above matches. */}
                    <header className="flex h-20 items-end justify-between gap-6 border-b border-foreground/20 pb-2 text-xl font-medium tracking-tight text-foreground/60">
                      {group.filterable ? (
                        // The group name is the filter: you are already looking
                        // at the pile, clicking it keeps only that pile.
                        <button
                          type="button"
                          aria-pressed={selected}
                          onClick={() => setFilters(withGroupSelected(filters, group))}
                          title={
                            selected
                              ? `Stop filtering to ${group.label}`
                              : `Show only ${group.label}`
                          }
                          className="group/label flex items-baseline gap-1 text-left"
                        >
                          <span
                            className={cn(
                              'ease-snappy mr-1 underline-offset-4 transition-colors duration-150',
                              selected
                                ? 'text-brand decoration-brand/40 underline'
                                : 'text-foreground group-hover/label:underline group-hover/label:decoration-border',
                            )}
                          >
                            {group.label}
                          </span>
                          <span>/ {groupCountLabel(group)}</span>
                        </button>
                      ) : (
                        <>
                          <span className="mr-1 text-foreground">{group.label}</span>/{' '}
                          {groupCountLabel(group)}
                        </>
                      )}
                      {group.sublabel && (
                        <span className="min-w-0 truncate text-sm font-normal tracking-normal text-muted-foreground max-md:hidden">
                          {group.sublabel}
                        </span>
                      )}
                    </header>
                    <ul>
                      <AnimatePresence initial={false} mode="popLayout">
                        {group.publications.map((pub) => (
                          <motion.li
                            key={pub.id}
                            layout={animateRows ? 'position' : false}
                            exit={animateRows ? { opacity: 0, scale: 0.98 } : { opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
                          >
                            <PublicationRow
                              pub={pub}
                              year={pubYear.get(pub.id) ?? 0}
                              showYear={filters.view !== 'all'}
                              highlightAuthors={highlightAuthors}
                              query={query}
                            />
                          </motion.li>
                        ))}
                      </AnimatePresence>
                    </ul>
                  </section>
                )
              })}
            </motion.div>
          </div>
        </div>
      )}
    </>
  )
}

interface FlatPublicationListProps {
  yearGroups: PublicationYear[]
  highlightAuthors?: string[]
  /** Show each row's year inline, for lists that are not grouped by year. */
  showYear?: boolean
  className?: string
}

const FlatPublicationList = ({
  yearGroups,
  highlightAuthors,
  showYear = false,
  className,
}: FlatPublicationListProps) => {
  const pubYearMap = new Map<string, number>()
  for (const yg of yearGroups) {
    for (const pub of yg.publications) {
      pubYearMap.set(pub.id, yg.year)
    }
  }
  const pubs = yearGroups.flatMap((yg) => yg.publications)

  return (
    <div className={className}>
      <Separator />
      {pubs.map((pub, i) => {
        const year = pubYearMap.get(pub.id) ?? 0
        return (
          <Fragment key={pub.id ?? i}>
            <PublicationRow
              pub={pub}
              year={year}
              highlightAuthors={highlightAuthors}
              showYear={showYear}
            />
            <Separator />
          </Fragment>
        )
      })}
    </div>
  )
}

// ─── URL state ───────────────────────────────────────────────────────────────

const VIEWS: ViewMode[] = ['all', 'venue', 'theme', 'type']

function readFilters(sp: URLSearchParams): PubFilters {
  const view = sp.get('view') as ViewMode | null
  return {
    view: view && VIEWS.includes(view) ? view : 'all',
    q: sp.get('q') ?? '',
    // Multi-value facets are repeated params rather than a joined string: a
    // venue name may contain a comma, and "CHI, EA" is one venue, not two.
    years: sp.getAll('year').map(Number).filter(Number.isFinite),
    venues: sp.getAll('venue'),
    themes: sp.getAll('theme'),
    types: sp.getAll('type'),
    openAccess: sp.get('open') === '1',
    collaboration: sp.get('collab') === '1',
  }
}

function writeFilters(f: PubFilters): string {
  const sp = new URLSearchParams()
  if (f.view !== 'all') sp.set('view', f.view)
  if (f.q.trim()) sp.set('q', f.q.trim())
  for (const year of f.years) sp.append('year', String(year))
  for (const venue of f.venues) sp.append('venue', venue)
  for (const theme of f.themes) sp.append('theme', theme)
  for (const type of f.types) sp.append('type', type)
  if (f.openAccess) sp.set('open', '1')
  if (f.collaboration) sp.set('collab', '1')
  return sp.toString()
}

// URL-aware wrapper — use this (inside Suspense) on pages with filter UI
function PublicationsSectionWithUrl({
  yearGroups,
  ...rest
}: Omit<PublicationsSectionProps, 'filters' | 'onFiltersChange' | 'showFilters'>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  // Seeded from the URL once, then owned here. The search box has to answer a
  // keystroke immediately; it cannot wait on a route transition to re-render.
  const [filters, setFilters] = useState<PubFilters>(() =>
    readFilters(new URLSearchParams(searchParams.toString())),
  )

  const current = searchParams.toString()

  useEffect(() => {
    const next = writeFilters(filters)
    if (next === current) return
    // `replace`, not `push`: a filter bar that leaves a history entry behind
    // every keystroke makes the back button useless for leaving the page.
    // Debounced so a typed query settles into one entry rather than twelve.
    const id = setTimeout(() => {
      router.replace(`${pathname}${next ? `?${next}` : ''}`, { scroll: false })
    }, 250)
    return () => clearTimeout(id)
  }, [filters, current, pathname, router])

  return (
    <PublicationsSection
      yearGroups={yearGroups}
      showFilters
      filters={filters}
      onFiltersChange={setFilters}
      {...rest}
    />
  )
}

export { PublicationsSection, PublicationsSectionWithUrl, FlatPublicationList }
