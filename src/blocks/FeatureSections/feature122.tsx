'use client'

import {
  ArrowRight,
  Blocks,
  Fingerprint,
  LayoutPanelTop,
  MessageCircleMore,
  Users,
} from 'lucide-react'
import React, { useState } from 'react'

import { Button } from '@/components/ui/button'
import { cn } from '@/utils'

interface DataBlockProps {
  title: string
  description: string
  icon: React.ReactNode
}

interface Feature122Props {
  className?: string
}

const Feature122 = ({ className }: Feature122Props) => {
  return (
    <section className={cn('container py-40', className)}>
      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-3 md:grid-rows-3">
        <DataBlock
          title="Communication"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={
            <MessageCircleMore className="text-primary/90 size-10 md:size-12" strokeWidth={1.5} />
          }
        />
        <DataBlock
          title="Integrations"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={<Blocks className="text-primary/90 size-10 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Collaboration"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={<Users className="text-primary/90 size-10 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Customization"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={<LayoutPanelTop className="text-primary/90 size-10 md:size-12" strokeWidth={1.5} />}
        />
        <DataBlock
          title="Security"
          description="Lorem ipsum dolor sit amet, consectetur adipisicing elit."
          icon={<Fingerprint className="text-primary/90 size-10 md:size-12" strokeWidth={1.5} />}
        />
        <div className="bg-accent/80 hover:bg-accent flex w-full grow flex-col gap-6 rounded-lg p-6 transition-all md:col-span-2 md:col-start-2 md:row-span-2 md:row-start-2 lg:p-10">
          <div className="flex flex-col items-start justify-between gap-5 md:flex-row md:items-center">
            <h3 className="max-w-[85%] text-xl font-bold tracking-tight md:max-w-[60%] lg:text-3xl">
              Powerful Features
            </h3>
            <Button className="w-full sm:w-auto" size="lg">
              Get Started
            </Button>
          </div>
          <img
            src="https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg"
            alt="placeholder"
            className="aspect-square h-full w-full rounded-lg object-cover md:aspect-[3]"
          />
        </div>
      </div>
    </section>
  )
}

const DataBlock: React.FC<DataBlockProps> = ({ title, description, icon }) => {
  const [isBlockHover, setBlockHover] = useState<boolean>(false)

  return (
    <a
      href="#"
      className="bg-accent/80 hover:bg-accent flex w-full cursor-pointer flex-col rounded-lg p-6 transition-all lg:p-8"
      onMouseOver={() => setBlockHover(true)}
      onMouseOut={() => setBlockHover(false)}
    >
      <h3
        className={`mb-3 w-fit border-b border-solid border-transparent text-lg font-bold tracking-tight transition lg:text-xl ${isBlockHover && 'border-primary/80!'}`}
      >
        {title}
      </h3>
      <p className="text-muted-foreground/90 mb-5 text-sm lg:text-base">{description}</p>
      <div className="mt-auto flex items-end justify-between">
        <div>{icon}</div>
        <ArrowRight
          className={`text-primary/80 size-5 h-fit transition-all ${isBlockHover && 'translate-x-1.5 transform'}`}
          strokeWidth={1.5}
        />
      </div>
    </a>
  )
}

export { Feature122 }
