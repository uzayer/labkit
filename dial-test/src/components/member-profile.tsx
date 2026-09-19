import { CropMarks, Squiggle } from '@/components/marks'
import { InitialTile } from '@/components/initial-tile'
import { OptionalImage } from '@/components/optional-image'
import { RisoArt } from '@/components/riso'
import { enterStep } from '@/lib/motion'
import { label, pageTitle } from '@/lib/typography'
import { cn } from '@/lib/utils'

export type Social = {
  platform: 'google-scholar' | 'linkedin' | 'github' | 'x' | 'nsu-faculty' | 'personal-site'
  url: string
}

export type MemberAward = { title: string }

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
  director: 'Director',
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

/** Team Member profile header: the same shape as PageHeader, with a portrait. */
const MemberProfile = ({ member, className }: MemberProfileProps) => {
  const links = [
    ...member.socials.map((s) => ({ label: SOCIAL_LABELS[s.platform], href: s.url, external: true })),
    ...(member.orcid ? [{ label: 'ORCID', href: `https://orcid.org/${member.orcid}`, external: true }] : []),
  ]

  return (
    <header className={cn('relative isolate container pt-16 pb-12 md:pt-24 md:pb-16', className)}>
      <CropMarks className="ink-mark-soft top-8 md:top-10" />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 -right-5 -z-10 w-[26rem] overflow-x-clip overflow-y-visible max-lg:hidden xl:w-[32rem]"
      >
        <RisoArt
          variant="bloom"
          className="absolute -top-10 -right-32 size-[34rem] opacity-90 xl:-right-36 xl:size-[40rem]"
        />
      </div>
      <p className={cn(label, 'enter')} style={enterStep(0)}>
        {ROLE_LABELS[member.role] ?? member.role}
      </p>
      <div className="enter relative mt-4 w-fit" style={enterStep(1)}>
        <h1 className={pageTitle}>{member.name}</h1>
        <Squiggle className="ink-mark mt-1 max-w-md" />
      </div>

      <div className="relative mt-10 grid gap-10 pt-6 md:grid-cols-[minmax(0,16rem)_1fr] md:gap-16">
        <span aria-hidden className="ink-rule enter-rule absolute inset-x-0 top-0 h-px" style={enterStep(2)} />
        {member.photo ? (
          <span className="enter relative block w-full max-w-64" style={enterStep(3)}>
            {/* `tape` is the strip itself, laid over the corner of a relative
                parent — never applied to the frame, which would collapse it,
                and passed as `overlay` so it comes down with a failed photo. */}
            <OptionalImage
              src={member.photo}
              alt={member.name}
              overlay={<span aria-hidden className="tape -top-2.5 left-6 z-10" />}
              frameClassName="aspect-[4/5] w-full -rotate-1 rounded-sm"
              className="h-full w-full object-cover object-top"
              fallback={<InitialTile name={member.name} className="aspect-[4/5] h-auto w-full rounded-lg font-display text-7xl" />}
            />
          </span>
        ) : (
          // No photograph: the printed initial tile the roster already uses,
          // rather than a grey box with a letter in it.
          <InitialTile
            name={member.name}
            className="aspect-[4/5] h-auto w-full max-w-64 rounded-lg font-display text-7xl max-md:hidden"
          />
        )}

        <div className="enter flex max-w-prose flex-col" style={enterStep(4)}>
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

          {member.bio && <p className="mt-6 text-pretty leading-relaxed text-muted-foreground md:text-lg">{member.bio}</p>}

          <dl className="mt-8 text-sm">
            {member.researchInterests.length > 0 && (
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
                <dt className="text-muted-foreground">Interests</dt>
                <dd>{member.researchInterests.join(', ')}</dd>
              </div>
            )}
            {member.awards.length > 0 && (
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-t border-border py-3">
                <dt className="text-muted-foreground">Awards</dt>
                <dd>
                  <ul className="flex flex-col gap-1">
                    {member.awards.map((award) => (
                      <li key={award.title}>{award.title}</li>
                    ))}
                  </ul>
                </dd>
              </div>
            )}
            {(member.email || links.length > 0) && (
              <div className="grid grid-cols-[7rem_1fr] gap-4 border-y border-border py-3">
                <dt className="text-muted-foreground">Elsewhere</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1">
                  {member.email && (
                    <a href={`mailto:${member.email}`} className={linkClass}>
                      {member.email}
                    </a>
                  )}
                  {links.map((link) => (
                    <a key={link.href} href={link.href} target="_blank" rel="noopener noreferrer" className={linkClass}>
                      {link.label}
                    </a>
                  ))}
                </dd>
              </div>
            )}
          </dl>
        </div>
      </div>
    </header>
  )
}

export { MemberProfile }
