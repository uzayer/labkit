import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  TEAM5: {
    label: 'TEAM5',
    previewImage: undefined,
    fields: ['teamMembers', 'enableCta'],
  },
  'TEAM5-9': {
    label: 'TEAM5-9 (Filterable detailed cards)',
    previewImage: undefined,
    fields: ['categories', 'enableCta'],
  },
  TEAM9: {
    label: 'TEAM9 (Filterable Directory)',
    previewImage: undefined,
    fields: ['categories'],
  },
}
