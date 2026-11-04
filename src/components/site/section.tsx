import { label as labelClass, sectionSpacing, sectionTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

import { TextLink } from './links'

/**
 * A page section: a ruled header (label, title, optional link) and its
 * content, on the plain `container` so every section shares one left edge.
 */
export function Section({
  label,
  title,
  description,
  link,
  first,
  children,
  className,
}: {
  label?: string
  title: string
  description?: string | null
  link?: { text: string; href: string }
  /** The first section under a page header, whose foot is the gap already. */
  first?: boolean
  children: React.ReactNode
  className?: string
}) {
  return (
    <section className={cn('container', sectionSpacing, first && 'pt-0 md:pt-0', className)}>
      <div className="mb-8 flex flex-col justify-between gap-4 border-t border-border pt-6 md:flex-row md:items-end">
        <div className="max-w-2xl">
          {label && <p className={cn(labelClass, 'mb-3')}>{label}</p>}
          <h2 className={sectionTitle}>{title}</h2>
          {description && (
            <p className="mt-4 max-w-prose text-pretty text-muted-foreground md:text-lg">
              {description}
            </p>
          )}
        </div>
        {link && <TextLink href={link.href}>{link.text}</TextLink>}
      </div>
      {children}
    </section>
  )
}

/**
 * What a list says before the Lab has added anything to it. A fresh Lab sees
 * these everywhere, so they say what goes here and where it comes from.
 */
export function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <p className="max-w-prose border-y border-dashed border-border py-8 text-pretty text-muted-foreground">
      {children}
    </p>
  )
}
