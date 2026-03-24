import { CMSLink } from '@/components/Link'
import RichText from '@/components/RichText'
import { CtaBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

export const Cta12: React.FC<CtaBlock & { publicContext: PublicContextProps }> = ({
  richText,
  links,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="bg-accent rounded-lg p-8 md:rounded-xl lg:p-12">
          <div className="mx-auto max-w-4xl text-center">
            {richText && (
              <RichText
                publicContext={publicContext}
                content={richText}
                withWrapper={false}
                overrideStyle={{
                  h2: 'mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl',
                  h3: 'mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl',
                  h4: 'mb-4 text-3xl font-semibold md:text-5xl lg:mb-6 lg:text-6xl',
                  p: 'text-muted-foreground mb-8 text-lg font-medium lg:text-xl',
                }}
              />
            )}
            <div className="flex flex-col justify-center gap-3 sm:flex-row sm:gap-4">
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
        </div>
      </div>
    </section>
  )
}

export default Cta12
