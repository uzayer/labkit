'use client'

import { useEffect, useRef, useState } from 'react'

const round = (n: string) => String(Math.round(parseFloat(n) * 1000) / 1000)

/**
 * A colour token's current value, read off the stylesheet itself.
 *
 * The brand page prints token values from the live CSS rather than from a copy
 * of them, so the page can never drift from `globals.css` — and it re-reads
 * when the theme toggles, so dark mode shows its own inks.
 *
 * Reading the custom property directly returns whatever the CSS pipeline
 * compiled it to (`lab()` in practice), not the OKLCH it was written in. So the
 * token is resolved through relative colour syntax on a hidden probe, which the
 * browser reports back in OKLCH.
 */
export function TokenValue({ name, className }: { name: string; className?: string }) {
  const probe = useRef<HTMLSpanElement>(null)
  const [value, setValue] = useState('')

  useEffect(() => {
    const el = probe.current
    if (!el) return
    const read = () => {
      const raw = getComputedStyle(el).color
      const match = raw.match(/^oklch\(([\d.]+) ([\d.]+) ([\d.]+)(?: \/ ([\d.]+))?\)$/)
      if (!match) return setValue(raw)
      const [, l, c, h, a] = match
      const alpha = a ? ` / ${Math.round(parseFloat(a) * 100)}%` : ''
      setValue(`oklch(${round(l)} ${round(c)} ${Math.round(parseFloat(h))}${alpha})`)
    }
    read()
    const observer = new MutationObserver(read)
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] })
    return () => observer.disconnect()
  }, [name])

  return (
    <span className={className}>
      <span
        ref={probe}
        aria-hidden
        hidden
        style={{ color: `oklch(from var(${name}) l c h / alpha)` }}
      />
      {value || ' '}
    </span>
  )
}
