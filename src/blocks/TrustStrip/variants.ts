export type TrustStripVariant = 'TRUSTSTRIP1' | 'TRUSTSTRIP2' | 'TRUSTSTRIP3' | 'TRUSTSTRIP4'

export interface VariantConfig {
  label: string
  previewImage: string
  fields: string[]
}

export const variants: Record<TrustStripVariant, VariantConfig> = {
  TRUSTSTRIP1: {
    label: 'TRUSTSTRIP1',
    previewImage: '/admin/previews/trust-strip/trust-strip1.webp',
    fields: ['items'],
  },
  TRUSTSTRIP2: {
    label: 'TRUSTSTRIP2',
    previewImage: '/admin/previews/trust-strip/trust-strip2.webp',
    fields: [
      'rating',
      'reviewCount',
      'customerCount',
      'customerCountLabel',
      'pressLogosLabel',
      'pressLogos',
    ],
  },
  TRUSTSTRIP3: {
    label: 'TRUSTSTRIP3',
    previewImage: '/admin/previews/trust-strip/trust-strip3.webp',
    fields: ['certifications', 'guarantees'],
  },
  TRUSTSTRIP4: {
    label: 'TRUSTSTRIP4',
    previewImage: '/admin/previews/trust-strip/trust-strip4.webp',
    fields: ['rating', 'reviewCount', 'reviewCountLabel', 'features', 'badgeText', 'badgeIcon'],
  },
}
