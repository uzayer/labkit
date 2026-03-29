import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { CMSLink } from '@/components/Link'
import type { WaitlistBlock } from '@/payload-types'
import type { Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Badge } from '@/components/ui/badge'
import { RenderBlocks } from '@/blocks/RenderBlocks'

const Waitlist3: React.FC<WaitlistBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  label1,
  label2,
  images,
  form,
  link,
  publicContext,
}) => {
  const companyLogo = typeof images?.[0] === 'object' ? images[0] : null
  const featureImage = typeof images?.[1] === 'object' ? images[1] : null
  const avatarImages =
    images?.slice(2)?.filter((img): img is MediaType => typeof img === 'object') || []

  return (
    <section className="py-32 lg:h-screen">
      <div className="container h-full">
        <div className="grid h-full grid-cols-1 gap-20 lg:grid-cols-2 lg:gap-0">
          <div className="col-span-1 flex h-full flex-col items-start justify-between gap-20">
            {companyLogo && <Media resource={companyLogo} imgClassName="w-32 dark:invert" />}

            <div className="flex max-w-sm flex-col gap-4 sm:max-w-full lg:max-w-md">
              {label2 && <Badge variant="outline">{label2}</Badge>}

              {headline && (
                <RichText
                  publicContext={publicContext}
                  content={headline}
                  withWrapper={false}
                  overrideStyle={{
                    h3: 'text-3xl font-semibold lg:text-4xl',
                  }}
                />
              )}

              {text1 && (
                <RichText
                  publicContext={publicContext}
                  content={text1}
                  withWrapper={false}
                  overrideStyle={{
                    p: 'text-muted-foreground max-w-md',
                  }}
                />
              )}

              <div className="mt-2 flex flex-col gap-4">
                {form && form[0]?.form && (
                  <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
                )}

                {(avatarImages.length > 0 || label1) && (
                  <div className="flex items-center">
                    <div className="relative flex items-center">
                      {avatarImages.map((avatar, index) => (
                        <div
                          key={avatar.id}
                          style={{ transform: `translateX(-${index * 10}px)` }}
                          className="size-8"
                        >
                          <Media
                            resource={avatar}
                            imgClassName="bg-muted size-full rounded-full border object-cover object-top p-[1px]"
                          />
                        </div>
                      ))}
                      {label1 && (
                        <p
                          style={{
                            transform: `translateX(-${Math.max(0, avatarImages.length - 2) * 10}px)`,
                          }}
                          className="text-muted-foreground text-xs"
                        >
                          {label1}
                        </p>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {link && (
              <p className="text-muted-foreground text-xs">
                &copy; {new Date().getFullYear()} –{' '}
                <CMSLink
                  {...link}
                  publicContext={publicContext}
                  className="text-primary underline"
                />{' '}
                – All rights reserved.
              </p>
            )}
          </div>

          <div className="col-span-1 flex h-full flex-col items-start justify-between overflow-hidden">
            {featureImage && (
              <Media
                resource={featureImage}
                imgClassName="h-full max-h-96 w-full object-cover lg:max-h-full"
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Waitlist3
