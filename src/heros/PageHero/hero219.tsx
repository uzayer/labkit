'use client'

import React, { useMemo } from 'react'
import { motion } from 'framer-motion'

import { Particles } from '@/components/magicui/particles'
import { cn } from '@/utilities/cn'
import { Media as MediaType, Page } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

const Hero219: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  icons,
  publicContext,
}) => {
  // Memoize the marquee components to prevent unnecessary re-renders
  const marqueeComponents = useMemo(() => {
    if (!icons) return []

    const showCardPattern = [1, 2, 3, 2, 3, 2, 1]
    let index = 0
    const logoData = showCardPattern
      .map((count, i) => {
        const group = icons?.slice(index, index + count)
        index += count

        return {
          showCard: count,
          reverse: i % 2 === 0,
          images: group.map((item: MediaType) => item),
        }
      })
      .filter((item) => item.images.length === item.showCard)

    return logoData.map((config, index) => (
      <SkiperUiMarquee
        key={`marquee-${index}`}
        showCard={config.showCard}
        reverse={config.reverse}
        images={config.images}
      />
    ))
  }, [icons])

  if (!icons) return null

  return (
    <section className="relative py-32">
      <div className="container flex flex-col items-center justify-center gap-4 overflow-hidden">
        {richText && (
          <RichText
            publicContext={publicContext}
            content={richText}
            withWrapper={false}
            overrideStyle={{
              h1: 'realtive z-15 max-w-3xl text-center text-6xl font-medium tracking-tighter md:text-7xl',
              p: 'text-muted-foreground',
            }}
          />
        )}

        <Particles
          className="absolute inset-0 z-0"
          quantity={500}
          ease={80}
          color="#000000"
          refresh
        />

        <motion.div
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="relative z-20 mt-10 flex items-center justify-center gap-4"
        >
          {marqueeComponents}
        </motion.div>

        <div className="bg-background absolute right-0 bottom-20 left-0 h-92 w-full blur-xl" />
      </div>
    </section>
  )
}

export { Hero219 }

function Marquee({ className, reverse, children, vertical = false, repeat = 4, ...props }: any) {
  return (
    <div
      {...props}
      className={cn(
        'group flex [gap:var(--gap)] overflow-hidden p-2 [--gap:1rem]',
        {
          'flex-row': !vertical,
          'flex-col': vertical,
        },
        className,
      )}
    >
      {Array(repeat)
        .fill(0)
        .map((_, i) => (
          <div
            key={i}
            className={cn(
              'flex shrink-0 justify-around [gap:var(--gap)] ![animation-duration:12s] [animation-play-state:running] group-hover:[animation-play-state:paused]',
              {
                'animate-marquee flex-row': !vertical,
                'animate-marquee-vertical flex-col': vertical,
                '[animation-direction:reverse]': reverse,
              },
            )}
          >
            {children}
          </div>
        ))}
    </div>
  )
}

interface SkiperUiMarqueeProps {
  images: MediaType[]
  showCard: number
  reverse?: boolean
  className?: string
}

export const SkiperUiMarquee = React.memo(function SkiperUiMarquee({
  showCard,
  reverse = false,
  className,
  images,
}: SkiperUiMarqueeProps) {
  return (
    <div
      className={cn('relative overflow-hidden', className)}
      style={{
        height: showCard * 113,
      }}
    >
      <Marquee reverse={reverse} vertical={true}>
        {images.map((item, idx) => (
          <Card key={idx} image={item} />
        ))}
      </Marquee>
      <div className="from-background absolute top-0 z-10 h-8 w-full bg-gradient-to-b to-transparent" />
      <div className="from-background absolute bottom-0 z-10 h-8 w-full bg-gradient-to-t to-transparent" />
    </div>
  )
})

const Card = React.memo(function Card({ image }: { image?: MediaType }) {
  return (
    <div
      className={cn(
        'border-muted relative flex size-24 items-center justify-center overflow-hidden rounded-3xl border p-4',
        'from-muted/50 to-background bg-gradient-to-b',
        'dark:bg-transparent dark:[box-shadow:0_-20px_80px_-20px_#ffffff1f_inset]',
      )}
    >
      <Media resource={image} imgClassName="size-8 object-cover" alt="Card" />
    </div>
  )
})
