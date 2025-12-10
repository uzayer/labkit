'use client'

import { ArrowRight } from 'lucide-react'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utilities/cn'
import { Media as MediaType } from '@/payload-types'

export type FeaturedImageProps = {
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
      value: string | number
      relationTo: 'pages' | 'posts'
    }
    section?: string
    appearance?:
      | 'link'
      | 'secondary'
      | 'default'
      | 'outline'
      | 'inline'
      | 'destructive'
      | 'ghost'
      | null
  }
  style?: 'overlay' | 'split'
  publicContext: PublicContextProps
}

export const FeaturedImage: React.FC<FeaturedImageProps> = ({
  title,
  subtitle,
  description,
  image,
  backgroundColor = 'primary',
  link,
  style = 'overlay',
  publicContext,
}) => {
  const bgColorClass = {
    primary: 'bg-primary text-primary-foreground',
    secondary: 'bg-secondary text-secondary-foreground',
    accent: 'bg-accent text-accent-foreground',
    muted: 'bg-muted text-muted-foreground',
  }[backgroundColor]

  return (
    <div className="w-full shrink-0 lg:max-w-[18rem]">
      <CMSLink
        publicContext={publicContext}
        url={link?.url || '#'}
        className={cn(
          'group text-primary-foreground relative flex h-full flex-row overflow-hidden rounded-lg px-0 lg:rounded-xl',
          bgColorClass,
        )}
      >
        <div className="relative z-10 flex w-full flex-col space-y-12 text-left lg:space-y-0">
          <div className="relative flex aspect-[2/1] max-h-[11rem] w-full flex-1 justify-center overflow-hidden">
            {image ? (
              <Media
                resource={image}
                imgClassName="h-full w-full object-cover object-center"
                priority
              />
            ) : (
              <div className="bg-muted h-full w-full" />
            )}
          </div>
          <div className={cn('relative z-20 flex flex-col rounded-b-xl p-6', bgColorClass)}>
            <div className="flex items-center space-x-1 text-xs font-medium">
              {subtitle || title}
              <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
            </div>
            {description && <p className="mt-2 text-xs opacity-85">{description}</p>}
          </div>
        </div>
      </CMSLink>
    </div>
  )
}
