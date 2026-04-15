import React from 'react'

import RichText from '@/components/RichText'
import { Page } from '@/payload-types'
import { cn } from '@/utils'
import { PublicContextProps } from '@/utilities/publicContextProps'

interface DashedLineProps {
  orientation?: 'horizontal' | 'vertical'
  className?: string
}

const DashedLine = ({ orientation = 'horizontal', className }: DashedLineProps) => {
  const isHorizontal = orientation === 'horizontal'

  return (
    <div
      className={cn(
        'text-muted-foreground relative',
        isHorizontal ? 'h-px w-full' : 'h-full w-px',
        className,
      )}
    >
      <div
        className={cn(
          isHorizontal
            ? [
                'h-px w-full',
                'bg-[repeating-linear-gradient(90deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]',
                '[mask-image:linear-gradient(90deg,transparent,black_25%,black_75%,transparent)]',
              ]
            : [
                'h-full w-px',
                'bg-[repeating-linear-gradient(180deg,transparent,transparent_4px,currentColor_4px,currentColor_10px)]',
                '[mask-image:linear-gradient(180deg,transparent,black_25%,black_75%,transparent)]',
              ],
        )}
      />
    </div>
  )
}

export const Hero262: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  richText,
  subheading,
  description,
  statsItems,
  publicContext,
}) => {
  return (
    <section className="py-28 lg:py-32">
      <div className="container flex max-w-5xl flex-col justify-between gap-8 md:gap-20 lg:flex-row lg:items-center lg:gap-24 xl:gap-24">
        <div className="flex-[1.5]">
          {richText && (
            <RichText
              publicContext={publicContext}
              content={richText}
              withWrapper={false}
              overrideStyle={{
                h1: 'text-3xl tracking-tight sm:text-4xl md:text-5xl lg:text-6xl',
              }}
            />
          )}

          {subheading && (
            <p className="text-muted-foreground mt-5 text-2xl md:text-3xl lg:text-4xl">
              {subheading}
            </p>
          )}

          {description && (
            <div className="mt-8 hidden max-w-lg text-balance md:block lg:mt-12">
              <RichText
                publicContext={publicContext}
                content={description}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-lg text-muted-foreground',
                }}
              />
            </div>
          )}
        </div>

        {Array.isArray(statsItems) && statsItems.length > 0 && (
          <div className="relative flex flex-1 flex-col justify-center gap-3 pt-10 lg:pt-0 lg:pl-10">
            <DashedLine orientation="vertical" className="absolute top-0 left-0 max-lg:hidden" />
            <DashedLine orientation="horizontal" className="absolute top-0 lg:hidden" />

            {statsItems.map((stat) => (
              <div key={stat.id} className="flex flex-col gap-1">
                <div className="text-4xl tracking-wide md:text-5xl">{stat.value}</div>
                <div className="text-muted-foreground">{stat.title}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
