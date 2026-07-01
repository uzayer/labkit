'use client'

import { ArrowUpRight, Check, Copy, FileText, LockOpen, Quote, Trophy, Users } from 'lucide-react'
import { Fragment, useState } from 'react'
import { useRouter, usePathname, useSearchParams } from 'next/navigation'


import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'

const LAB_PIS = ['Nova Ahmed', 'Ishtiaque Ahmed']

export type Publication = {
  id: string
  title: string
  authors: string
  venue?: string | null
  award?: string | null
  pdfLink?: string | null
  projectLink?: string | null
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

export const SAMPLE_PUBLICATIONS: PublicationYear[] = [
  {
    year: 2024,
    publications: [
      {
        id: '1',
        title: 'Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh',
        authors: 'Nova Ahmed, Raisa Islam, Tanvir Hossain, Md. Shafiul Alam',
        venue: 'CHI',
        award: 'Best Paper',
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Islam, R., Hossain, T., & Alam, M. S. (2024). Jyoti: Designing a Low-Literacy Voice Interface for Rural Health Information Access in Bangladesh. In Proceedings of CHI 2024. ACM.`,
        themes: ['ICTD', 'Accessibility & Inclusion'],
        isOpenAccess: true,
        isCollaboration: false,
        type: 'conference',
      },
      {
        id: '2',
        title: 'Shathi: Understanding Financial Inclusion Barriers for Women Garment Workers Through a Participatory Lens',
        authors: 'Nova Ahmed, Fariha Chowdhury, Sabbir Rahman',
        venue: 'CSCW',
        award: null,
        pdfLink: '#',
        projectLink: null,
        citationText: `Ahmed, N., Chowdhury, F., & Rahman, S. (2024). Shathi: Understanding Financial Inclusion Barriers for Women Garment Workers Through a Participatory Lens. In Proceedings of CSCW 2024. ACM.`,
        themes: ['ICTD', 'Gender & Feminist HCI'],
        isOpenAccess: false,
        isCollaboration: true,
        type: 'conference',
      },
    ],
  },
  {
    year: 2023,
    publications: [
      {
        id: '3',
        title: 'Mon Bina: Investigating Mental Health Help-Seeking Behaviors Among University Students in Bangladesh',
        authors: 'Nova Ahmed, Lamia Alam, Ishtiaque Ahmed',
        venue: 'SOUPS',
        award: 'Impact Award',
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Alam, L., & Ahmed, I. (2023). Mon Bina: Investigating Mental Health Help-Seeking Behaviors Among University Students in Bangladesh. In Proceedings of SOUPS 2023. USENIX.`,
        themes: ['Mental Health & Wellbeing'],
        isOpenAccess: true,
        isCollaboration: true,
        type: 'conference',
      },
      {
        id: '4',
        title: 'Poisha: Toward Explainable Mobile Money Interfaces for Underserved Communities',
        authors: 'Nova Ahmed, Tanvir Hossain, Md. Rifat Hasan',
        venue: 'UIST',
        award: null,
        pdfLink: '#',
        projectLink: '#',
        citationText: `Ahmed, N., Hossain, T., & Hasan, M. R. (2023). Poisha: Toward Explainable Mobile Money Interfaces for Underserved Communities. In Proceedings of UIST 2023. ACM.`,
        themes: ['ICTD', 'Explainable AI & ML'],
        isOpenAccess: false,
        isCollaboration: false,
        type: 'conference',
      },
    ],
  },
]

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

function AuthorList({ authors }: { authors: string }) {
  const parts = authors.split(', ')
  return (
    <>
      {parts.map((name, i) => {
        const bold = LAB_PIS.includes(name.trim())
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
        <Button variant="outline" onClick={handleCopy} className="w-full">
          {copied ? (
            <>
              <Check className="size-4" />
              Copied!
            </>
          ) : (
            <>
              <Copy className="size-4" />
              Copy
            </>
          )}
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

type ViewMode = 'all' | 'venue' | 'theme' | 'type'

type Group = {
  label: string
  publications: Publication[]
}

interface PublicationsSectionProps {
  yearGroups: PublicationYear[]
  heading?: string
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

  return (
    <>
      <section className="pt-8 lg:pt-16">
        <div className="container flex items-center justify-between">
          <h2 className="text-3xl font-semibold">{heading}</h2>
          {viewAllHref && (
            <Button variant="outline" asChild>
              <a href={viewAllHref}>
                {viewAllLabel}
                <ArrowUpRight className="size-4" />
              </a>
            </Button>
          )}
        </div>

        {showFilters && (
          <>
            <div className="container mt-6 flex flex-wrap items-center gap-2">
              <Button
                variant={viewMode === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewMode('all')}
              >
                All
              </Button>
              <Button
                variant={viewMode === 'venue' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewMode('venue')}
              >
                By Venue
              </Button>
              <Button
                variant={viewMode === 'theme' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewMode('theme')}
              >
                By Theme
              </Button>
              <Button
                variant={viewMode === 'type' ? 'default' : 'outline'}
                size="sm"
                onClick={() => handleViewMode('type')}
              >
                By Type
              </Button>
              <Separator orientation="vertical" className="mx-1 h-5" />
              <Button
                variant={openAccessOnly ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleOpenAccess(!openAccessOnly)}
              >
                Open Access
              </Button>
              <Button
                variant={collaborationsOnly ? 'default' : 'ghost'}
                size="sm"
                onClick={() => handleCollaborations(!collaborationsOnly)}
              >
                Collaborations
              </Button>
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
        groups.map((group, groupIdx) => (
          <section key={groupIdx} className="py-8 lg:py-16">
            <div className="container">
              <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
                <div className="flex w-full max-w-56 items-center gap-3 text-2xl">
                  <span className="bg-primary size-2 rounded-full" />
                  <span>{group.label}</span>
                  <span className="text-base font-normal text-muted-foreground">({group.publications.length})</span>
                </div>
                <div className="w-full min-w-0 flex-1">
                  <Separator />
                  {group.publications.map((pub, pubIdx) => {
                    const pubYear = pubYearMap.get(pub.id) ?? 0
                    return (
                      <Fragment key={`${pub.id}-${groupIdx}` || pubIdx}>
                        <div className="py-6">
                          <div className="flex flex-col gap-4">
                            <div className="flex flex-col gap-2">
                              <p className="text-primary inline text-xl text-pretty">{pub.title}</p>
                              <p className="text-sm text-muted-foreground">
                                <AuthorList authors={pub.authors} />
                                {viewMode !== 'all' && pubYearMap.has(pub.id) && (
                                  <span className="before:mx-2 before:content-['·']">{pubYear}</span>
                                )}
                              </p>
                            </div>
                            <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                              <div className="flex flex-wrap items-center gap-2">
                                {pub.venue && (
                                  <Button variant="ghost" size="sm" className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                                    {pub.venue}
                                  </Button>
                                )}
                                {pub.type && (
                                  <Badge variant="outline" className="font-normal">
                                    {TYPE_LABELS[pub.type] ?? pub.type}
                                  </Badge>
                                )}
                                {pub.award && (
                                  <Button variant="ghost" size="sm" className="bg-amber-500 text-amber-950 hover:bg-amber-600">
                                    <Trophy className="size-4" />
                                    {pub.award}
                                  </Button>
                                )}
                                {pub.isOpenAccess && (
                                  <span title="Open Access" className="text-muted-foreground">
                                    <LockOpen className="size-4" />
                                  </span>
                                )}
                                {pub.isCollaboration && (
                                  <span title="External Collaboration" className="text-muted-foreground">
                                    <Users className="size-4" />
                                  </span>
                                )}
                              </div>
                              <PubActions pub={pub} year={pubYear} />
                            </div>
                          </div>
                        </div>
                        <Separator />
                      </Fragment>
                    )
                  })}
                </div>
              </div>
            </div>
          </section>
        ))
      )}
    </>
  )
}

interface FlatPublicationListProps {
  yearGroups: PublicationYear[]
  className?: string
}

const FlatPublicationList = ({ yearGroups, className }: FlatPublicationListProps) => {
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
            <div className="py-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col gap-2">
                  <p className="text-primary inline text-xl text-pretty">{pub.title}</p>
                  <p className="text-sm text-muted-foreground">
                    <AuthorList authors={pub.authors} />
                  </p>
                </div>
                <div className="flex flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex flex-wrap items-center gap-2">
                    {pub.venue && (
                      <Button variant="ghost" size="sm" className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100">
                        {pub.venue}
                      </Button>
                    )}
                    {pub.type && (
                      <Badge variant="outline" className="font-normal">
                        {TYPE_LABELS[pub.type] ?? pub.type}
                      </Badge>
                    )}
                    {pub.award && (
                      <Button variant="ghost" size="sm" className="bg-amber-500 text-amber-950 hover:bg-amber-600">
                        <Trophy className="size-4" />
                        {pub.award}
                      </Button>
                    )}
                    {pub.isOpenAccess && (
                      <span title="Open Access" className="text-muted-foreground">
                        <LockOpen className="size-4" />
                      </span>
                    )}
                    {pub.isCollaboration && (
                      <span title="External Collaboration" className="text-muted-foreground">
                        <Users className="size-4" />
                      </span>
                    )}
                  </div>
                  <PubActions pub={pub} year={year} />
                </div>
              </div>
            </div>
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
