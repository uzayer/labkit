import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { personJsonLd } from '@labkit/core/seo'

import { JsonLd } from '@/components/site/json-ld'
import { OutLink } from '@/components/site/links'
import { PersonAvatar } from '@/components/site/person-avatar'
import { PublicationList } from '@/components/site/publication-list'
import { ProjectList } from '@/components/site/record-lists'
import { RichText, hasContent } from '@/components/site/rich-text'
import { Section } from '@/components/site/section'
import { serverUrl } from '@/config/server'
import { getSite } from '@/lib/site'
import { AWARD_CATEGORY_LABELS, ROLE_LABELS, teamMemberName, slugOf } from '@/lib/site/format'
import { label, pageTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

type Props = { params: Promise<{ slug: string }> }

// None at build: each page renders on its first request and is then cached
// like the rest of the site, until its records change (see ../../layout.tsx).
export function generateStaticParams() {
  return []
}

const SOCIAL_LABELS: Record<string, string> = {
  'google-scholar': 'Google Scholar',
  linkedin: 'LinkedIn',
  website: 'Website',
  x: 'X',
  github: 'GitHub',
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { findPerson } = await getSite()
  const person = findPerson((await params).slug)
  if (!person) return {}
  return { title: teamMemberName(person), description: person.title }
}

export default async function PersonPage({ params }: Props) {
  const site = await getSite()
  const person = site.findPerson((await params).slug)
  if (!person) notFound()

  const name = teamMemberName(person)
  const affiliation = site.organizationName(person.affiliation, person.affiliationLabel)
  const publications = site.publicationsBy(person.id)
  const projects = site.projectsWith(person.id)
  const grants = site.grantsWith(person.id)
  const awards = site.awardsFor(person.id)
  const role =
    person.role === 'alumni'
      ? ['Alumni', person.alumniRole && `formerly ${ROLE_LABELS[person.alumniRole]}`]
          .filter(Boolean)
          .join(', ')
      : ROLE_LABELS[person.role]
  const links = [
    ...(person.socials ?? []).map((s) => ({ href: s.url, text: SOCIAL_LABELS[s.platform] })),
    person.orcid ? { href: `https://orcid.org/${person.orcid}`, text: 'ORCID' } : null,
  ].filter((link): link is { href: string; text: string } => Boolean(link?.href))

  return (
    <>
      <header className="container grid gap-10 pt-16 pb-12 md:grid-cols-[minmax(0,1fr)_auto] md:pt-28 md:pb-16">
        <div>
          <p className={label}>
            <Link href="/people" className="hover:text-foreground">
              People
            </Link>
            <span aria-hidden> / </span>
            {role}
          </p>
          <h1 className={cn(pageTitle, 'mt-4')}>{name}</h1>
          <div className="mt-8 flex flex-col gap-1 border-t border-border pt-6 text-lg">
            <p>{person.title}</p>
            {affiliation && <p className="text-muted-foreground">{affiliation}</p>}
            {person.role === 'alumni' && person.currentPosition && (
              <p className="text-muted-foreground">Now {person.currentPosition}</p>
            )}
          </div>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {person.email && (
              <a
                href={`mailto:${person.email}`}
                className="underline decoration-border underline-offset-4 hover:decoration-current"
              >
                {person.email}
              </a>
            )}
            {links.map((link) => (
              <OutLink key={link.href} href={link.href}>
                {link.text}
              </OutLink>
            ))}
          </div>
        </div>
        <PersonAvatar name={name} photo={site.mediaUrl(person.photo)} size="lg" />
      </header>

      {(hasContent(person.bio) || (person.researchInterests?.length ?? 0) > 0) && (
        <Section first title="About">
          <RichText data={person.bio} />
          {(person.researchInterests?.length ?? 0) > 0 && (
            <div className="mt-8">
              <p className={label}>Research interests</p>
              <ul className="mt-3 flex flex-wrap gap-2 text-sm">
                {person.researchInterests?.map((interest) => (
                  <li key={interest} className="rounded-full border border-border px-3 py-1">
                    {interest}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </Section>
      )}

      {publications.length > 0 && (
        <Section title="Publications">
          <PublicationList site={site} publications={publications} showYear />
        </Section>
      )}

      {projects.length > 0 && (
        <Section title="Projects">
          <ProjectList projects={projects} />
        </Section>
      )}

      {grants.length > 0 && (
        <Section title="Grants" link={{ text: 'All grants', href: '/grants' }}>
          <ul className="divide-y divide-border border-y border-border">
            {grants.map((grant) => (
              <li key={grant.id} className="py-4">
                <p className="font-display text-xl">{grant.title}</p>
                <p className="text-sm text-muted-foreground">
                  {site.organizationName(grant.funder, grant.funderLabel)}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      {awards.length > 0 && (
        <Section title="Awards" link={{ text: 'All awards', href: '/awards' }}>
          <ul className="divide-y divide-border border-y border-border">
            {awards.map((award) => (
              <li key={award.id} className="py-4">
                <p className="font-display text-xl">{award.title}</p>
                <p className="text-sm text-muted-foreground">
                  {[
                    award.year,
                    award.category && AWARD_CATEGORY_LABELS[award.category],
                    site.organizationName(award.organization, award.organizationLabel),
                  ]
                    .filter(Boolean)
                    .join(' · ')}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      )}

      <JsonLd
        data={personJsonLd(site.populatedMember(person), {
          siteUrl: serverUrl,
          url: `${serverUrl}/people/${slugOf(person)}`,
        })}
      />
    </>
  )
}
