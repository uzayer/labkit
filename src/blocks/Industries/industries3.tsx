import { ArrowUpRight } from 'lucide-react'

import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import type { IndustriesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Industries3: React.FC<IndustriesBlock & { publicContext: PublicContextProps }> = ({
  columnLabel1,
  columnLabel2,
  columnLabel3,
  items,
  publicContext,
}) => {
  return (
    <section className="bg-muted min-h-screen py-16">
      <div className="container mx-auto flex flex-col gap-8 px-8">
        <div className="text-muted-foreground grid grid-cols-2 gap-8 font-medium md:grid-cols-3">
          {columnLabel1 && (
            <div className="order-2 pl-10 text-sm md:order-1 lg:pl-10">{columnLabel1}</div>
          )}
          {columnLabel2 && (
            <div className="order-1 pl-5 text-sm md:order-2 md:pl-0">{columnLabel2}</div>
          )}
          {columnLabel3 && <div className="hidden text-sm md:order-3 lg:block">{columnLabel3}</div>}
        </div>

        {Array.isArray(items) && items.length > 0 && (
          <div className="space-y-0">
            {items.map((item) => {
              const rowContent = (
                <div className="group relative mb-2 flex min-h-[100px] flex-col justify-center md:min-h-0 lg:mb-0">
                  <div className="lg:hover:text-secondary relative z-3 grid grid-cols-2 gap-8 transition-all duration-300 md:grid-cols-3 lg:hover:rounded-lg lg:hover:font-medium lg:hover:shadow-lg">
                    <div className="order-2 flex items-center md:order-1">
                      {item.year && (
                        <span className="text-secondary pl-10 text-xs font-medium opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                          {item.year}
                        </span>
                      )}
                    </div>

                    <div className="border-muted-foreground/20 order-1 col-span-1 grid grid-cols-2 gap-8 border-b p-5 transition-all duration-300 md:order-2 md:col-span-2 md:p-10 md:pr-0 md:pl-0 lg:group-hover:border-transparent">
                      <div className="flex items-center">
                        {item.title && (
                          <span className="text-secondary lg:text-foreground lg:group-hover:text-secondary ml-0 pl-0 text-xl font-medium transition-all duration-300 md:text-2xl lg:group-hover:pl-2">
                            {item.title}
                          </span>
                        )}
                      </div>

                      <div className="hidden items-center justify-between gap-4 lg:flex lg:pr-10">
                        {item.description && (
                          <span className="text-secondary/80 text-sm opacity-100 lg:opacity-0 lg:group-hover:opacity-100">
                            {item.description}
                          </span>
                        )}

                        <button className="bg-primary text-secondary flex translate-x-full items-center justify-center rounded-full p-1 opacity-100 shadow-md transition-all duration-300 ease-out lg:opacity-0 lg:group-hover:translate-x-0 lg:group-hover:opacity-100">
                          <ArrowUpRight />
                        </button>
                      </div>
                    </div>
                  </div>

                  {typeof item.image === 'object' && item.image && (
                    <Media
                      resource={item.image}
                      imgClassName="absolute inset-0 z-1 h-full w-full object-cover opacity-100 transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100"
                    />
                  )}

                  <div className="absolute inset-0 z-2 bg-black/20 opacity-100 transition-all duration-300 lg:opacity-0 lg:group-hover:opacity-100" />
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
                  {rowContent}
                </CMSLink>
              ) : (
                <div key={item.id}>{rowContent}</div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}

export default Industries3
