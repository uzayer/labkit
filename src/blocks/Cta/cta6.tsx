import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { CtaBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const CTA6: React.FC<CtaBlock & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="border-border bg-accent max-w-full overflow-hidden border-y pt-10 md:pt-16 lg:pt-20">
        <div className="relative container flex flex-col md:flex-row md:space-x-12">
          <div className="mb-72 md:mb-28 md:w-2/3 lg:shrink-0 xl:mb-20 xl:w-1/2">
            {richText && (
              <RichText
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h2: 'mb-3 text-4xl font-semibold md:mb-4 md:text-5xl lg:mb-6',
                  h3: 'mb-3 text-4xl font-semibold md:mb-4 md:text-5xl lg:mb-6',
                  p: 'text-muted-foreground lg:text-lg mb-8',
                }}
              />
            )}
            <div className="flex shrink-0 flex-col gap-2 sm:flex-row">
              {Array.isArray(links) && links.length > 0 && (
                <>
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
                </>
              )}
            </div>
          </div>
          <div className="absolute right-1/2 bottom-0 mr-6 h-min w-[110%] max-w-md translate-x-1/2 md:-right-36 md:mr-0 md:w-3/4 md:max-w-xl md:translate-x-0 lg:mt-auto xl:relative xl:right-0 xl:size-full xl:max-w-full">
            <div className="relative aspect-8/5 size-full min-h-64">
              <div className="bg-background shadow-foreground/20 absolute top-0 right-0 z-40 flex aspect-3/5 w-3/5 -translate-x-[24%] translate-y-[24%] -rotate-30 justify-center rounded-3xl text-clip shadow-lg md:max-xl:-translate-x-[8%] md:max-xl:translate-y-[16%]"></div>
              <div className="bg-background shadow-foreground/20 absolute top-0 right-0 z-40 flex aspect-3/5 w-3/5 -translate-x-[16%] translate-y-[8%] -rotate-15 justify-center rounded-3xl text-clip shadow-xl md:max-xl:-translate-x-[6%] md:max-xl:translate-y-[6%]"></div>
              <div className="bg-background shadow-foreground/20 absolute top-0 right-0 z-40 flex aspect-3/5 w-3/5 items-center justify-center rounded-3xl text-clip shadow-2xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CTA6
