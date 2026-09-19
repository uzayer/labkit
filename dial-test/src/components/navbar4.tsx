"use client";

import {
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Calendar,
  Globe,
  GraduationCap,
  Lightbulb,
  Menu,
  Moon,
  Search,
  Sun,
  Tag,
  UserPlus,
  UserRound,
  Users,
  X,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useState, useSyncExternalStore, type ReactElement } from "react";

import { COMMUNITY_INK, CommunityMark } from "@/components/community-marks";
import {
  AsteriskMark,
  CropMarks,
  RegistrationMark,
  SquiggleUnderline,
  TickMark,
} from "@/components/marks";
import { OptionalImage } from "@/components/optional-image";
import { RisoArt } from "@/components/riso";
import { ThemeGlyph, themeInk } from "@/components/theme-marks";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

// ── Navigation data ────────────────────────────────────────────────────────
// Records arrive as a server-computed `nav` prop (see getNavData in
// src/data/views.ts), so this client component never imports the data module.

export interface NavData {
  researchThemes: { id: string; title: string; slug: string; description: string }[];
  awardedProjects: { id: string; title: string; award: string; slug: string }[];
  projectCategories: {
    title: string;
    projects: { id: string; title: string; description: string; href: string }[];
  }[];
  /** The most recent featured Lab award, for the Publications promo card. */
  headlineAward: { title: string; body: string } | null;
  publicationRecognition: { id: string; title: string; body: string; href: string }[];
  teamCategories: { id: string; title: string; description: string; href: string }[];
  alumniTeaser: { name: string; placement: string }[];
  alumniCount: number;
  pi: { name: string; title: string; photo: string | null } | null;
}

interface MenuProps {
  nav: NavData;
}

const TEAM_CATEGORY_ICONS: Record<string, LucideIcon> = {
  graduate: GraduationCap,
  undergraduate: UserRound,
  emerging: Lightbulb,
  everyone: Users,
};

// Browse modes are site navigation, not records.
const publicationsBrowse = [
  { id: "pb-1", title: "All Publications", description: "Complete bibliography.", href: "/publications", icon: BookOpen },
  { id: "pb-2", title: "By Year", description: "Chronological view of our output.", href: "/publications", icon: Calendar },
  { id: "pb-3", title: "By Research Theme", description: "Publications grouped by topic.", href: "/publications?view=theme", icon: Tag },
  { id: "pb-4", title: "By Venue", description: "Conference and journal index.", href: "/publications?view=venue", icon: Search },
  { id: "pb-5", title: "Open Access", description: "Freely available papers.", href: "/publications?open=1", icon: Globe },
  { id: "pb-6", title: "Collaborations", description: "Cross-institutional work.", href: "/publications?collab=1", icon: Users },
];

// The drawing for each group lives in community-marks.tsx, keyed by title.
const communities = [
  {
    title: "Accessibility",
    groups: ["Blind users", "Stroke patients", "Low-literacy users"],
  },
  {
    title: "At-risk Groups",
    groups: ["Garment workers", "Rohingya refugees", "Domestic workers"],
  },
  {
    title: "Digital Society",
    groups: ["Social media users", "Teenagers online", "Rural communities"],
  },
  {
    title: "Education",
    groups: ["University students", "School teachers", "STEM learners"],
  },
];

// ── Menu furniture ─────────────────────────────────────────────────────────
// The panels are printed sheets, not cards: a ruled label over each column and
// a paper promo block with crop marks, the same vocabulary the pages use.

const PanelLabel = ({
  children,
  action,
}: {
  children: React.ReactNode;
  action?: React.ReactNode;
}) => (
  <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-2.5">
    <strong className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
      <TickMark className="size-3 text-ink" />
      {children}
    </strong>
    {action}
  </div>
);

/**
 * The promo block at the head of a panel. It is paper with a printed
 * composition in it rather than a photograph: nothing here claims to be a
 * picture of DIAL's work until DIAL supplies one.
 */
const PromoCard = ({
  href,
  art,
  eyebrow,
  title,
  body,
  className,
}: {
  href: string;
  art: React.ComponentProps<typeof RisoArt>["variant"];
  eyebrow?: string;
  title: string;
  body: string;
  className?: string;
}) => (
  <a
    href={href}
    className={cn(
      "group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-border bg-muted/40 p-6",
      className,
    )}
  >
    <CropMarks className="text-ink/50" />
    <span aria-hidden className="halftone absolute inset-0 opacity-[0.07]" />
    <RisoArt
      variant={art}
      className="pointer-events-none absolute -right-10 -bottom-10 size-48 opacity-70"
    />
    <div className="relative">
      {eyebrow && (
        <span className="mb-3 block text-[0.65rem] font-medium tracking-[0.2em] text-muted-foreground uppercase">
          {eyebrow}
        </span>
      )}
      <span className="font-display relative inline-block text-xl leading-tight">
        {title}
        <SquiggleUnderline />
      </span>
      <p className="mt-2 max-w-[22rem] text-xs text-pretty text-muted-foreground">{body}</p>
    </div>
    <span className="relative mt-8 inline-flex items-center gap-1.5 text-xs font-medium">
      Open
      <ArrowRight className="arrow-ne size-4" />
    </span>
  </a>
);

// ── Menu components ────────────────────────────────────────────────────────

const ResearchMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-8 sm:grid-cols-2">
    <PromoCard
      href="/research"
      art="orbit"
      eyebrow="HCI Research from Bangladesh"
      title="Where social need and technical systems meet"
      body="Participatory design with communities that mainstream technology largely ignores."
    />

    {/* Award-winning project callouts */}
    <div>
      <PanelLabel>Award-winning Projects</PanelLabel>
      <div className="grid gap-1">
        {nav.awardedProjects.map((project) => (
          <NavigationMenuLink
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group flex flex-row items-baseline gap-3 border-b border-border/60 py-3 last:border-0"
          >
            <AsteriskMark className="size-3.5 shrink-0 translate-y-0.5 text-ink" />
            <div className="flex-1">
              <span className="relative text-sm font-medium">
                {project.title}
                <SquiggleUnderline />
              </span>
              <span className="mt-0.5 block text-xs text-muted-foreground">{project.award}</span>
            </div>
            <ArrowRight className="arrow-ne size-4 shrink-0 self-center text-muted-foreground" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>

    {/* The nine Themes, each with its own drawing and its own ink — the same
        set the Research index prints, so the menu and the page agree. */}
    <div className="col-span-full">
      <PanelLabel>Research Themes</PanelLabel>
      <div className="grid grid-cols-1 gap-x-8 md:grid-cols-2 lg:grid-cols-3">
        {nav.researchThemes.map((theme, i) => (
          <NavigationMenuLink
            key={theme.id}
            href={`/research/${theme.slug}`}
            className="group flex items-start gap-4 border-b border-border/60 py-4 text-left"
          >
            <span className="font-mono text-[0.65rem] text-muted-foreground tabular-nums">
              {String(i + 1).padStart(2, "0")}
            </span>
            <ThemeGlyph slug={theme.slug} className="size-8 shrink-0" />
            <span className="flex-1">
              <strong
                className={cn(
                  "font-display relative text-base font-normal",
                  themeInk(theme.slug),
                )}
              >
                {theme.title}
                <SquiggleUnderline />
              </strong>
              <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
                {theme.description}
              </span>
            </span>
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  </div>
);

const ProjectsMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-y-10 lg:flex lg:space-x-10">
    <PromoCard
      href="/projects"
      art="field"
      eyebrow="The project directory"
      title="Built with communities, not for them"
      body="Participatory technology interventions across Bangladesh, each one a long relationship with the people it is for."
      className="w-full shrink-0 lg:max-w-[20rem]"
    />

    {/* Project categories. The cover mark is the project's own initial, set in
        the display serif on a halftone block — the same mark the directory
        prints, and honest where a stock photograph would not be. */}
    <div className="grid w-full gap-y-10">
      {nav.projectCategories.map((category) => (
        <div key={category.title}>
          <PanelLabel>{category.title}</PanelLabel>
          <menu className="grid md:grid-cols-3 md:gap-x-6">
            {category.projects.map((project) => (
              <NavigationMenuLink
                key={project.id}
                href={project.href}
                className="group flex flex-row items-center gap-4 border-b border-border/60 py-4 text-left"
              >
                <span
                  aria-hidden
                  className="sticker font-display relative grid size-11 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] bg-muted text-xl leading-none text-foreground/70 group-hover:rotate-0"
                >
                  <span aria-hidden className="halftone absolute inset-0 opacity-25" />
                  <span className="relative">{[...project.title][0]}</span>
                </span>
                <div className="flex-1">
                  <div className="relative inline-block text-sm font-medium text-foreground/85 group-hover:text-foreground">
                    {project.title}
                    <SquiggleUnderline />
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">{project.description}</p>
                </div>
                <ArrowRight className="arrow-ne size-4 shrink-0 text-muted-foreground" />
              </NavigationMenuLink>
            ))}
          </menu>
        </div>
      ))}
    </div>
  </div>
);

const PublicationsMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-y-12 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-6">
    <PromoCard
      href="/awards"
      art="strata"
      eyebrow="Recognition"
      title={nav.headlineAward?.title ?? "Awards & recognition"}
      body={nav.headlineAward?.body ?? "What the Lab's work has been recognised for."}
      className="col-span-1"
    />

    {/* Browse modes */}
    <div className="lg:col-span-2 lg:flex lg:flex-col">
      <PanelLabel>Browse Publications</PanelLabel>
      <menu className="grid gap-y-2 lg:h-full lg:grid-cols-2 lg:gap-x-6">
        {publicationsBrowse.map((item) => (
          <NavigationMenuLink
            key={item.id}
            href={item.href}
            className="group flex flex-row items-center gap-4 border-b border-border/60 py-3.5 text-left"
          >
            <item.icon className="size-5 shrink-0 text-ink" />
            <div className="flex-1">
              <div className="relative inline-block text-sm font-medium text-foreground/85 group-hover:text-foreground">
                {item.title}
                <SquiggleUnderline />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{item.description}</p>
            </div>
            <ArrowRight className="arrow-ne size-4 shrink-0 text-muted-foreground" />
          </NavigationMenuLink>
        ))}
      </menu>
    </div>

    {/* Recognition. The stamp ring is the Awards page's own mark. */}
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      <PanelLabel>Honours</PanelLabel>
      <menu className="grid md:grid-cols-2 lg:grid-cols-1">
        {nav.publicationRecognition.map((award) => (
          <NavigationMenuLink
            key={award.id}
            href={award.href}
            className="group flex flex-row items-baseline gap-3 border-b border-border/60 py-3 text-left"
          >
            <AsteriskMark className="size-3.5 shrink-0 translate-y-0.5 text-ink" />
            <div className="flex-1">
              <div className="relative inline-block text-sm font-medium text-foreground/85 group-hover:text-foreground">
                {award.title}
                <SquiggleUnderline />
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{award.body}</p>
            </div>
          </NavigationMenuLink>
        ))}
      </menu>
    </div>
  </div>
);

const PeopleMenu = ({ nav }: MenuProps) => (
  <div>
    <div className="space-y-6 lg:flex lg:space-y-0 lg:space-x-8">
      {/* PI card. The photograph is taped on when there is one; there is no
          stock portrait standing in for a real person. */}
      <div className="w-full shrink-0 lg:max-w-[18rem]">
        <Link
          href="/people"
          className="group relative flex h-full flex-col overflow-hidden rounded-md border border-border bg-muted/40 p-5"
        >
          <CropMarks className="text-ink/50" />
          <span aria-hidden className="halftone absolute inset-0 opacity-[0.07]" />
          <div className="relative">
            {nav.pi?.photo ? (
              <span className="relative block">
                {/* Tape rides with the photograph (see OptionalImage): if the
                    photo fails, the composition replaces it untaped. */}
                <OptionalImage
                  src={nav.pi.photo}
                  alt={`Dr. ${nav.pi.name}`}
                  overlay={<span aria-hidden className="tape -top-2.5 left-6 z-10" />}
                  frameClassName="aspect-4/3 w-full -rotate-1 rounded-sm"
                  className="h-full w-full object-cover object-top"
                  fallback={<RisoArt variant="bloom" className="mx-auto size-40" />}
                />
              </span>
            ) : (
              <RisoArt variant="bloom" className="mx-auto size-40" />
            )}
          </div>
          <div className="relative mt-5">
            <span className="font-display relative inline-block text-lg leading-tight">
              {nav.pi ? `Dr. ${nav.pi.name}` : "Principal Investigator"}
              <SquiggleUnderline />
            </span>
            <p className="mt-1 text-xs text-muted-foreground">{nav.pi?.title}</p>
            <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium">
              The whole team
              <ArrowRight className="arrow-ne size-4" />
            </span>
          </div>
        </Link>
      </div>

      {/* Team categories + alumni */}
      <div className="grid w-full gap-y-12 lg:gap-y-6">
        {/* Research team */}
        <div className="grid gap-y-2 lg:gap-y-6">
          <div className="border-border text-left lg:border-b lg:pb-3">
            <strong className="text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Research Team
            </strong>
          </div>
          <menu className="grid md:grid-cols-3 md:gap-x-6 lg:gap-y-6">
            {nav.teamCategories.map((member) => {
              const CategoryIcon = TEAM_CATEGORY_ICONS[member.id] ?? Users;
              return (
              <NavigationMenuLink
                key={member.id}
                href={member.href}
                className="group flex flex-row items-center space-x-4 border-b border-border py-5 text-left sm:py-7 lg:border-0 lg:py-0"
              >
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
                  <CategoryIcon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                    {member.title}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                    {member.description}
                  </p>
                </div>
                <ArrowRight className="size-4 arrow-ne lg:hidden" />
              </NavigationMenuLink>
              );
            })}
          </menu>
        </div>

        {/* Alumni teaser */}
        <div className="grid gap-y-2 lg:gap-y-6">
          <div className="flex items-center justify-between border-border text-left lg:border-b lg:pb-3">
            <strong className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Where Our People Go
            </strong>
            <NavigationMenuLink
              href="/people"
              className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground"
            >
              {nav.alumniCount} alumni <ArrowRight className="size-3" />
            </NavigationMenuLink>
          </div>
          <menu className="grid md:grid-cols-2 md:gap-x-6 lg:gap-y-3">
            {nav.alumniTeaser.map((alum) => (
              <NavigationMenuLink
                key={alum.name}
                href="/people"
                className="group flex flex-col border-b border-border py-4 text-left lg:border-0 lg:py-0"
              >
                <span className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                  {alum.name}
                </span>
                <span className="mt-0.5 text-xs text-muted-foreground">{alum.placement}</span>
              </NavigationMenuLink>
            ))}
          </menu>
        </div>
      </div>
    </div>

    {/* Communities we design with. Each group carries a drawing of what is in
        its hands or around it, never a drawing of the people themselves. */}
    <div className="mt-10">
      <PanelLabel>Communities We Design With</PanelLabel>
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
        {communities.map((community) => (
          <div key={community.title}>
            <div className="flex items-center gap-2 text-left text-[0.65rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
              <RegistrationMark
                className={cn("size-3", COMMUNITY_INK[community.title] ?? "text-ink")}
              />
              {community.title}
            </div>
            <menu className="mt-4 grid gap-y-3.5">
              {community.groups.map((group) => (
                <div
                  key={group}
                  className="flex flex-row items-center gap-3 text-left text-foreground/85"
                >
                  <CommunityMark
                    label={group}
                    className={cn("size-6 shrink-0", COMMUNITY_INK[community.title] ?? "text-ink")}
                  />
                  <div className="flex-1 text-sm">{group}</div>
                </div>
              ))}
            </menu>
          </div>
        ))}
      </div>
    </div>
  </div>
);

const LabMenu = () => (
  <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
    <PromoCard
      href="/news"
      art="signal"
      eyebrow="News & Lab Activity"
      title="What the Lab has been doing"
      body="Conference trips, invited talks, community events and fieldwork, as they happen."
      className="md:col-span-2"
    />

    <PromoCard
      href="/about"
      art="bloom"
      eyebrow="About"
      title="The Design Inclusion and Access Lab"
      body="An HCI lab at North South University, Dhaka."
      className="md:col-span-1"
    />

    {/* Join Us */}
    <div className="grid gap-4 md:col-span-1">
      <NavigationMenuLink
        href="/join-us"
        className="group relative flex w-full flex-row items-start gap-4 overflow-hidden rounded-md border border-border p-6"
      >
        <span aria-hidden className="halftone absolute inset-0 opacity-[0.07]" />
        <UserPlus className="relative size-7 shrink-0 text-ink" />
        <div className="relative">
          <div className="font-display relative inline-block text-base leading-tight">
            Join the Lab
            <SquiggleUnderline />
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Open positions for graduate and undergraduate researchers.
          </p>
          <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
            How to apply
            <ArrowRight className="arrow-ne size-4" />
          </span>
        </div>
      </NavigationMenuLink>
    </div>
  </div>
);

// ── Nav config ─────────────────────────────────────────────────────────────

const navigationMenuItems = [
  { key: "research", label: "Research", component: ResearchMenu },
  { key: "projects", label: "Projects", component: ProjectsMenu },
  { key: "publications", label: "Publications", component: PublicationsMenu },
  { key: "people", label: "People", component: PeopleMenu },
  // LabMenu is static; it ignores the nav prop the other menus take.
  { key: "lab", label: "Lab", component: LabMenu as (props: MenuProps) => ReactElement },
] as const;

type NavigationMenuKey = (typeof navigationMenuItems)[number]["key"];

// ── Theme ──────────────────────────────────────────────────────────────────

function subscribeToThemeClass(onChange: () => void) {
  const observer = new MutationObserver(onChange);
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });
  return () => observer.disconnect();
}

const readIsDark = () => document.documentElement.classList.contains("dark");

// ── Component ──────────────────────────────────────────────────────────────

interface Navbar4Props {
  nav: NavData;
  className?: string;
}

const Navbar4 = ({ nav, className }: Navbar4Props) => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<NavigationMenuKey | null>(null);
  // The <head> script in layout.tsx applies the stored theme before paint;
  // this just mirrors the <html> class.
  const isDark = useSyncExternalStore(subscribeToThemeClass, readIsDark, () => false);
  const reduceMotion = useReducedMotion();

  const toggleDark = () => {
    const next = !isDark;
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dial-theme", next ? "dark" : "light");
  };

  return (
    <section
      data-site-nav
      className={cn("inset-x-0 top-0 z-20 bg-background text-foreground", className)}
    >
      <div className="container">
        <NavigationMenu className="min-w-full [&>div:last-child]:left-auto">
          <div className="flex w-full justify-between gap-2 py-4">
            {/* Logo. The wordmark used to carry "NSU HCI" as part of the
                drawing, which made the DIAL letters themselves small; the
                mark now stands alone and the university is named quietly
                beside it. */}
            <Link href="/" className="flex items-center gap-3">
              <img
                src="/dial-logo.svg"
                className="w-28 max-w-none dark:invert sm:w-32"
                alt="DIAL"
              />
              {/* The old lockup set "NSU HCI" in wide-tracked capitals under
                  the mark, which shrank the DIAL letters. It now sits beside
                  the mark and spells the university out — named, but quiet. */}
              <span className="hidden border-l border-border pl-3 text-[0.65rem] leading-[1.35] tracking-[0.16em] text-muted-foreground uppercase sm:block">
                North South
                <br />
                University HCI
              </span>
            </Link>

            {/* Desktop nav */}
            <div className="flex items-center gap-2 xl:gap-8">
              <NavigationMenuList className="hidden gap-0 lg:flex">
                {navigationMenuItems.map((item) => (
                  <NavigationMenuItem key={item.key}>
                    <NavigationMenuTrigger className="text-xs xl:text-sm">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent className="min-w-[calc(100vw-4rem)] p-12 2xl:min-w-[calc(1400px-4rem)]">
                      <item.component nav={nav} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </div>

            {/* CTA + dark toggle + mobile toggle */}
            <div className="flex items-center gap-2">
              <a href="/contact" className={cn(buttonVariants(), "hidden rounded-full px-4 transition-transform duration-150 ease-snappy active:scale-[0.97] md:inline-flex")}>
                Contact
              </a>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={toggleDark}
              >
                {isDark ? <Sun className="size-4" /> : <Moon className="size-4" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
                className="lg:hidden"
                onClick={() => {
                  if (open) {
                    setOpen(false);
                    setSubmenu(null);
                  } else {
                    setOpen(true);
                  }
                }}
              >
                {!open && <Menu className="size-4" />}
                {open && <X className="size-4" />}
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {/* The menu unrolls down from the nav bar (clip-path, iOS sheet
              curve) and rolls back up faster on close; reduced motion fades. */}
          <AnimatePresence>
          {open && (
            <motion.div
              key="mobile-menu"
              initial={reduceMotion ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
              animate={reduceMotion ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
              exit={
                reduceMotion
                  ? { opacity: 0, transition: { duration: 0.15 } }
                  : { clipPath: "inset(0 0 100% 0)", transition: { duration: 0.18, ease: [0.23, 1, 0.32, 1] } }
              }
              transition={{ duration: reduceMotion ? 0.15 : 0.3, ease: [0.32, 0.72, 0, 1] }}
              className="fixed inset-0 top-[77px] container flex h-[calc(100vh-77px)] w-full flex-col overflow-auto border-t border-border bg-background lg:hidden"
            >
              {submenu && (
                <div className="mt-3">
                  <Button
                    variant="link"
                    onClick={() => setSubmenu(null)}
                    className="relative -left-4"
                  >
                    <ArrowLeft className="size-4 text-xs" />
                    Go back
                  </Button>
                </div>
              )}
              {submenu === null && (
                <div>
                  {navigationMenuItems.map((item, i) => (
                    <button
                      key={item.key}
                      type="button"
                      className="enter flex w-full items-center border-b border-border py-6 text-left [animation-duration:300ms]"
                      style={{ animationDelay: `${80 + i * 40}ms` }}
                      onClick={() => setSubmenu(item.key)}
                    >
                      <span className="flex-1 text-sm font-medium">{item.label}</span>
                      <span className="shrink-0">
                        <ArrowRight className="size-4" />
                      </span>
                    </button>
                  ))}
                </div>
              )}
              {navigationMenuItems.map(
                (item) =>
                  submenu === item.key && (
                    <div key={item.key}>
                      <h2 className="pt-4 pb-6 text-lg font-medium">{item.label}</h2>
                      <item.component nav={nav} />
                    </div>
                  ),
              )}
              <div className="mx-[2rem] mt-auto flex flex-col items-center gap-8 py-24">
                <a href="/contact" className={cn(buttonVariants(), "rounded-full px-5")}>
                  Contact
                </a>
              </div>
            </motion.div>
          )}
          </AnimatePresence>
        </NavigationMenu>
      </div>
    </section>
  );
};

export { Navbar4 };
