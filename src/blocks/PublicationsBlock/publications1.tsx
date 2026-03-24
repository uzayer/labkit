'use client'

import { ArrowUpRight, Copy, FileText, Quote, Trophy } from 'lucide-react'
import { Fragment } from 'react'

import { Button } from '@/components/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import RichText from '@/components/RichText'
import type { PublicationsBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

type Publications1Props = PublicationsBlock & {
  publicContext: PublicContextProps
}

const Publications1: React.FC<Publications1Props> = ({ richText, years, publicContext }) => {
  if (!years || years.length === 0) return null

  // Safe copy to clipboard function with fallback
  const copyToClipboard = async (text: string) => {
    try {
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(text)
        return
      }

      if (typeof window !== 'undefined') {
        window.prompt('Copy this citation text:', text)
      }
    } catch (err) {
      console.error('Failed to copy text:', err)
    }
  }

  // Sort years in descending order (newest first)
  const sortedYears = [...years].sort((a, b) => {
    const yearA = a.year || 0
    const yearB = b.year || 0
    return yearB - yearA
  })

  return (
    <>
      {sortedYears.map((yearGroup, yearIdx) => {
        const year = yearGroup.year || 0
        const publications = yearGroup.publications || []

        if (!publications || publications.length === 0) return null

        return (
          <section key={yearGroup.id || yearIdx} className="py-8 lg:py-16">
            <div className="container">
              <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
                <div className="flex w-full max-w-56 items-center gap-3 text-2xl">
                  <span className="bg-primary size-2 rounded-full"></span>
                  {year || 'Unknown'}
                </div>
                <div className="w-full min-w-0 flex-1">
                  {richText && (
                    <RichText
                      publicContext={publicContext}
                      content={richText}
                      withWrapper={false}
                      className="text-3xl"
                      overrideStyle={{
                        h2: 'text-3xl mb-0',
                        p: 'text-3xl mb-0',
                      }}
                    />
                  )}
                  <div className={richText ? 'mt-14' : ''}>
                    <Separator />
                    {publications.map((publication, pubIdx) => {
                      const pdfLink = publication.pdfLink
                      const citationText = publication.citationText
                      const projectLink = publication.projectLink
                      const venue = publication.venue
                      const award = publication.award

                      return (
                        <Fragment key={publication.id || pubIdx}>
                          <div className="py-6">
                            <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_1fr]">
                              {/* Title and Authors - Desktop: top-left (col 1, row 1) */}
                              <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
                                <p className="text-primary inline text-xl text-pretty">
                                  {publication.title}
                                </p>
                                <p className="text-muted-foreground text-sm">
                                  {publication.authors}
                                </p>
                              </div>

                              {/* Desktop Footer: [Venue] [Award] ........... [Actions] */}
                              <div className="hidden items-center justify-between gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:flex">
                                {/* Left side: Venue and Award */}
                                <div className="flex flex-wrap gap-2">
                                  {venue && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="bg-black text-white hover:bg-gray-900"
                                    >
                                      {venue}
                                    </Button>
                                  )}
                                  {award && (
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="bg-amber-500 text-amber-950 hover:bg-amber-600"
                                    >
                                      <Trophy className="size-4" />
                                      {award}
                                    </Button>
                                  )}
                                </div>

                                {/* Right side: Action buttons */}
                                {(pdfLink || citationText || projectLink) && (
                                  <div className="flex flex-wrap justify-end gap-2">
                                    {pdfLink && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                                          <FileText className="size-4" />
                                          PDF
                                        </a>
                                      </Button>
                                    )}
                                    {citationText && (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Quote className="size-4" />
                                            Cite
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[calc(100vw-2rem)] max-w-80">
                                          <div className="space-y-2">
                                            <p className="text-sm">{citationText}</p>
                                            <Button
                                              size="icon"
                                              variant="outline"
                                              onClick={() => {
                                                copyToClipboard(citationText)
                                              }}
                                            >
                                              <Copy className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                    {projectLink && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <a
                                          href={projectLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ArrowUpRight className="size-4" />
                                          Project
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                )}
                              </div>

                              {/* Mobile Footer: Line 1: [Venue] [Award], Line 2: [PDF] [Cite] */}
                              <div className="flex flex-col gap-4 lg:hidden">
                                {/* Line 1: Venue and Award */}
                                {(venue || award) && (
                                  <div className="flex flex-wrap gap-2">
                                    {venue && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-black text-white hover:bg-gray-900"
                                      >
                                        {venue}
                                      </Button>
                                    )}
                                    {award && (
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        className="bg-amber-500 text-amber-950 hover:bg-amber-600"
                                      >
                                        <Trophy className="size-4" />
                                        {award}
                                      </Button>
                                    )}
                                  </div>
                                )}

                                {/* Line 2: Action buttons with space */}
                                {(pdfLink || citationText || projectLink) && (
                                  <div className="flex flex-wrap gap-4">
                                    {pdfLink && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <a href={pdfLink} target="_blank" rel="noopener noreferrer">
                                          <FileText className="size-4" />
                                          PDF
                                        </a>
                                      </Button>
                                    )}
                                    {citationText && (
                                      <Popover>
                                        <PopoverTrigger asChild>
                                          <Button variant="ghost" size="sm">
                                            <Quote className="size-4" />
                                            Cite
                                          </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-[calc(100vw-2rem)] max-w-80">
                                          <div className="space-y-2">
                                            <p className="text-sm">{citationText}</p>
                                            <Button
                                              size="icon"
                                              variant="outline"
                                              onClick={() => {
                                                copyToClipboard(citationText)
                                              }}
                                            >
                                              <Copy className="h-4 w-4" />
                                            </Button>
                                          </div>
                                        </PopoverContent>
                                      </Popover>
                                    )}
                                    {projectLink && (
                                      <Button variant="ghost" size="sm" asChild>
                                        <a
                                          href={projectLink}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ArrowUpRight className="size-4" />
                                          Project
                                        </a>
                                      </Button>
                                    )}
                                  </div>
                                )}
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
            </div>
          </section>
        )
      })}
    </>
  )
}

export default Publications1
