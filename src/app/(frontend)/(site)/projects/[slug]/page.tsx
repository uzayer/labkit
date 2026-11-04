import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Credits } from '@/components/site/credits'
import { OutLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { PublicationList } from '@/components/site/publication-list'
import { RichText, hasContent } from '@/components/site/rich-text'
import { Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { AWARD_CATEGORY_LABELS, yearRange, slugOf } from '@/lib/site/format'
import { label } from '@/lib/site/typography'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite()
  const project = site.findProject((await params).slug)
  if (!project) return {}
  return {
    title: project.meta?.title || project.title,
    description: project.meta?.description || project.abstract,
  }
}

export default async function ProjectPage({ params }: Props) {
  const site = await getSite()
  // A switched-off Feature loads no Projects, so this 404s along with the list.
  const project = site.findProject((await params).slug)
  if (!project) notFound()

  const people = site.peopleIn(project.teamMembers)
  const publications = site.publicationsIn(project.publications)
  const grants = site.grantsIn(project.grants)
  const awards = site.awardsIn(project.awards)
  const themes = site.themes(project.themes)
  const image = site.media(project.heroImage)
  const years = yearRange(project.startDate, project.endDate, project.status === 'ongoing')

  return (
    <>
      <PageHeader
        eyebrow={[project.status === 'ongoing' ? 'Ongoing project' : 'Project', years]
          .filter(Boolean)
          .join(' · ')}
        title={project.title}
        description={project.abstract}
      >
        {project.localName && (
          <p className="mt-4 text-lg text-muted-foreground">{project.localName}</p>
        )}
        <div className="mt-6 flex flex-col gap-3 text-sm">
          {people.length > 0 && (
            <p>
              <span className={label}>Team</span>{' '}
              <span className="ml-2 text-muted-foreground">
                <Credits people={people} />
              </span>
            </p>
          )}
          {themes.length > 0 && (
            <p className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
              <span className={label}>Themes</span>
              {themes.map((theme) => (
                <Link
                  key={theme.id}
                  href={`/research/${slugOf(theme)}`}
                  className="underline underline-offset-4"
                >
                  {theme.title}
                </Link>
              ))}
            </p>
          )}
          {project.externalUrl && (
            <p>
              <OutLink href={project.externalUrl}>Project website</OutLink>
            </p>
          )}
        </div>
      </PageHeader>

      {image?.url && (
        <div className="container pb-12">
          <img
            src={image.url}
            alt={image.alt ?? ''}
            width={image.width ?? undefined}
            height={image.height ?? undefined}
            className="w-full max-w-5xl rounded-md"
          />
        </div>
      )}

      {hasContent(project.content) && (
        <Section first title="About the project">
          <RichText data={project.content} />
        </Section>
      )}

      {publications.length > 0 && (
        <Section title="Publications">
          <PublicationList site={site} publications={publications} showYear />
        </Section>
      )}

      {(grants.length > 0 || awards.length > 0) && (
        <Section title="Funding and recognition">
          <ul className="divide-y divide-border border-y border-border">
            {grants.map((grant) => (
              <li key={grant.id} className="py-4">
                <p className="font-display text-xl">{grant.title}</p>
                <p className="text-sm text-muted-foreground">
                  Grant ·{' '}
                  {site.organizationName(grant.funder, grant.funderLabel) ?? 'Funder not recorded'}
                </p>
              </li>
            ))}
            {awards.map((award) => (
              <li key={award.id} className="py-4">
                <p className="font-display text-xl">{award.title}</p>
                <p className="text-sm text-muted-foreground">
                  {[award.year, award.category && AWARD_CATEGORY_LABELS[award.category]]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}
    </>
  )
}
