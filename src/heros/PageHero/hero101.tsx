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
import { getSafePresentationVideoSource } from '@/utilities/validation'

const Hero101: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  presentationVideo,
  icons,
  publicContext,
}) => {
  const [isVideoOpen, setIsVideoOpen] = useState<boolean>(false)
  const videoSource = getSafePresentationVideoSource(presentationVideo?.videoUrl)
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
                    <div className="relative h-7 w-7 rounded-full p-[3px] before:absolute before:top-0 before:left-0 before:block before:h-full before:w-full before:animate-[spin_5s_ease-in-out_infinite] before:rounded-full before:bg-linear-to-r before:from-primary before:to-transparent before:content-['']">
                      <div className="relative z-20 flex h-full w-full rounded-full bg-background">
                        <PlayIcon className="m-auto h-3! w-3! fill-primary stroke-primary" />
                      </div>
                    </div>
                    <p className="text-sm/5 font-medium text-primary">
                      {presentationVideo.label || 'Watch Demo'}{' '}
                      <span className="ml-1 text-xs text-muted-foreground">
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
            {videoSource?.type === 'embed' ? (
              <iframe
                className="h-full w-full"
                src={videoSource.src}
                title={presentationVideo?.label || 'Presentation Video'}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                referrerPolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-same-origin allow-presentation"
              />
            ) : videoSource?.type === 'file' ? (
              <video
                className="h-full w-full"
                controls
                playsInline
                preload="metadata"
                src={videoSource.src}
              />
            ) : null}
          </AspectRatio>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default Hero101
