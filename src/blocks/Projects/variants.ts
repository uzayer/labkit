import type { VariantManifest } from '@/blocks/utils'

// Top-level `description` is shown only for 17b.
// Per-project array sub-field conditions (year, category, description) remain explicit in config.ts.
export const variants: VariantManifest = {
  '17': {
    label: '17',
    fields: [],
  },
  '17b': {
    label: '17b',
    fields: ['description'],
  },
}
