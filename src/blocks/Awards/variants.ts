import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  AWARDS2: {
    label: 'AWARDS2',
    previewImage: undefined,
    fields: ['sectionLabel', 'accentColor'],
  },
  AWARDS3: {
    label: 'AWARDS3',
    previewImage: undefined,
    fields: ['headline', 'description'],
  },
  AWARDS4: {
    label: 'AWARDS4',
    previewImage: undefined,
    fields: [
      'headline',
      'dateRange',
      'nameColumnHeader',
      'nominationColumnHeader',
      'yearColumnHeader',
    ],
  },
}
