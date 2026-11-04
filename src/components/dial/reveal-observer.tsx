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
    const selector = '[data-reveal]:not([data-revealed])'
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

    const observeTree = (root: ParentNode) => {
      if (root instanceof Element && root.matches(selector)) observer.observe(root)
      root.querySelectorAll(selector).forEach((element) => observer.observe(element))
    }

    observeTree(document)
    // Sections that mount later (Suspense boundaries, client-only branches)
    // would otherwise stay hidden. Inspect only the inserted subtrees rather
    // than rescanning the whole document for every DOM insertion.
    const mutations = new MutationObserver((records) => {
      for (const record of records) {
        for (const node of record.addedNodes) {
          if (node instanceof Element) observeTree(node)
        }
      }
    })
    mutations.observe(document.body, { childList: true, subtree: true })

    // Keyboard focus can land on a link in a section that has not revealed
    // yet (inside the observer's bottom margin, or jumped to in one move), and
    // an opacity-0 link with focus is invisible focus. Reveal it on focus.
    const revealFocused = (event: FocusEvent) => {
      if (!(event.target instanceof Element)) return
      // Every enclosing section, in case reveals are nested.
      let section = event.target.closest<HTMLElement>(selector)
      while (section) {
        section.dataset.revealed = ''
        observer.unobserve(section)
        section = section.parentElement?.closest<HTMLElement>(selector) ?? null
      }
    }
    document.addEventListener('focusin', revealFocused)
    return () => {
      observer.disconnect()
      mutations.disconnect()
      document.removeEventListener('focusin', revealFocused)
    }
  }, [])

  return null
}
