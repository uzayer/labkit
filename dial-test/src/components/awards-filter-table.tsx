"use client";

import { useState } from "react";
import { SegmentedControl } from "@/components/editorial";
import { displaySectionTitle } from "@/lib/typography";
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
  | "scholarship"
  | "other";

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
  other: "Other",
};

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
    <section className="pb-24">
      <div className="container space-y-8">
        <div className="flex w-full items-baseline justify-between gap-4 border-t border-border pt-6">
          <h2 className={displaySectionTitle}>Every award</h2>
          <p className="text-sm tabular-nums text-muted-foreground">{yearRange}</p>
        </div>

        <SegmentedControl
          label="Filter by category"
          options={[
            { value: "all", label: "All" },
            ...uniqueCategories.map((cat) => ({ value: cat, label: categoryLabels[cat] })),
          ]}
          value={activeCategory ?? "all"}
          onChange={(value) => setActiveCategory(value === "all" ? null : (value as AwardCategory))}
        />

        <table className="w-full border-collapse">
          <thead>
            <tr className="h-10 border-b text-left text-sm text-muted-foreground">
              <th className="hidden min-w-28 pr-4 font-normal lg:table-cell">
                Organization
              </th>
              <th className="pr-4 font-normal">Award</th>
              <th className="hidden pr-4 font-normal md:table-cell">
                Publication
              </th>
              <th className="hidden text-right font-normal sm:table-cell">
                Category
              </th>
            </tr>
          </thead>
          {sortedYears.map((year) => (
            <tbody key={year}>
              <tr>
                <td
                  colSpan={4}
                  className="border-b pt-8 pb-2 font-mono text-xs tabular-nums text-muted-foreground"
                >
                  {year}
                </td>
              </tr>
              {byYear[year].map((award, i) => (
                <tr
                  key={i}
                  className="border-b"
                >
                  <td className="hidden py-5 pr-6 align-top text-sm text-muted-foreground lg:table-cell">
                    {award.organization}
                  </td>
                  <td className="py-5 pr-6 align-top font-display text-lg leading-snug text-foreground lg:text-xl">
                    {award.title}
                    <span className="mt-1 block font-sans text-xs text-muted-foreground lg:hidden">
                      {award.organization}
                    </span>
                  </td>
                  <td className="hidden py-5 pr-6 align-top text-sm text-pretty text-muted-foreground md:table-cell">
                    {award.linkedPublication
                      ? `"${award.linkedPublication}"`
                      : "—"}
                  </td>
                  <td className="hidden py-5 text-right align-top text-sm whitespace-nowrap text-muted-foreground sm:table-cell">
                    {categoryLabels[award.category]}
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
