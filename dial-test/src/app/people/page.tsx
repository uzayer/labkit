import { AlumniGrid } from "@/components/alumni-grid";
import { ScrollRuler } from "@/components/scroll-ruler";
import { ClosingNote } from "@/components/closing-note";
import { SectionHeader, sectionSpacing } from "@/components/editorial";
import { FaqSection } from "@/components/faq-section";
import { PageHeader } from "@/components/page-header";
import { PeopleRoster } from "@/components/people-roster";
import { PIProfile } from "@/components/pi-profile";
import { labStats } from "@/data";
import { peopleFaqs } from "@/data/faqs";
import { alumniList, peopleGroups, toPIProfile } from "@/data/views";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "People",
  description:
    "Meet the researchers, students, and collaborators behind the Design Inclusion and Access Lab at North South University.",
};

export default function PeoplePage() {
  const stats = labStats();
  const pi = toPIProfile();
  const groups = peopleGroups();
  const alumni = alumniList();

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        art="bloom"
        title="People"
        description="Faculty, research assistants, and collaborators who run DIAL's fieldwork, build its systems, and write its papers, and the alumni who have moved on."
        facts={[
          { value: String(stats.researchersMentored), label: "Researchers mentored" },
          { value: String(stats.alumniPlaced), label: "Alumni placed" },
        ]}
      />

      {pi && <PIProfile pi={pi} />}

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader title="The team" className="mb-8" />
        <PeopleRoster
          groups={[
            { title: "Faculty & research staff", members: groups.facultyStaff },
            { title: "Graduate research assistants", members: groups.graduateRAs },
            {
              title: "Undergraduate research assistants",
              members: groups.undergraduateRAs,
              initialCount: 9,
            },
            { title: "Collaborators", members: groups.collaborators },
          ]}
        />
      </section>

      {alumni.length > 0 && (
        <section className={cn("container", sectionSpacing)}>
          <SectionHeader
            label="Alumni"
            title="Where our people go"
            description="DIAL alumni are in PhD programmes, research institutions, and industry."
            className="mb-8"
          />
          <AlumniGrid alumni={alumni} />
        </section>
      )}

      <FaqSection items={peopleFaqs} title="About the roster" />

      <ScrollRuler />

      <ClosingNote
        heading="No prerequisites. Curious about HCI and ready for fieldwork in Bangladesh?"
        links={[
          { text: "Apply to join", href: "/join-us" },
          { text: "Contact the lab", href: "/contact" },
        ]}
      />
    </>
  );
}
