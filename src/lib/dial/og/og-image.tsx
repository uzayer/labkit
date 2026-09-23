import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react'
import { ImageResponse } from 'next/og'
import sharp from 'sharp'

import { RISO_COMPOSITIONS, type RisoVariant } from '@/components/dial/riso'
import { ThemeGlyph } from '@/components/dial/theme-marks'

/**
 * Open Graph cards in DIAL's riso-notebook style: the PageHeader, printed on
 * one sheet. Eyebrow, display-serif title, a lede on an ink rule, the lockup
 * at the foot, and the page's riso composition bleeding off the right edge
 * past the crop marks. No drawn underline under the title: on the site the
 * squiggle means "this is a link", so it is not set under headings, and on a
 * card it never covered a title that wrapped.
 *
 * Served as WebP: `ImageResponse` only produces PNG, so sharp re-encodes it.
 * One image per page, deliberately. Open Graph has no format fallback — a
 * second `og:image` is a second image, and iMessage shows both side by side —
 * so a JPEG copy for crawlers without WebP cannot be offered alongside it.
 * What each card says is in `cards.ts`.
 */

export const size = { width: 1200, height: 630 }

// ─── Inks ────────────────────────────────────────────────────────────────────
// Satori and resvg cannot read CSS variables or OKLCH, so the light-theme
// tokens are restated here in the same OKLCH values as globals.css and
// converted once. The card is always printed on paper, never inverted.

const oklch = (L: number, C: number, h: number, alpha = 1) => {
  const a = C * Math.cos((h * Math.PI) / 180)
  const b = C * Math.sin((h * Math.PI) / 180)
  const l = (L + 0.3963377774 * a + 0.2158037573 * b) ** 3
  const m = (L - 0.1055613458 * a - 0.0638541728 * b) ** 3
  const s = (L - 0.0894841775 * a - 1.291485548 * b) ** 3
  const [r, g, bl] = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ].map((x) => {
    const v = x <= 0.0031308 ? 12.92 * x : 1.055 * x ** (1 / 2.4) - 0.055
    return Math.round(Math.min(1, Math.max(0, v)) * 255)
  })
  return `rgba(${r}, ${g}, ${bl}, ${alpha})`
}

const PAPER = oklch(0.982, 0.006, 85) // --background
const INK_BLACK = oklch(0.19, 0.012, 60) // --foreground
const PENCIL = oklch(0.52, 0.014, 60) // --muted-foreground
const BORDER = oklch(0.9, 0.008, 75) // --border

/** The press as OKLCH, keyed by the Tailwind text class the drawings use. */
const PRESS_LCH = {
  'text-brand': [0.47, 0.1, 165],
  'text-ink': [0.58, 0.17, 38],
  'text-ink-blue': [0.53, 0.14, 248],
  'text-ink-yellow': [0.74, 0.14, 82],
  'text-ink-violet': [0.55, 0.16, 340],
} as const

/** One of the press's inks, by its Tailwind class. */
export type PressInk = keyof typeof PRESS_LCH

const press = (ink: PressInk, alpha = 1) => {
  const [L, C, h] = PRESS_LCH[ink]
  return oklch(L, C, h, alpha)
}

/** The press as resolved colours, for re-inking the drawings. */
const PRESS: Record<string, string> = Object.fromEntries(
  Object.keys(PRESS_LCH).map((ink) => [ink, press(ink as PressInk)]),
)

/**
 * Yellow is too light to set type in on paper; a yellow Theme keeps its
 * yellow composition and glyph, and prints its words in the second ink.
 */
const typeInk = (ink: PressInk): PressInk => (ink === 'text-ink-yellow' ? 'text-ink' : ink)

// ─── Fonts ───────────────────────────────────────────────────────────────────
// Static TTF instances, since Satori reads neither woff2 nor variable axes:
// Fraunces at opsz 144 / SOFT 50 (the site's display setting), Geist, Geist
// Mono, and Mina for Bengali, which Satori falls back to glyph by glyph.

const fontDir = join(process.cwd(), 'src/lib/dial/og/fonts')
const font = (file: string) => readFile(join(fontDir, file))

// ─── Riso art ────────────────────────────────────────────────────────────────

/**
 * Re-inks one of the site's riso drawings for Satori. The drawings set colour
 * with Tailwind classes and `currentColor`; Satori resolves neither, so walk
 * the tree once, track the colour each class would set, and write it out as
 * explicit fill and stroke values. An inherited `stroke="currentColor"` is
 * re-resolved wherever a child changes ink, as it would be in CSS. Fragments
 * are flattened and helper components (the halftone pattern) called, so the
 * whole drawing is plain SVG by the time Satori serializes it.
 */
function reink(
  node: ReactNode,
  color: string,
  inherited: { fill: boolean; stroke: boolean },
): ReactNode {
  if (!isValidElement<Record<string, unknown>>(node)) return node
  const { className, children, ...props } = node.props
  if (node.type === Fragment) {
    return Children.map(children as ReactNode, (child) => reink(child, color, inherited))
  }
  if (typeof node.type === 'function') {
    const render = node.type as (p: Record<string, unknown>) => ReactNode
    return reink(render(node.props), color, inherited)
  }
  const own = typeof className === 'string' ? PRESS[className] : undefined
  const ink = own ?? color

  const fillIsCurrent =
    props.fill === 'currentColor' || (props.fill === undefined && inherited.fill)
  const strokeIsCurrent =
    props.stroke === 'currentColor' || (props.stroke === undefined && inherited.stroke)

  const next: Record<string, unknown> = { ...props }
  if (props.fill === 'currentColor' || (own && inherited.fill && props.fill === undefined)) {
    next.fill = ink
  }
  if (props.stroke === 'currentColor' || (own && inherited.stroke && props.stroke === undefined)) {
    next.stroke = ink
  }

  const kids = Children.map(children as ReactNode, (child) =>
    reink(child, ink, { fill: fillIsCurrent, stroke: strokeIsCurrent }),
  )
  return cloneElement(
    node as ReactElement<Record<string, unknown>>,
    { ...next, className: undefined },
    kids,
  )
}

function Riso({ variant, px, ink }: { variant: RisoVariant; px: number; ink: string }) {
  const Composition = RISO_COMPOSITIONS[variant]
  return (
    <svg viewBox="0 0 208 208" width={px} height={px}>
      {reink(<g>{Composition({ id: `og-${variant}` })}</g>, ink, { fill: false, stroke: false })}
    </svg>
  )
}

/** A Theme's drawn glyph at plate size, re-inked the same way as the art. */
function Glyph({ slug, px, ink }: { slug: string; px: number; ink: string }) {
  const drawing = ThemeGlyph({ slug })
  if (!isValidElement<Record<string, unknown>>(drawing)) return null
  const inked = reink(drawing, ink, { fill: false, stroke: false })
  return isValidElement(inked)
    ? cloneElement(inked as ReactElement<Record<string, unknown>>, { width: px, height: px })
    : null
}

// ─── Marks ───────────────────────────────────────────────────────────────────

function CropMark({ flip, color }: { flip?: boolean; color: string }) {
  return (
    <svg width={24} height={24} viewBox="0 0 20 20">
      <path
        d={flip ? 'M20 14H6M6 20V6' : 'M0 14h14M14 20V6'}
        fill="none"
        stroke={color}
        strokeWidth={1.5}
        strokeLinecap="round"
      />
    </svg>
  )
}

/**
 * `DialLockup descriptor="lab"`: the wordmark, a hairline, and the lab's name
 * in wide-tracked capitals. The wordmark is the site's own SVG, re-inked.
 */
function Lockup({ wordmark }: { wordmark: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
      {/* oxlint-disable-next-line nextjs/no-img-element -- Satori, not the DOM */}
      <img src={wordmark} width={150} height={47} alt="" />
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          borderLeft: `1px solid ${BORDER}`,
          paddingLeft: 18,
          fontFamily: 'Geist',
          fontSize: 15,
          lineHeight: 1.35,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          color: PENCIL,
        }}
      >
        <span>Design Inclusion</span>
        <span>&amp; Access Lab</span>
      </div>
    </div>
  )
}

// ─── Card ────────────────────────────────────────────────────────────────────

export interface OgCard {
  /** Small label above the title: the section of the site. */
  eyebrow?: string
  title: string
  description?: string | null
  /** The composition the matching page header prints. */
  art?: RisoVariant
  /**
   * The ink the card prints in — a Research Theme's own, as its page is. The
   * second ink otherwise. Sets the eyebrow, the marks and the rule.
   */
  ink?: PressInk
  /** A Research Theme's slug: prints its drawn glyph above the title. */
  glyph?: string
  /**
   * Lead with the DIAL wordmark at display size and set the title under it.
   * The footer lockup is dropped, since it would repeat the mark. For the
   * site-wide card, where the lab itself is the subject.
   */
  logo?: boolean
}

/** Shrink long titles (publication titles run to 150 characters). */
const titleSize = (title: string) =>
  title.length <= 28 ? 104 : title.length <= 56 ? 80 : title.length <= 100 ? 56 : 46

/**
 * The composition gives way to the words. At 660px it was a backdrop, which
 * suits a two-word title with room around it; under a four-line paper title it
 * ran up into the lines and outweighed them. Long titles get a plate tucked
 * into the bottom corner instead.
 */
const artSize = (title: string, logo: boolean) =>
  logo ? 620 : title.length <= 28 ? 560 : title.length <= 56 ? 480 : 380

function Card({
  eyebrow,
  title,
  description,
  art = 'bloom',
  ink = 'text-ink',
  glyph,
  logo = false,
  wordmark,
}: OgCard & { wordmark: string }) {
  // A Theme card spends a line's height on its glyph, so its title steps down
  // to keep the lede clear of the lockup.
  const fontSize = logo ? 52 : glyph ? Math.min(titleSize(title), 64) : titleSize(title)
  const short = title.length <= 56
  const px = artSize(title, logo)
  const words = press(typeInk(ink))
  return (
    <div
      style={{
        position: 'relative',
        display: 'flex',
        width: '100%',
        height: '100%',
        backgroundColor: PAPER,
        color: INK_BLACK,
        overflow: 'hidden',
      }}
    >
      {/* The composition, bleeding off the right edge of the sheet. */}
      <div
        style={{
          position: 'absolute',
          right: -Math.round(px * 0.26),
          bottom: -Math.round(px * 0.17),
          display: 'flex',
          opacity: 0.9,
        }}
      >
        <Riso variant={art} px={px} ink={press(ink)} />
      </div>

      {/* Printer's crop marks at the sheet's top corners. */}
      <div style={{ position: 'absolute', top: 40, left: 40, display: 'flex' }}>
        <CropMark color={press(typeInk(ink), 0.45)} />
      </div>
      <div style={{ position: 'absolute', top: 40, right: 40, display: 'flex' }}>
        <CropMark flip color={press(typeInk(ink), 0.45)} />
      </div>

      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: logo ? 'center' : 'space-between',
          padding: '88px 80px 64px',
          // The site card sets the lab's name on one line under the mark, so
          // it takes the width the composition leaves it.
          width: logo ? 860 : 800,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {eyebrow && (
            <div
              style={{
                fontFamily: 'Geist Mono',
                fontSize: 18,
                letterSpacing: '0.2em',
                textTransform: 'uppercase',
                color: words,
              }}
            >
              {eyebrow}
            </div>
          )}
          {glyph && (
            <div style={{ display: 'flex', marginTop: eyebrow ? 22 : 0 }}>
              <Glyph slug={glyph} px={72} ink={press(ink)} />
            </div>
          )}
          {logo && (
            // oxlint-disable-next-line nextjs/no-img-element -- Satori, not the DOM
            <img
              src={wordmark}
              width={560}
              height={175}
              alt=""
              style={{ marginTop: eyebrow ? 36 : 0 }}
            />
          )}
          <div
            style={{
              display: 'block',
              marginTop: logo ? 32 : glyph ? 14 : eyebrow ? 24 : 0,
              fontFamily: 'Fraunces',
              fontSize,
              lineHeight: 1.02,
              letterSpacing: '-0.02em',
              // A title with no lede under it may take the lede's room; a
              // paper's title needs a fifth line more often than not.
              lineClamp: description ? 3 : short ? 4 : 5,
              // Balancing a long title that is then clamped wraps it narrow.
              // The lab's name is one line, never balanced: balanced, it broke
              // as "Design Inclusion / and Access Lab", leading with "and".
              textWrap: short && !logo ? 'balance' : 'wrap',
              whiteSpace: logo ? 'nowrap' : 'normal',
            }}
          >
            {title}
          </div>
          {description && (
            <div
              style={{
                display: 'block',
                marginTop: 32,
                paddingTop: 20,
                borderTop: `1px solid ${press(typeInk(ink), 0.4)}`,
                fontFamily: 'Geist',
                fontSize: 24,
                lineHeight: 1.4,
                // Satori sets Geist's word space noticeably wider than browsers do.
                wordSpacing: -3,
                color: PENCIL,
                lineClamp: 2,
              }}
            >
              {description}
            </div>
          )}
        </div>
        {!logo && <Lockup wordmark={wordmark} />}
      </div>
    </div>
  )
}

/** Renders a card as WebP; no card is a 404. */
export async function ogImage(card: OgCard | undefined): Promise<Response> {
  if (!card) return new Response(null, { status: 404 })

  const [fraunces, geist, geistMono, mina, logo] = await Promise.all([
    font('fraunces-display.ttf'),
    font('geist-regular.ttf'),
    font('geist-mono-medium.ttf'),
    font('mina-regular.ttf'),
    readFile(join(process.cwd(), 'public/dial-logo.svg'), 'utf8'),
  ])
  const wordmark = `data:image/svg+xml;base64,${Buffer.from(logo.replace(/#000/g, INK_BLACK)).toString('base64')}`

  const png = new ImageResponse(<Card {...card} wordmark={wordmark} />, {
    ...size,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
      { name: 'Geist', data: geist, weight: 400, style: 'normal' },
      { name: 'Geist Mono', data: geistMono, weight: 500, style: 'normal' },
      { name: 'Mina', data: mina, weight: 400, style: 'normal' },
    ],
  })

  const webp = await sharp(Buffer.from(await png.arrayBuffer()))
    .webp({ quality: 88 })
    .toBuffer()

  return new Response(new Uint8Array(webp), { headers: { 'Content-Type': 'image/webp' } })
}
