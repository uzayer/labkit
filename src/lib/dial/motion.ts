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

/**
 * Row entrance on insert: CSS transitions, so rapid filter clicks retarget.
 * The utilities are applied once in globals.css (`.list-enter`) rather than
 * spelled out on every row of a long list.
 */
export const listEnter = 'list-enter'
