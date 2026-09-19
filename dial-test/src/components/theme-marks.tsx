import type { RisoVariant } from '@/components/riso'
import { cn } from '@/lib/utils'

/**
 * One drawn glyph per Research Theme, in the second ink. These are drawings,
 * not icons from a set: uneven strokes, open corners, the look of something
 * sketched in a field notebook next to a heading.
 *
 * Keyed by Theme slug, so a Theme without a drawing simply renders nothing
 * rather than borrowing another Theme's picture.
 */

const stroke = {
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.6,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const

type GlyphProps = { className?: string }

const wrap = (children: React.ReactNode, className?: string) => (
  <svg aria-hidden viewBox="0 0 48 48" className={cn('size-10 text-ink', className)}>
    <g {...stroke}>{children}</g>
  </svg>
)

/** Accessibility & inclusion: a hand reaching a doorway that is propped open. */
const AccessibilityGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M12 41V13c0-2 1-3 3-3l13-3c2-.4 3 .6 3 2.6V41" />
      <path d="M8 41h29" />
      <circle cx="27" cy="25" r="1.6" />
      <path d="M36 20c3 2 5 5 5 9s-2 7-5 9" />
    </>,
    className,
  )

/** Gender & feminist HCI: two overlapping circles, the overlap hatched. */
const GenderGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <circle cx="19" cy="24" r="12" />
      <circle cx="31" cy="24" r="12" />
      <path d="M25 14.5v19" />
      <path d="M22 18.5l6 4M22 25l6 4" />
    </>,
    className,
  )

/** Mental health & wellbeing: a pulse that settles into a heart's curve. */
const WellbeingGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M5 26h7l3-8 4 16 4-11 3 5h4" />
      <path d="M32 21c2-3 7-2 7 2 0 5-6 8-8 11-2-3-8-6-8-11 0-4 5-5 7-2" />
    </>,
    className,
  )

/** Explainable AI: a box opened up, with a question inside. */
const ExplainableGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M10 18l14-7 14 7-14 7-14-7z" />
      <path d="M10 18v13l14 7 14-7V18" />
      <path d="M21 28c0-2 1.6-3 3-3s3 1 3 2.6c0 2.4-3 2.4-3 4.4" />
      <path d="M24 36.5v.2" />
    </>,
    className,
  )

/** ICT for development: a signal reaching out from a small mast. */
const IctdGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M24 20v20" />
      <path d="M17 40h14" />
      <path d="M19 16c-2-2-2-6 0-8M29 8c2 2 2 6 0 8" />
      <path d="M14 20c-4-4-4-12 0-16M34 4c4 4 4 12 0 16" />
      <circle cx="24" cy="12" r="2" />
    </>,
    className,
  )

/** Safety & security: a shield sketched twice, slightly out of register. */
const SafetyGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M24 6l14 5v12c0 9-6 15-14 19-8-4-14-10-14-19V11l14-5z" />
      <path d="M18 24l4 4 9-9" />
    </>,
    className,
  )

/** IoT & low-cost hardware: a board with legs and a soldered joint. */
const HardwareGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <rect x="14" y="14" width="20" height="20" rx="2" />
      <path d="M20 14V8M28 14V8M20 40v-6M28 40v-6M14 20H8M14 28H8M40 20h-6M40 28h-6" />
      <circle cx="24" cy="24" r="3" />
    </>,
    className,
  )

/** Infodemic & misinformation: two speech bubbles, one fracturing. */
const InfodemicGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M6 14c0-2 2-4 4-4h16c2 0 4 2 4 4v9c0 2-2 4-4 4H15l-6 5v-5c-2 0-3-2-3-4v-9z" />
      <path d="M34 20c4 0 8 3 8 7v6c0 3-2 5-5 5h-9l-5 4v-4" />
      <path d="M17 15l-2 5h4l-2 5" />
    </>,
    className,
  )

/** Computing education: an open notebook with a cursor blinking on the page. */
const EducationGlyph = ({ className }: GlyphProps) =>
  wrap(
    <>
      <path d="M24 14c-4-3-9-4-15-3v24c6-1 11 0 15 3 4-3 9-4 15-3V11c-6-1-11 0-15 3z" />
      <path d="M24 14v24" />
      <path d="M13 21l3 3-3 3" />
      <path d="M30 27h5" />
    </>,
    className,
  )

const THEME_GLYPHS: Record<string, (props: GlyphProps) => React.ReactElement> = {
  'accessibility-inclusion': AccessibilityGlyph,
  'gender-feminist-hci': GenderGlyph,
  'mental-health-wellbeing': WellbeingGlyph,
  'explainable-ai-ml': ExplainableGlyph,
  ictd: IctdGlyph,
  'safety-security': SafetyGlyph,
  'iot-low-cost-hardware': HardwareGlyph,
  'infodemic-misinformation': InfodemicGlyph,
  'computing-education-community': EducationGlyph,
}

/**
 * One ink per Theme, so the Research index reads as a printed set rather than
 * a list. Fixed per slug, never random: a Theme keeps its colour everywhere it
 * appears. Status colour is not in this set; green always means ongoing.
 */
const THEME_INK: Record<string, string> = {
  'accessibility-inclusion': 'text-ink',
  'gender-feminist-hci': 'text-ink-violet',
  'mental-health-wellbeing': 'text-ink-violet',
  'explainable-ai-ml': 'text-ink-blue',
  ictd: 'text-ink-blue',
  'safety-security': 'text-ink',
  'iot-low-cost-hardware': 'text-ink-yellow',
  'infodemic-misinformation': 'text-ink-yellow',
  'computing-education-community': 'text-brand',
}

/** The ink a Theme is printed in; falls back to the second ink. */
export const themeInk = (slug: string) => THEME_INK[slug] ?? 'text-ink'

/**
 * The same ink as a raw CSS value, for the places a Tailwind text class cannot
 * reach: a wash behind a band, a rule, a mark at partial strength. Fed to
 * `--header-ink` so one variable re-inks a whole page.
 */
const THEME_INK_VAR: Record<string, string> = {
  'accessibility-inclusion': 'var(--ink)',
  'gender-feminist-hci': 'var(--ink-violet)',
  'mental-health-wellbeing': 'var(--ink-violet)',
  'explainable-ai-ml': 'var(--ink-blue)',
  ictd: 'var(--ink-blue)',
  'safety-security': 'var(--ink)',
  'iot-low-cost-hardware': 'var(--ink-yellow)',
  'infodemic-misinformation': 'var(--ink-yellow)',
  'computing-education-community': 'var(--brand)',
}

export const themeInkVar = (slug: string) => THEME_INK_VAR[slug] ?? 'var(--ink)'

/**
 * One printed composition per Theme. Nine Theme pages sharing a single drawing
 * read as one template filled in nine times; the glyph, the ink and the
 * composition together make each page its own plate.
 */
const THEME_ART: Record<string, RisoVariant> = {
  'accessibility-inclusion': 'bloom',
  'gender-feminist-hci': 'orbit',
  'mental-health-wellbeing': 'bloom',
  'explainable-ai-ml': 'strata',
  ictd: 'signal',
  'safety-security': 'orbit',
  'iot-low-cost-hardware': 'field',
  'infodemic-misinformation': 'signal',
  'computing-education-community': 'field',
}

export const themeArt = (slug: string): RisoVariant => THEME_ART[slug] ?? 'strata'

export function ThemeGlyph({ slug, className }: { slug: string; className?: string }) {
  const Glyph = THEME_GLYPHS[slug]
  return Glyph ? <Glyph className={cn(themeInk(slug), className)} /> : null
}

export const hasThemeGlyph = (slug: string) => slug in THEME_GLYPHS
