import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/site/page-header'
import { PersonAvatar } from '@/components/site/person-avatar'
import { EmptyState, Section } from '@/components/site/section'
import { getSite, type Site } from '@/lib/site'
import { ROLE_LABELS, teamMemberName, slugOf } from '@/lib/site/format'
import { groupPeople } from '@/lib/site/people'
import type { Team } from '@/payload-types'

export const metadata: Metadata = { title: 'People' }

export default async function PeoplePage() {
  const site = await getSite()
  const groups = groupPeople(site.listedTeam)
  const current = site.listedTeam.filter((person) => person.role !== 'alumni').length
  const alumni = site.listedTeam.length - current

  return (
    <>
      <PageHeader
        eyebrow="Lab"
        title="People"
        description={`The researchers, students and collaborators of ${site.labName}.`}
        facts={[
          { value: String(current), label: 'Members' },
          { value: String(alumni), label: 'Alumni' },
        ]}
      />
      {groups.length === 0 && (
        <Section first title="The team">
          <EmptyState>
            No one is listed yet. Team Members appear here once they are added in the admin panel
            and marked to show on the website.
          </EmptyState>
        </Section>
      )}
      {groups.map((group, i) => (
        <Section key={group.title} first={i === 0} title={group.title}>
          <ul className="grid gap-x-8 sm:grid-cols-2 lg:grid-cols-3">
            {group.members.map((person) => (
              <li key={person.id} className="border-t border-border">
                <PersonEntry site={site} person={person} />
              </li>
            ))}
          </ul>
        </Section>
      ))}
    </>
  )
}

function PersonEntry({ site, person }: { site: Site; person: Team }) {
  const name = teamMemberName(person)
  const isAlum = person.role === 'alumni'
  const affiliation = site.organizationName(person.affiliation, person.affiliationLabel)
  const details = isAlum
    ? [
        person.alumniRole ? ROLE_LABELS[person.alumniRole] : null,
        person.alumniYear ? `until ${person.alumniYear}` : null,
      ]
    : [affiliation]
  return (
    <div className="group flex gap-4 py-5">
      <PersonAvatar name={name} photo={site.mediaUrl(person.photo)} className="mt-1" />
      <div className="flex min-w-0 flex-col gap-1">
        <Link
          href={`/people/${slugOf(person)}`}
          className="font-display w-fit text-xl leading-snug underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
        >
          {name}
        </Link>
        {person.title && (
          <p className="text-sm text-pretty text-muted-foreground">{person.title}</p>
        )}
        {details.some(Boolean) && (
          <p className="text-xs text-muted-foreground">{details.filter(Boolean).join(' · ')}</p>
        )}
        {isAlum && person.currentPosition && (
          <p className="text-xs text-muted-foreground">Now: {person.currentPosition}</p>
        )}
        {person.onLeave && <p className="text-xs text-muted-foreground">On leave</p>}
      </div>
    </div>
  )
}
