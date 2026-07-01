import { Careers3 } from "@/components/careers3";
import { Cta4 } from "@/components/cta4";
import { Feature10 } from "@/components/feature10";
import { Feature37 } from "@/components/feature37";
import { Hero197 } from "@/components/hero197";

export default function JoinUsPage() {
  return (
    <>
      <Hero197 />
      <Feature10 />
      <Feature37 />
      <Careers3 />
      <Cta4
        title="Ready to join?"
        description="Send us a short email introducing yourself. Tell us what draws you to HCI research — that matters more than your CV. We read every application and reply to everyone shortlisted within two weeks."
        buttonText="Apply now"
        buttonUrl="mailto:nsuhci.research@gmail.com"
        items={[
          "Subject: DIAL Application – [Semester] – Your Name",
          "Attach your CV",
          "A short research interest statement",
          "Your current program and year",
          "Any relevant skills or experience",
          "Questions? Email us anytime",
        ]}
      />
    </>
  );
}
