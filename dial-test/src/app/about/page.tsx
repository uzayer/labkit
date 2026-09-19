import { ClosingNote } from "@/components/closing-note";
import {
  InkBand,
  NameLine,
  NumberedSteps,
  PullQuote,
  SectionHeader,
  sectionSpacing,
} from "@/components/editorial";
import { PageHeader } from "@/components/page-header";
import { PhotoSlot } from "@/components/photo-slot";
import { ScrollStroke } from "@/components/scroll-stroke";
import { labInfo, labStats, venuesByPublicationCount } from "@/data";
import { displaySectionTitle, label } from "@/lib/typography";
import { cn } from "@/lib/utils";

const stats_ = labStats();

export const metadata = {
  title: "About",
  description:
    "DIAL is a research lab at North South University, Dhaka, focused on inclusivity and access for marginalised communities through participatory design and fieldwork.",
};

const values = [
  {
    title: "Participation over prescription",
    body: "We design with communities, not for them. Every project begins with fieldwork — listening before building.",
  },
  {
    title: "Constraints as design material",
    body: "Low bandwidth, limited literacy, affordable hardware. We treat the real conditions of our users as the starting point, not an afterthought.",
  },
  {
    title: "Rigour from the margins",
    body: "HCI from Bangladesh can set the agenda. Our work surfaces problems — and solutions — that richer contexts miss.",
  },
  {
    title: "Mentorship as mission",
    body: `${stats_.researchersMentored} researchers mentored since ${labInfo.hciResearchSince}. Many now in PhD programmes at Cardiff, Ohio State, UMass, and VU Amsterdam. The lab is a launchpad.`,
  },
];

const facts = [
  ...(labInfo.foundedYear ? [{ value: String(labInfo.foundedYear), label: "Founded" }] : []),
  { value: String(stats_.researchersMentored), label: "Researchers mentored" },
  { value: String(stats_.publications), label: "Publications" },
];

const methods = [
  {
    title: "Fieldwork first",
    body: "Projects begin with interviews, visits, workshops, and patient listening before a tool is proposed.",
  },
  {
    title: "Prototype with communities",
    body: "Ideas are made tangible early, then reshaped through feedback from the people expected to use them.",
  },
  {
    title: "Publish and deploy",
    body: "The lab turns findings into papers, systems, methods, and student research trajectories.",
  },
];

const milestones = [
  {
    year: String(labInfo.hciResearchSince),
    title: "HCI research begins",
    body: "NSUHCI starts focusing on HCI research at North South University through a collaboration with Google.",
  },
  {
    year: "2019",
    title: "Global HCI recognition",
    body: "Community-centered safety and inclusion work earns attention at leading HCI venues.",
  },
  {
    year: String(labInfo.foundedYear),
    title: "DIAL founded",
    body: "NSUHCI establishes DIAL, the Design Inclusion and Access Lab, focused on technology design, inclusion, and access.",
  },
  {
    year: "2024",
    title: "Broader research platform",
    body: "The lab now spans accessibility, ICTD, mental health, explainable AI, safety, and education.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="North South University · Dhaka"
        art="orbit"
        title="HCI research from the margins, built with the people it serves."
        description="DIAL studies access, inclusion, safety, wellbeing, and development in real-world Bangladeshi contexts where constraints shape the work."
        facts={facts}
      >
        <NameLine
          label="Published at"
          names={venuesByPublicationCount()
            .slice(0, 6)
            .map((v) => v.shortName ?? v.name)}
          className="mt-8"
        />
      </PageHeader>

      <section className={cn("container", sectionSpacing, "pt-0 md:pt-0")}>
        <div data-reveal className="relative grid gap-10 pt-6 lg:grid-cols-[minmax(0,22rem)_1fr] lg:gap-24">
          <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
          <div className="reveal-item lg:sticky lg:top-28 lg:self-start">
            <p className={cn(label, "mb-3")}>What we do</p>
            <h2 className={cn(displaySectionTitle, "text-balance")}>
              Research that treats constraints as design material.
            </h2>
          </div>

          <div className="reveal-item max-w-prose space-y-5 text-pretty leading-relaxed text-muted-foreground md:text-lg">
            <p>
              <span className="text-foreground">DIAL—the Design Inclusion and Access Lab at North South University—</span>
              was established in {labInfo.foundedYear} by NSUHCI, the HCI research group Dr. Nova
              Ahmed and her colleagues began in {labInfo.hciResearchSince} through a collaboration
              with Google. We are based in the Department of Electrical and Computer Engineering.
            </p>
            <p>
              Our research focuses on inclusivity and access for marginalised communities, building
              technology that is locally appropriate, low-cost, and explainable. We use participatory
              design and long-term fieldwork to understand problems from the inside, then build and
              evaluate technology with the people who will use it.
            </p>
            <p>
              We collaborate across universities, funders, and partners to study inclusion, safety,
              wellbeing, and development, always with attention to constraints like language,
              bandwidth, devices, and trust.
            </p>
          </div>
        </div>
      </section>

      {/* Slots for the Lab's own photographs of how it works; printed
          compositions stand in until DIAL supplies them. */}
      <section className={cn("container", sectionSpacing)}>
        <div className="grid gap-6 md:grid-cols-[1.4fr_1fr]">
          <PhotoSlot alt="The Lab at work" art="orbit" aspect="aspect-16/9" />
          <PhotoSlot alt="A community workshop" art="strata" aspect="aspect-16/9" />
        </div>
      </section>

      {/* The page's one full-bleed section; see InkBand — at most one. */}
      <InkBand>
        <PullQuote>We design with communities, not around them.</PullQuote>
      </InkBand>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader label="Values" title="What the lab holds to" className="mb-2" />
        <dl className="grid gap-x-12 md:grid-cols-2">
          {values.map((value) => (
            <div key={value.title} className="border-b border-border py-6">
              <dt className="font-display text-2xl leading-snug">{value.title}</dt>
              <dd className="mt-2 text-pretty text-muted-foreground">{value.body}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader label="Method" title="From field insight to usable systems" className="mb-10" />
        <NumberedSteps steps={methods} />
      </section>

      <section className={cn("container", sectionSpacing, "relative")}>
        <ScrollStroke variant="loop" className="right-0 hidden w-24 xl:block" />
        <SectionHeader label="Lab story" title="How DIAL got here" className="mb-2" />
        <ol className="divide-y divide-border border-b border-border">
          {milestones.map((milestone) => (
            <li key={milestone.title} className="grid gap-2 py-6 sm:grid-cols-[8rem_1fr] sm:gap-8">
              <span className="font-display text-3xl tabular-nums">{milestone.year}</span>
              <div className="max-w-prose">
                <h3 className="font-medium">{milestone.title}</h3>
                <p className="mt-1 text-pretty text-muted-foreground">{milestone.body}</p>
              </div>
            </li>
          ))}
        </ol>
      </section>


      <ClosingNote
        heading="Curious about the work?"
        links={[
          { text: "Explore research", href: "/research" },
          { text: "Contact us", href: "/contact" },
        ]}
      />
    </>
  );
}
