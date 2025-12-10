import RichText from '@/components/RichText'
import { Page } from '@/payload-types'
import { Media } from '@/components/Media'
import { CMSLink } from '@/components/Link'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Hero6: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  links,
  images,
  richText,
  publicContext,
}) => {
  return (
    <section className="overflow-hidden py-32">
      <div className="container">
        <div className="flex flex-col items-center justify-between gap-20 lg:flex-row">
          <div className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left">
            {richText && (
              <RichText
                publicContext={publicContext}
                className="flex flex-col items-center gap-6 text-center lg:items-start lg:text-left"
                content={richText}
                enableGutter={false}
                overrideStyle={{
                  h1: 'text-pretty text-4xl font-bold lg:max-w-md lg:text-7xl',
                  p: 'max-w-xl text-xl font-medium lg:text-2xl',
                }}
              />
            )}
            {Array.isArray(links) && links.length > 0 && (
              <div className="flex w-full justify-center lg:justify-start">
                {links.map(({ link }, i) => {
                  return (
                    <CMSLink
                      publicContext={publicContext}
                      className="w-full sm:w-auto"
                      size={links.length === 1 ? 'lg' : undefined}
                      key={i}
                      {...link}
                    />
                  )
                })}
              </div>
            )}
          </div>
          {images && images.length > 0 && (
            <Media
              imgClassName="aspect-video rounded-md object-cover"
              priority
              resource={images[0]}
            />
          )}
        </div>
      </div>
    </section>
  )
}
