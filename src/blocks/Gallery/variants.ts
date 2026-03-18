import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  GALLERY3: {
    label: 'Gallery 3 (Case Studies Carousel)',
    previewImage: '/admin/previews/gallery/gallery3.webp',
    fields: ['richText'],
  },
  GALLERY4: {
    label: 'Gallery 4 (Large Images with Overlay)',
    previewImage: '/admin/previews/gallery/gallery4.webp',
    fields: ['richText'],
  },
  GALLERY5: {
    label: 'Gallery 5 (Carousel)',
    previewImage: '/admin/previews/gallery/gallery5.webp',
    fields: ['richText'],
  },
  GALLERY6: {
    label: 'Gallery 6 (Card Layout)',
    previewImage: '/admin/previews/gallery/gallery6.webp',
    fields: ['richText', 'tagline'],
  },
  GALLERY25: {
    label: 'Gallery 25 (4 Column Grid)',
    previewImage: '/admin/previews/gallery/gallery25.webp',
    fields: [],
  },
  GALLERY26: {
    label: 'Gallery 26 (Blur Vignette)',
    previewImage: '/admin/previews/gallery/gallery26.webp',
    fields: [],
  },
}
