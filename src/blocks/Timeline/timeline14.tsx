'use client'

import { useEffect, useRef, useState } from 'react'

import { cn } from '@/utils'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { TimelineBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Timeline14: React.FC<TimelineBlock & { publicContext: PublicContextProps }> = ({
  heading,
  sections,
  publicContext,
}) => {
  const [activeIndex, setActiveIndex] = useState(0)
  const itemRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-50% 0px -50% 0px',
      threshold: 0,
    }

    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const index = itemRefs.current.findIndex((ref) => ref === entry.target)
          if (index !== -1) {
            setActiveIndex(index)
          }
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, observerOptions)

    itemRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref)
      }
    })

    return () => {
      observer.disconnect()
    }
  }, [])

  if (!Array.isArray(sections) || sections.length === 0) return null

  return (
    <section className="py-32">
      <div className="container">
        {heading && (
          <h1 className="max-w-4xl text-4xl font-medium tracking-tight md:text-5xl lg:text-6xl">
            {heading}
          </h1>
        )}
      </div>
      <div className="relative mt-16 lg:mt-28">
        <div className="bg-background sticky top-0 z-10 border-y py-3.5">
          <div className="container">
            <div className="flex justify-between gap-4 text-2xl md:text-4xl">
              <p className="text-muted-foreground font-mono">
                {String(activeIndex + 1).padStart(2, '0')}
              </p>
              {sections[activeIndex]?.dateLabel && (
                <p className="font-mono">{sections[activeIndex].dateLabel}</p>
              )}
            </div>
          </div>
        </div>
        <div className="container">
          <div className="flex flex-col">
            {sections.map((item, index) => (
              <div
                key={item.id}
                ref={(el) => {
                  itemRefs.current[index] = el
                }}
                className={cn(
                  'flex flex-col items-center gap-7 py-14 opacity-50 transition-opacity duration-300 md:flex-row md:gap-10 md:py-20',
                  index === activeIndex && 'opacity-100',
                )}
              >
                {typeof item.image === 'object' && item.image && (
                  <Media
                    resource={item.image}
                    imgClassName="aspect-[16/12] rounded-lg border object-cover md:w-1/3 md:max-w-[440px]"
                  />
                )}
                <div>
                  {item.tagline && (
                    <h2 className="mb-3 text-2xl font-medium md:mb-4 md:text-4xl">
                      {item.tagline}
                    </h2>
                  )}
                  {item.richText && (
                    <RichText
                      publicContext={publicContext}
                      content={item.richText}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-muted-foreground md:text-balance',
                      }}
                    />
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

export default Timeline14
