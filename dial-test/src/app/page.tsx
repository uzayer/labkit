import {
  InkBand,
  PrimaryLink,
  PullQuote,
  SectionHeader,
  TextLink,
  ThemeIndex,
  sectionSpacing,
} from "@/components/editorial";
import { CircleMark, MarginNote } from "@/components/marks";
import { PageHeader } from "@/components/page-header";
import { PartnerStrip } from "@/components/partner-strip";
import { FlatPublicationList } from "@/components/publications1";
import { ResearchScrollHero } from "@/components/research-scroll-hero";
import {
  featuredPublications,
  homePartnerOrganizations,
  labStats,
  publicationsByYear,
  researchThemes,
  themeStats,
} from "@/data";
import { highlightAuthors, toPublicationYears } from "@/data/views";
import { displaySectionTitle, label } from "@/lib/typography";
import { cn } from "@/lib/utils";

const AUDIENCES = [
  {
    label: "Students",
    text: "Undergraduate and graduate researchers learning to build with care.",
  },
  {
    label: "Collaborators",
    text: "Researchers who want co-authored, co-designed work.",
  },
  {
    label: "Partners",
    text: "Universities, NGOs, funders, and community groups.",
  },
];

export default function Home() {
  const stats = labStats();
  const featured = featuredPublications();
  // Featured publications, or the most recent five when none are marked.
  const selected = featured.length > 0 ? featured : publicationsByYear().slice(0, 5);

  return (
    <>
      {/* Children render inside the band that rises over the scroll hero, in
          the opposite theme to the rest of the page. */}
      <ResearchScrollHero>
        <PageHeader
          eyebrow="Design Inclusion and Access Lab · North South University, Dhaka"
          title={
            <>
              Technology for communities design usually{" "}
              <span className="relative inline-block">
                misses.
                <CircleMark />
              </span>
            </>
          }
          description="DIAL studies how people live with technology in low-resource, high-stakes settings, then builds inclusive systems with the communities who will use them."
          facts={[
            { value: String(stats.publications), label: "Publications" },
            { value: String(stats.labAwards), label: "Awards" },
            ...(stats.yearsOfResearch
              ? [{ value: String(stats.yearsOfResearch), label: "Years of research" }]
              : []),
          ]}
          art="bloom"
          animateIn={false}
          className="pt-0 pb-8 md:pt-0 md:pb-10"
        >
          <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
            <PrimaryLink href="/research">Explore the research</PrimaryLink>
            <TextLink href="/join-us" className="text-muted-foreground hover:text-foreground">
              Join the lab
            </TextLink>
          </div>
          <PartnerStrip
            label="In collaboration with"
            partners={homePartnerOrganizations()}
            className="mt-12 border-t border-border pt-6"
          />
        </PageHeader>
      </ResearchScrollHero>


      <section className={cn("container", sectionSpacing)}>
        <div data-reveal className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
          <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
          <div className="reveal-item">
            <p className={cn(label, "mb-3")}>About DIAL</p>
            <h2 className={cn(displaySectionTitle, "text-balance")}>
              Locally appropriate, low-cost, explainable.
            </h2>
          </div>
          <div className="reveal-item max-w-prose space-y-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            <p>
              <span className="text-foreground">
                DIAL—the Design Inclusion and Access Lab at North South University—
              </span>
              builds technology for inclusion and access in Dhaka.
            </p>
            <p>
              We do research with communities, through field visits, interviews, participatory
              design, and iterative prototyping, then translate findings into tools people can
              actually use.
            </p>
            <TextLink href="/about" className="pt-2 text-base">
              About the lab
            </TextLink>
          </div>
        </div>
      </section>

      <section className={cn("container", sectionSpacing, "relative")}>
        <SectionHeader
          label="Research"
          title="Where social need and technical systems meet"
          link={{ text: "All research", href: "/research" }}
          className="mb-6"
        />
        <ThemeIndex
          themes={researchThemes.map((theme) => {
            const counts = themeStats(theme.id);
            return {
              slug: theme.slug,
              title: theme.title,
              description: theme.shortDescription,
              projectCount: counts.projects,
              publicationCount: counts.publications,
            };
          })}
        />
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader
          label="Publications"
          title="Selected work"
          link={{ text: "All publications", href: "/publications" }}
          className="mb-6"
        />
        <FlatPublicationList
          yearGroups={toPublicationYears(selected)}
          highlightAuthors={highlightAuthors()}
          showYear
        />
      </section>

      {/* The page's one full-bleed section. Everything around it is hairlines
          and open paper, which is the only reason this reads as an interruption
          rather than as the rhythm. */}
      <InkBand>
        <PullQuote>
          Technology that is locally appropriate, low-cost, and explainable.
        </PullQuote>
      </InkBand>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader
          label="Work with us"
          title="Research with purpose. Join the lab."
          description="DIAL welcomes people who want rigorous technology work to stay accountable to real human needs."
          className="mb-2"
        />
        <dl className="grid gap-x-12 md:grid-cols-3">
          {AUDIENCES.map((audience) => (
            <div key={audience.label} className="border-b border-border py-6">
              <dt className="flex items-end gap-2 font-display text-2xl">
                {audience.label}
                {/* Restates what /join-us says in full; the note never carries
                    anything the site does not state as real text. */}
                {audience.label === "Students" && (
                  <MarginNote>no prerequisites</MarginNote>
                )}
              </dt>
              <dd className="mt-2 text-pretty text-muted-foreground">{audience.text}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <PrimaryLink href="/join-us">Join the lab</PrimaryLink>
          <TextLink href="/contact" className="text-muted-foreground hover:text-foreground">
            Start a collaboration
          </TextLink>
        </div>
      </section>
    </>
  );
}
