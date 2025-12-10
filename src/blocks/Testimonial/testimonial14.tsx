'use client'

import { useEffect, useState } from 'react'

import { Avatar } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { TestimonialBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'
import { Media as MediaType } from '@/payload-types'

const Testimonial14: React.FC<TestimonialBlock & { publicContext: PublicContextProps }> = ({
  testimonial,
  publicContext,
}) => {
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)

  useEffect(() => {
    if (!api) {
      return
    }

    const updateCurrent = () => {
      setCurrent(api.selectedScrollSnap())
    }

    api.on('select', updateCurrent)
    return () => {
      api.off('select', updateCurrent)
    }
  }, [api])

  if (!testimonial) {
    return null
  }

  return (
    <section className="py-32">
      <Carousel setApi={setApi}>
        <CarouselContent>
          {testimonial &&
            testimonial.map((testimonialItem) => (
              <CarouselItem key={testimonialItem.id}>
                <div className="container flex flex-col items-center text-center">
                  {testimonialItem.text && (
                    <RichText
                      publicContext={publicContext}
                      content={testimonialItem.text}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'mb-8 max-w-4xl font-medium md:px-8 lg:text-3xl after:content-[close-quote] before:content-[open-quote]',
                        h1: 'mb-8 max-w-4xl font-medium md:px-8 lg:text-3xl after:content-[close-quote] before:content-[open-quote]',
                        h2: 'mb-8 max-w-4xl font-medium md:px-8 lg:text-3xl after:content-[close-quote] before:content-[open-quote]',
                        h3: 'mb-8 max-w-4xl font-medium md:px-8 lg:text-3xl after:content-[close-quote] before:content-[open-quote]',
                      }}
                    />
                  )}
                  <Avatar className="mb-2 size-12 md:size-24">
                    {testimonialItem.authorAvatar && (
                      <Media
                        resource={testimonialItem.authorAvatar as MediaType}
                        imgClassName="h-12 w-full rounded-md object-cover lg:h-auto"
                      />
                    )}
                  </Avatar>
                  <p className="mb-1 text-sm font-medium md:text-lg">
                    {testimonialItem.authorName}
                  </p>
                </div>
              </CarouselItem>
            ))}
        </CarouselContent>
      </Carousel>
      <div className="container flex justify-center py-16">
        {testimonial &&
          testimonial.map((_testimonialItem, index) => (
            <Button
              key={index}
              variant="ghost"
              size="sm"
              onClick={() => {
                api?.scrollTo(index)
              }}
            >
              <div
                className={`size-2.5 rounded-full ${index === current ? 'bg-primary' : 'bg-input'}`}
              />
            </Button>
          ))}
      </div>
    </section>
  )
}

export default Testimonial14
