'use client'

import { Check, X } from 'lucide-react'
import { useState } from 'react'

import RichText from '@/components/RichText'
import { ScrollableTabsList } from '@/components/shadcnblocks/scrollable-tabslist'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import type { ProductSpecsBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utils'

const ProductSpecs2: React.FC<ProductSpecsBlock & { publicContext: PublicContextProps }> = ({
  title,
  specCategories,
  highlightsHeading,
  publicContext,
}) => {
  const [activeTab, setActiveTab] = useState(specCategories?.[0]?.id || 'overview')

  const renderValue = (value: string) => {
    if (value === 'true' || value === 'false') {
      const boolValue = value === 'true'
      return boolValue ? (
        <Check className="size-5 text-emerald-600" />
      ) : (
        <X className="text-muted-foreground size-5" />
      )
    }
    return value
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-5xl">
        {/* Header */}
        {title && (
          <div className="mb-8">
            <RichText
              publicContext={publicContext}
              content={title}
              withWrapper={false}
              overrideStyle={{
                h2: 'text-2xl font-semibold tracking-tight md:text-3xl',
                h1: 'text-2xl font-semibold tracking-tight md:text-3xl',
                h3: 'text-2xl font-semibold tracking-tight md:text-3xl',
              }}
            />
          </div>
        )}

        {Array.isArray(specCategories) && specCategories.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <ScrollableTabsList>
              <TabsList className="inline-flex w-auto overflow-y-hidden">
                {specCategories.map((group) => (
                  <TabsTrigger key={group.id} value={group.id ?? ''}>
                    {group.name}
                  </TabsTrigger>
                ))}
              </TabsList>
            </ScrollableTabsList>

            {specCategories.map((group) => (
              <TabsContent key={group.id} value={group.id ?? ''} className="mt-0">
                <div className="rounded-lg border">
                  <div className="grid divide-y">
                    {Array.isArray(group.specs) &&
                      group.specs.map((spec, index) => (
                        <div
                          key={index}
                          className={cn(
                            'grid grid-cols-2 gap-4 px-4 py-3 md:px-6',
                            spec.highlight && 'bg-muted/30',
                          )}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-muted-foreground">{spec.label}</span>
                            {spec.highlight && (
                              <Badge variant="secondary" className="text-xs font-normal">
                                Key spec
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center font-medium">
                            {spec.value && renderValue(spec.value)}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        )}

        {/* Key Highlights Summary */}
        {Array.isArray(specCategories) && specCategories.length > 0 && specCategories[0]?.specs && (
          <div className="bg-muted/30 mt-8 rounded-lg p-6">
            {highlightsHeading && <h3 className="mb-4 font-medium">{highlightsHeading}</h3>}
            <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-4">
              {specCategories[0].specs
                .filter((s) => s.highlight)
                .slice(0, 4)
                .map((spec, index) => (
                  <div key={index}>
                    <p className="text-muted-foreground text-sm">{spec.label}</p>
                    <p className="font-semibold">{spec.value}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductSpecs2
