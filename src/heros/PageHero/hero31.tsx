import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Page } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Hero31: React.FC<Page['hero'] & { publicContext: PublicContextProps }> = ({
  links,
  images,
  richText,
  publicContext,
}) => {
  return (
    <section className="relative overflow-hidden py-32">
      <div className="bg-muted absolute inset-0 overflow-hidden">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 1400 900"
          className="min-h-full min-w-full"
        >
          <defs>
            <filter id="blur1" x="-20%" y="-20%" width="140%" height="140%">
              <feFlood floodOpacity="0" result="BackgroundImageFix" />
              <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
              <feGaussianBlur stdDeviation="200" result="effect1_foregroundBlur" />
            </filter>
            <pattern id="innerGrid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path
                d="M 40 0 L 0 0 0 40"
                fill="none"
                stroke="hsl(from_var(--background)_h_s_l)"
                strokeWidth="0.5"
                strokeOpacity={0.6}
              />
            </pattern>
            <pattern id="grid" width="160" height="160" patternUnits="userSpaceOnUse">
              <rect width="160" height="160" fill="url(#innerGrid)" />
              <path
                d="M 70 80 H 90 M 80 70 V 90"
                fill="none"
                stroke="hsl(from_var(--background)_h_s_l)"
                strokeWidth="1"
                strokeOpacity={0.3}
              />
            </pattern>
          </defs>
          <g filter="url(#blur1)">
            <rect width="1400" height="900" fill="hsl(from_var(--muted)_h_s_l)" />
            <rect
              x="0"
              y="0"
              width="1400"
              height="900"
              fill="hsl(from_var(--primary)_h_s_l/0.1)"
            ></rect>
            <g transform="translate(1400, 900)">
              <path
                d="M-707.3 0C-692.6 -130.2 -677.8 -260.4 -612.6 -353.7C-547.3 -446.9 -431.5 -503.2 -321 -556C-210.5 -608.8 -105.2 -658.1 0 -707.3L0 0Z"
                fill="hsl(from_var(--background)_h_s_l)"
              ></path>
            </g>
            <g transform="translate(0, 0)">
              <path
                d="M707.3 0C662.2 107.6 617.1 215.3 563.8 325.5C510.5 435.7 449 548.5 353.7 612.6C258.3 676.6 129.2 692 0 707.3L0 0Z"
                fill="hsl(from_var(--background)_h_s_l)"
              ></path>
            </g>
          </g>
          <rect width="1400" height="900" fill="url(#grid)" />
        </svg>
      </div>
      <div className="relative container">
        <div className="flex flex-col items-center text-center">
          {richText && (
            <RichText
              publicContext={publicContext}
              className="flex flex-col items-center text-center"
              content={richText}
              enableGutter={false}
              overrideStyle={{
                h1: 'my-6 text-pretty text-4xl font-bold lg:text-6xl',
                p: 'mb-8 max-w-xl text-muted-foreground lg:text-xl',
              }}
            />
          )}

          {Array.isArray(links) && links.length > 0 && (
            <div className="flex w-full flex-col justify-center gap-2 sm:flex-row">
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
      <div className="relative container">
        <div className="mt-16 -mb-48 flex justify-center gap-4 pt-4">
          {images && images.length > 0 && (
            <>
              <Media
                imgClassName="aspect-3/5 w-[320px] rounded-lg border border-border bg-background object-cover"
                priority
                resource={images[0]}
              />
              <div className="absolute inset-0">
                <div className="hidden h-full justify-between px-32 2xl:flex">
                  <div className="flex flex-col gap-8 pb-20">
                    {images && images.length > 1 && (
                      <Media
                        imgClassName="flex h-[120px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[1]}
                      />
                    )}
                    {images && images.length > 2 && (
                      <Media
                        imgClassName="flex h-[190px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[2]}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-8 pt-20">
                    {images && images.length > 3 && (
                      <Media
                        imgClassName="flex h-[190px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[3]}
                      />
                    )}
                    {images && images.length > 4 && (
                      <Media
                        imgClassName="flex h-[120px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[4]}
                      />
                    )}
                  </div>
                </div>
                <div className="mx-auto hidden h-full max-w-6xl items-start justify-between px-12 pt-24 md:flex 2xl:hidden">
                  <div className="flex flex-col gap-8 pb-32">
                    {images && images.length > 1 && (
                      <Media
                        imgClassName="flex h-[120px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[1]}
                      />
                    )}
                  </div>
                  <div className="flex flex-col gap-8 pt-32">
                    {images && images.length > 2 && (
                      <Media
                        imgClassName="flex h-[190px] w-[300px] justify-center text-clip rounded-lg border border-border bg-background object-cover"
                        priority
                        resource={images?.[2]}
                      />
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  )
}
