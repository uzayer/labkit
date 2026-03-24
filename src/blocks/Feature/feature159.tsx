import { FeatureBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Icon } from '@/components/Icon'
import RichText from '@/components/RichText'

const Feature159: React.FC<FeatureBlock & { publicContext: PublicContextProps }> = ({
  USPs,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-wrap items-start justify-between border-b pb-16">
          {USPs?.map(({ uspIcon, richText, tagline }, index) => (
            <div
              key={index}
              className="flex shrink grow basis-full flex-col items-start justify-between p-6 md:basis-1/2 lg:basis-1/4"
            >
              <div className="mb-3 flex items-center justify-start gap-3">
                {uspIcon && <Icon icon={uspIcon} className="h-5 w-5" />}
                <span className="text-lg font-semibold">{tagline}</span>
              </div>
              {richText && (
                <RichText
                  publicContext={publicContext}
                  content={richText}
                  withWrapper={false}
                  overrideStyle={{ p: 'text-sm text-muted-foreground/50' }}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Feature159
