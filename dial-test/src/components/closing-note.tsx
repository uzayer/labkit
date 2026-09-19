import { TextLink } from '@/components/editorial'
import { displaySectionTitle } from '@/lib/typography'
import { cn } from '@/lib/utils'

interface ClosingNoteProps {
  heading: string
  links: { text: string; href: string }[]
  className?: string
}

/**
 * Quiet end-of-page signpost: a ruled line and a sentence, not a grey
 * billboard. The first link is the primary next step.
 */
const ClosingNote = ({ heading, links, className }: ClosingNoteProps) => (
  <section className={cn('container py-24', className)}>
    <div data-reveal className="relative flex flex-col gap-6 pt-10 md:flex-row md:items-end md:justify-between">
      <span aria-hidden className="reveal-rule absolute inset-x-0 top-0 h-px bg-border" />
      <h2 className={cn(displaySectionTitle, 'reveal-item max-w-xl text-balance')}>{heading}</h2>
      <div className="reveal-item flex flex-wrap gap-x-8 gap-y-3">
        {links.map((link, i) => (
          <TextLink
            key={link.href}
            href={link.href}
            className={cn('text-base', i > 0 && 'text-muted-foreground hover:text-foreground')}
          >
            {link.text}
          </TextLink>
        ))}
      </div>
    </div>
  </section>
)

export { ClosingNote }
