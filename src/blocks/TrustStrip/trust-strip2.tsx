import { Star } from 'lucide-react'
import React from 'react'

import { TrustStripBlock } from '@/payload-types'
import { Media } from '@/components/Media'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TrustStrip2: React.FC<TrustStripBlock & { publicContext: PublicContextProps }> = ({
  rating,
  reviewCount,
  customerCount,
  customerCountLabel,
  pressLogosLabel,
  pressLogos,
}) => {
  const ratingValue = parseFloat(rating || '4.9')
  const reviewCountValue = parseInt(reviewCount || '12500', 10)

  return (
    <section className="py-8">
      <div className="container">
        <div className="flex flex-col items-center gap-6 md:flex-row md:justify-between">
          {/* Rating & Customer Count */}
          <div className="flex flex-wrap items-center justify-center gap-6 md:justify-start">
            {/* Star Rating */}
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.floor(ratingValue)
                        ? 'size-5 fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted size-5'
                    }
                  />
                ))}
              </div>
              {rating && <span className="font-semibold">{rating}</span>}
              {reviewCount && (
                <span className="text-muted-foreground">
                  ({reviewCountValue.toLocaleString()} reviews)
                </span>
              )}
            </div>

            <div className="bg-border hidden h-6 w-px md:block" />

            {/* Customer Count */}
            {customerCount && (
              <p className="text-muted-foreground">
                {customerCountLabel || 'Trusted by'}{' '}
                <span className="text-foreground font-semibold">{customerCount}</span> customers
              </p>
            )}
          </div>

          {/* Press Logos */}
          {Array.isArray(pressLogos) && pressLogos.length > 0 && (
            <div className="flex items-center gap-6">
              {pressLogosLabel && (
                <span className="text-muted-foreground text-sm">{pressLogosLabel}</span>
              )}
              <div className="flex items-center gap-4">
                {pressLogos.map((logo, index) => (
                  <div key={index}>
                    {logo.logo ? (
                      <Media
                        resource={logo.logo}
                        htmlElement={null}
                        imgClassName="h-6 w-auto object-contain"
                      />
                    ) : (
                      logo.name && (
                        <span className="text-muted-foreground text-sm font-semibold">
                          {logo.name}
                        </span>
                      )
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
