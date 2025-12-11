import React from 'react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
// import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'
// import { Media } from '@/components/Media'

const Team5: React.FC<
  TeamBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const {
    heading,
    description,
    teamMembers,
    enableCta,
    ctaHeading,
    ctaDescription,
    ctaLink,
    publicContext,
    disableContainer,
  } = props

  return (
    <section className="from-background to-muted/20 bg-gradient-to-b py-24">
      <div className={!disableContainer ? 'container mx-auto px-4' : ''}>
        {/* Header Section */}
        <div className="mb-16 text-center">
          {heading && (
            <h2 className="mb-6 text-4xl font-bold tracking-tight lg:text-5xl">{heading}</h2>
          )}
          {description && (
            <div className="text-muted-foreground mx-auto max-w-3xl text-xl leading-relaxed">
              <RichText publicContext={publicContext} content={description} />
            </div>
          )}
        </div>

        {/* Team Grid */}
        {teamMembers && teamMembers.length > 0 && (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {teamMembers.map((member, index) => {
              const avatarUrl =
                typeof member.avatar === 'object' && member.avatar !== null
                  ? member.avatar.url
                  : undefined

              return (
                <Card
                  key={member.id || index}
                  className="bg-card/50 group border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                >
                  <CardContent className="p-6">
                    {/* Avatar */}
                    <div className="relative mb-6">
                      <Avatar className="mx-auto h-20 w-20">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={member.name || ''} />}
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

                    {/* Member Info */}
                    <div className="mb-4 text-center">
                      {member.name && (
                        <h3 className="group-hover:text-primary mb-1 text-lg font-semibold transition-colors">
                          {member.name}
                        </h3>
                      )}
                      {member.role && (
                        <p className="text-primary mb-2 text-sm font-medium">{member.role}</p>
                      )}
                      {member.department && (
                        <Badge variant="outline" className="text-xs">
                          {member.department}
                        </Badge>
                      )}
                    </div>

                    {/* Description */}
                    {member.description && (
                      <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                        {member.description}
                      </p>
                    )}

                    {/* Expertise Tags */}
                    {member.expertise && member.expertise.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {member.expertise.map((item, skillIndex) => (
                          <Badge
                            key={skillIndex}
                            variant="secondary"
                            className="bg-muted/50 px-2 py-1 text-xs"
                          >
                            {item.skill}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              )
            })}
          </div>
        )}

        {/* Bottom CTA - Only render if enabled */}
        {enableCta && (
          <div className="mt-16 border-t pt-16 text-center">
            {ctaHeading && <h3 className="mb-4 text-2xl font-semibold">{ctaHeading}</h3>}
            {ctaDescription && (
              <p className="text-muted-foreground mx-auto mb-6 max-w-2xl">{ctaDescription}</p>
            )}
            {ctaLink && (
              <CMSLink
                publicContext={publicContext}
                {...ctaLink}
                appearance="default"
                size="lg"
                className="px-8"
              />
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default Team5
