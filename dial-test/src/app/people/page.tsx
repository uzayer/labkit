import { AlumniGrid } from "@/components/alumni-grid";
import { Cta32 } from "@/components/cta32";
import { PIProfile } from "@/components/pi-profile";
import { PeopleStats } from "@/components/people-stats";
import { Team5_9 } from "@/components/team5-9";

export const metadata = {
  title: "People — DIAL",
  description:
    "Meet the researchers, students, and collaborators behind the Design Inclusion and Access Lab at North South University.",
};

export default function PeoplePage() {
  return (
    <>
      <PeopleStats />
      <PIProfile className="border-b border-border" />
      <Team5_9 />
      <AlumniGrid className="border-t border-border" />
      <Cta32
        heading="No prerequisites. "
        highlightHeading="Passionate about HCI."
        description="Ready to do fieldwork in Bangladesh. If you want to work on technology that actually matters to the people using it, DIAL is where that work happens."
        buttons={{
          primary: { text: "Apply to join", url: "/join-us" },
          secondary: { text: "Contact the lab", url: "/contact" },
        }}
        stats={[
          { label: "50+", description: "researchers mentored since 2017" },
          { label: "21", description: "alumni in PhD programmes and industry" },
          { label: "6", description: "best paper awards at CHI, COMPASS, SOUPS" },
        ]}
        className="py-24"
      />
    </>
  );
}
