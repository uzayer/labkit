'use client'

import { useEffect } from 'react'

/**
 * Marks `[data-reveal]` elements with `data-revealed` the first time they come
 * into view, which lets CSS play their one-shot entrance (globals.css,
 * "Section reveal"). Re-scans on every DOM insertion (route
 * changes included), so no section is left hidden.
 */
export function RevealObserver() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue
          ;(entry.target as HTMLElement).dataset.revealed = ''
          observer.unobserve(entry.target)
        }
      },
      { rootMargin: '0px 0px -100px 0px' },
    )
    const scan = () =>
      document.querySelectorAll('[data-reveal]:not([data-revealed])').forEach((el) => observer.observe(el))
    scan()
    // Sections that mount later (Suspense boundaries, client-only branches)
    // would otherwise stay hidden, so watch for them too.
    const mutations = new MutationObserver(scan)
    mutations.observe(document.body, { childList: true, subtree: true })
    return () => {
      observer.disconnect()
      mutations.disconnect()
    }
  }, [])

  return null
}
