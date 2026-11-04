'use client'

import { ArrowLeft, ArrowRight, Menu, Moon, Sun, UserPlus, X } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useRef, useState, useSyncExternalStore, type ReactElement, type ReactNode } from 'react'

import {
  CropMarks,
  FactMark,
  RegistrationMark,
  RosetteMark,
  SquiggleUnderline,
  Tape,
  TickMark,
} from '@/components/dial/marks'
import { DialLockup, DialMark } from '@/components/dial/dial-logo'
import { OptionalImage } from '@/components/dial/optional-image'
import { PersonChip } from '@/components/dial/person-chip'
import { RisoArt } from '@/components/dial/riso'
import { ThemeGlyph, themeInk } from '@/components/dial/theme-marks'
import { Button, buttonVariants } from '@/components/dial/ui/button'
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/dial/ui/navigation-menu'
import { cn } from '@/lib/utils'

// ── Navigation data ────────────────────────────────────────────────────────
// Records arrive as a server-computed `nav` prop (see getNavData in
// src/data/views.ts), so this client component never imports the data module.
//
// One rule decides what may appear in a panel: **every row is a destination
// you cannot already see from the page the panel's tile points at.** That is
// what removed the old "Browse Publications" column (six links to
// /publications with a query string, duplicating the list's own filter bar)
// and the old team-category rows (four links to /people). A menu that repeats
// a page's controls looks full and teaches nothing.

export interface NavData {
  researchThemes: { id: string; title: string; slug: string; description: string }[]
  projectCategories: {
    title: string
    projects: { id: string; title: string; description: string; href: string }[]
  }[]
  projectCount: number
  /** Real papers, newest first — what only the menu can show. */
  recentPublications: {
    id: string
    title: string
    venue: string
    year: number
    href: string
    /** The paper's award, when it won one: the menu stamps it. */
    award?: string | null
  }[]
  publicationCount: number
  /** e.g. "2014–2025". */
  publicationYears: string
  publicationRecognition: { id: string; title: string; body: string; href: string }[]
  pi: { name: string; title: string; photo: string | null; href: string } | null
  /**
   * Current lab members, by roster section — the first few of each, with a
   * count of the rest. Each person links to their page; `role` is set only for
   * an affiliation outside the Lab's own institution.
   */
  rosterGroups: {
    title: string
    people: { name: string; slug: string; photo: string | null; role: string | null }[]
    more: number
  }[]
  teamCount: number
  alumniTeaser: { name: string; placement: string }[]
  alumniCount: number
}

interface MenuProps {
  nav: NavData
}

// ── Menu furniture ─────────────────────────────────────────────────────────
// The panels are printed sheets, not cards: a ruled label over each column and
// a paper promo block with crop marks, the same vocabulary the pages use.
//
// Hover follows the site's rule (globals.css, "Hover vocabulary"): a row's
// words take the squiggle and its mark lifts — never the paper behind it too.
// A row with a mark therefore has no arrow on desktop; the mark is its answer.

const PanelLabel = ({ children, action }: { children: ReactNode; action?: ReactNode }) => (
  <div className="mb-5 flex items-center justify-between gap-4 border-b border-border pb-2.5">
    <strong className="flex items-center gap-2 text-xs font-medium tracking-[0.18em] text-muted-foreground uppercase">
      <TickMark className="text-ink size-3" />
      {children}
    </strong>
    {action}
  </div>
)

/** The "N more →" link that closes a panel label. */
const PanelMore = ({ href, children }: { href: string; children: ReactNode }) => (
  <NavigationMenuLink
    href={href}
    className="group flex shrink-0 items-center gap-1.5 p-0 text-xs text-muted-foreground hover:text-foreground"
  >
    <span className="relative">
      {children}
      <SquiggleUnderline />
    </span>
    <ArrowRight className="arrow-ne size-3.5" />
  </NavigationMenuLink>
)

/**
 * The lead tile of a panel: the section's own page, and the thing most people
 * who opened the panel came to click. It is paper with a printed composition
 * in it rather than a photograph — nothing here claims to be a picture of
 * DIAL's work until DIAL supplies one.
 *
 * The big line is the name of the page you land on, and the tile ends in the
 * panel's one filled button, so it reads as the way in rather than as a
 * decorative card beside the links. The text column stops short of the
 * composition: at a phone's width the lede used to run under the drawing.
 */
const PromoCard = ({
  href,
  art,
  title,
  kicker,
  body,
  cta,
  className,
}: {
  href: string
  art: React.ComponentProps<typeof RisoArt>['variant']
  /** The destination's name, set in the display serif. */
  title: string
  /** A tracked-caps line under it: a count, a place. */
  kicker?: string
  body: string
  cta: string
  className?: string
}) => (
  <Link
    href={href}
    className={cn(
      'group relative flex h-full flex-col justify-between overflow-hidden rounded-md border border-border bg-muted/40 p-6',
      className,
    )}
  >
    <CropMarks className="text-ink/50" />
    <span aria-hidden className="halftone absolute inset-0 opacity-[0.07]" />
    <RisoArt
      variant={art}
      className="pointer-events-none absolute -right-12 -bottom-12 size-40 opacity-70 sm:size-48"
    />
    <div className="relative pr-24 sm:pr-28">
      <span className="font-display relative inline-block text-2xl leading-tight">
        {title}
        <SquiggleUnderline />
      </span>
      {kicker && (
        <span className="mt-2 block text-[0.7rem] font-medium tracking-[0.16em] text-muted-foreground uppercase">
          {kicker}
        </span>
      )}
      <p className="mt-3 max-w-[22rem] text-xs text-pretty text-muted-foreground">{body}</p>
    </div>
    <span className="ease-snappy relative mt-8 inline-flex w-fit items-center gap-1.5 rounded-full bg-foreground px-4 py-2 text-xs font-medium text-background transition-transform duration-150 group-active:scale-[0.97]">
      {cta}
      <ArrowRight className="arrow-ne size-3.5" />
    </span>
  </Link>
)

/**
 * A small destination tile: a drawn mark, a display-serif name, a line, and a
 * text call to action. The mark sits in a fixed square, so tiles whose marks
 * are different shapes (a target, a person, the DIAL letterform) still start
 * their text on one left edge.
 */
const DestinationTile = ({
  href,
  mark,
  title,
  body,
  cta,
  className,
}: {
  href: string
  mark: ReactNode
  title: string
  body: string
  cta: string
  className?: string
}) => (
  <NavigationMenuLink
    href={href}
    className={cn(
      'group relative flex w-full flex-row items-start gap-4 overflow-hidden rounded-md border border-border p-5 md:p-6',
      className,
    )}
  >
    <span aria-hidden className="halftone absolute inset-0 opacity-[0.07]" />
    <span className="mark-lift text-ink relative grid size-7 shrink-0 place-items-center">
      {mark}
    </span>
    <div className="relative min-w-0">
      <div className="font-display relative inline-block text-base leading-tight">
        {title}
        <SquiggleUnderline />
      </div>
      <p className="mt-1 text-xs text-pretty text-muted-foreground">{body}</p>
      <span className="mt-3 inline-flex items-center gap-1.5 text-xs font-medium">
        {cta}
        <ArrowRight className="arrow-ne size-4" />
      </span>
    </div>
  </NavigationMenuLink>
)

/**
 * A row in a panel: mark, title + note. The panels' one list shape. With a
 * mark, the mark lifts on hover and there is no arrow on desktop; on a phone,
 * which has no hover to discover a link by, every row ends in an arrow.
 */
const PanelRow = ({
  href,
  mark,
  title,
  note,
  trailing,
}: {
  href: string
  mark?: ReactNode
  title: string
  note?: ReactNode
  /** Something printed after the title — an award rosette. */
  trailing?: ReactNode
}) => (
  <NavigationMenuLink
    href={href}
    className="group flex flex-row items-baseline gap-3 border-b border-border/60 px-0 py-3 text-left last:border-0"
  >
    {mark && <span className="mark-lift shrink-0 translate-y-0.5">{mark}</span>}
    <span className="min-w-0 flex-1">
      <span className="relative inline-block text-sm font-medium text-foreground/85 group-hover:text-foreground">
        {title}
        <SquiggleUnderline />
      </span>
      {trailing}
      {note && (
        <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">{note}</span>
      )}
    </span>
    <ArrowRight
      className={cn(
        'arrow-ne size-4 shrink-0 self-center text-muted-foreground',
        mark && 'lg:hidden',
      )}
    />
  </NavigationMenuLink>
)

/** A project's initial, printed: the same block the Projects index uses. */
const ProjectInitial = ({ title }: { title: string }) => (
  <span
    aria-hidden
    className="font-display relative grid size-8 place-items-center overflow-hidden rounded-[0.5rem] bg-muted text-base leading-none text-foreground/70"
  >
    <span aria-hidden className="halftone absolute inset-0 opacity-25" />
    <span className="relative">{[...title][0]}</span>
  </span>
)

/** An award's rosette, stamped in a ring: the Publications panel's recognition. */
const AwardStamp = () => (
  <span className="border-ink/35 bg-ink/8 grid size-8 place-items-center rounded-full border">
    <RosetteMark className="size-5" />
  </span>
)

// ── Menu components ────────────────────────────────────────────────────────

/**
 * Research holds the Themes *and* the Projects. They were two top-level items
 * naming the same thing — a Theme is what the lab studies, a Project is an
 * instance of studying it — and splitting them meant a visitor had to guess
 * which of two menus held the work.
 *
 * Both indexes get a tile: /research is the panel's primary destination (the
 * big tile with the filled button), /projects the second, so the projects
 * directory is no longer a small "All 7" link in a column label.
 */
const ResearchMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-8 sm:grid-cols-2">
    <PromoCard
      href="/research"
      art="orbit"
      title="Research overview"
      kicker={`${nav.researchThemes.length} themes · ${nav.projectCount} projects`}
      body="What DIAL studies and how: participatory design with communities that mainstream technology largely ignores."
      cta="See the research"
    />

    <div className="flex flex-col gap-5">
      <DestinationTile
        href="/projects"
        mark={<FactMark label="Projects" className="size-7" />}
        title="All projects"
        body="Ongoing and completed work, filterable by theme and status."
        cta="Browse projects"
      />
      <div>
        <PanelLabel>Featured projects</PanelLabel>
        <div className="grid gap-1">
          {nav.projectCategories
            .flatMap((category) => category.projects)
            .slice(0, 3)
            .map((project) => (
              <PanelRow
                key={project.id}
                href={project.href}
                title={project.title}
                note={project.description}
                mark={<ProjectInitial title={project.title} />}
              />
            ))}
        </div>
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
            className="group flex items-start gap-4 border-b border-border/60 px-0 py-4 text-left"
          >
            <span className="font-mono text-[0.65rem] text-muted-foreground tabular-nums">
              {String(i + 1).padStart(2, '0')}
            </span>
            <span className="mark-lift shrink-0">
              <ThemeGlyph slug={theme.slug} className="size-8" />
            </span>
            <span className="min-w-0 flex-1">
              <strong
                className={cn('font-display relative text-base font-normal', themeInk(theme.slug))}
              >
                {theme.title}
                <SquiggleUnderline />
              </strong>
              <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
                {theme.description}
              </span>
            </span>
            {/* A phone has no hover to reveal that a row is a link, so there
                every row carries the arrow a link wears elsewhere. */}
            <ArrowRight className="size-4 shrink-0 self-center text-muted-foreground lg:hidden" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  </div>
)

/**
 * Publications has exactly two destinations — the list and the honours — so
 * the panel spends its space on the one thing the list page cannot offer from
 * the navbar: the newest papers, by name, each a direct jump. Recognition is
 * drawn, not just listed: a rosette stamps each awarded paper.
 */
const PublicationsMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-8 lg:grid-cols-[20rem_1fr_18rem]">
    <PromoCard
      href="/publications"
      art="strata"
      title="All publications"
      kicker={
        nav.publicationYears
          ? `${nav.publicationCount} papers · ${nav.publicationYears}`
          : `${nav.publicationCount} papers`
      }
      body="The complete bibliography, with filters for year, venue, theme, open access, and collaborations."
      cta="Open the list"
    />

    <div>
      <PanelLabel action={<PanelMore href="/publications">The full list</PanelMore>}>
        Most Recent
      </PanelLabel>
      <div className="grid gap-1">
        {nav.recentPublications.map((pub) => (
          <PanelRow
            key={pub.id}
            href={pub.href}
            title={pub.title}
            note={
              <>
                {[pub.venue, pub.year].filter(Boolean).join(' · ')}
                {pub.award && (
                  <span className="text-ink ml-2 inline-flex items-center gap-1">
                    <RosetteMark className="size-3.5" />
                    {pub.award}
                  </span>
                )}
              </>
            }
          />
        ))}
      </div>
    </div>

    <div>
      <PanelLabel action={<PanelMore href="/awards">All awards</PanelMore>}>
        Awarded Work
      </PanelLabel>
      <div className="grid gap-1">
        {nav.publicationRecognition.map((award) => (
          <PanelRow
            key={award.id}
            href={award.href}
            title={award.title}
            note={award.body}
            mark={<AwardStamp />}
          />
        ))}
      </div>
    </div>
  </div>
)

/**
 * People shows people. The panel used to hold four links to /people dressed as
 * four categories, four alumni also linking to /people, and a twelve-cell grid
 * of the communities DIAL designs with — which is a statement about the
 * research, not a way to reach anyone. Now every row is a person with a page.
 *
 * The lead tile is the panel's answer to "I clicked People": it goes to
 * /people, like every other panel's tile goes to its section's index. It wears
 * the PI's portrait because she leads the roster, but her profile is one click
 * on from there — the tile is the section, not the person.
 */
const PeopleMenu = ({ nav }: MenuProps) => (
  <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
    {/* The photograph is taped on when there is one; there is no stock
        portrait standing in for a real person. */}
    {/* self-start: the tile is as tall as its own content. Stretched to the
        roster column it grew an empty paper tail under "Meet the lab". */}
    <Link
      href="/people"
      className="group relative flex flex-col self-start rounded-md border border-border bg-muted/40 p-5"
    >
      {/* No overflow-hidden on this card: the tape is stuck on over the edge
          of the photo and must be free to run past the card. The halftone
          rounds itself instead. */}
      <span aria-hidden className="halftone absolute inset-0 rounded-[inherit] opacity-[0.07]" />
      <div className="relative">
        {nav.pi?.photo ? (
          <span className="relative block">
            {/* A 4/3 frame cropped this portrait to its top 60% — ceiling and
                shadow, with the subject cut at the chest. The source is 4:5,
                so the frame is 3/4 and centred: very nearly the whole photo. */}
            <OptionalImage
              src={nav.pi.photo}
              alt={`Dr. ${nav.pi.name}`}
              overlay={<Tape />}
              frameClassName="aspect-3/4 w-full rounded-sm"
              sizes="(max-width: 1023px) 100vw, 18rem"
              className="h-full w-full object-cover object-center"
              fallback={<RisoArt variant="bloom" className="mx-auto size-40" />}
            />
          </span>
        ) : (
          <RisoArt variant="bloom" className="mx-auto size-40" />
        )}
      </div>
      <div className="relative mt-5">
        <span className="font-display relative inline-block text-xl leading-tight">
          People at DIAL
          <SquiggleUnderline />
        </span>
        <p className="mt-1 text-xs text-pretty text-muted-foreground">
          {nav.pi
            ? `Led by Dr. ${nav.pi.name}, Principal Investigator, with ${nav.teamCount} members and ${nav.alumniCount} alumni.`
            : `${nav.teamCount} members and ${nav.alumniCount} alumni.`}
        </p>
        <span className="mt-4 inline-flex items-center gap-1.5 text-xs font-medium">
          Meet the lab
          <ArrowRight className="arrow-ne size-4" />
        </span>
      </div>
    </Link>

    <div className="flex flex-col gap-8">
      {/* An overview, not the roster: the first few of each section, each
          linking to their own page, and a count that goes to /people for the
          rest. A person without a portrait arrives as their printed initial. */}
      <div>
        <PanelLabel>{nav.teamCount} In the Lab</PanelLabel>
        <div className="grid gap-6 md:grid-cols-3">
          {nav.rosterGroups.map((group) => (
            <div key={group.title}>
              <p className="mb-3 text-[0.7rem] font-medium tracking-[0.14em] text-muted-foreground uppercase">
                {group.title}
              </p>
              <ul className="flex flex-col items-start gap-2">
                {group.people.map((person) => (
                  <li key={person.slug} className="max-w-full">
                    <PersonChip
                      name={person.name}
                      seed={person.slug}
                      photo={person.photo}
                      href={`/people/${person.slug}`}
                      meta={person.role}
                      size="sm"
                    />
                  </li>
                ))}
                {group.more > 0 && (
                  <li>
                    <PanelMore href="/people">{group.more} more</PanelMore>
                  </li>
                )}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* The same three columns as the roster above, so the tile starts on
          the undergraduate column's edge and alumni take the other two. */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <PanelLabel action={<PanelMore href="/people">All {nav.alumniCount}</PanelMore>}>
            Where Our People Go
          </PanelLabel>
          <ul className="grid gap-x-6 gap-y-3 md:grid-cols-2">
            {nav.alumniTeaser.map((alum) => (
              <li key={alum.name}>
                <span className="text-sm font-medium text-foreground/85">{alum.name}</span>
                <span className="mt-0.5 block text-xs text-pretty text-muted-foreground">
                  {alum.placement}
                </span>
              </li>
            ))}
          </ul>
        </div>

        <DestinationTile
          href="/join-us"
          mark={<UserPlus className="size-6" />}
          title="Join the Lab"
          body="We read every email from graduate and undergraduate students."
          cta="How to apply"
        />
      </div>
    </div>
  </div>
)

/**
 * The Lab: About leads, because it is the page a first-time visitor is looking
 * for when they open a menu called "Lab" — it used to sit second, at a third
 * of the width News got.
 */
const LabMenu = () => (
  <div className="grid gap-y-6 md:grid-cols-2 md:gap-x-6 lg:grid-cols-4">
    <PromoCard
      href="/about"
      art="bloom"
      title="About the Lab"
      kicker="Design Inclusion and Access Lab"
      body="Who DIAL is, what it holds to, and how it works: an HCI lab at North South University, Dhaka."
      cta="Read about DIAL"
      className="md:col-span-2"
    />

    <PromoCard
      href="/news"
      art="signal"
      title="News"
      kicker="What the lab has been doing"
      body="Conference trips, invited talks, community events and fieldwork, as they happen."
      cta="Latest news"
      className="md:col-span-1"
    />

    <div className="grid gap-4 md:col-span-1">
      <DestinationTile
        href="/contact"
        mark={<RegistrationMark className="size-7" />}
        title="Contact"
        body="Where the lab is, and how to reach it."
        cta="Get in touch"
      />
      <DestinationTile
        href="/join-us"
        mark={<UserPlus className="size-6" />}
        title="Join the Lab"
        body="We take graduate and undergraduate students year-round."
        cta="How to apply"
      />
      <DestinationTile
        href="/design-system"
        mark={<DialMark title="" className="w-6" />}
        title="Design system and guidelines"
        body="The logo, inks, type and marks the site is printed in."
        cta="See the guidelines"
      />
    </div>
  </div>
)

// ── Nav config ─────────────────────────────────────────────────────────────

// Four items, not five: "Research", "Projects" and "Publications" were three
// words for the work, and a visitor had to guess which menu held what. Projects
// now live under Research, which is the thing they are instances of.
//
// Lab sits second rather than last. Last, it was the item nobody reached, and
// it holds About — the page a first-time visitor is most likely looking for.
const navigationMenuItems = [
  { key: 'research', label: 'Research', component: ResearchMenu },
  // LabMenu is static; it ignores the nav prop the other menus take.
  { key: 'lab', label: 'Lab', component: LabMenu as (props: MenuProps) => ReactElement },
  { key: 'publications', label: 'Publications', component: PublicationsMenu },
  { key: 'people', label: 'People', component: PeopleMenu },
] as const

type NavigationMenuKey = (typeof navigationMenuItems)[number]['key']

/**
 * How long a pointer must rest on a trigger before its panel opens. Low enough
 * to read as instant (under the ~100ms a delay becomes noticeable), high enough
 * that sweeping across the bar to reach Contact does not flash three panels.
 */
const OPEN_DELAY_MS = 75
const CLICK_AFTER_HOVER_MS = 400

/**
 * Two icons stacked in one cell, crossfading on a state flip so the toggle
 * reads as one mark changing rather than a glyph being swapped out.
 */
function IconSwap({ on, onIcon, offIcon }: { on: boolean; onIcon: ReactNode; offIcon: ReactNode }) {
  const layer =
    'col-start-1 row-start-1 transition-[opacity,scale,filter] duration-200 ease-snappy motion-reduce:transition-opacity'
  const hidden = 'scale-50 opacity-0 blur-[2px] motion-reduce:scale-100 motion-reduce:blur-none'
  return (
    <span className="grid place-items-center">
      <span className={cn(layer, !on && hidden)}>{onIcon}</span>
      <span className={cn(layer, on && hidden)}>{offIcon}</span>
    </span>
  )
}

// ── Theme ──────────────────────────────────────────────────────────────────

function subscribeToThemeClass(onChange: () => void) {
  const observer = new MutationObserver(onChange)
  observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
  return () => observer.disconnect()
}

const readIsDark = () => document.documentElement.classList.contains('dark')

// ── Component ──────────────────────────────────────────────────────────────

interface Navbar4Props {
  nav: NavData
  className?: string
}

const Navbar4 = ({ nav, className }: Navbar4Props) => {
  const [open, setOpen] = useState(false)
  const [submenu, setSubmenu] = useState<NavigationMenuKey | null>(null)
  // The desktop panel, controlled so a hover-then-click keeps it open and so a
  // link chosen inside it closes it. Base UI uses null for the closed state.
  const [panel, setPanel] = useState<string | null>(null)
  const openedAt = useRef(0)
  const barRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()

  // Arriving on a new page closes whatever panel led there, so the page you
  // chose is what you see, not the menu still hanging over it. Links close the
  // panel on click as well (below); this covers back and forward.
  const [shownPath, setShownPath] = useState(pathname)
  if (shownPath !== pathname) {
    setShownPath(pathname)
    setPanel(null)
  }

  const changePanel = (next: string | null) => {
    if (next === null && performance.now() - openedAt.current < CLICK_AFTER_HOVER_MS) return
    if (next) openedAt.current = performance.now()
    setPanel(next)
  }
  // The <head> script in layout.tsx applies the stored theme before paint;
  // this just mirrors the <html> class.
  const isDark = useSyncExternalStore(subscribeToThemeClass, readIsDark, () => false)

  const toggleDark = () => {
    const next = !isDark
    document.documentElement.classList.toggle('dark', next)
    localStorage.setItem('dial-theme', next ? 'dark' : 'light')
  }

  return (
    <section
      data-site-nav
      className={cn('inset-x-0 top-0 z-20 bg-background text-foreground', className)}
    >
      <div className="container">
        <NavigationMenu
          value={panel}
          onValueChange={changePanel}
          delay={OPEN_DELAY_MS}
          // Base UI portals the panel and would anchor it to the hovered
          // trigger; anchoring to the whole bar keeps it centred under the nav.
          anchor={barRef}
          align="center"
          className="min-w-full"
        >
          <div ref={barRef} className="flex w-full justify-between gap-2 py-4">
            {/* Logo. The wordmark used to carry "NSU HCI" as part of the
                drawing, which made the DIAL letters themselves small; the
                mark now stands alone and the university is named quietly
                beside it. */}
            <Link href="/" className="flex items-center">
              <DialLockup
                descriptor="university"
                wordmarkClassName="w-28 max-w-none sm:w-32"
                textClassName="hidden sm:block"
              />
            </Link>

            {/* Desktop nav */}
            <div className="flex items-center gap-2 xl:gap-8">
              <NavigationMenuList className="hidden gap-0 lg:flex">
                {navigationMenuItems.map((item) => (
                  <NavigationMenuItem key={item.key} value={item.key}>
                    <NavigationMenuTrigger className="px-3 text-sm xl:text-base">
                      {item.label}
                    </NavigationMenuTrigger>
                    <NavigationMenuContent
                      // The panel is portaled out of .container, so it takes the
                      // container's inner width explicitly: the bar's own
                      // edges, logo to theme toggle.
                      className="w-[min(calc(100vw-4rem),76rem)] p-12"
                      onClick={(event) => {
                        // Any link chosen in the panel closes it at once, the
                        // tiles included (they are plain links, which Radix's
                        // own link-select does not see).
                        if (event.target instanceof Element && event.target.closest('a'))
                          setPanel(null)
                      }}
                    >
                      <item.component nav={nav} />
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                ))}
              </NavigationMenuList>
            </div>

            {/* CTA + dark toggle + mobile toggle */}
            <div className="flex items-center gap-2">
              <Link
                href="/contact"
                className={cn(
                  buttonVariants(),
                  'ease-snappy hidden rounded-full px-4 transition-transform duration-150 active:scale-[0.97] md:inline-flex',
                )}
              >
                Contact
              </Link>
              <Button
                variant="ghost"
                size="icon"
                aria-label="Toggle dark mode"
                onClick={toggleDark}
              >
                <IconSwap
                  on={isDark}
                  onIcon={<Sun className="size-4" />}
                  offIcon={<Moon className="size-4" />}
                />
              </Button>
              <Button
                variant="outline"
                size="icon"
                aria-label="Main Menu"
                className="lg:hidden"
                onClick={() => {
                  if (open) {
                    setOpen(false)
                    setSubmenu(null)
                  } else {
                    setOpen(true)
                  }
                }}
              >
                <IconSwap
                  on={open}
                  onIcon={<X className="size-4" />}
                  offIcon={<Menu className="size-4" />}
                />
              </Button>
            </div>
          </div>

          {/* Mobile menu */}
          {/* The menu unrolls down from the nav bar with a CSS clip-path, so
              the shared layout does not need to ship Motion on every route. */}
          {open ? (
            <div
              className="mobile-menu-enter fixed inset-0 top-[77px] container flex h-[calc(100vh-77px)] w-full flex-col overflow-auto border-t border-border bg-background lg:hidden"
              onClick={(event) => {
                if (!(event.target instanceof Element) || !event.target.closest('a')) return
                setOpen(false)
                setSubmenu(null)
              }}
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
                    <div key={item.key} className="submenu-enter">
                      <h2 className="pt-4 pb-6 text-lg font-medium">{item.label}</h2>
                      <item.component nav={nav} />
                    </div>
                  ),
              )}
              <div className="mx-[2rem] mt-auto flex flex-col items-center gap-8 py-24">
                <Link href="/contact" className={cn(buttonVariants(), 'rounded-full px-5')}>
                  Contact
                </Link>
              </div>
            </div>
          ) : null}
        </NavigationMenu>
      </div>
    </section>
  )
}

export { Navbar4 }
