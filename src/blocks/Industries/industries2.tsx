import { Badge } from '@/components/ui/badge'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { IndustriesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Industries2: React.FC<IndustriesBlock & { publicContext: PublicContextProps }> = ({
  tagline,
  headline,
  items,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="mb-16">
          {tagline && (
            <Badge
              variant="outline"
              className="bg-muted text-primary mb-4 rounded-none border-0 p-2 uppercase"
            >
              {tagline}
            </Badge>
          )}
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h2: 'max-w-2xl text-3xl leading-tight font-bold text-balance lg:text-4xl',
              }}
            />
          )}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="space-y-8">
            {items.map((item) => (
              <div
                key={item.id}
                className="border-border border-b pb-8 first:border-t first:pt-8 last:border-b-0"
              >
                <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12 md:items-center md:gap-8">
                  <div className="order-2 md:order-none md:col-span-4">
                    {item.title && (
                      <h3 className="text-foreground text-lg font-semibold md:text-xl">
                        {item.title}
                      </h3>
                    )}
                  </div>
                  <div className="order-1 md:order-none md:col-span-2 md:flex md:justify-center">
                    {typeof item.image === 'object' && item.image && (
                      <Media
                        resource={item.image}
                        imgClassName="h-12 w-12 object-contain md:h-16 md:w-16"
                      />
                    )}
                  </div>
                  <div className="order-3 md:order-none md:col-span-6">
                    {item.description && (
                      <p className="text-muted-foreground text-sm leading-relaxed">
                        {item.description}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Industries2
