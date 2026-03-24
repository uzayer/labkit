import { Icon } from '@/components/Icon'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { AboutBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const About1: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  text2,
  text3,
  images,
  label1,
  cards,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container flex flex-col gap-28">
        {(headline || text1) && (
          <div className="flex flex-col gap-7">
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-4xl font-semibold lg:text-7xl',
                  h2: 'text-4xl font-semibold lg:text-5xl',
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
                  p: 'max-w-xl text-lg',
                }}
              />
            )}
          </div>
        )}

        <div className="grid gap-6 md:grid-cols-2">
          {typeof images?.[0] === 'object' && (
            <Media
              resource={images[0]}
              imgClassName="size-full max-h-96 rounded-2xl object-cover"
            />
          )}
          <div className="bg-muted relative overflow-hidden rounded-2xl">
            {typeof images?.[1] === 'object' && (
              <Media resource={images[1]} imgClassName="absolute inset-0 size-full object-cover" />
            )}
            <div className="relative flex h-full min-h-64 flex-col justify-between gap-10 p-10">
              {label1 && <p className="text-sm font-semibold text-white">{label1}</p>}
              {text2 && (
                <RichText
                  publicContext={publicContext}
                  content={text2}
                  withWrapper={false}
                  overrideStyle={{
                    p: 'text-lg font-medium text-white',
                  }}
                />
              )}
            </div>
          </div>
        </div>

        {(text3 || (Array.isArray(cards) && cards.length > 0)) && (
          <div className="flex flex-col gap-6 md:gap-20">
            {text3 && (
              <div className="max-w-xl">
                <RichText
                  publicContext={publicContext}
                  content={text3}
                  withWrapper={false}
                  overrideStyle={{
                    h1: 'mb-2.5 text-4xl font-semibold lg:text-7xl',
                    h2: 'mb-2.5 text-3xl font-semibold md:text-5xl',
                    h3: 'mb-2.5 text-2xl font-semibold',
                    h4: 'mb-2.5 text-xl font-semibold',
                    p: 'text-muted-foreground',
                  }}
                />
              </div>
            )}
            {Array.isArray(cards) && cards.length > 0 && (
              <div className="grid gap-10 md:grid-cols-3">
                {cards.map((card) => (
                  <div key={card.id} className="flex flex-col">
                    {card.icon && (
                      <div className="bg-accent mb-5 flex size-12 items-center justify-center rounded-2xl">
                        <Icon icon={card.icon} size={20} />
                      </div>
                    )}
                    {card.title && (
                      <h3 className="mt-2 mb-3 text-lg font-semibold">{card.title}</h3>
                    )}
                    {card.description && (
                      <p className="text-muted-foreground">{card.description}</p>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  )
}

export default About1
