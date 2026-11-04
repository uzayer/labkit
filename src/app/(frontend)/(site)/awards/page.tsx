import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { Credits } from '@/components/site/credits'
import { OutLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { AWARD_CATEGORY_LABELS, groupByYear } from '@/lib/site/format'

export const metadata: Metadata = { title: 'Awards' }

export default async function AwardsPage() {
  const site = await getSite()
  if (!site.features.awards) notFound()
  const groups = groupByYear(site.awards, (award) => award.year)

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Awards"
        description={`Recognition for ${site.labName}'s people and papers.`}
        facts={[{ value: String(site.awards.length), label: 'Awards' }]}
      />
      {groups.length === 0 && (
        <Section first title="All awards">
          <EmptyState>No Awards yet. Awards are entered by hand in the admin panel.</EmptyState>
        </Section>
      )}
      {groups.map((group, i) => (
        <Section key={group.year} first={i === 0} title={String(group.year)}>
          <ul className="divide-y divide-border border-y border-border">
            {group.items.map((award) => {
              const recipients = site.recipientsOf(award)
              // Publications own their Awards (ADR-0002): the paper is found from its side.
              const papers = site.publicationsWithAward(award.id)
              const from = site.organizationName(award.organization, award.organizationLabel)
              const years = award.endYear ? `${award.year}–${award.endYear}` : null
              return (
                <li key={award.id} className="flex flex-col gap-2 py-6">
                  <h3 className="font-display text-xl leading-snug text-pretty md:text-2xl">
                    {award.title}
                  </h3>
                  <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                    {award.category && <span>{AWARD_CATEGORY_LABELS[award.category]}</span>}
                    {from && <span>{from}</span>}
                    {years && <span>{years}</span>}
                    {award.url && <OutLink href={award.url}>Announcement</OutLink>}
                  </p>
                  {recipients.length > 0 && (
                    <p className="text-sm text-muted-foreground">
                      <Credits people={recipients} />
                    </p>
                  )}
                  {papers.map((paper) => (
                    <p key={paper.id} className="text-sm">
                      For{' '}
                      <Link
                        href={`/publications/${paper.id}`}
                        className="italic underline decoration-border underline-offset-4 hover:decoration-current"
                      >
                        {paper.title}
                      </Link>
                    </p>
                  ))}
                </li>
              )
            })}
          </ul>
        </Section>
      ))}
    </>
  )
}
