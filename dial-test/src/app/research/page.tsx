import { Feature199 } from "@/components/feature199";
import { FeaturedPublications } from "@/components/featured-publications";
import { Hero262 } from "@/components/hero262";
import { Logos1 } from "@/components/logos1";
import {
  ResearchInvitation,
  ResearchMethod,
  ResearchSpotlightBento,
  ResearchStats,
} from "@/components/research-sections";

export default function ResearchPage() {
  return (
    <>
      <Hero262
        heading="Research at the margins"
        subheading="HCI and participatory design for communities existing technology has overlooked."
        description="DIAL studies access, inclusion, safety, wellbeing, and development in low-resource settings, then builds and evaluates technology with the people expected to use it."
        stats={[
          { value: "20+", label: "Active projects" },
          { value: "65+", label: "Publications" },
          { value: "6", label: "Best paper awards · CHI, CSCW, UIST" },
          { value: "2017", label: "Active since" },
        ]}
      />
      <Logos1 className="py-12" />
      <ResearchStats />
      <Feature199 className="py-16 md:py-24" />
      <ResearchMethod />
      <ResearchSpotlightBento />
      <FeaturedPublications className="py-16 md:py-24" />
      <ResearchInvitation />
    </>
  );
}
