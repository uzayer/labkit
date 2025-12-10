'use client'

import Autoplay from 'embla-carousel-autoplay'
import { useEffect, useRef, useState } from 'react'

import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/utilities/cn'

const technologies = [
  {
    name: 'Next',
    command: 'npx create-next-app my-app',
    image: '/images/block/logos/nextjs-small.svg',
  },
  {
    name: 'Vite',
    command: 'npm create vite@latest',
    image: '/images/block/logos/vite.svg',
  },
  {
    name: 'Remix',
    command: 'npx create-remix@latest my-app',
    image: '/images/block/logos/remix.svg',
  },
  {
    name: 'Gatsby',
    command: 'npm init gatsby',
    image: '/images/block/logos/gatsby.svg',
  },
  {
    name: 'Astro',
    command: 'npm create astro@latest',
    image: '/images/block/logos/astro.svg',
  },

  {
    name: 'Laravel',
    command: 'laravel new my-app ',
    image: '/images/block/logos/laravel.svg',
  },
  {
    name: 'React',
    command: 'npx create-react-app my-app',
    image: '/images/block/logos/react-black.svg',
  },
]

const Hero14 = () => {
  const plugin = useRef(Autoplay({ delay: 4000, stopOnInteraction: false }))
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) return

    setCurrent(api.selectedScrollSnap() + 1)

    api.on('select', () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <section className="py-32">
      <div className="container">
        <div>
          <h2 className="mx-auto mb-4 max-w-screen-sm text-center text-4xl font-medium md:mb-12 md:text-8xl">
            Choose your stack
          </h2>
          <p className="text-muted-foreground mt-4 text-center text-lg md:text-2xl">
            Compatible with all popular frameworks
          </p>
          <div
            key={current}
            className="animate-fade-in-out bg-muted mx-auto mt-8 mb-12 flex w-fit items-center gap-2 rounded-md px-4 py-2 text-center"
          >
            <img
              src={technologies[current - 1]?.image}
              alt={technologies[current - 1]?.name}
              className="h-4 md:h-7"
            />

            <p className="border-l px-2 font-mono text-sm">{technologies[current - 1]?.command}</p>
          </div>
        </div>
        <Carousel
          setApi={setApi}
          plugins={[plugin.current]}
          opts={{
            loop: true,
          }}
          className="before:from-background after:from-background relative mx-auto w-full max-w-screen-md before:absolute before:inset-y-0 before:left-0 before:z-10 before:w-36 before:bg-linear-to-r before:to-transparent after:absolute after:inset-y-0 after:right-0 after:z-10 after:w-36 after:bg-linear-to-l after:to-transparent"
          onMouseEnter={plugin.current.stop}
          onMouseLeave={plugin.current.reset}
        >
          <CarouselContent>
            {technologies.map((technology, idx) => (
              <CarouselItem key={idx} className="basis-1/3 select-none sm:basis-1/4 md:basis-1/6">
                <div
                  className={cn(
                    'flex items-center justify-center gap-2 rounded-md border p-6',
                    idx === current - 1 ? 'border-primary' : 'border-transparent',
                  )}
                >
                  <img
                    className="h-4 shrink-0 md:h-7"
                    src={technology.image}
                    alt={technology.name}
                  />
                  <p>{technology.name}</p>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default Hero14
