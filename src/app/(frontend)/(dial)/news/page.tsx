import { NewsFeed } from '@/components/dial/news-feed'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { PageHeader } from '@/components/dial/page-header'
import type { NewsEntry } from '@/lib/dial/news'
import { getDial } from '@/lib/dial/data/get'

export const metadata = {
  title: 'News',
  description:
    'Conference presentations, hosted events, and community work from the Design Inclusion and Access Lab.',
}

export default async function NewsPage() {
  const { newsEntries } = await getDial()
  const entries: NewsEntry[] = newsEntries()
  return (
    <>
      <PageHeader
        eyebrow="Lab"
        art="signal"
        title="News"
        description="Conference trips, invited talks, hosted events, and community work: the lab activity behind the papers."
      />
      <ScrollRuler />

      <NewsFeed entries={entries} />
    </>
  )
}
