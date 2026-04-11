'use client'

import AutoScroll from 'embla-carousel-auto-scroll'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { cn } from '@/utils'

interface Logos12Props {
  className?: string
}

const Logos12 = ({ className }: Logos12Props) => {
  const logos = [
    {
      id: 'logo-1',
      description: 'Logo 1',
      image: 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-wordmark.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-2',
      description: 'Logo 2',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-1.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-3',
      description: 'Logo 3',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-2.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-4',
      description: 'Logo 4',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-3.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-5',
      description: 'Logo 5',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-4.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-6',
      description: 'Logo 6',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-5.svg',
      className: 'h-5 w-auto dark:invert',
    },
    {
      id: 'logo-7',
      description: 'Logo 7',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-6.svg',
      className: 'h-7 w-auto dark:invert',
    },
    {
      id: 'logo-8',
      description: 'Logo 8',
      image:
        'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/company/fictional-company-logo-7.svg',
      className: 'h-7 w-auto dark:invert',
    },
  ]

  return (
    <section className={cn('py-32', className)}>
      <div className="container">
        <div className="relative mx-auto flex items-center justify-center pt-8">
          <Carousel opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true })]}>
            <CarouselContent className="ml-0">
              {logos.map((logo) => (
                <CarouselItem
                  key={logo.id}
                  className="border-border relative mx-4 flex h-25 basis-1/2 justify-center border-y pl-0 sm:basis-1/4 md:basis-1/3 lg:basis-1/7"
                >
                  <div className="flex flex-col items-center justify-center lg:mx-10">
                    <img src={logo.image} alt={logo.description} className={logo.className} />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="from-background absolute inset-y-0 left-0 w-32 bg-linear-to-r to-transparent"></div>
          <div className="from-background absolute inset-y-0 right-0 w-32 bg-linear-to-l to-transparent"></div>
        </div>
      </div>
    </section>
  )
}

export { Logos12 }
