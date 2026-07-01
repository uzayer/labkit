import { MoveUpRight } from "lucide-react";

import { Hero262 } from "@/components/hero262";
import {
  AwardsFilterTable,
  type Award,
} from "@/components/awards-filter-table";

const dialAwards: Award[] = [
  {
    title: "10-Year Impact Award",
    year: 2024,
    category: "impact",
    organization: "USENIX SOUPS",
    linkedPublication: "Privacy is not for me, it's for those rich women",
    recipients: ["Nova Ahmed"],
    externalRecipients:
      "Nithya Sambasivan, Garen Checkley, Afsaneh Batool, David Nemer, Laura Gaytán-Lugo, Tara Matthews, Sunny Consolvo, Elizabeth Churchill",
    isFeatured: true,
  },
  {
    title: "Best Journal Paper Award",
    year: 2023,
    category: "best-paper",
    organization: "ACM COMPASS",
    linkedPublication: "Making Ethics at Home in Global CS Education",
    recipients: ["Nova Ahmed"],
    externalRecipients:
      "Cat Kutay, Shaimaa Lazem, Marisol Wong-Villacres, Cristina Abad, Cesar Collazos, Shady Elbassuoni, Lamia Iftekhar, Farzana Islam, Deepa Singh, Tasmiah Tahsin Mayeesha, Martin Ujakpamabeifam, Tariq Zaman, Nicola Bidwell",
    isFeatured: true,
  },
  {
    title: "Google South and Southeast Asia Research Award",
    year: 2022,
    category: "research-grant",
    organization: "Google",
    recipients: ["Nova Ahmed"],
    isFeatured: true,
  },
  {
    title: "INGSA Asia Essay Contest — Honorable Mention",
    year: 2021,
    category: "honorable-mention",
    organization: "INGSA Asia",
    recipients: ["Nova Ahmed"],
  },
  {
    title: "IQAC Research Award",
    year: 2021,
    category: "recognition",
    organization: "North South University",
    recipients: ["Nova Ahmed"],
  },
  {
    title: "Best Paper Award",
    year: 2020,
    category: "best-paper",
    organization: "ICAIST",
    recipients: ["Nova Ahmed"],
  },
  {
    title: "GCRF Award",
    year: 2020,
    category: "fellowship",
    organization: "Cardiff University",
    recipients: ["Nova Ahmed"],
  },
  {
    title: "Best Paper Award (Best of CHI)",
    year: 2019,
    category: "best-paper",
    organization: "ACM CHI",
    linkedPublication: "They Don't Leave Us Alone Anywhere We Go",
    recipients: ["Nova Ahmed"],
    externalRecipients:
      "Nithya Sambasivan, Afsaneh Batool, Tara Matthews, Kurt Thomas, Laura Gaytán-Lugo, David Nemer, Elie Bursztein, Elizabeth Churchill, Sunny Consolvo",
    isFeatured: true,
  },
  {
    title: "Best Poster Award",
    year: 2019,
    category: "best-poster",
    organization: "COMSNETS",
    linkedPublication: "Monitoring Driving Stress using HRV",
    recipients: ["Nova Ahmed", "Rahat Jahangir Rony"],
  },
  {
    title: "IAPP Distinguished Privacy Award",
    year: 2018,
    category: "recognition",
    organization: "IAPP / SOUPS",
    linkedPublication: "Privacy is not for me, it's for those rich women",
    recipients: ["Nova Ahmed"],
    externalRecipients:
      "Nithya Sambasivan, Garen Checkley, Afsaneh Batool, David Nemer, Laura Gaytán-Lugo, Tara Matthews, Sunny Consolvo, Elizabeth Churchill",
  },
  {
    title: "Best Poster Award",
    year: 2018,
    category: "best-poster",
    organization: "ACM CHI HCIxB",
    linkedPublication: "Supporting Missing Daughters",
    recipients: ["Nova Ahmed"],
    externalRecipients: "Tamanna Motahar, Sharmin Kabir, Munir Hasan",
  },
  {
    title: "Best Paper Award",
    year: 2014,
    category: "best-paper",
    organization: "Global Engineering, Science and Technology Conference",
    recipients: ["Nova Ahmed"],
  },
];

const featuredAwards = dialAwards.filter((a) => a.isFeatured);
const bestPaperCount = dialAwards.filter(
  (a) => a.category === "best-paper",
).length;
const researchGrantCount = dialAwards.filter(
  (a) => a.category === "research-grant",
).length;
const minYear = Math.min(...dialAwards.map((a) => a.year));
const maxYear = Math.max(...dialAwards.map((a) => a.year));

const categoryLabels: Record<string, string> = {
  "best-paper": "Best Paper",
  "best-poster": "Best Poster",
  "honorable-mention": "Honorable Mention",
  impact: "Impact Award",
  "research-grant": "Research Grant",
  fellowship: "Fellowship",
  recognition: "Recognition",
};

export default function AwardsPage() {
  return (
    <>
      {/* §1 Page hero */}
      <Hero262
        heading="Awards"
        subheading="Recognition for DIAL's work at international academic venues."
        description=""
        stats={[
          { value: String(bestPaperCount), label: "Best Paper Awards" },
          { value: String(researchGrantCount), label: "Research Grants" },
          { value: `${minYear}–present`, label: "Award record" },
        ]}
      />

      {/* §2 Featured awards — awards3 pattern, all gold indicators */}
      <section className="py-32">
        <div className="container">
          <h2 className="mb-6 text-4xl font-semibold tracking-tighter text-foreground">
            Featured Recognition
          </h2>
          <p className="mb-6 max-w-3xl text-base text-muted-foreground">
            Tier-1 best-paper wins at CHI and COMPASS, a retrospective impact
            award from SOUPS, and a competitive Google Research Award.
          </p>

          {featuredAwards.map((award, index) => (
            <div
              key={index}
              className="group relative flex items-start gap-4 overflow-hidden border-b border-border p-4"
            >
              <div className="absolute inset-0 z-0 translate-y-full bg-accent transition-transform duration-300 ease-in-out group-hover:translate-y-0" />

              <div className="relative z-10 flex-1 space-y-2 pb-4">
                <div className="flex items-center gap-4">
                  <div className="h-5 w-5 shrink-0 rounded-md bg-amber-400" />
                  <h3 className="font-medium">{award.title}</h3>
                </div>
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 pl-9 text-sm text-muted-foreground">
                  <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium">
                    {award.organization}
                  </span>
                  <span className="inline-block rounded border border-border px-2 py-0.5 text-xs font-medium">
                    {categoryLabels[award.category]}
                  </span>
                  <span>{award.year}</span>
                </p>
                {award.linkedPublication && (
                  <p className="pl-9 text-sm italic text-muted-foreground">
                    &ldquo;{award.linkedPublication}&rdquo;
                  </p>
                )}
                <p className="pl-9 text-sm text-muted-foreground">
                  {award.recipients.join(", ")}
                  {award.externalRecipients && (
                    <> · {award.externalRecipients}</>
                  )}
                </p>
              </div>

              <MoveUpRight className="relative z-10 mt-1 h-4 w-4 shrink-0 text-muted-foreground" />
            </div>
          ))}
        </div>
      </section>

      {/* §3 Full awards list — awards4 pattern with category filter */}
      <AwardsFilterTable
        awards={dialAwards}
        yearRange={`${minYear}–${maxYear}`}
      />
    </>
  );
}
