import {
  Accessibility,
  ArrowRight,
  BookOpen,
  Brain,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  MapPinned,
  ShieldCheck,
  Trophy,
  Users,
} from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SectionProps {
  className?: string;
}

const impactStats = [
  {
    value: "50+",
    label: "peer-reviewed publications",
    detail: "HCI, ICTD, privacy, accessibility, and health venues.",
  },
  {
    value: "20+",
    label: "awards and honours",
    detail: "Recognition across CHI, SOUPS, COMPASS, and partner programs.",
  },
  {
    value: "15+",
    label: "years of field research",
    detail: "Sustained community work across Bangladesh and beyond.",
  },
];

const researchAreas = [
  {
    title: "Accessibility & Inclusion",
    description:
      "Interfaces for low-literacy, disabled, and resource-constrained communities.",
    href: "/research/accessibility-inclusion",
    icon: Accessibility,
  },
  {
    title: "Gender & Feminist HCI",
    description:
      "Participatory research on safety, dignity, agency, and digital voice.",
    href: "/research/gender-feminist-hci",
    icon: Users,
  },
  {
    title: "Mental Health & Wellbeing",
    description:
      "Tools and methods for care where clinical infrastructure is limited.",
    href: "/research/mental-health-wellbeing",
    icon: Heart,
  },
  {
    title: "Explainable AI & ML",
    description:
      "Making algorithmic systems legible to non-experts and affected communities.",
    href: "/research/explainable-ai-ml",
    icon: Brain,
  },
  {
    title: "ICT for Development",
    description:
      "Technology interventions grounded in language, trust, bandwidth, and devices.",
    href: "/research/ictd",
    icon: Globe,
  },
  {
    title: "Safety & Security",
    description:
      "Digital safety systems co-designed with people facing real-world risk.",
    href: "/research/safety-security",
    icon: ShieldCheck,
  },
];

const fieldNotes = [
  {
    label: "Fieldwork",
    text: "Long-term studies with communities, practitioners, and local partners.",
    icon: MapPinned,
  },
  {
    label: "Scholarship",
    text: "Peer-reviewed research, open methods, and rigorous publication practice.",
    icon: BookOpen,
  },
  {
    label: "Training",
    text: "A home for student researchers learning to build with care.",
    icon: GraduationCap,
  },
];

export function HomeHero({ className }: SectionProps) {
  return (
    <section
      className={cn(
        "relative overflow-hidden bg-background py-16 md:py-24",
        className,
      )}
    >
      <div
        aria-hidden
        className="absolute inset-x-0 top-0 -z-10 h-96 bg-[radial-gradient(circle_at_20%_15%,var(--muted)_0,transparent_36%),radial-gradient(circle_at_80%_20%,var(--accent)_0,transparent_32%)]"
      />
      <div className="container">
        <div className="grid gap-12 lg:grid-cols-[1.03fr_0.97fr] lg:items-end">
          <div className="max-w-3xl">
            <div className="mb-7 flex w-fit items-center gap-2 rounded-full border bg-background/80 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.22em] text-muted-foreground shadow-sm">
              <span className="size-1.5 rounded-full bg-primary" />
              North South University · Dhaka
            </div>
            <h1 className="text-balance text-5xl font-semibold tracking-[-0.055em] text-foreground md:text-7xl lg:text-8xl">
              Technology for communities design usually misses.
            </h1>
            <p className="mt-7 max-w-2xl text-pretty text-lg leading-8 text-muted-foreground md:text-xl">
              DIAL studies how people live with technology in low-resource,
              high-stakes settings, then builds inclusive systems with the
              communities who will use them.
            </p>
            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <Button asChild size="lg" className="rounded-full px-7">
                <Link href="/research">Explore research</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full px-7"
              >
                <Link href="/join-us">Join the lab</Link>
              </Button>
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl lg:mx-0">
            <div className="absolute -left-6 top-16 hidden h-32 w-32 rounded-full border border-border md:block" />
            <div className="grid grid-cols-6 grid-rows-[7rem_8rem_5rem_6rem] gap-3 md:grid-rows-[8rem_10rem_6rem_7rem]">
              <div className="col-span-4 col-start-2 overflow-hidden rounded-[2rem] border bg-muted shadow-sm">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
                  alt="DIAL researchers in a collaborative field setting"
                  className="size-full object-cover"
                />
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden rounded-[2rem] border bg-card p-5 shadow-sm">
                <Trophy
                  className="mb-7 size-8 text-primary"
                  strokeWidth={1.5}
                />
                <p className="text-4xl font-semibold tracking-tight">CHI</p>
                <p className="mt-3 text-sm leading-6 text-muted-foreground">
                  Award-winning work in human-computer interaction and inclusive
                  technology.
                </p>
              </div>
              <div className="col-span-3 row-span-2 overflow-hidden rounded-[2rem] border bg-muted shadow-sm">
                <img
                  src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/johnson-wang-iI4sR_nkkbc-unsplash.jpg"
                  alt="Workshop and field research moment"
                  className="size-full object-cover"
                />
              </div>
              <div className="col-span-4 col-start-2 flex items-center rounded-[2rem] border bg-card p-5 shadow-sm">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">
                    Research stance
                  </p>
                  <p className="mt-1 text-xl font-semibold tracking-tight">
                    Community first, methods second, technology with purpose.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function HomeImpactStats({ className }: SectionProps) {
  return (
    <section className={cn("py-10 md:py-14", className)}>
      <div className="container">
        <div className="rounded-[2rem] border bg-card p-4 shadow-sm md:p-6">
          <div className="grid gap-4 md:grid-cols-3">
            {impactStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-[1.5rem] bg-muted/60 p-6 transition-colors hover:bg-muted"
              >
                <p className="text-5xl font-semibold tracking-[-0.06em] text-foreground">
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
      </div>
    </section>
  );
}

export function HomeResearchAreas({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="grid gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-start">
          <div className="lg:sticky lg:top-28">
            <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
              Research areas
            </p>
            <h2 className="mt-4 text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
              The lab works where social need and technical systems meet.
            </h2>
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Each theme is an active research program, grounded in field
              relationships, student training, and peer-reviewed scholarship.
            </p>
            <Button asChild variant="outline" className="mt-8 rounded-full">
              <Link href="/research">
                View all themes
                <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Link
              href="/research"
              className="group relative min-h-80 overflow-hidden rounded-[2rem] border bg-muted p-6 shadow-sm sm:col-span-2"
            >
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/nastuh-abootalebi-eHD8Y1Znfpk-unsplash.jpg"
                alt="Researchers collaborating around a table"
                className="absolute inset-0 size-full object-cover opacity-45 transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background via-background/75 to-background/10" />
              <div className="relative mt-auto flex h-full flex-col justify-end">
                <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                  DIAL method
                </p>
                <h3 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight md:text-4xl">
                  Build from field realities, not lab assumptions.
                </h3>
              </div>
            </Link>

            {researchAreas.map((area) => {
              const Icon = area.icon;
              return (
                <Link
                  key={area.title}
                  href={area.href}
                  className="group rounded-[1.75rem] border bg-card p-6 shadow-sm transition-colors hover:bg-muted/60"
                >
                  <div className="mb-8 flex items-center justify-between">
                    <span className="rounded-2xl border bg-background p-3">
                      <Icon className="size-6 text-primary" strokeWidth={1.5} />
                    </span>
                    <ArrowRight className="size-5 text-muted-foreground transition-transform group-hover:translate-x-1 group-hover:text-foreground" />
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
      </div>
    </section>
  );
}

export function HomeLabInvitation({ className }: SectionProps) {
  return (
    <section className={cn("py-16 md:py-24", className)}>
      <div className="container">
        <div className="overflow-hidden rounded-[2rem] border bg-card shadow-sm">
          <div className="grid lg:grid-cols-[1.05fr_0.95fr]">
            <div className="p-8 md:p-12 lg:p-14">
              <p className="text-sm font-medium uppercase tracking-[0.22em] text-muted-foreground">
                Work with us
              </p>
              <h2 className="mt-4 max-w-3xl text-balance text-4xl font-semibold tracking-[-0.045em] md:text-6xl">
                Research with purpose. Join the lab.
              </h2>
              <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
                DIAL welcomes students, collaborators, and partner organisations
                who want rigorous technology work to stay accountable to real
                human needs.
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
            <div className="border-t bg-muted/50 p-6 lg:border-l lg:border-t-0">
              <div className="grid h-full gap-4">
                {fieldNotes.map((note) => {
                  const Icon = note.icon;
                  return (
                    <div
                      key={note.label}
                      className="rounded-[1.5rem] bg-background p-5"
                    >
                      <Icon className="size-6 text-primary" strokeWidth={1.5} />
                      <h3 className="mt-5 font-semibold">{note.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-muted-foreground">
                        {note.text}
                      </p>
                    </div>
                  );
                })}
                <div className="rounded-[1.5rem] bg-primary p-5 text-primary-foreground">
                  <Handshake className="size-6" strokeWidth={1.5} />
                  <h3 className="mt-5 font-semibold">Partners</h3>
                  <p className="mt-2 text-sm leading-6 text-primary-foreground/80">
                    Universities, NGOs, funders, and community groups shaping
                    responsible technology in the Global South.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
