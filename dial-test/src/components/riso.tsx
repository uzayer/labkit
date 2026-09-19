import { cn } from '@/lib/utils'

/**
 * Large abstract compositions in the two inks: overlapping shapes, halftone
 * fills, contour lines and loose strokes, the way a riso print layers one ink
 * over another slightly out of register.
 *
 * They are deliberately abstract. DIAL's work is with real communities, and an
 * illustrated scene of people would be inventing imagery of them; shapes and
 * marks carry the texture without claiming to depict anyone.
 *
 * Each variant is a fixed drawing rather than a random one, so a page looks
 * the same on every visit.
 */

type Variant = 'orbit' | 'strata' | 'signal' | 'field' | 'bloom'

const stroke = {
  fill: 'none',
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

function Halftone({ id, size = 7 }: { id: string; size?: number }) {
  return (
    <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
      <circle cx={size / 2} cy={size / 2} r={size / 5} fill="currentColor" />
    </pattern>
  )
}

/** Concentric rings crossed by an off-register disc: reach and overlap. */
const Orbit = ({ id }: { id: string }) => (
  <>
    <g className="text-ink-yellow">
      <Halftone id={`${id}-dots`} />
      <circle cx="96" cy="104" r="62" fill={`url(#${id}-dots)`} opacity={0.75} />
    </g>
    <g className="text-brand">
      <circle cx="150" cy="58" r="26" fill="currentColor" opacity={0.35} />
    </g>
    <g {...stroke} className="text-ink" stroke="currentColor" strokeWidth={2}>
      <circle cx="120" cy="92" r="70" />
      <circle cx="120" cy="92" r="44" opacity={0.75} />
      <circle cx="120" cy="92" r="18" opacity={0.5} />
      <path d="M28 150c44 22 104 20 152-8" opacity={0.8} />
    </g>
  </>
)

/** Stacked contour lines, like a hand-drawn elevation map. */
const Strata = ({ id }: { id: string }) => (
  <>
    <g className="text-ink-blue">
      <Halftone id={`${id}-dots`} size={6} />
      <path
        d="M20 120c30-26 62-28 92-8s58 18 76-10v74H20z"
        fill={`url(#${id}-dots)`}
        opacity={0.6}
      />
    </g>
    <g {...stroke} className="text-ink" stroke="currentColor" strokeWidth={2}>
      <path d="M16 58c34-22 68-20 100 4s62 26 72 2" />
      <path d="M16 84c34-22 68-20 100 4s62 26 72 2" opacity={0.85} />
      <path d="M16 110c34-22 68-20 100 4s62 26 72 2" opacity={0.7} />
      <path d="M16 136c34-22 68-20 100 4s62 26 72 2" opacity={0.55} />
      <path d="M16 162c34-22 68-20 100 4s62 26 72 2" opacity={0.4} />
      <path d="M16 32c34-22 68-20 100 4s62 26 72 2" className="text-ink-yellow" />
    </g>
  </>
)

/** Arcs radiating from a low point: a signal leaving somewhere small. */
const Signal = ({ id }: { id: string }) => (
  <>
    <g className="text-brand">
      <Halftone id={`${id}-dots`} />
      <path d="M96 176a80 80 0 0 1 80-80v80z" fill={`url(#${id}-dots)`} opacity={0.65} />
    </g>
    <g className="text-ink-violet">
      <circle cx="158" cy="48" r="20" fill="currentColor" opacity={0.3} />
    </g>
    <g {...stroke} className="text-ink" stroke="currentColor" strokeWidth={2}>
      <circle cx="60" cy="168" r="7" />
      <path d="M60 168V96" />
      <path d="M60 60a40 40 0 0 1 40 40" className="text-ink-blue" />
      <path d="M60 32a68 68 0 0 1 68 68" className="text-ink-violet" opacity={0.9} />
      <path d="M60 6a94 94 0 0 1 94 94" className="text-ink-yellow" />
      <path d="M22 176h180" opacity={0.5} />
    </g>
  </>
)

/** A dotted plot with one marked reading: data, drawn by hand. */
const Field = ({ id }: { id: string }) => (
  <>
    <g className="text-ink-blue">
      <Halftone id={`${id}-dots`} size={9} />
      <rect x="24" y="36" width="160" height="140" fill={`url(#${id}-dots)`} opacity={0.5} />
    </g>
    <g className="text-ink-yellow">
      <rect x="120" y="36" width="64" height="140" fill="currentColor" opacity={0.28} />
    </g>
    <g {...stroke} className="text-ink" stroke="currentColor" strokeWidth={2}>
      <path d="M24 36v140h160" />
      <path d="M36 150c22-6 32-40 56-44s34 34 58 14 30-58 30-58" className="text-brand" />
      <circle cx="122" cy="120" r="8" className="text-brand" />
    </g>
  </>
)

/** Petals of overlapping ink: the two colours meeting where they overlap. */
const Bloom = ({ id }: { id: string }) => (
  <>
    <g className="text-brand">
      <Halftone id={`${id}-dots`} size={6} />
      <circle cx="86" cy="96" r="54" fill={`url(#${id}-dots)`} opacity={0.6} />
    </g>
    <g className="text-ink-violet">
      <Halftone id={`${id}-dots-b`} size={9} />
      <circle cx="130" cy="120" r="54" fill={`url(#${id}-dots-b)`} opacity={0.6} />
    </g>
    <g className="text-ink-yellow">
      <circle cx="112" cy="62" r="34" fill="currentColor" opacity={0.35} />
    </g>
    <g {...stroke} className="text-ink" stroke="currentColor" strokeWidth={2}>
      <circle cx="86" cy="96" r="54" opacity={0.8} />
      <circle cx="130" cy="120" r="54" opacity={0.55} />
    </g>
  </>
)

const VARIANTS: Record<Variant, (props: { id: string }) => React.ReactElement> = {
  orbit: Orbit,
  strata: Strata,
  signal: Signal,
  field: Field,
  bloom: Bloom,
}

export function RisoArt({
  variant = 'orbit',
  className,
}: {
  variant?: Variant
  className?: string
}) {
  const Composition = VARIANTS[variant]
  // Pattern ids must be unique per variant, since several can share a page.
  const id = `riso-${variant}`
  return (
    <svg aria-hidden viewBox="0 0 208 208" className={cn('size-64 text-ink', className)}>
      <Composition id={id} />
    </svg>
  )
}

export type RisoVariant = Variant
