import { CropMarks, FactMark } from '@/components/dial/marks'
import { RisoArt, type RisoVariant } from '@/components/dial/riso'
import { enterStep } from '@/lib/dial/motion'
import { label, lede, pageTitle } from '@/lib/dial/typography'
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
  /** Derived counts. Keep to two or three; they sit under the description. */
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
        // The composition is trimmed on three sides at the sheet's edge: right
        // at `-right-5`, exactly where CropMarks puts the corner marks, and
        // bottom at the header's own edge. It used to run with
        // `overflow-y: visible`, to avoid a hard top or bottom cut — but this
        // header is `relative isolate`, so it paints in the positioned phase,
        // *above* the plain sections that follow it. A 40rem composition in a
        // header shorter than that did not bleed into the margin, it printed
        // over the next section's controls. The container carries a generous
        // overhang above the sheet so the top cut falls off-screen, and the
        // composition is anchored to the bottom edge, where the cut reads as
        // the trim it is.
        // Sized to the margin, not to the sheet. At 30–34rem it ran from the
        // lede to the window's edge, crowded the scrollbar, and outweighed the
        // title it sits beside; at 22–26rem it is a plate in the margin that
        // still bleeds past the crop mark.
        <div
          aria-hidden
          className="pointer-events-none absolute -top-32 -right-5 bottom-0 -z-10 w-[20rem] overflow-clip max-lg:hidden xl:w-[24rem]"
        >
          <RisoArt
            variant={art}
            className={cn(
              'absolute opacity-90',
              bleed
                ? '-right-16 bottom-4 size-[22rem] xl:-right-20 xl:size-[26rem]'
                : 'right-0 bottom-8 size-56 xl:size-64',
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
        {/* No drawn underline under a page title. The squiggle is the site's
            hover state — it means "this goes somewhere" — so a permanent one
            under a heading said the opposite of what it says everywhere else,
            and it could never match a title that wraps. */}
        <h1 className={pageTitle}>{title}</h1>
      </div>

      {(description || facts?.length) && (
        // Lede and figures both stack down the left measure. They used to sit
        // in a second column, which put the numbers inside the composition
        // bleeding through the right margin — a halftone field behind a figure
        // is the one thing on this page that cannot be allowed to be pretty.
        <div className="relative mt-10 flex flex-col gap-10 pt-6">
          <span
            aria-hidden
            {...rule}
            className={cn('ink-rule absolute inset-x-0 top-0 h-px', rule.className)}
          />
          {description && (
            <p {...step(3)} className={cn(lede, step(3).className)}>
              {description}
            </p>
          )}
          {facts && facts.length > 0 && (
            // A ruled ledger strip: hairlines above and below, one column per
            // figure. Capped short of the margin the art bleeds into. The
            // columns never wrap: a wrapped figure lost its rule and hung
            // indented under the first row. On a phone they share the width
            // equally and the type steps down to fit; from `sm` each column
            // takes its own width. A list rather than a <dl>: each figure carries
            // a caption row, and a <dl> group may hold only <dt> and <dd>. It
            // reads as "14 Years at NSU", value then label.
            <ul
              {...step(4)}
              style={{ ['--fact-cols' as string]: facts.length }}
              className={cn(
                'border-ink/40 relative z-10 grid w-full grid-cols-[repeat(var(--fact-cols),minmax(0,1fr))] border-y sm:w-fit sm:grid-cols-[repeat(var(--fact-cols),auto)] lg:max-w-2xl',
                step(4).className,
              )}
            >
              {facts.map((fact, i) => (
                <li
                  key={fact.label}
                  className={cn(
                    'flex min-w-0 flex-col gap-2 py-4 pr-3 sm:pr-8',
                    i > 0 && 'border-ink/25 border-l pl-3 sm:pl-6',
                  )}
                >
                  {/* Caption row: the figure number on the left, the mark stamped
                      on the right. The slot is held open when a label has no
                      mark, so the numerals below stay on one baseline. */}
                  <div className="flex h-5 items-center justify-between gap-2 sm:gap-6">
                    <span
                      aria-hidden
                      className="text-ink font-mono text-[10px] tracking-[0.12em] whitespace-nowrap uppercase sm:tracking-[0.2em]"
                    >
                      Fig. {String(i + 1).padStart(2, '0')}
                    </span>
                    <FactMark label={fact.label} className="ink-mark size-5 shrink-0" />
                  </div>
                  <span className="font-display text-4xl leading-none tabular-nums sm:text-5xl">
                    {fact.value}
                  </span>
                  {/* Lettered by hand, like a note in the margin of the plate. */}
                  <span className="font-hand text-ink pt-1 text-lg leading-tight text-balance sm:text-xl sm:leading-none">
                    {fact.label}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}

      {children && <div {...step(5)}>{children}</div>}
    </header>
  )
}

export { PageHeader }
