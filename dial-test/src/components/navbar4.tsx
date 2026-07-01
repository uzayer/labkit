"use client";

import {
  Accessibility,
  TriangleAlert,
  ArrowLeft,
  ArrowRight,
  BookOpen,
  Brain,
  Calendar,
  Cpu,
  Globe,
  GraduationCap,
  Heart,
  Lightbulb,
  Menu,
  Moon,
  Search,
  ShieldCheck,
  Sun,
  Tag,
  Trophy,
  UserPlus,
  UserRound,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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

// ── Research data ──────────────────────────────────────────────────────────

const researchThemes = [
  {
    id: "rt-1",
    title: "Accessibility & Inclusion",
    slug: "accessibility-inclusion",
    description: "Technology for blind, low-literacy, and stroke-affected users.",
    icon: Accessibility,
  },
  {
    id: "rt-2",
    title: "Gender & Feminist HCI",
    slug: "gender-feminist-hci",
    description: "Centering women's safety, agency, and digital voice.",
    icon: Users,
  },
  {
    id: "rt-3",
    title: "Mental Health & Wellbeing",
    slug: "mental-health-wellbeing",
    description: "Digital tools for underserved mental health contexts.",
    icon: Heart,
  },
  {
    id: "rt-4",
    title: "Explainable AI & ML",
    slug: "explainable-ai-ml",
    description: "Making algorithmic decisions legible to non-experts.",
    icon: Brain,
  },
  {
    id: "rt-5",
    title: "ICT for Development",
    slug: "ictd",
    description: "Technology in low-resource and rural community contexts.",
    icon: Globe,
  },
  {
    id: "rt-6",
    title: "Safety & Security",
    slug: "safety-security",
    description: "Online safety tools for at-risk groups in the Global South.",
    icon: ShieldCheck,
  },
  {
    id: "rt-7",
    title: "IoT & Low-cost Hardware",
    slug: "iot-low-cost-hardware",
    description: "Affordable device design for resource-constrained settings.",
    icon: Cpu,
  },
  {
    id: "rt-8",
    title: "Infodemic & Misinformation",
    slug: "infodemic-misinformation",
    description: "Fighting health misinformation in low-literacy communities.",
    icon: TriangleAlert,
  },
  {
    id: "rt-9",
    title: "Computing Education & Community",
    slug: "computing-education-community",
    description: "Building CS capacity and community at the margins.",
    icon: GraduationCap,
  },
];

const awardedProjects = [
  { id: "ap-1", title: "Jyoti", award: "Best Paper · CHI 2024", slug: "jyoti" },
  { id: "ap-2", title: "Protibadi", award: "Best of CHI · 2019", slug: "protibadi" },
  { id: "ap-3", title: "Shikkha", award: "Best Journal Paper · COMPASS 2023", slug: "shikkha" },
];

// ── Projects data ──────────────────────────────────────────────────────────

const projectCategories = [
  {
    title: "People & Society",
    projects: [
      {
        id: "p-1",
        title: "Jyoti",
        description: "Best Paper · CHI 2024",
        href: "/projects/jyoti",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
      },
      {
        id: "p-2",
        title: "Protibadi",
        description: "Best of CHI · 2019",
        href: "/projects/protibadi",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-2.svg",
      },
      {
        id: "p-3",
        title: "Mon",
        description: "Mental Health & Wellbeing",
        href: "/projects/mon",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-3.svg",
      },
    ],
  },
  {
    title: "Technology & Development",
    projects: [
      {
        id: "p-4",
        title: "Satya",
        description: "Infodemic & Misinformation",
        href: "/projects/satya",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-4.svg",
      },
      {
        id: "p-5",
        title: "Rashmi",
        description: "IoT & Low-cost Hardware",
        href: "/projects/rashmi",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-5.svg",
      },
      {
        id: "p-6",
        title: "Bodhgamya",
        description: "Explainable AI & ML",
        href: "/projects/bodhgamya",
        image: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/block-1.svg",
      },
    ],
  },
];

// ── Publications data ──────────────────────────────────────────────────────

const publicationsBrowse = [
  { id: "pb-1", title: "All Publications", description: "Complete bibliography.", href: "/publications", icon: BookOpen },
  { id: "pb-2", title: "By Year", description: "Chronological view of our output.", href: "/publications", icon: Calendar },
  { id: "pb-3", title: "By Research Theme", description: "Publications grouped by topic.", href: "/publications?view=theme", icon: Tag },
  { id: "pb-4", title: "By Venue", description: "Conference and journal index.", href: "/publications?view=venue", icon: Search },
  { id: "pb-5", title: "Open Access", description: "Freely available papers.", href: "/publications?open=1", icon: Globe },
  { id: "pb-6", title: "Collaborations", description: "Cross-institutional work.", href: "/publications?collab=1", icon: Users },
];

const publicationRecognition = [
  { id: "pr-1", title: "10-Year Impact Award", body: "USENIX SOUPS · 2024", href: "/awards" },
  { id: "pr-2", title: "Best Journal Paper Award", body: "ACM COMPASS · 2023", href: "/awards" },
  { id: "pr-3", title: "Google Research Award", body: "Google · 2022", href: "/awards" },
  { id: "pr-4", title: "Best Paper Award", body: "ACM CHI · 2019", href: "/awards" },
  { id: "pr-5", title: "Distinguished Privacy Award", body: "IAPP / SOUPS · 2018", href: "/awards" },
];

// ── People data ────────────────────────────────────────────────────────────

const teamCategories = [
  { id: "pm-1", title: "Graduate Research Assistants", description: "10 active researchers at NSU", href: "/people", icon: GraduationCap },
  { id: "pm-2", title: "Undergraduate Assistants", description: "9 student researchers at NSU", href: "/people", icon: UserRound },
  { id: "pm-3", title: "Emerging Researchers", description: "6 early-career lab members", href: "/people", icon: Lightbulb },
  { id: "pm-4", title: "Meet Everyone", description: "Full team directory", href: "/people", icon: Users },
];

const alumniTeaser = [
  { name: "Mahbuba Tasmin", placement: "PhD · UMass Amherst" },
  { name: "Sarah Binte Alam Shoilee", placement: "PhD · Vrije Universiteit Amsterdam" },
  { name: "Ulfat Tahsin", placement: "PhD · The Ohio State University" },
  { name: "Shahreen Shahjahan Psyche", placement: "Engineer · Amazon" },
];

const communities = [
  {
    title: "Accessibility",
    groups: [
      { title: "Blind users", icon: "👁️" },
      { title: "Stroke patients", icon: "❤️" },
      { title: "Low-literacy users", icon: "📖" },
    ],
  },
  {
    title: "At-risk Groups",
    groups: [
      { title: "Garment workers", icon: "🧵" },
      { title: "Rohingya refugees", icon: "🏕️" },
      { title: "Domestic workers", icon: "🏠" },
    ],
  },
  {
    title: "Digital Society",
    groups: [
      { title: "Social media users", icon: "📱" },
      { title: "Online journalists", icon: "📰" },
      { title: "Rural communities", icon: "🌾" },
    ],
  },
  {
    title: "Education",
    groups: [
      { title: "University students", icon: "🎓" },
      { title: "School teachers", icon: "✏️" },
      { title: "STEM learners", icon: "🔬" },
    ],
  },
];

// ── Menu components ────────────────────────────────────────────────────────

const ResearchMenu = () => (
  <div className="grid gap-8 sm:grid-cols-2">
    {/* Featured promo */}
    <a
      href="/research"
      className="group relative flex h-full flex-row overflow-hidden rounded-lg bg-primary px-0 pt-8 text-primary-foreground lg:rounded-xl lg:px-6"
    >
      <div className="relative flex w-full flex-col space-y-12 text-left md:space-y-8 lg:w-full lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-6 xl:space-x-8">
        <div className="relative flex flex-col px-6 lg:mb-6 lg:px-0">
          <span className="mb-6 text-xs font-medium tracking-wider uppercase md:mb-8">
            HCI Research from Bangladesh
          </span>
          <div className="mt-auto flex items-center space-x-1 text-xs">
            Explore our research
            <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
          </div>
          <p className="mt-2 text-xs text-primary-foreground/85">
            Participatory design with communities that mainstream technology largely ignores.
          </p>
        </div>
        <div className="relative aspect-2/1 overflow-clip rounded-t pl-6 lg:max-w-64 lg:pl-0 xl:max-w-96">
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
            alt="DIAL fieldwork"
            className="aspect-2/1 h-full w-full translate-y-px object-cover object-center"
          />
        </div>
      </div>
    </a>

    {/* Award-winning project callouts */}
    <div className="order-last mt-3 sm:order-none sm:mt-0 sm:py-2 md:p-6">
      <div className="mb-4 text-left lg:mb-6">
        <strong className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Award-winning Projects
        </strong>
      </div>
      <div className="grid gap-4">
        {awardedProjects.map((project) => (
          <NavigationMenuLink
            key={project.id}
            href={`/projects/${project.slug}`}
            className="group flex flex-row items-center gap-4"
          >
            <Trophy className="size-4 shrink-0 text-muted-foreground" />
            <div className="flex-1">
              <span className="text-sm font-medium">{project.title}</span>
              <span className="ml-2 text-xs text-muted-foreground">{project.award}</span>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>

    {/* 9 theme boxes */}
    <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
      {researchThemes.map((theme) => (
        <div key={theme.id} className="rounded-md border border-border p-5">
          <div className="border-b border-border pb-4">
            <a href={`/research/${theme.slug}`} className="group flex items-center text-left">
              <theme.icon className="size-4 shrink-0 mr-2" />
              <strong className="text-sm font-medium">{theme.title}</strong>
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </a>
            <p className="mt-1 text-xs text-muted-foreground">{theme.description}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
);

const ProjectsMenu = () => (
  <div className="grid gap-y-12 lg:flex lg:space-x-8">
    {/* Sidebar promo card */}
    <div className="w-full shrink-0 lg:max-w-[18rem]">
      <Link
        href="/projects"
        className="group relative flex h-full flex-row overflow-hidden rounded-lg px-0 text-primary-foreground lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col text-left">
          <div className="relative flex aspect-2/1 max-h-[11rem] w-full flex-1 justify-center">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg"
              alt="DIAL projects"
              className="h-full w-full object-cover object-center"
            />
          </div>
          <div className="relative z-20 flex flex-col rounded-b-xl bg-primary p-6">
            <div className="flex items-center space-x-1 text-xs">
              20 Projects
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs text-primary-foreground/70">
              Participatory technology interventions built with communities across Bangladesh.
            </p>
          </div>
        </div>
      </Link>
    </div>

    {/* Project categories */}
    <div className="grid w-full gap-y-12 lg:gap-y-6">
      {projectCategories.map((category) => (
        <div key={category.title} className="grid gap-y-2 lg:gap-y-6">
          <div className="border-border text-left lg:border-b lg:pb-3">
            <strong className="text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
              {category.title}
            </strong>
          </div>
          <menu className="grid md:grid-cols-3 md:gap-x-5 lg:gap-y-7">
            {category.projects.map((project) => (
              <NavigationMenuLink
                key={project.id}
                href={project.href}
                className="group flex flex-row items-center space-x-6 border-b border-border py-5 text-left sm:py-7 lg:space-x-4 lg:border-0 lg:py-2"
              >
                <div className="relative flex aspect-square w-6 shrink-0 items-center justify-center overflow-clip rounded md:size-9 md:p-2">
                  <img
                    src={project.image}
                    alt={project.title}
                    className="dark:invert"
                  />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                    {project.title}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                    {project.description}
                  </p>
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
              </NavigationMenuLink>
            ))}
          </menu>
        </div>
      ))}
    </div>
  </div>
);

const PublicationsMenu = () => (
  <div className="grid gap-y-12 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4 lg:gap-6">
    {/* Promo card */}
    <div className="col-span-1">
      <a
        href="/awards"
        className="group relative flex h-full flex-row overflow-hidden rounded-lg bg-primary p-0 text-primary-foreground lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pt-6 pb-[14rem] md:pt-40 md:pb-6">
            <div className="mt-auto flex items-center space-x-1 text-xs">
              10-Year Impact Award
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs">
              USENIX SOUPS 2024 — one of 11 venue honours since 2014.
            </p>
          </div>
          <div className="absolute inset-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-4.svg"
              alt="publications"
              className="h-full w-full object-cover object-center invert"
            />
          </div>
          <div className="absolute inset-x-0 top-0 z-10 h-[60%] bg-gradient-to-b from-primary to-transparent md:top-auto md:bottom-[-10%] md:h-[50%] md:bg-gradient-to-t md:from-primary md:to-transparent" />
        </div>
      </a>
    </div>

    {/* Browse modes */}
    <div className="lg:col-span-2 lg:flex lg:flex-col">
      <div className="mb-4 border-border pb-3 text-left md:mb-6 lg:border-b">
        <strong className="text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Browse Publications
        </strong>
      </div>
      <menu className="grid gap-y-4 lg:h-full lg:grid-cols-2 lg:gap-6">
        {publicationsBrowse.map((item) => (
          <NavigationMenuLink
            key={item.id}
            href={item.href}
            className="group flex flex-row items-center space-x-4 rounded-md border-border bg-accent px-6 py-5 text-left md:space-x-5 lg:border lg:bg-background lg:p-5"
          >
            <item.icon className="size-6 sm:size-7" />
            <div className="ml-4 flex-1">
              <div className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                {item.title}
              </div>
              <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                {item.description}
              </p>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </menu>
    </div>

    {/* Recognition */}
    <div className="col-span-1 md:col-span-2 lg:col-span-1">
      <div className="mb-4 border-border pb-3 text-left md:mb-7 lg:border-b">
        <strong className="text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Recognition
        </strong>
      </div>
      <menu className="mb-7 grid md:grid-cols-2 md:gap-x-6 lg:grid-cols-1 lg:gap-x-0">
        {publicationRecognition.map((award) => (
          <NavigationMenuLink
            key={award.id}
            href={award.href}
            className="group flex flex-row items-center space-x-6 border-b border-border py-5 text-left sm:py-8 lg:space-x-4 lg:border-0 lg:py-3"
          >
            <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
              <Trophy className="size-5" />
            </div>
            <div className="flex-1">
              <div className="text-xs font-medium text-foreground/85 group-hover:text-foreground md:text-sm">
                {award.title}
              </div>
              <p className="mt-0.5 text-xs text-muted-foreground">{award.body}</p>
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </menu>
    </div>
  </div>
);

const PeopleMenu = () => (
  <div>
    <div className="space-y-6 lg:flex lg:space-y-0 lg:space-x-8">
      {/* PI card */}
      <div className="w-full shrink-0 lg:max-w-[18rem]">
        <Link
          href="/people"
          className="group relative flex h-full flex-row overflow-hidden rounded-lg p-0 text-primary-foreground lg:rounded-xl"
        >
          <div className="relative z-10 flex w-full flex-col text-left">
            <div className="relative flex aspect-4/3 max-h-[18rem] w-full flex-1 justify-center">
              <img
                src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/photos/annie-spratt-MChSQHxGZrQ-unsplash.jpg"
                alt="Dr. Nova Ahmed"
                className="h-full w-full object-cover object-center"
              />
            </div>
            <div className="relative z-20 flex flex-col rounded-b-xl bg-primary p-6">
              <div className="flex items-center space-x-1 text-xs">
                Dr. Nova Ahmed · Principal Investigator
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
              <p className="mt-2 text-xs text-primary-foreground/85">
                Professor, ECE — North South University, Dhaka.
              </p>
            </div>
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
            {teamCategories.map((member) => (
              <NavigationMenuLink
                key={member.id}
                href={member.href}
                className="group flex flex-row items-center space-x-4 border-b border-border py-5 text-left sm:py-7 lg:border-0 lg:py-0"
              >
                <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
                  <member.icon className="size-5" />
                </div>
                <div className="flex-1">
                  <div className="text-sm font-medium text-foreground/85 group-hover:text-foreground">
                    {member.title}
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground group-hover:text-foreground">
                    {member.description}
                  </p>
                </div>
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
              </NavigationMenuLink>
            ))}
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
              21 alumni <ArrowRight className="size-3" />
            </NavigationMenuLink>
          </div>
          <menu className="grid md:grid-cols-2 md:gap-x-6 lg:gap-y-3">
            {alumniTeaser.map((alum) => (
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

    {/* Communities we design with */}
    <div className="mt-8">
      <div className="mb-6 border-border pb-1 text-left lg:border-b">
        <strong className="text-left text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Communities We Design With
        </strong>
      </div>
      <div className="grid gap-6 md:grid-cols-3 lg:grid-cols-4">
        {communities.map((community) => (
          <div
            key={community.title}
            className="space-y-6 rounded-md border border-border p-6 lg:border-0 lg:p-0"
          >
            <div className="text-left text-xs text-muted-foreground">{community.title}</div>
            <menu className="grid gap-y-3 border-t border-border pt-6 lg:border-0 lg:pt-0">
              {community.groups.map((group) => (
                <div
                  key={group.title}
                  className="flex flex-row items-center space-x-4 text-left text-foreground/85"
                >
                  <div className="flex size-4 items-center justify-center">{group.icon}</div>
                  <div className="flex-1 text-sm font-medium">{group.title}</div>
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
    {/* News — big card */}
    <div className="md:col-span-2">
      <a
        href="/news"
        className="group relative flex h-full flex-row overflow-hidden rounded-lg bg-primary p-0 text-primary-foreground lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pt-6 pb-[14rem] md:pt-40 md:pb-6">
            <div className="mt-auto flex items-center space-x-1 text-xs font-medium">
              News & Lab Activity
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs">
              Conference trips, invited talks, community events, and fieldwork — all in photos.
            </p>
          </div>
          <div className="absolute inset-0 top-[32%] bg-accent invert md:top-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-1.svg"
              alt="Lab news"
              className="object-fit h-full w-full object-top-right opacity-100 md:h-2/3 md:object-top"
            />
          </div>
        </div>
      </a>
    </div>

    {/* About — medium card */}
    <div className="md:col-span-1">
      <a
        href="/about"
        className="group relative flex h-full flex-row overflow-hidden rounded-lg bg-accent p-0 text-accent-foreground lg:rounded-xl"
      >
        <div className="relative z-10 flex w-full flex-col-reverse text-left">
          <div className="relative z-20 flex flex-col px-6 pt-6 pb-[14rem] md:pt-40 md:pb-6">
            <div className="mt-auto flex items-center space-x-1 text-xs font-medium">
              About DIAL
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              The Diverse &amp; Inclusive Accessible Lab at North South University.
            </p>
          </div>
          <div className="absolute inset-0 top-[32%] md:top-0">
            <img
              src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-2.svg"
              alt="About DIAL"
              className="object-fit h-full w-full object-top-right md:h-2/3 md:object-top"
            />
          </div>
        </div>
      </a>
    </div>

    {/* Join Us — bordered card */}
    <div className="grid gap-4 md:col-span-1">
      <NavigationMenuLink
        href="/join-us"
        className="group flex w-full flex-row items-center rounded-lg border border-border lg:rounded-xl"
      >
        <div className="flex items-start p-6 text-left">
          <UserPlus className="size-8" />
          <div className="ml-4">
            <div className="mt-auto mb-1 text-sm font-bold text-foreground/85 group-hover:text-foreground">
              Join the Lab
            </div>
            <p className="text-xs text-muted-foreground group-hover:text-foreground">
              Open positions for graduate and undergraduate researchers.
            </p>
          </div>
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
  { key: "lab", label: "Lab", component: LabMenu },
] as const;

type NavigationMenuKey = (typeof navigationMenuItems)[number]["key"];

// ── Component ──────────────────────────────────────────────────────────────

interface Navbar4Props {
  className?: string;
}

const Navbar4 = ({ className }: Navbar4Props) => {
  const [open, setOpen] = useState(false);
  const [submenu, setSubmenu] = useState<NavigationMenuKey | null>(null);
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem("dial-theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = stored === "dark" || (!stored && prefersDark);
    setIsDark(initialDark);
    document.documentElement.classList.toggle("dark", initialDark);
  }, []);

  const toggleDark = () => {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("dial-theme", next ? "dark" : "light");
  };

  return (
    <section className={cn("inset-x-0 top-0 z-20 bg-background", className)}>
      <div className="container">
        <NavigationMenu className="min-w-full [&>div:last-child]:left-auto">
          <div className="flex w-full justify-between gap-2 py-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2">
              <img
                src="/dial-logo.svg"
                className="w-28 max-w-none dark:invert sm:w-32 lg:w-28"
                alt="DIAL"
              />
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
                      <item.component />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </div>

            {/* CTA + dark toggle + mobile toggle */}
            <div className="flex items-center gap-2">
              <a href="/contact" className={cn(buttonVariants(), "hidden md:inline-flex")}>
                Contact Us
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
          {open && (
            <div className="fixed inset-0 top-[77px] container flex h-[calc(100vh-77px)] w-full flex-col overflow-auto border-t border-border bg-background lg:hidden">
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
                  {navigationMenuItems.map((item) => (
                    <button
                      key={item.key}
                      type="button"
                      className="flex w-full items-center border-b border-border py-6 text-left"
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
                      <item.component />
                    </div>
                  ),
              )}
              <div className="mx-[2rem] mt-auto flex flex-col items-center gap-8 py-24">
                <a href="/contact" className={cn(buttonVariants())}>
                  Contact Us
                </a>
              </div>
            </div>
          )}
        </NavigationMenu>
      </div>
    </section>
  );
};

export { Navbar4 };
