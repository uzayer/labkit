'use client'

import { useMemo, useState } from 'react'
import { TabsTrigger } from '@radix-ui/react-tabs'
import { SearchIcon, Github, Linkedin, Twitter, GraduationCap, Globe } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { cn } from '@/utilities/index'
import RichText from '@/components/RichText'
import type { Team } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

type TeamDialClientProps = {
  teamMembers: Team[]
  rolesToDisplay: string[]
  heading?: string | null
  description?: any
  disableContainer?: boolean
  publicContext: PublicContextProps
}

const roleLabels: Record<string, string> = {
  director: 'Director',
  faculty: 'Faculty Member',
  'graduate-ra': 'Graduate RA',
  'undergraduate-ra': 'Undergraduate RA',
  alumni: 'Alumni',
  'interdisciplinary-collaborator': 'Interdisciplinary Collaborator',
  'external-collaborator': 'External Collaborator',
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

export const TeamDialClient: React.FC<TeamDialClientProps> = ({
  teamMembers,
  rolesToDisplay,
  heading,
  description,
  disableContainer,
  publicContext,
}) => {
  const roleNames = useMemo(() => {
    return rolesToDisplay
      .map((role) => ({
        value: role,
        label: roleLabels[role] || role,
      }))
      .filter((r) => r.label)
  }, [rolesToDisplay])

  const [selectedRole, setSelectedRole] = useState<string>(roleNames[0]?.value || '')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredMembers = useMemo(() => {
    return teamMembers.filter((member) => {
      const matchesRole = !selectedRole || (member.role && member.role === selectedRole)
      const matchesSearch =
        !searchQuery ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (member.bio && JSON.stringify(member.bio).toLowerCase().includes(searchQuery.toLowerCase()))

      return matchesRole && matchesSearch
    })
  }, [teamMembers, selectedRole, searchQuery])

  const getPhotoUrl = (photo: Team['photo']) => {
    if (!photo) return undefined
    if (typeof photo === 'string') return undefined
    if (typeof photo === 'object' && 'url' in photo) return photo.url
    return undefined
  }

  const getBioExcerpt = (bio: Team['bio']) => {
    if (!bio) return null
    // Extract plain text from Lexical JSON structure (bio is richText but we display as plain text)
    const extractText = (node: any): string => {
      if (!node) return ''
      if (typeof node === 'string') return node
      if (node.type === 'text' && node.text) return node.text
      if (node.children && Array.isArray(node.children)) {
        return node.children.map(extractText).join(' ')
      }
      return ''
    }
    // Extract from root.children array (Lexical structure)
    const root = bio.root || bio
    const children = root.children || []
    const text = children.map(extractText).join(' ').trim()
    // Return first 150 characters
    return text.length > 150 ? text.substring(0, 150) + '...' : text
  }

  return (
    <section className="py-32">
      <div className={!disableContainer ? 'container' : ''}>
        <div className="flex flex-col gap-8">
          {heading && <h2 className="text-4xl md:text-5xl">{heading}</h2>}
          {description && (
            <div className="text-muted-foreground max-w-2xl">
              <RichText publicContext={publicContext} content={description} />
            </div>
          )}
        </div>

        {roleNames.length > 0 && (
          <div className="mt-14">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <Tabs
                value={selectedRole}
                onValueChange={setSelectedRole}
                className="-mx-8 overflow-x-auto px-8"
              >
                <TabsList className="bg-background flex h-auto justify-start gap-4 md:flex-wrap">
                  {roleNames.map((role) => (
                    <TabsTrigger
                      key={role.value}
                      value={role.value}
                      className="data-[state=active]:text-foreground relative flex flex-col items-center gap-2 overflow-visible whitespace-nowrap"
                    >
                      {role.label}
                      <span
                        className={cn(
                          'bg-primary absolute -bottom-1 h-0.5 w-full opacity-0',
                          selectedRole === role.value && 'opacity-100',
                        )}
                      />
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
              <div className="relative h-fit">
                <Input
                  className="pl-9"
                  placeholder="Search members"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
                <div className="text-muted-foreground/80 absolute inset-y-0 flex items-center justify-center pl-3">
                  <SearchIcon className="size-4" />
                </div>
              </div>
            </div>

            <div className="mt-9 grid gap-8 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => {
                  const photoUrl = getPhotoUrl(member.photo)
                  const bioExcerpt = getBioExcerpt(member.bio)

                  return (
                    <Card
                      key={member.id}
                      className="bg-card/50 group border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                    >
                      <CardContent className="p-6">
                        <div className="relative mb-6">
                          <Avatar className="mx-auto h-20 w-20">
                            {photoUrl && <AvatarImage src={photoUrl} alt={member.name || ''} />}
                            <AvatarFallback className="from-primary/20 to-secondary/20 text-primary bg-gradient-to-br text-2xl font-bold">
                              {member.name
                                ? member.name
                                    .split(' ')
                                    .map((n) => n[0])
                                    .join('')
                                : '?'}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                        <div className="mb-4 text-center">
                          {member.name && (
                            <h3 className="group-hover:text-primary mb-1 text-lg font-semibold transition-colors">
                              {member.name}
                            </h3>
                          )}
                          {member.title && (
                            <p className="text-primary mb-2 text-sm font-medium">{member.title}</p>
                          )}
                        </div>
                        {bioExcerpt && (
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                            {bioExcerpt}
                          </p>
                        )}
                        {member.researchInterests && member.researchInterests.length > 0 && (
                          <div className="mb-4 flex flex-wrap justify-center gap-1">
                            {member.researchInterests.map((interest, idx) => {
                              const interestTitle =
                                typeof interest === 'object' ? interest.title : String(interest) // Ensure it's a string if it's just an ID
                              const interestId =
                                typeof interest === 'object' ? interest.id : `interest-${idx}` // Fallback key if not an object

                              return (
                                <Badge
                                  key={interestId}
                                  variant="secondary"
                                  className="bg-muted/50 px-2 py-1 text-xs"
                                >
                                  {interestTitle}
                                </Badge>
                              )
                            })}
                          </div>
                        )}
                        {member.socials && member.socials.length > 0 && (
                          <div className="flex justify-center gap-3">
                            {member.socials.map((social) => {
                              const IconComponent = getSocialIcon(social.platform)
                              if (!IconComponent) return null

                              return (
                                <a
                                  key={social.id || social.platform}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="bg-muted/80 hover:bg-primary/10 rounded-xl p-3 transition-all duration-300 hover:scale-110 hover:shadow-lg"
                                  aria-label={`${member.name}'s ${getSocialLabel(social.platform)}`}
                                >
                                  <IconComponent className="text-muted-foreground hover:text-primary size-5 transition-colors duration-300" />
                                </a>
                              )
                            })}
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )
                })
              ) : (
                <div className="col-span-full py-12 text-center">
                  <p className="text-muted-foreground text-lg">No team members found</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
