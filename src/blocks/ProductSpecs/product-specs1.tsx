'use client'

import { ChevronDown } from 'lucide-react'
import { useState } from 'react'

import { Icon } from '@/components/Icon'
import RichText from '@/components/RichText'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import type { ProductSpecsBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { cn } from '@/utils'

const ProductSpecs1: React.FC<ProductSpecsBlock & { publicContext: PublicContextProps }> = ({
  title,
  specCategories,
  publicContext,
}) => {
  const [openCategories, setOpenCategories] = useState<string[]>(
    specCategories?.map((c) => c.id ?? '').filter(Boolean) || [],
  )

  const toggleCategory = (id: string) => {
    setOpenCategories((prev) => (prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]))
  }

  const expandAll = () =>
    setOpenCategories(specCategories?.map((c) => c.id ?? '').filter(Boolean) || [])
  const collapseAll = () => setOpenCategories([])

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          {title && (
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
          )}
          <div className="flex gap-2 text-sm">
            <button onClick={expandAll} className="text-muted-foreground hover:text-foreground">
              Expand all
            </button>
            <span className="text-muted-foreground">·</span>
            <button onClick={collapseAll} className="text-muted-foreground hover:text-foreground">
              Collapse all
            </button>
          </div>
        </div>

        {/* Spec Categories */}
        {Array.isArray(specCategories) && specCategories.length > 0 && (
          <div className="space-y-4">
            {specCategories.map((category) => (
              <Collapsible
                key={category.id}
                open={openCategories.includes(category.id ?? '')}
                onOpenChange={() => toggleCategory(category.id ?? '')}
              >
                <div className="rounded-lg border">
                  <CollapsibleTrigger className="hover:bg-muted/50 flex w-full items-center justify-between p-4 text-left">
                    <div className="flex items-center gap-3">
                      <div className="bg-muted flex size-8 items-center justify-center rounded-md">
                        {category.icon && <Icon icon={category.icon} size={16} />}
                      </div>
                      {category.name && <span className="font-medium">{category.name}</span>}
                    </div>
                    <ChevronDown
                      className={cn(
                        'text-muted-foreground size-5 transition-transform',
                        openCategories.includes(category.id ?? '') && 'rotate-180',
                      )}
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="border-t">
                      <Table>
                        <TableBody>
                          {Array.isArray(category.specs) &&
                            category.specs.map((spec, index) => (
                              <TableRow key={index} className="hover:bg-transparent">
                                <TableCell className="text-muted-foreground w-1/2 py-3">
                                  {spec.label}
                                </TableCell>
                                <TableCell className="py-3 font-medium">{spec.value}</TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}

export default ProductSpecs1
