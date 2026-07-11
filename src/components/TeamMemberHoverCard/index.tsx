'use client'

import { Globe, GraduationCap } from 'lucide-react'
import {
  GithubIcon as Github,
  LinkedInIcon as Linkedin,
  XIcon as Twitter,
} from '@/components/SimpleIcon'
import type { Team } from '@/payload-types'

import { Avatar, AvatarFallback /* , AvatarImage */ } from '@/components/ui/avatar'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'
import { Separator } from '@/components/ui/separator'
import { Media } from '@/components/Media'

interface TeamMemberHoverCardProps {
  teamMember: Team & { roleLabel?: string | null }
}

const getSocialIcon = (platform: string) => {
  switch (platform) {
    case 'github':
      return Github
    case 'linkedin':
      return Linkedin
    case 'x':
      return Twitter
    case 'google-scholar':
      return GraduationCap
    case 'website':
      return Globe
    default:
      return null
  }
}

const getSocialLabel = (platform: string) => {
  switch (platform) {
    case 'github':
      return 'GitHub'
    case 'linkedin':
      return 'LinkedIn'
    case 'x':
      return 'X (Twitter)'
    case 'google-scholar':
      return 'Google Scholar'
    case 'website':
      return 'Website'
    default:
      return platform
  }
}

export function TeamMemberHoverCard({ teamMember }: TeamMemberHoverCardProps) {
  const hasPhoto =
    teamMember.photo && typeof teamMember.photo !== 'string' && teamMember.photo !== null

  const initials =
    teamMember.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2) || ''

  const roleLabel = teamMember.roleLabel || teamMember.role || ''
  const hasSocials = teamMember.socials && teamMember.socials.length > 0

  return (
    <HoverCard openDelay={50}>
      <HoverCardTrigger asChild>
        <div className="flex cursor-pointer items-start gap-3">
          <Avatar className="size-10 shrink-0">
            {hasPhoto ? (
              <Media
                resource={teamMember.photo!}
                imgClassName="h-full w-full object-cover"
                alt={teamMember.name || 'Team member avatar'}
              />
            ) : (
              <AvatarFallback className="text-xs">{initials}</AvatarFallback>
            )}
          </Avatar>
          <div className="min-w-0 flex-1">
            <p className="font-normal">{teamMember.name}</p>
            {roleLabel && <p className="mt-0.5 text-sm text-muted-foreground">{roleLabel}</p>}
          </div>
        </div>
      </HoverCardTrigger>
      <HoverCardContent className="w-80">
        <div className="space-y-3">
          <div className="flex gap-4">
            <Avatar className="h-12 w-12 shrink-0">
              {hasPhoto ? (
                <Media
                  resource={teamMember.photo!}
                  imgClassName="h-full w-full object-cover"
                  alt={teamMember.name || 'Team member avatar'}
                />
              ) : (
                <AvatarFallback>{initials}</AvatarFallback>
              )}
            </Avatar>
            <div className="min-w-0 flex-1 space-y-1">
              <h4 className="text-sm font-semibold">{teamMember.name}</h4>
              {roleLabel && <p className="text-sm text-muted-foreground">{roleLabel}</p>}
            </div>
          </div>
          {hasSocials && (
            <>
              <Separator />
              <div className="flex gap-3">
                {teamMember.socials?.map((social) => {
                  const IconComponent = getSocialIcon(social.platform || '')
                  if (!IconComponent || !social.url) return null

                  return (
                    <a
                      key={social.id || social.platform}
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-xl bg-muted/80 p-3 transition-all duration-300 hover:scale-110 hover:bg-primary/10 hover:shadow-lg"
                      aria-label={`${teamMember.name}'s ${getSocialLabel(social.platform || '')}`}
                    >
                      <IconComponent className="size-5 text-muted-foreground transition-colors duration-300 hover:text-primary" />
                    </a>
                  )
                })}
              </div>
            </>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
