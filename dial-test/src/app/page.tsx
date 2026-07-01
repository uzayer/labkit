import { About6 } from "@/components/about6";
import {
  HomeImpactStats,
  HomeLabInvitation,
  HomeResearchAreas,
} from "@/components/home-sections";
import { Hero171 } from "@/components/hero171";
import { Logos12 } from "@/components/logos12";
import {
  PublicationsSection,
  SAMPLE_PUBLICATIONS,
} from "@/components/publications1";

export default function Home() {
  return (
    <>
      <Hero171 />
      <HomeImpactStats />
      <Logos12 className="py-12" />
      <About6 className="py-16" />
      <HomeResearchAreas />
      <PublicationsSection
        yearGroups={SAMPLE_PUBLICATIONS}
        heading="Selected Publications"
        viewAllHref="/publications"
        viewAllLabel="Explore Publications"
      />
      <HomeLabInvitation />
    </>
  );
}
