import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { AboutBlock, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const About5: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  counter,
  logos,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-20">
        {(headline || text1) && (
          <div className="flex flex-col gap-6">
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-4xl font-semibold md:text-6xl',
                  h2: 'text-4xl font-semibold md:text-5xl',
                  h3: 'text-3xl font-semibold',
                }}
              />
            )}
            {text1 && (
              <RichText
                publicContext={publicContext}
                content={text1}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-muted-foreground max-w-2xl text-lg',
                }}
              />
            )}
          </div>
        )}

        {Array.isArray(counter) && counter.length > 0 && (
          <div className="grid grid-cols-2 gap-10 border-y py-12 md:grid-cols-4">
            {counter.map((c) => (
              <div key={c.id} className="flex flex-col gap-2">
                <p className="text-4xl font-semibold md:text-5xl">{c.value}</p>
                <p className="font-medium">{c.title}</p>
                {c.description && <p className="text-muted-foreground text-sm">{c.description}</p>}
              </div>
            ))}
          </div>
        )}

        {Array.isArray(logos) && logos.length > 0 && (
          <div className="flex flex-col gap-8">
            <div className="flex flex-wrap items-center gap-8">
              {logos.map((logo: MediaType) => (
                <div key={logo.id} className="flex items-center gap-3">
                  <Media imgClassName="h-8 w-auto" resource={logo} />
                  {logo.caption && (
                    <RichText
                      publicContext={publicContext}
                      content={logo.caption}
                      withWrapper={false}
                      overrideStyle={{
                        p: 'text-lg font-semibold',
                      }}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default About5
