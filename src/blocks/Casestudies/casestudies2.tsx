import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import { Separator } from '@/components/ui/separator'
import type { CasestudiesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Casestudies2: React.FC<CasestudiesBlock & { publicContext: PublicContextProps }> = ({
  headline,
  label1,
  items,
  publicContext,
}) => {
  return (
    <section className="py-32">
      <div className="container">
        <div className="flex flex-col gap-6 text-center">
          {label1 && <p className="font-medium">{label1}</p>}
          {headline && (
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h2: 'text-4xl font-medium md:text-5xl',
              }}
            />
          )}
        </div>
        {Array.isArray(items) && items.length > 0 && (
          <div className="mt-20">
            {items.map((item, idx) => (
              <div key={item.id}>
                {idx > 0 && <Separator className="my-20" />}
                <div className="grid gap-16 lg:grid-cols-3 xl:gap-24">
                  <div className="border-border flex flex-col gap-10 sm:flex-row lg:col-span-2 lg:border-r lg:pr-16 xl:pr-24">
                    {item.image && typeof item.image === 'object' && (
                      <Media
                        resource={item.image}
                        imgClassName="aspect-29/35 h-full w-full max-w-60 rounded-2xl object-cover"
                      />
                    )}
                    <div className="flex h-full flex-col justify-between gap-10">
                      {item.description && <q className="sm:text-xl">{item.description}</q>}
                      <div className="flex items-end gap-6">
                        <div className="flex flex-col gap-1">
                          {item.authorName && (
                            <p className="text-foreground text-lg font-semibold">
                              {item.authorName}
                            </p>
                          )}
                          {item.authorRole && (
                            <p className="text-muted-foreground">{item.authorRole}</p>
                          )}
                        </div>
                        {item.logo && typeof item.logo === 'object' && (
                          <Media resource={item.logo} imgClassName="h-auto" />
                        )}
                      </div>
                    </div>
                  </div>
                  {Array.isArray(item.stats) && item.stats.length > 0 && (
                    <div className="flex gap-10 self-center lg:flex-col">
                      {item.stats.map((stat) => (
                        <div key={stat.id} className="flex flex-col gap-2">
                          {stat.value && (
                            <p className="text-foreground text-4xl font-medium sm:text-5xl">
                              {stat.value}
                            </p>
                          )}
                          {stat.label && (
                            <p className="text-foreground font-semibold">{stat.label}</p>
                          )}
                          {stat.statDescription && (
                            <p className="text-muted-foreground">{stat.statDescription}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Casestudies2
