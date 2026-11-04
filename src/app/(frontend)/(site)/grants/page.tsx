import type { Metadata } from 'next'
import { notFound } from 'next/navigation'

import { Credits } from '@/components/site/credits'
import { OutLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import {
  GRANT_STATUS_LABELS,
  INVESTIGATOR_ROLE_LABELS,
  formatAmount,
  yearRange,
} from '@/lib/site/format'
import { label } from '@/lib/site/typography'
import { cn } from '@/utils'

export const metadata: Metadata = { title: 'Grants' }

export default async function GrantsPage() {
  const site = await getSite()
  if (!site.features.grants) notFound()
  const { grants } = site
  const active = grants.filter((g) => g.status === 'active').length

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Grants"
        description={`The funding behind ${site.labName}'s work.`}
        facts={[
          { value: String(grants.length), label: 'Grants' },
          { value: String(active), label: 'Active' },
        ]}
      />
      <Section first title="All grants">
        {grants.length === 0 ? (
          <EmptyState>No Grants yet. Grants are entered by hand in the admin panel.</EmptyState>
        ) : (
          <ul className="divide-y divide-border border-y border-border">
            {grants.map((grant) => {
              const funder = site.organizationName(grant.funder, grant.funderLabel)
              const amount = formatAmount(grant)
              const years = yearRange(grant.startDate, grant.endDate, grant.status === 'active')
              // "Name (PI)": the role reads with the name, linked or not.
              const investigators = site.investigatorsOf(grant).map((person) => ({
                ...person,
                name: person.role
                  ? `${person.name} (${INVESTIGATOR_ROLE_LABELS[person.role]})`
                  : person.name,
              }))
              return (
                <li
                  key={grant.id}
                  className="grid gap-x-8 gap-y-2 py-6 md:grid-cols-[12rem_minmax(0,1fr)]"
                >
                  <p className={cn(label, 'md:mt-2')}>
                    {[years, grant.status && GRANT_STATUS_LABELS[grant.status]]
                      .filter(Boolean)
                      .join(' · ')}
                  </p>
                  <div className="flex flex-col gap-2">
                    <h3 className="font-display text-xl leading-snug text-pretty md:text-2xl">
                      {grant.title}
                    </h3>
                    <p className="flex flex-wrap gap-x-3 text-sm text-muted-foreground">
                      {funder && <span>{funder}</span>}
                      {grant.grantNumber && <span>{grant.grantNumber}</span>}
                      {amount && <span className="text-foreground tabular-nums">{amount}</span>}
                      {grant.url && <OutLink href={grant.url}>Award page</OutLink>}
                    </p>
                    {investigators.length > 0 && (
                      <p className="text-sm text-muted-foreground">
                        <Credits people={investigators} />
                      </p>
                    )}
                    {grant.description && (
                      <p className="max-w-prose text-sm text-pretty text-muted-foreground">
                        {grant.description}
                      </p>
                    )}
                  </div>
                </li>
              )
            })}
          </ul>
        )}
      </Section>
    </>
  )
}
