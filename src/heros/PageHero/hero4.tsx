
import { Avatar, AvatarImage } from '@/components/ui/avatar'
import { Page } from '@/payload-types'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import { Stars } from '@/components/uiCustom/stars'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Hero4: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  links,
  images,
  rating,
  icons,
  tagline,
  richText,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container grid items-center gap-10 lg:grid-cols-2 lg:gap-20">
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
          {richText && (
            <RichText
              publicContext={publicContext}
              className="flex flex-col items-center text-center lg:max-w-3xl lg:items-start lg:text-left"
              content={richText}
              enableGutter={false}
              overrideStyle={{
                h1: 'my-6 text-pretty text-4xl font-bold lg:text-6xl xl:text-7xl',
                p: 'mb-8 max-w-xl text-muted-foreground lg:text-xl',
              }}
            />
          )}

          {rating && (
            <div className="mb-12 flex w-fit flex-col items-center gap-4 sm:flex-row">
              <span className="inline-flex items-center -space-x-4">
                {icons &&
                  icons.length > 0 &&
                  icons.map((icon, i) => {
                    return (
                      <Avatar className="size-12 border" key={i}>
                        <AvatarImage alt="placeholder" />
                        <Media priority resource={icon} />
                      </Avatar>
                    )
                  })}
              </span>
              <div>
                <div className="flex items-center gap-1">
                  <Stars rating={rating} />
                  <span className="font-semibold">{rating?.toFixed(1)}</span>
                </div>
                {tagline && (
                  <p className="text-muted-foreground text-left font-medium">{tagline}</p>
                )}
              </div>
            </div>
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
