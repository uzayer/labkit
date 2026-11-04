'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * A ruler in the margin: ticks fill with ink as the page scrolls, with a
 * hairline and a percentage riding the current position. After skiper-ui's
 * Skiper95, restyled in the second ink.
 *
 * It answers "how much is left", so it belongs on pages people read or scan to
 * the end: the long lists (Publications, News, People, Awards, Projects) and
 * the long reading pages (About, Join Us, Research and its themes, profiles).
 * Not on Home, whose pinned research hero already tracks scroll, nor on short
 * or single-record pages. It hides itself where there is no margin to spare (below xl) and where the
 * page is not actually long, which is what happens once a filter cuts a list
 * down.
 *
 * The motion is a CSS scroll-driven animation (`.scroll-ruler-*` in
 * globals.css), so the fill and the hairline run on the compositor and no
 * script runs per scroll frame. Browsers without scroll timelines (Firefox
 * stable, as of late 2026) get the small listener below instead, which writes
 * the same three values. Reduced motion hides the ruler in CSS.
 */

/** Below this many viewports, position is obvious and the ruler is noise. */
const MIN_VIEWPORTS = 3

const TICKS = `repeating-linear-gradient(to bottom, currentColor 0, currentColor 1px, transparent 1px, transparent 6px)`

export function ScrollRuler({
  side = 'right',
  className,
}: {
  /**
   * Which margin to sit in. The right mirrors where a scrollbar lives, and
   * every list on this site already numbers or dates its rows down the left,
   * so that is the default; a page with something in the right margin can
   * flip it.
   */
  side?: 'left' | 'right'
  className?: string
}) {
  const [longEnough, setLongEnough] = useState(false)
  const fillRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const readoutRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const measure = () =>
      setLongEnough(document.documentElement.scrollHeight > window.innerHeight * MIN_VIEWPORTS)
    measure()
    // Filtering a list changes the page's height without firing a resize.
    const observer = new ResizeObserver(measure)
    observer.observe(document.body)
    window.addEventListener('resize', measure)
    return () => {
      observer.disconnect()
      window.removeEventListener('resize', measure)
    }
  }, [])

  // Fallback for browsers without scroll timelines only.
  useEffect(() => {
    if (!longEnough || CSS.supports('animation-timeline', 'scroll()')) return
    let frame = 0
    const update = () => {
      frame = 0
      const root = document.documentElement
      const max = root.scrollHeight - window.innerHeight
      const progress = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0
      fillRef.current?.style.setProperty('clip-path', `inset(0 0 ${(1 - progress) * 100}% 0)`)
      lineRef.current?.style.setProperty('translate', `0 ${progress * 12}rem`)
      readoutRef.current?.style.setProperty('--ruler-pct', String(Math.round(progress * 100)))
    }
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update)
    }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) cancelAnimationFrame(frame)
    }
  }, [longEnough])

  if (!longEnough) return null

  const onRight = side === 'right'

  return (
    <div
      aria-hidden
      className={cn(
        'scroll-ruler pointer-events-none fixed top-1/2 z-30 hidden h-48 w-4 -translate-y-1/2 xl:block',
        // Clear of the overlay scrollbar on the right, of the container on the left.
        onRight ? 'right-8' : 'left-6',
        className,
      )}
    >
      <div className="text-ink relative h-full w-full">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: TICKS }} />
        <div
          ref={fillRef}
          className="scroll-ruler-fill absolute inset-0"
          style={{ backgroundImage: TICKS }}
        />
        <div
          ref={lineRef}
          className={cn(
            'scroll-ruler-line bg-ink absolute top-0 flex h-px w-6 items-center',
            onRight ? 'right-0' : 'left-0',
          )}
        >
          {/* The readout sits on the outside, away from the page's text. */}
          <span
            ref={readoutRef}
            className={cn(
              'scroll-ruler-readout text-ink absolute font-mono text-[0.65rem] tabular-nums',
              onRight ? '-left-1 -translate-x-full' : '-right-1 translate-x-full',
            )}
          />
        </div>
      </div>
    </div>
  )
}
