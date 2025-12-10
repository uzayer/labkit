'use client'

import AutoScroll from 'embla-carousel-auto-scroll'

import { cn } from '@/utilities/cn'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import { GalleryBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

export const Gallery7: React.FC<GalleryBlock & { publicContext: PublicContextProps }> = ({
  richText,
  link,
  elements,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-12 flex flex-col gap-8 md:mb-16 md:gap-12">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={true}
              className="flex w-full flex-col items-center justify-center gap-12 md:flex-row md:items-start md:justify-between"
              overrideStyle={{
                h2: 'w-full md:w-1/2 text-3xl font-bold md:text-4xl',
                h3: 'w-full md:w-1/2 text-3xl font-bold md:text-4xl',
                h4: 'w-full md:w-1/2 text-3xl font-bold md:text-4xl',
                p: 'w-full md:w-1/2 text-muted-foreground md:text-lg',
              }}
            />
          )}
          {link && (
            <CMSLink
              publicContext={publicContext}
              {...link}
              className="font-medium hover:underline"
            />
          )}
        </div>
      </div>
      <div className="w-full">
        <div className="max-w-[100vw] overflow-x-hidden">
          <Carousel
            opts={{
              loop: true,
            }}
            plugins={[
              AutoScroll({
                speed: 0.7,
              }),
            ]}
            className="pointer-events-none"
          >
            <CarouselContent>
              {elements &&
                elements.map((image, index) => (
                  <CarouselItem key={index} className="basis-auto">
                    {image && (
                      <Media
                        resource={image.image}
                        imgClassName={cn(
                          'mt-7 h-full w-full rounded-md object-cover',
                          index % 2 === 0 && 'mt-16',
                        )}
                        className="h-64 w-64"
                      />
                    )}
                  </CarouselItem>
                ))}
            </CarouselContent>
          </Carousel>
        </div>
      </div>
    </section>
  )
}

export default Gallery7
