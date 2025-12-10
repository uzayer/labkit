'use client'

import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utilities/cn'
import { Media as MediaType } from '@/payload-types'

export type FeaturedBannerProps = {
  title?: string
  subtitle?: string
  description?: string
  image?: MediaType | undefined
  backgroundColor?: 'primary' | 'secondary' | 'accent' | 'muted'
  link?: {
    label: string
    url?: string
    newTab?: boolean
    type?: 'reference' | 'custom'
    reference?: {
      value: string
      relationTo: string
    }
    section?: string
    appearance?: string
  }
  publicContext: PublicContextProps
}

export const FeaturedBanner: React.FC<FeaturedBannerProps> = ({
  title,
  subtitle,
  description,
  image,
  backgroundColor = 'primary',
  link,
  publicContext,
}) => {
  const bgColorClass = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
  }[backgroundColor]

  return (
    <a
      href={link?.url || '#'}
      className={cn(
        'group relative flex h-full flex-row overflow-hidden rounded-lg px-0 pt-8 lg:rounded-xl lg:px-6',
        bgColorClass,
      )}
    >
      <div className="relative flex w-full flex-col space-y-12 text-left md:space-y-8 lg:w-full lg:flex-row lg:justify-between lg:space-y-0 lg:space-x-6 xl:space-x-12">
        <div className="relative flex flex-col px-6 lg:mb-6 lg:px-0">
          {subtitle && (
            <span className="mb-6 text-xs font-medium tracking-wider uppercase md:mb-8">
              {subtitle}
            </span>
          )}
          {title && (
            <div className="mt-auto flex items-center space-x-1 text-xs">
              {title}
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
          )}
          {description && <p className="text-primary-foreground/85 mt-2 text-xs">{description}</p>}
        </div>
        {image && (
          <div className="relative aspect-[2/1] overflow-clip rounded-t pl-6 lg:max-w-[22rem] lg:pl-0">
            <Media
              resource={image}
              className="aspect-[2/1] h-full w-full translate-y-px object-cover object-center"
            />
          </div>
        )}
      </div>
    </a>
  )
}
