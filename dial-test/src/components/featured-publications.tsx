import { FlatPublicationList, type PublicationYear } from "@/components/publications1";
import { cn } from "@/lib/utils";

interface FeaturedPublicationsProps {
  yearGroups: PublicationYear[];
  highlightAuthors?: string[];
  className?: string;
}

export function FeaturedPublications({
  yearGroups,
  highlightAuthors,
  className,
}: FeaturedPublicationsProps) {
  return (
    <section className={cn(className)}>
      <div className="container">
        <div className="mb-6 flex items-baseline justify-between">
          <h2 className="text-2xl font-semibold">Award-winning work</h2>
          <a
            href="/publications"
            className="text-sm text-muted-foreground underline-offset-4 hover:underline"
          >
            All publications →
          </a>
        </div>
        {yearGroups.length > 0 ? (
          <FlatPublicationList yearGroups={yearGroups} highlightAuthors={highlightAuthors} />
        ) : (
          <p className="text-muted-foreground">No award-winning publications recorded yet.</p>
        )}
      </div>
    </section>
  );
}
