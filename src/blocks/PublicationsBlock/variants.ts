import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  publications1: {
    label: 'Publications 1',
    fields: ['years'],
  },
  'publications-dynamic': {
    label: 'Publications Dynamic',
    fields: ['filters', 'pinnedPublications'],
  },
}
