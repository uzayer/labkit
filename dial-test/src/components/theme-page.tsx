import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqSection } from '@/components/faq-section'
import { TickMark } from '@/components/marks'
import { PageHeader } from '@/components/page-header'
import { ThemeGlyph, themeArt, themeInkVar } from '@/components/theme-marks'
import { ProjectIndex } from '@/components/project-index'
import { InkBand, SectionHeader, sectionSpacing } from '@/components/editorial'
import { FlatPublicationList } from '@/components/publications1'
import { ThemeCollaborators, ThemeRelatedAreas } from '@/components/theme-page-sections'
import { label } from '@/lib/typography'
import { cn } from '@/lib/utils'
import {
  getResearchThemeBySlug,
  grantFunderName,
  grantsByTheme,
  projectsByTheme,
  publicationsByTheme,
  resolveIds,
  getResearchTheme,
  themeStats,
} from '@/data'
import { themeFaqs } from '@/data/faqs'
import {
  highlightAuthors,
  themeCollaboratorGroups,
  toPublicationYears,
  toRelatedTheme,
  toProjectEntry,
} from '@/data/views'

interface ThemePageProps {
  /** The Research Theme record this route renders. */
  slug: string
  /** Hardcoded prose for the header (research intro copy stays in code). */
  description: string
  /** Editorial "related areas" for this theme, by slug. */
  relatedSlugs: string[]
}

/**
 * The body shared by DIAL's nine explicit `/research/<slug>` routes. Each route
 * passes its own slug and prose; everything else — projects, publications,
 * collaborators, funders, and counts — is resolved from the records.
 */
export function ThemePage({ slug, description, relatedSlugs }: ThemePageProps) {
  const theme = getResearchThemeBySlug(slug)
  if (!theme) notFound()

  const stats = themeStats(theme.id)
  const projects = projectsByTheme(theme.id)
  const themePublications = publicationsByTheme(theme.id)
  const collaboratorGroups = themeCollaboratorGroups(theme.id)
  const funders = [...new Set(grantsByTheme(theme.id).map(grantFunderName))]
  const related = resolveIds(relatedSlugs, getResearchTheme).map(toRelatedTheme)

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-border">
        <div className="container flex items-center gap-1.5 py-3 text-sm text-muted-foreground">
          <Link href="/research" className="transition-colors hover:text-foreground">
            Research
          </Link>
          <ChevronRight className="size-3.5" />
          <span className="text-foreground">{theme.title}</span>
        </div>
      </div>

      {/* §1 Header, printed in the Theme's own ink and composition. The glyph,
          the colour and the drawing are all fixed per slug, so each of the nine
          Theme routes is its own plate rather than one template nine times. */}
      <PageHeader
        eyebrow="Research Theme"
        art={themeArt(theme.slug)}
        ink={themeInkVar(theme.slug)}
        glyph={<ThemeGlyph slug={theme.slug} className="size-28 md:size-40" />}
        title={theme.title}
        description={description}
        facts={[
          { value: String(stats.projects), label: 'Projects' },
          { value: String(stats.publications), label: 'Publications' },
          { value: String(stats.grants), label: 'Grants' },
        ]}
      />

      {/* §2 Projects */}
      {projects.length > 0 && (
        <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
          <SectionHeader title="Projects" className="mb-6" />
          <ProjectIndex projects={projects.map(toProjectEntry)} />
        </section>
      )}

      {/* §3 Publications */}
      {themePublications.length > 0 && (
        <section className={cn('container', sectionSpacing)}>
          <SectionHeader title="Publications" className="mb-6" />
          <FlatPublicationList
            yearGroups={toPublicationYears(themePublications)}
            highlightAuthors={highlightAuthors()}
            showYear
          />
        </section>
      )}

      {/* §4 Collaborators — only when the theme's Projects list collaborators */}
      {collaboratorGroups.length > 0 && <ThemeCollaborators groups={collaboratorGroups} />}

      {/* §5 Funding — funders of the theme's Grants. This is the Theme page's
          one full-bleed band, printed in the Theme's own ink: a short, factual
          sentence is exactly the length that survives being set at this size. */}
      {funders.length > 0 && (
        <InkBand ink={themeInkVar(theme.slug)}>
          <p className={cn(label, 'mb-6 flex items-center gap-2')}>
            <TickMark className="ink-mark" />
            Funding
          </p>
          <p className="max-w-4xl text-pretty font-display text-3xl leading-tight md:text-5xl">
            This research has been supported by{' '}
            {funders.map((funder, i) => (
              <span key={funder}>
                {i > 0 && (i === funders.length - 1 ? ' and ' : ', ')}
                {funder}
              </span>
            ))}
            .
          </p>
        </InkBand>
      )}

      {/* §6 Related themes */}
      <FaqSection items={themeFaqs} title="How themes work" />

      <ThemeRelatedAreas themes={related} />
    </>
  )
}
