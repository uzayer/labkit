'use client'

import AutoScroll from 'embla-carousel-auto-scroll'
import { useRef } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { Card } from '@/components/ui/card'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { TestimonialBlock } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { splitArray } from '@/utilities/splitArray'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'

const Testimonial7: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({
  headline,
  links,
  testimonial,
  publicContext,
}) => {
  const plugin1 = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
    }),
  )

  const plugin2 = useRef(
    AutoScroll({
      startDelay: 500,
      speed: 0.7,
      direction: 'backward',
    }),
  )
  if (!testimonial) return null

  const [testimonials1, testimonials2] = splitArray(testimonial)

  const getCarouselContent = (testimonials: TestimonialBlock['testimonial']) => {
    return (
      testimonials &&
      testimonials.length > 0 &&
      testimonials.map((testimonial, index) => (
        <CarouselItem key={index} className="basis-auto">
          <Card className="h-[178px] w-84 p-6 select-none sm:w-96">
            <div className="mb-4 flex gap-4">
              <Avatar className="ring-input size-9 rounded-full ring-1">
                <Media
                  resource={testimonial.authorAvatar as MediaType}
                  imgClassName="h-9 w-full rounded-md object-cover lg:h-auto"
                />
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">{testimonial.authorName}</p>
                <p className="text-muted-foreground">{testimonial.authorDescription}</p>
              </div>
            </div>
            {testimonial.text && (
              <RichText
                publicContext={publicContext}
                content={testimonial.text}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-base before:content-[open-quote] after:content-[close-quote] line-clamp-3',
                  h2: 'text-base before:content-[open-quote] after:content-[close-quote] line-clamp-3',
                  h3: 'text-base before:content-[open-quote] after:content-[close-quote] line-clamp-3',
                  p: 'text-base before:content-[open-quote] after:content-[close-quote] line-clamp-3',
                }}
              />
            )}
          </Card>
        </CarouselItem>
      ))
    )
  }

  return (
    <section className="py-32">
      <div className="container flex flex-col items-center gap-6">
        {headline && (
          <RichText
            publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h2: 'mb-2 text-center text-3xl font-semibold lg:text-5xl',
              h3: 'mb-2 text-center text-2xl font-semibold lg:text-4xl',
              h4: 'mb-2 text-center text-xl font-semibold lg:text-3xl',
              p: 'text-muted-foreground lg:text-lg',
            }}
          />
        )}
        {links &&
          links.map((link, index) => (
            <CMSLink publicContext={publicContext} className="mt-6" key={index} {...link.link} />
          ))}
      </div>
      <div className="lg:container">
        <div className="mt-16 space-y-4">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin1.current]}
            onMouseLeave={() => plugin1.current.play()}
          >
            <CarouselContent>{getCarouselContent(testimonials1)}</CarouselContent>
          </Carousel>
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[plugin2.current]}
            onMouseLeave={() => plugin2.current.play()}
          >
            <CarouselContent>{getCarouselContent(testimonials2)}</CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default Testimonial7
