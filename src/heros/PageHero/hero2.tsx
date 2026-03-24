import { Badge } from '@/components/ui/badge'
import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { Icon } from '@/components/Icon'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Hero2: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  links,
  images,
  badgeIcon,
  badge,
  richText,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
        <div className="bg-muted flex justify-end">
          {images && images.length > 0 && (
            <Media
              imgClassName="max-h-[600px] w-full rounded-md object-cover lg:max-h-[800px]"
              priority
              resource={images[0]}
            />
          )}
        </div>
        <div className="flex flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left">
          {badge && (
            <Badge variant="outline">
              {badge} {badgeIcon && <Icon icon={badgeIcon} className="ml-2 size-4" />}
            </Badge>
          )}
          {richText && (
            <RichText
              publicContext={publicContext}
              className="flex flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left"
              content={richText}
              enableGutter={false}
              overrideStyle={{
                h1: 'my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl',
                p: 'mb-8 max-w-xl text-muted-foreground lg:text-2xl',
              }}
            />
          )}
          {Array.isArray(links) && links.length > 0 && (
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row lg:justify-start">
              {links.map(({ link }, i) => {
                return (
                  <CMSLink
                    publicContext={publicContext}
                    className="w-full sm:w-auto"
                    key={i}
                    {...link}
                  />
                )
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  )
}
