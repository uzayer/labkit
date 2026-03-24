'use client'

import { BookOpen, PenTool, Play } from 'lucide-react'
import { useState } from 'react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Hero112: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  images,
  icons,
  badge,
  tagline,
  presentationVideo,
  statsItems,
  publicContext,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)

  return (
    <section className="bg-background py-12 md:py-32">
      <div className="container max-w-240">
        <div className="flex flex-col gap-4 md:flex-row">
          <div className="flex flex-col gap-6">
            {richText && (
              <RichText
                publicContext={publicContext}
                className="flex flex-col gap-6"
                content={richText}
                enableGutter={false}
                overrideStyle={{
                  h1: 'text-4xl leading-tight font-medium lg:text-6xl',
                  p: 'text-lg text-muted-foreground lg:max-w-[80%]',
                }}
              />
            )}
            <div className="relative z-10 flex flex-wrap items-center gap-6">
              {Array.isArray(links) &&
                links.length > 0 &&
                links.map(({ link }, i) => (
                  <CMSLink publicContext={publicContext} key={i} {...link} />
                ))}

              {presentationVideo && presentationVideo.label && (
                <Button
                  variant="ghost"
                  className="group flex items-center gap-2 hover:bg-transparent"
                  onClick={() => setIsVideoOpen(true)}
                >
                  <div className="flex h-10 w-10 rounded-full bg-orange-500 transition-transform group-hover:scale-110">
                    <Play className="m-auto h-5 w-5 fill-white stroke-white" />
                  </div>
                  <div>{presentationVideo.label || 'Presentation Video'}</div>
                </Button>
              )}
            </div>
          </div>
          <div>
            <div className="relative mx-auto mt-28 h-85 w-85 rounded-full bg-orange-300 md:mx-0 md:mt-0 lg:h-100 lg:w-100">
              <div className="absolute bottom-0 left-1/2 w-85 -translate-x-1/2 overflow-hidden rounded-b-full lg:w-100">
                {images && images.length > 0 && (
                  <Media
                    imgClassName="w-full translate-y-14 scale-90 object-cover object-center"
                    priority
                    resource={images[0]}
                  />
                )}
              </div>
              <div className="absolute -right-5 bottom-10 flex w-70 items-center justify-center gap-1 rounded-full bg-white px-4 py-3 shadow-md">
                <div className="flex -space-x-3.5">
                  {icons && icons.length > 0
                    ? icons.slice(0, 3).map((icon, i) => (
                        <Avatar
                          key={i}
                          className="flex h-12 w-12 shrink-0 rounded-full border-4 border-white object-cover"
                        >
                          <AvatarImage alt="" />
                          <Media resource={icon} />
                          <AvatarFallback>
                            {String.fromCharCode(65 + i) + String.fromCharCode(66 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))
                    : [0, 1, 2].map((_, i) => (
                        <Avatar
                          key={i}
                          className="flex h-12 w-12 shrink-0 rounded-full border-4 border-white object-cover"
                        >
                          <AvatarFallback>
                            {String.fromCharCode(65 + i) + String.fromCharCode(66 + i)}
                          </AvatarFallback>
                        </Avatar>
                      ))}
                </div>
                <div className="flex-1 text-sm text-gray-800">
                  {tagline || '7000+ people already joined'}
                </div>
              </div>
              <div className="bg-primary absolute top-0 right-0 flex h-25 w-25 rotate-12 rounded-3xl border-8 border-white lg:h-27.5 lg:w-27.5">
                <BookOpen className="m-auto h-10 w-10 stroke-white lg:h-12.5 lg:w-12.5" />
              </div>
              <div className="bg-primary absolute top-1/3 -left-10 flex h-25 w-25 -rotate-12 rounded-3xl border-8 border-white lg:h-27.5 lg:w-27.5">
                <PenTool className="m-auto h-14 w-14 -rotate-90 fill-white lg:h-18 lg:w-18" />
              </div>
            </div>
          </div>
        </div>
        {Array.isArray(statsItems) && statsItems.length > 0 && (
          <div className="mt-20 rounded-3xl border p-6">
            <div className="flex w-full flex-col md:flex-row">
              {statsItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex flex-1 flex-col gap-3 p-6 ${
                    index < statsItems.length - 1 ? 'border-b md:border-r md:border-b-0' : ''
                  }`}
                >
                  <div className="text-primary text-2xl font-medium lg:text-4xl">{item.value}</div>
                  <div className="text-muted-foreground lg:text-lg">{item.title}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Presentation Video</DialogTitle>
          </DialogHeader>
          <div className="aspect-video">
            <iframe
              className="h-full w-full"
              src={presentationVideo?.videoUrl || 'https://www.youtube.com/embed/your-video-id'}
              title={presentationVideo?.label || 'Presentation Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

export default Hero112
