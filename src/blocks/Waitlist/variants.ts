import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  WAITLIST1: {
    label: 'WAITLIST1',
    previewImage: '/admin/previews/waitlist/waitlist1.webp',
    fields: ['headline', 'text1', 'label1', 'images', 'form'],
  },
  WAITLIST2: {
    label: 'WAITLIST2',
    previewImage: '/admin/previews/waitlist/waitlist2.webp',
    fields: ['headline', 'text1', 'label1', 'label2', 'label3', 'images', 'form'],
  },
  WAITLIST3: {
    label: 'WAITLIST3',
    previewImage: '/admin/previews/waitlist/waitlist3.webp',
    fields: ['headline', 'text1', 'label1', 'label2', 'images', 'form'],
  },
}
