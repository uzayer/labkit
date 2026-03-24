'use client'

import { motion } from 'framer-motion'
import React from 'react'

import { CMSLink } from '@/components/Link'
import { VideoText } from '@/components/magicui/video-text'
import { Page } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Hero220: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  presentationVideo,
  publicContext,
  images,
  tagline,
}) => {
  const backgroundUrl =
    images &&
    Array.isArray(images) &&
    images[0] &&
    typeof images[0] === 'object' &&
    'url' in images[0]
      ? images[0].url
      : undefined
  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-32">
      <div className="container">
        <div
          className="absolute top-0 left-0 h-screen w-full overflow-hidden bg-cover bg-top bg-no-repeat opacity-20"
          style={{ backgroundImage: backgroundUrl ? `url(${backgroundUrl})` : 'none' }}
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <motion.div
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="relative flex h-[250px] w-full items-center"
          >
            {presentationVideo?.videoUrl && (
              <VideoText
                src={presentationVideo?.videoUrl}
                className="font-playfair text-[15rem] font-bold tracking-tighter"
                fontFamily="Playfair Display"
              >
                {tagline}
              </VideoText>
            )}
          </motion.div>

          {Array.isArray(links) && links.length > 0 && (
            <div className="mt-4 flex w-full flex-col justify-center gap-2 sm:flex-row">
              {links.map(({ link }, i) => {
                return (
                  <CMSLink
                    publicContext={publicContext}
                    className="w-full sm:w-auto"
                    key={i}
                    {...link}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
