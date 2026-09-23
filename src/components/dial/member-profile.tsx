import { AwardList, type AwardListItem } from '@/components/dial/award-list'
import { CropMarks } from '@/components/dial/marks'
import { MountedPortrait } from '@/components/dial/mounted-portrait'
import { RisoArt } from '@/components/dial/riso'
import { enterStep } from '@/lib/dial/motion'
import { label } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'

export type Social = {
  platform: 'google-scholar' | 'linkedin' | 'github' | 'x' | 'nsu-faculty' | 'personal-site'
  url: string
}

export type MemberAward = AwardListItem

export interface MemberProfileData {
  name: string
  title: string
  role: 'director' | 'faculty' | 'research-staff' | 'graduate-ra' | 'undergrad-ra' | 'alumni'
  affiliation: { name: string; url?: string }
  photo?: string
  bio: string
  researchInterests: string[]
  email?: string
  orcid?: string
  socials: Social[]
  awards: MemberAward[]
}

interface MemberProfileProps {
  member: MemberProfileData
  className?: string
}

const ROLE_LABELS: Record<string, string> = {
  director: 'Principal Investigator',
  faculty: 'Faculty',
  'research-staff': 'Research staff',
  'graduate-ra': 'Graduate research assistant',
  'undergrad-ra': 'Undergraduate research assistant',
  alumni: 'Alumni',
}

const SOCIAL_LABELS: Record<Social['platform'], string> = {
  'google-scholar': 'Google Scholar',
  linkedin: 'LinkedIn',
  github: 'GitHub',
  x: 'X',
  'nsu-faculty': 'NSU faculty page',
  'personal-site': 'Website',
}

const linkClass =
  'underline decoration-border underline-offset-[6px] transition-colors hover:text-foreground hover:decoration-current'

/** Team Member profile header: the People page's PI section, as a page header. */
const MemberProfile = ({ member, className }: MemberProfileProps) => {
  const links = [
    ...member.socials.map((s) => ({
      label: SOCIAL_LABELS[s.platform],
      href: s.url,
      external: true,
    })),
    ...(member.orcid
      ? [{ label: 'ORCID', href: `https://orcid.org/${member.orcid}`, external: true }]
      : []),
  ]

  return (
    <header className={cn('relative isolate container pt-16 pb-12 md:pt-24 md:pb-16', className)}>
      <CropMarks className="ink-mark-soft top-8 md:top-10" />
      {/* A mark in the margin beside the name, not a backdrop: sized to the
          gutter the prose measure leaves, so it never sits under the bio. */}
      <RisoArt
        variant="bloom"
        className="pointer-events-none absolute top-20 right-0 -z-10 size-56 opacity-80 max-lg:hidden md:top-28 xl:size-64"
      />

      {/* The PI section's shape on the People page: the mounted portrait on
          the left, the record beside it, so the two read as one person. One
          grid, one column of record — the wrappers that only carried an
          entrance step are gone, each piece takes its own.

          On a phone the portrait spans the column exactly. Capped at 20rem it
          stopped a few pixels short of the text's right edge, so the card and
          the words under it never quite lined up on either side. */}
      <div className="grid gap-10 md:grid-cols-[minmax(0,20rem)_minmax(0,1fr)] md:gap-16">
        <MountedPortrait
          src={member.photo}
          name={member.name}
          priority
          className={cn('enter max-md:max-w-none', !member.photo && 'max-md:hidden')}
          style={enterStep(2)}
        />

        <div className="max-w-prose min-w-0">
          <p className={cn(label, 'enter')} style={enterStep(0)}>
            {ROLE_LABELS[member.role] ?? member.role}
          </p>
          <h1
            className="enter font-display mt-3 text-4xl leading-tight tracking-tight text-balance md:text-5xl"
            style={enterStep(1)}
          >
            {member.name}
          </h1>

          <div className="enter mt-2" style={enterStep(3)}>
            <p className="text-lg">{member.title}</p>
            <p className="mt-1 text-muted-foreground">
              {member.affiliation.url ? (
                <a href={member.affiliation.url} className={linkClass}>
                  {member.affiliation.name}
                </a>
              ) : (
                member.affiliation.name
              )}
            </p>

            {member.bio && (
              <p className="mt-6 leading-relaxed text-pretty text-muted-foreground md:text-lg">
                {member.bio}
              </p>
            )}

            <dl className="mt-8 text-sm">
              {member.researchInterests.length > 0 && (
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
                  <dt className="text-muted-foreground">Interests</dt>
                  <dd>{member.researchInterests.join(', ')}</dd>
                </div>
              )}
              {(member.email || links.length > 0) && (
                <div className="grid grid-cols-[7rem_1fr] gap-4 border-y border-border py-3">
                  <dt className="text-muted-foreground">Elsewhere</dt>
                  <dd className="flex min-w-0 flex-wrap gap-x-4 gap-y-1">
                    {member.email && (
                      <a href={`mailto:${member.email}`} className={cn(linkClass, 'break-all')}>
                        {member.email}
                      </a>
                    )}
                    {links.map((link) => (
                      <a
                        key={link.href}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={linkClass}
                      >
                        {link.label}
                      </a>
                    ))}
                  </dd>
                </div>
              )}
            </dl>

            {/* Awards are their own ruled list, not one more row of the ledger
                above: each has four parts worth reading down (name, body,
                year, paper), which a single cell of joined text could not. */}
            {member.awards.length > 0 && (
              <section className="mt-10">
                <h2 className={label}>Awards</h2>
                <AwardList awards={member.awards} className="mt-3" />
              </section>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

export { MemberProfile }
