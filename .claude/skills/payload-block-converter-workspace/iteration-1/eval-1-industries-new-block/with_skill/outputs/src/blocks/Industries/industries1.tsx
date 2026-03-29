'use client'

import type { Easing } from 'framer-motion'
import { motion } from 'framer-motion'
import { Plus } from 'lucide-react'
import { Media } from '@/components/Media'
import type { IndustriesBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const easeTransition: Easing = [0.25, 0.1, 0.25, 1]

const Industries1: React.FC<IndustriesBlock & { publicContext: PublicContextProps }> = ({
  title,
  industryLabel,
  industries,
}) => {
  return (
    <section className="py-16">
      <div className="container">
        {title && <h2 className="text-foreground mb-8 text-3xl font-medium">{title}</h2>}
        {Array.isArray(industries) && industries.length > 0 && (
          <div className="grid grid-cols-1 gap-1 lg:grid-cols-2 xl:grid-cols-4">
            {industries.map((industry) => (
              <a href={industry.url ?? undefined} key={industry.id}>
                <motion.div
                  className="group bg-muted relative overflow-hidden"
                  whileHover="hover"
                  initial="initial"
                >
                  {/* Default state: Image and heading */}
                  <motion.div
                    variants={{
                      initial: {
                        opacity: 1,
                        pointerEvents: 'auto',
                        clipPath: 'inset(0% 0% 0% 0%)',
                      },
                      hover: {
                        opacity: 0,
                        pointerEvents: 'none',
                        clipPath: 'inset(0% 0% 100% 0%)',
                      },
                    }}
                    transition={{ duration: 0.4, ease: easeTransition }}
                    className="relative z-0 flex h-full min-h-120 flex-col items-center justify-center lg:min-h-144 xl:min-h-112"
                  >
                    <div className="flex h-full justify-center">
                      {typeof industry.image === 'object' && industry.image && (
                        <Media
                          resource={industry.image}
                          imgClassName="h-full w-full object-cover"
                        />
                      )}
                    </div>
                    {industry.name && (
                      <h3 className="text-foreground absolute bottom-10 text-lg font-medium">
                        {industry.name}
                      </h3>
                    )}
                  </motion.div>

                  {/* Black overlay - slides up from bottom */}
                  <motion.div
                    className="absolute inset-0 z-10 bg-black"
                    variants={{
                      initial: { y: '100%' },
                      hover: { y: '0%' },
                    }}
                    transition={{ duration: 0.4, ease: easeTransition }}
                    style={{ willChange: 'transform' }}
                  />

                  {/* Hover state: Description */}
                  <motion.div
                    variants={{
                      initial: { opacity: 0, y: 20 },
                      hover: { opacity: 1, y: 0 },
                    }}
                    transition={{ duration: 0.4, ease: easeTransition }}
                    className="absolute inset-0 z-20 flex min-h-120 items-center justify-center p-8 text-white lg:min-h-144 xl:min-h-112"
                  >
                    <div className="space-y-3">
                      {industryLabel && <p className="font-medium opacity-90">{industryLabel}:</p>}
                      {industry.description && <p>{industry.description}</p>}
                    </div>
                  </motion.div>

                  {/* Plus button */}
                  <motion.div
                    className="absolute top-4 right-4 z-30"
                    variants={{
                      initial: { opacity: 0.7, rotate: 0 },
                      hover: { opacity: 1, rotate: 90 },
                    }}
                    transition={{ duration: 0.4, ease: easeTransition }}
                  >
                    <div className="relative rounded-full p-2">
                      <div className="bg-muted-foreground/20 absolute inset-0 rounded-full" />
                      <motion.div
                        className="bg-muted-foreground absolute inset-0 rounded-full"
                        variants={{
                          initial: { opacity: 0 },
                          hover: { opacity: 1 },
                        }}
                        transition={{ duration: 0.4, ease: easeTransition }}
                      />
                      <Plus className="relative z-10 size-4" />
                    </div>
                  </motion.div>
                </motion.div>
              </a>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default Industries1
