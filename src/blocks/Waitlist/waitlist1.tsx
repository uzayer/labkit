import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { WaitlistBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { BackgroundLines } from '@/components/ui/background-lines'
import { RenderBlocks } from '@/blocks/RenderBlocks'

const Waitlist1: React.FC<WaitlistBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  label1,
  images,
  form,
  publicContext,
}) => {
  return (
    <section className="flex min-h-screen w-full items-center justify-center overflow-hidden py-32">
      <BackgroundLines className="container flex w-full flex-col items-center justify-center px-4 md:h-full">
        {headline && (
          <RichText
            publicContext={publicContext}
            content={headline}
            withWrapper={false}
            overrideStyle={{
              h2: 'relative z-20 py-2 text-center font-sans text-5xl font-semibold tracking-tighter md:py-10 lg:text-8xl',
            }}
          />
        )}
        {text1 && (
          <RichText
            publicContext={publicContext}
            content={text1}
            withWrapper={false}
            overrideStyle={{
              p: 'text-md text-muted-foreground mx-auto max-w-xl text-center lg:text-lg',
            }}
          />
        )}
        {form && form[0]?.form && (
          <div className="relative z-20 mt-10 w-full max-w-md">
            <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
          </div>
        )}
        {(Array.isArray(images) || label1) && (
          <div className="mt-10 flex items-center gap-2">
            {Array.isArray(images) && images.length > 0 && (
              <span className="inline-flex items-center -space-x-2.5">
                {images.map(
                  (img) =>
                    typeof img === 'object' && (
                      <div key={img.id} className="size-8 overflow-hidden rounded-full">
                        <Media resource={img} imgClassName="size-full object-cover" />
                      </div>
                    ),
                )}
              </span>
            )}
            {label1 && <p className="text-muted-foreground/80 tracking-tight">{label1}</p>}
          </div>
        )}
      </BackgroundLines>
    </section>
  )
}

export default Waitlist1
