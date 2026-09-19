import { SectionHeader, sectionSpacing } from '@/components/editorial'
import { ExpandableList, type ExpandableItem } from '@/components/expandable-list'
import { cn } from '@/lib/utils'

/**
 * A short set of questions, placed on the page that prompts them. Deliberately
 * not one FAQ page: the answer belongs next to the thing it is about.
 *
 * All items start closed — the page's own content comes first.
 */
export function FaqSection({
  title = 'Questions',
  label = 'Good to know',
  items,
  className,
}: {
  title?: string
  label?: string
  items: ExpandableItem[]
  className?: string
}) {
  if (items.length === 0) return null
  return (
    <section className={cn('container', sectionSpacing, className)}>
      <SectionHeader label={label} title={title} className="mb-6" />
      <ExpandableList items={items} defaultOpen={null} className="max-w-3xl" />
    </section>
  )
}
