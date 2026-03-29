'use client'

import { ArrowUpDown, Check, Heart, Share2, ShoppingCart, X } from 'lucide-react'
import { useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/utils'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { WishlistBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

type SortOption = 'date' | 'price-low' | 'price-high' | 'name'

const sortLabels: Record<SortOption, string> = {
  date: 'Date Added',
  'price-low': 'Price: Low to High',
  'price-high': 'Price: High to Low',
  name: 'Name',
}

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const Wishlist2: React.FC<WishlistBlock & { publicContext: PublicContextProps }> = ({
  headline,
  items: initialItems,
  publicContext,
}) => {
  const [wishlistItems, setWishlistItems] = useState(initialItems || [])
  const [sortBy, setSortBy] = useState<SortOption>('date')

  const removeItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  const sortedItems = [...wishlistItems].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return (a.price ?? 0) - (b.price ?? 0)
      case 'price-high':
        return (b.price ?? 0) - (a.price ?? 0)
      case 'name':
        return (a.title ?? '').localeCompare(b.title ?? '')
      default:
        return new Date(b.dateAdded || '').getTime() - new Date(a.dateAdded || '').getTime()
    }
  })

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-4xl">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            {headline && (
              <RichText
                publicContext={publicContext}
                content={headline}
                withWrapper={false}
                overrideStyle={{
                  h1: 'text-2xl font-semibold tracking-tight md:text-3xl',
                }}
              />
            )}
            <p className="text-muted-foreground mt-1">
              {wishlistItems.length} items in your wishlist
            </p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 size-4" />
              Share List
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm">
                  <ArrowUpDown className="mr-2 size-4" />
                  {sortLabels[sortBy]}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {(Object.keys(sortLabels) as SortOption[]).map((option) => (
                  <DropdownMenuItem key={option} onClick={() => setSortBy(option)}>
                    {sortBy === option && <Check className="mr-2 size-4" />}
                    <span className={sortBy !== option ? 'pl-6' : ''}>{sortLabels[option]}</span>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {sortedItems.length > 0 ? (
          <div className="rounded-lg border">
            {sortedItems.map((item, index) => (
              <div key={item.id}>
                {index > 0 && <Separator />}
                <div className="flex gap-4 p-4">
                  <div className="bg-muted size-24 shrink-0 overflow-hidden rounded-lg sm:size-28">
                    <AspectRatio ratio={1}>
                      {typeof item.image === 'object' && item.image && (
                        <Media
                          resource={item.image}
                          imgClassName={cn('size-full object-cover', !item.inStock && 'opacity-50')}
                        />
                      )}
                    </AspectRatio>
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          {item.title && (
                            <h3 className="leading-tight font-medium">{item.title}</h3>
                          )}
                          {!item.inStock && (
                            <Badge variant="secondary" className="shrink-0">
                              Out of Stock
                            </Badge>
                          )}
                        </div>
                        {item.category && (
                          <p className="text-muted-foreground mt-0.5 text-sm">{item.category}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="shrink-0"
                        onClick={() => item.id && removeItem(item.id)}
                      >
                        <X className="size-4" />
                      </Button>
                    </div>

                    <div className="mt-2 flex items-center gap-2">
                      {item.price != null && (
                        <span className="font-semibold">{formatPrice(item.price)}</span>
                      )}
                      {item.originalPrice != null && (
                        <span className="text-muted-foreground text-sm line-through">
                          {formatPrice(item.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-auto flex items-center justify-between pt-3">
                      {item.dateAdded && (
                        <span className="text-muted-foreground text-xs">
                          Added {item.dateAdded}
                        </span>
                      )}
                      <Button size="sm" disabled={!item.inStock}>
                        <ShoppingCart className="mr-2 size-4" />
                        {item.inStock ? 'Add to Cart' : 'Sold Out'}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-lg border py-16 text-center">
            <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
              <Heart className="text-muted-foreground size-8" />
            </div>
            <h2 className="text-xl font-semibold">No saved items</h2>
            <p className="text-muted-foreground mt-2 max-w-sm">
              Browse our collection and save items you love
            </p>
            <Button className="mt-6">Explore Products</Button>
          </div>
        )}
      </div>
    </section>
  )
}

export default Wishlist2
