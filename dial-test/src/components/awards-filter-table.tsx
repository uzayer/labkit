"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export type AwardCategory =
  | "best-paper"
  | "best-poster"
  | "honorable-mention"
  | "impact"
  | "research-grant"
  | "fellowship"
  | "recognition"
  | "competition"
  | "scholarship";

export interface Award {
  title: string;
  year: number;
  category: AwardCategory;
  organization: string;
  linkedPublication?: string;
  recipients: string[];
  externalRecipients?: string;
  isFeatured?: boolean;
}

const categoryLabels: Record<AwardCategory, string> = {
  "best-paper": "Best Paper",
  "best-poster": "Best Poster",
  "honorable-mention": "Honorable Mention",
  impact: "Impact Award",
  "research-grant": "Research Grant",
  fellowship: "Fellowship",
  recognition: "Recognition",
  competition: "Competition",
  scholarship: "Scholarship",
};

function categoryBadgeClass(category: AwardCategory) {
  switch (category) {
    case "best-paper":
    case "impact":
      return "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300";
    case "best-poster":
      return "bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400";
    case "honorable-mention":
      return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300";
    default:
      return "bg-muted text-muted-foreground";
  }
}

function rowAccentClass(category: AwardCategory) {
  if (category === "best-paper" || category === "impact") {
    return "border-l-2 border-l-amber-400";
  }
  if (category === "honorable-mention") {
    return "border-l-2 border-l-slate-400";
  }
  return "";
}

interface AwardsFilterTableProps {
  awards: Award[];
  yearRange: string;
}

export function AwardsFilterTable({ awards, yearRange }: AwardsFilterTableProps) {
  const [activeCategory, setActiveCategory] = useState<AwardCategory | null>(null);

  const uniqueCategories = [
    ...new Set(awards.map((a) => a.category)),
  ] as AwardCategory[];

  const filtered = activeCategory
    ? awards.filter((a) => a.category === activeCategory)
    : awards;

  const byYear = filtered.reduce<Record<string, Award[]>>((acc, award) => {
    const y = award.year.toString();
    (acc[y] ??= []).push(award);
    return acc;
  }, {});

  const sortedYears = Object.keys(byYear).sort((a, b) => Number(b) - Number(a));

  return (
    <section className="py-32">
      <div className="container space-y-10 lg:space-y-20">
        <div className="flex w-full items-end justify-between">
          <h1 className="text-5xl font-semibold tracking-tighter lg:text-8xl">
            Awards
          </h1>
          <p className="text-lg font-semibold tracking-tighter text-muted-foreground lg:text-3xl">
            ({yearRange}©)
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setActiveCategory(null)}
            className={cn(
              "rounded-full border px-3 py-1.5 text-sm transition-colors",
              !activeCategory
                ? "border-foreground bg-foreground text-background"
                : "border-border hover:bg-accent",
            )}
          >
            All
          </button>
          {uniqueCategories.map((cat) => (
            <button
              key={cat}
              onClick={() =>
                setActiveCategory(activeCategory === cat ? null : cat)
              }
              className={cn(
                "rounded-full border px-3 py-1.5 text-sm transition-colors",
                activeCategory === cat
                  ? "border-foreground bg-foreground text-background"
                  : "border-border hover:bg-accent",
              )}
            >
              {categoryLabels[cat]}
            </button>
          ))}
        </div>

        <table className="w-full border-collapse">
          <thead>
            <tr className="h-12 border-b text-left text-foreground/40">
              <th className="hidden min-w-28 pr-4 font-normal lg:table-cell">
                Organization
              </th>
              <th className="pr-4 font-normal">Award</th>
              <th className="hidden pr-4 font-normal md:table-cell">
                Publication
              </th>
              <th className="hidden pr-4 font-normal sm:table-cell">
                Category
              </th>
              <th className="text-right font-normal">Year</th>
            </tr>
          </thead>
          {sortedYears.map((year) => (
            <tbody key={year}>
              <tr>
                <td
                  colSpan={5}
                  className="border-b pt-8 pb-2 text-sm font-semibold text-muted-foreground"
                >
                  {year}
                </td>
              </tr>
              {byYear[year].map((award, i) => (
                <tr
                  key={i}
                  className={cn("h-20 border-b", rowAccentClass(award.category))}
                >
                  <td className="hidden pr-4 align-middle lg:table-cell">
                    <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground/60">
                      {award.organization}
                    </span>
                  </td>
                  <td className="pr-4 align-middle text-base font-medium tracking-tight text-foreground lg:text-lg">
                    {award.title}
                    <span className="mt-0.5 block text-xs font-normal text-muted-foreground lg:hidden">
                      {award.organization}
                    </span>
                  </td>
                  <td className="hidden pr-4 align-middle text-sm text-muted-foreground md:table-cell">
                    {award.linkedPublication
                      ? `"${award.linkedPublication}"`
                      : "—"}
                  </td>
                  <td className="hidden pr-4 align-middle sm:table-cell">
                    <span
                      className={cn(
                        "inline-block rounded px-2 py-0.5 text-xs font-medium",
                        categoryBadgeClass(award.category),
                      )}
                    >
                      {categoryLabels[award.category]}
                    </span>
                  </td>
                  <td className="text-right align-middle text-sm text-foreground">
                    {award.year}
                  </td>
                </tr>
              ))}
            </tbody>
          ))}
        </table>
      </div>
    </section>
  );
}
