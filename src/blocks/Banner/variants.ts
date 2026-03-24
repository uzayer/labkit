import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  BANNER1: {
    label: 'BANNER1',
    previewImage: '/admin/previews/banner/banner1.webp',
    fields: [],
  },
  BANNER5: {
    label: 'BANNER5',
    previewImage: '/admin/previews/banner/banner5.webp',
    fields: ['position'],
  },
}
