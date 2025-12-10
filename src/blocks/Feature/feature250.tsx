'use client'

import React, { useRef } from 'react'

import { AnimatedBeam } from '@/components/magicui/animated-beam'
import RichText from '@/components/RichText'
import { FeatureBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Media } from '@/components/Media'
import type { Media as MediaType } from '@/payload-types'
import { Icon } from '@/components/Icon'

const Feature250: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  publicContext,
  richText,
  USPs,
  image,
}) => {
  const icons = USPs?.map(({ uspIcon }) => uspIcon)

  if (!icons) return null

  return (
    <section className="py-32">
      <div className="container">
        {richText && (
          <RichText
            publicContext={publicContext}
            content={richText}
            overrideStyle={{
              h1: 'mx-auto -mb-12 max-w-3xl text-center text-4xl font-medium tracking-tighter md:text-6xl lg:mb-5 lg:text-7xl',
              h2: 'mx-auto -mb-12 max-w-3xl text-center text-4xl font-medium tracking-tighter md:text-6xl lg:mb-5 lg:text-7xl',
              h3: 'mx-auto -mb-12 max-w-3xl text-center text-4xl font-medium tracking-tighter md:text-6xl lg:mb-5 lg:text-7xl',
              p: 'mx-auto mb-4 max-w-sm text-center text-muted-foreground md:text-xl',
            }}
          />
        )}
        <AnimatedBeamIllustration image={image as MediaType} icons={icons as string[]} />
      </div>
    </section>
  )
}

export default Feature250

function AnimatedBeamIllustration({ image, icons }: { image: MediaType; icons: string[] }) {
  const containerRef = useRef<HTMLDivElement>(null)
  // Create refs for icon blocks at the top level
  const iconRef1 = useRef<HTMLDivElement>(null)
  const iconRef2 = useRef<HTMLDivElement>(null)
  const iconRef3 = useRef<HTMLDivElement>(null)
  const iconRef4 = useRef<HTMLDivElement>(null)
  const iconRef5 = useRef<HTMLDivElement>(null)
  const div6Ref = useRef<HTMLDivElement>(null)
  const div7Ref = useRef<HTMLDivElement>(null)

  // Array of icon refs
  const iconRefs = [iconRef1, iconRef2, iconRef3, iconRef4, iconRef5]

  // Icon block configs
  const iconBlocks = [
    {
      ref: iconRef1,
      iconIdx: 0,
      className:
        'absolute top-40 left-0 z-10 flex size-18 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 lg:top-1/2 lg:left-0',
    },
    {
      ref: iconRef2,
      iconIdx: 1,
      className:
        'absolute top-40 right-0 z-10 flex size-18 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 lg:top-20 lg:left-20',
    },
    {
      ref: iconRef3,
      iconIdx: 2,
      className:
        'absolute bottom-0 left-6 z-10 flex size-18 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 lg:bottom-2 lg:left-20',
    },
    {
      ref: iconRef4,
      iconIdx: 3,
      className:
        'absolute right-6 bottom-0 z-10 flex size-18 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 lg:top-0 lg:left-50',
    },
    {
      ref: iconRef5,
      iconIdx: 4,
      className:
        'absolute top-20 z-10 flex size-18 -translate-y-1/2 items-center justify-center rounded-full bg-background p-1 lg:top-100 lg:left-50',
    },
  ]

  // AnimatedBeam configs for mobile and desktop
  const mobileBeams = [
    {
      from: iconRef1,
      to: div6Ref,
      props: { endYOffset: -60, endXOffset: -10, curvature: 10 },
    },
    {
      from: iconRef2,
      to: div6Ref,
      props: { endYOffset: -60, endXOffset: 10, curvature: 10 },
    },
    { from: iconRef3, to: div6Ref },
    { from: iconRef4, to: div6Ref },
    { from: iconRef5, to: div7Ref },
    { from: div6Ref, to: div7Ref },
  ]

  const desktopBeams = [
    { from: iconRef1, to: div6Ref, props: {} },
    { from: iconRef2, to: div6Ref, props: { endYOffset: -30, endXOffset: 60, curvature: -140 } },
    { from: iconRef3, to: div6Ref, props: { endYOffset: 30, curvature: 140 } },
    {
      from: iconRef4,
      to: div6Ref,
      props: { endYOffset: -30, endXOffset: -60, curvature: -180 },
    },
    { from: iconRef5, to: div6Ref, props: { endXOffset: -60, endYOffset: 30, curvature: 180 } },
    { from: div6Ref, to: div7Ref, props: {} },
  ]

  function renderIconBlock({
    ref,
    iconIdx,
    className,
  }: {
    ref: React.RefObject<HTMLDivElement>
    iconIdx: number
    className: string
  }) {
    return (
      <div ref={ref} className={className} key={iconIdx}>
        <div className="border-border bg-background flex size-10 items-center justify-center rounded-lg border p-[5px]">
          <div className="border-border bg-muted flex size-full items-center justify-center rounded-md border">
            {icons[iconIdx] && <Icon icon={icons[iconIdx]} size={16} />}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div
      className="relative flex w-full items-center justify-center overflow-hidden p-10"
      ref={containerRef}
    >
      <div className="flex w-full flex-col items-center justify-between gap-10 lg:flex-row">
        <div className="relative z-10 flex h-100 w-full items-center justify-center rounded-3xl lg:w-0">
          {iconBlocks.map(renderIconBlock)}
        </div>
        <div
          ref={div6Ref}
          className="bg-muted z-10 flex size-32 items-center justify-center rounded-3xl border lg:size-42"
        >
          <Media
            resource={image}
            imgClassName="size-14 lg:size-18"
            className="bg-muted z-10 flex size-32 items-center justify-center rounded-3xl border lg:size-42"
          />
        </div>
        <div
          ref={div7Ref}
          className="bg-muted z-10 mt-40 flex size-15 items-center justify-center rounded-xl border lg:mt-0"
        >
          {icons[5] && <Icon icon={icons[5]} size={28} />}
        </div>
      </div>

      <div className="block lg:hidden">
        {mobileBeams.map((beam, i) => (
          <AnimatedBeam
            key={i}
            duration={3}
            containerRef={containerRef}
            fromRef={beam.from}
            toRef={beam.to}
            direction="vertical"
            {...beam.props}
          />
        ))}
      </div>

      <div className="hidden lg:block">
        {desktopBeams.map((beam, i) => (
          <AnimatedBeam
            key={i}
            duration={3}
            containerRef={containerRef}
            fromRef={beam.from}
            toRef={beam.to}
            {...beam.props}
          />
        ))}
      </div>
    </div>
  )
}
