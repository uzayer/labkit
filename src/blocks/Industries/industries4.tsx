'use client'

import { AnimatePresence, motion } from 'framer-motion'
import { CornerDownRight } from 'lucide-react'
import { useState } from 'react'

import { Button } from '@/components/ui/button'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { IndustriesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const Industries4: React.FC<IndustriesBlock & { publicContext: PublicContextProps }> = ({
  headline,
  items,
  publicContext,
}) => {
  const [activeItem, setActiveItem] = useState(items?.[0]?.id || '')

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        {headline && (
          <div className="mb-12">
            <RichText
              publicContext={publicContext}
              content={headline}
              withWrapper={false}
              overrideStyle={{
                h2: 'text-4xl md:text-5xl lg:text-6xl',
              }}
            />
          </div>
        )}

        {Array.isArray(items) && items.length > 0 && (
          <>
            {/* Mobile */}
            <div className="space-y-6 lg:hidden">
              {items.map((item) => (
                <div key={item.id} className="border-border overflow-hidden rounded-lg border">
                  <div className="relative aspect-video w-full">
                    {typeof item.image === 'object' && item.image && (
                      <Media resource={item.image} imgClassName="h-full w-full object-cover" />
                    )}
                  </div>

                  <div className="space-y-4 p-6">
                    <div className="flex items-center">
                      {item.title && <span className="text-xl font-semibold">{item.title}</span>}
                    </div>
                    {item.description && (
                      <h3 className="text-muted-foreground text-lg leading-tight">
                        {item.description}
                      </h3>
                    )}
                    {item.link && (
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-primary hover:text-primary/80 p-0 text-sm font-medium"
                        asChild
                      >
                        <CMSLink {...item.link} appearance="inline" publicContext={publicContext}>
                          <CornerDownRight className="mr-1 h-3 w-3" />
                          Learn more
                        </CMSLink>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop */}
            <div className="border-border hidden h-128 overflow-hidden border lg:flex">
              {items.map((item, index) => (
                <div
                  key={item.id}
                  className={`border-border flex h-full cursor-pointer gap-6 overflow-hidden border-l first:border-l-0 ${
                    activeItem === item.id ? 'flex-1' : 'w-48'
                  }`}
                  onMouseEnter={() => setActiveItem(item.id || '')}
                >
                  <div className="flex h-full min-w-0 flex-col justify-between gap-8 p-6">
                    <div className="flex h-14 w-32 items-center">
                      {item.title && <span className="text-xl font-semibold">{item.title}</span>}
                    </div>

                    <div className="flex flex-col justify-between gap-8">
                      <AnimatePresence>
                        {activeItem === item.id && (
                          <motion.div key={`content-${item.id}`} className="space-y-4">
                            {item.description && (
                              <h3 className="text-muted-foreground text-lg leading-tight">
                                {item.description}
                              </h3>
                            )}
                            {item.link && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-primary hover:text-primary/80 p-0 text-sm font-medium"
                                asChild
                              >
                                <CMSLink
                                  {...item.link}
                                  appearance="inline"
                                  publicContext={publicContext}
                                >
                                  <CornerDownRight className="mr-1 h-3 w-3" />
                                  Learn more
                                </CMSLink>
                              </Button>
                            )}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  </div>

                  <AnimatePresence>
                    {activeItem === item.id && (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease: 'easeOut' }}
                        className={`relative h-full min-w-0 ${
                          index === 0 ? 'w-96 flex-shrink-0' : 'flex-1'
                        }`}
                      >
                        {typeof item.image === 'object' && item.image && (
                          <Media resource={item.image} imgClassName="h-full w-full object-cover" />
                        )}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  )
}

export default Industries4
