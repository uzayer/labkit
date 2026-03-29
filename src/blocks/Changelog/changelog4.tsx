'use client'

import { useEffect, useState } from 'react'
import { FaLinkedin } from 'react-icons/fa'
import { FaBluesky, FaXTwitter } from 'react-icons/fa6'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const socialIcons: Record<number, React.ReactNode> = {
  0: <FaLinkedin className="text-muted-foreground hover:text-primary size-6 duration-150" />,
  1: <FaXTwitter className="text-muted-foreground hover:text-primary size-6 duration-150" />,
  2: <FaBluesky className="text-muted-foreground hover:text-primary size-6 duration-150" />,
}

const Changelog4: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  tagline,
  links,
  entries,
  publicContext,
}) => {
  const [scrollProgress, setScrollProgress] = useState(8)

  useEffect(() => {
    const handleScroll = () => {
      const totalHeight = document.documentElement.scrollHeight - window.innerHeight
      const progress = (window.scrollY / totalHeight) * 92 + 8
      setScrollProgress(Math.min(progress, 100))
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto w-full max-w-5xl md:px-10">
          <div className="flex flex-col gap-16">
            {richText && (
              <RichText
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-5xl font-bold',
                  h2: 'text-4xl font-bold',
                  p: 'text-muted-foreground text-lg',
                }}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="bg-muted mx-auto flex w-full items-center justify-center gap-2 rounded-2xl p-3 md:gap-4">
                {links.map((item, idx) => (
                  <CMSLink
                    key={item.id}
                    {...item.link}
                    publicContext={publicContext}
                    className="inline-flex"
                  >
                    {socialIcons[idx] || socialIcons[0]}
                  </CMSLink>
                ))}
                {tagline && <p className="text-muted-foreground text-sm">{tagline}</p>}
              </div>
            )}
            <div className="relative space-y-20">
              <div className="absolute top-4 hidden h-full w-0.5 md:-left-12 md:block lg:-left-14">
                <div className="bg-muted h-full w-full rounded-full">
                  <div
                    className="from-primary/20 via-primary/40 to-primary relative max-h-full w-full rounded-full bg-linear-to-b transition-all duration-300"
                    style={{
                      height: `${scrollProgress}%`,
                    }}
                  />
                </div>
              </div>
              {Array.isArray(entries) &&
                entries.length > 0 &&
                entries.map((entry) => (
                  <div key={entry.id} className="relative">
                    <span className="bg-background absolute top-2 hidden size-5 -translate-x-1/2 place-items-center rounded-full border md:-left-12 md:grid lg:-left-[55px]">
                      <span className="bg-primary size-2 rounded-full" />
                    </span>
                    {entry.image && (
                      <Media
                        imgClassName="border-border aspect-video rounded-md border object-cover"
                        resource={entry.image}
                      />
                    )}
                    <div className="my-4 flex items-center gap-2">
                      {typeof entry.authorImage === 'object' && entry.authorImage && (
                        <Avatar className="border-border size-8 rounded-full border">
                          <AvatarImage
                            src={
                              typeof entry.authorImage === 'object'
                                ? (entry.authorImage.url ?? '')
                                : ''
                            }
                            alt={
                              typeof entry.authorImage === 'object'
                                ? (entry.authorImage.alt ?? '')
                                : ''
                            }
                          />
                        </Avatar>
                      )}
                      <time className="text-muted-foreground text-sm">
                        {new Date(entry.date).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </time>
                    </div>
                    {entry.description && (
                      <div className="prose dark:prose-invert max-w-none">
                        <RichText
                          publicContext={publicContext}
                          content={entry.description}
                          withWrapper={false}
                          overrideStyle={{
                            h2: 'text-4xl',
                            h3: 'text-xl font-semibold',
                            p: 'text-base',
                            li: 'text-base',
                          }}
                        />
                      </div>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Changelog4 }
