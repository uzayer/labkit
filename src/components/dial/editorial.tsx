import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { DashedPath, SquiggleText, SquiggleUnderline, TickMark } from '@/components/dial/marks'
import { ThemeGlyph, themeInk, themeInkVar } from '@/components/dial/theme-marks'
import { displaySectionTitle, label as labelClass } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

/**
 * Shared editorial sections. Every section on the site opens with a ruled
 * SectionHeader and sits on the plain `container`, so pages share one left
 * edge and one vertical rhythm.
 */

/**
 * The site's one section rhythm: 96px between sections on a phone, 128px on
 * a desktop, since two neighbours' padding meets. The first section under a
 * page header adds `pt-0 md:pt-0`; the header's own foot is the gap there.
 *
 * There used to be two rhythms (py-16/md:py-28 and py-12/md:py-16) plus
 * one-off paddings (pb-24, py-24, pb-16/md:pb-24) wherever a section was
 * written by hand. Mixed on one page, the gap between two headings came out as
 * 96, 128, 208 or 224px depending on which pair you were between, which read
 * as random rather than as rhythm.
 */
export const sectionSpacing = 'py-12 md:py-16'

// ─── Section header ──────────────────────────────────────────────────────────

interface SectionHeaderProps {
  label?: string
  title: string
  description?: string
  link?: { text: string; href: string }
  className?: string
  /** Heading level; sections under a page's h1 are h2. */
  as?: 'h2' | 'h3'
}

export const SectionHeader = ({
  label,
  title,
  description,
  link,
  className,
  as: Heading = 'h2',
}: SectionHeaderProps) => (
  // The rule draws itself and the text rises the first time the section
  // scrolls into view (RevealObserver + globals.css "Section reveal").
  <div data-reveal className={cn('relative pt-6', className)}>
    <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
    <div className="reveal-item flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div className="max-w-2xl">
        {label && (
          <p className={cn(labelClass, 'mb-3 flex items-center gap-2')}>
            <TickMark />
            {label}
          </p>
        )}
        <Heading className={cn(displaySectionTitle, 'text-balance')}>{title}</Heading>
        {description && (
          <p className="mt-4 max-w-prose text-pretty text-muted-foreground md:text-lg">
            {description}
          </p>
        )}
      </div>
      {link && <TextLink href={link.href}>{link.text}</TextLink>}
    </div>
  </div>
)

// ─── Text link ───────────────────────────────────────────────────────────────

/**
 * The site's one secondary-action style, after skiper-ui's Link003: the rule
 * sweeps out from the centre on hover and the arrow rises into place. External
 * links get the outward arrow, internal ones the forward arrow.
 */
export const TextLink = ({
  href,
  children,
  className,
  external,
}: {
  href: string
  children: React.ReactNode
  className?: string
  external?: boolean
}) => {
  const classes = cn(
    'group relative inline-flex w-fit shrink-0 items-center gap-1.5 text-sm text-foreground',
    className,
  )
  const content = (
    <>
      <span className="relative">
        {children}
        <SquiggleUnderline />
      </span>
      {external ? (
        <ArrowUpRight className="ease-snappy size-4 translate-y-0.5 opacity-60 transition-[transform,opacity] duration-200 group-hover:translate-y-0 group-hover:opacity-100" />
      ) : (
        <ArrowRight className="arrow-ne size-4" />
      )}
    </>
  )
  return external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {content}
    </a>
  ) : (
    <Link href={href} className={classes}>
      {content}
    </Link>
  )
}

// ─── Primary link ────────────────────────────────────────────────────────────

/** The one filled action per page (Apply, Send). Everything else is a TextLink. */
export const PrimaryLink = ({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) => {
  const classes = cn(
    'group inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background',
    'ease-snappy transition-transform duration-150 active:scale-[0.97]',
    className,
  )
  const content = (
    <>
      {children}
      <ArrowRight className="arrow-ne size-4" />
    </>
  )
  // Internal routes navigate client-side; mailto: and external URLs stay plain anchors.
  return href.startsWith('/') ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}

// ─── Research Theme index ────────────────────────────────────────────────────

export interface ThemeIndexEntry {
  slug: string
  title: string
  description?: string | null
  projectCount?: number
  publicationCount?: number
  /**
   * Project names filed under the Theme, as evidence of what the Lab actually
   * did there. Printed, not linked: the whole row is already one link.
   */
  examples?: string[]
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/**
 * Ruled, numbered list of Research Themes; the same row wherever themes are
 * listed.
 *
 * Hover is the site's two signals and nothing else: the glyph lifts and the
 * title takes the squiggle. The paper used to darken as well, which made three.
 * A phone keeps the glyph (it is how a Theme is recognised across the site) and
 * the arrow (it has no hover to tell it the row is a link), and drops only the
 * running number.
 */
export const ThemeIndex = ({
  themes,
  className,
}: {
  themes: ThemeIndexEntry[]
  className?: string
}) => (
  <ol className={cn('divide-y divide-border border-y border-border', className)}>
    {themes.map((theme, i) => {
      const counts = [
        theme.projectCount ? plural(theme.projectCount, 'project') : null,
        theme.publicationCount ? plural(theme.publicationCount, 'publication') : null,
      ].filter(Boolean)
      return (
        <li key={theme.slug}>
          <Link
            href={`/research/${theme.slug}`}
            className={cn(
              'group -mx-4 grid grid-cols-[2.75rem_1fr_auto] items-center gap-x-4 gap-y-1 rounded-lg px-4 py-5',
              'md:grid-cols-[6.5rem_minmax(0,19rem)_1fr_auto_1.25rem] md:gap-x-10 md:py-9',
              'ease-snappy transition-[scale,background-color] duration-150 active:scale-[0.99] active:bg-muted/60',
            )}
          >
            <span
              className={cn(
                'row-span-2 flex items-center gap-4 self-start font-mono text-xs tabular-nums md:row-span-1 md:self-center',
                themeInk(theme.slug),
              )}
            >
              <span className="opacity-70 max-md:hidden">{String(i + 1).padStart(2, '0')}</span>
              <span className="mark-lift shrink-0">
                <ThemeGlyph slug={theme.slug} className="size-11 md:size-14" />
              </span>
            </span>
            <SquiggleText className="font-display text-xl leading-snug md:text-2xl">
              {theme.title}
            </SquiggleText>
            <ArrowRight className="arrow-ne size-4 self-center text-muted-foreground group-hover:text-foreground md:hidden" />
            {(theme.description || theme.examples?.length) && (
              <span className="col-start-2 flex flex-col gap-1.5 text-sm text-pretty text-muted-foreground md:col-start-auto">
                {theme.description}
                {theme.examples && theme.examples.length > 0 && (
                  <span className="text-xs">
                    <span className="font-hand text-ink text-base">e.g.</span>{' '}
                    <span className="text-foreground/80">{theme.examples.join(', ')}</span>
                  </span>
                )}
              </span>
            )}
            <span className="col-start-2 text-sm whitespace-nowrap text-muted-foreground tabular-nums md:col-start-auto md:text-right">
              {counts.join(' · ')}
            </span>
            <ArrowRight className="arrow-ne hidden size-4 self-center text-muted-foreground group-hover:text-foreground md:block" />
          </Link>
        </li>
      )
    })}
  </ol>
)

// ─── Theme spotlight ─────────────────────────────────────────────────────────

/**
 * The Research section for a *landing* page, as opposed to `ThemeIndex`, which
 * is the directory.
 *
 * Nine equally-weighted rows is the right answer on `/research`, where the
 * visitor came to survey the taxonomy. On Home it is the wrong one twice over:
 * it costs about three phone screens before the rest of the page begins, and
 * nine items at identical weight communicate no priority at all — a lab that
 * lists nine areas without ranking them reads as a lab that does everything.
 *
 * So Home leads with three and lists the other six below them, each with its
 * glyph but no description or counts. Nothing is hidden: every theme is still
 * one click away, and the six are links, not a teaser. What changes is that
 * the section now makes a claim instead of presenting a table of contents.
 *
 * Every title ends in a pencil arrow in its Theme's ink. The squiggle is a
 * hover state and a phone has no hover, so without the arrow the six read as
 * plain coloured text there. The squiggle takes the same ink, so a blue title
 * is no longer underlined in red.
 */
export const ThemeSpotlight = ({
  lead,
  rest,
  className,
}: {
  /** The themes given a tile. Three fits the grid and the argument. */
  lead: ThemeIndexEntry[]
  /** Everything else, listed compactly under the tiles. */
  rest: ThemeIndexEntry[]
  className?: string
}) => (
  <div className={className}>
    {/* Hairlines in both directions, from the gap rather than from borders, so
        no cell doubles its neighbour's rule. */}
    <ol className="grid gap-px border-y border-border bg-border sm:grid-cols-3">
      {lead.map((theme) => {
        const counts = [
          theme.projectCount ? plural(theme.projectCount, 'project') : null,
          theme.publicationCount ? plural(theme.publicationCount, 'publication') : null,
        ].filter(Boolean)
        return (
          <li key={theme.slug} className="bg-background">
            <Link
              href={`/research/${theme.slug}`}
              style={themeLinkInk(theme.slug)}
              className={cn('group flex h-full flex-col gap-4 px-2 py-7 sm:px-6', themeLinkPress)}
            >
              <span className="mark-lift w-fit shrink-0">
                <ThemeGlyph slug={theme.slug} className="size-16" />
              </span>
              <SquiggleText arrow className="font-display text-2xl leading-snug text-balance">
                {theme.title}
              </SquiggleText>
              {theme.description && (
                <p className="text-sm text-pretty text-muted-foreground">{theme.description}</p>
              )}
              <span className="mt-auto pt-2 text-sm text-muted-foreground tabular-nums">
                {counts.join(' · ')}
              </span>
            </Link>
          </li>
        )
      })}
    </ol>

    {rest.length > 0 && (
      <div className="mt-12">
        <p className={cn(labelClass, 'mb-4')}>Also working on</p>
        <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-3">
          {rest.map((theme) => (
            <li key={theme.slug}>
              <Link
                href={`/research/${theme.slug}`}
                style={themeLinkInk(theme.slug)}
                className={cn('group -mx-2 flex items-center gap-4 px-2 py-3', themeLinkPress)}
              >
                <span className="mark-lift shrink-0">
                  <ThemeGlyph slug={theme.slug} className="size-10" />
                </span>
                <SquiggleText
                  arrow
                  className={cn('font-display min-w-0 text-xl leading-snug', themeInk(theme.slug))}
                >
                  {theme.title}
                </SquiggleText>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
)

/** Inks a Theme link's squiggle and arrow, and the wash it takes when pressed. */
const themeLinkInk = (slug: string) =>
  ({
    '--squiggle-ink': themeInkVar(slug),
    '--press-wash': `color-mix(in oklab, ${themeInkVar(slug)} 10%, transparent)`,
  }) as React.CSSProperties

/** Pressed, the link takes a wash of its Theme's ink and gives under the finger. */
const themeLinkPress =
  'transition-[scale,background-color] duration-150 ease-snappy active:scale-[0.98] active:bg-(--press-wash)'

// ─── Numbered steps ──────────────────────────────────────────────────────────

/** Three or four numbered columns under a hairline, for method/process copy. */
export const NumberedSteps = ({
  steps,
  className,
}: {
  steps: { title: string; body: string }[]
  className?: string
}) => (
  <ol className={cn('grid gap-10 md:grid-cols-3 md:gap-8', className)}>
    {steps.map((step, i) => (
      <li key={step.title} className="relative border-t border-border pt-5">
        {/* Hand-drawn thread from one step to the next. */}
        {i < steps.length - 1 && (
          <DashedPath className="absolute top-2.5 -right-8 hidden w-6 md:block" />
        )}
        <span className="font-hand text-ink text-2xl leading-none">{i + 1}</span>
        <h3 className="font-display mt-4 text-2xl leading-snug">{step.title}</h3>
        <p className="mt-3 text-pretty text-muted-foreground">{step.body}</p>
      </li>
    ))}
  </ol>
)

// ─── Ink band ────────────────────────────────────────────────────────────────

/**
 * The site's one full-bleed section: type on a field of ink instead of on
 * paper, edge to edge, with the halftone showing through it.
 *
 * At most one per page. It works precisely because everything around it is
 * hairlines and open paper — a second band on the same page would turn the
 * exception back into the rhythm. Pass `ink` to print it in a Research Theme's
 * colour; it is the second ink otherwise.
 */
export const InkBand = ({
  children,
  ink,
  className,
}: {
  children: React.ReactNode
  ink?: string
  className?: string
}) => (
  <section
    style={ink ? ({ '--header-ink': ink } as React.CSSProperties) : undefined}
    // No margin of its own: the sections either side already carry the site's
    // py-16/md:py-28 rhythm, and adding to it left a screen of dead paper.
    className={cn('ink-wash relative isolate overflow-hidden', className)}
  >
    <span aria-hidden className="ink-mark halftone absolute inset-0 opacity-[0.09]" />
    <span aria-hidden className="ink-rule absolute inset-x-0 top-0 h-px" />
    <span aria-hidden className="ink-rule absolute inset-x-0 bottom-0 h-px" />
    <div className="relative container py-20 md:py-28">{children}</div>
  </section>
)

// ─── Pull quote ──────────────────────────────────────────────────────────────

/**
 * A line lifted out of the surrounding copy, at a size nothing else on the page
 * reaches. It was previously set at `displaySectionTitle`'s size, which is to
 * say it was not lifted out of anything. It repeats something the page already
 * says rather than introducing a new claim.
 */
export const PullQuote = ({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) => (
  // Set on the page's left edge, not centred: the quote mark hangs into the
  // margin the way it would in print, and the one left edge the whole site is
  // built on survives its own loudest moment.
  <figure className={cn('relative max-w-4xl', className)}>
    <span
      aria-hidden
      className="ink-mark font-display pointer-events-none absolute -top-10 -left-6 text-[9rem] leading-none opacity-35 select-none md:-top-16 md:-left-10 md:text-[14rem]"
    >
      &ldquo;
    </span>
    <blockquote className="font-display relative text-4xl leading-[1.05] text-balance md:text-6xl">
      {children}
    </blockquote>
  </figure>
)

// ─── Plain-text name list ────────────────────────────────────────────────────

/**
 * Venues or collaborators as set type rather than logo strips: honest when no
 * approved logo files exist, and it reads as a citation, not an advert.
 */
export const NameLine = ({
  label,
  names,
  className,
}: {
  label: string
  names: string[]
  className?: string
}) =>
  names.length > 0 ? (
    <p className={cn('text-sm text-muted-foreground', className)}>
      <span className="mr-2">{label}</span>
      {names.map((name, i) => (
        <span key={name} className="text-foreground">
          {name}
          {i < names.length - 1 && <span className="mx-2 text-muted-foreground/60">·</span>}
        </span>
      ))}
    </p>
  ) : null
