import { ClosingNote } from "@/components/closing-note";
import { MarginNote } from "@/components/marks";
import {
  NameLine,
  NumberedSteps,
  SectionHeader,
  ThemeIndex,
  sectionSpacing,
} from "@/components/editorial";
import { PageHeader } from "@/components/page-header";
import { ProjectIndex } from "@/components/project-index";
import { FlatPublicationList } from "@/components/publications1";
import {
  awardsForPublication,
  featuredProjects,
  labInfo,
  labStats,
  publicationsByYear,
  researchThemes,
  themeStats,
  venuesByPublicationCount,
} from "@/data";
import { highlightAuthors, toProjectEntry, toPublicationYears } from "@/data/views";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Research",
  description:
    "Research Themes, Projects, and award-winning Publications from the Design Inclusion and Access Lab at North South University.",
};

const METHOD = [
  {
    title: "Fieldwork before tooling",
    body: "Projects start with interviews, visits, workshops, and patient listening before a technical intervention is proposed.",
  },
  {
    title: "Co-design under constraint",
    body: "Bandwidth, literacy, language, trust, device access, and local institutions shape the design brief from the beginning.",
  },
  {
    title: "Prototype, evaluate, publish",
    body: "The lab turns findings into working systems, papers, datasets, methods, and student research trajectories.",
  },
];

export default function ResearchPage() {
  const stats = labStats();
  // Venues ordered by how many DIAL publications appeared there.
  const venueNames = venuesByPublicationCount()
    .slice(0, 6)
    .map((v) => v.shortName ?? v.name);
  const awardWinning = publicationsByYear().filter(
    (pub) => awardsForPublication(pub).length > 0,
  );

  return (
    <>
      <PageHeader
        eyebrow="Research"
        art="orbit"
        title="Research at the margins"
        description="DIAL studies access, inclusion, safety, wellbeing, and development in low-resource settings, then builds and evaluates technology with the people expected to use it."
        facts={[
          { value: String(stats.ongoingProjects), label: "Ongoing projects" },
          { value: String(stats.publications), label: "Publications" },
          ...(labInfo.hciResearchSince
            ? [{ value: String(labInfo.hciResearchSince), label: "Active since" }]
            : []),
        ]}
      >
        <NameLine label="Published at" names={venueNames} className="mt-8" />
      </PageHeader>

      <section className="container pb-16 md:pb-24">
        <SectionHeader
          title="Nine research themes"
          description="Each theme gathers the Projects and Publications filed under it."
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
        <SectionHeader label="Method" title="Shaped by field relationships" className="mb-10" />
        <NumberedSteps steps={METHOD} />
        {/* Restates the first step's own title ("Fieldwork before tooling"); a
            margin note never says anything the page has not already set. */}
        <MarginNote points="right" className="mt-8 ml-1">
          in that order, every time
        </MarginNote>
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader
          label="Selected projects"
          title="Longer research programmes"
          link={{ text: "All projects", href: "/projects" }}
          className="mb-6"
        />
        <ProjectIndex projects={featuredProjects().slice(0, 3).map(toProjectEntry)} />
      </section>

      {awardWinning.length > 0 && (
        <section className={cn("container", sectionSpacing)}>
          <SectionHeader
            label="Recognition"
            title="Award-winning work"
            link={{ text: "All publications", href: "/publications" }}
            className="mb-6"
          />
          <FlatPublicationList
            yearGroups={toPublicationYears(awardWinning)}
            highlightAuthors={highlightAuthors()}
          />
        </section>
      )}


      <ClosingNote
        heading="Research with the people it serves. Join the lab."
        links={[
          { text: "Join the lab", href: "/join-us" },
          { text: "Start a collaboration", href: "/contact" },
        ]}
      />
    </>
  );
}
