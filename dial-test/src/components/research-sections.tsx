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
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
}

/** A theme card in the bento: title/description from the record, counts derived. */
export interface ResearchThemeCard {
  slug: string;
  title: string;
  description: string;
  publicationCount: number;
  projectCount: number;
}

const THEME_ICONS: Record<string, LucideIcon> = {
  "accessibility-inclusion": Accessibility,
  "gender-feminist-hci": Users,
  ictd: MapPinned,
  "mental-health-wellbeing": Heart,
  "explainable-ai-ml": Brain,
  "safety-security": ShieldCheck,
  "iot-low-cost-hardware": Cpu,
  "infodemic-misinformation": TriangleAlert,
  "computing-education-community": GraduationCap,
};

// Bento sizing is presentation: the three themes with the most publications
// get the larger cards.
function bentoSize(index: number) {
  return index === 0 ? "large" : index < 3 ? "wide" : "small";
}

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

/** A Project in the spotlight bento. */
export interface SpotlightProject {
  title: string;
  localName?: string | null;
  description: string;
  href: string;
  badge: string;
  image: string;
}

/** A figure in the research stats strip; values are computed by the page. */
export interface ResearchStat {
  value: string;
  label: string;
  detail: string;
}

function themeCardClass(size: string) {
  return cn(
    "group flex min-h-64 flex-col justify-between rounded-[1.75rem] border bg-card p-6 shadow-sm transition-colors hover:bg-muted/60",
    size === "large" && "sm:col-span-3 sm:row-span-2",
    size === "wide" && "sm:col-span-2",
  );
}

export function ResearchStats({
  stats: researchStats,
  className,
}: SectionProps & { stats: ResearchStat[] }) {
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

export function ResearchThemesBento({
  themes,
  className,
}: SectionProps & { themes: ResearchThemeCard[] }) {
  const researchThemes = [...themes]
    .sort((a, b) => b.publicationCount - a.publicationCount)
    .map((theme, index) => ({
      ...theme,
      href: `/research/${theme.slug}`,
      icon: THEME_ICONS[theme.slug] ?? MapPinned,
      meta: `${theme.publicationCount} publications`,
      size: bentoSize(index),
    }));
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
                    <ArrowRight className="size-5 text-muted-foreground arrow-ne group-hover:text-foreground" />
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

export function ResearchSpotlightBento({
  projects: spotlightProjects,
  className,
}: SectionProps & { projects: SpotlightProject[] }) {
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
                      {project.localName ? `${project.localName} · ${project.title}` : project.title}
                    </h3>
                    <p className="mt-4 text-sm leading-6 text-muted-foreground">
                      {project.description}
                    </p>
                  </div>
                  <span className="mt-8 inline-flex items-center text-sm font-medium">
                    Read project
                    <ArrowRight className="ml-1.5 size-4 arrow-ne" />
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
