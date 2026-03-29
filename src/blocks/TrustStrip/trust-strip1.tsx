import React from 'react'

import { TrustStripBlock } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TrustStrip1: React.FC<TrustStripBlock & { publicContext: PublicContextProps }> = ({
  items,
}) => {
  return (
    <section className="bg-muted/30 border-y py-6">
      <div className="container">
        {Array.isArray(items) && items.length > 0 && (
          <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
            {items.map((item, index) => (
              <div key={index} className="flex items-center gap-3">
                <div className="bg-primary/10 text-primary flex size-10 shrink-0 items-center justify-center rounded-full">
                  {item.icon && <Icon icon={item.icon} size={20} />}
                </div>
                <div>
                  {item.title && <p className="leading-tight font-medium">{item.title}</p>}
                  {item.description && (
                    <p className="text-muted-foreground text-sm">{item.description}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
