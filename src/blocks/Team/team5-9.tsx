'use client'

import { useMemo, useState } from 'react'
import { TabsTrigger } from '@radix-ui/react-tabs'
import { SearchIcon } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { cn } from '@/utils'
import RichText from '@/components/RichText'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

const Team5_9: React.FC<
  TeamBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const { heading, description, categories, publicContext, disableContainer } = props

  const categoryNames = useMemo(() => {
    return categories?.map((cat) => cat.name).filter(Boolean) || []
  }, [categories])

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryNames[0] || '')
  const [searchQuery, setSearchQuery] = useState('')

  const allMembers = useMemo(() => {
    if (!categories) return []

    return categories.flatMap((category) =>
      (category.teamMembers || []).map((member) => ({
        ...member,
        categoryName: category.name,
      })),
    )
  }, [categories])

  const filteredMembers = useMemo(() => {
    return allMembers.filter((member) => {
      const matchesCategory = !selectedCategory || member.categoryName === selectedCategory
      const matchesSearch =
        !searchQuery ||
        member.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        member.role?.toLowerCase().includes(searchQuery.toLowerCase())

      return matchesCategory && matchesSearch
    })
  }, [allMembers, selectedCategory, searchQuery])

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

        {categoryNames.length > 0 && (
          <div className="mt-14">
            <div className="flex flex-col justify-between gap-4 md:flex-row">
              <Tabs
                value={selectedCategory}
                onValueChange={setSelectedCategory}
                className="-mx-8 overflow-x-auto px-8"
              >
                <TabsList className="bg-background flex h-auto justify-start gap-4 md:flex-wrap">
                  {categoryNames.map((category) => (
                    <TabsTrigger
                      key={category}
                      value={category}
                      className="data-[state=active]:text-foreground relative flex flex-col items-center gap-2 overflow-visible whitespace-nowrap"
                    >
                      {category}
                      <span
                        className={cn(
                          'bg-primary absolute -bottom-1 h-0.5 w-full opacity-0',
                          selectedCategory === category && 'opacity-100',
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
                filteredMembers.map((member, idx) => {
                  const avatarUrl =
                    typeof member.avatar === 'object' && member.avatar !== null
                      ? member.avatar.url
                      : undefined

                  return (
                    <Card
                      key={member.id || idx}
                      className="bg-card/50 group border-0 backdrop-blur-sm transition-all duration-300 hover:shadow-lg"
                    >
                      <CardContent className="p-6">
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
                        {member.description && (
                          <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                            {member.description}
                          </p>
                        )}
                        {member.expertise && member.expertise.length > 0 && (
                          <div className="flex flex-wrap justify-center gap-1">
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

export default Team5_9
