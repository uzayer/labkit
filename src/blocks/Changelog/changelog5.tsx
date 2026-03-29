'use client'

import { useEffect, useRef, useState } from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utils'

const Changelog5: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  tagline,
  links,
  entries,
  publicContext,
}) => {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const sectionRefs = useRef<Record<string, HTMLElement>>({})

  useEffect(() => {
    const sections = Object.keys(sectionRefs.current)

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id)
        }
      })
    }

    let observer: IntersectionObserver | null = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    })

    sections.forEach((sectionId) => {
      const element = sectionRefs.current[sectionId]
      if (element) {
        observer?.observe(element)
      }
    })

    return () => {
      observer?.disconnect()
      observer = null
    }
  }, [])

  const addSectionRef = (id: string, ref: HTMLElement | null) => {
    if (ref) {
      sectionRefs.current[id] = ref
    }
  }

  return (
    <section className="py-32">
      <div className="bg-muted/60 py-20 lg:py-28">
        <div className="container">
          <div className="flex flex-col items-start gap-4 lg:flex-row">
            <span className="flex w-[16%] items-center gap-3 pt-1 text-sm">
              <span className="bg-primary size-2 shrink-0 rounded-full" />
              Changelog
            </span>
            <div>
              {richText && (
                <RichText
                  publicContext={publicContext}
                  content={richText}
                  withWrapper={false}
                  overrideStyle={{
                    h2: 'text-4xl',
                    p: 'text-muted-foreground text-lg',
                  }}
                />
              )}
              {tagline && <span className="text-muted-foreground">{tagline}</span>}
              {Array.isArray(links) && links.length > 0 && (
                <div className="mt-10 flex items-center gap-4 text-sm">
                  {links.map((item) => (
                    <CMSLink
                      key={item.id}
                      {...item.link}
                      publicContext={publicContext}
                      className="group flex items-center gap-1 underline"
                    />
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="container mt-10 lg:mt-20">
        <div className="relative flex">
          <div className="sticky top-10 hidden h-fit w-[16%] text-sm lg:block">
            <p className="mb-2">Timeline</p>
            {Array.isArray(entries) && entries.length > 0 && (
              <ul className="flex flex-col gap-2">
                {entries.map((entry, idx) => (
                  <li key={entry.id}>
                    <a
                      href={`#section-${idx + 1}`}
                      className={cn(
                        'transition-colors duration-200',
                        activeSection === `section-${idx + 1}`
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-primary',
                      )}
                    >
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>

          <Separator
            orientation="vertical"
            className="hidden h-auto data-[orientation=vertical]:h-auto lg:block"
          />
          <div className="mx-auto flex max-w-prose flex-col gap-16 lg:gap-24">
            {Array.isArray(entries) &&
              entries.length > 0 &&
              entries.map((entry, idx) => (
                <div
                  key={entry.id}
                  id={`section-${idx + 1}`}
                  ref={(ref) => addSectionRef(`section-${idx + 1}`, ref)}
                  className="scroll-m-20"
                >
                  {entry.image && (
                    <Media
                      imgClassName="mb-8 aspect-video w-full object-cover"
                      resource={entry.image}
                    />
                  )}
                  {entry.category && (
                    <span className="flex items-center gap-2">
                      <span className="border-muted-foreground size-2 shrink-0 rounded-full border" />
                      <p className="text-muted-foreground text-sm">{entry.category}</p>
                    </span>
                  )}
                  {entry.title && <h3 className="mt-2 mb-6 text-3xl">{entry.title}</h3>}
                  {entry.description && (
                    <RichText
                      publicContext={publicContext}
                      content={entry.description}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-base',
                        li: 'text-base',
                      }}
                    />
                  )}
                  <div className="border-border mt-6 flex items-end justify-between border-b pb-4">
                    <div className="flex items-center gap-4">
                      {typeof entry.authorImage === 'object' && entry.authorImage && (
                        <Avatar className="border-border size-10 border">
                          <AvatarImage
                            src={entry.authorImage.url ?? ''}
                            alt={entry.authorImage.alt ?? ''}
                          />
                        </Avatar>
                      )}
                      <div className="flex flex-col">
                        {entry.author && <p className="text-sm font-medium">{entry.author}</p>}
                        {entry.authorRole && (
                          <p className="text-muted-foreground text-sm">{entry.authorRole}</p>
                        )}
                      </div>
                    </div>
                    <time className="text-muted-foreground text-sm">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </time>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Changelog5 }
