import {
  Accessibility,
  ArrowRight,
  BadgeCheck,
  BookOpen,
  Brain,
  ClipboardCheck,
  Cpu,
  GraduationCap,
  Handshake,
  Heart,
  MapPinned,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
}

const researchStats = [
  {
    value: "20+",
    label: "active projects",
    detail: "Across accessibility, safety, health, development, and AI.",
  },
  {
    value: "65+",
    label: "publications",
    detail:
      "Peer-reviewed work in HCI, ICTD, privacy, CSCW, and systems venues.",
  },
  {
    value: "6",
    label: "best paper awards",
    detail: "Recognition from CHI, CSCW, UIST, COMPASS, and adjacent venues.",
  },
];

const researchThemes = [
  {
    title: "Accessibility & Inclusion",
    description:
      "Voice interfaces, rehabilitation tools, and accessible systems for users mainstream design leaves behind.",
    href: "/research/accessibility-inclusion",
    icon: Accessibility,
    meta: "18 publications",
    size: "large",
  },
  {
    title: "Gender & Feminist HCI",
    description:
      "Research on safety, agency, digital abuse, labour, and the politics of technology in South Asia.",
    href: "/research/gender-feminist-hci",
    icon: Users,
    meta: "14 publications",
    size: "wide",
  },
  {
    title: "ICT for Development",
    description:
      "Systems and methods for financial inclusion, information access, agriculture, and civic life.",
    href: "/research/ictd",
    icon: MapPinned,
    meta: "20 publications",
    size: "small",
  },
  {
    title: "Mental Health & Wellbeing",
    description:
      "Low-resource care, passive sensing, peer support, and culturally grounded interventions.",
    href: "/research/mental-health-wellbeing",
    icon: Heart,
    meta: "12 publications",
    size: "small",
  },
  {
    title: "Explainable AI & ML",
    description:
      "Making model behaviour understandable in health, finance, and other high-stakes settings.",
    href: "/research/explainable-ai-ml",
    icon: Brain,
    meta: "10 publications",
    size: "small",
  },
  {
    title: "Safety & Security",
    description:
      "Threat modelling and personal safety technology for people facing real-world risk.",
    href: "/research/safety-security",
    icon: ShieldCheck,
    meta: "9 publications",
    size: "small",
  },
  {
    title: "IoT & Low-cost Hardware",
    description:
      "Affordable sensing and interaction systems for clinics, classrooms, and communities.",
    href: "/research/iot-low-cost-hardware",
    icon: Cpu,
    meta: "7 publications",
    size: "small",
  },
  {
    title: "Infodemic & Misinformation",
    description:
      "How low-literacy communities encounter, trust, share, and correct harmful information.",
    href: "/research/infodemic-misinformation",
    icon: TriangleAlert,
    meta: "8 publications",
    size: "small",
  },
  {
    title: "Computing Education & Community",
    description:
      "Broadening participation in computing through curriculum, outreach, and mentorship.",
    href: "/research/computing-education-community",
    icon: GraduationCap,
    meta: "11 publications",
    size: "wide",
  },
];

const methods = [
  {
    title: "Fieldwork before tooling",
    body: "Projects start with interviews, visits, workshops, and patient listening before a technical intervention is proposed.",
    icon: MapPinned,
  },
  {
    title: "Co-design under constraint",
    body: "Bandwidth, literacy, language, trust, device access, and local institutions shape the design brief from the beginning.",
    icon: Handshake,
  },
  {
    title: "Prototype, evaluate, publish",
    body: "The lab turns findings into working systems, papers, datasets, methods, and student research trajectories.",
    icon: ClipboardCheck,
  },
];

const spotlightProjects = [
  {
    title: "Protibadi",
    localName: "প্রতিবাদী",
    description:
      "Personal safety research with women navigating harassment in Bangladesh.",
    href: "/projects/protibadi",
    badge: "Best of CHI",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg",
  },
  {
    title: "Jyoti",
    localName: "জ্যোতি",
    description:
      "A low-literacy voice interface for rural health information access.",
    href: "/projects/jyoti",
    badge: "Best Paper",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-2.svg",
  },
  {
    title: "Mon Majhi",
    localName: "মন মাঝি",
    description:
      "Explainable passive sensing for stress and depression screening.",
    href: "/projects/monmajhi",
    badge: "Mental Health",
    image:
      "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-3.svg",
  },
];

function themeCardClass(size: string) {
  return cn(
    "group flex min-h-64 flex-col justify-between rounded-[1.75rem] border bg-card p-6 shadow-sm transition-colors hover:bg-muted/60",
    size === "large" && "sm:col-span-3 sm:row-span-2",
    size === "wide" && "sm:col-span-2",
  );
}

export function ResearchStats({ className }: SectionProps) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container">
        <div className="grid gap-8 divide-y rounded-[2rem] border bg-card p-8 shadow-sm md:grid-cols-3 md:divide-x md:divide-y-0 md:p-10">
          {researchStats.map((stat) => (
            <div
              key={stat.label}
              className="pt-8 first:pt-0 md:px-8 md:pt-0 md:first:pl-0 md:last:pr-0"
            >
              <p className="text-5xl font-semibold tracking-[-0.06em] md:text-6xl">
                {stat.value}
              </p>
              <h2 className="mt-4 text-lg font-semibold">{stat.label}</h2>
              <p className="mt-2 text-sm leading-6 text-muted-foreground">
                {stat.detail}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ResearchThemesBento({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="mb-10 max-w-3xl">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Research themes
          </p>
          <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
            A map of the questions DIAL returns to.
          </h2>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            The grid borrows Tailark&apos;s bento rhythm, but the hierarchy is
            academic: bigger cards indicate long-running programs with more
            publications, projects, and collaborators.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-5">
          {researchThemes.map((theme) => {
            const Icon = theme.icon;
            return (
              <Link
                key={theme.title}
                href={theme.href}
                className={themeCardClass(theme.size)}
              >
                <div>
                  <div className="mb-8 flex items-center justify-between">
                    <span className="rounded-2xl border bg-background p-3">
                      <Icon className="size-6 text-primary" strokeWidth={1.5} />
                    </span>
                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
                  </div>
                  <h3 className="text-2xl font-semibold tracking-tight">
                    {theme.title}
                  </h3>
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {theme.description}
                  </p>
                </div>
                <Badge variant="outline" className="mt-8 w-fit">
                  {theme.meta}
                </Badge>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function ResearchMethod({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid gap-10 rounded-[2rem] border bg-muted/40 p-6 shadow-sm md:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-16">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              How research happens
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] md:text-5xl">
              Methods shaped by field relationships.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              DIAL projects usually begin before a technical brief exists: with
              visits, interviews, workshops, and an effort to understand local
              constraints on their own terms.
            </p>
          </div>

          <div className="grid gap-4">
            {methods.map((method, index) => {
              const Icon = method.icon;
              return (
                <div
                  key={method.title}
                  className="rounded-[1.5rem] bg-background p-6"
                >
                  <div className="mb-5 flex items-center gap-3">
                    <Badge variant="outline">0{index + 1}</Badge>
                    <Icon className="size-5 text-primary" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl font-semibold tracking-tight">
                    {method.title}
                  </h3>
                  <p className="mt-3 text-sm leading-6 text-muted-foreground">
                    {method.body}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchSpotlightBento({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="mb-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Selected projects
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              Examples from longer research programs.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/projects">
              View all projects
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="grid gap-4 lg:grid-cols-6">
          {spotlightProjects.map((project, index) => (
            <Link
              key={project.title}
              href={project.href}
              className={cn(
                "group overflow-hidden rounded-[1.75rem] border bg-card shadow-sm transition-colors hover:bg-muted/60",
                index === 0 ? "lg:col-span-3 lg:row-span-2" : "lg:col-span-3",
              )}
            >
              <div className="grid h-full md:grid-cols-[0.9fr_1.1fr]">
                <div className="bg-muted">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="h-full min-h-56 w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="flex flex-col justify-between p-6">
                  <div>
                    <Badge variant="outline" className="mb-6 w-fit">
                      <BadgeCheck className="size-3" />
                      {project.badge}
                    </Badge>
                    <h3 className="text-2xl font-semibold tracking-tight">
                      {project.localName} · {project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center text-sm font-medium">
                    Read project
                    <ArrowRight className="ml-1.5 size-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </Link>
          ))}

          <div className="rounded-[1.75rem] border bg-primary p-6 text-primary-foreground shadow-sm lg:col-span-2">
            <BookOpen className="size-6" strokeWidth={1.5} />
            <h3 className="mt-6 text-xl font-semibold">Scholarly record</h3>
            <p className="mt-3 text-sm leading-6 text-primary-foreground/80">
              Projects are documented through papers, artifacts, awards, and
              student-authored research outputs.
            </p>
          </div>
          <div className="rounded-[1.75rem] border bg-card p-6 shadow-sm lg:col-span-2">
            <Handshake className="size-6 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 text-xl font-semibold">
              Collaborative context
            </h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Many studies involve NGOs, funders, universities, clinics, and
              community organisations in Bangladesh and abroad.
            </p>
          </div>
          <div className="rounded-[1.75rem] border bg-card p-6 shadow-sm lg:col-span-2">
            <GraduationCap className="size-6 text-primary" strokeWidth={1.5} />
            <h3 className="mt-6 text-xl font-semibold">Student research</h3>
            <p className="mt-3 text-sm leading-6 text-muted-foreground">
              Undergraduate and graduate researchers contribute to fieldwork,
              analysis, prototyping, and publication.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function ResearchInvitation({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="rounded-[2rem] border bg-card p-8 text-center shadow-sm md:p-14">
          <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
            Continue reading
          </p>
          <h2 className="mx-auto mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
            Trace the work through papers, projects, and people.
          </h2>
          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
            The bibliography and project directory give a fuller view of how
            research questions develop across themes, communities, and years.
          </p>
          <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg" className="rounded-full px-7">
              <Link href="/publications">Browse publications</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-full px-7"
            >
              <Link href="/contact">Start a collaboration</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
