import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  ABOUT1: {
    label: 'ABOUT1',
    previewImage: '/admin/previews/about/about1.webp',
    fields: ['text3', 'label1', 'cards'],
  },
  ABOUT2: {
    label: 'ABOUT2',
    previewImage: '/admin/previews/about/about2.webp',
    fields: ['text3', 'label1', 'logos', 'counter'],
  },
  // ABOUT3: disabled
  // ABOUT4: disabled
  ABOUT5: {
    label: 'ABOUT5',
    previewImage: '/admin/previews/about/about5.webp',
    fields: ['counter', 'logos'],
  },
  ABOUT18: {
    label: 'ABOUT18',
    previewImage: '/admin/previews/about/about18.webp',
    fields: ['label1', 'label2', 'text3'],
  },
}
