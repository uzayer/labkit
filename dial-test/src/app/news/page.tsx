import { NewsFeed, type NewsEntry } from "@/components/news-feed";
import { ScrollRuler } from "@/components/scroll-ruler";
import { PageHeader } from "@/components/page-header";
import { newsEntries } from "@/data/views";

export const metadata = {
  title: "News",
  description:
    "Conference presentations, hosted events, and community work from the Design Inclusion and Access Lab.",
};

const entries: NewsEntry[] = newsEntries();

export default function NewsPage() {
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
  );
}
