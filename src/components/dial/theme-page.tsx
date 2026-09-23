import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { FaqSection } from '@/components/dial/faq-section'
import { TickMark } from '@/components/dial/marks'
import { PageHeader } from '@/components/dial/page-header'
import { ThemeGlyph, themeArt, themeInkVar } from '@/components/dial/theme-marks'
import { ProjectIndex } from '@/components/dial/project-index'
import { InkBand, SectionHeader, sectionSpacing } from '@/components/dial/editorial'
import { FlatPublicationList } from '@/components/dial/publications1'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import {
  ThemeCollaborators,
  ThemeRelatedAreas,
  ThemeStakes,
  type ThemeStakesData,
} from '@/components/dial/theme-page-sections'
import { label } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import { themeFaqs } from '@/lib/dial/data/faqs'
import { getDial } from '@/lib/dial/data/get'

interface ThemePageProps {
  /** The Research Theme record this route renders. */
  slug: string
  /** Hardcoded prose for the header (research intro copy stays in code). */
  description: string
  /** The opening orientation section: plain words, the stake, a sourced note. */
  stakes: ThemeStakesData
  /** Editorial "related areas" for this theme, by slug. */
  relatedSlugs: string[]
}

/**
 * The body shared by DIAL's nine explicit `/research/<slug>` routes. Each route
 * passes its own slug and prose; everything else — projects, publications,
 * collaborators, funders, and counts — is resolved from the records.
 */
export async function ThemePage({ slug, description, stakes, relatedSlugs }: ThemePageProps) {
  const {
    getResearchThemeBySlug,
    grantFunderName,
    grantsByTheme,
    projectsByTheme,
    publicationsByTheme,
    themeStats,
    highlightAuthors,
    themeCollaboratorGroups,
    toPublicationYears,
    toRelatedTheme,
    toProjectEntry,
  } = await getDial()
  const theme = getResearchThemeBySlug(slug)
  if (!theme) notFound()

  const stats = themeStats(theme.id)
  const projects = projectsByTheme(theme.id)
  const themePublications = publicationsByTheme(theme.id)
  const collaboratorGroups = themeCollaboratorGroups(theme.id)
  const funders = [...new Set(grantsByTheme(theme.id).map(grantFunderName))]
  const related = relatedSlugs
    .map(getResearchThemeBySlug)
    .filter((t): t is NonNullable<typeof t> => t !== undefined)
    .map(toRelatedTheme)

  return (
    <>
      <ScrollRuler />
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

      {/* §2 What this is, and why it matters — before the evidence for it. */}
      <ThemeStakes stakes={stakes} />

      {/* §3 Projects */}
      {projects.length > 0 && (
        <section className={cn('container', sectionSpacing)}>
          <SectionHeader title="Projects" className="mb-6" />
          <ProjectIndex projects={projects.map(toProjectEntry)} />
        </section>
      )}

      {/* §4 Publications */}
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

      {/* §5 Collaborators — only when the theme's Projects list collaborators */}
      {collaboratorGroups.length > 0 && <ThemeCollaborators groups={collaboratorGroups} />}

      {/* §6 Funding — funders of the theme's Grants. This is the Theme page's
          one full-bleed band, printed in the Theme's own ink: a short, factual
          sentence is exactly the length that survives being set at this size. */}
      {funders.length > 0 && (
        <InkBand ink={themeInkVar(theme.slug)}>
          <p className={cn(label, 'mb-6 flex items-center gap-2')}>
            <TickMark className="ink-mark" />
            Funding
          </p>
          <p className="font-display max-w-4xl text-3xl leading-tight text-pretty md:text-5xl">
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

      {/* §7 Related themes */}
      <FaqSection items={themeFaqs} title="How themes work" />

      <ThemeRelatedAreas themes={related} />
    </>
  )
}
