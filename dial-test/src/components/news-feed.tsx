"use client";

import { useMemo, useState } from "react";
import { ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";

export type NewsType = "academic" | "event" | "community";

export interface NewsEntry {
  type: NewsType;
  title: string;
  /** ISO date string: "YYYY-MM-DD" */
  date: string;
  description: string;
  photo?: string;
  url?: string;
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

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

function formatShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    year: "numeric",
  });
}

function formatFull(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function getYear(dateStr: string): number {
  return new Date(dateStr).getFullYear();
}

function UpcomingCard({ entry }: { entry: NewsEntry }) {
  return (
    <div className="group flex flex-col justify-between rounded-xl border border-border bg-accent p-6">
      {entry.photo && (
        <div className="mb-4 flex aspect-3/2 overflow-clip rounded-xl">
          <div className="flex-1">
            <div className="relative h-full w-full origin-bottom transition duration-300 group-hover:scale-105">
              <img
                src={entry.photo}
                alt={entry.title}
                className="h-full w-full object-cover object-center"
              />
            </div>
          </div>
        </div>
      )}
      <div
        className={cn(
          "line-clamp-3 font-medium break-words",
          entry.photo ? "mb-2 text-xl md:mb-3 md:text-2xl" : "mb-2 text-lg",
        )}
      >
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
      </div>
      <div className="mb-6 line-clamp-3 text-sm text-muted-foreground md:text-base">
        {entry.description}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <Badge variant="outline">{TYPE_LABELS[entry.type]}</Badge>
        <Badge variant="secondary">Upcoming</Badge>
        <span className="ml-auto text-xs text-muted-foreground">
          {formatShort(entry.date)}
        </span>
      </div>
    </div>
  );
}

export function NewsFeed({ entries }: { entries: NewsEntry[] }) {
  const [activeType, setActiveType] = useState<NewsType | null>(null);

  const upcoming = useMemo(
    () =>
      entries
        .filter((e) => isUpcoming(e.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [entries],
  );

  const archive = useMemo(() => {
    const past = entries.filter((e) => !isUpcoming(e.date));
    const filtered = activeType
      ? past.filter((e) => e.type === activeType)
      : past;
    return [...filtered].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    );
  }, [entries, activeType]);

  return (
    <>
      {/* §1 Upcoming — photo cards */}
      {upcoming.length > 0 && (
        <section className="border-b py-16">
          <div className="container">
            <h2 className="mb-8 text-sm font-semibold tracking-wider text-muted-foreground uppercase">
              Upcoming
            </h2>
            <div className="grid gap-4 md:grid-cols-2 lg:gap-6 2xl:grid-cols-3">
              {upcoming.map((entry, i) => (
                <UpcomingCard key={i} entry={entry} />
              ))}
            </div>
          </div>
        </section>
      )}

      {/* §2 Archive — changelog-style list */}
      <section className="py-16">
        <div className="container">
          {/* Filter strip */}
          <div className="mb-12 flex flex-wrap gap-2">
            <button
              onClick={() => setActiveType(null)}
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                !activeType
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-accent",
              )}
            >
              All
            </button>
            {(["academic", "event", "community"] as NewsType[]).map((type) => (
              <button
                key={type}
                onClick={() => setActiveType(activeType === type ? null : type)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-sm transition-colors",
                  activeType === type
                    ? "border-foreground bg-foreground text-background"
                    : "border-border hover:bg-accent",
                )}
              >
                {TYPE_LABELS[type]}
              </button>
            ))}
          </div>

          {/* Entries */}
          <div className="space-y-10">
            {archive.map((entry, i) => {
              const thisYear = getYear(entry.date);
              const prevYear = i > 0 ? getYear(archive[i - 1].date) : null;
              const showYearHeader = i === 0 || prevYear !== thisYear;
              const nextIsSameYear =
                i < archive.length - 1 &&
                getYear(archive[i + 1].date) === thisYear;

              return (
                <div key={i}>
                  {showYearHeader && (
                    <div
                      className={cn(
                        "flex items-center gap-4",
                        i > 0 && "pt-6",
                      )}
                    >
                      <span className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                        {thisYear}
                      </span>
                      <div className="flex-1 border-t border-border" />
                    </div>
                  )}

                  <article
                    className={cn(
                      "relative mx-auto flex max-w-3xl flex-col gap-6 md:flex-row md:gap-10",
                      showYearHeader && "mt-8",
                    )}
                  >
                    <time className="h-fit shrink-0 text-sm text-muted-foreground md:sticky md:top-10 md:w-36">
                      {formatFull(entry.date)}
                    </time>

                    <div className="flex-1">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={cn(
                            "h-2.5 w-2.5 rounded-full",
                            TYPE_COLORS[entry.type],
                          )}
                        />
                        <p className="text-sm font-medium text-muted-foreground">
                          {TYPE_LABELS[entry.type]}
                        </p>
                      </div>

                      <h3 className="mt-2 text-lg font-semibold leading-snug">
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
                      </h3>

                      <p className="mt-2 text-sm text-muted-foreground md:text-base">
                        {entry.description}
                      </p>

                      {entry.photo && (
                        <img
                          src={entry.photo}
                          alt={entry.title}
                          className="mt-6 aspect-video w-full rounded-xl border border-border object-cover"
                        />
                      )}
                    </div>
                  </article>

                  {nextIsSameYear && (
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
    </>
  );
}
