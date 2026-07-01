import type { ReactNode } from 'react'
import { GraduationCap, ExternalLink, Mail, Globe, X } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
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
  'research-staff': 'Research Staff',
  'graduate-ra': 'Graduate RA',
  'undergrad-ra': 'Undergraduate RA',
  alumni: 'Alumni',
}

const SOCIAL_META: Record<string, { label: string; icon: ReactNode }> = {
  'google-scholar': { label: 'Google Scholar', icon: <GraduationCap className="size-4" /> },
  linkedin: { label: 'LinkedIn', icon: <ExternalLink className="size-4" /> },
  github: { label: 'GitHub', icon: <ExternalLink className="size-4" /> },
  x: { label: 'X', icon: <X className="size-4" /> },
  'nsu-faculty': { label: 'NSU Faculty Page', icon: <Globe className="size-4" /> },
  'personal-site': { label: 'Website', icon: <Globe className="size-4" /> },
}

function InitialsAvatar({ name }: { name: string }) {
  const initials = name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()
  return (
    <Avatar className="size-full rounded-full border border-transparent shadow ring-1 ring-foreground/10">
      <AvatarFallback className="rounded-full bg-muted text-5xl font-semibold text-muted-foreground">
        {initials}
      </AvatarFallback>
    </Avatar>
  )
}

const MemberProfile = ({ member, className }: MemberProfileProps) => (
  <section className={cn('py-16', className)}>
    <div className="container">
      <div className="grid gap-10 md:grid-cols-[2fr_3fr]">
        {/* Portrait */}
        <div>
          {member.photo ? (
            <Avatar className="size-full rounded-full border border-transparent shadow ring-1 ring-foreground/10">
              <AvatarImage
                src={member.photo}
                alt={member.name}
                className="aspect-square object-cover object-top"
              />
              <AvatarFallback className="rounded-full bg-muted text-5xl font-semibold text-muted-foreground">
                {member.name.split(' ').map((n) => n[0]).join('').slice(0, 2).toUpperCase()}
              </AvatarFallback>
            </Avatar>
          ) : (
            <InitialsAvatar name={member.name} />
          )}
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center gap-5">
          <div className="flex flex-col gap-2">
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold">{member.name}</h1>
              <Badge variant="secondary">{ROLE_LABELS[member.role] ?? member.role}</Badge>
            </div>
            <p className="text-muted-foreground">{member.title}</p>
            <p className="text-sm text-muted-foreground">
              {member.affiliation.url ? (
                <a
                  href={member.affiliation.url}
                  className="underline underline-offset-2 hover:text-foreground transition-colors"
                >
                  {member.affiliation.name}
                </a>
              ) : (
                member.affiliation.name
              )}
            </p>
          </div>

          {member.researchInterests.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {member.researchInterests.map((interest) => (
                <Badge key={interest} variant="outline" className="text-xs">
                  {interest}
                </Badge>
              ))}
            </div>
          )}

          <p className="text-base leading-relaxed">{member.bio}</p>

          {member.awards.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {member.awards.map((award) => (
                <Badge
                  key={award.title}
                  variant="outline"
                  className="border-amber-400/60 text-amber-700 dark:text-amber-400"
                >
                  {award.title}
                </Badge>
              ))}
            </div>
          )}

          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {member.email && (
              <a
                href={`mailto:${member.email}`}
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Mail className="size-4" />
                {member.email}
              </a>
            )}
            {member.socials.map((social) => {
              const meta = SOCIAL_META[social.platform]
              if (!meta) return null
              return (
                <a
                  key={social.platform}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                >
                  {meta.icon}
                  {meta.label}
                </a>
              )
            })}
            {member.orcid && (
              <a
                href={`https://orcid.org/${member.orcid}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <Globe className="size-4" />
                ORCID
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  </section>
)

export { MemberProfile }
