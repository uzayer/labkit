import { ArrowRight } from 'lucide-react'
import Link from 'next/link'

import type { News, Project, ResearchTheme } from '@/payload-types'
import type { Site } from '@/lib/site'
import { NEWS_TYPE_LABELS, formatNewsDate, plural, yearRange, slugOf } from '@/lib/site/format'
import { label } from '@/lib/site/typography'
import { cn } from '@/utils'

const rowLink =
  'group grid gap-x-8 gap-y-2 py-6 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)_auto] md:items-baseline'
const rowTitle =
  'font-display text-xl leading-snug text-balance underline decoration-transparent underline-offset-4 transition-colors group-hover:decoration-current md:text-2xl'

/** Research Themes as ruled rows, each with what's filed under it. */
export function ThemeList({ site, themes }: { site: Site; themes: ResearchTheme[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {themes.map((theme) => {
        const counts = [
          site.features.projects ? plural(site.projectsForTheme(theme.id).length, 'project') : null,
          plural(site.publicationsForTheme(theme.id).length, 'publication'),
        ].filter(Boolean)
        return (
          <li key={theme.id}>
            <Link href={`/research/${slugOf(theme)}`} className={rowLink}>
              <span className={rowTitle}>{theme.title}</span>
              <span className="text-sm text-pretty text-muted-foreground">
                {theme.shortDescription}
              </span>
              <span className="flex items-center gap-3 text-sm whitespace-nowrap text-muted-foreground tabular-nums">
                {counts.join(' · ')}
                <ArrowRight aria-hidden className="size-4 max-md:hidden" />
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** Projects as ruled rows: title, abstract, status and years. */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <ul className="divide-y divide-border border-y border-border">
      {projects.map((project) => {
        const years = yearRange(project.startDate, project.endDate, project.status === 'ongoing')
        return (
          <li key={project.id}>
            <Link href={`/projects/${slugOf(project)}`} className={rowLink}>
              <span className="flex flex-col gap-1">
                <span className={rowTitle}>{project.title}</span>
                {project.localName && (
                  <span className="text-sm text-muted-foreground">{project.localName}</span>
                )}
              </span>
              <span className="line-clamp-3 text-sm text-pretty text-muted-foreground">
                {project.abstract}
              </span>
              <span className="flex items-center gap-3 text-sm whitespace-nowrap text-muted-foreground">
                {project.status === 'ongoing' && <span className="text-brand">Ongoing</span>}
                {years}
              </span>
            </Link>
          </li>
        )
      })}
    </ul>
  )
}

/** News Items as dated rows. The date is only ever as precise as recorded. */
export function NewsList({
  items,
  headingLevel = 'h3',
}: {
  items: News[]
  headingLevel?: 'h2' | 'h3'
}) {
  const Title = headingLevel
  return (
    <ul className="divide-y divide-border border-y border-border">
      {items.map((item) => (
        <li key={item.id} className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[12rem_minmax(0,1fr)]">
          <p className={cn(label, 'md:mt-2')}>
            <time dateTime={item.date.slice(0, 10)}>{formatNewsDate(item)}</time>
            <span aria-hidden> · </span>
            {NEWS_TYPE_LABELS[item.type]}
          </p>
          <div>
            <Title className="font-display text-xl leading-snug text-pretty md:text-2xl">
              <Link
                href={`/news/${slugOf(item)}`}
                className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
              >
                {item.title}
              </Link>
            </Title>
            <p className="mt-2 line-clamp-3 max-w-prose text-sm text-pretty text-muted-foreground">
              {item.description}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
