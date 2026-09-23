import { sectionSpacing } from '@/components/dial/editorial'
import { FaqSection } from '@/components/dial/faq-section'
import { PageHeader } from '@/components/dial/page-header'
import { ScrollRuler } from '@/components/dial/scroll-ruler'
import { AwardStamp } from '@/components/dial/award-stamp'
import {
  AwardsFilterTable,
  categoryLabels,
  type Award,
} from '@/components/dial/awards-filter-table'
import { awardFaqs } from '@/lib/dial/data/faqs'
import { displaySectionTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import { getDial } from '@/lib/dial/data/get'

export const metadata = {
  title: 'Awards',
  description:
    'Awards and recognition for the Design Inclusion and Access Lab at North South University.',
}

export default async function AwardsPage() {
  const { labAwards, toAwardRow, yearRange } = await getDial()
  // Lab-scoped Awards only; personal Awards appear on the Team Member profile.
  const dialAwards: Award[] = labAwards().map(toAwardRow)

  const featuredAwards = dialAwards.filter((a) => a.isFeatured)
  const bestPaperCount = dialAwards.filter((a) => a.category === 'best-paper').length
  const range = yearRange(dialAwards.map((a) => a.year))
  const minYear = range?.min
  const maxYear = range?.max
  return (
    <>
      <PageHeader
        eyebrow="Recognition"
        art="signal"
        title="Awards"
        description="Recognition for DIAL's work at international academic venues. Awards given to individual Team Members appear on their profiles."
        facts={[
          { value: String(dialAwards.length), label: 'Awards' },
          { value: String(bestPaperCount), label: 'Best paper' },
          ...(minYear ? [{ value: String(minYear), label: 'Since' }] : []),
        ]}
      />

      <ScrollRuler />

      {/* §2 Featured awards */}
      <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
        <h2 className={cn(displaySectionTitle, 'border-t border-border pt-6')}>Featured</h2>
        {/* Each award reads top-down as stamp, prize, paper, people: who gave
            it (the stamp line, in ink), what it was, what earned it, and who
            received it. The body and the paper used to share one grey caption
            style, and on a phone they stacked on the same edge. */}
        <ol className="mt-6 divide-y divide-border border-t border-border">
          {featuredAwards.map((award) => (
            <li
              key={`${award.title}-${award.year}`}
              className="grid grid-cols-[3.5rem_1fr] gap-x-5 gap-y-3 py-8 md:grid-cols-[6rem_1fr] md:gap-x-8"
            >
              {/* The year as a rubber stamp: an ink ring. Smaller on a phone,
                  where it sits beside the stamp line instead of above it. */}
              <p className="md:pt-1">
                <span className="border-ink/40 font-display text-ink inline-grid size-14 place-items-center rounded-full border-2 text-base tabular-nums md:size-16 md:text-lg">
                  {award.year}
                </span>
              </p>
              <div className="min-w-0">
                <AwardStamp
                  organization={award.organization}
                  category={categoryLabels[award.category]}
                />
                <h3 className="font-display mt-3 text-2xl leading-snug text-balance md:text-3xl">
                  {award.title}
                </h3>
                {award.linkedPublication && (
                  <p className="mt-3 max-w-prose border-l-2 border-border pl-3 text-pretty text-muted-foreground">
                    <span className="sr-only">For the paper </span>
                    &ldquo;{award.linkedPublication}&rdquo;
                  </p>
                )}
                <p className="mt-3 text-sm text-muted-foreground">
                  {award.recipients.join(', ')}
                  {award.externalRecipients && <> · {award.externalRecipients}</>}
                </p>
              </div>
            </li>
          ))}
        </ol>
      </section>

      <FaqSection items={awardFaqs} title="How awards are counted" />

      {/* §3 Full awards list with category filter */}
      <AwardsFilterTable awards={dialAwards} yearRange={minYear ? `${minYear}–${maxYear}` : '—'} />
    </>
  )
}
