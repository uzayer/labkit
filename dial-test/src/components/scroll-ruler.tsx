'use client'

import { useEffect, useState } from 'react'
import { motion, useMotionTemplate, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * A ruler in the margin: ticks fill with ink as the page scrolls, with a
 * hairline and a percentage riding the current position. After skiper-ui's
 * Skiper95, restyled in the second ink.
 *
 * It answers "how much of this list is left", so it belongs on pages that are
 * one long run of records (Publications, News, the People roster) and not on
 * composed pages, where a percentage through mixed sections tells you nothing.
 * It hides itself where there is no margin to spare (below xl) and where the
 * page is not actually long, which is what happens once a filter cuts a list
 * down.
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
  const { scrollYProgress } = useScroll()
  const reduceMotion = useReducedMotion()
  const [longEnough, setLongEnough] = useState(false)

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

  // The filled portion grows from the bottom up as the page advances.
  const remaining = useTransform(scrollYProgress, [0, 1], [100, 0])
  const clipPath = useMotionTemplate`inset(0 0 ${remaining}% 0)`
  const percent = useTransform(scrollYProgress, (v) => Math.round(v * 100))
  const y = useTransform(scrollYProgress, [0, 1], [0, 192])

  if (reduceMotion || !longEnough) return null

  const onRight = side === 'right'

  return (
    <div
      aria-hidden
      className={cn(
        'pointer-events-none fixed top-1/2 z-30 hidden h-48 w-4 -translate-y-1/2 xl:block',
        // Clear of the overlay scrollbar on the right, of the container on the left.
        onRight ? 'right-8' : 'left-6',
        className,
      )}
    >
      <div className="relative h-full w-full text-ink">
        <div className="absolute inset-0 opacity-25" style={{ backgroundImage: TICKS }} />
        <motion.div className="absolute inset-0" style={{ clipPath, backgroundImage: TICKS }} />
        <motion.div
          style={{ y }}
          className={cn('absolute top-0 flex h-px w-6 items-center bg-ink', onRight ? 'right-0' : 'left-0')}
        >
          {/* The readout sits on the outside, away from the page's text. */}
          <motion.span
            className={cn(
              'absolute font-mono text-[0.65rem] tabular-nums text-ink',
              onRight ? '-left-1 -translate-x-full' : '-right-1 translate-x-full',
            )}
          >
            {percent}
          </motion.span>
        </motion.div>
      </div>
    </div>
  )
}
