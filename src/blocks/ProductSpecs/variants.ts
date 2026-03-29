import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  PRODUCTSPECS1: {
    label: 'PRODUCTSPECS1',
    previewImage: '/admin/previews/product-specs/product-specs1.webp',
    fields: ['title', 'specCategories'],
  },
  PRODUCTSPECS2: {
    label: 'PRODUCTSPECS2',
    previewImage: '/admin/previews/product-specs/product-specs2.webp',
    fields: ['title', 'specCategories', 'highlightsHeading'],
  },
}
