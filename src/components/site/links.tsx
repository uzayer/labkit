import { ArrowRight, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

import { cn } from '@/utils'

const isInternal = (href: string) => href.startsWith('/')

/**
 * The site's secondary action: a word and an arrow. Internal links get the
 * forward arrow, external ones the outward arrow and a new tab.
 */
export function TextLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const classes = cn(
    'group inline-flex w-fit shrink-0 items-center gap-1.5 text-sm text-foreground underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current',
    className,
  )
  if (isInternal(href)) {
    return (
      <Link href={href} className={classes}>
        {children}
        <ArrowRight
          aria-hidden
          className="ease-snappy size-4 transition-transform duration-200 group-hover:translate-x-0.5 motion-reduce:transition-none"
        />
      </Link>
    )
  }
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={classes}>
      {children}
      <ArrowUpRight aria-hidden className="size-4 opacity-70" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}

/** The one filled action per page (Apply, Get in touch). Everything else is a TextLink. */
export function PrimaryLink({
  href,
  children,
  className,
}: {
  href: string
  children: React.ReactNode
  className?: string
}) {
  const classes = cn(
    'ease-snappy inline-flex w-fit items-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform duration-150 active:scale-[0.97] motion-reduce:transition-none',
    className,
  )
  const content = (
    <>
      {children}
      <ArrowRight aria-hidden className="size-4" />
    </>
  )
  // Internal routes navigate client-side; mailto: and external URLs stay plain anchors.
  return isInternal(href) ? (
    <Link href={href} className={classes}>
      {content}
    </Link>
  ) : (
    <a href={href} className={classes}>
      {content}
    </a>
  )
}

/** A plain outbound link in a list of facts (DOI, PDF, a project's site). */
export function OutLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-0.5 font-medium text-foreground underline decoration-border underline-offset-4 hover:decoration-current"
    >
      {children}
      <ArrowUpRight aria-hidden className="size-3.5" />
      <span className="sr-only">(opens in a new tab)</span>
    </a>
  )
}
