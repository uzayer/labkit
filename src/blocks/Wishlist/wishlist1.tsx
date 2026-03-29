'use client'

import { Heart, ShoppingCart, Trash2, TrendingDown } from 'lucide-react'
import { useState } from 'react'

import { AspectRatio } from '@/components/ui/aspect-ratio'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/utils'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { WishlistBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price)
}

const Wishlist1: React.FC<WishlistBlock & { publicContext: PublicContextProps }> = ({
  headline,
  items: initialItems,
  publicContext,
}) => {
  const [wishlistItems, setWishlistItems] = useState(initialItems || [])

  const removeItem = (id: string) => {
    setWishlistItems((prev) => prev.filter((item) => item.id !== id))
  }

  return (
    <section className="py-16 md:py-24">
      <div className="container max-w-6xl">
        <div className="mb-8 flex items-center justify-between">
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
            <p className="text-muted-foreground mt-1">{wishlistItems.length} items saved</p>
          </div>
          {wishlistItems.length > 0 && (
            <Button variant="outline">
              <ShoppingCart className="mr-2 size-4" />
              Add All to Cart
            </Button>
          )}
        </div>

        {wishlistItems.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {wishlistItems.map((item) => (
              <Card key={item.id} className="group gap-0 overflow-hidden p-0">
                <div className="relative">
                  <AspectRatio ratio={1} className="bg-muted">
                    {typeof item.image === 'object' && item.image && (
                      <Media
                        resource={item.image}
                        imgClassName={cn('size-full object-cover', !item.inStock && 'opacity-50')}
                      />
                    )}
                  </AspectRatio>

                  <div className="absolute top-3 left-3 flex flex-col gap-2">
                    {item.priceDrop && (
                      <Badge className="bg-emerald-600 hover:bg-emerald-600">
                        <TrendingDown className="mr-1 size-3" />
                        Price Drop
                      </Badge>
                    )}
                    {!item.inStock && <Badge variant="secondary">Out of Stock</Badge>}
                  </div>

                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute top-3 right-3 opacity-0 transition-opacity group-hover:opacity-100"
                    onClick={() => item.id && removeItem(item.id)}
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </div>

                <CardContent className="p-4">
                  {item.title && <h3 className="leading-tight font-medium">{item.title}</h3>}
                  <div className="mt-2 flex items-center gap-2">
                    {item.price != null && (
                      <span className="text-lg font-semibold">{formatPrice(item.price)}</span>
                    )}
                    {item.originalPrice != null && (
                      <span className="text-muted-foreground text-sm line-through">
                        {formatPrice(item.originalPrice)}
                      </span>
                    )}
                  </div>
                  <Button
                    className="mt-4 w-full"
                    disabled={!item.inStock}
                    variant={item.inStock ? 'default' : 'secondary'}
                  >
                    {item.inStock ? 'Add to Cart' : 'Notify When Available'}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-0">
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div className="bg-muted mb-4 flex size-16 items-center justify-center rounded-full">
                <Heart className="text-muted-foreground size-8" />
              </div>
              <h2 className="text-xl font-semibold">Your wishlist is empty</h2>
              <p className="text-muted-foreground mt-2 max-w-sm">
                Save items you love by clicking the heart icon on any product
              </p>
              <Button className="mt-6">Continue Shopping</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  )
}

export default Wishlist1
