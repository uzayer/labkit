'use client'

import { ArrowRight } from 'lucide-react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type SimpleLinksProps = {
  title?: string
  links?: Array<{
    id?: string
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
    icon?: string
    description?: string
  }>
  publicContext: PublicContextProps
}

export const SimpleLinks: React.FC<SimpleLinksProps> = ({ title, links = [], publicContext }) => {
  return (
    <div>
      {title && (
        <div className="border-border mb-6 pb-1 text-left lg:border-b">
          <strong className="text-muted-foreground text-left text-xs font-medium tracking-wider uppercase">
            {title}
          </strong>
        </div>
      )}
      <div className="grid gap-4">
        {links?.map((linkItem, index) => (
          <NavigationMenuLink
            key={linkItem.id || index}
            href={linkItem.link?.url || '#'}
            className="group text-foreground/85 hover:text-foreground flex flex-row items-center space-x-4 text-left lg:space-x-4 lg:border-0 lg:py-0"
          >
            {linkItem.icon && (
              <div className="flex size-4 items-center justify-center">
                <Icon icon={linkItem.icon} className="size-4" />
              </div>
            )}
            <div className="flex-1">
              <div className="text-sm font-medium">{linkItem.link?.label}</div>
              {linkItem.description && (
                <p className="text-muted-foreground text-xs">{linkItem.description}</p>
              )}
            </div>
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
          </NavigationMenuLink>
        ))}
      </div>
    </div>
  )
}
