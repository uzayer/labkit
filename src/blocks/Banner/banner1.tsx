'use client'

import { X } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { BannerBlockV2 } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { CMSLink } from '@/components/Link'

const Banner1: React.FC<BannerBlockV2 & { publicContext: PublicContextProps }> = ({
  title,
  description,
  links,
  publicContext,
  defaultVisible,
}) => {
  const [isVisible, setIsVisible] = useState(defaultVisible)

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <section className="bg-background absolute top-0 right-0 left-0 z-50 w-full border-b px-4 py-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex-1 text-center">
          <span className="text-sm">
            <span className="font-medium">{title}</span>{' '}
            <span className="text-muted-foreground">
              {description}{' '}
              {Array.isArray(links) &&
                links.length > 0 &&
                links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      publicContext={publicContext}
                      className="text-muted-foreground hover:text-foreground underline underline-offset-2"
                      key={i}
                      {...link}
                      size={'sm'}
                      appearance={'link'}
                    />
                  )
                })}
              .
            </span>
          </span>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="-mr-2 h-8 w-8 flex-none"
          onClick={handleClose}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>
    </section>
  )
}

export default Banner1
