import Link from 'next/link'

import {
  ArrowMark,
  AsteriskMark,
  CircleMark,
  CropMarks,
  DashedPath,
  EmptySketch,
  FactMark,
  HalftoneWash,
  MarginNote,
  RegistrationMark,
  RosetteMark,
  Squiggle,
  SquiggleText,
  TickMark,
} from '@/components/dial/marks'
import { Annotated, DoDont, EaseDemo } from '@/components/dial/brand-specimen'
import {
  InkBand,
  NumberedSteps,
  PrimaryLink,
  PullQuote,
  SectionHeader,
  TextLink,
  sectionSpacing,
} from '@/components/dial/editorial'
import { DialLockup, DialMark, DialWordmark } from '@/components/dial/dial-logo'
import { FieldNote } from '@/components/dial/field-note'
import { InitialTile } from '@/components/dial/initial-tile'
import { PageHeader } from '@/components/dial/page-header'
import { PersonChip } from '@/components/dial/person-chip'
import { PhotoSlot } from '@/components/dial/photo-slot'
import { ProjectRow } from '@/components/dial/project-index'
import { RisoArt, type RisoVariant } from '@/components/dial/riso'
import { ThemeGlyph, themeInkVar } from '@/components/dial/theme-marks'
import { TokenValue } from '@/components/dial/token-value'
import { displaySectionTitle, label, lede, pageTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import { getDial } from '@/lib/dial/data/get'

export const metadata = {
  title: 'Design system and guidelines',
  description: "DIAL's logo, inks, type, hand-drawn marks and the rules for using them.",
}

/**
 * DIAL's design system and guidelines, as a page of the site rather than a document about
 * it. Every specimen here is the real component or the real token, so the page
 * cannot describe a system the site no longer uses. The rules are lifted from
 * the components' own doc comments, which is where they were first decided.
 */

const CONTENTS = [
  { id: 'logo', title: 'Logo' },
  { id: 'principles', title: 'Principles' },
  { id: 'inks', title: 'Inks' },
  { id: 'themes', title: 'Theme plates' },
  { id: 'type', title: 'Type' },
  { id: 'marks', title: 'Marks' },
  { id: 'compositions', title: 'Compositions' },
  { id: 'paper', title: 'Paper' },
  { id: 'components', title: 'Components' },
  { id: 'in-context', title: 'In context' },
  { id: 'motion', title: 'Motion & hover' },
  { id: 'rules', title: 'House rules' },
]

// ─── Inks ────────────────────────────────────────────────────────────────────

interface Swatch {
  name: string
  token: string
  /** A literal class, so Tailwind sees it. */
  fill: string
  role: string
  /** The tempting misuse, shown with the note. */
  dont?: string
}

const PAPER: Swatch[] = [
  {
    name: 'Paper',
    token: '--background',
    fill: 'bg-background',
    role: 'The page. Warm off-white, not screen white.',
  },
  { name: 'Card', token: '--card', fill: 'bg-card', role: 'A sheet laid on the page.' },
  { name: 'Muted', token: '--muted', fill: 'bg-muted', role: 'Fills, chips, photo slots.' },
  {
    name: 'Paper line',
    token: '--paper-line',
    fill: 'bg-paper-line',
    role: 'Ruled lines, lighter than a border.',
  },
  {
    name: 'Border',
    token: '--border',
    fill: 'bg-border',
    role: 'Hairlines between sections and rows.',
  },
  {
    name: 'Pencil',
    token: '--muted-foreground',
    fill: 'bg-muted-foreground',
    role: 'Secondary text and metadata.',
  },
  {
    name: 'Ink black',
    token: '--foreground',
    fill: 'bg-foreground',
    role: 'Type, and the one filled action.',
    dont: 'A second filled button on the same page.',
  },
]

const PRESS: Swatch[] = [
  {
    name: 'Flag green',
    token: '--brand',
    fill: 'bg-brand',
    role: 'Meaning only: ongoing status, the active filter, a link answering the pointer. Never decoration.',
    dont: 'A green heading, button or illustration because the page felt plain.',
  },
  {
    name: 'Second ink',
    token: '--ink',
    fill: 'bg-ink',
    role: 'Warm red-orange. Every hand-drawn mark, and recognition.',
    dont: 'Body text or an error state: it is the pen, not a warning.',
  },
  {
    name: 'Blue',
    token: '--ink-blue',
    fill: 'bg-ink-blue',
    role: 'Theme plates and printed compositions.',
    dont: "Status or links. A Theme's ink is its identity, so it never means anything else.",
  },
  {
    name: 'Yellow',
    token: '--ink-yellow',
    fill: 'bg-ink-yellow',
    role: 'Theme plates and printed compositions.',
    dont: "Status or links. A Theme's ink is its identity, so it never means anything else.",
  },
  {
    name: 'Violet',
    token: '--ink-violet',
    fill: 'bg-ink-violet',
    role: 'Theme plates and printed compositions.',
    dont: "Status or links. A Theme's ink is its identity, so it never means anything else.",
  },
]

const INK_NAMES: Record<string, string> = {
  'var(--ink)': 'Second ink',
  'var(--ink-blue)': 'Blue',
  'var(--ink-yellow)': 'Yellow',
  'var(--ink-violet)': 'Violet',
  'var(--brand)': 'Flag green',
}

const LOGOS: { name: string; code: string; use: string; specimen: React.ReactNode }[] = [
  {
    name: 'Lockup · university',
    code: '<DialLockup descriptor="university" />',
    use: 'The primary logo. The site header, and anywhere NSU should be named alongside the lab.',
    specimen: <DialLockup descriptor="university" wordmarkClassName="w-36 sm:w-44" />,
  },
  {
    name: 'Lockup · lab name',
    code: '<DialLockup descriptor="lab" />',
    use: 'Spells out what the letters stand for. For slides, posters and partner pages, where a reader may meet DIAL for the first time.',
    specimen: <DialLockup descriptor="lab" wordmarkClassName="w-36 sm:w-44" />,
  },
  {
    name: 'Wordmark',
    code: '<DialWordmark />',
    use: 'The letters alone, where the surroundings already say who the lab is — the footer, a signature.',
    specimen: <DialWordmark className="w-48" />,
  },
  {
    name: 'Brandmark',
    code: '<DialMark />',
    use: 'The D alone, for small square spaces: favicon, social avatar, a menu icon.',
    specimen: (
      <span className="flex items-end gap-8">
        <DialMark className="w-16" />
        <DialMark className="w-8" />
        <DialMark className="w-4" />
      </span>
    ),
  },
]

// ─── Marks ───────────────────────────────────────────────────────────────────

const MARKS: {
  name: string
  code: string
  use: string
  dont?: string
  specimen: React.ReactNode
}[] = [
  {
    name: 'Squiggle',
    code: '<SquiggleUnderline /> · <SquiggleText />',
    use: 'Drawn in on hover under a link\'s words — it means "this goes somewhere", so it never sits under a heading. One wave, tiled, never stretched.',
    dont: 'Under a page title. It could never match a title that wraps, and it says "link".',
    specimen: <Squiggle className="w-40" />,
  },
  {
    name: 'RosetteMark',
    code: '<RosetteMark />',
    use: "An Award itself: the award lists, the navbar's awarded work, a prize on a publication row.",
    dont: 'Beside anything that is not an award. The asterisk is the footnote; this is the prize.',
    specimen: <RosetteMark className="size-12" />,
  },
  {
    name: 'CircleMark',
    code: '<CircleMark />',
    use: 'A loop around the one word a headline turns on. Once per page, at most.',
    dont: 'Around a word in body text, or twice on one page.',
    specimen: (
      <span className="font-display relative inline-block text-3xl">
        misses.
        <CircleMark />
      </span>
    ),
  },
  {
    name: 'ArrowMark',
    code: '<ArrowMark />',
    use: 'Points from a margin note back at its subject.',
    specimen: <ArrowMark className="h-12 w-24" />,
  },
  {
    name: 'AsteriskMark',
    code: '<AsteriskMark />',
    use: 'A footnote beside something: the pin on a FieldNote, a note on a figure.',
    dont: "For an award — that is the rosette's job now.",
    specimen: <AsteriskMark className="size-8" />,
  },
  {
    name: 'TickMark',
    code: '<TickMark />',
    use: "A short rule with a hand's wobble, before a section label.",
    specimen: <TickMark className="h-3 w-14" />,
  },
  {
    name: 'RegistrationMark',
    code: '<RegistrationMark />',
    use: "The press's alignment target. Signs off the footer.",
    specimen: <RegistrationMark className="size-10" />,
  },
  {
    name: 'DashedPath',
    code: '<DashedPath />',
    use: 'A dotted thread from one numbered step to the next.',
    specimen: <DashedPath className="w-40" />,
  },
  {
    name: 'EmptySketch',
    code: '<EmptySketch />',
    use: 'A swept-out page, where a filter has emptied a list.',
    specimen: <EmptySketch />,
  },
  {
    name: 'CropMarks',
    code: '<CropMarks />',
    use: 'Top corners of a page header: this is a printed sheet, trimmed here.',
    specimen: (
      <span className="relative block h-12 w-32 border-t border-dashed border-border">
        <CropMarks className="text-ink/70 top-2 mx-5" />
      </span>
    ),
  },
  {
    name: 'FactMark',
    code: '<FactMark label="…" />',
    use: 'A small drawing beside a header figure, keyed by its label.',
    specimen: (
      <span className="flex gap-4">
        {['Publications', 'Awards', 'People', 'Grants'].map((l) => (
          <FactMark key={l} label={l} className="size-8" />
        ))}
      </span>
    ),
  },
]

const COMPOSITIONS: { variant: RisoVariant; caption: string; use: string; isNew?: boolean }[] = [
  {
    variant: 'orbit',
    caption: 'Concentric rings crossed by an off-register disc: reach and overlap.',
    use: "Research, About: the lab's reach.",
  },
  {
    variant: 'strata',
    caption: 'Stacked contour lines, like a hand-drawn elevation map.',
    use: 'Publications: the record, layer on layer.',
  },
  {
    variant: 'signal',
    caption: 'Arcs radiating from a low point: a signal leaving somewhere small.',
    use: 'News, Awards, Join: word going out.',
  },
  {
    variant: 'field',
    caption: 'A dotted plot with one marked reading: data, drawn by hand.',
    use: 'Projects: the work, measured in the field.',
  },
  {
    variant: 'bloom',
    caption: 'Overlapping petals of ink: two colours meeting where they overlap.',
    use: 'People, and the site-wide card: the lab itself.',
  },
  {
    variant: 'thread',
    caption: 'Circles strung on a dotted thread, one ringed twice.',
    use: 'Collaboration: partners, co-authors, Contact.',
    isNew: true,
  },
  {
    variant: 'grid',
    caption: "A notebook's squared grid with one cell inked in.",
    use: 'Empty and not-found states: a page with its one mark missing.',
    isNew: true,
  },
  {
    variant: 'echo',
    caption: 'Arcs set down one after another, each a little off the last.',
    use: 'Time: the news archive, the years, a timeline.',
    isNew: true,
  },
  {
    variant: 'seed',
    caption: 'A small seed with uneven strokes radiating from it.',
    use: 'Beginnings: joining the lab, a first project.',
    isNew: true,
  },
]

const EASINGS = [
  {
    token: 'ease-snappy',
    value: 'cubic-bezier(0.23, 1, 0.32, 1)',
    use: 'Anything that answers the user: hover, press, a filter.',
    duration: 450,
  },
  {
    token: 'ease-in-out-strong',
    value: 'cubic-bezier(0.77, 0, 0.175, 1)',
    use: 'Deliberate on-screen movement: a rule or a stroke drawing itself.',
    duration: 700,
  },
  {
    token: 'ease-drawer',
    value: 'cubic-bezier(0.32, 0.72, 0, 1)',
    use: 'The mobile menu sheet.',
    duration: 300,
  },
]

const TIMINGS = [
  { value: '0ms', use: 'The desktop megamenu opens and closes — no animation at all' },
  { value: '75ms', use: 'Hover intent before a megamenu panel opens' },
  { value: '250ms', use: 'A mark lifts on hover (it settles back in 150ms)' },
  { value: '260ms', use: 'Arrow turns to face north-east' },
  { value: '450ms', use: 'Hover squiggle wipes under a link' },
  { value: '500ms', use: 'Header pieces rise in, 60ms apart' },
  { value: '700ms', use: 'Section rules draw across' },
  { value: '900ms', use: 'Hand-drawn strokes draw in' },
]

// ─── Page ────────────────────────────────────────────────────────────────────

export default async function DesignSystemPage() {
  const { featuredProjects, labInfo, publications, researchThemes, team, toProjectEntry } =
    await getDial()
  // Real records for the specimens, never invented ones.
  const people = team.filter((m) => m.displayInWebsite !== false).slice(0, 5)
  const sampleDoi = publications.find((p) => p.doi)?.doi
  const sampleSocial = labInfo.socials?.[0]?.url
  // A real project row, for the mark lift in context.
  const sampleProject = featuredProjects()[0]
  return (
    <>
      <PageHeader
        eyebrow="Design system"
        art="strata"
        title={
          <>
            DIAL design system and{' '}
            <span className="relative inline-block">
              guidelines
              <CircleMark />
            </span>
          </>
        }
        description="The riso notebook. DIAL's site is printed, not rendered: warm paper, a few inks laid slightly out of register, and marks made by hand in the margin. This page is the whole system, built from the same components the site uses."
        facts={[
          { value: String(PRESS.length), label: 'Inks' },
          { value: '4', label: 'Typefaces' },
          { value: String(researchThemes.length), label: 'Theme plates' },
        ]}
      >
        <nav aria-label="On this page" className="mt-12">
          <ol className="grid max-w-3xl grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3 md:grid-cols-5">
            {CONTENTS.map((item, i) => (
              <li key={item.id}>
                <a href={`#${item.id}`} className="group flex items-baseline gap-2 text-sm">
                  <span className="text-ink font-mono text-[10px] tracking-[0.2em]">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className="relative text-muted-foreground transition-colors group-hover:text-foreground">
                    {item.title}
                    <Squiggle hover className="absolute -bottom-1.5 left-0" />
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </PageHeader>

      {/* §1 Logo */}
      <section id="logo" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="01 · Logo"
          title="One mark, four ways to set it."
          description="The letters are drawn as nested outlines, a single line run around each form. Every version below is the same drawing: only what sits beside it changes."
        />
        <ul className="mt-12 grid gap-4 md:grid-cols-2">
          {LOGOS.map((logo) => (
            <li key={logo.name} className="flex flex-col">
              <div className="relative grid h-48 place-items-center overflow-hidden rounded-lg border border-border bg-card px-6">
                <CropMarks className="top-5 mx-5" />
                {logo.specimen}
              </div>
              <div className="mt-4 flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                <p className="text-sm font-medium">{logo.name}</p>
                <p className="font-mono text-[11px] text-muted-foreground">{logo.code}</p>
              </div>
              <p className="mt-1 max-w-prose text-sm text-pretty text-muted-foreground">
                {logo.use}
              </p>
            </li>
          ))}
        </ul>

        {/* Reversed: the same forms on ink black, in paper. */}
        <div className="dark mt-4 flex flex-wrap items-center justify-center gap-x-14 gap-y-8 rounded-lg bg-background px-6 py-12 text-foreground">
          <DialLockup descriptor="lab" wordmarkClassName="w-32" />
          <DialMark className="w-10" />
        </div>

        <div className="mt-12 grid gap-x-12 gap-y-8 border-t border-border pt-8 md:grid-cols-3">
          <LogoRule title="One colour">
            Ink black on paper, paper on ink black. The mark takes currentColor, so it never needs
            an inverted copy.
          </LogoRule>
          <LogoRule title="Clear space">
            Keep at least the width of the D&rsquo;s inner stroke-gap clear on every side — roughly
            a quarter of the mark&rsquo;s height.
          </LogoRule>
          <LogoRule title="Downloads">
            <a
              href="/dial-logo.svg"
              download
              className="underline underline-offset-4 hover:text-foreground"
            >
              Wordmark SVG
            </a>{' '}
            ·{' '}
            <a
              href="/dial-mark.svg"
              download
              className="underline underline-offset-4 hover:text-foreground"
            >
              Brandmark SVG
            </a>
          </LogoRule>
        </div>
      </section>

      {/* §2 Principles */}
      <section id="principles" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="02 · Principles"
          title="A field notebook, run through a riso press."
          description="Three ideas hold the whole look together. When something new is designed, it should be explainable in these terms."
        />
        <NumberedSteps
          className="mt-12"
          steps={[
            {
              title: 'Paper, not screen',
              body: 'Warm off-white with warm greys on top, a fixed grain over everything, hairlines instead of boxes. Dark mode is the same paper inverted, not a different product.',
            },
            {
              title: 'Few inks, fixed meanings',
              body: 'Green means something is live. The second ink is the hand. Blue, yellow and violet belong to Research Themes. A colour never changes its job between pages.',
            },
            {
              title: 'Marked by hand, never by meaning',
              body: 'Squiggles, circles and arrows are decoration: always hidden from assistive tech, never the only carrier of information. Uneven on purpose — a perfect line reads as a border.',
            },
          ]}
        />
      </section>

      {/* §3 Inks */}
      <section id="inks" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="03 · Inks"
          title="Paper, then five inks on the press."
          description="All colour is OKLCH, defined once in globals.css and read here live — toggle the theme and every value below changes with it. Never a raw hex in a component. Hover or focus a swatch for its value and its one job."
        />

        <h3 className={cn(label, 'mt-12')}>The paper</h3>
        <ul className="mt-4 grid grid-cols-2 gap-x-4 gap-y-6 lg:grid-cols-4">
          {PAPER.map((s) => (
            <SwatchCard key={s.token} swatch={s} />
          ))}
        </ul>

        <h3 className={cn(label, 'mt-12')}>The press</h3>
        <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {PRESS.map((s) => (
            <SwatchCard key={s.token} swatch={s} tall />
          ))}
        </ul>

        {/* Overprint: where two inks cross they multiply, as they would on a drum. */}
        <div className="mt-12 grid items-center gap-8 border-t border-border pt-8 md:grid-cols-[16rem_1fr]">
          <div aria-hidden className="relative h-40 w-60">
            <span className="halftone text-brand absolute top-0 left-0 size-36 rounded-full opacity-80 mix-blend-multiply dark:mix-blend-screen" />
            <span className="bg-ink/45 absolute top-4 left-20 size-36 rounded-full mix-blend-multiply dark:mix-blend-screen" />
            <span className="bg-ink-yellow/45 absolute top-20 left-8 size-16 rounded-full mix-blend-multiply dark:mix-blend-screen" />
          </div>
          <div className="max-w-prose space-y-3 text-pretty text-muted-foreground">
            <p>
              <span className="text-foreground">Overprint, don&rsquo;t blend.</span> Where inks meet
              they multiply, as on a riso drum, and a flat fill is usually a halftone at low
              strength rather than a solid.
            </p>
            <p>
              Inks carry marks and fields, not body text. Type stays in ink black and pencil so that
              contrast never depends on which plate a page is printed in.
            </p>
          </div>
        </div>
      </section>

      {/* §4 Theme plates */}
      <section id="themes" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="04 · Theme plates"
          title="One glyph and one ink per Research Theme."
          description="Fixed per slug, never random: a Theme keeps its colour and its drawing everywhere it appears. A Theme page sets --header-ink, so one variable re-inks its whole header."
        />
        <ul className="mt-12 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2 lg:grid-cols-3">
          {researchThemes.map((theme) => {
            const ink = themeInkVar(theme.slug)
            return (
              <li key={theme.slug} className="bg-background">
                <Link
                  href={`/research/${theme.slug}`}
                  style={{ '--header-ink': ink } as React.CSSProperties}
                  className="group relative flex h-full items-start gap-4 p-6"
                >
                  <span aria-hidden className="ink-wash absolute inset-0" />
                  <ThemeGlyph slug={theme.slug} className="relative size-14 shrink-0" />
                  <div className="relative min-w-0">
                    <SquiggleText className="font-display text-xl leading-snug">
                      {theme.title}
                    </SquiggleText>
                    <p className="mt-2 flex items-center gap-2 font-mono text-[11px] tracking-[0.08em] text-muted-foreground uppercase">
                      <span className="ink-mark halftone inline-block size-3 rounded-full" />
                      {INK_NAMES[ink] ?? ink}
                    </p>
                  </div>
                </Link>
              </li>
            )
          })}
        </ul>
      </section>

      {/* §5 Type */}
      <section id="type" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="05 · Type"
          title="A soft serif for titles, a plain sans for reading, a hand for the margin."
        />
        <div className="mt-12 divide-y divide-border border-y border-border">
          <TypeRow
            face="Fraunces"
            token="font-display · pageTitle"
            note="Page titles. Variable, with the SOFT axis at 50: a serif's authority with the edges taken off, for a lab that leads with listening."
          >
            <p className={pageTitle}>Technology for communities.</p>
          </TypeRow>
          <TypeRow
            face="Fraunces"
            token="font-display · displaySectionTitle"
            note="Section titles, row titles, pull quotes."
          >
            <p className={displaySectionTitle}>Locally appropriate, low-cost, explainable.</p>
          </TypeRow>
          <TypeRow
            face="Geist"
            token="font-sans · lede, body"
            note="Everything that is read rather than looked at. Ledes sit in pencil at a prose measure."
          >
            <p className={lede}>
              DIAL studies how people live with technology in low-resource, high-stakes settings,
              then builds inclusive systems with the communities who will use them.
            </p>
          </TypeRow>
          <TypeRow
            face="Geist"
            token="label"
            note="Small uppercase labels above a title or a column of metadata."
          >
            <p className={label}>Research · Publications</p>
          </TypeRow>
          <TypeRow
            face="Geist Mono"
            token="font-mono"
            note="Figure numbers, DOIs, sources and tokens — the printer's own annotations."
          >
            <p className="text-ink font-mono text-sm tracking-[0.08em] uppercase">
              Fig. 01{sampleDoi && <> · doi:{sampleDoi}</>}
            </p>
          </TypeRow>
          <TypeRow
            face="Caveat"
            token="font-hand"
            note="Margin notes and hand-lettered figure labels only. Never body copy, never a heading."
          >
            <p className="font-hand text-ink text-3xl">worth coming back to →</p>
          </TypeRow>
          <TypeRow
            face="Mina"
            token="fallback in every stack"
            note="Bengali, behind every stack. Names are set on purpose, not left to whatever the OS has. Loaded only when Bengali glyphs appear."
          >
            <p className="font-display text-4xl">স্যন্ধি · জ্যোতি</p>
          </TypeRow>
        </div>
      </section>

      {/* §6 Marks */}
      <section id="marks" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="06 · Marks"
          title="Drawn in the second ink, and drawn in as you arrive."
          description="Each stroke draws itself the first time its section scrolls into view, and simply sits drawn when motion is reduced."
        />
        <ul className="mt-12 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
          {MARKS.map((mark) => (
            <li key={mark.name} data-reveal>
              <Annotated
                id={`mark-${mark.name}`}
                name={mark.name}
                token={mark.code}
                rule={mark.use}
                dont={mark.dont}
                stageClassName="grid min-h-40 place-items-center p-5 [@media(hover:hover)_and_(pointer:fine)]:h-44"
              >
                {mark.specimen}
              </Annotated>
            </li>
          ))}
        </ul>

        <div className="mt-12 grid gap-10 border-t border-border pt-8 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl">MarginNote</h3>
            <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
              Restates, in pencil, something the page already says in type. Decoration: hidden from
              assistive tech and dropped below <code className="font-mono text-sm">sm</code>. Three
              or four across the whole site keeps it a voice rather than a tic.
            </p>
            <p className="mt-6 flex items-end gap-3">
              <span className="font-display text-3xl">Join the lab</span>
              <MarginNote>we read every one</MarginNote>
            </p>
          </div>
          <div>
            <h3 className="font-display text-2xl">FieldNote</h3>
            <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
              Carries something the page says nowhere else, so it is real content: readable at every
              width and always attributed. An unsourced note is trivia.
            </p>
            <FieldNote source="field-note.tsx · the component's own rule" className="mt-6">
              A sourced note is a citation set in pencil.
            </FieldNote>
          </div>
        </div>
      </section>

      {/* §7 Compositions */}
      <section id="compositions" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="07 · Compositions"
          title="Abstract on purpose."
          description="Large riso prints for headers, empty photo slots and share cards. DIAL works with real communities, and an illustrated scene of people would be inventing imagery of them — shapes carry the texture without claiming to depict anyone. Each is a fixed drawing, so a page looks the same on every visit, and each has a job: pick the print by what the page is about, not by which looks nicest."
        />
        <ul className="mt-12 grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
          {COMPOSITIONS.map(({ variant, caption, use, isNew }) => (
            <li key={variant}>
              <Annotated
                id={`riso-${variant}`}
                name={variant}
                token={`<RisoArt variant="${variant}" />`}
                rule={`${caption} ${use}`}
                stageClassName="bg-muted/40"
              >
                <span className="relative grid aspect-square place-items-center">
                  <CropMarks className="text-ink/45 top-5 mx-5" />
                  <span aria-hidden className="halftone absolute inset-0 opacity-[0.08]" />
                  <RisoArt variant={variant} className="size-[74%]" />
                  {isNew && (
                    <span className="font-hand text-ink absolute top-3 right-12 text-lg leading-none">
                      new
                    </span>
                  )}
                </span>
              </Annotated>
              <p className="mt-1 text-sm text-pretty text-muted-foreground">{use}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* §8 Paper */}
      <section id="paper" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="08 · Paper"
          title="Stuck on, stamped, taped down."
          description="Treatments for anything that should look placed on the page rather than laid out by it."
        />
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <PaperSpecimen
            name="halftone"
            note="Dots in currentColor behind letter marks and stamps; soft washes in the open side of a header."
          >
            <span className="relative grid size-32 place-items-center">
              <HalftoneWash className="inset-0" />
              <span className="halftone text-ink-blue absolute inset-6 rounded-full opacity-60" />
            </span>
          </PaperSpecimen>
          <PaperSpecimen
            name="Stamp"
            note="A year in an ink ring. Rests square; interactive owners may tilt it on hover, never at rest."
          >
            <span className="sticker border-ink/40 font-display text-ink inline-grid size-20 place-items-center rounded-full border-2 text-2xl tabular-nums">
              2024
            </span>
          </PaperSpecimen>
          <PaperSpecimen
            name="InitialTile"
            note="A person's initial, printed. Their ink comes from their slug, so they keep it everywhere."
          >
            <span className="flex gap-2">
              {people.map((m) => (
                <InitialTile key={m.slug} name={m.name} seed={m.slug} />
              ))}
            </span>
          </PaperSpecimen>
          <PaperSpecimen
            name="Grain"
            note="A fixed noise wash over the whole viewport — multiply on paper, screen on dark. It is the surface, not content."
          >
            <span className="relative block size-32 overflow-hidden rounded-md border border-border bg-card">
              <span
                aria-hidden
                className="absolute inset-0 opacity-60 mix-blend-multiply dark:mix-blend-screen"
                style={{
                  backgroundImage:
                    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='180' height='180' filter='url(%23n)'/%3E%3C/svg%3E\")",
                }}
              />
            </span>
          </PaperSpecimen>
        </div>
        <div className="mt-12 grid gap-8 border-t border-border pt-8 md:grid-cols-[20rem_1fr]">
          <PhotoSlot
            alt=""
            art="bloom"
            caption="Photograph slot, printed until a real photo arrives."
          />
          <div className="max-w-prose space-y-3 text-pretty text-muted-foreground">
            <p>
              <span className="text-foreground">Photographs are taped; prints sit flat.</span> A
              PhotoSlot is a real place in the layout that prints a composition until DIAL supplies
              the picture, and falls back to the same print if a photo fails to load.
            </p>
            <p>
              Captions describe the slot, never the picture. No stock imagery: it would read as the
              Lab&rsquo;s own work.
            </p>
          </div>
        </div>
      </section>

      {/* §9 Components */}
      <section id="components" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader label="09 · Components" title="A small vocabulary, used everywhere." />
        <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
          <ComponentSpecimen
            name="PrimaryLink · TextLink"
            note="One filled action per page. Every other action is a TextLink: a squiggle drawn under it on hover, and an arrow that turns to face where it goes."
          >
            <div className="flex flex-wrap items-center gap-8">
              <PrimaryLink href="#components">Apply to join</PrimaryLink>
              <TextLink href="/publications">Read the publications</TextLink>
              {sampleSocial && (
                <TextLink href={sampleSocial} external>
                  External link
                </TextLink>
              )}
            </div>
          </ComponentSpecimen>
          <ComponentSpecimen
            name="Status"
            note="The only place green is spent on its own. Ongoing gets a ringed dot in flag green; completed fades to pencil."
          >
            <div className="flex gap-8 text-sm">
              <span className="text-brand inline-flex items-center gap-1.5">
                <span className="bg-brand ring-brand/25 size-2 rounded-full ring-2" />
                Ongoing
              </span>
              <span className="inline-flex items-center gap-1.5 text-muted-foreground">
                <span className="size-2 rounded-full bg-muted-foreground/40" />
                Completed
              </span>
            </div>
          </ComponentSpecimen>
          <ComponentSpecimen
            name="PersonChip"
            note="A person referenced inside something else — a project's team, an author on a row. Where people are the subject, the roster row is used instead."
          >
            <div className="flex flex-wrap gap-2">
              {people.slice(0, 3).map((m, i) => (
                <PersonChip
                  key={m.slug}
                  name={m.name}
                  seed={m.slug}
                  href={`/people/${m.slug}`}
                  size={i === 0 ? 'md' : 'sm'}
                />
              ))}
            </div>
          </ComponentSpecimen>
          <ComponentSpecimen
            name="Section header"
            note="Every section opens the same way: a hairline that draws across, a ticked label, a display title. One left edge down the whole site."
          >
            <SectionHeader label="Label" title="A section title" />
          </ComponentSpecimen>
        </div>

        <div className="mt-16 border-t border-border pt-12">
          <p className={cn(label, 'mb-16 md:mb-24')}>PullQuote</p>
          <PullQuote>Printed, not rendered.</PullQuote>
          <p className="mt-6 max-w-prose text-pretty text-muted-foreground">
            A line lifted out of the copy at a size nothing else reaches. It repeats something the
            page already says rather than making a new claim, and hangs its quote mark into the
            margin the way print does.
          </p>
        </div>
      </section>

      {/* §10 In context */}
      <section id="in-context" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="10 · In context"
          title="The same pieces, where they actually live."
          description="A mark on its own card says little about when to reach for it. Here each one sits in the kind of passage it was made for, followed by the rules that are easiest to break — the wrong version usually looks fine until it is next to the right one."
        />

        <div className="mt-12 grid gap-x-12 gap-y-14 md:grid-cols-2">
          <ComponentSpecimen
            name="A link in running text"
            note="The squiggle draws under a link's words as the pointer arrives, and the arrow turns to face where it goes. Hover the sentence's link."
          >
            <p className="max-w-prose text-pretty text-muted-foreground md:text-lg">
              DIAL publishes at CHI, TOCHI and ICTD, and the{' '}
              <TextLink href="/publications" className="text-base">
                full bibliography
              </TextLink>{' '}
              is filterable by year, venue and theme.
            </p>
          </ComponentSpecimen>

          <ComponentSpecimen
            name="An award, stamped"
            note="The rosette marks the prize itself. It sits in the margin of the row like a stamp, in the second ink, and the award's name and year sit beside it in type — the mark repeats what the words say."
          >
            <div className="flex items-start gap-4 border-y border-border py-4">
              <span className="border-ink/35 bg-ink/8 grid size-10 shrink-0 place-items-center rounded-full border">
                <RosetteMark className="size-6" />
              </span>
              <div>
                <p className="font-display text-xl leading-snug">Best Paper Award</p>
                <p className="mt-1 text-sm text-muted-foreground">ACM CHI · 2019</p>
              </div>
            </div>
          </ComponentSpecimen>

          <ComponentSpecimen
            name="The mark lift, on a real row"
            className="md:col-span-2"
            note="A row's printed mark (a project's letter, a Theme's glyph, a person's initial) rises and tips 4° when the row is hovered, while its title takes the squiggle. Two answers, and the paper behind them stays still."
          >
            {sampleProject && (
              <ol className="border-t border-border">
                <li>
                  <ProjectRow project={toProjectEntry(sampleProject)} index={1} />
                </li>
              </ol>
            )}
          </ComponentSpecimen>

          <ComponentSpecimen
            name="A FieldNote beside its paragraph"
            note="The note sits in the margin next to the claim it backs, readable at every width and always sourced. It adds what the paragraph cannot say without breaking stride."
          >
            <div className="grid gap-6 sm:grid-cols-[1fr_12rem]">
              <p className="text-pretty text-muted-foreground">
                We use participatory design and long-term fieldwork to understand problems from the
                inside, then build and evaluate technology with the people who will use it.
              </p>
              <FieldNote source="UTOPIA project, 1981–1986">
                Designing with the people who will use the thing began with Scandinavian trade
                unions.
              </FieldNote>
            </div>
          </ComponentSpecimen>
        </div>

        <div className="mt-16 flex flex-col gap-12">
          <DoDont
            rule="No squiggle under a heading."
            why="The squiggle means “this goes somewhere”. Under a title that goes nowhere it says the opposite of what it says everywhere else, and a stroke of fixed length can never match a title that wraps."
            dont={
              <span className="relative w-fit">
                <span className="font-display text-3xl">Research at the margins</span>
                <Squiggle className="mt-1" />
              </span>
            }
            doThis={
              <span className="flex flex-col items-start gap-3">
                <span className="font-display text-3xl">Research at the margins</span>
                <TextLink href="/research">All nine themes</TextLink>
              </span>
            }
          />
          <DoDont
            rule="One answer per signal on hover, and the paper never darkens."
            why="A hovered row may answer with its words (the squiggle) and its mark (the lift or an arrow's turn). A tilt, a darkened background and an underline all at once reads as the page flinching, not answering."
            dont={
              <span className="flex w-full items-center gap-4 rounded-lg bg-muted px-4 py-3">
                <span className="bg-ink/12 font-display text-ink grid size-10 scale-106 -rotate-4 place-items-center rounded-[0.6rem] text-xl">
                  P
                </span>
                <span className="font-display relative text-xl">
                  Protibadi
                  <Squiggle className="absolute -bottom-1.5 left-0" />
                </span>
              </span>
            }
            doThis={
              <span className="flex w-full items-center gap-4 px-4 py-3">
                <span className="bg-ink/12 font-display text-ink grid size-10 -translate-y-0.5 scale-106 -rotate-4 place-items-center rounded-[0.6rem] text-xl">
                  P
                </span>
                <span className="font-display relative text-xl">
                  Protibadi
                  <Squiggle className="absolute -bottom-1.5 left-0" />
                </span>
              </span>
            }
          />
          <DoDont
            rule="One ink band per page."
            why="The band works because everything around it is hairlines and open paper. A second one turns the exception into the rhythm, and neither reads as the page's loudest moment."
            dont={<MiniPage bands={2} />}
            doThis={<MiniPage bands={1} />}
          />
          <DoDont
            rule="A rosette for an award, an asterisk for a footnote."
            why="The asterisk used to stand in for recognition. It now pins a FieldNote and marks a footnote; the prize itself gets the rosette."
            dont={
              <span className="text-ink inline-flex items-center gap-1.5 text-sm">
                <AsteriskMark className="size-3.5" />
                Best Paper Award
              </span>
            }
            doThis={
              <span className="text-ink inline-flex items-center gap-1.5 text-sm">
                <RosetteMark className="size-4" />
                Best Paper Award
              </span>
            }
          />
        </div>
      </section>

      {/* §11 Motion & hover */}
      <section id="motion" className={cn('container scroll-mt-24', sectionSpacing)}>
        <SectionHeader
          label="11 · Motion & hover"
          title="One-shot, and never in the way."
          description="Headers arrive, rules and strokes draw themselves once, links answer the pointer. Nothing loops, nothing blocks interaction. Reduced motion keeps the fades and drops the travel. The more often a thing is used, the less it moves: the menu, opened on every visit, does not animate at all."
        />
        <div className="mt-12 grid gap-12 md:grid-cols-2">
          <div>
            <h3 className={label}>Curves</h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {EASINGS.map((e) => (
                <EaseDemo key={e.token} {...e} />
              ))}
            </ul>
          </div>
          <div>
            <h3 className={label}>Timings</h3>
            <ul className="mt-4 divide-y divide-border border-y border-border">
              {TIMINGS.map((t) => (
                <li key={t.use} className="flex items-baseline gap-6 py-4">
                  <span className="font-display w-24 shrink-0 text-2xl tabular-nums">
                    {t.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{t.use}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The hover vocabulary and the menu: decided in the route review, and
            the two rules most often broken by a component that "needs a hover". */}
        <div className="mt-16 grid gap-12 border-t border-border pt-10 md:grid-cols-2">
          <div>
            <h3 className="font-display text-2xl">The hover vocabulary</h3>
            <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
              A hovered link answers with at most two things: its words, and its mark. The paper
              behind it never darkens. Pressing is separate — a link may still give under the
              finger, because that is feedback, not decoration. Hover is gated to devices that can
              hover, so a phone never shows a stroke it cannot take back.
            </p>
            <dl className="mt-6 divide-y divide-border border-y border-border text-sm">
              {[
                [
                  'Words',
                  "The squiggle under a link's words — a row title, a text link (SquiggleUnderline, SquiggleText). On long titles, a rule in the margin instead.",
                ],
                [
                  'Mark',
                  '.mark-lift on a printed mark — up 2px, −4°, ×1.06, 250ms out, 150ms back — or an arrow turning north-east.',
                ],
                ['Press', 'active:scale-[0.97] on buttons and pills; never a change of colour.'],
                ['Never', 'A darkened or tinted background on hover, or three answers at once.'],
              ].map(([term, body]) => (
                <div key={term} className="grid grid-cols-[5rem_1fr] gap-4 py-3">
                  <dt className="font-mono text-xs text-foreground">{term}</dt>
                  <dd className="text-pretty text-muted-foreground">{body}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="font-display text-2xl">The megamenu</h3>
            <p className="mt-2 max-w-prose text-pretty text-muted-foreground">
              Opened on nearly every visit, so it does not animate: no zoom, no slide between
              panels, no fade out. It simply appears, the way a command palette does.
            </p>
            <ul className="mt-6 divide-y divide-border border-y border-border text-sm">
              {[
                [
                  '75ms',
                  'Hover intent before a panel opens: under the ~100ms where a delay becomes noticeable, over the time it takes to sweep across the bar to Contact.',
                ],
                [
                  '400ms',
                  'A click this soon after a hover opened the panel keeps it open. It is the same “show me” arriving twice, not a request to close.',
                ],
                [
                  'Arrive',
                  'Choosing any link or tile in a panel closes it, so the page you chose is what you see.',
                ],
                ['Phone', 'Every row ends in an arrow: there is no hover to discover a link by.'],
              ].map(([term, body]) => (
                <li key={term} className="grid grid-cols-[5rem_1fr] gap-4 py-3">
                  <span className="font-mono text-xs text-foreground">{term}</span>
                  <span className="text-pretty text-muted-foreground">{body}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* §11 House rules — the page's one ink band. */}
      <div id="rules" className="scroll-mt-24">
        <InkBand>
          <p className={cn(label, 'flex items-center gap-2')}>
            <TickMark />
            12 · House rules
          </p>
          <h2 className={cn(displaySectionTitle, 'mt-3 max-w-2xl text-balance')}>
            The short list to check a new page against.
          </h2>
          <ol className="mt-12 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {[
              [
                'Green means live.',
                'Status, the active filter, a link on hover. If it is only there to look nice, it is the wrong ink.',
              ],
              [
                'One ink band per page.',
                'It works because everything around it is hairlines and open paper. A second one turns the exception into the rhythm.',
              ],
              [
                'Marks never carry meaning.',
                'Every drawn mark is aria-hidden and repeats something the type already says.',
              ],
              [
                'No invented imagery.',
                'No illustrated people, no stock photos, no captions about what a photograph might show.',
              ],
              [
                'Hand lettering stays in the margin.',
                'Caveat is for notes and figure labels. It is never a heading and never a paragraph.',
              ],
              [
                'At rest, everything is square.',
                'Stamps and stickers may tilt when the pointer arrives. The resting page never looks misaligned.',
              ],
              [
                'Two answers to a hover, at most.',
                'The words and the mark. Never the background, and never all three.',
              ],
              ['No squiggle under a heading.', 'The squiggle means a link. A title is not one.'],
              [
                'One name: Design system and guidelines.',
                'In the menu, the footer, the page and the URL, /design-system. Not \u201cbrand guidelines\u201d in one place and \u201cdesign system\u201d in another.',
              ],
            ].map(([title, body], i) => (
              <li key={title} className="flex gap-4 border-t border-foreground/15 pt-5">
                <span className="font-hand text-ink text-2xl leading-none">{i + 1}</span>
                <div>
                  <p className="font-display text-xl leading-snug">{title}</p>
                  <p className="mt-2 text-pretty text-muted-foreground">{body}</p>
                </div>
              </li>
            ))}
          </ol>
        </InkBand>
      </div>
      <div className="h-16 md:h-24" />
    </>
  )
}

// ─── Specimen pieces ─────────────────────────────────────────────────────────

/**
 * An ink, with its note: the variable, its live value, its one job and its
 * tempting misuse. The note rides over the swatch on hover or focus, so the
 * row of colours reads as colours first.
 */
function SwatchCard({ swatch, tall }: { swatch: Swatch; tall?: boolean }) {
  return (
    <li>
      <Annotated
        id={`ink-${swatch.token}`}
        name={swatch.name}
        token={swatch.token}
        value={<TokenValue name={swatch.token} />}
        rule={swatch.role}
        dont={swatch.dont}
        stageClassName="border-0"
      >
        <span
          className={cn(
            'relative block overflow-hidden rounded-lg border border-border',
            tall ? 'h-44' : 'h-36',
            swatch.fill,
          )}
        >
          {/* A band of the same ink at halftone, the way it prints at low coverage. */}
          {tall && (
            <span
              aria-hidden
              className="halftone absolute inset-x-0 bottom-0 h-1/3 bg-background"
              style={{ color: `var(${swatch.token})` }}
            />
          )}
        </span>
      </Annotated>
    </li>
  )
}

function TypeRow({
  face,
  token,
  note,
  children,
}: {
  face: string
  token: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="grid gap-4 py-8 md:grid-cols-[14rem_1fr] md:gap-10">
      <div>
        <p className="text-sm font-medium">{face}</p>
        <p className="mt-1 font-mono text-[11px] text-muted-foreground">{token}</p>
        <p className="mt-3 text-xs text-pretty text-muted-foreground">{note}</p>
      </div>
      <div className="min-w-0 self-center">{children}</div>
    </div>
  )
}

function PaperSpecimen({
  name,
  note,
  children,
}: {
  name: string
  note: string
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col">
      <div className="grid h-40 place-items-center">{children}</div>
      <p className="mt-4 font-mono text-xs text-foreground">{name}</p>
      <p className="mt-1 text-sm text-pretty text-muted-foreground">{note}</p>
    </div>
  )
}

function ComponentSpecimen({
  name,
  note,
  children,
  className,
}: {
  name: string
  note: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn('border-t border-border pt-5', className)}>
      <p className="font-mono text-xs text-foreground">{name}</p>
      <p className="mt-1 max-w-prose text-sm text-pretty text-muted-foreground">{note}</p>
      <div className="mt-6">{children}</div>
    </div>
  )
}

/** A page in miniature: hairlines, with one or two ink bands across it. */
function MiniPage({ bands }: { bands: 1 | 2 }) {
  const band = <span className="ink-wash -mx-4 block h-5 w-[calc(100%+2rem)]" />
  return (
    <span
      aria-hidden
      className="flex w-40 flex-col gap-2 rounded-sm border border-border bg-background px-4 py-3"
    >
      <span className="h-2 w-2/3 rounded-full bg-foreground/70" />
      <span className="h-px w-full bg-border" />
      <span className="h-1.5 w-full rounded-full bg-muted-foreground/30" />
      {band}
      <span className="h-1.5 w-5/6 rounded-full bg-muted-foreground/30" />
      <span className="h-px w-full bg-border" />
      {bands === 2 ? band : <span className="h-1.5 w-3/4 rounded-full bg-muted-foreground/30" />}
      <span className="h-1.5 w-2/3 rounded-full bg-muted-foreground/30" />
    </span>
  )
}

function LogoRule({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="font-display text-xl">{title}</p>
      <p className="mt-2 text-sm text-pretty text-muted-foreground">{children}</p>
    </div>
  )
}
