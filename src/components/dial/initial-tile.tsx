import { cn } from '@/lib/utils'

/**
 * A small printed block carrying a person's initial: halftone dots behind the
 * letter, in one of the press inks. The ink is picked from the name itself, so
 * a person keeps the same colour everywhere, and a roster of names reads as a
 * set of printed cards rather than a wall of text.
 */
const INKS = [
  'text-ink',
  'text-ink-blue',
  'text-ink-violet',
  'text-ink-yellow',
  'text-brand',
] as const
const TINTS = [
  'bg-ink/10',
  'bg-ink-blue/10',
  'bg-ink-violet/10',
  'bg-ink-yellow/15',
  'bg-brand/10',
] as const

function inkFor(seed: string) {
  let n = 0
  for (const ch of seed) n = (n + ch.charCodeAt(0)) % 997
  return n % INKS.length
}

/**
 * The ink a person prints in, as class names. Shared so every place that draws
 * a person — the roster tile, the chip — reaches for the same colour from the
 * same seed. Pass the stable identifier (a slug) where there is one; the name
 * is only a fallback, since two records for the same person should not print
 * in different inks.
 */
export function personInk(seed: string): { ink: string; tint: string } {
  const i = inkFor(seed)
  return { ink: INKS[i], tint: TINTS[i] }
}

export function InitialTile({
  name,
  seed,
  className,
}: {
  name: string
  /** Stable identifier; falls back to the name. */
  seed?: string
  className?: string
}) {
  const { ink, tint } = personInk(seed ?? name)
  return (
    <span
      aria-hidden
      className={cn(
        'font-display relative grid size-10 shrink-0 place-items-center overflow-hidden rounded-[0.6rem] text-lg',
        ink,
        tint,
        className,
      )}
    >
      <span className="halftone absolute inset-0 opacity-25" />
      <span className="relative">{[...name.trim()][0] ?? ''}</span>
    </span>
  )
}
