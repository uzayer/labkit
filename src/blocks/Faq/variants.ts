import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  FAQ1: {
    label: 'FAQ1',
    previewImage: '/admin/previews/faq/faq1.webp',
    fields: [],
  },
  FAQ2: {
    label: 'FAQ2',
    previewImage: '/admin/previews/faq/faq2.webp',
    fields: [],
  },
  FAQ3: {
    label: 'FAQ3',
    previewImage: '/admin/previews/faq/faq3.webp',
    fields: ['calloutText'],
  },
  FAQ4: {
    label: 'FAQ4',
    previewImage: '/admin/previews/faq/faq4.webp',
    fields: ['badge', 'calloutText'],
  },
  FAQ5: {
    label: 'FAQ5',
    previewImage: '/admin/previews/faq/faq5.webp',
    fields: ['badge'],
  },
}
