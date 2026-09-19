'use client'

import { ArrowUpRight, Check, Copy, FileText, LockOpen, Quote, Trophy, Users } from 'lucide-react'
import { Fragment, useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'
import { motion, useReducedMotion } from 'motion/react'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { SegmentedControl } from '@/components/editorial'
import { AsteriskMark } from '@/components/marks'
import { displaySectionTitle } from '@/lib/typography'
import { cn } from '@/lib/utils'

export type Publication = {
  id: string
  title: string
  authors: string
  venue?: string | null
  award?: string | null
  pdfLink?: string | null
  projectLink?: string | null
  doi?: string | null
  citationText?: string | null
  themes?: string[] | null
  isOpenAccess?: boolean | null
  isCollaboration?: boolean | null
  type?: 'conference' | 'journal' | 'workshop' | 'preprint' | 'extended-abstract' | 'study-protocol' | 'book-chapter' | null
}

export type PublicationYear = {
  year: number
  publications: Publication[]
}

const TYPE_LABELS: Record<string, string> = {
  conference: 'Conference',
  journal: 'Journal',
  workshop: 'Workshop',
  preprint: 'Preprint',
  'extended-abstract': 'Ext. Abstract',
  'study-protocol': 'Study Protocol',
  'book-chapter': 'Book Chapter',
}

const TYPE_GROUP_LABELS: Record<string, string> = {
  conference: 'Conference Papers',
  journal: 'Journal Articles',
  workshop: 'Workshop Papers',
  preprint: 'Preprints',
  'extended-abstract': 'Extended Abstracts',
  'study-protocol': 'Study Protocols',
  'book-chapter': 'Book Chapters',
}

async function copyToClipboard(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
    window.prompt('Copy this citation text:', text)
  } catch {
    // silent
  }
}

function formatAuthorBibTeX(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return name
  const last = parts[parts.length - 1]
  const first = parts.slice(0, -1).join(' ')
  return `${last}, ${first}`
}

function generateBibTeX(pub: Publication, year: number): string {
  const entryTypeMap: Record<string, string> = {
    conference: '@inproceedings',
    journal: '@article',
    workshop: '@inproceedings',
    preprint: '@misc',
    'extended-abstract': '@inproceedings',
    'study-protocol': '@article',
    'book-chapter': '@incollection',
  }
  const entry = entryTypeMap[pub.type ?? ''] ?? '@misc'

  const firstAuthorLastName = pub.authors.split(',')[0].trim().split(/\s+/).pop()?.toLowerCase() ?? 'unknown'
  const firstTitleWord = pub.title.split(/\s+/)[0].replace(/[^a-z]/gi, '').toLowerCase()
  const key = `${firstAuthorLastName}${year}${firstTitleWord}`

  const authorsFormatted = pub.authors.split(', ').map(formatAuthorBibTeX).join(' and ')

  const isArticle = entry === '@article'
  const venueField = isArticle ? 'journal' : 'booktitle'
  const venueValue = pub.venue
    ? isArticle
      ? pub.venue
      : `Proceedings of ${pub.venue} ${year}`
    : null

  const lines = [
    `${entry}{${key},`,
    `  author    = {${authorsFormatted}},`,
    `  title     = {${pub.title}},`,
    venueValue ? `  ${venueField.padEnd(9)} = {${venueValue}},` : null,
    `  year      = {${year}},`,
    `}`,
  ].filter(Boolean) as string[]

  return lines.join('\n')
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

type CiteFmt = 'apa' | 'bib'

function CiteDialog({ pub, year }: { pub: Publication; year: number }) {
  const [fmt, setFmt] = useState<CiteFmt>('apa')
  const [copied, setCopied] = useState(false)

  const text = fmt === 'apa' ? (pub.citationText ?? '') : generateBibTeX(pub, year)

  async function handleCopy() {
    await copyToClipboard(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm">
          <Quote className="size-4" />
          Cite
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="pr-6 text-sm font-medium leading-snug text-muted-foreground">
            {pub.title}
          </DialogTitle>
        </DialogHeader>
        <div className="flex gap-1">
          <Button size="sm" variant={fmt === 'apa' ? 'default' : 'ghost'} onClick={() => setFmt('apa')}>
            APA
          </Button>
          <Button size="sm" variant={fmt === 'bib' ? 'default' : 'ghost'} onClick={() => setFmt('bib')}>
            BibTeX
          </Button>
        </div>
        <pre className={cn('rounded-md bg-muted p-3 text-sm whitespace-pre-wrap break-words', fmt === 'bib' && 'font-mono')}>
          {text}
        </pre>
        {/* Both labels stay mounted and crossfade, with a 2px blur on the one
            leaving so the swap reads as one change rather than two overlapping
            words. The check pops in from 0.8. */}
        <Button
          variant="outline"
          onClick={handleCopy}
          className="w-full transition-transform duration-150 ease-snappy active:scale-[0.97]"
        >
          <span className="grid place-items-center [&>*]:col-start-1 [&>*]:row-start-1">
            <span
              aria-hidden={copied}
              className={cn(
                'inline-flex items-center gap-2 transition-[opacity,filter] duration-150 ease-snappy',
                copied ? 'opacity-0 blur-[2px]' : 'opacity-100',
              )}
            >
              <Copy className="size-4" />
              Copy
            </span>
            <span
              aria-hidden={!copied}
              className={cn(
                'inline-flex items-center gap-2 transition-[opacity,filter] duration-150 ease-snappy',
                copied ? 'opacity-100' : 'opacity-0 blur-[2px]',
              )}
            >
              <Check
                className={cn(
                  'size-4 text-brand transition-transform duration-200 ease-snappy',
                  copied ? 'scale-100' : 'scale-80',
                )}
              />
              Copied
            </span>
          </span>
        </Button>
      </DialogContent>
    </Dialog>
  )
}

function PubActions({ pub, year }: { pub: Publication; year: number }) {
  return (
    <div className="flex flex-wrap gap-2">
      {pub.pdfLink && (
        <Button variant="ghost" size="sm" asChild>
          <a href={pub.pdfLink} target="_blank" rel="noopener noreferrer">
            <FileText className="size-4" />
            PDF
          </a>
        </Button>
      )}
      {pub.doi && (
        <Button variant="ghost" size="sm" asChild>
          <a href={`https://doi.org/${pub.doi}`} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="size-4" />
            DOI
          </a>
        </Button>
      )}
      {pub.citationText && <CiteDialog pub={pub} year={year} />}
      {pub.projectLink && (
        <Button variant="ghost" size="sm" asChild>
          <a href={pub.projectLink} target="_blank" rel="noopener noreferrer">
            <ArrowUpRight className="size-4" />
            Project
          </a>
        </Button>
      )}
    </div>
  )
}

// One publication, as listed everywhere. This is the unit that maps to a
// Payload Publication, so it exists exactly once.
function PublicationRow({
  pub,
  year,
  showYear = false,
  highlightAuthors,
}: {
  pub: Publication
  year: number
  showYear?: boolean
  highlightAuthors?: string[]
}) {
  return (
    <div className="py-6">
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-2">
          <p className="max-w-4xl font-display text-xl leading-snug text-pretty md:text-2xl">{pub.title}</p>
          <p className="text-sm text-muted-foreground">
            <AuthorList authors={pub.authors} highlight={highlightAuthors} />
            {showYear && <span className="before:mx-2 before:content-['·']">{year}</span>}
          </p>
        </div>
        <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
            {pub.venue && <span className="font-medium text-foreground">{pub.venue}</span>}
            {pub.type && <span>{TYPE_LABELS[pub.type] ?? pub.type}</span>}
            {pub.award && (
              <span className="sticker-alt inline-flex items-center gap-1.5 rounded-[0.8rem] border border-ink/35 bg-ink/8 px-2.5 py-0.5 text-ink">
                <AsteriskMark className="size-3" />
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
          <PubActions pub={pub} year={year} />
        </div>
      </div>
    </div>
  )
}

type ViewMode = 'all' | 'venue' | 'theme' | 'type'

type Group = {
  label: string
  publications: Publication[]
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
      { rootMargin: `-${ACTIVE_GROUP_LINE}px 0px -${Math.max(window.innerHeight - ACTIVE_GROUP_LINE - 1, 0)}px 0px` },
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

// The skiper74 header: active group in full colour, its count muted. It sits
// in flow at the top of the list and pins while the list scrolls under it.
function ActiveGroupHeader({ group }: { group: Group | undefined }) {
  const reduceMotion = useReducedMotion()
  return (
    <header
      aria-hidden
      className="sticky top-0 z-10 flex h-20 items-end border-b border-foreground/20 bg-background pb-4 font-display text-3xl text-foreground/45"
    >
      {group && (
        <>
          <motion.span
            key={group.label}
            initial={reduceMotion ? { opacity: 0 } : { x: -5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="mr-2 inline-block text-foreground"
          >
            {group.label}
          </motion.span>
          {groupCountLabel(group)}
        </>
      )}
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
  initialViewMode?: ViewMode
  initialOpenAccess?: boolean
  initialCollaborations?: boolean
  onViewModeChange?: (mode: ViewMode) => void
  onOpenAccessChange?: (val: boolean) => void
  onCollaborationsChange?: (val: boolean) => void
}

const PublicationsSection = ({
  yearGroups,
  highlightAuthors,
  heading = 'Publications',
  viewAllHref,
  viewAllLabel = 'View all publications',
  showFilters = false,
  initialViewMode = 'all',
  initialOpenAccess = false,
  initialCollaborations = false,
  onViewModeChange,
  onOpenAccessChange,
  onCollaborationsChange,
}: PublicationsSectionProps) => {
  const [viewMode, setViewMode] = useState<ViewMode>(initialViewMode)
  const [openAccessOnly, setOpenAccessOnly] = useState(initialOpenAccess)
  const [collaborationsOnly, setCollaborationsOnly] = useState(initialCollaborations)

  function handleViewMode(mode: ViewMode) {
    setViewMode(mode)
    onViewModeChange?.(mode)
  }

  function handleOpenAccess(val: boolean) {
    setOpenAccessOnly(val)
    onOpenAccessChange?.(val)
  }

  function handleCollaborations(val: boolean) {
    setCollaborationsOnly(val)
    onCollaborationsChange?.(val)
  }

  const pubYearMap = new Map<string, number>()
  for (const yg of yearGroups) {
    for (const pub of yg.publications) {
      pubYearMap.set(pub.id, yg.year)
    }
  }

  const allPubs = yearGroups.flatMap(yg => yg.publications)

  const filtered = allPubs.filter(pub => {
    if (openAccessOnly && !pub.isOpenAccess) return false
    if (collaborationsOnly && !pub.isCollaboration) return false
    return true
  })

  const isFiltered = openAccessOnly || collaborationsOnly

  let groups: Group[] = []

  if (viewMode === 'all') {
    const yearMap = new Map<number, Publication[]>()
    for (const pub of filtered) {
      const year = pubYearMap.get(pub.id) ?? 0
      if (!yearMap.has(year)) yearMap.set(year, [])
      yearMap.get(year)!.push(pub)
    }
    groups = Array.from(yearMap.entries())
      .sort(([a], [b]) => b - a)
      .map(([year, pubs]) => ({ label: String(year), publications: pubs }))
  } else if (viewMode === 'venue') {
    const venueMap = new Map<string, Publication[]>()
    for (const pub of filtered) {
      const key = pub.venue ?? 'Other'
      if (!venueMap.has(key)) venueMap.set(key, [])
      venueMap.get(key)!.push(pub)
    }
    groups = Array.from(venueMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([venue, pubs]) => ({ label: venue, publications: pubs }))
  } else if (viewMode === 'theme') {
    const themeMap = new Map<string, Publication[]>()
    for (const pub of filtered) {
      const themes = pub.themes?.length ? pub.themes : ['Uncategorized']
      for (const theme of themes) {
        if (!themeMap.has(theme)) themeMap.set(theme, [])
        themeMap.get(theme)!.push(pub)
      }
    }
    groups = Array.from(themeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([theme, pubs]) => ({ label: theme, publications: pubs }))
  } else if (viewMode === 'type') {
    const typeMap = new Map<string, Publication[]>()
    for (const pub of filtered) {
      const key = pub.type ?? 'other'
      if (!typeMap.has(key)) typeMap.set(key, [])
      typeMap.get(key)!.push(pub)
    }
    groups = Array.from(typeMap.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([type, pubs]) => ({ label: TYPE_GROUP_LABELS[type] ?? 'Other', publications: pubs }))
  }

  const { active, register } = useActiveGroup(groups.map((g) => g.label).join('\u0000'))
  const activeGroup = groups.find((g) => g.label === active) ?? groups[0]

  return (
    <>
      <section className="pt-8 lg:pt-16">
        <div className="container flex items-center justify-between">
          {heading ? <h2 className={displaySectionTitle}>{heading}</h2> : <span />}
          {viewAllHref && (
            <Button variant="outline" asChild className="rounded-full">
              <Link href={viewAllHref}>
                {viewAllLabel}
                <ArrowUpRight className="size-4" />
              </Link>
            </Button>
          )}
        </div>

        {showFilters && (
          <>
            <div className="container mt-6">
            <div className="flex flex-col gap-3 border-b border-border pb-4 sm:flex-row sm:items-center sm:justify-between">
              <SegmentedControl
                label="Group publications"
                options={[
                  { value: 'all' as ViewMode, label: 'By year' },
                  { value: 'venue' as ViewMode, label: 'By venue' },
                  { value: 'theme' as ViewMode, label: 'By theme' },
                  { value: 'type' as ViewMode, label: 'By type' },
                ]}
                value={viewMode}
                onChange={handleViewMode}
              />
              <div className="flex gap-4 text-sm">
                {[
                  { label: 'Open access only', on: openAccessOnly, toggle: () => handleOpenAccess(!openAccessOnly) },
                  { label: 'Collaborations only', on: collaborationsOnly, toggle: () => handleCollaborations(!collaborationsOnly) },
                ].map((f) => (
                  <button
                    key={f.label}
                    type="button"
                    aria-pressed={f.on}
                    onClick={f.toggle}
                    className={cn(
                      'inline-flex items-center gap-2 transition-colors duration-150 ease-snappy',
                      f.on ? 'text-foreground' : 'text-muted-foreground hover:text-foreground',
                    )}
                  >
                    <span
                      aria-hidden
                      className={cn(
                        'grid size-3.5 place-items-center rounded-[3px] border transition-colors duration-150',
                        f.on ? 'border-brand bg-brand text-brand-foreground' : 'border-border',
                      )}
                    >
                      {f.on && <Check className="size-2.5" strokeWidth={3} />}
                    </span>
                    {f.label}
                  </button>
                ))}
              </div>
            </div>
            </div>
            {isFiltered && (
              <div className="container mt-3">
                <p className="text-sm text-muted-foreground">
                  Showing {filtered.length} of {allPubs.length} publications
                  {openAccessOnly && <span> · Open Access</span>}
                  {collaborationsOnly && <span> · Collaborations</span>}
                </p>
              </div>
            )}
          </>
        )}
      </section>

      {groups.length === 0 ? (
        <section className="py-8 lg:py-16">
          <div className="container">
            <p className="text-muted-foreground">No publications match the current filters.</p>
          </div>
        </section>
      ) : (
        <div className="container pt-8 pb-16 lg:pb-32">
          <div className="max-w-4xl">
            <ActiveGroupHeader group={activeGroup} />
            {/* Pulled up under the sticky header so the first group's own
                heading is hidden behind it, as in skiper74. */}
            <div className="-mt-20">
              {groups.map((group, groupIdx) => (
                <section
                  key={groupIdx}
                  ref={register(group.label)}
                  data-group-key={group.label}
                  className="pt-8 first:pt-0 lg:pt-16"
                >
                  <header className="flex h-20 items-end border-b border-foreground/20 pb-2 text-xl font-medium tracking-tight text-foreground/50">
                    <span className="mr-1 text-foreground">{group.label}</span>/ {groupCountLabel(group)}
                  </header>
                  <ul>
                    {group.publications.map((pub) => (
                      <li key={`${pub.id}-${groupIdx}`}>
                        <PublicationRow
                          pub={pub}
                          year={pubYearMap.get(pub.id) ?? 0}
                          showYear={viewMode !== 'all' && pubYearMap.has(pub.id)}
                          highlightAuthors={highlightAuthors}
                        />
                      </li>
                    ))}
                  </ul>
                </section>
              ))}
            </div>
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

const FlatPublicationList = ({ yearGroups, highlightAuthors, showYear = false, className }: FlatPublicationListProps) => {
  const pubYearMap = new Map<string, number>()
  for (const yg of yearGroups) {
    for (const pub of yg.publications) {
      pubYearMap.set(pub.id, yg.year)
    }
  }
  const pubs = yearGroups.flatMap(yg => yg.publications)

  return (
    <div className={className}>
      <Separator />
      {pubs.map((pub, i) => {
        const year = pubYearMap.get(pub.id) ?? 0
        return (
          <Fragment key={pub.id ?? i}>
            <PublicationRow pub={pub} year={year} highlightAuthors={highlightAuthors} showYear={showYear} />
            <Separator />
          </Fragment>
        )
      })}
    </div>
  )
}

// URL-aware wrapper — use this (inside Suspense) on pages with filter UI
function PublicationsSectionWithUrl({
  yearGroups,
  ...rest
}: Omit<PublicationsSectionProps, 'initialViewMode' | 'initialOpenAccess' | 'initialCollaborations' | 'onViewModeChange' | 'onOpenAccessChange' | 'onCollaborationsChange'>) {
  const searchParams = useSearchParams()
  const router = useRouter()
  const pathname = usePathname()

  function pushParams(updates: Record<string, string | null>) {
    const sp = new URLSearchParams(searchParams.toString())
    for (const [k, v] of Object.entries(updates)) {
      if (v === null) sp.delete(k)
      else sp.set(k, v)
    }
    const qs = sp.toString()
    router.push(`${pathname}${qs ? `?${qs}` : ''}`, { scroll: false })
  }

  return (
    <PublicationsSection
      yearGroups={yearGroups}
      showFilters
      {...rest}
      initialViewMode={(searchParams.get('view') as ViewMode) || 'all'}
      initialOpenAccess={searchParams.get('open') === '1'}
      initialCollaborations={searchParams.get('collab') === '1'}
      onViewModeChange={(mode) => pushParams({ view: mode === 'all' ? null : mode })}
      onOpenAccessChange={(val) => pushParams({ open: val ? '1' : null })}
      onCollaborationsChange={(val) => pushParams({ collab: val ? '1' : null })}
    />
  )
}

export { PublicationsSection, PublicationsSectionWithUrl, FlatPublicationList }
