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
 * Wavy underline; runs the full width of its container.
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
      'ink-squiggle h-2.5 w-full text-ink',
      hover ? 'ink-squiggle-hover' : 'ink-squiggle-draw',
      className,
    )}
  />
)

/** A squiggle positioned as an underline under the text of a `group`. */
export const SquiggleUnderline = ({ className }: { className?: string }) => (
  <Squiggle hover className={cn('pointer-events-none absolute -bottom-1.5 left-0 w-full', className)} />
)

/** Loop around a word: absolutely positioned over the text it circles. */
export const CircleMark = ({ className }: { className?: string }) => (
  <svg
    aria-hidden
    viewBox="0 0 220 84"
    preserveAspectRatio="none"
    className={cn(
      // Drawn wide of the word: a circle that clips the letters reads as a
      // strike-through rather than an emphasis.
      'pointer-events-none absolute -inset-x-8 -inset-y-4 h-[calc(100%+2rem)] w-[calc(100%+4rem)] text-ink',
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
  <svg aria-hidden viewBox="0 0 120 64" className={cn('h-10 w-20 text-ink', className)}>
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
      className={cn('hidden items-end gap-1 text-ink select-none sm:inline-flex', className)}
    >
      {points === 'left' && arrow}
      <span className="font-hand text-xl leading-tight">{children}</span>
      {points === 'right' && arrow}
    </span>
  )
}

/** Hand-drawn asterisk: marks recognition, next to an Award. */
export const AsteriskMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 24 24" className={cn('size-3.5 text-ink', className)}>
    <g {...strokeProps} strokeWidth={2.4} className="ink-draw" style={{ ['--ink-len' as string]: 70 }}>
      <path d="M12 3.5v17" />
      <path d="M4.6 7.2l14.8 9.6" />
      <path d="M19.4 7.2L4.6 16.8" />
    </g>
  </svg>
)

/** Short rule with a hand's wobble, for section labels. */
export const TickMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 40 8" className={cn('h-2 w-8 shrink-0 text-ink', className)}>
    <path
      {...strokeProps}
      strokeWidth={2.5}
      className="ink-draw"
      style={{ ['--ink-len' as string]: 44 }}
      d="M2 5c7-3 14 2 21-1s10 1 15 0"
    />
  </svg>
)

/** Printer's crop marks, for the top corners of a page header. */
export const CropMarks = ({ className }: { className?: string }) => (
  <div aria-hidden className={cn('pointer-events-none absolute inset-x-0 top-0 text-ink/45', className)}>
    <svg viewBox="0 0 20 20" className="absolute -top-2 -left-5 size-4">
      <g {...strokeProps} strokeWidth={1.5}>
        <path d="M0 14h14M14 20V6" />
      </g>
    </svg>
    <svg viewBox="0 0 20 20" className="absolute -top-2 -right-5 size-4">
      <g {...strokeProps} strokeWidth={1.5}>
        <path d="M20 14H6M6 20V6" />
      </g>
    </svg>
  </div>
)

/** Registration target, the mark a press uses to line up its inks. */
export const RegistrationMark = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 32 32" className={cn('size-7 text-ink', className)}>
    <g {...strokeProps} strokeWidth={1.4}>
      <circle cx="16" cy="16" r="9" />
      <circle cx="16" cy="16" r="3.2" />
      <path d="M16 1v9M16 22v9M1 16h9M22 16h9" />
    </g>
  </svg>
)

/**
 * A rubber stamp: the Lab's name set around a ring, drawn by hand. The text is
 * decoration — the same words are in the footer as real text.
 */
export const StampRing = ({
  text = 'DESIGN INCLUSION AND ACCESS LAB · NORTH SOUTH UNIVERSITY · DHAKA · ',
  className,
}: {
  text?: string
  className?: string
}) => (
  <svg aria-hidden viewBox="0 0 160 160" className={cn('size-32 text-ink/70', className)}>
    <defs>
      <path id="stamp-ring-path" d="M80 80m-58 0a58 58 0 1 1 116 0a58 58 0 1 1 -116 0" fill="none" />
    </defs>
    <g {...strokeProps} strokeWidth={1.6}>
      <circle cx="80" cy="80" r="70" />
      <circle cx="80" cy="80" r="44" />
    </g>
    <text className="fill-current font-mono text-[9.5px] tracking-[0.18em] uppercase">
      <textPath href="#stamp-ring-path" startOffset="0">
        {text}
      </textPath>
    </text>
    <text
      x="80"
      y="86"
      textAnchor="middle"
      className="fill-current font-display text-[26px] tracking-tight"
    >
      DIAL
    </text>
  </svg>
)

/** Dashed connector, drawn between steps in a sequence. */
export const DashedPath = ({ className }: { className?: string }) => (
  <svg aria-hidden viewBox="0 0 120 12" preserveAspectRatio="none" className={cn('h-3 w-full text-ink/55', className)}>
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
  <svg aria-hidden viewBox="0 0 120 90" className={cn('h-24 w-32 text-ink/70', className)}>
    <g {...strokeProps} strokeWidth={2}>
      <path
        className="ink-draw"
        style={{ ['--ink-len' as string]: 320 }}
        d="M28 14c22-3 44-3 66 1 3 18 3 40-1 60-22 3-44 3-64-1-3-20-3-41-1-60z"
      />
      <path className="ink-draw" style={{ ['--ink-len' as string]: 120 }} d="M42 38c12-2 24-2 36 1" />
      <path className="ink-draw" style={{ ['--ink-len' as string]: 90 }} d="M42 52c8-1 16-1 24 1" />
    </g>
  </svg>
)

/** Soft halftone wash, for the empty side of a page header. */
export const HalftoneWash = ({ className }: { className?: string }) => (
  <div
    aria-hidden
    className={cn(
      'halftone pointer-events-none absolute text-ink/30',
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
}

export const FactMark = ({ label, className }: { label: string; className?: string }) => {
  const paths = FACT_MARKS[label]
  if (!paths) return null
  return (
    <svg aria-hidden viewBox="0 0 32 32" className={cn('size-6 text-ink', className)}>
      <g {...strokeProps} strokeWidth={1.7}>
        {paths.map((d) => (
          <path key={d} d={d} />
        ))}
      </g>
    </svg>
  )
}
