'use client'

import { ArrowRight } from 'lucide-react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type CategoryGridProps = {
  title?: string
  items?: Array<{
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

export const CategoryGrid: React.FC<CategoryGridProps> = ({ title, items = [], publicContext }) => {
  return (
    <div className="order-last mt-3 sm:order-none sm:mt-0 sm:py-2 md:p-6">
      {title && (
        <div className="mb-4 text-left leading-none md:col-span-2 lg:col-span-4 lg:mb-6">
          <strong className="text-muted-foreground text-left text-xs font-medium tracking-wider uppercase">
            {title}
          </strong>
        </div>
      )}
      <div className="grid gap-4 lg:grid-cols-2">
        {items?.map((item, index) => (
          <NavigationMenuLink
            key={item.id || index}
            href={item.link?.url || '#'}
            className="group flex flex-row items-center"
          >
            {item.icon && <Icon icon={item.icon} className="mr-2 size-4" />}
            <div className="flex-1 text-sm font-medium">{item.title}</div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  )
}
