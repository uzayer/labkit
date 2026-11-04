'use client'

import {
  motion,
  type MotionStyle,
  useMotionTemplate,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useTransform,
} from 'motion/react'
import { useCallback, useEffect, useRef } from 'react'
import { preload } from 'react-dom'

import { cn } from '@/lib/utils'

/**
 * Scroll-driven manifesto hero.
 *
 * A sticky "DIAL research prioritises" holds still while DIAL's research
 * commitments scroll past it in normal flow, moved by the page's own scroll.
 * Veils ghost every line except the one in the slot, so the rest of the list
 * reads as a faint column above and below. Once the last line reaches the
 * slot, the whole stage sticks and the panel rises over it like a sheet
 * lifting onto the page, while the stage scales down and blurs beneath it. The
 * panel is the same paper as the page (there is no theme flip), so it is
 * separated by a rising shadow and a dimming of the stage rather than by colour.
 *
 * The list is never moved by JavaScript: it is server-rendered in place and
 * the browser scrolls it, so it paints on first load and costs nothing to
 * animate. Motion only drives the scale, blur and scrim, from the panel's
 * scroll progress.
 *
 * Side by side from xl, as in the original. Narrower, the headline is too long
 * to sit beside the list, so the list runs underneath it and the slot is the
 * line directly below the headline.
 *
 * With reduced motion the scale, blur and scrim are dropped; the list still
 * scrolls, because that is ordinary page scroll.
 *
 * Adapted from Skiper UI's Skiper44 (ScrollAnimation_006) by @gurvinder-singh02
 * (https://gxuri.me), itself an inspired rebuild of scroll treatments on
 * nextjs.org and devouringdetails.com. Free tier requires attribution.
 */

// Drawn from the lab's participatory approach and the nine research themes.
const focusAreas = [
  'listening',
  'lived experience',
  'marginalised communities',
  'feminist futures',
  'women in tech',
  'low-literacy users',
  'digital safety',
  'rural health',
  'computing education',
  'mental wellbeing',
  'the next researcher',
]

// Where the headline rests, and so where the slot is. The top padding matches
// it so the headline starts exactly where it will stick, with no jump.
const restAt = '42vh'

// The stage sticks once the last line has reached the slot: its top then sits
// that many lines above the headline. Using `em` keeps this right at every
// breakpoint's font size, since lines are 1.4em tall.
const stageStickTop = `calc(${restAt} - ${focusAreas.length - 1} * 1.4em)`

// A veil wide enough to cover the viewport from wherever the headline sits.
const veil = 'pointer-events-none absolute z-10 h-[60vh] w-screen bg-background/90'

interface ResearchScrollHeroProps {
  className?: string
  /** Rendered inside the panel that rises over the opening stage. */
  children?: React.ReactNode
}

const ResearchScrollHero = ({ className, children }: ResearchScrollHeroProps) => {
  // The focus areas below are the site's only Fraunces italic, and they are in
  // the first paint, so the hero preloads the italic file itself. Called here,
  // in a client component, it reaches <head> in the server render but runs in
  // the browser only when the hero renders. From a server component (the
  // layout's preload() or a <link> in the page) it became a hint in the RSC
  // payload, which every page's prefetch of / applied, downloading the italic
  // site-wide.
  preload('/fonts/fraunces-soft50-italic-latin.v1.woff2', {
    as: 'font',
    type: 'font/woff2',
    crossOrigin: 'anonymous',
  })
  const panelRef = useRef<HTMLElement>(null)
  const reduceMotion = useReducedMotion()

  // 0 when the panel's top enters the viewport, 1 when its bottom leaves it.
  const { scrollYProgress: panelProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'end start'],
  })
  // 0 -> 1 as the panel rises, reaching 1 when it has settled at the top.
  const { scrollYProgress: riseProgress } = useScroll({
    target: panelRef,
    offset: ['start end', 'start start'],
  })

  const stageScale = useTransform(panelProgress, [0.2, 1], [1, 0.5])
  const stageBlur = useTransform(panelProgress, [0.2, 0.8], [0, 8])
  const panelScale = useTransform(panelProgress, [0, 0.3], [0.98, 1])
  // The stage dims as the sheet comes over it, which is what makes a panel the
  // same colour as the page read as a separate layer.
  const stageScrim = useTransform(riseProgress, [0.2, 1], [0, 0.08])
  // The sheet's lift — the shadow it throws up onto the stage — is only true
  // while it is rising over something. Once it has settled it is the page, and
  // a shadow still hanging off its bottom edge printed a grey band between it
  // and the next section, so the paper changed colour at the seam.
  const lift = useTransform(riseProgress, [0.85, 1], [1, 0])

  // Full transform strings rather than Motion's `scale` shorthand, which is not
  // hardware-accelerated and drops frames while the page is loading.
  const stageTransform = useMotionTemplate`scale(${stageScale})`
  const panelTransform = useMotionTemplate`scale(${panelScale})`
  const stageBackdrop = useMotionTemplate`blur(${stageBlur}px)`

  /**
   * Lets the band's hand-drawn strokes (the underline and the circle) draw
   * themselves. They are held undrawn by `data-ink-hold` until the title's
   * foot (where the underline sits) has risen to the middle of the viewport,
   * so they draw as the reader arrives at the words rather than while the band
   * is still low on the screen. The settled sheet is a fallback, in case the
   * title rests below the middle on a short viewport. One-shot: scrolling back
   * up does not re-draw them.
   */
  const releaseInk = useCallback((progress: number) => {
    const panel = panelRef.current
    if (!panel) return
    const title = panel.querySelector('h1')
    const titleArrived = title && title.getBoundingClientRect().bottom <= window.innerHeight * 0.5
    if (titleArrived || progress >= 0.95) panel.setAttribute('data-ink-go', '')
  }, [])

  useMotionValueEvent(riseProgress, 'change', releaseInk)

  // A reload part-way down the page starts with progress already past the
  // threshold and no change event to announce it, so check once on mount.
  useEffect(() => {
    if (reduceMotion) panelRef.current?.setAttribute('data-ink-go', '')
    else releaseInk(riseProgress.get())
  }, [releaseInk, reduceMotion, riseProgress])

  return (
    // `data-hero-root` ships in the server-rendered HTML, so the CSS that takes
    // the nav out of flow applies on the very first paint, with no JS.
    <div
      data-hero-root
      className={cn(
        // Clipped on both axes. The stage's veils are a viewport tall and hang
        // below the hero once it has scrolled past; unclipped, they laid a
        // 90%-paper wash over the top of the next section on the right, which
        // read as the page changing colour (#F9F7F2 to #FBF7F2) at the seam.
        // `clip`, not `hidden`, so the sticky stage still sticks.
        'relative flex w-full flex-col items-center overflow-clip bg-background text-foreground',
        className,
      )}
      style={{ paddingTop: restAt }}
    >
      <motion.div
        style={{
          top: stageStickTop,
          transform: reduceMotion ? undefined : stageTransform,
        }}
        className="font-display sticky flex flex-col px-6 pb-10 text-4xl leading-[1.4] tracking-tight md:text-6xl xl:flex-row xl:gap-4 xl:px-0"
      >
        <div className="sticky h-fit" style={{ top: restAt }}>
          <p className="relative z-20 whitespace-nowrap">DIAL research prioritises</p>
          {/* Below xl the list passes underneath the headline; a solid band
              hides it there, so ghost lines never show through the words. */}
          <div
            aria-hidden
            className="absolute inset-y-0 left-1/2 z-[15] w-screen -translate-x-1/2 bg-background xl:hidden"
          />
          {/* Below xl the slot is the line under the headline, so the upper
              veil ends at the headline's foot (the headline sits above it)
              and the lower one starts a line further down. From xl, as in
              the original, both run from the headline's right edge. */}
          <div
            aria-hidden
            className={cn(
              veil,
              'bottom-0 left-1/2 -translate-x-1/2',
              'xl:bottom-full xl:left-full xl:translate-x-0',
            )}
          />
          <div
            aria-hidden
            className={cn(
              veil,
              'top-full left-1/2 mt-[1.4em] -translate-x-1/2',
              'xl:left-full xl:mt-0 xl:translate-x-0',
            )}
          />
        </div>
        <ul className="h-fit font-light italic">
          {focusAreas.map((area) => (
            <li key={area} className="whitespace-nowrap">
              {area}
            </li>
          ))}
        </ul>
        {!reduceMotion && (
          <motion.div
            aria-hidden
            style={{ backdropFilter: stageBackdrop }}
            className="pointer-events-none absolute inset-0 z-30 bg-background/10"
          />
        )}
      </motion.div>

      {/* Dims everything behind the panel as it rises. Absolute over the whole
          hero rather than inside the stage, so it veils the viewport and not
          just the text block, and stays under the panel (z-20). */}
      {!reduceMotion && (
        <motion.div
          aria-hidden
          style={{ opacity: stageScrim }}
          className="pointer-events-none absolute inset-0 z-[15] bg-foreground"
        />
      )}

      <motion.section
        ref={panelRef}
        data-ink-hold
        // Motion animates a custom property from a motion value, but its style
        // type does not list them; the shadow class reads `--lift`.
        style={
          (reduceMotion
            ? { '--lift': 0 }
            : { transform: panelTransform, '--lift': lift }) as unknown as MotionStyle
        }
        className={cn(
          // As tall as its contents, not a full viewport: the page that follows
          // is the same paper, so it rises with the sheet and the rise still
          // finishes. Forcing a screen's height centred the header in it and
          // left most of a screen of empty paper under the partner strip. pt
          // clears the fixed nav, so the sheet does not arrive tight under it.
          'relative z-20 mt-[20vh] flex w-full flex-col overflow-hidden rounded-t-4xl border-t border-border bg-background pt-28 pb-4 text-foreground md:pt-32 md:pb-6',
          // Only the top is rounded: the bottom runs straight into the page,
          // and rounded corners there showed the dimmed stage in the notches.
          // Lifts off the page: a shadow thrown upward onto the stage.
          'shadow-[0_-32px_64px_-24px_oklch(0.19_0.012_60/calc(0.22*var(--lift,1)))] dark:shadow-[0_-32px_64px_-24px_oklch(0_0_0/calc(0.6*var(--lift,1)))]',
        )}
      >
        {children}
      </motion.section>
    </div>
  )
}

export { ResearchScrollHero }
