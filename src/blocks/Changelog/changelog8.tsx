'use client'

import { useEffect, useRef, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Separator } from '@/components/ui/separator'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { Changelogblock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utils'

const Changelog8: React.FC<Changelogblock & { publicContext: PublicContextProps }> = ({
  richText,
  entries,
  publicContext,
}) => {
  const [activeId, setActiveId] = useState<number | null>(null)
  const sectionRefs = useRef<Array<HTMLDivElement | null>>([])

  const entryCount = Array.isArray(entries) ? entries.length : 0

  useEffect(() => {
    sectionRefs.current = sectionRefs.current.slice(0, entryCount)

    const handleScroll = () => {
      const scrollPosition = window.scrollY + 100

      const currentSectionIndex = sectionRefs.current.findIndex((ref, index) => {
        if (!ref) return false

        const nextRef = sectionRefs.current[index + 1]
        const refTop = ref.offsetTop
        const refBottom = nextRef ? nextRef.offsetTop : document.body.scrollHeight

        return scrollPosition >= refTop && scrollPosition < refBottom
      })

      if (currentSectionIndex !== -1) {
        setActiveId(currentSectionIndex)
      } else if (scrollPosition < (sectionRefs.current[0]?.offsetTop || 0)) {
        setActiveId(null)
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [entryCount])

  const scrollToSection = (index: number) => {
    const sectionRef = sectionRefs.current[index]
    if (sectionRef) {
      window.scrollTo({
        top: sectionRef.offsetTop - 80,
        behavior: 'smooth',
      })
    }
  }

  const setRef = (index: number) => (el: HTMLDivElement | null) => {
    sectionRefs.current[index] = el
  }

  return (
    <section className="bg-background py-24 md:py-32">
      <div className="relative container flex flex-col lg:flex-row">
        <div className="mb-12 lg:hidden">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h1: 'mb-4 text-3xl font-bold tracking-tight md:text-4xl',
                h2: 'mb-4 text-3xl font-bold tracking-tight md:text-4xl',
                p: 'text-muted-foreground text-base md:text-lg',
              }}
            />
          )}
          <Separator className="mt-8" />
        </div>

        <div className="sticky top-24 hidden h-fit w-72 overflow-visible pr-10 lg:block">
          <div className="mb-10">
            {richText && (
              <RichText
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h1: 'mb-3 text-3xl font-bold tracking-tight',
                  h2: 'mb-3 text-3xl font-bold tracking-tight',
                  p: 'text-muted-foreground text-base',
                }}
              />
            )}
          </div>
          <Separator className="mb-6" />
          <ScrollArea className="h-[calc(100vh-300px)]">
            <div className="pb-6">
              <h3 className="text-muted-foreground mb-5 text-sm font-medium tracking-wider uppercase">
                On this page
              </h3>
              {Array.isArray(entries) && entries.length > 0 && (
                <nav className="flex flex-col space-y-2.5">
                  {entries.map((entry, index) => (
                    <button
                      key={entry.id}
                      onClick={() => scrollToSection(index)}
                      className={cn(
                        'group hover:border-border hover:bg-accent flex flex-col gap-2 rounded-md border border-transparent px-3 py-2 text-left transition-all',
                        activeId === index
                          ? 'border-border bg-accent text-foreground font-medium shadow-sm'
                          : 'text-muted-foreground',
                      )}
                    >
                      <span className="text-sm">{entry.title}</span>
                      <div className="text-muted-foreground flex items-center gap-2 text-xs">
                        {entry.version && (
                          <>
                            <span className="font-medium">{entry.version}</span>
                            <span>•</span>
                          </>
                        )}
                        <span>
                          {new Date(entry.date).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })}
                        </span>
                      </div>
                    </button>
                  ))}
                </nav>
              )}
            </div>
          </ScrollArea>
        </div>

        <div className="flex-1 lg:pl-10">
          <div className="mb-10 hidden lg:block">
            <h2 className="text-xl font-semibold">Latest updates</h2>
          </div>
          <div className="space-y-16 md:space-y-24">
            {Array.isArray(entries) &&
              entries.length > 0 &&
              entries.map((entry, index) => (
                <div
                  key={entry.id}
                  ref={setRef(index)}
                  className="border-l-border/30 hover:border-l-border relative flex flex-col gap-6 border-l-4 pl-6 transition-colors md:gap-8"
                  id={`entry-${index}`}
                >
                  <div className="flex flex-wrap items-center gap-3">
                    {entry.version && (
                      <Badge variant="secondary" className="px-3 py-1 text-xs font-medium">
                        {entry.version}
                      </Badge>
                    )}
                    <span className="text-muted-foreground text-xs font-medium">
                      {new Date(entry.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <div>
                    {entry.title && (
                      <h2 className="text-foreground mb-4 text-xl leading-tight font-bold md:text-2xl">
                        {entry.title}
                      </h2>
                    )}
                    {entry.description && (
                      <RichText
                        publicContext={publicContext}
                        content={entry.description}
                        withWrapper={false}
                        overrideStyle={{
                          p: 'text-muted-foreground mb-6 text-base',
                        }}
                      />
                    )}
                    {Array.isArray(entry.items) && entry.items.length > 0 && (
                      <div className="bg-muted/30 mt-6 rounded-lg border p-5">
                        <h3 className="mb-3 text-sm font-medium">What&apos;s included:</h3>
                        <ul className="text-muted-foreground space-y-2 text-sm">
                          {entry.items.map((item) => (
                            <li key={item.id} className="flex items-start">
                              <span className="bg-primary mt-1 mr-2 h-1.5 w-1.5 shrink-0 rounded-full" />
                              <span>{item.text}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {entry.image && (
                      <div className="mt-8 overflow-hidden rounded-xl border">
                        <Media
                          imgClassName="w-full object-cover transition-transform hover:scale-105"
                          resource={entry.image}
                        />
                      </div>
                    )}
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export { Changelog8 }
