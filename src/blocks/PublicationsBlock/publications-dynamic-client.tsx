'use client'

import { ArrowUpRight, Copy, FileText, Plus, Quote, Trophy } from 'lucide-react'
import { Fragment, useState } from 'react'

import { Button } from '@/components/ui/button'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Separator } from '@/components/ui/separator'
import RichText from '@/components/RichText'
import type { PublicationsBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

export interface FormattedPublication {
  id: string
  title: string
  authorsFormatted: string
  hasCoFirstAuthors: boolean
  venue: string | null
  awards: { id: string; title: string }[]
  pdfUrl: string | null
  citationText: string | null
  bibtex: string | null
  projects: { id: string; title: string; slug: string }[]
  externalUrl: string | null
}

interface YearGroup {
  year: number
  publications: FormattedPublication[]
}

export interface PublicationsDynamicClientProps {
  publicContext: PublicContextProps
  richText?: PublicationsBlock['richText']
  yearGroups: YearGroup[]
  overflowPublications: FormattedPublication[]
  overflowYearGroups: YearGroup[]
}

export function PublicationsDynamicClient({
  publicContext,
  richText,
  yearGroups,
  overflowPublications,
  overflowYearGroups,
}: PublicationsDynamicClientProps) {
  const [isOverflowOpen, setIsOverflowOpen] = useState(false)

  const copyToClipboard = async (text: string) => {
    if (!text) return

    try {
      if (typeof navigator !== 'undefined' && navigator?.clipboard?.writeText) {
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

  if (!yearGroups.length && !overflowYearGroups.length) return null

  return (
    <>
      {yearGroups.map((group, idx) => (
        <YearSection
          key={group.year}
          year={group.year}
          publications={group.publications}
          richText={richText}
          publicContext={publicContext}
          copyToClipboard={copyToClipboard}
          isFirst={idx === 0}
        />
      ))}

      {overflowPublications.length > 0 && overflowYearGroups.length > 0 && (
        <section className="py-4 lg:py-8">
          <div className="container">
            <Collapsible
              open={isOverflowOpen}
              onOpenChange={setIsOverflowOpen}
              className="w-full space-y-2"
            >
              <CollapsibleTrigger className="flex items-center gap-2 py-4 text-sm font-medium hover:underline">
                <Plus className="h-4 w-4" />
                {isOverflowOpen
                  ? 'Hide additional publications'
                  : `Show ${overflowPublications.length} more publications`}
              </CollapsibleTrigger>
              <CollapsibleContent className="space-y-0">
                {overflowYearGroups.map((group, idx) => (
                  <YearSection
                    key={group.year}
                    year={group.year}
                    publications={group.publications}
                    richText={undefined}
                    publicContext={publicContext}
                    copyToClipboard={copyToClipboard}
                    isFirst={idx === 0 && yearGroups.length === 0}
                  />
                ))}
              </CollapsibleContent>
            </Collapsible>
          </div>
        </section>
      )}
    </>
  )
}

interface YearSectionProps {
  year: number
  publications: FormattedPublication[]
  richText?: PublicationsBlock['richText']
  publicContext: PublicContextProps
  copyToClipboard: (text: string) => void
  isFirst: boolean
}

function YearSection({
  year,
  publications,
  richText,
  publicContext,
  copyToClipboard,
  isFirst,
}: YearSectionProps) {
  if (!publications.length) return null

  return (
    <section className="py-8 lg:py-16">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
          <div className="flex w-full max-w-56 items-center gap-3 text-2xl">
            <span className="bg-primary size-2 rounded-full" />
            {year || 'Unknown'}
          </div>

          <div className="w-full min-w-0 flex-1">
            {isFirst && richText && (
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

            <div className={isFirst && richText ? 'mt-14' : ''}>
              <Separator />
              {publications.map((publication, idx) => (
                <Fragment key={publication.id || idx}>
                  <PublicationItem publication={publication} copyToClipboard={copyToClipboard} />
                  <Separator />
                </Fragment>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

interface PublicationItemProps {
  publication: FormattedPublication
  copyToClipboard: (text: string) => void
}

function PublicationItem({ publication, copyToClipboard }: PublicationItemProps) {
  const {
    title,
    authorsFormatted,
    hasCoFirstAuthors,
    venue,
    awards,
    pdfUrl,
    citationText,
    bibtex,
    projects,
  } = publication

  const hasCitation = Boolean(citationText || bibtex)
  const citationCopyText = bibtex || citationText || ''

  return (
    <div className="py-6">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_auto] lg:grid-rows-[auto_1fr]">
        <div className="flex flex-col gap-2 lg:col-start-1 lg:row-start-1">
          <p className="text-primary inline text-xl text-pretty">{title}</p>
          {authorsFormatted ? (
            <p className="text-muted-foreground text-sm">{authorsFormatted}</p>
          ) : (
            <p className="text-muted-foreground text-sm italic">Author information unavailable</p>
          )}
        </div>

        <div className="hidden items-center justify-between gap-4 lg:col-span-2 lg:col-start-1 lg:row-start-2 lg:flex">
          <div className="flex flex-wrap gap-2">
            {venue && (
              <Button variant="ghost" size="sm" className="bg-black text-white hover:bg-gray-900">
                {venue}
              </Button>
            )}
            {awards.map((award) => (
              <Button
                key={award.id}
                variant="ghost"
                size="sm"
                className="bg-amber-500 text-amber-950 hover:bg-amber-600"
              >
                <Trophy className="size-4" />
                {award.title}
              </Button>
            ))}
          </div>

          <div className="flex flex-wrap justify-end gap-2">
            {pdfUrl && (
              <Button variant="ghost" size="sm" asChild>
                <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                  <FileText className="size-4" />
                  PDF
                </a>
              </Button>
            )}

            {hasCitation && (
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="sm">
                    <Quote className="size-4" />
                    Cite
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[calc(100vw-2rem)] max-w-80">
                  <div className="space-y-2">
                    {citationText && <p className="text-sm">{citationText}</p>}
                    {bibtex && (
                      <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">{bibtex}</pre>
                    )}
                    <Button
                      size="icon"
                      variant="outline"
                      onClick={() => {
                        copyToClipboard(citationCopyText)
                      }}
                    >
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            <ProjectLinks projects={projects} />
          </div>
        </div>

        <div className="flex flex-col gap-4 lg:hidden">
          {(venue || awards.length > 0) && (
            <div className="flex flex-wrap gap-2">
              {venue && (
                <Button variant="ghost" size="sm" className="bg-black text-white hover:bg-gray-900">
                  {venue}
                </Button>
              )}
              {awards.map((award) => (
                <Button
                  key={award.id}
                  variant="ghost"
                  size="sm"
                  className="bg-amber-500 text-amber-950 hover:bg-amber-600"
                >
                  <Trophy className="size-4" />
                  {award.title}
                </Button>
              ))}
            </div>
          )}

          {(pdfUrl || hasCitation || projects.length > 0) && (
            <div className="flex flex-wrap gap-4">
              {pdfUrl && (
                <Button variant="ghost" size="sm" asChild>
                  <a href={pdfUrl} target="_blank" rel="noopener noreferrer">
                    <FileText className="size-4" />
                    PDF
                  </a>
                </Button>
              )}

              {hasCitation && (
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Quote className="size-4" />
                      Cite
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-[calc(100vw-2rem)] max-w-80">
                    <div className="space-y-2">
                      {citationText && <p className="text-sm">{citationText}</p>}
                      {bibtex && (
                        <pre className="bg-muted overflow-x-auto rounded p-2 text-xs">{bibtex}</pre>
                      )}
                      <Button
                        size="icon"
                        variant="outline"
                        onClick={() => {
                          copyToClipboard(citationCopyText)
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </PopoverContent>
                </Popover>
              )}

              <ProjectLinks projects={projects} />
            </div>
          )}
        </div>
      </div>

      {hasCoFirstAuthors && (
        <p className="text-muted-foreground mt-4 text-xs">* denotes equal contribution</p>
      )}
    </div>
  )
}

interface ProjectLinksProps {
  projects: FormattedPublication['projects']
}

function ProjectLinks({ projects }: ProjectLinksProps) {
  if (!projects || projects.length === 0) return null

  const [firstProject, ...remainingProjects] = projects

  return (
    <div className="flex flex-wrap gap-2">
      {firstProject && (
        <Button variant="ghost" size="sm" asChild>
          <a href={`/projects/${firstProject.slug}`}>
            <ArrowUpRight className="size-4" />
            Project
          </a>
        </Button>
      )}

      {remainingProjects.length > 0 && (
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm">
              +{remainingProjects.length} more
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-64">
            <div className="space-y-2">
              <h4 className="text-sm font-semibold">Related Projects</h4>
              {remainingProjects.map((project) => (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="flex items-center gap-2 text-sm hover:underline"
                >
                  <ArrowUpRight className="size-4" />
                  {project.title}
                </a>
              ))}
            </div>
          </PopoverContent>
        </Popover>
      )}
    </div>
  )
}

export default PublicationsDynamicClient
