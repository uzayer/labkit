'use client'

import { ArrowRight } from 'lucide-react'
import { Fragment } from 'react'
import Link from 'next/link'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import RichText from '@/components/RichText'
import { getLinkHref } from '@/utilities/getLinkHref'
import type { ResourcesBlock, Media } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

type Resources4Props = ResourcesBlock & {
  publicContext: PublicContextProps
}

const Resources4: React.FC<Resources4Props> = ({ label, richText, resources, publicContext }) => {
  // Helper function to get avatar URL from Media object
  const getAvatarUrl = (avatar: string | Media | null | undefined): string | null => {
    if (!avatar) return null
    if (typeof avatar === 'string') return avatar
    return avatar.url || null
  }

  // Helper function to format date
  const formatDate = (dateString: string | null | undefined): string => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  if (!resources || resources.length === 0) return null

  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col items-start justify-between gap-5 lg:flex-row lg:gap-2">
          <div className="flex w-full max-w-56 items-center gap-3 text-sm">
            <span className="bg-primary size-2 rounded-full"></span>
            {label || 'Resources'}
          </div>
          <div className="w-full min-w-0 flex-1">
            {richText && (
              <RichText
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                className="text-3xl"
                overrideStyle={{
                  h2: 'text-3xl mb-0',
                  p: 'text-3xl mb-0',
                }}
              />
            )}
            <div className={richText ? 'mt-14' : ''}>
              <Separator />
              {resources.map((item, idx) => {
                const avatarUrl = getAvatarUrl(item.avatar)
                const formattedDate = formatDate(item.date)
                const linkHref = getLinkHref(item.link, publicContext?.locale)

                if (!linkHref) return null

                return (
                  <Fragment key={item.id || idx}>
                    <Link
                      href={linkHref.href}
                      {...(linkHref.target && { target: linkHref.target })}
                      {...(linkHref.rel && { rel: linkHref.rel })}
                      className="lg:hover:bg-muted group flex flex-col justify-between gap-10 py-6 transition-all duration-400 lg:flex-row lg:items-center"
                    >
                      <div className="flex items-center gap-2 text-lg transition-all duration-400 lg:group-hover:translate-x-8">
                        <p className="text-primary inline text-pretty">
                          {item.title}
                          <ArrowRight className="lg:group-hover:text-primary ml-2 inline size-4 shrink-0 opacity-0 transition-all duration-400 lg:group-hover:opacity-100" />
                        </p>
                      </div>
                      <div className="flex w-full items-center justify-between transition-all duration-400 lg:max-w-72 lg:group-hover:-translate-x-4 xl:max-w-80">
                        <p className="text-muted-foreground text-xs">{item.category}</p>
                        <div className="flex items-center gap-2">
                          {avatarUrl && (
                            <Avatar className="border-border size-7 rounded-full border">
                              <AvatarImage src={avatarUrl} />
                            </Avatar>
                          )}
                          <time className="text-muted-foreground text-xs">{formattedDate}</time>
                        </div>
                      </div>
                    </Link>
                    <Separator />
                  </Fragment>
                )
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Resources4
