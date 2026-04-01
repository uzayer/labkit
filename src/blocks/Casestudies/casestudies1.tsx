import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { CasestudiesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Casestudies1: React.FC<CasestudiesBlock & { publicContext: PublicContextProps }> = ({
  items,
  publicContext,
}) => {
  if (!Array.isArray(items) || items.length === 0) return null

  return (
    <section className="py-32">
      <div className="container">
        <div className="mx-auto grid max-w-2xl gap-6 lg:max-w-5xl lg:grid-cols-2">
          {items.map((item, idx) => {
            const isLarge = idx === 0 || idx === 4

            const cardContent = (
              <>
                {item.image && typeof item.image === 'object' && (
                  <Media
                    resource={item.image}
                    imgClassName="absolute inset-0 h-full w-full rounded-2xl object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
                <div className="absolute inset-0 bg-linear-to-t from-black/80 to-black/10" />
                {item.logo && typeof item.logo === 'object' && (
                  <Media resource={item.logo} imgClassName="isolate h-7 w-fit" />
                )}
                {item.title && (
                  <h2 className="isolate max-w-sm text-lg font-semibold text-white lg:text-xl lg:font-semibold">
                    {item.title}
                  </h2>
                )}
              </>
            )

            return item.link ? (
              <CMSLink
                key={item.id}
                {...item.link}
                appearance="inline"
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-md lg:p-10 ${
                  isLarge ? 'row-span-2 aspect-square lg:aspect-auto' : 'aspect-3/2 md:aspect-2/1'
                }`}
                publicContext={publicContext}
              >
                {cardContent}
              </CMSLink>
            ) : (
              <div
                key={item.id}
                className={`group relative flex h-full flex-col justify-between overflow-hidden rounded-2xl p-6 shadow-md lg:p-10 ${
                  isLarge ? 'row-span-2 aspect-square lg:aspect-auto' : 'aspect-3/2 md:aspect-2/1'
                }`}
              >
                {cardContent}
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

export default Casestudies1
