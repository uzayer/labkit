import { CheckCircle2, ChevronRight, Trophy } from 'lucide-react'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { RenderBlocks } from '@/blocks/RenderBlocks'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { DateFormatter } from '@/components/DateFormatter'
import { ProjectTimeline } from '@/components/ProjectTimeline'
import { Award, Project, Publication, ResearchTheme, Team as TeamMember } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { getAuthorObject } from '@/utilities/authorUtils'
import { TeamMemberHoverCard } from '@/components/TeamMemberHoverCard'
import { aggregateProjectAwards } from '@/utilities/aggregateProjectAwards'
// Note: TableOfContents is currently imported from current directory.
// If TableOfContents is not in src/blocks/ProjectPost, we might need to move it or update import.
// Checking file structure suggests it might need attention or it's a new file to create.
// Assuming TableOfContents needs to be accessible. If it was in CustomBlock, we should check.
// For now, I will assume it needs to be imported from where it was or copied.
// Wait, I see `import { TableOfContents } from './TableOfContents'` in the original file.
// I need to check where TableOfContents is.
import { TableOfContents } from '@/blocks/CustomBlock/TableOfContents'
import type { ReactNode } from 'react'

type CaseStudy3Fields = {
  heroImage?: any
  overview?: string | null
  metaItems?: {
    label?: string | null
    value?: string | null
  }[]
  problem?: string | null
  approach?: string | null
  outcomes?: {
    headline?: string | null
  }[]
  shareLabel?: string | null
}

type MetaItem = {
  label: string
  value: string | ReactNode
}

type CaseStudyProps = {
  title?: string | null
  content?: any
  authors?: any[] | null
  populatedAuthors?: { name?: string | null }[] | null
  publishedAt?: string | Date | null
  publicContext: PublicContextProps
  caseStudy3?: CaseStudy3Fields | null
  projectPostCaseStudy3?: CaseStudy3Fields | null
  teamMembers?: (string | TeamMember)[] | null
  themes?: (string | ResearchTheme)[] | { docs?: (string | ResearchTheme)[] | null } | null
  awards?: (string | Award)[] | { docs?: (string | Award)[] | null } | null
  publications?:
    | (string | (Publication & { awards?: { docs?: (Award | string)[] | null } | null }))[]
    | {
        docs?:
          | (string | (Publication & { awards?: { docs?: (Award | string)[] | null } | null }))[]
          | null
      }
    | null
  startDate?: string | null
  endDate?: string | null
  status?: 'ongoing' | 'completed' | null
  overview?: string | null
  appendLayoutBlock?: any[] | null
}

const DEFAULT_OVERVIEW =
  'A modern platform designed to simplify workflows, automate processes, and drive innovation at scale.'
const AUTHOR_SECTION_LABEL = 'Featuring insights from:'
const FALLBACK_AUTHOR_NAME = 'DIAL Staff'

export const ProjectPost1: React.FC<CaseStudyProps> = (props) => {
  const {
    title,
    content,
    publicContext,
    authors,
    populatedAuthors,
    publishedAt,
    teamMembers,
    themes,
    awards,
    publications,
    startDate,
    endDate,
    status,
    appendLayoutBlock,
  } = props || {}

  const caseStudySettings = props.caseStudy3 ?? props.projectPostCaseStudy3 ?? {}

  // Create default meta items
  const defaultMetaItems: MetaItem[] = []
  if (startDate) {
    defaultMetaItems.push({
      label: 'Timeline',
      value: (
        <ProjectTimeline startDate={startDate} endDate={endDate} locale={publicContext?.locale} />
      ),
    })
  }

  // Merge default meta items with manual meta items
  // Manual items take priority if labels match
  const manualMetaItems = caseStudySettings.metaItems ?? []
  const metaItemsMap = new Map<string, MetaItem>()

  // Add default items first
  defaultMetaItems.forEach((item) => {
    metaItemsMap.set(item.label, item)
  })

  // Override with manual items (they take priority)
  manualMetaItems.forEach((item) => {
    if (item?.label) {
      metaItemsMap.set(item.label, {
        label: item.label,
        value: item.value ?? '',
      })
    }
  })

  // Convert map to array
  const mergedMetaItems = Array.from(metaItemsMap.values())

  const heroImage = caseStudySettings.heroImage
  const outcomes = caseStudySettings.outcomes ?? []
  const overviewCopy = props.overview ?? caseStudySettings.overview ?? DEFAULT_OVERVIEW

  const author = getAuthorObject(authors?.[0])
  const populatedAuthorName = populatedAuthors?.[0]?.name
  const displayAuthorName = author?.name ?? populatedAuthorName ?? FALLBACK_AUTHOR_NAME

  // Normalize join fields to arrays for backwards compatibility
  const normalizedAwards = Array.isArray(awards) ? awards : (awards?.docs ?? null)
  const normalizedPublications = Array.isArray(publications)
    ? publications
    : (publications?.docs ?? null)

  // Aggregate awards from both direct project awards and publication awards
  const aggregatedAwards = aggregateProjectAwards({
    awards: normalizedAwards ? { docs: normalizedAwards } : null,
    publications: normalizedPublications ? { docs: normalizedPublications } : null,
  } as Project & {
    publications?: {
      docs?: (Publication & { awards?: { docs?: (Award | string)[] | null } | null })[] | null
    }
    awards?: { docs?: (Award | string)[] | null }
  })

  if (!content) return null

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto flex max-w-prose flex-col items-center justify-between gap-10 lg:max-w-none lg:flex-row">
          <div className="w-full">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/">Home</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Case Study</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
            <h1 className="mt-10 text-5xl font-semibold text-balance lg:text-7xl">{title}</h1>
            {displayAuthorName && (
              <div className="mt-16">
                <p className="font-medium">{AUTHOR_SECTION_LABEL}</p>
                <div className="mt-4">
                  {displayAuthorName && <p className="font-semibold">{displayAuthorName}</p>}
                  {publishedAt && (
                    <p className="text-muted-foreground">
                      on <DateFormatter date={publishedAt} locale={publicContext?.locale} />
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
          {heroImage && typeof heroImage !== 'string' && (
            <div className="max-h-[524px] w-full rounded-xl border">
              <Media
                resource={heroImage}
                imgClassName="max-h-[524px] w-full rounded-xl object-cover"
              />
            </div>
          )}
        </div>

        <div className="relative mt-20 flex flex-col gap-x-6 gap-y-16 lg:flex-row">
          <aside className="h-fit w-full lg:sticky lg:top-10 lg:mx-0 lg:w-64 lg:max-w-none">
            {aggregatedAwards && aggregatedAwards.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Trophy className="h-5 w-5 md:h-6 md:w-6" />
                    Awards & Recognition
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {aggregatedAwards.map((award) => {
                      const awardTitle = typeof award.title === 'string' ? award.title : ''
                      const awardYear = typeof award.year === 'number' ? award.year : null
                      return (
                        <Badge
                          key={award.id}
                          variant="outline"
                          className="max-w-full break-words whitespace-normal"
                        >
                          {awardTitle}
                          {awardYear && ` (${awardYear})`}
                        </Badge>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            <div className="mb-6">
              <h2 className="font-semibold">Overview</h2>
              <p className="text-muted-foreground mt-1 text-sm">{overviewCopy}</p>
              {(() => {
                const normalizedThemes = Array.isArray(themes) ? themes : (themes?.docs ?? null)
                if (!normalizedThemes || normalizedThemes.length === 0) return null
                return (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {normalizedThemes
                      .filter(
                        (theme): theme is ResearchTheme =>
                          typeof theme !== 'string' && theme?.title != null,
                      )
                      .map((theme) => (
                        <a
                          key={theme.id}
                          href="#"
                          className="hover:bg-accent hover:text-accent-foreground"
                        >
                          <Badge variant="outline">{theme.title}</Badge>
                        </a>
                      ))}
                  </div>
                )
              })()}
            </div>
            {mergedMetaItems.length > 0 && (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
                {mergedMetaItems.map((item, index) => {
                  if (!item?.label) return null
                  const isStringValue = typeof item.value === 'string'
                  return (
                    <div key={`${item.label}-${index}`} className="col-span-2 lg:col-span-1">
                      {item.label && <h2 className="font-semibold">{item.label}</h2>}
                      {isStringValue ? (
                        <p className="text-muted-foreground mt-1 text-sm">{item.value}</p>
                      ) : (
                        <div className="text-muted-foreground mt-1 text-sm">{item.value}</div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            {teamMembers && teamMembers.length > 0 && (
              <div className="mt-10">
                <h2 className="mb-4 font-semibold">Project Team</h2>
                <div className="flex flex-col gap-4">
                  {teamMembers
                    .filter((member) => typeof member !== 'string' && member?.name)
                    .slice(0, 4)
                    .map((member) => {
                      const teamMember = member as TeamMember
                      return <TeamMemberHoverCard key={teamMember.id} teamMember={teamMember} />
                    })}
                  {teamMembers.filter((member) => typeof member !== 'string' && member?.name)
                    .length > 4 && (
                    <Collapsible>
                      <CollapsibleTrigger className="hover:bg-muted flex w-full items-center justify-between rounded-md px-3 py-2 text-sm font-medium">
                        <div className="flex items-center gap-2">
                          <ChevronRight className="h-4 w-4" />
                          <span>Show more</span>
                        </div>
                        <Badge variant="secondary">
                          {teamMembers.filter(
                            (member) => typeof member !== 'string' && member?.name,
                          ).length - 4}
                        </Badge>
                      </CollapsibleTrigger>
                      <CollapsibleContent className="mt-1 ml-6 space-y-4 border-l pl-3">
                        {teamMembers
                          .filter((member) => typeof member !== 'string' && member?.name)
                          .slice(4)
                          .map((member) => {
                            const teamMember = member as TeamMember
                            return (
                              <TeamMemberHoverCard key={teamMember.id} teamMember={teamMember} />
                            )
                          })}
                      </CollapsibleContent>
                    </Collapsible>
                  )}
                </div>
              </div>
            )}
            <div className="mt-10 flex flex-col">
              <span className="text-muted-foreground mb-2 text-sm">
                {caseStudySettings.shareLabel || 'Share this content:'}
              </span>
              <div className="flex gap-4">
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <FaLinkedin className="size-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <FaTwitter className="size-5" />
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary">
                  <FaFacebook className="size-5" />
                </a>
              </div>
            </div>
          </aside>

          <div className="flex w-full flex-col gap-10 lg:flex-row lg:items-start lg:gap-16">
            <div className="mx-auto max-w-prose flex-1 lg:max-w-4xl lg:px-20">
              <div className="grid gap-x-10 gap-y-7 rounded-3xl border p-6 lg:grid-cols-2 lg:gap-y-10 lg:border-none lg:p-0">
                {caseStudySettings.problem && (
                  <div>
                    <h2 className="text-xl font-semibold">Problem</h2>
                    <p className="text-muted-foreground mt-3">{caseStudySettings.problem}</p>
                  </div>
                )}
                {caseStudySettings.problem && caseStudySettings.approach && (
                  <Separator className="w-full lg:hidden" />
                )}
                {caseStudySettings.approach && (
                  <div>
                    <h2 className="text-xl font-semibold">Approach</h2>
                    <p className="text-muted-foreground mt-3">{caseStudySettings.approach}</p>
                  </div>
                )}
                {outcomes.length > 0 && (
                  <div className="border-t pt-10 lg:col-span-2">
                    <h2 className="text-xl font-semibold">Outcomes</h2>
                    <ul className="mt-3 grid gap-x-10 gap-y-3 lg:grid-cols-2">
                      {outcomes.map((outcome, index) =>
                        outcome?.headline ? (
                          <li key={`${outcome.headline}-${index}`} className="flex gap-3">
                            <CheckCircle2 className="mt-0.5 size-5 shrink-0" />
                            <p className="font-semibold">{outcome.headline}</p>
                          </li>
                        ) : null,
                      )}
                    </ul>
                  </div>
                )}
              </div>
              {content && (
                <div className="prose dark:prose-invert mt-20">
                  <RichText content={content} publicContext={publicContext} withWrapper={false} />
                </div>
              )}
              {appendLayoutBlock && appendLayoutBlock.length > 0 && (
                <div className="mt-20">
                  <RenderBlocks blocks={appendLayoutBlock} publicContext={publicContext} />
                </div>
              )}
            </div>

            <TableOfContents content={content} />
          </div>
        </div>
      </div>
    </section>
  )
}
