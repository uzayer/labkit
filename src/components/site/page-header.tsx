import type { CSSProperties } from 'react'

import { label, lede, pageTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

export interface PageFact {
  value: string
  label: string
}

/** Step in the header's staggered entrance (see `.enter` in globals.css). */
const step = (i: number) => ({ className: 'enter', style: { '--enter-i': i } as CSSProperties })

/**
 * The header for every page: a small label, the title, a ruled lede, and up to
 * three derived figures. It shares the page's left edge (the plain `container`),
 * so the title lines up with the list under it.
 */
export function PageHeader({
  eyebrow,
  title,
  description,
  facts,
  children,
  className,
}: {
  eyebrow?: string | null
  title: React.ReactNode
  description?: string | null
  /** Derived counts. Zero-valued facts are dropped, so an empty Lab shows none. */
  facts?: PageFact[]
  children?: React.ReactNode
  className?: string
}) {
  const shownFacts = (facts ?? []).filter((fact) => fact.value && fact.value !== '0')
  return (
    <header className={cn('container pt-16 pb-12 md:pt-28 md:pb-16', className)}>
      {eyebrow && (
        <p {...step(0)} className={cn(label, 'enter')}>
          {eyebrow}
        </p>
      )}
      <h1 {...step(1)} className={cn(pageTitle, 'enter', eyebrow && 'mt-4')}>
        {title}
      </h1>
      {(description || shownFacts.length > 0) && (
        <div {...step(2)} className="enter mt-10 flex flex-col gap-10 border-t border-border pt-6">
          {description && <p className={lede}>{description}</p>}
          {shownFacts.length > 0 && (
            // A ruled strip, one column per figure. A list, not a <dl>: it reads
            // value then label ("42 Publications").
            <ul className="flex w-fit flex-wrap border-y border-border">
              {shownFacts.map((fact, i) => (
                <li
                  key={fact.label}
                  className={cn(
                    'flex flex-col gap-1 py-4 pr-6 sm:pr-10',
                    i > 0 && 'border-l border-border pl-6',
                  )}
                >
                  <span className="font-display text-4xl leading-none tabular-nums sm:text-5xl">
                    {fact.value}
                  </span>
                  <span className="text-sm text-muted-foreground">{fact.label}</span>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      {children && (
        <div {...step(3)} className="enter">
          {children}
        </div>
      )}
    </header>
  )
}
