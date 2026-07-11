import { Shield, Users, Zap } from 'lucide-react'
import React from 'react'

import { OrbitingCircles } from '@/components/magicui/orbiting-circles'
import { cn } from '@/utils'

interface Hero237Props {
  className?: string
}

const Hero237 = ({ className }: Hero237Props) => {
  const circle1Images = [
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/nextjs-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/react-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vue-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vite-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/spotify-icon.svg',
  ]

  const circle2Images = [
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/typescript-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/tailwind-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/astro-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vercel-icon.svg',
  ]

  const circle3Images = [
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/notion-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/github-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/figma-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/slack-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/laravel-icon.svg',
  ]

  const circle4Images = [
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/gatsby-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/dropbox-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/brave-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/vscode-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/sketch-icon.svg',
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/google-icon.svg',
  ]

  const stats = [
    {
      icon: <Users className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: '+100k',
      description: 'Daily Users',
    },
    {
      icon: <Zap className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: '99.9%',
      description: 'Uptime ',
    },
    {
      icon: <Shield className="size-6 stroke-1 opacity-20 md:size-10" />,
      title: '24/7',
      description: ' Support',
    },
  ]

  return (
    <section className={cn('relative w-screen overflow-hidden border border-b py-32', className)}>
      <div className="relative container flex flex-col lg:flex-row">
        <div className="mt-10 space-y-12 lg:w-1/2">
          <p className="w-fit rounded-full bg-muted px-4 py-1 text-sm uppercase">Why Us?</p>
          <h1 className="font-calSans mt-3 max-w-lg text-6xl font-medium lg:text-7xl">
            <span className="opacity-30">The Only blocks</span> you need
          </h1>
          <p className="max-w-lg text-lg text-muted-foreground">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua.
          </p>

          <ul className="mt-18 flex flex-wrap gap-9">
            {stats.map((stat, index) => (
              <li key={stat.title} className="flex items-center gap-4">
                <div className="flex size-12 items-center justify-center rounded-2xl border md:size-18">
                  {stat.icon}
                </div>
                <div>
                  <h2 className="font-calSans text-2xl font-medium md:text-3xl">{stat.title}</h2>
                  <p className="text-sm md:text-base">{stat.description}</p>
                </div>
                {index !== stats.length - 1 && (
                  <div className="ml-4 h-full w-px bg-gradient-to-t from-black via-border to-transparent" />
                )}
              </li>
            ))}
          </ul>
        </div>
        <div className="relative h-112 lg:w-1/2">
          <div className="relative -left-35 flex h-[1100px] w-[1500px] flex-col items-center justify-center lg:absolute lg:left-0">
            <OrbitingCircles iconSize={40} radius={310} speed={2}>
              {circle1Images.map((src, index) => (
                <div key={index} className="size-12">
                  <img src={src} className="size-full object-contain" alt="" />
                </div>
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={40} radius={390} reverse speed={2}>
              {circle2Images.map((src, index) => (
                <div key={index} className="size-12">
                  <img src={src} className="size-full object-contain" alt="" />
                </div>
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={40} radius={470} speed={2}>
              {circle3Images.map((src, index) => (
                <div key={index} className="size-12">
                  <img src={src} className="size-full object-contain" alt="" />
                </div>
              ))}
            </OrbitingCircles>
            <OrbitingCircles iconSize={40} radius={550} reverse speed={1}>
              {circle4Images.map((src, index) => (
                <div key={index} className="size-12">
                  <img src={src} className="size-full object-contain" alt="" />
                </div>
              ))}
            </OrbitingCircles>
          </div>
        </div>
      </div>
    </section>
  )
}

export { Hero237 }
