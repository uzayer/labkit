'use client'

import { ArrowLeft, ArrowRight, Calendar, MapPin, Tag } from 'lucide-react'
import { useEffect, useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import type { CarouselApi } from '@/components/ui/carousel'
import { CMSLink } from '@/components/Link'
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel'
import type { Media, ProjectsBlock } from '@/payload-types'
import type { PublicContextProps } from '@/utilities/publicContextProps'

type Projects17bProps = ProjectsBlock & {
  publicContext: PublicContextProps
}

const Projects17b: React.FC<Projects17bProps> = ({
  heading,
  description,
  projects,
  publicContext,
}) => {
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
        {(heading || description) && (
          <div className="mb-16 px-8">
            {heading && (
              <h1 className="text-3xl font-medium tracking-tight lg:text-6xl">{heading}</h1>
            )}
            {description && <p className="text-muted-foreground mt-4 text-lg">{description}</p>}
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
                  <div className="w-[450px]">
                    <div className="bg-card text-card-foreground overflow-hidden rounded-xl border shadow-sm">
                      <div className="aspect-square overflow-hidden">
                        <img
                          src={getImageUrl(project.image)}
                          alt={project.title}
                          className="h-full w-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                      <div className="space-y-4 p-6">
                        <div className="space-y-3">
                          <div className="flex items-start justify-between gap-3">
                            <h2 className="text-xl leading-tight font-semibold">{project.title}</h2>
                            {project.category && (
                              <Badge variant="secondary" className="shrink-0">
                                <Tag className="mr-1 h-3 w-3" />
                                {project.category}
                              </Badge>
                            )}
                          </div>

                          {(project.location || project.year) && (
                            <div className="text-muted-foreground flex items-center gap-4 text-sm">
                              {project.location && (
                                <div className="flex items-center gap-1">
                                  <MapPin className="h-4 w-4" />
                                  {project.location}
                                </div>
                              )}
                              {project.year && (
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-4 w-4" />
                                  {project.year}
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {project.description && (
                          <p className="text-muted-foreground text-sm leading-relaxed">
                            {project.description}
                          </p>
                        )}

                        <div className="pt-2">
                          <CMSLink
                            publicContext={publicContext}
                            {...project.link}
                            size="sm"
                            className="w-full"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
          {projects.length > 0 && (
            <div className="pointer-events-none absolute inset-y-0 top-60 right-4 left-4 z-10 flex justify-between">
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollPrev()}
                disabled={!canScrollPrev}
                className="pointer-events-auto ml-4 h-10 w-10 rounded-full border-gray-200 bg-white/90 shadow-lg hover:bg-white"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="outline"
                onClick={() => carouselApi?.scrollNext()}
                disabled={!canScrollNext}
                className="pointer-events-auto mr-4 h-10 w-10 rounded-full border-gray-200 bg-white/90 shadow-lg hover:bg-white"
              >
                <ArrowRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Projects17b
