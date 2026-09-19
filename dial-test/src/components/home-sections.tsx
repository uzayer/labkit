import {
  Accessibility,
  ArrowRight,
  Brain,
  Cpu,
  Globe,
  GraduationCap,
  Heart,
  MessageSquareWarning,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";

import {
  FlatPublicationList,
  type PublicationYear,
} from "@/components/publications1";
import { Button } from "@/components/ui/button";
import { eyebrow, sectionHeading } from "@/lib/typography";
import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
}

/** Counts for the impact strip, computed from the records by the page. */
export interface HomeImpactCounts {
  publications: number;
  awards: number;
  yearsOfResearch: number | null;
}

// Labels and copy are prose; the numbers come from `HomeImpactCounts`.
const impactStats = [
  {
    key: "publications",
    label: "peer-reviewed publications",
    detail: "HCI, ICTD, privacy, accessibility, and health venues.",
    href: "/publications",
  },
  {
    key: "awards",
    label: "awards and honours",
    detail: "Recognition across CHI, SOUPS, COMPASS, and partner programs.",
    href: "/awards",
  },
  {
    key: "yearsOfResearch",
    label: "years of research",
    detail: "A long-running lab at North South University, Dhaka.",
    href: "/about",
  },
] as const;

/** A Research Theme card: title, slug, and short description from the record. */
export interface HomeResearchArea {
  slug: string;
  title: string;
  description: string;
}

// Icons are presentation, keyed by theme slug.
const THEME_ICONS: Record<string, LucideIcon> = {
  "accessibility-inclusion": Accessibility,
  "gender-feminist-hci": Users,
  "mental-health-wellbeing": Heart,
  "explainable-ai-ml": Brain,
  ictd: Globe,
  "safety-security": ShieldCheck,
  "computing-education-community": GraduationCap,
  "infodemic-misinformation": MessageSquareWarning,
  "iot-low-cost-hardware": Cpu,
};

const audiences = [
  {
    label: "Students",
    text: "Undergraduate and graduate researchers learning to build with care.",
  },
  {
    label: "Collaborators",
    text: "Researchers who want co-authored, co-designed work.",
  },
  {
    label: "Partners",
    text: "Universities, NGOs, funders, and community groups.",
  },
];

export function HomeImpactStats({
  counts,
  className,
}: SectionProps & { counts: HomeImpactCounts }) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container">
        <ul className="grid gap-4 md:grid-cols-3">
          {impactStats.map((stat) => (
            <li key={stat.label}>
              <Link
                href={stat.href}
                className="group flex h-full flex-col rounded-[1.5rem] bg-muted/60 p-6 transition-[background-color,transform] duration-150 ease-out hover:bg-muted active:scale-[0.98]"
              >
                <span className="text-5xl font-semibold tracking-tight text-foreground tabular-nums">
                  {counts[stat.key] ?? "—"}
                </span>
                <span className="mt-4 flex items-center justify-between text-lg font-semibold">
                  {stat.label}
                  <ArrowRight className="size-4 text-muted-foreground arrow-ne transition-colors group-hover:text-foreground" />
                </span>
                <span className="mt-2 text-sm leading-6 text-muted-foreground">
                  {stat.detail}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function HomeResearchAreas({
  areas,
  className,
}: SectionProps & { areas: HomeResearchArea[] }) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className={eyebrow}>Research areas</p>
            <h2 className={cn(sectionHeading, "mt-4")}>
              The lab works where social need and technical systems meet.
            </h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/research">
              View all themes
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {areas.map((area) => {
            const Icon = THEME_ICONS[area.slug] ?? Globe;
            return (
              <Link
                key={area.slug}
                href={`/research/${area.slug}`}
                className="group rounded-[1.75rem] border bg-card p-6 shadow-sm transition-[background-color,transform] duration-150 ease-out hover:bg-muted/60 active:scale-[0.98]"
              >
                <div className="mb-8 flex items-center justify-between">
                  <span className="rounded-2xl border bg-background p-3">
                    <Icon className="size-6 text-primary" strokeWidth={1.5} />
                  </span>
                  <ArrowRight className="size-5 text-muted-foreground arrow-ne transition-colors group-hover:text-foreground" />
                </div>
                <h3 className="text-xl font-semibold tracking-tight">
                  {area.title}
                </h3>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  {area.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/**
 * A short, ungrouped list for the home page. Year headings suit the full
 * archive, but with a handful of papers they left one paper per year and a
 * tall gap between each, so here the year sits inline on each row instead.
 */
export function HomeSelectedPublications({
  yearGroups,
  highlightAuthors,
  className,
}: SectionProps & {
  yearGroups: PublicationYear[];
  highlightAuthors?: string[];
}) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className={eyebrow}>Publications</p>
            <h2 className={cn(sectionHeading, "mt-4")}>Selected work</h2>
          </div>
          <Button asChild variant="outline" className="w-fit rounded-full">
            <Link href="/publications">
              Explore publications
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <FlatPublicationList
          yearGroups={yearGroups}
          highlightAuthors={highlightAuthors}
          showYear
          className="mt-12"
        />
      </div>
    </section>
  );
}

export function HomeLabInvitation({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid gap-10 rounded-[2rem] border bg-card p-8 shadow-sm md:p-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-center lg:p-14">
          <div>
            <p className={eyebrow}>Work with us</p>
            <h2 className={cn(sectionHeading, "mt-4")}>
              Research with purpose. Join the lab.
            </h2>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              DIAL welcomes people who want rigorous technology work to stay
              accountable to real human needs.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/join-us">Join the lab</Link>
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
          <dl className="divide-y">
            {audiences.map((audience) => (
              <div key={audience.label} className="py-5 first:pt-0 last:pb-0">
                <dt className="font-semibold">{audience.label}</dt>
                <dd className="mt-1 text-sm leading-6 text-muted-foreground">
                  {audience.text}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </section>
  );
}
