import type { ReactNode } from 'react'

import { cn } from '@/lib/utils'

/**
 * Hand-drawn marks, in the second riso ink. They are decoration: always
 * `aria-hidden`, never carrying meaning on their own. Each stroke draws itself
 * when its section reveals (the `.ink-draw` class in globals.css), and sits
 * already drawn when motion is reduced.
 *
 * Strokes are deliberately uneven — a wobbly line reads as drawn, a perfect
 * one reads as a border.
 */

const strokeProps = {
  fill: 'none',
  stroke: 'currentColor',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

/**
 * Tape holding a photograph down at two opposite corners, top-left and
 * bottom-right, as in a notebook. Place it inside the photo's `relative`
 * parent — usually as `OptionalImage`'s `overlay`, so a photo that fails to
 * load takes its tape with it.
 */
export const Tape = () => (
  <>
    <span aria-hidden className="tape tape-tl" />
    <span aria-hidden className="tape tape-br" />
  </>
)

/**
 * Wavy underline; runs the full width of its container. It is the site's
 * link-hover mark — it means "this goes somewhere" — so it is never drawn
 * permanently under a heading.
 *
 * Not one path stretched to fit but a single wave tiled at a fixed size (see
 * `.ink-squiggle`), so the wavelength is the same under two words as under a
 * headline. Stretching made short links come out as a compressed zigzag.
 *
 * `hover`: sits undrawn until the nearest `group` is hovered or focused, which
 * makes it the site's hover state for links and row titles — a pen stroke
 * under the words rather than a border.
 */
export const Squiggle = ({ className, hover }: { className?: string; hover?: boolean }) => (
  <span
    aria-hidden
    className={cn(
      'ink-squiggle text-ink h-2.5 w-full',
      hover ? 'ink-squiggle-hover' : 'ink-squiggle-draw',
      className,
    )}
  />
)

/** A squiggle positioned as an underline under the text of a `group`. */
export const SquiggleUnderline = ({ className }: { className?: string }) => (
  <Squiggle
    hover
    className={cn('pointer-events-none absolute -bottom-1.5 left-0 w-full', className)}
  />
)

/**
 * Text with the hover squiggle drawn under every line it wraps to, each exactly
 * as wide as that line's words. Use it instead of `SquiggleUnderline` wherever
 * the text can break: the block version underlines the box, which for wrapped
 * text is the widest row, under the last row only.
 *
 * Renders the text twice — once real, once as an `aria-hidden`, transparent
 * copy that carries the stroke (see `.ink-squiggle-text`). The copy sits in an
 * absolutely-positioned box the same width as the real text, so it wraps at the
 * same places. That is why it is a block: an inline box has no width of its own
 * to copy.
 */
export const SquiggleText = ({
  children,
  className,
  highlight,
  arrow,
}: {
  children: string
  className?: string
  /** Search term to mark inside the text. Marked only in the visible copy. */
  highlight?: string
  /** Ends the text with a `PencilArrow`, held to the last word. */
  arrow?: boolean
}) => (
  <span className={cn('relative block', !arrow && 'w-fit', className)}>
    {highlight ? <MarkedText text={children} term={highlight} /> : children}
    {/* A no-break space glues the arrow to the last word, so it wraps with the
        words instead of hanging alone at the edge. */}
    {arrow && (
      <>
        {'\u00A0'}
        <PencilArrow className="inline-block h-[0.45em] w-[0.9em] align-middle text-[var(--squiggle-ink,var(--ink))]" />
      </>
    )}
    {/* The stroke copy keeps the bare string: it only has to wrap identically,
        and a <mark> in here would be stroked as well as marked. With an arrow,
        a blank box its width stands in for it, so the stroke stops at the
        words. `--squiggle-ink` re-inks the stroke, for a Theme's own ink. */}
    <span
      aria-hidden
      className="pointer-events-none absolute inset-0 text-[var(--squiggle-ink,var(--ink))]"
    >
      <span className="ink-squiggle-text">{children}</span>
      {arrow && (
        <>
          {'\u00A0'}
          <span className="inline-block w-[0.9em]" />
        </>
      )}
    </span>
  </span>
)

/**
 * A pen-drawn arrow: wobbly shaft, uneven head. The hand-drawn counterpart of
 * the Lucide arrow, for links that sit among the other marks. Nudges forward
 * when its `group` is hovered.
 */
export const PencilArrow = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 40 18"
    className={cn(
      'ease-snappy h-3.5 w-8 shrink-0 transition-transform duration-200 group-hover:translate-x-1',
      className,
    )}
    {...strokeProps}
    strokeWidth={1.8}
  >
    <path d="M2 10c7-1.5 15-.5 22-1.2s7-.6 11-.8" />
    <path d="M27 3c2.5 2 5.5 4.2 8.5 6-3 1.6-6 4-8.2 6.4" />
  </svg>
)

/**
 * Wraps every occurrence of `term` in a <mark>. The mark changes colour only —
 * no weight, size or family — because the stroke copy above is laid out from
 * the unmarked string and the two have to wrap on the same words.
 */
function MarkedText({ text, term }: { text: string; term: string }) {
  const needle = term.trim().toLowerCase()
  if (!needle) return <>{text}</>

  const parts: ReactNode[] = []
  const haystack = text.toLowerCase()
  let at = 0

  for (let found = haystack.indexOf(needle); found !== -1; found = haystack.indexOf(needle, at)) {
    if (found > at) parts.push(text.slice(at, found))
    parts.push(
      <mark key={found} className="bg-brand/20 rounded-[2px] text-inherit">
        {text.slice(found, found + needle.length)}
      </mark>,
    )
    at = found + needle.length
  }
  parts.push(text.slice(at))

  return <>{parts}</>
}

/** Loop around a word: absolutely positioned over the text it circles. */
export const CircleMark = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 220 84"
    preserveAspectRatio="none"
    className={cn(
      // Drawn wide of the word: a circle that clips the letters reads as a
      // strike-through rather than an emphasis.
      'text-ink pointer-events-none absolute -inset-x-8 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+4rem)]',
      className,
    )}
  >
    <path
      {...strokeProps}
      strokeWidth={3}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 620 }}
      d="M168 12C139 3 74 1 41 15 8 29 3 55 22 68c19 13 78 16 122 8 40-7 66-23 62-38-3-12-22-22-45-27"
    />
  </svg>
)

/** Curved arrow, pointing down-right by default. */
export const ArrowMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 120 64" className={cn('text-ink h-10 w-20', className)}>
    <path
      {...strokeProps}
      strokeWidth={3}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 150 }}
      d="M6 8c22 2 52 12 75 32l14 12"
    />
    <path
      {...strokeProps}
      strokeWidth={3}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 70 }}
      d="M78 50l19 4 2-19"
    />
  </svg>
)

/**
 * A note in the margin, in the hand: a curved arrow pointing back at the thing
 * it comments on, and a few words beside it.
 *
 * Decoration, always `aria-hidden` — the note never carries information the
 * page does not already state in real text. Use it sparingly: three or four
 * across the whole site keeps it a voice rather than a tic, and it is hidden
 * below `sm` because there is no margin to write in on a phone.
 */
export const MarginNote = ({
  children,
  points = 'left',
  className,
}: {
  children: React.ReactNode
  /**
   * Which way the arrow points back at whatever the note is about. `left` puts
   * the note to the right of its subject, `right` to the left of it.
   */
  points?: 'left' | 'right'
  className?: string
}) => {
  const arrow = (
    <ArrowMark className={cn('h-8 w-14 shrink-0', points === 'left' && '-scale-x-100')} />
  )
  return (
    <span
      aria-hidden
      className={cn('text-ink hidden items-end gap-1 select-none sm:inline-flex', className)}
    >
      {points === 'left' && arrow}
      <span className="font-hand text-xl leading-tight">{children}</span>
      {points === 'right' && arrow}
    </span>
  )
}

/**
 * Hand-drawn asterisk: a footnote beside something, e.g. a field note's
 * bullet. An Award itself takes the `RosetteMark`.
 */
export const AsteriskMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={cn('text-ink size-3.5', className)}>
    <g
      {...strokeProps}
      strokeWidth={2.4}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 70 }}
    >
      <path d="M12 3.5v17" />
      <path d="M4.6 7.2l14.8 9.6" />
      <path d="M19.4 7.2L4.6 16.8" />
    </g>
  </svg>
)

/**
 * A drawn rosette — a disc with two ribbons — for an Award itself: the award
 * lists, the navbar's awarded work, a prize on a publication row. Where the
 * asterisk is a footnote beside something, this is the thing being given.
 */
export const RosetteMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 32 32" className={cn('text-ink size-5', className)}>
    <g {...strokeProps} strokeWidth={1.8}>
      <path d="M16 3.5a7.5 7.5 0 1 1 0 15 7.5 7.5 0 0 1 0-15z" />
      <path d="M16 7.5a3.5 3.5 0 1 1 0 7 3.5 3.5 0 0 1 0-7z" opacity={0.6} />
      <path d="M11 17.5l-3 10.5 7.5-3.8 1.2.1" />
      <path d="M21 17.5l3 10.5-7.3-3.7" />
    </g>
  </svg>
)

/** Short rule with a hand's wobble, for section labels. */
export const TickMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 40 8" className={cn('text-ink h-2 w-8 shrink-0', className)}>
    <path
      {...strokeProps}
      strokeWidth={2.5}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 44 }}
      d="M2 5c7-3 14 2 21-1s10 1 15 0"
    />
  </svg>
)

/**
 * Printer's crop marks, for the top corners of a page header.
 *
 * They sit just outside the sheet, in the container's gutter. On a phone the
 * container is the full width of the screen, so "outside" is off the screen:
 * there they tuck inside the gutter instead, or the right mark pushed every
 * page sideways into a horizontal scroll.
 */
export const CropMarks = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn('text-ink/45 pointer-events-none absolute inset-x-0 top-0', className)}
  >
    <svg viewBox="0 0 20 20" className="absolute -top-2 left-1 size-4 sm:-left-5">
      <g {...strokeProps} strokeWidth={1.5}>
        <path d="M0 14h14M14 20V6" />
      </g>
    </svg>
    <svg viewBox="0 0 20 20" className="absolute -top-2 right-1 size-4 sm:-right-5">
      <g {...strokeProps} strokeWidth={1.5}>
        <path d="M20 14H6M6 20V6" />
      </g>
    </svg>
  </div>
)

/** Registration target, the mark a press uses to line up its inks. */
export const RegistrationMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 32 32" className={cn('text-ink size-7', className)}>
    <g {...strokeProps} strokeWidth={1.4}>
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="3.2" />
      <path d="M16 1v9M16 22v9M1 16h9M22 16h9" />
    </g>
  </svg>
)

/** Dashed connector, drawn between steps in a sequence. */
export const DashedPath = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 120 12"
    preserveAspectRatio="none"
    className={cn('text-ink/55 h-3 w-full', className)}
  >
    <path
      {...strokeProps}
      strokeWidth={2}
      strokeDasharray="1 7"
      d="M2 7c20-5 38 3 58-1s38-4 58 1"
    />
  </svg>
)

/** Shown where a filter or search has emptied a list: a swept-out page. */
export const EmptySketch = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 120 90" className={cn('text-ink/70 h-24 w-32', className)}>
    <g {...strokeProps} strokeWidth={2}>
      <path
        className="ink-draw"
        style={{ ['--ink-len' as string]: 320 }}
        d="M28 14c22-3 44-3 66 1 3 18 3 40-1 60-22 3-44 3-64-1-3-20-3-41-1-60z"
      />
      <path
        className="ink-draw"
        style={{ ['--ink-len' as string]: 120 }}
        d="M42 38c12-2 24-2 36 1"
      />
      <path className="ink-draw" style={{ ['--ink-len' as string]: 90 }} d="M42 52c8-1 16-1 24 1" />
    </g>
  </svg>
)

/** Soft halftone wash, for the empty side of a page header. */
export const HalftoneWash = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'halftone text-ink/30 pointer-events-none absolute',
      // Both spellings: the unprefixed property is not honoured everywhere yet,
      // and without the mask this reads as a grey rectangle.
      '[mask-image:radial-gradient(closest-side,black,transparent)]',
      '[-webkit-mask-image:radial-gradient(closest-side,black,transparent)]',
      className,
    )}
  />
)

/**
 * Small drawn marks for a page header's figures, so a number has a picture
 * beside it rather than standing alone as text. Keyed by the figure's label.
 */
const FACT_MARKS: Record<string, string[]> = {
  // A short stack of papers.
  Publications: ['M5 20h22M7 15h18M9 10h14', 'M11 5h10'],
  // A rosette: a disc with two ribbons.
  Awards: ['M16 4a7 7 0 1 1 0 14 7 7 0 0 1 0-14z', 'M11 17l-3 11 8-4 8 4-3-11'],
  // A month, with one day ringed.
  'Years of research': ['M4 7h24v20H4zM4 13h24', 'M10 4v5M22 4v5', 'M13 18h6'],
  Projects: ['M4 9h10l2 3h12v14H4z'],
  People: ['M6 26c0-5 4-8 10-8s10 3 10 8', 'M16 5a5 5 0 1 1 0 10 5 5 0 0 1 0-10z'],
  // A pennant planted on a pole.
  Founded: ['M8 28V5', 'M8 6h16l-4 5 4 5H8'],
  // A clock face, for "since" and "active since".
  Since: ['M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24z', 'M16 10v6l4 3'],
  // A mortarboard.
  'Alumni placed': ['M16 6L3 12l13 6 13-6z', 'M8 15v6c0 2 4 4 8 4s8-2 8-4v-6', 'M29 12v8'],
  // A circling arrow: still going.
  Ongoing: ['M26 16a10 10 0 1 1-3-7', 'M24 4v6h-6'],
  // A coin with a stroke through it.
  Grants: [
    'M16 4a12 12 0 1 1 0 24 12 12 0 0 1 0-24z',
    'M16 9v14',
    'M20 12c-1-1.5-7-2-7 1.5s7 2.5 7 6-6 3-7 1.5',
  ],
}

// Labels that read as one of the marks above.
const FACT_MARK_ALIASES: Record<string, string> = {
  Years: 'Years of research',
  'Best paper': 'Awards',
  'Researchers mentored': 'People',
  'Ongoing projects': 'Projects',
  'Active since': 'Since',
}

export const FactMark = ({ label, className }: { label: string; className?: string }) => {
  const paths = FACT_MARKS[FACT_MARK_ALIASES[label] ?? label]
  if (!paths) return null
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn('text-ink size-6', className)}>
      <g {...strokeProps} strokeWidth={1.7}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}
