'use client'

import { useState, useMemo } from 'react'
import { TabsTrigger } from '@radix-ui/react-tabs'
import { SearchIcon } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsList } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import RichText from '@/components/RichText'
import { cn } from '@/utils'
import type { TeamBlock as TeamBlockProps } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

const Team9: React.FC<
  TeamBlockProps & { publicContext: PublicContextProps; disableContainer?: boolean }
> = (props) => {
  const { heading, description, categories, publicContext, disableContainer } = props

  // Extract category names from the categories array
  const categoryNames = useMemo(() => {
    return categories?.map((cat) => cat.name).filter(Boolean) || []
  }, [categories])

  const [selectedCategory, setSelectedCategory] = useState<string>(categoryNames[0] || '')
  const [searchQuery, setSearchQuery] = useState('')

  // Flatten all team members from all categories with their category info
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
                    <div
                      key={member.id || idx}
                      className="border-border bg-background rounded-2xl border p-7 text-center"
                    >
                      <Avatar className="border-border mx-auto size-28 border">
                        {avatarUrl && <AvatarImage src={avatarUrl} alt={member.name || ''} />}
                        <AvatarFallback className="text-2xl font-bold">
                          {member.name
                            ? member.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')
                                .toUpperCase()
                            : '?'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="mt-6 flex flex-col justify-center">
                        <p className="text-primary text-xl font-medium">{member.name}</p>
                        <p className="text-muted-foreground text-sm">{member.role}</p>
                      </div>
                      <Separator className="from-background via-border to-background my-6 bg-linear-to-r" />
                      <p className="text-muted-foreground text-sm">
                        {member.description || 'No description provided'}
                      </p>
                    </div>
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

export default Team9
