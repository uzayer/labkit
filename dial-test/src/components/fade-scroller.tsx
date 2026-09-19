'use client'

import { useCallback, useEffect, useRef, useState } from 'react'

import { cn } from '@/lib/utils'

/**
 * A scroll container whose edges fade out where there is more to see, after
 * skiper-ui's Skiper87. The fade appears only on the side that has hidden
 * content, so it reads as "keep going" rather than as decoration, and it
 * disappears entirely once everything fits.
 *
 * Uses a mask rather than a gradient overlay, so it works on any background,
 * including the band on the home page.
 */
export function FadeScroller({
  children,
  orientation = 'horizontal',
  label,
  className,
  contentClassName,
}: {
  children: React.ReactNode
  orientation?: 'horizontal' | 'vertical'
  /** Names the group for assistive tech, e.g. "Filter by Research Theme". */
  label?: string
  className?: string
  contentClassName?: string
}) {
  const ref = useRef<HTMLDivElement>(null)
  const [fade, setFade] = useState({ start: false, end: false })
  const horizontal = orientation === 'horizontal'

  const measure = useCallback(() => {
    const el = ref.current
    if (!el) return
    const pos = horizontal ? el.scrollLeft : el.scrollTop
    const size = horizontal ? el.clientWidth : el.clientHeight
    const total = horizontal ? el.scrollWidth : el.scrollHeight
    setFade({ start: pos > 4, end: pos + size < total - 4 })
  }, [horizontal])

  useEffect(() => {
    const el = ref.current
    if (!el) return
    measure()
    // Filters and viewport changes both change what is hidden.
    const observer = new ResizeObserver(measure)
    observer.observe(el)
    for (const child of el.children) observer.observe(child)
    return () => observer.disconnect()
  }, [measure])

  const edge = horizontal ? 'to right' : 'to bottom'
  const mask = `linear-gradient(${edge}, transparent 0, black ${fade.start ? '2.5rem' : '0'}, black calc(100% - ${
    fade.end ? '2.5rem' : '0px'
  }), transparent 100%)`

  return (
    <div
      ref={ref}
      role={label ? 'group' : undefined}
      aria-label={label}
      onScroll={measure}
      style={{ maskImage: mask, WebkitMaskImage: mask }}
      className={cn(
        '[scrollbar-width:none] [&::-webkit-scrollbar]:hidden',
        horizontal ? 'overflow-x-auto overflow-y-hidden' : 'overflow-y-auto overflow-x-hidden',
        className,
      )}
    >
      <div className={contentClassName}>{children}</div>
    </div>
  )
}
