import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { DashedPath, SquiggleUnderline, TickMark } from '@/components/marks'
import { ThemeGlyph, themeInk } from '@/components/theme-marks'
import { displaySectionTitle, label as labelClass } from '@/lib/typography'
import { cn } from '@/lib/utils'

/**
 * Shared editorial sections. Every section on the site opens with a ruled
 * SectionHeader and sits on the plain `container`, so pages share one left
 * edge and one vertical rhythm (py-16 md:py-28 per section).
 */

export const sectionSpacing = 'py-16 md:py-28'

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
          <p className="mt-4 max-w-prose text-pretty text-muted-foreground md:text-lg">{description}</p>
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
        <ArrowUpRight className="size-4 translate-y-0.5 opacity-60 transition-[transform,opacity] duration-200 ease-snappy group-hover:translate-y-0 group-hover:opacity-100" />
      ) : (
        <ArrowRight className="size-4 arrow-ne" />
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
    'transition-transform duration-150 ease-snappy active:scale-[0.97]',
    className,
  )
  const content = (
    <>
      {children}
      <ArrowRight className="size-4 arrow-ne" />
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
}

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

/** Ruled, numbered list of Research Themes; the same row wherever themes are listed. */
export const ThemeIndex = ({ themes, className }: { themes: ThemeIndexEntry[]; className?: string }) => (
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
              'group -mx-4 grid grid-cols-[2rem_1fr_auto] items-baseline gap-x-4 gap-y-1 rounded-lg px-4 py-5',
              'md:grid-cols-[6.5rem_minmax(0,19rem)_1fr_auto_1.25rem] md:items-center md:gap-x-10 md:py-9',
              'transition-colors duration-150 ease-snappy hover:bg-muted/50 active:bg-muted',
            )}
          >
            <span className={cn('flex items-center gap-4 font-mono text-xs tabular-nums', themeInk(theme.slug))}>
              <span className="opacity-70">{String(i + 1).padStart(2, '0')}</span>
              <ThemeGlyph slug={theme.slug} className="size-14 shrink-0 max-md:hidden" />
            </span>
            <span className="relative w-fit font-display text-xl leading-snug md:text-2xl">
              {theme.title}
              <SquiggleUnderline />
            </span>
            <ArrowRight className="size-4 self-center text-muted-foreground arrow-ne group-hover:text-foreground md:hidden" />
            {theme.description && (
              <span className="col-start-2 text-sm text-pretty text-muted-foreground md:col-start-auto">
                {theme.description}
              </span>
            )}
            <span className="col-start-2 text-sm whitespace-nowrap tabular-nums text-muted-foreground md:col-start-auto md:text-right">
              {counts.join(' · ')}
            </span>
            <ArrowRight className="hidden size-4 self-center text-muted-foreground arrow-ne group-hover:text-foreground md:block" />
          </Link>
        </li>
      )
    })}
  </ol>
)

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
        <span className="font-hand text-2xl leading-none text-ink">{i + 1}</span>
        <h3 className="mt-4 font-display text-2xl leading-snug">{step.title}</h3>
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
export const PullQuote = ({ children, className }: { children: React.ReactNode; className?: string }) => (
  // Set on the page's left edge, not centred: the quote mark hangs into the
  // margin the way it would in print, and the one left edge the whole site is
  // built on survives its own loudest moment.
  <figure className={cn('relative max-w-4xl', className)}>
    <span
      aria-hidden
      className="ink-mark pointer-events-none absolute -top-10 -left-6 font-display text-[9rem] leading-none opacity-35 select-none md:-top-16 md:-left-10 md:text-[14rem]"
    >
      &ldquo;
    </span>
    <blockquote className="relative font-display text-4xl leading-[1.05] text-balance md:text-6xl">
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

// ─── Segmented control ───────────────────────────────────────────────────────

/**
 * The site's one filter control: a pill group where the active option is
 * filled. Counts are optional. Stateless; the parent owns the value.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
}: {
  label: string
  options: { value: T; label: string; count?: number }[]
  value: T
  onChange: (value: T) => void
  className?: string
}) {
  return (
    <div
      role="radiogroup"
      aria-label={label}
      className={cn('flex w-fit max-w-full overflow-x-auto rounded-full border border-border p-0.5 text-sm [scrollbar-width:none]', className)}
    >
      {options.map((option) => (
        <button
          key={option.value}
          type="button"
          role="radio"
          aria-checked={value === option.value}
          onClick={() => onChange(option.value)}
          className={cn(
            'shrink-0 rounded-full px-3 py-1 whitespace-nowrap transition-colors duration-150 ease-snappy',
            value === option.value
              ? 'bg-foreground text-background'
              : 'text-muted-foreground hover:text-foreground',
          )}
        >
          {option.label}
          {option.count !== undefined && (
            <span className="ml-1.5 tabular-nums opacity-60">{option.count}</span>
          )}
        </button>
      ))}
    </div>
  )
}
