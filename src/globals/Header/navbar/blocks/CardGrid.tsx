'use client'

import { ArrowRight } from 'lucide-react'
import { NavigationMenuLink } from '@/components/ui/navigation-menu'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export type CardGridProps = {
  title?: string
  cards?: Array<{
    id?: string
    title?: string
    description?: string
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
    }>
  }>
  publicContext: PublicContextProps
}

export const CardGrid: React.FC<CardGridProps> = ({ title, cards = [], publicContext }) => {
  return (
    <div className="col-span-full grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
      {cards?.map((card, cardIndex) => (
        <div key={card.id || cardIndex} className="rounded-md border border-border p-5">
          <div className="border-b border-border pb-4">
            <div className="group flex flex-col text-left">
              <div className="flex items-center">
                <strong className="text-sm font-medium">{card.title}</strong>
                <ArrowRight className="ml-1 size-4 transition-transform group-hover:translate-x-1" />
              </div>
              {card.description && (
                <p className="mt-1 text-xs text-muted-foreground">{card.description}</p>
              )}
            </div>
          </div>
          {card.links && card.links.length > 0 && (
            <menu className="mt-6 grid gap-y-4">
              {card.links.map((linkItem, linkIndex) => (
                <NavigationMenuLink
                  key={linkItem.id || linkIndex}
                  href={linkItem.link?.url || '#'}
                  className="group flex flex-row items-center space-x-4 text-left text-foreground/85 hover:text-foreground lg:space-x-4 lg:border-0"
                >
                  {linkItem.icon && <Icon icon={linkItem.icon} className="size-4" />}
                  <div className="flex-1 text-sm font-medium">{linkItem.link?.label}</div>
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-1 lg:hidden" />
                </NavigationMenuLink>
              ))}
            </menu>
          )}
        </div>
      ))}
    </div>
  )
}
