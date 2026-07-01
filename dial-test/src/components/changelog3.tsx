import { ExternalLink } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { type NewsEntry, type NewsType } from "@/components/news-feed";

interface Changelog3Props {
  entries: NewsEntry[];
  className?: string;
}

const TYPE_LABELS: Record<NewsType, string> = {
  academic: "Academic",
  event: "Event",
  community: "Community",
};

const TYPE_COLORS: Record<NewsType, string> = {
  academic: "bg-blue-500",
  event: "bg-purple-500",
  community: "bg-emerald-500",
};

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

const Changelog3 = ({ entries, className }: Changelog3Props) => {
  // Sort newest first, group by year for section breaks
  const sorted = [...entries].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  return (
    <section className={cn("py-16", className)}>
      <div className="container">
        <div className="space-y-10">
          {sorted.map((entry, i) => {
            const prevYear = i > 0 ? getYear(sorted[i - 1].date) : null;
            const thisYear = getYear(entry.date);
            const showYearBreak = prevYear !== null && prevYear !== thisYear;

            return (
              <div key={i}>
                {showYearBreak && (
                  <div className="mb-10 flex items-center gap-4">
                    <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                      {thisYear}
                    </span>
                    <div className="flex-1 border-t border-border" />
                  </div>
                )}

                {i === 0 && (
                  <div className="mb-10 flex items-center gap-4">
                    <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                      {thisYear}
                    </span>
                    <div className="flex-1 border-t border-border" />
                  </div>
                )}

                <article className="relative mx-auto flex max-w-3xl flex-col gap-6 md:flex-row md:gap-10">
                  <time className="h-fit shrink-0 text-sm font-semibold text-muted-foreground md:sticky md:top-10 md:w-28">
                    {formatDate(entry.date)}
                  </time>
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={cn(
                          "h-3 w-3 rounded-full",
                          TYPE_COLORS[entry.type],
                        )}
                      />
                      <p className="text-sm font-semibold text-primary/80">
                        {TYPE_LABELS[entry.type]}
                      </p>
                    </div>

                    <div className="mt-4">
                      <h2 className="text-xl font-semibold leading-snug">
                        {entry.url ? (
                          <a
                            href={entry.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-start gap-1.5 hover:underline"
                          >
                            {entry.title}
                            <ExternalLink className="mt-1 h-3.5 w-3.5 shrink-0 text-muted-foreground" />
                          </a>
                        ) : (
                          entry.title
                        )}
                      </h2>
                      <p className="mt-3 text-sm text-muted-foreground md:text-base">
                        {entry.description}
                      </p>
                      {entry.photo && (
                        <img
                          src={entry.photo}
                          alt={entry.title}
                          className="mt-6 aspect-video w-full rounded-lg border border-border object-cover"
                        />
                      )}
                    </div>
                  </div>
                </article>

                {i < sorted.length - 1 &&
                  getYear(sorted[i + 1].date) === thisYear && (
                    <div className="mx-auto mt-10 max-w-3xl">
                      <Separator />
                    </div>
                  )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export { Changelog3 };
