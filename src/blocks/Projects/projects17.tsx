'use client'

import { ArrowLeft, ArrowRight } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { CMSLink } from '@/components/Link'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import type { ProjectsBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'
import type { Media } from '@/payload-types'

type Projects17Props = ProjectsBlock & {
  publicContext: PublicContextProps
}

const Projects17: React.FC<Projects17Props> = ({ heading, projects, publicContext }) => {
  const [carouselApi, setCarouselApi] = useState<CarouselApi>()
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(false)

  useEffect(() => {
    if (!carouselApi) return
    const updateSelection = () => {
      setCanScrollPrev(carouselApi.canScrollPrev())
      setCanScrollNext(carouselApi.canScrollNext())
    }
    updateSelection()
    carouselApi.on('select', updateSelection)
    return () => {
      carouselApi.off('select', updateSelection)
    }
  }, [carouselApi])

  // Helper function to get image URL from Media object
  const getImageUrl = (image: string | Media | null | undefined): string => {
    if (!image) return '/placeholder.svg'
    if (typeof image === 'string') return image
    return image.url || '/placeholder.svg'
  }

  return (
    <section className="py-16">
      <div className="w-full">
        {heading && (
          <div className="mb-16 px-8">
            <h1 className="text-3xl font-medium tracking-tight lg:text-6xl">{heading}</h1>
          </div>
        )}
        <div className="relative w-full">
          <Carousel
            setApi={setCarouselApi}
            opts={{
              align: 'start',
              loop: false,
              breakpoints: {
                '(max-width: 768px)': {
                  dragFree: true,
                },
              },
            }}
            className="w-full"
          >
            <CarouselContent>
              {projects.map((project) => (
                <CarouselItem key={project.id} className="basis-auto pl-8">
                  <div className="w-[500px] space-y-6">
                    <div className="aspect-[4/3] overflow-hidden rounded-md">
                      <img
                        src={getImageUrl(project.image)}
                        alt={project.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <h2 className="text-2xl tracking-tight">{project.title}</h2>
                        {project.location && (
                          <p className="text-muted-foreground text-sm">{project.location}</p>
                        )}
                      </div>

                      <CMSLink publicContext={publicContext} {...project.link} />
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          <div className="pointer-events-none absolute inset-y-0 top-40 right-4 left-4 z-10 flex justify-between">
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollPrev()}
              disabled={!canScrollPrev}
              className="pointer-events-auto ml-4 h-10 w-10 rounded-full border-gray-200 bg-white/90 hover:bg-white"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Button
              size="icon"
              variant="outline"
              onClick={() => carouselApi?.scrollNext()}
              disabled={!canScrollNext}
              className="pointer-events-auto mr-4 h-10 w-10 rounded-full border-gray-200 bg-white/90 hover:bg-white"
            >
              <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Projects17
