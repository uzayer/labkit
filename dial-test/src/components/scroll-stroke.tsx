'use client'

import { useRef } from 'react'
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react'

import { cn } from '@/lib/utils'

/**
 * A drawn line that follows the scroll: the stroke draws itself as the section
 * it belongs to passes through the viewport, after skiper-ui's Skiper19.
 *
 * Decoration in the margin, not content — it never holds text and never moves
 * anything. With reduced motion the line is simply drawn in full.
 */
const PATHS = {
  /** A line wandering down the page, as if tracing a route. */
  meander:
    'M60 4C24 64 96 96 62 158S18 268 66 320s34 118-6 170 12 106 44 150',
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
  const ref = useRef<HTMLDivElement>(null)
  const reduceMotion = useReducedMotion()
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  })
  // Starts part-drawn so the line never reads as missing, and completes as the
  // section leaves.
  const pathLength = useTransform(scrollYProgress, [0, 0.85], [0.08, 1])

  return (
    <div ref={ref} aria-hidden className={cn('pointer-events-none absolute inset-y-0', className)}>
      <svg viewBox="0 0 120 640" preserveAspectRatio="none" className="h-full w-full text-ink/50">
        <motion.path
          d={PATHS[variant]}
          fill="none"
          stroke="currentColor"
          strokeWidth={2.5}
          strokeLinecap="round"
          style={reduceMotion ? undefined : { pathLength }}
        />
      </svg>
    </div>
  )
}
