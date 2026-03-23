import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { AboutBlock, Media as MediaType } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const About18: React.FC<AboutBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  text2,
  text3,
  images,
  label1,
  label2,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="grid grid-cols-1 gap-15 lg:grid-cols-7 lg:gap-12">
          {label1 && <p className="col-span-2 font-medium">{label1}</p>}

          <div className="col-span-4 ml-auto max-w-4xl space-y-10 lg:pl-15">
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-2xl font-medium tracking-tight',
                  h2: 'text-2xl font-medium tracking-tight',
                  h3: 'text-2xl font-medium tracking-tight',
                  p: 'text-2xl font-medium tracking-tight',
                }}
              />
            )}
            {text1 && (
              <RichText
                publicContext={publicContext}
                content={text1}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-foreground/40 w-fit text-lg lg:translate-y-2',
                }}
              />
            )}
          </div>
        </div>

        {Array.isArray(images) && images.length > 0 && (
          <div className="my-20 grid grid-cols-2 items-center gap-4">
            {images.slice(0, 2).map((image: MediaType, i: number) => (
              <Media
                key={image.id}
                resource={image}
                imgClassName={`h-150 w-full object-cover${i === 0 ? ' saturate-0' : ''}`}
              />
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 gap-15 lg:grid-cols-7 lg:gap-12">
          {label2 && <p className="col-span-2 font-medium">{label2}</p>}

          <div className="col-span-4 ml-auto max-w-4xl space-y-10 lg:pl-15">
            {text2 && (
              <RichText
                publicContext={publicContext}
                content={text2}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-2xl font-medium tracking-tight',
                  h2: 'text-2xl font-medium tracking-tight',
                  h3: 'text-2xl font-medium tracking-tight',
                  p: 'text-2xl font-medium tracking-tight',
                }}
              />
            )}
            {text3 && (
              <RichText
                publicContext={publicContext}
                content={text3}
                withWrapper={false}
                overrideStyle={{
                  p: 'text-foreground/40 w-fit text-lg lg:translate-y-2',
                }}
              />
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default About18
