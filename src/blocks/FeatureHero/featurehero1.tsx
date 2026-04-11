import React from 'react'
import { Badge } from '@/components/ui/badge'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const FeatureHero1: React.FC<any & { publicContext: PublicContextProps }> = ({
  badge,
  icon,
  richText,
  image,
  links,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div className="flex flex-col items-center text-center lg:items-start lg:text-left">
            {badge && (
              <Badge variant="outline">
                {badge} {icon && <Icon icon={icon} className="ml-2 size-4" />}
              </Badge>
            )}
            {richText && (
              <RichText
                publicContext={publicContext}
                className="flex flex-col items-center text-center lg:items-start lg:text-left"
                content={richText}
                enableGutter={false}
                overrideStyle={{
                  h1: 'my-6 text-pretty text-4xl font-bold lg:text-6xl',
                  p: 'mb-8 max-w-xl text-muted-foreground lg:text-xl',
                }}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
                {links.map(({ link }: any, i: number) => (
                  <CMSLink
                    publicContext={publicContext}
                    className="w-full sm:w-auto"
                    key={i}
                    {...link}
                  />
                ))}
              </div>
            )}
          </div>
          {image && (
            <Media
              imgClassName="max-h-96 w-full rounded-md object-cover"
              priority
              resource={image}
            />
          )}
        </div>
      </div>
    </section>
  )
}

export default FeatureHero1
