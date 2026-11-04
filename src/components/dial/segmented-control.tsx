'use client'

import { useId } from 'react'
import type { LucideIcon } from 'lucide-react'
import { motion, useReducedMotion } from 'motion/react'

import { cn } from '@/lib/utils'

export interface SegmentedOption<T extends string> {
  value: T
  label: string
  count?: number
  icon?: LucideIcon
}

/**
 * The site's one-of-many control: a ruled pill with a single sliding thumb.
 *
 * Lives in its own client module rather than in `editorial.tsx` because the
 * thumb is a motion layout animation, and `editorial.tsx` is imported by
 * server-rendered pages — marking that file `"use client"` would drag every
 * section header across the boundary with it.
 */
export function SegmentedControl<T extends string>({
  label,
  options,
  value,
  onChange,
  className,
  size = 'md',
  prefix,
}: {
  label: string
  options: SegmentedOption<T>[]
  value: T
  onChange: (value: T) => void
  className?: string
  /** `sm` for the sticky bar, where the control sits beside a group name. */
  size?: 'sm' | 'md'
  /**
   * A word shared by every option, set outside the pill instead of repeated
   * inside it — "By year / By venue / By theme" says "By" four times to say
   * one thing. Decorative: the group already has an accessible name.
   */
  prefix?: string
}) {
  const reduceMotion = useReducedMotion()
  // The thumb is a shared element, so its layoutId has to be unique per
  // control — two segmented controls on one page would otherwise hand the
  // thumb back and forth across the screen on every click.
  const thumbId = `${useId()}-thumb`

  // The radio group keyboard pattern: the group is one tab stop (the checked
  // option), and the arrow keys move the selection, as native radios do.
  const onKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const index = options.findIndex((option) => option.value === value)
    const last = options.length - 1
    const next =
      event.key === 'ArrowRight' || event.key === 'ArrowDown'
        ? index >= last
          ? 0
          : index + 1
        : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
          ? index <= 0
            ? last
            : index - 1
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? last
              : null
    if (next === null) return
    event.preventDefault()
    onChange(options[next].value)
    const radios = event.currentTarget.querySelectorAll<HTMLElement>('[role="radio"]')
    radios[next]?.focus()
  }
  const hasChecked = options.some((option) => option.value === value)

  const group = (
    <div
      role="radiogroup"
      aria-label={label}
      onKeyDown={onKeyDown}
      className={cn(
        'flex w-fit max-w-full [scrollbar-width:none] overflow-x-auto rounded-full border border-border p-0.5 text-sm',
        // As a flex item beside a prefix it would otherwise refuse to shrink
        // below its content and scroll the page instead of itself.
        prefix && 'min-w-0',
        !prefix && className,
      )}
    >
      {options.map((option, i) => {
        const selected = value === option.value
        const Icon = option.icon
        return (
          <button
            key={option.value}
            type="button"
            role="radio"
            aria-checked={selected}
            tabIndex={selected || (!hasChecked && i === 0) ? 0 : -1}
            onClick={() => onChange(option.value)}
            className={cn(
              'ease-snappy relative shrink-0 rounded-full whitespace-nowrap transition-colors duration-150',
              size === 'sm' ? 'px-2.5 py-0.5' : 'px-3 py-1',
              selected ? 'text-background' : 'text-muted-foreground hover:text-foreground',
            )}
          >
            {selected && (
              <motion.span
                aria-hidden
                layoutId={thumbId}
                className="absolute inset-0 rounded-full bg-foreground"
                transition={
                  reduceMotion
                    ? { duration: 0 }
                    : { type: 'spring', stiffness: 520, damping: 42, mass: 0.7 }
                }
              />
            )}
            {/* Above the thumb, so the label is never painted over mid-slide. */}
            <span className="relative inline-flex items-center gap-1.5">
              {Icon && (
                <Icon aria-hidden className={cn('size-3.5 shrink-0', !selected && 'opacity-70')} />
              )}
              {option.label}
              {option.count !== undefined && (
                // Dimmed only on the filled thumb, where 60% still clears
                // 4.5:1; on paper it fell to 2.4:1.
                <span className={cn('tabular-nums', selected && 'opacity-60')}>{option.count}</span>
              )}
            </span>
          </button>
        )
      })}
    </div>
  )

  if (!prefix) return group

  return (
    <div className={cn('flex max-w-full items-center gap-2.5', className)}>
      <span aria-hidden className="shrink-0 text-sm text-muted-foreground">
        {prefix}
      </span>
      {group}
    </div>
  )
}
