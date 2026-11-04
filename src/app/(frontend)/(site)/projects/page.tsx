import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/site/page-header'
import { ProjectList } from '@/components/site/record-lists'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'

export const metadata: Metadata = { title: 'Projects' }

export default async function ProjectsPage() {
  const site = await getSite()
  if (!site.features.projects) notFound()
  const ongoing = site.projects.filter((p) => p.status === 'ongoing')
  const rest = site.projects.filter((p) => p.status !== 'ongoing')

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Projects"
        description={`The bodies of work ${site.labName} groups its people, papers and funding under.`}
        facts={[
          { value: String(site.projects.length), label: 'Projects' },
          { value: String(ongoing.length), label: 'Ongoing' },
        ]}
      />
      {site.projects.length === 0 && (
        <Section first title="All projects">
          <EmptyState>
            No Projects yet. Published Projects appear here once they are added in the admin panel.
          </EmptyState>
        </Section>
      )}
      {ongoing.length > 0 && (
        <Section first title="Ongoing">
          <ProjectList projects={ongoing} />
        </Section>
      )}
      {rest.length > 0 && (
        <Section
          first={ongoing.length === 0}
          title={ongoing.length > 0 ? 'Earlier work' : 'All projects'}
        >
          <ProjectList projects={rest} />
        </Section>
      )}
    </>
  )
}
