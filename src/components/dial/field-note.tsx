import { AsteriskMark } from '@/components/dial/marks'
import { cn } from '@/lib/utils'

/**
 * A note in the margin, in the hand.
 *
 * This is *not* a `MarginNote`. A MarginNote is decoration: it restates in
 * pencil something the page already sets in type, so it is `aria-hidden` and
 * dropped entirely on small screens. A FieldNote carries something the page
 * says nowhere else — a piece of the field's history, a term's origin — so it
 * is real content: readable at every width, in the accessibility tree, and
 * always attributed.
 *
 * The attribution is the whole discipline of the component. An unsourced "did
 * you know" is trivia, and trivia on a research lab's site reads as filler. A
 * sourced one is a citation set in pencil, which is exactly what a researcher
 * scribbles in a margin.
 */
export function FieldNote({
  children,
  source,
  className,
}: {
  children: React.ReactNode
  /** Where the fact comes from — a paper, a programme, a person. Required. */
  source: string
  className?: string
}) {
  return (
    <aside
      className={cn(
        // A hairline in ink down the left edge, the way a reader brackets a
        // passage they want to come back to.
        'border-ink/35 relative max-w-xs border-l py-1 pl-4',
        className,
      )}
    >
      <AsteriskMark className="absolute -top-1 -left-[7px] size-3 bg-background" />
      <p className="font-hand text-ink text-xl leading-snug">{children}</p>
      <p className="mt-2 font-mono text-[0.65rem] tracking-[0.08em] text-muted-foreground uppercase">
        {source}
      </p>
    </aside>
  )
}
