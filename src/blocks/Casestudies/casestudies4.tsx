import { ArrowRight } from 'lucide-react'

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CasestudiesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Casestudies4: React.FC<CasestudiesBlock & { publicContext: PublicContextProps }> = ({
  items,
  publicContext,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null

  const item = items[0]

  return (
    <section className="py-32">
      <div className="container">
        <div className="bg-muted flex w-full flex-col items-stretch justify-between gap-10 rounded-[.5rem] p-10 lg:flex-row">
          <div className="bg-background flex w-full max-w-[30rem] flex-col gap-10 rounded-[.5rem] p-5">
            {item.logo && typeof item.logo === 'object' && (
              <div className="max-w-[4.875rem]">
                <Media
                  resource={item.logo}
                  imgClassName="block size-full object-contain object-center"
                />
              </div>
            )}
            {Array.isArray(item.stats) && item.stats.length > 0 && (
              <div className="flex w-full flex-col gap-8 sm:flex-row">
                {item.stats.map((stat) => (
                  <div key={stat.id} className="flex flex-col gap-1">
                    {stat.value && <div className="text-xl font-semibold">{stat.value}</div>}
                    {stat.label && (
                      <div className="text-muted-foreground text-sm font-medium">{stat.label}</div>
                    )}
                  </div>
                ))}
              </div>
            )}
            {(item.authorName || item.authorRole || typeof item.authorImage === 'object') && (
              <div className="flex items-center gap-2.5">
                {typeof item.authorImage === 'object' && (
                  <Avatar className="bg-background size-10 rounded-[.5rem] border">
                    <AvatarImage
                      src={
                        typeof item.authorImage?.url === 'string' ? item.authorImage.url : undefined
                      }
                      alt={item.authorName || ''}
                    />
                    <AvatarFallback>{item.authorName || ''}</AvatarFallback>
                  </Avatar>
                )}
                <div className="flex flex-col gap-0.5">
                  {item.authorName && (
                    <div className="text-sm leading-normal font-medium">{item.authorName}</div>
                  )}
                  {item.authorRole && (
                    <div className="text-sm leading-normal font-medium">{item.authorRole}</div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className="flex max-w-[32rem] flex-col gap-5">
            {item.title && (
              <h2 className="text-2xl leading-none font-bold md:text-3xl lg:text-4xl">
                {item.title}
              </h2>
            )}
            {item.description && (
              <p className="text-foreground text-base font-medium">{item.description}</p>
            )}
            {item.link && (
              <div className="shrink-0">
                <Button asChild variant="outline" size="sm">
                  <CMSLink {...item.link} appearance="inline" publicContext={publicContext}>
                    Read Story
                    <ArrowRight />
                  </CMSLink>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

export default Casestudies4
