import type { VariantManifest } from '@/blocks/utils'

// Conditions are complex (incompatible data shapes) and remain explicit in config.ts.
// This file is the variant registry.
export const variants: VariantManifest = {
  FEATURE19: {
    label: 'FEATURE19',
    previewImage: '/admin/previews/feature/feature19.webp',
    fields: [],
  },
  FEATURE114: {
    label: 'FEATURE114',
    previewImage: '/admin/previews/feature/feature114.webp',
    fields: [],
  },
  FEATURE250: {
    label: 'FEATURE250',
    previewImage: '/admin/previews/feature/feature250.webp',
    fields: [],
  },
}
