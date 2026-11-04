import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/site/page-header'
import { ThemeList } from '@/components/site/record-lists'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'

export const metadata: Metadata = { title: 'Research' }

export default async function ResearchPage() {
  const site = await getSite()
  if (!site.features.researchThemes) notFound()
  const { researchThemes } = site

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Research themes"
        description={`The questions ${site.labName} works on, and the projects and publications filed under each.`}
        facts={[{ value: String(researchThemes.length), label: 'Themes' }]}
      />
      <Section first title="All themes">
        {researchThemes.length > 0 ? (
          <ThemeList site={site} themes={researchThemes} />
        ) : (
          <EmptyState>
            No Research Themes yet. Add them in the admin panel, then file Projects and Publications
            under them.
          </EmptyState>
        )}
      </Section>
    </>
  )
}
