import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  CHANGELOG1: {
    label: 'Changelog 1',
    fields: [],
  },
  CHANGELOG3: {
    label: 'Changelog 3',
    previewImage: '/admin/previews/changelog/changelog3.webp',
    fields: ['tagline', 'richText', 'entries'],
  },
  CHANGELOG4: {
    label: 'Changelog 4',
    previewImage: '/admin/previews/changelog/changelog4.webp',
    fields: ['richText', 'tagline', 'links', 'entries'],
  },
  CHANGELOG5: {
    label: 'Changelog 5',
    previewImage: '/admin/previews/changelog/changelog5.webp',
    fields: ['richText', 'tagline', 'links', 'entries'],
  },
  CHANGELOG6: {
    label: 'Changelog 6',
    previewImage: '/admin/previews/changelog/changelog6.webp',
    fields: ['richText', 'entries'],
  },
  CHANGELOG8: {
    label: 'Changelog 8',
    previewImage: '/admin/previews/changelog/changelog8.webp',
    fields: ['richText', 'entries'],
  },
}
