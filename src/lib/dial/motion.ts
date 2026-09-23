import type { CSSProperties } from 'react'

/** Step in a staggered `.enter` sequence (60ms apart; see globals.css). */
export const enterStep = (i: number) => ({ '--enter-i': i }) as CSSProperties

/**
 * Stagger for rows entering a filtered list via @starting-style. Capped so a
 * long list never makes the last visible row wait.
 */
export const listStagger = (i: number): CSSProperties => ({
  transitionDelay: `${Math.min(i, 8) * 30}ms`,
})

/** Row entrance on insert: CSS transitions, so rapid filter clicks retarget. */
export const listEnter =
  'transition-[opacity,translate] duration-200 ease-snappy starting:opacity-0 starting:translate-y-1.5 motion-reduce:starting:translate-y-0'
