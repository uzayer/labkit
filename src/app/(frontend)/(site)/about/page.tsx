import type { Metadata } from 'next'

import { TextLink } from '@/components/site/links'
import { PageHeader } from '@/components/site/page-header'
import { RichText, hasContent } from '@/components/site/rich-text'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'

export const metadata: Metadata = { title: 'About' }

export default async function AboutPage() {
  const site = await getSite()
  const { labInfo } = site
  const parent = labInfo.parentOrganization
  const founded = labInfo.foundingDate ? new Date(labInfo.foundingDate).getUTCFullYear() : null
  const collaborators = site.organizationsIn(labInfo.collaborators)
  const place = [labInfo.location?.address, labInfo.location?.city, labInfo.location?.country]
    .filter(Boolean)
    .join(', ')
  const facts = [
    {
      term: 'Part of',
      value: [parent?.department, parent?.name].filter(Boolean).join(', '),
      href: parent?.url,
    },
    { term: 'Founded', value: founded ? String(founded) : null },
    { term: 'Location', value: place },
  ].filter((fact) => fact.value)

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title={`About ${site.labShortName}`}
        description={labInfo.description}
      />

      <Section first title="The lab">
        {hasContent(labInfo.about) ? (
          <RichText data={labInfo.about} />
        ) : (
          <EmptyState>
            The Lab hasn&apos;t written its About page yet. It&apos;s the About field in Lab Info,
            in the admin panel.
          </EmptyState>
        )}
        {facts.length > 0 && (
          <dl className="mt-10 max-w-3xl text-sm">
            {facts.map((fact) => (
              <div
                key={fact.term}
                className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3"
              >
                <dt className="text-muted-foreground">{fact.term}</dt>
                <dd>
                  {fact.href ? (
                    <a
                      href={fact.href}
                      className="underline decoration-border underline-offset-4 hover:decoration-current"
                    >
                      {fact.value}
                    </a>
                  ) : (
                    fact.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        )}
      </Section>

      {collaborators.length > 0 && (
        <Section title="Collaborators" description="Institutions we work with.">
          <ul className="grid gap-x-8 border-t border-border sm:grid-cols-2 lg:grid-cols-3">
            {collaborators.map((org) => (
              <li key={org.id} className="border-b border-border py-4">
                {org.url ? (
                  <a
                    href={org.url}
                    className="underline decoration-border underline-offset-4 hover:decoration-current"
                  >
                    {org.name}
                  </a>
                ) : (
                  org.name
                )}
                {org.country && (
                  <span className="ml-2 text-sm text-muted-foreground">{org.country}</span>
                )}
              </li>
            ))}
          </ul>
        </Section>
      )}

      <Section title="Work with us">
        <div className="flex flex-col gap-3 sm:flex-row sm:gap-8">
          <TextLink href="/people">Meet the people</TextLink>
          <TextLink href="/join-us">Join the lab</TextLink>
          <TextLink href="/contact">Get in touch</TextLink>
        </div>
      </Section>
    </>
  )
}
