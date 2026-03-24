'use client'

import { PlayIcon } from 'lucide-react'
import { useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Page } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'

const Hero101: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  presentationVideo,
  icons,
  publicContext,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false)
  return (
    <>
      <section className="relative overflow-hidden border border-b pt-40 pb-10 font-sans shadow-[inset_0_-4px_10px_var(--color-primary)] before:absolute before:-top-[88%] before:left-1/2 before:block before:h-[200%] before:w-[200%] before:-translate-x-1/2 before:bg-[radial-gradient(var(--color-violet-100)_15%,var(--color-transparent)_20%,var(--color-yellow-50)_30%,var(--color-transparent)_50%,var(--color-cyan-50)_60%)] before:bg-cover before:bg-no-repeat before:opacity-55 before:content-['']">
        <div className="relative z-20 container max-w-[84rem]">
          <div className="mx-auto flex max-w-[54.375rem] flex-col items-center gap-4">
            {richText && (
              <RichText
                publicContext={publicContext}
                className="mx-auto flex max-w-[54.375rem] flex-col items-center gap-4"
                content={richText}
                enableGutter={false}
                overrideStyle={{
                  h1: 'text-center text-4xl font-bold leading-none text-black sm:text-5xl md:text-[4rem]',
                  p: 'text-muted-foreground text-center text-base md:text-lg',
                }}
              />
            )}
            <div className="flex flex-col items-center gap-3 pt-4 md:flex-row">
              {Array.isArray(links) &&
                links.length > 0 &&
                links.map(({ link }, i) => (
                  <CMSLink
                    publicContext={publicContext}
                    key={i}
                    {...link}
                    className="border px-3 py-1.5 text-sm font-medium"
                  />
                ))}
              {presentationVideo && presentationVideo.label && (
                <Button
                  asChild
                  variant="ghost"
                  onClick={() => setIsVideoOpen(true)}
                  className="flex w-fit items-center gap-3 hover:bg-transparent"
                >
                  <a href="#">
                    <div className="before:from-primary relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-linear-to-r before:to-transparent before:content-['']">
                      <div className="bg-background relative z-20 flex h-full w-full rounded-full">
                        <PlayIcon className="fill-primary stroke-primary m-auto h-3! w-3!" />
                      </div>
                    </div>
                    <p className="text-primary text-sm/5 font-medium">
                      {presentationVideo.label || 'Watch Demo'}{' '}
                      <span className="text-muted-foreground ml-1 text-xs">
                        {presentationVideo?.videoDuration || '2 min'}
                      </span>
                    </p>
                  </a>
                </Button>
              )}
            </div>
          </div>
          <div className="mx-auto mt-20 max-w-[60rem] lg:max-w-full">
            <div className="flex w-full flex-col items-center justify-between gap-6 md:flex-row">
              <div className="flex flex-1 flex-wrap items-center justify-center gap-x-6 gap-y-2">
                {icons &&
                  icons.length > 0 &&
                  icons.map((icon, i) => (
                    <Media
                      key={`hero101-${i}`}
                      resource={icon}
                      imgClassName="h-6 w-28 object-contain object-center"
                    />
                  ))}
              </div>
            </div>
          </div>
        </div>
      </section>
      <Dialog open={isVideoOpen} onOpenChange={setIsVideoOpen}>
        <DialogContent className="sm:max-w-[50rem]">
          <DialogHeader>
            <DialogTitle>Presentation Video</DialogTitle>
          </DialogHeader>
          <AspectRatio ratio={16 / 9}>
            <iframe
              className="h-full w-full"
              src={presentationVideo?.videoUrl || 'https://www.youtube.com/embed/your-video-id'}
              title={presentationVideo?.label || 'Presentation Video'}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Hero101
