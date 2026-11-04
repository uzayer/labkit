import type { Metadata } from 'next'

import { PrimaryLink, TextLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { RichText, hasContent } from '@/components/site/rich-text'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { formatDay, recruitmentWindow } from '@/lib/site/format'
import { cn } from '@/utils'

export const metadata: Metadata = { title: 'Join us' }

export default async function JoinUsPage() {
  const site = await getSite()
  const { labInfo } = site
  // Computed from today's date, so it can lag by up to the layout's revalidate hour.
  const recruitment = recruitmentWindow(labInfo.recruitment)
  const apply = labInfo.email
    ? `mailto:${labInfo.email}?subject=${encodeURIComponent(`Joining ${site.labShortName}`)}`
    : '/contact'

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title="Join us"
        description={`Who can join ${site.labName}, and how to apply.`}
      >
        {recruitment && (
          <p
            className={cn(
              'mt-8 w-fit border-l-2 py-1 pl-3',
              recruitment.state === 'open'
                ? 'border-brand text-brand'
                : 'border-border text-muted-foreground',
            )}
          >
            {recruitment.state === 'open' &&
              `Applications are open until ${formatDay(recruitment.closes)}.`}
            {recruitment.state === 'upcoming' &&
              `Applications open on ${formatDay(recruitment.opens)} and close on ${formatDay(recruitment.closes)}.`}
            {recruitment.state === 'closed' &&
              `Applications closed on ${formatDay(recruitment.closes)}.`}
          </p>
        )}
      </PageHeader>

      <Section first title="How to join">
        {hasContent(labInfo.joinUs) ? (
          <RichText data={labInfo.joinUs} />
        ) : (
          <EmptyState>
            The Lab hasn&apos;t written its Join Us page yet. It&apos;s the Join Us field in Lab
            Info, in the admin panel. Until then, get in touch to ask.
          </EmptyState>
        )}
        <div className="mt-10 flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:gap-8">
          <PrimaryLink href={apply}>Apply</PrimaryLink>
          <TextLink href="/people">Meet the people</TextLink>
        </div>
      </Section>
    </>
  )
}
