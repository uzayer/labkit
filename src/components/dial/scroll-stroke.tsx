import { cn } from '@/lib/utils'

/**
 * A drawn line that follows the scroll: the stroke draws itself as the section
 * it belongs to passes through the viewport, after skiper-ui's Skiper19.
 *
 * Decoration in the margin, not content — it never holds text and never moves
 * anything. With reduced motion the line is simply drawn in full.
 *
 * The draw is a CSS view-timeline animation (`.scroll-stroke` in globals.css),
 * so this ships no JavaScript. Browsers without scroll timelines (Firefox
 * stable, as of late 2026) draw the line in full, as reduced motion does: a
 * script fallback would have to read this element's position on every scroll
 * frame, which costs more than a decoration is worth.
 */
const PATHS = {
  /** A line wandering down the page, as if tracing a route. */
  meander: 'M60 4C24 64 96 96 62 158S18 268 66 320s34 118-6 170 12 106 44 150',
  /** A long looping bracket, for a section that holds a single idea. */
  loop: 'M92 6C34 26 10 96 44 140s82 34 74 96-84 60-96 132 44 116 66 172',
} as const

export function ScrollStroke({
  variant = 'meander',
  className,
}: {
  variant?: keyof typeof PATHS
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={cn('scroll-stroke pointer-events-none absolute inset-y-0', className)}
    >
      <svg viewBox="0 0 120 640" preserveAspectRatio="none" className="text-ink/50 h-full w-full">
        <path
          d={PATHS[variant]}
          // A unit length, so the dash keyframes are fractions of the line.
          pathLength={1}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
        />
      </svg>
    </div>
  )
}
