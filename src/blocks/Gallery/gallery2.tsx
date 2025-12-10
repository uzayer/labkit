'use client'
import { useState } from 'react'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from '@/components/ui/carousel'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'

const images = [
  {
    url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30',
    alt: 'Group discussion',
  },
  {
    url: 'https://images.unsplash.com/photo-1519741497674-611481863552',
    alt: 'Evening event',
  },
  {
    url: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18',
    alt: 'Group photo',
  },
  {
    url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87',
    alt: 'Night event',
  },
]

export default function Gallery2() {
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  return (
    <div className="px-6 py-12">
      <Carousel className="mx-auto w-full max-w-5xl">
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
              <div className="p-1">
                <div
                  className="cursor-pointer overflow-hidden rounded-lg transition-transform hover:scale-105"
                  onClick={() => setFullscreenImage(image.url)}
                >
                  <img src={image.url} alt={image.alt} className="h-[300px] w-full object-cover" />
                </div>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>

      <Dialog open={!!fullscreenImage} onOpenChange={() => setFullscreenImage(null)}>
        <DialogContent className="h-[90vh] max-w-[90vw] p-0">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50"
            onClick={() => setFullscreenImage(null)}
          >
            <X className="h-4 w-4" />
          </Button>
          <div className="flex h-full w-full items-center justify-center bg-black">
            <img
              src={fullscreenImage || ''}
              alt="Fullscreen view"
              className="max-h-full max-w-full object-contain"
              onClick={() => setFullscreenImage(null)}
            />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
