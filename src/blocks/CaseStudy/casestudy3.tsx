'use client'

import { AlignLeft, CheckCircle2 } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'
import { FaFacebook, FaLinkedin, FaTwitter } from 'react-icons/fa'

import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { Separator } from '@/components/ui/separator'
import { DateFormatter } from '@/components/DateFormatter'
import { Post } from '@/payload-types'
import { cn } from '@/utils'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { getSideMenuStructure } from '@/utilities/richtext'
import { getAuthorObject } from '@/utilities/authorUtils'

type CaseStudy3Fields = {
  heroImage?: NonNullable<Post['bannerImage']> | string | null
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

type CaseStudyPost = Post & {
  caseStudy3?: CaseStudy3Fields | null
}

const DEFAULT_OVERVIEW =
  'A modern platform designed to simplify workflows, automate processes, and drive innovation at scale.'
const AUTHOR_SECTION_LABEL = 'Featuring insights from:'
const FALLBACK_AUTHOR_NAME = 'DIAL Staff'

export const CaseStudy3: React.FC<CaseStudyPost & { publicContext: PublicContextProps }> = (
  props,
) => {
  const { title, content, publicContext, authors, populatedAuthors, publishedAt } = props || {}

  const caseStudySettings = props.caseStudy3 ?? {}

  const sideMenuStructure = useMemo(() => {
    return content ? getSideMenuStructure(content, { headlineLevels: ['h2', 'h3'] }) : []
  }, [content])

  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    if (sideMenuStructure.length === 0) return

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id)
          }
        })
      },
      {
        root: null,
        rootMargin: '0px',
        threshold: 0.2,
      },
    )

    sideMenuStructure.forEach((item) => {
      const element = document.getElementById(item.id)
      if (element) {
        observer.observe(element)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [sideMenuStructure])

  const heroImage = caseStudySettings.heroImage
  const metaItems = caseStudySettings.metaItems ?? []
  const outcomes = caseStudySettings.outcomes ?? []
  const overviewCopy = caseStudySettings.overview ?? DEFAULT_OVERVIEW

  const author = getAuthorObject(authors?.[0])
  const populatedAuthorName = populatedAuthors?.[0]?.name
  const displayAuthorName = author?.name ?? populatedAuthorName ?? FALLBACK_AUTHOR_NAME

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
          <aside className="mx-auto h-fit max-w-prose lg:sticky lg:top-10 lg:mx-0 lg:w-64 lg:max-w-none">
            <div className="mb-6">
              <h2 className="font-semibold">Overview</h2>
              <p className="mt-1 text-sm text-muted-foreground">{overviewCopy}</p>
            </div>
            {metaItems.length > 0 && (
              <div className="grid grid-cols-2 gap-5 lg:grid-cols-1">
                {metaItems.map((item, index) => {
                  if (!item?.label && !item?.value) return null
                  return (
                    <div key={`${item?.label}-${index}`} className="col-span-2 lg:col-span-1">
                      {item?.label && <h2 className="font-semibold">{item.label}</h2>}
                      {item?.value && (
                        <p className="mt-1 text-sm text-muted-foreground">{item.value}</p>
                      )}
                    </div>
                  )
                })}
              </div>
            )}
            <div className="mt-10 flex flex-col">
              <span className="mb-2 text-sm text-muted-foreground">
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
                    <p className="mt-3 text-muted-foreground">{caseStudySettings.problem}</p>
                  </div>
                )}
                {caseStudySettings.problem && caseStudySettings.approach && (
                  <Separator className="w-full lg:hidden" />
                )}
                {caseStudySettings.approach && (
                  <div>
                    <h2 className="text-xl font-semibold">Approach</h2>
                    <p className="mt-3 text-muted-foreground">{caseStudySettings.approach}</p>
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
                <div className="prose mt-20 dark:prose-invert">
                  <RichText content={content} publicContext={publicContext} withWrapper={false} />
                </div>
              )}
            </div>

            <div className="sticky top-8 hidden h-fit shrink-0 lg:block lg:w-56">
              <span className="flex items-center gap-2 text-sm">
                <AlignLeft className="h-4 w-4" />
                On this page
              </span>
              {sideMenuStructure.length > 0 && (
                <nav className="mt-2 text-sm">
                  <ul>
                    {sideMenuStructure.map((item) => (
                      <li key={item.id}>
                        <a
                          href={`#${item.id}`}
                          className={cn(
                            'block py-1 transition-colors duration-200',
                            activeSection === item.id
                              ? 'font-medium text-primary'
                              : 'text-muted-foreground hover:text-primary',
                          )}
                        >
                          {item.text}
                        </a>
                      </li>
                    ))}
                  </ul>
                </nav>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
