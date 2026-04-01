import { MoveRight } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CasestudiesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Casestudies3: React.FC<CasestudiesBlock & { publicContext: PublicContextProps }> = ({
  items,
  publicContext,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null

  const featured = items[0]
  const rest = items.slice(1)

  const featuredContent = (
    <div className="group hover:bg-muted/40 grid gap-4 overflow-hidden px-6 transition-colors duration-500 ease-out lg:grid-cols-2 xl:px-28">
      <div className="flex flex-col justify-between gap-4 pt-8 md:pt-16 lg:pb-16">
        <div className="flex items-center gap-2 text-2xl font-medium">
          {featured.logo && typeof featured.logo === 'object' && (
            <Media resource={featured.logo} imgClassName="h-9" />
          )}
          {featured.company}
        </div>
        <div>
          {featured.tags && (
            <span className="text-muted-foreground text-xs sm:text-sm">{featured.tags}</span>
          )}
          <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
            {featured.title}
            {featured.description && (
              <span className="text-primary/50 group-hover:text-primary/70 font-medium transition-colors duration-500 ease-out">
                {' '}
                {featured.description}
              </span>
            )}
          </h2>
          <div className="flex items-center gap-2 font-medium">
            Read case study
            <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
          </div>
        </div>
      </div>
      <div className="relative isolate py-16">
        {featured.image && typeof featured.image === 'object' && (
          <div className="border-border bg-background relative isolate h-full border p-2">
            <div className="h-full overflow-hidden">
              <Media
                resource={featured.image}
                imgClassName="aspect-14/9 h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )

  return (
    <section className="py-32">
      <div className="container">
        <div className="border-border border">
          {featured.link ? (
            <CMSLink
              {...featured.link}
              appearance="inline"
              className="block"
              publicContext={publicContext}
            >
              {featuredContent}
            </CMSLink>
          ) : (
            featuredContent
          )}
          {rest.length > 0 && (
            <div className="border-border flex border-t">
              <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block" />
              <div className="grid lg:grid-cols-2">
                {rest.map((item, idx) => {
                  const itemContent = (
                    <div
                      className={`group border-border bg-background hover:bg-muted/40 flex flex-col justify-between gap-12 px-6 py-8 transition-colors duration-500 ease-out md:py-16 lg:pb-16 xl:gap-16 ${
                        idx === 0
                          ? 'xl:border-l xl:pl-8'
                          : 'border-t lg:border-t-0 lg:border-l xl:border-r xl:pl-8'
                      }`}
                    >
                      <div className="flex items-center gap-2 text-2xl font-medium">
                        {item.logo && typeof item.logo === 'object' && (
                          <Media resource={item.logo} imgClassName="h-9" />
                        )}
                        {item.company}
                      </div>
                      <div>
                        {item.tags && (
                          <span className="text-muted-foreground text-xs sm:text-sm">
                            {item.tags}
                          </span>
                        )}
                        <h2 className="mt-4 mb-5 text-2xl font-semibold text-balance sm:text-3xl sm:leading-10">
                          {item.title}
                          {item.description && (
                            <span className="text-primary/50 group-hover:text-primary/70 font-medium transition-colors duration-500 ease-out">
                              {' '}
                              {item.description}
                            </span>
                          )}
                        </h2>
                        <div className="flex items-center gap-2 font-medium">
                          Read case study
                          <MoveRight className="h-4 w-4 transition-transform duration-500 ease-out group-hover:translate-x-1" />
                        </div>
                      </div>
                    </div>
                  )

                  return item.link ? (
                    <CMSLink
                      key={item.id}
                      {...item.link}
                      appearance="inline"
                      className="block"
                      publicContext={publicContext}
                    >
                      {itemContent}
                    </CMSLink>
                  ) : (
                    <div key={item.id}>{itemContent}</div>
                  )
                })}
              </div>
              <div className="hidden w-28 shrink-0 bg-[radial-gradient(var(--muted-foreground)_1px,transparent_1px)] [background-size:10px_10px] opacity-15 xl:block" />
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default Casestudies3
