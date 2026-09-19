import { FaqSection } from "@/components/faq-section";
import { PageHeader } from "@/components/page-header";
import {
  AwardsFilterTable,
  type Award,
} from "@/components/awards-filter-table";
import { labAwards, yearRange } from "@/data";
import { awardFaqs } from "@/data/faqs";
import { toAwardRow } from "@/data/views";
import { displaySectionTitle } from "@/lib/typography";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Awards",
  description: "Awards and recognition for the Design Inclusion and Access Lab at North South University.",
};

// Lab-scoped Awards only; personal Awards appear on the Team Member profile.
const dialAwards: Award[] = labAwards().map(toAwardRow);

const featuredAwards = dialAwards.filter((a) => a.isFeatured);
const bestPaperCount = dialAwards.filter(
  (a) => a.category === "best-paper",
).length;
const range = yearRange(dialAwards.map((a) => a.year));
const minYear = range?.min;
const maxYear = range?.max;

const categoryLabels: Record<string, string> = {
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

export default function AwardsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        art="signal"
        title="Awards"
        description="Recognition for DIAL's work at international academic venues. Awards given to individual Team Members appear on their profiles."
        facts={[
          { value: String(dialAwards.length), label: "Awards" },
          { value: String(bestPaperCount), label: "Best paper" },
          ...(minYear ? [{ value: String(minYear), label: "Since" }] : []),
        ]}
      />

      {/* §2 Featured awards */}
      <section className="container pb-24">
        <h2 className={cn(displaySectionTitle, "border-t border-border pt-6")}>
          Featured
        </h2>
        <ol className="mt-6 divide-y divide-border border-t border-border">
          {featuredAwards.map((award) => (
            <li
              key={`${award.title}-${award.year}`}
              className="grid gap-x-8 gap-y-3 py-8 md:grid-cols-[6rem_1fr_16rem]"
            >
              {/* The year as a rubber stamp: ink ring, set slightly askew. */}
              <p className="md:pt-1">
                <span className="sticker inline-grid size-14 place-items-center rounded-full border-2 border-ink/40 font-display text-lg tabular-nums text-ink">
                  {award.year}
                </span>
              </p>
              <div>
                <h3 className="font-display text-2xl leading-snug md:text-3xl">
                  {award.title}
                </h3>
                {award.linkedPublication && (
                  <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
                    &ldquo;{award.linkedPublication}&rdquo;
                  </p>
                )}
                <p className="mt-2 text-sm text-muted-foreground">
                  {award.recipients.join(", ")}
                  {award.externalRecipients && <> · {award.externalRecipients}</>}
                </p>
              </div>
              <p className="text-sm text-muted-foreground md:pt-2 md:text-right">
                {award.organization}
                <span className="block">{categoryLabels[award.category]}</span>
              </p>
            </li>
          ))}
        </ol>
      </section>

      <FaqSection items={awardFaqs} title="How awards are counted" />

      {/* §3 Full awards list with category filter */}
      <AwardsFilterTable
        awards={dialAwards}
        yearRange={minYear ? `${minYear}–${maxYear}` : "—"}
      />
    </>
  );
}
