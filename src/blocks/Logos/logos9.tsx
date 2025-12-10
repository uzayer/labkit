'use client'

import AutoScroll from 'embla-carousel-auto-scroll'

import { cn } from '@/utilities/index'

import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { Separator } from '@/components/ui/separator'
import { LogosBlock, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { Media } from '@/components/Media'

const Logos9: React.FC<LogosBlock & { publicContext: PublicContextProps }> = ({
  publicContext,
  testimonials,
  logos,
  richText,
}) => {
  if (!testimonials || !logos) return null

  return (
    <section className="py-32">
      <div className="container flex flex-col items-center text-center">
        {richText && (
          <RichText
            publicContext={publicContext}
            content={richText}
            withWrapper={false}
            overrideStyle={{
              h1: 'text-foreground my-6 text-lg font-semibold tracking-tight',
              h2: 'text-foreground my-6 text-lg font-semibold tracking-tight',
              h3: 'text-foreground my-6 text-lg font-semibold tracking-tight',
              h4: 'text-foreground my-6 text-lg font-semibold tracking-tight',
              h5: 'text-foreground my-6 text-lg font-semibold tracking-tight',
              p: 'text-foreground my-6 text-lg font-semibold tracking-tight',
            }}
          />
        )}
      </div>

      <div className="relative mx-auto flex items-center justify-center pt-8 lg:max-w-5xl">
        <Carousel opts={{ loop: true }} plugins={[AutoScroll({ playOnInit: true })]}>
          <CarouselContent className="ml-0">
            {logos?.map((logo, index) => (
              <CarouselItem
                key={index}
                className="flex basis-1/3 justify-center pl-0 sm:basis-1/4 md:basis-1/5 lg:basis-1/6"
              >
                <div className="flex shrink-0 items-center justify-center lg:mx-10">
                  <div>
                    <Media imgClassName="h-7 w-auto" priority resource={logo} />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="from-background absolute inset-y-0 left-0 w-12 bg-linear-to-r to-transparent"></div>
        <div className="from-background absolute inset-y-0 right-0 w-12 bg-linear-to-l to-transparent"></div>
      </div>
      <Separator className="mx-auto my-15 max-w-5xl" />

      <div>
        <Carousel opts={{ loop: true }} className="mx-auto w-full max-w-6xl">
          <CarouselContent>
            {testimonials?.map((testimonial, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <div
                  className={cn(
                    'relativ border-border w-full border-r px-12 text-center md:px-8 md:text-left',
                    index == 0 && 'lg:border-l',
                  )}
                  key={index}
                >
                  <h5 className="text-muted-foreground mt-5 mb-14 line-clamp-3 text-lg tracking-tight md:mb-28">
                    {testimonial.quote}
                  </h5>
                  <div className="mt-auto">
                    <p className="text-foreground text-lg font-semibold tracking-tight">
                      {testimonial.name}
                    </p>
                    <Media
                      imgClassName="mx-auto my-5 w-40 md:mx-0 object-contain"
                      resource={testimonial.image as MediaType}
                    />
                  </div>
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
      </div>
    </section>
  )
}

export default Logos9
