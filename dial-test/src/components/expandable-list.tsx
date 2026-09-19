'use client'

import { useState } from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'motion/react'
import { ChevronDown } from 'lucide-react'

import { cn } from '@/lib/utils'

export interface ExpandableItem {
  title: string
  body: string
}

/**
 * A stack of paper cards where one opens at a time: the open card springs to
 * its height, its corners round off, and its text blurs in. The mechanic is
 * skiper-ui's Skiper103, restyled as paper rather than glass.
 *
 * Occasional-use content only (a page's "why" list, not a navigation surface).
 */
export function ExpandableList({
  items,
  defaultOpen = 0,
  className,
}: {
  items: ExpandableItem[]
  /** Index open on arrival, or null for all closed. */
  defaultOpen?: number | null
  className?: string
}) {
  const [active, setActive] = useState<number | null>(defaultOpen)
  const reduceMotion = useReducedMotion()

  return (
    <ul className={cn('flex flex-col', className)}>
      {items.map((item, i) => {
        const open = active === i
        // The open card and its neighbours round off, so the stack reads as
        // cards rather than one ruled block.
        const roundTop = i === 0 || open || (active !== null && i === active + 1)
        const roundBottom = i === items.length - 1 || open || (active !== null && i === active - 1)
        return (
          <motion.li
            key={item.title}
            animate={{
              marginBlock: open ? 8 : 0,
              borderTopLeftRadius: roundTop ? 18 : 2,
              borderTopRightRadius: roundTop ? 18 : 2,
              borderBottomLeftRadius: roundBottom ? 18 : 2,
              borderBottomRightRadius: roundBottom ? 18 : 2,
            }}
            transition={
              reduceMotion
                ? { duration: 0.15 }
                : { type: 'spring', duration: 0.5, bounce: 0.18 }
            }
            className="overflow-hidden border border-paper-line bg-card"
          >
            <button
              type="button"
              aria-expanded={open}
              onClick={() => setActive(open ? null : i)}
              className="flex w-full items-center gap-4 px-5 py-4 text-left transition-colors duration-150 ease-snappy hover:bg-muted/40"
            >
              <span className="font-hand text-xl text-ink tabular-nums">{i + 1}</span>
              <span className="flex-1 font-display text-xl leading-snug">{item.title}</span>
              <ChevronDown
                aria-hidden
                className={cn(
                  'size-4 shrink-0 text-muted-foreground transition-transform duration-200 ease-snappy',
                  open && 'rotate-180',
                )}
              />
            </button>

            <AnimatePresence initial={false}>
              {open && (
                <motion.div
                  key="body"
                  initial={{ height: 0, opacity: 0, filter: 'blur(2px)' }}
                  animate={{ height: 'auto', opacity: 1, filter: 'blur(0px)' }}
                  exit={{ height: 0, opacity: 0, filter: 'blur(2px)' }}
                  transition={
                    reduceMotion ? { duration: 0.15 } : { type: 'spring', duration: 0.45, bounce: 0 }
                  }
                >
                  <p className="px-5 pb-5 pl-14 text-pretty text-muted-foreground">{item.body}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.li>
        )
      })}
    </ul>
  )
}
