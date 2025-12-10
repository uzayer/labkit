'use client'

import { ArrowRight } from 'lucide-react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type FeatureListProps = {
  title?: string
  features?: Array<{
    id?: string
    title?: string
    description?: string
    icon?: string
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
    }
  }>
  publicContext: PublicContextProps
}

export const FeatureList: React.FC<FeatureListProps> = ({
  title,
  features = [],
  publicContext,
}) => {
  return (
    <div className="grid w-full gap-y-12 lg:gap-y-6">
      {title && (
        <div className="border-border text-left lg:border-b lg:pb-3">
          <strong className="text-muted-foreground text-left text-xs font-medium tracking-wider uppercase">
            {title}
          </strong>
        </div>
      )}
      <menu className="grid md:grid-cols-3 md:gap-x-6 lg:gap-y-6">
        {features?.map((feature, index) => (
          <NavigationMenuLink
            key={feature.id || index}
            href={feature.link?.url || '#'}
            className="group border-border flex flex-row items-center space-x-4 border-b py-5 text-left sm:py-7 lg:border-0 lg:py-0"
          >
            {feature.icon && (
              <div className="flex aspect-square size-9 shrink-0 items-center justify-center">
                <Icon icon={feature.icon} className="size-5" />
              </div>
            )}
            <div className="flex-1">
              <div className="text-foreground/85 group-hover:text-foreground text-sm font-medium">
                {feature.title}
              </div>
              {feature.description && (
                <p className="text-muted-foreground group-hover:text-foreground mt-1 text-xs">
                  {feature.description}
                </p>
              )}
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </menu>
    </div>
  )
}
