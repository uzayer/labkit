import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { AboutBlock, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const About2: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  text2,
  text3,
  images,
  counter,
  logos,
  label1,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="flex flex-col gap-28">
        <div className="container flex flex-col gap-10 text-center md:gap-24">
          <div className="mx-auto flex max-w-3xl flex-col gap-6">
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-4xl font-medium md:text-6xl',
                  h2: 'text-4xl font-medium md:text-5xl',
                  h3: 'text-3xl font-medium',
                }}
              />
            )}
            {text1 && (
              <RichText
                publicContext={publicContext}
                content={text1}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-muted-foreground text-lg md:text-xl',
                }}
              />
            )}
          </div>
          {Array.isArray(images) && images.length > 0 && (
            <div className="grid gap-6 md:grid-cols-12">
              {typeof images[0] === 'object' && (
                <Media
                  resource={images[0]}
                  imgClassName="size-full max-h-96 rounded-xl object-cover md:col-span-5"
                />
              )}
              {typeof images[1] === 'object' && (
                <Media
                  resource={images[1]}
                  imgClassName="size-full max-h-96 rounded-xl object-cover md:col-span-4"
                />
              )}
              {typeof images[2] === 'object' && (
                <Media
                  resource={images[2]}
                  imgClassName="size-full max-h-96 rounded-xl object-cover md:col-span-3"
                />
              )}
            </div>
          )}
        </div>

        <div className="container flex flex-col gap-16">
          {text2 && (
            <RichText
              publicContext={publicContext}
              content={text2}
              withWrapper={false}
              overrideStyle={{
                h2: 'max-w-3xl text-4xl font-medium md:text-5xl',
                h3: 'max-w-3xl text-3xl font-medium',
                p: 'max-w-3xl text-4xl font-medium md:text-5xl',
              }}
            />
          )}
          {Array.isArray(counter) && counter.length > 0 && (
            <div className="grid grid-cols-2 gap-6 md:grid-cols-3">
              {counter.map((c) => (
                <div key={c.id} className="flex flex-col gap-6 border-b pb-8">
                  <p className="text-4xl font-medium md:text-5xl">{c.value}</p>
                  <p className="text-muted-foreground">{c.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {Array.isArray(logos) && logos.length > 0 && (
          <div className="bg-muted/50 py-24">
            <div className="container flex flex-col items-center gap-11">
              {label1 && <p className="text-center text-xl font-medium">{label1}</p>}
              <div className="grid grid-cols-2 gap-x-7 gap-y-12 lg:grid-cols-4">
                {logos.map((logo: MediaType) => (
                  <div key={logo.id} className="flex items-center gap-3">
                    <Media imgClassName="h-8 w-auto md:h-14" resource={logo} />
                    {logo.caption && (
                      <RichText
                        publicContext={publicContext}
                        content={logo.caption}
                        withWrapper={false}
                        overrideStyle={{
                          p: 'text-xl font-semibold md:text-4xl',
                        }}
                      />
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {(text3 ||
          (Array.isArray(counter) && counter.length > 0) ||
          (Array.isArray(images) && images.length > 3)) && (
          <div className="container flex flex-col items-center gap-14">
            {text3 && (
              <RichText
                publicContext={publicContext}
                content={text3}
                withWrapper={false}
                overrideStyle={{
                  h2: 'text-center text-4xl font-semibold md:text-5xl',
                  h3: 'text-center text-3xl font-semibold',
                  p: 'text-center text-4xl font-semibold md:text-5xl',
                }}
              />
            )}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              <div className="grid grid-cols-1 gap-6 md:col-span-2 md:grid-cols-2 md:flex-row lg:col-span-1 lg:grid-cols-1 lg:flex-col">
                {typeof images?.[3] === 'object' && (
                  <Media
                    resource={images[3]}
                    imgClassName="max-h-96 w-full rounded-xl object-cover"
                  />
                )}
                {Array.isArray(counter) && counter[0] && (
                  <div className="bg-muted flex flex-col justify-center rounded-xl p-8">
                    <p className="mb-2 text-4xl font-medium">{counter[0].value}</p>
                    <p className="mb-6 font-semibold">{counter[0].title}</p>
                    {counter[0].description && (
                      <p className="text-muted-foreground">{counter[0].description}</p>
                    )}
                  </div>
                )}
              </div>
              {typeof images?.[4] === 'object' && (
                <div className="relative">
                  <Media resource={images[4]} imgClassName="h-full rounded-xl object-cover" />
                </div>
              )}
              {Array.isArray(counter) && counter[1] && (
                <div className="flex flex-col gap-6">
                  <div className="bg-muted rounded-xl p-8">
                    <p className="mb-2 text-4xl font-medium">{counter[1].value}</p>
                    <p className="mb-6 font-semibold">{counter[1].title}</p>
                    {counter[1].description && (
                      <p className="text-muted-foreground">{counter[1].description}</p>
                    )}
                  </div>
                  {typeof images?.[5] === 'object' && (
                    <Media resource={images[5]} imgClassName="max-h-96 rounded-xl object-cover" />
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default About2
