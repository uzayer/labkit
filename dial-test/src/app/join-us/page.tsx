import { NumberedSteps, PrimaryLink, SectionHeader, TextLink, sectionSpacing } from "@/components/editorial";
import { ExpandableList } from "@/components/expandable-list";
import { MarginNote, SquiggleUnderline } from "@/components/marks";
import { PageHeader } from "@/components/page-header";
import { labInfo } from "@/data";
import { label } from "@/lib/typography";
import { cn } from "@/lib/utils";

export const metadata = {
  title: "Join the lab",
  description:
    "Join the Design Inclusion and Access Lab at North South University. No prerequisites: curiosity about people and technology is enough.",
};

const formatDay = (iso: string) =>
  new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric", timeZone: "UTC" });

// Reports the recorded recruitment window against today's date, so the page
// never claims applications are open after the window closes.
function recruitmentStatus(now = new Date()): { text: string; open: boolean } | null {
  const recruitment = labInfo.recruitment;
  if (!recruitment) return null;
  const opens = new Date(recruitment.opens);
  const closes = new Date(`${recruitment.closes}T23:59:59Z`);
  const range = `${formatDay(recruitment.opens)} – ${formatDay(recruitment.closes)}, ${closes.getUTCFullYear()}`;
  if (now < opens) return { text: `Applications open ${range}`, open: false };
  if (now <= closes) return { text: `Applications open now · ${range}`, open: true };
  return { text: `Last recruitment ${range}`, open: false };
}

const REASONS = [
  {
    title: "No prerequisites",
    body: "We look for curiosity, not credentials. If you ask good questions about people and technology, you belong here.",
  },
  {
    title: "Fieldwork in Bangladesh",
    body: "Research happens in the field, with garment workers, urban youth, and rural health communities across Bangladesh.",
  },
  {
    title: "Publish at top venues",
    body: "DIAL publishes at CHI, CSCW, UIST, and JMIR. Lab members co-author real papers.",
  },
  {
    title: "A lab, not a job",
    body: "Small team, flat hierarchy. Nova works directly with every lab member.",
  },
];

// Captions for the Lab-life photographs DIAL will supply. Until real, consented
// photos exist the moments are listed as text: a stock photo captioned as a
// DIAL event would be a fabrication (labs/dial/design-principles.md).
const MOMENTS = [
  { title: "Lab sessions", caption: "Weekly meetings in Dhaka where ideas become research questions." },
  { title: "Fieldwork", caption: "Research happens where the people are, not in the lab." },
  { title: "Iftar together", caption: "Every Ramadan the lab gathers. Research is also relationships." },
  { title: "Conference trips", caption: "DIAL researchers presenting their work to a global audience." },
  { title: "Research presentations", caption: "Every lab member presents at NSU, from their first semester." },
];

const OPENINGS = [
  {
    category: "Graduate research assistant",
    roles: [
      {
        title: "HCI research assistant — Mental Health & Wellbeing",
        body: "Qualitative research on mental health support systems for urban youth in Bangladesh.",
      },
      {
        title: "HCI research assistant — Accessibility & Inclusion",
        body: "Design and evaluate accessible technologies through field research and participatory user studies.",
      },
    ],
  },
  {
    category: "Undergraduate research assistant",
    roles: [
      {
        title: "Research assistant (emerging researcher)",
        body: "For undergraduates curious about HCI. Work alongside graduate researchers on active projects; no prior research experience required.",
      },
    ],
  },
];

const HOW_TO_APPLY = [
  {
    title: "Write a short email",
    body: "Subject: “Application for DIAL Recruitment [Semester] – Your Name”. Tell us what draws you to HCI research; that matters more than your CV.",
  },
  {
    title: "Attach the basics",
    body: "Your CV, a short research-interest statement, your current program and year, and any relevant skills or experience.",
  },
  {
    title: "Hear back",
    body: "We read every application and reply to everyone shortlisted within two weeks.",
  },
];

export default function JoinUsPage() {
  const status = recruitmentStatus();
  const applyHref = `mailto:${labInfo.email}`;

  return (
    <>
      <PageHeader
        eyebrow="Join the lab"
        art="signal"
        title="No prerequisites. Just curiosity."
        description="If you are curious about how technology shapes lives in Bangladesh, and want to do research that matters, DIAL is for you."
      >
        <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <div className="flex items-end gap-3">
            <PrimaryLink href={applyHref}>Apply by email</PrimaryLink>
            {/* Marginalia: the note and arrow are decoration around a real action. */}
            <MarginNote className="pb-1">
              that is the whole process
            </MarginNote>
          </div>
          {status && (
            <p className={cn("inline-flex items-center gap-2 text-sm", status.open ? "text-brand" : "text-muted-foreground")}>
              <span className={cn("size-1.5 rounded-full", status.open ? "bg-brand" : "bg-muted-foreground/50")} />
              {status.text}
            </p>
          )}
        </div>
      </PageHeader>

      <section className={cn("container", sectionSpacing, "pt-0 md:pt-0")}>
        <SectionHeader label="Why DIAL" title="Research that reaches the people who need it most" className="mb-2" />
        <ExpandableList items={REASONS} className="mt-6 max-w-3xl" />
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader label="Openings" title="Current openings" className="mb-6" />
        <div className="flex flex-col gap-12">
          {OPENINGS.map((group) => (
            <div key={group.category}>
              <h3 className={label}>{group.category}</h3>
              <ul className="mt-4 divide-y divide-border border-y border-border">
                {group.roles.map((role) => (
                  <li key={role.title}>
                    <a
                      href={applyHref}
                      className="group -mx-4 grid gap-2 rounded-lg px-4 py-6 transition-colors duration-150 ease-snappy hover:bg-muted/50 active:bg-muted md:grid-cols-[1fr_minmax(0,28rem)_1.25rem] md:gap-8"
                    >
                      <span className="relative w-fit font-display text-2xl leading-snug">
                        {role.title}
                        <SquiggleUnderline />
                      </span>
                      <span className="text-pretty text-muted-foreground">
                        {role.body}
                        <span className="mt-1 block text-sm">{labInfo.institution}, Dhaka</span>
                      </span>
                      <span aria-hidden className="hidden text-muted-foreground arrow-ne md:block">
                        →
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader label="Life at DIAL" title="What it is like to work here" className="mb-2" />
        <ul className="grid gap-x-12 sm:grid-cols-2 lg:grid-cols-3">
          {MOMENTS.map((moment) => (
            <li key={moment.title} className="border-b border-border py-6">
              <p className="font-display text-xl">{moment.title}</p>
              <p className="mt-1 text-pretty text-muted-foreground">{moment.caption}</p>
            </li>
          ))}
        </ul>
      </section>

      <section className={cn("container", sectionSpacing)}>
        <SectionHeader label="How to apply" title="Three steps, no forms" className="mb-10" />
        <NumberedSteps steps={HOW_TO_APPLY} />
        <div className="mt-12 flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-8">
          <PrimaryLink href={applyHref}>Apply by email</PrimaryLink>
          <TextLink href="/contact" className="text-muted-foreground hover:text-foreground">
            Questions? Contact the lab
          </TextLink>
        </div>
      </section>
    </>
  );
}
