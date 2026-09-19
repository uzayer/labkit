import { CropMarks, FactMark, Squiggle } from '@/components/marks'
import { RisoArt, type RisoVariant } from '@/components/riso'
import { enterStep } from '@/lib/motion'
import { label, lede, pageTitle } from '@/lib/typography'
import { cn } from '@/lib/utils'

export interface PageFact {
  value: string
  label: string
}

interface PageHeaderProps {
  /** Small label above the title, e.g. the section of the site. */
  eyebrow?: string
  /** A node, so a word can be circled or otherwise marked. */
  title: React.ReactNode
  description?: string
  /** Derived counts. Keep to two or three; they sit beside the description. */
  facts?: PageFact[]
  children?: React.ReactNode
  /**
   * Stagger the header in on mount (eyebrow, title, rule, lede, facts). Off
   * where something else already stages the arrival, like Home's scroll band.
   */
  animateIn?: boolean
  /** Which printed composition sits in the header's open margin. */
  art?: RisoVariant
  /**
   * Run the composition off the right edge of the sheet instead of tucking it
   * into the margin. It is trimmed where the crop marks say the sheet ends,
   * which is what crop marks are for.
   */
  bleed?: boolean
  /**
   * The ink this header prints in, as a CSS value (`var(--ink-violet)`). Sets
   * `--header-ink`, which the marks, the rule and any wash read from.
   */
  ink?: string
  /** A large drawn mark set against the title — a Research Theme's glyph. */
  glyph?: React.ReactNode
  className?: string
}

/**
 * The header for directory and detail pages. It shares the page's left edge
 * (the plain `container`), so the title lines up with the list under it.
 */
const PageHeader = ({
  eyebrow,
  title,
  description,
  facts,
  children,
  animateIn = true,
  art,
  bleed = true,
  ink,
  glyph,
  className,
}: PageHeaderProps) => {
  // Each piece takes the next step of the 60ms stagger.
  const step = (i: number) => (animateIn ? { className: 'enter', style: enterStep(i) } : {})
  const rule = animateIn ? { className: 'enter-rule', style: enterStep(2) } : {}

  return (
    <header
      style={ink ? ({ '--header-ink': ink } as React.CSSProperties) : undefined}
      className={cn('relative isolate container pt-20 pb-16 md:pt-32 md:pb-24', className)}
    >
      {/* Printer's marks and a halftone wash: the page as a printed sheet. */}
      <CropMarks className="ink-mark-soft top-8 md:top-14" />
      {art && (
        // Clipped on the horizontal only: `overflow-x: clip` beside an explicit
        // `overflow-y: visible` is honoured as written, so the composition is
        // trimmed at the sheet's edge without gaining a hard top or bottom cut.
        // The trim sits at `-right-5`, exactly where CropMarks puts the corner
        // marks, so the cut reads as the trim it is rather than as a clipped div.
        <div
          aria-hidden
          className="pointer-events-none absolute inset-y-0 -right-5 -z-10 w-[26rem] overflow-x-clip overflow-y-visible max-lg:hidden xl:w-[32rem]"
        >
          <RisoArt
            variant={art}
            className={cn(
              'absolute opacity-90',
              bleed
                ? '-top-10 -right-32 size-[34rem] xl:-right-36 xl:size-[40rem]'
                : 'top-0 right-0 size-64 xl:size-72',
            )}
          />
        </div>
      )}
      {eyebrow && (
        <p {...step(0)} className={cn(label, step(0).className)}>
          {eyebrow}
        </p>
      )}
      {/* The glyph is set at plate size above the title rather than inline with
          it: at icon size it reads as decoration on a heading, at this size it
          is the page's own mark. */}
      {glyph && (
        <div {...step(1)} className={cn('relative mt-6 w-fit', step(1).className)}>
          {glyph}
        </div>
      )}
      <div
        {...step(1)}
        className={cn('relative w-fit', (eyebrow || glyph) && 'mt-4', step(1).className)}
      >
        <h1 className={pageTitle}>{title}</h1>
        {/* Drawn under the title, as wide as the last line rather than the page. */}
        <Squiggle className="ink-mark mt-1 max-w-md" />
      </div>

      {(description || facts?.length) && (
        <div className="relative mt-10 grid gap-8 pt-6 md:grid-cols-[1fr_auto] md:items-start md:gap-20 lg:gap-28">
          <span
            aria-hidden
            {...rule}
            className={cn('ink-rule absolute inset-x-0 top-0 h-px', rule.className)}
          />
          {description ? (
            <p {...step(3)} className={cn(lede, step(3).className)}>
              {description}
            </p>
          ) : (
            <span />
          )}
          {facts && facts.length > 0 && (
            // Each figure gets a drawn mark above it and room around it: the
            // numbers sit clear of the printed composition rather than in it.
            <dl
              {...step(4)}
              className={cn('relative z-10 flex flex-wrap gap-x-12 gap-y-8', step(4).className)}
            >
              {facts.map((fact) => (
                <div key={fact.label} className="flex flex-col gap-2.5">
                  <FactMark label={fact.label} className="ink-mark size-7" />
                  <dd className="font-display text-4xl leading-none tabular-nums">{fact.value}</dd>
                  <dt className="text-sm text-muted-foreground">{fact.label}</dt>
                </div>
              ))}
            </dl>
          )}
        </div>
      )}

      {children && <div {...step(5)}>{children}</div>}
    </header>
  )
}

export { PageHeader }
