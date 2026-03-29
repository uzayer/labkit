import { Star } from 'lucide-react'
import React from 'react'

import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { TrustStripBlock } from '@/payload-types'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const TrustStrip4: React.FC<TrustStripBlock & { publicContext: PublicContextProps }> = ({
  rating,
  reviewCount,
  reviewCountLabel,
  features,
  badgeText,
  badgeIcon,
}) => {
  const ratingValue = parseFloat(rating || '4.8')
  const reviewCountValue = parseInt(reviewCount || '25000', 10)

  return (
    <section className="bg-muted/50 py-4">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
          {/* Rating */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={
                      i < Math.floor(ratingValue)
                        ? 'size-4 fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted size-4'
                    }
                  />
                ))}
              </div>
              {rating && <span className="text-sm font-semibold">{rating}</span>}
            </div>
            <Separator orientation="vertical" className="h-4" />
            {reviewCount && (
              <span className="text-muted-foreground text-sm">
                {reviewCountValue.toLocaleString()}+ {reviewCountLabel || 'verified reviews'}
              </span>
            )}
          </div>

          {/* Features */}
          {Array.isArray(features) && features.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-4 md:gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-muted-foreground flex items-center gap-1.5 text-sm"
                >
                  {feature.icon && <Icon icon={feature.icon} size={16} />}
                  {feature.text && <span>{feature.text}</span>}
                </div>
              ))}
            </div>
          )}

          {/* Verified Badge */}
          {badgeText && (
            <Badge variant="secondary" className="gap-1.5">
              {badgeIcon && <Icon icon={badgeIcon} size={14} className="text-emerald-600" />}
              {badgeText}
            </Badge>
          )}
        </div>
      </div>
    </section>
  )
}
