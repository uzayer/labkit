'use client'

import { Fragment, useState } from 'react'
import { ArrowUpRight, Copy, FileText, Quote, Trophy } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'

export type MemberPublication = {
  id: string
  title: string
  authors: string
  venue: string
  year: number
  award?: string
  pdfLink?: string
  projectLink?: string
  citationText?: string
}

interface MemberPublicationsProps {
  memberName: string
  publications: MemberPublication[]
  scholarUrl?: string
}

const YEAR_PAGE_SIZE = 5

function BoldName({ authors, name }: { authors: string; name: string }) {
  const parts = authors.split(name)
  if (parts.length === 1) return <span>{authors}</span>
  return (
    <>
      {parts.map((part, i) => (
        <Fragment key={i}>
          {part}
          {i < parts.length - 1 && <strong>{name}</strong>}
        </Fragment>
      ))}
    </>
  )
}

function PubActions({ pub }: { pub: MemberPublication }) {
  const copyToClipboard = async (text: string) => {
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
      {pub.citationText && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              <Quote className="size-4" />
              Cite
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[calc(100vw-2rem)] max-w-80">
            <div className="flex flex-col gap-2">
              <p className="text-sm">{pub.citationText}</p>
              <Button
                size="icon"
                variant="outline"
                onClick={() => copyToClipboard(pub.citationText!)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </PopoverContent>
        </Popover>
      )}
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

function YearGroup({
  year,
  pubs,
  memberName,
}: {
  year: number
  pubs: MemberPublication[]
  memberName: string
}) {
  const [expanded, setExpanded] = useState(false)
  const visible = expanded ? pubs : pubs.slice(0, YEAR_PAGE_SIZE)
  const hasMore = pubs.length > YEAR_PAGE_SIZE

  return (
    <div className="py-14 md:py-20">
      <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
        <div className="flex w-full max-w-56 items-center gap-3 font-mono text-2xl">
          <span className="bg-primary size-2 rounded-full" />
          {year}
        </div>
        <div className="w-full min-w-0 flex-1">
          <Separator />
          {visible.map((pub, pubIdx) => (
            <Fragment key={pub.id}>
              <div className="py-6">
                <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_1fr]">
                  <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
                    <p className="text-primary inline text-xl text-pretty">{pub.title}</p>
                    <p className="text-muted-foreground text-sm">
                      <BoldName authors={pub.authors} name={memberName} />
                    </p>
                  </div>

                  {/* Desktop footer */}
                  <div className="hidden items-center justify-between gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:flex">
                    <div className="flex flex-wrap gap-2">
                      {pub.venue && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                        >
                          {pub.venue}
                        </Button>
                      )}
                      {pub.award && (
                        <Button
                          variant="ghost"
                          size="sm"
                          className="bg-amber-500 text-amber-950 hover:bg-amber-600"
                        >
                          <Trophy className="size-4" />
                          {pub.award}
                        </Button>
                      )}
                    </div>
                    <PubActions pub={pub} />
                  </div>

                  {/* Mobile footer */}
                  <div className="flex flex-col gap-4 lg:hidden">
                    {(pub.venue || pub.award) && (
                      <div className="flex flex-wrap gap-2">
                        {pub.venue && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-black text-white hover:bg-gray-900 dark:bg-white dark:text-black dark:hover:bg-gray-100"
                          >
                            {pub.venue}
                          </Button>
                        )}
                        {pub.award && (
                          <Button
                            variant="ghost"
                            size="sm"
                            className="bg-amber-500 text-amber-950 hover:bg-amber-600"
                          >
                            <Trophy className="size-4" />
                            {pub.award}
                          </Button>
                        )}
                      </div>
                    )}
                    <PubActions pub={pub} />
                  </div>
                </div>
              </div>
              {pubIdx < visible.length - 1 && <Separator />}
            </Fragment>
          ))}
          {hasMore && (
            <>
              <Separator />
              <div className="pt-4">
                <Button variant="ghost" size="sm" onClick={() => setExpanded(!expanded)}>
                  {expanded ? 'Show fewer' : `Show ${pubs.length - YEAR_PAGE_SIZE} more`}
                </Button>
              </div>
            </>
          )}
          <Separator />
        </div>
      </div>
    </div>
  )
}

const MemberPublications = ({ memberName, publications, scholarUrl }: MemberPublicationsProps) => {
  const byYear = publications.reduce<Record<number, MemberPublication[]>>((acc, pub) => {
    if (!acc[pub.year]) acc[pub.year] = []
    acc[pub.year].push(pub)
    return acc
  }, {})

  const years = Object.keys(byYear)
    .map(Number)
    .sort((a, b) => b - a)

  // Pin award-winning papers to top within each year group
  for (const year of years) {
    byYear[year].sort((a, b) => {
      if (a.award && !b.award) return -1
      if (!a.award && b.award) return 1
      return 0
    })
  }

  return (
    <section className="py-4">
      <div className="container">
        <div className="flex items-end justify-between">
          <h2 className="text-2xl font-semibold">Publications</h2>
          {scholarUrl && (
            <a
              href={scholarUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
            >
              View all on Google Scholar
              <ArrowUpRight className="size-3.5" />
            </a>
          )}
        </div>

        {publications.length === 0 ? (
          <p className="mt-8 text-muted-foreground">Publications coming soon.</p>
        ) : (
          <div>
            {years.map((year) => (
              <YearGroup key={year} year={year} pubs={byYear[year]} memberName={memberName} />
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export { MemberPublications }
