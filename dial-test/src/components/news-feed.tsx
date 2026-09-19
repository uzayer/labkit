"use client";

import { useMemo, useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { SectionHeader, SegmentedControl } from "@/components/editorial";
import { OptionalImage } from "@/components/optional-image";
import { listEnter, listStagger } from "@/lib/motion";
import { displaySectionTitle } from "@/lib/typography";
import { cn } from "@/lib/utils";

export type NewsType = "academic" | "event" | "community";

export interface NewsEntry {
  type: NewsType;
  title: string;
  /** ISO date string: "YYYY-MM-DD", or "YYYY-MM" / "YYYY" when that is all the source gives. */
  date: string;
  /** How much of `date` is known; defaults to "day". */
  datePrecision?: "day" | "month" | "year";
  description: string;
  photo?: string;
  url?: string;
}

const TYPE_LABELS: Record<NewsType, string> = {
  academic: "Academic",
  event: "Event",
  community: "Community",
};

/** One press ink per kind of activity, so the archive reads at a glance. */
const TYPE_INK: Record<NewsType, string> = {
  academic: "text-ink-blue",
  event: "text-ink-violet",
  community: "text-brand",
};

function isUpcoming(dateStr: string): boolean {
  return new Date(dateStr) > new Date();
}

// Dates are formatted in UTC so a year- or month-only ISO string never shifts
// into the previous day/month in western time zones.
function formatFull(dateStr: string, precision: NewsEntry["datePrecision"] = "day"): string {
  if (precision === "year") return String(getYear(dateStr));
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    ...(precision === "day" ? { day: "numeric" as const } : {}),
    year: "numeric",
    timeZone: "UTC",
  });
}

/** Date without its year, for rows already grouped under a year heading. */
function formatInYear(dateStr: string, precision: NewsEntry["datePrecision"] = "day"): string {
  if (precision === "year") return "Date not recorded";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "long",
    ...(precision === "day" ? { day: "numeric" as const } : {}),
    timeZone: "UTC",
  });
}

function getYear(dateStr: string): number {
  return new Date(dateStr).getUTCFullYear();
}

function EntryTitle({ entry, className }: { entry: NewsEntry; className?: string }) {
  return (
    <h3 className={cn("font-display text-2xl leading-snug text-balance", className)}>
      {entry.url ? (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          className="decoration-border underline-offset-4 hover:underline"
        >
          {entry.title}
          <ArrowUpRight aria-label="(external link)" className="ml-1 inline size-4 align-baseline text-muted-foreground" />
        </a>
      ) : (
        entry.title
      )}
    </h3>
  );
}

const FILTERS: { value: NewsType | "all"; label: string }[] = [
  { value: "all", label: "All" },
  { value: "academic", label: TYPE_LABELS.academic },
  { value: "event", label: TYPE_LABELS.event },
  { value: "community", label: TYPE_LABELS.community },
];

export function NewsFeed({ entries }: { entries: NewsEntry[] }) {
  const [activeType, setActiveType] = useState<NewsType | "all">("all");

  const upcoming = useMemo(
    () =>
      entries
        .filter((e) => isUpcoming(e.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [entries],
  );

  const past = useMemo(() => entries.filter((e) => !isUpcoming(e.date)), [entries]);
  const archive = useMemo(
    () =>
      [...past.filter((e) => activeType === "all" || e.type === activeType)].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    [past, activeType],
  );

  const years = [...new Set(archive.map((e) => getYear(e.date)))];

  return (
    <>
      {/* §1 Upcoming */}
      {upcoming.length > 0 && (
        <section className="container pb-16">
          <SectionHeader label="Upcoming" title="Coming up" className="mb-6" />
          <ul className="grid gap-x-8 md:grid-cols-2">
            {upcoming.map((entry) => (
              <li key={`${entry.date}-${entry.title}`} className="border-t border-border py-6">
                <p className="text-sm text-brand">
                  {formatFull(entry.date, entry.datePrecision)} · {TYPE_LABELS[entry.type]}
                </p>
                <EntryTitle entry={entry} className="mt-2" />
                <p className="mt-2 text-pretty text-muted-foreground">{entry.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* §2 Archive */}
      <section className="container pb-24">
        <div className="flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
          <h2 className={displaySectionTitle}>Archive</h2>
          <SegmentedControl
            label="Filter by type"
            options={FILTERS.map((f) => ({
              ...f,
              count: f.value === "all" ? past.length : past.filter((e) => e.type === f.value).length,
            }))}
            value={activeType}
            onChange={setActiveType}
          />
        </div>

        {years.map((year) => (
          <div key={year} className={cn("mt-12 grid gap-x-8 md:grid-cols-[8rem_1fr]", listEnter)}>
            <h3 className="font-display text-3xl tabular-nums md:sticky md:top-24 md:h-fit">{year}</h3>
            <ol className="divide-y divide-border">
              {archive
                .filter((e) => getYear(e.date) === year)
                .map((entry, i) => (
                  <li
                    key={`${entry.date}-${entry.title}`}
                    className={cn("grid gap-x-8 gap-y-2 py-6 first:pt-2 lg:grid-cols-[9rem_1fr]", listEnter)}
                    style={listStagger(i)}
                  >
                    <div className="text-sm text-muted-foreground">
                      <time dateTime={entry.date}>{formatInYear(entry.date, entry.datePrecision)}</time>
                      <span className={cn("mt-1 flex items-center gap-1.5", TYPE_INK[entry.type])}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {TYPE_LABELS[entry.type]}
                      </span>
                    </div>
                    <div className="max-w-prose">
                      <EntryTitle entry={entry} />
                      <p className="mt-2 text-pretty text-muted-foreground">{entry.description}</p>
                      {entry.photo && (
                        <div className="relative mt-6 w-fit">
                          {/* Tape rides with the photograph (see OptionalImage);
                              as a sibling it outlived a failed load and left a
                              strip of tape stuck to nothing. */}
                          <OptionalImage
                            src={entry.photo}
                            alt={entry.title}
                            overlay={<span aria-hidden className="tape -top-3 left-10 z-10" />}
                            frameClassName="sticker-alt rounded-sm shadow-[0_12px_28px_-20px_rgba(0,0,0,0.6)]"
                            className="aspect-video"
                          />
                        </div>
                      )}
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        ))}

        {archive.length === 0 && (
          <p className="mt-12 text-muted-foreground">Nothing recorded for this type yet.</p>
        )}
      </section>
    </>
  );
}
