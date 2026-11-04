import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { PageHeader } from '@/components/site/page-header'
import { NewsList } from '@/components/site/record-lists'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { groupByYear, newsYear } from '@/lib/site/format'

export const metadata: Metadata = { title: 'News' }

export default async function NewsPage() {
  const site = await getSite()
  if (!site.features.newsItems) notFound()
  const groups = groupByYear(site.news, (item) => newsYear(item))

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title="News"
        description={`Papers accepted, events held and other news from ${site.labName}.`}
      />
      {groups.length === 0 && (
        <Section first title="All news">
          <EmptyState>
            No News Items yet. They appear here once added in the admin panel.
          </EmptyState>
        </Section>
      )}
      {groups.map((group, i) => (
        <Section key={group.year} first={i === 0} title={String(group.year)}>
          <NewsList items={group.items} />
        </Section>
      ))}
    </>
  )
}
