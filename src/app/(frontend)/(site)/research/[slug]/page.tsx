import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/site/page-header'
import { PublicationList } from '@/components/site/publication-list'
import { ProjectList } from '@/components/site/record-lists'
import { RichText, hasContent } from '@/components/site/rich-text'
import { Section } from '@/components/site/section'
import { getSite } from '@/lib/site'

type Props = { params: Promise<{ slug: string }> }

export function generateStaticParams() {
  return []
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite()
  const theme = site.findTheme((await params).slug)
  if (!theme) return {}
  return { title: theme.title, description: theme.shortDescription }
}

export default async function ResearchThemePage({ params }: Props) {
  const site = await getSite()
  // A switched-off Feature loads no themes, so this 404s along with the list.
  const theme = site.findTheme((await params).slug)
  if (!theme) notFound()

  const projects = site.projectsForTheme(theme.id)
  const publications = site.publicationsForTheme(theme.id)

  return (
    <>
      <PageHeader
        eyebrow="Research theme"
        title={theme.title}
        description={theme.shortDescription}
        facts={[
          { value: String(projects.length), label: 'Projects' },
          { value: String(publications.length), label: 'Publications' },
        ]}
      />
      {hasContent(theme.body) && (
        <Section first title="Overview">
          <RichText data={theme.body} />
        </Section>
      )}
      {projects.length > 0 && (
        <Section first={!hasContent(theme.body)} title="Projects">
          <ProjectList projects={projects} />
        </Section>
      )}
      {publications.length > 0 && (
        <Section first={!hasContent(theme.body) && projects.length === 0} title="Publications">
          <PublicationList site={site} publications={publications} showYear />
        </Section>
      )}
    </>
  )
}
