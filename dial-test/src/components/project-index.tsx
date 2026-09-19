'use client'

import { useMemo, useState } from 'react'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { ArrowRight } from 'lucide-react'

import { SegmentedControl } from '@/components/editorial'
import { FadeScroller } from '@/components/fade-scroller'
import { AsteriskMark, EmptySketch, SquiggleUnderline } from '@/components/marks'
import { listEnter, listStagger } from '@/lib/motion'
import { cn } from '@/lib/utils'

/**
 * The one Project presentation (labs/dial/frontend.md, "Shared presentation
 * contracts"): the same row renders on /projects, Research Theme pages, and
 * Team Member profiles.
 */
export interface ProjectEntry {
  id: string
  slug: string
  title: string
  /** Bengali/local name, when the source gives one. */
  localName?: string | null
  abstract: string
  /** Research Theme titles, primary first. */
  themes: string[]
  /** null when no source states the status. */
  status: 'ongoing' | 'completed' | null
  leadResearcher: string | null
  award?: { title: string }
  publicationCount: number
  teamMemberCount: number
}

type StatusFilter = 'all' | 'ongoing' | 'completed'

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'ongoing', label: 'Ongoing' },
  { value: 'completed', label: 'Completed' },
]

const PAGE_SIZE = 12
/** Below this, filters cost more attention than they save. */
const FILTER_THRESHOLD = 5

// ─── Index ───────────────────────────────────────────────────────────────────

interface ProjectIndexProps {
  projects: ProjectEntry[]
  /** Show the Research Theme filter (the directory page only). */
  themeFilter?: boolean
  initialTheme?: string | null
  initialStatus?: StatusFilter
  onFiltersChange?: (filters: { theme: string | null; status: StatusFilter }) => void
  className?: string
}

const ProjectIndex = ({
  projects,
  themeFilter = false,
  initialTheme = null,
  initialStatus = 'all',
  onFiltersChange,
  className,
}: ProjectIndexProps) => {
  const [theme, setTheme] = useState<string | null>(initialTheme)
  const [status, setStatus] = useState<StatusFilter>(initialStatus)
  const [showAll, setShowAll] = useState(false)

  const showFilters = projects.length >= FILTER_THRESHOLD

  const themeCounts = useMemo(() => {
    const counts = new Map<string, number>()
    for (const p of projects) for (const t of p.themes) counts.set(t, (counts.get(t) ?? 0) + 1)
    return [...counts.entries()].sort(([a], [b]) => a.localeCompare(b))
  }, [projects])

  const byTheme = projects.filter((p) => theme === null || p.themes.includes(theme))
  const statusCount = (s: StatusFilter) =>
    s === 'all' ? byTheme.length : byTheme.filter((p) => p.status === s).length

  // Ongoing work first; otherwise keep the record order.
  const sorted = byTheme
    .filter((p) => status === 'all' || p.status === status)
    .sort((a, b) => Number(b.status === 'ongoing') - Number(a.status === 'ongoing'))
  const visible = showAll ? sorted : sorted.slice(0, PAGE_SIZE)

  const update = (next: { theme?: string | null; status?: StatusFilter }) => {
    const filters = { theme: next.theme !== undefined ? next.theme : theme, status: next.status ?? status }
    setTheme(filters.theme)
    setStatus(filters.status)
    setShowAll(false)
    onFiltersChange?.(filters)
  }

  return (
    <div className={className}>
      {showFilters && (
        <div className="flex flex-col gap-4 border-b border-border md:flex-row md:items-end md:justify-between md:gap-8">
          {themeFilter ? (
            <FadeScroller
              className="-mx-4 min-w-0 flex-1 px-4"
              contentClassName="flex gap-6"
              label="Filter by Research Theme"
            >
              <ThemeTab active={theme === null} count={projects.length} onClick={() => update({ theme: null })}>
                All themes
              </ThemeTab>
              {themeCounts.map(([t, count]) => (
                <ThemeTab key={t} active={theme === t} count={count} onClick={() => update({ theme: t })}>
                  {t}
                </ThemeTab>
              ))}
            </FadeScroller>
          ) : (
            <span />
          )}

          <SegmentedControl
            label="Filter by status"
            options={STATUS_OPTIONS.map((o) => ({ ...o, count: statusCount(o.value) }))}
            value={status}
            onChange={(value) => update({ status: value })}
            className="mb-3 shrink-0"
          />
        </div>
      )}

      {visible.length > 0 ? (
        <ol className={cn('divide-y divide-border', !showFilters && 'border-t border-border')}>
          {visible.map((project, i) => (
            // Rows a filter brings in rise into place; rows that stay are untouched.
            <li key={project.id} className={listEnter} style={listStagger(i)}>
              <ProjectRow project={project} index={i + 1} />
            </li>
          ))}
        </ol>
      ) : (
        <p className="flex flex-col items-start gap-4 py-16 text-muted-foreground">
          <EmptySketch />
          No projects match these filters.{' '}
          <button
            type="button"
            className="text-foreground underline underline-offset-4"
            onClick={() => update({ theme: null, status: 'all' })}
          >
            Clear filters
          </button>
        </p>
      )}

      {sorted.length > PAGE_SIZE && (
        <button
          type="button"
          onClick={() => setShowAll(!showAll)}
          className="mt-8 text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground"
        >
          {showAll ? 'Show fewer' : `Show all ${sorted.length} projects`}
        </button>
      )}
    </div>
  )
}

const ThemeTab = ({
  active,
  count,
  onClick,
  children,
}: {
  active: boolean
  count: number
  onClick: () => void
  children: React.ReactNode
}) => (
  <button
    type="button"
    aria-pressed={active}
    onClick={onClick}
    className={cn(
      'relative shrink-0 whitespace-nowrap pb-3 text-sm transition-colors duration-150 ease-snappy',
      'after:absolute after:inset-x-0 after:-bottom-px after:h-0.5 after:bg-brand after:transition-transform after:duration-200 after:ease-snappy',
      active
        ? 'text-foreground after:scale-x-100'
        : 'text-muted-foreground after:scale-x-0 hover:text-foreground',
    )}
  >
    {children}
    <sup className="ml-0.5 tabular-nums text-[0.65rem] text-muted-foreground">{count}</sup>
  </button>
)

// ─── Row ─────────────────────────────────────────────────────────────────────

/**
 * The mark shows the name's first letter. For Bengali that is the base
 * consonant alone (জ, not the conjunct জ্যো), which reads as a letterform and
 * fits the tile.
 */
function firstLetter(text: string): string {
  return [...text.trim()][0] ?? ''
}

const ProjectMark = ({ project, className }: { project: ProjectEntry; className?: string }) => (
  // A printed block: halftone dots behind the letter, one ink per state, and a
  // few degrees of rotation so it reads as stuck on rather than placed.
  <div
    aria-hidden
    className={cn(
      'sticker relative grid shrink-0 place-items-center overflow-hidden rounded-[0.7rem] group-hover:rotate-0',
      project.award
        ? 'bg-ink/12 text-ink'
        : project.status === 'ongoing'
          ? 'bg-brand/12 text-brand'
          : 'bg-muted text-foreground/60',
      className,
    )}
  >
    <span aria-hidden className="halftone absolute inset-0 opacity-25" />
    {/* The letter tilts when its row is hovered: a small, playful answer to
        the pointer. Out at 250ms, back at 150ms; hover variants only apply on
        devices that can hover, and reduced motion keeps it still. */}
    <span
      className={cn(
        'font-display leading-none select-none',
        'transition-transform duration-150 ease-snappy',
        'motion-safe:group-hover:-translate-y-0.5 motion-safe:group-hover:-rotate-4 motion-safe:group-hover:scale-106 motion-safe:group-hover:duration-250',
      )}
    >
      {firstLetter(project.localName ?? project.title)}
    </span>
  </div>
)

const StatusLabel = ({ status }: { status: ProjectEntry['status'] }) =>
  status ? (
    <span
      className={cn(
        'inline-flex items-center gap-1.5',
        status === 'ongoing' ? 'text-brand' : 'text-muted-foreground',
      )}
    >
      <span
        className={cn(
          'size-2 rounded-full',
          status === 'ongoing' ? 'bg-brand ring-2 ring-brand/25' : 'bg-muted-foreground/40',
        )}
      />
      {status === 'ongoing' ? 'Ongoing' : 'Completed'}
    </span>
  ) : null

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

const ProjectRow = ({ project, index }: { project: ProjectEntry; index: number }) => {
  const counts = [
    project.publicationCount > 0 && plural(project.publicationCount, 'publication'),
    project.teamMemberCount > 0 && plural(project.teamMemberCount, 'person').replace('persons', 'people'),
  ].filter(Boolean)

  return (
    <a
      href={`/projects/${project.slug}`}
      className={cn(
        'group -mx-4 grid grid-cols-[3.5rem_1fr_auto] items-start gap-x-4 gap-y-3 rounded-lg px-4 py-8',
        'md:grid-cols-[2rem_7rem_1fr_15rem_1.25rem] md:gap-x-8 md:py-10',
        'transition-colors duration-150 ease-snappy hover:bg-muted/50 active:bg-muted',
      )}
    >
      <span className="hidden pt-1 font-mono text-xs tabular-nums text-muted-foreground md:block">
        {String(index).padStart(2, '0')}
      </span>

      <ProjectMark
        project={project}
        className="size-14 text-4xl md:size-28 md:text-8xl"
      />

      <div className="min-w-0">
        <h3 className="relative w-fit font-display text-2xl leading-tight md:text-3xl">
          {project.localName ?? project.title}
          <SquiggleUnderline />
        </h3>
        {project.localName && (
          <p className="mt-0.5 text-sm text-muted-foreground">{project.title}</p>
        )}
        <p className="mt-3 line-clamp-2 max-w-prose text-sm text-pretty text-muted-foreground md:text-base">
          {project.abstract}
        </p>
      </div>

      <ArrowRight className="mt-1.5 size-4 text-muted-foreground arrow-ne group-hover:text-foreground md:hidden" />

      {/* Metadata: its own column on desktop, a wrapped line under the abstract on mobile. */}
      <dl className="col-span-3 col-start-1 flex flex-wrap gap-x-4 gap-y-1 text-sm md:col-span-1 md:col-start-auto md:flex-col md:gap-y-1.5 md:pt-1.5">
        {project.status && (
          <div>
            <dt className="sr-only">Status</dt>
            <dd>
              <StatusLabel status={project.status} />
            </dd>
          </div>
        )}
        {project.themes.length > 0 && (
          <div>
            <dt className="sr-only">Research Themes</dt>
            <dd className="text-muted-foreground">{project.themes.join(', ')}</dd>
          </div>
        )}
        {project.leadResearcher && (
          <div>
            <dt className="sr-only">Lead</dt>
            <dd className="text-muted-foreground">Led by {project.leadResearcher}</dd>
          </div>
        )}
        {counts.length > 0 && (
          <div>
            <dt className="sr-only">Records</dt>
            <dd className="text-muted-foreground tabular-nums">{counts.join(' · ')}</dd>
          </div>
        )}
        {project.award && (
          <div>
            <dt className="sr-only">Award</dt>
            <dd>
              <span className="sticker-alt inline-flex items-center gap-1.5 rounded-[0.8rem] border border-ink/35 bg-ink/8 px-2.5 py-1 text-xs text-ink group-hover:rotate-0">
                <AsteriskMark className="size-3" />
                {project.award.title}
              </span>
            </dd>
          </div>
        )}
      </dl>

      <ArrowRight className="mt-3 hidden size-4 text-muted-foreground arrow-ne group-hover:text-foreground md:block" />
    </a>
  )
}

// ─── Directory (URL-backed) ──────────────────────────────────────────────────

/**
 * ProjectIndex with filters mirrored into the URL (?theme=&status=) so a
 * filtered directory can be shared. Needs a Suspense boundary for
 * useSearchParams; render a plain ProjectIndex as the fallback.
 */
const ProjectDirectory = (props: Omit<ProjectIndexProps, 'initialTheme' | 'initialStatus' | 'onFiltersChange'>) => {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  const rawStatus = searchParams.get('status')
  const initialStatus: StatusFilter = rawStatus === 'ongoing' || rawStatus === 'completed' ? rawStatus : 'all'

  return (
    <ProjectIndex
      {...props}
      initialTheme={searchParams.get('theme')}
      initialStatus={initialStatus}
      onFiltersChange={({ theme, status }) => {
        const sp = new URLSearchParams()
        if (theme) sp.set('theme', theme)
        if (status !== 'all') sp.set('status', status)
        const qs = sp.toString()
        router.replace(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
      }}
    />
  )
}

export { ProjectDirectory, ProjectIndex, ProjectRow }
