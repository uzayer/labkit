import type { VariantManifest } from '@/blocks/utils'

// Conditions are complex (negations, createBlockItemCondition) and remain explicit in config.ts.
// This file is the variant registry.
export const variants: VariantManifest = {
  FEATURE50: { label: 'FEATURE50', previewImage: '/admin/previews/feature/feature50.webp', fields: [] },
  FEATURE53: { label: 'FEATURE53', previewImage: '/admin/previews/feature/feature53.webp', fields: [] },
  FEATURE57: { label: 'FEATURE57', previewImage: '/admin/previews/feature/feature57.webp', fields: [] },
  FEATURE70: { label: 'FEATURE70', previewImage: '/admin/previews/feature/feature70.webp', fields: [] },
  FEATURE72: { label: 'FEATURE72', previewImage: '/admin/previews/feature/feature72.webp', fields: [] },
  FEATURE102: { label: 'FEATURE102', previewImage: '/admin/previews/feature/feature102.webp', fields: [] },
  FEATURE105: { label: 'FEATURE105', previewImage: '/admin/previews/feature/feature105.webp', fields: [] },
  FEATURE117: { label: 'FEATURE117', previewImage: '/admin/previews/feature/feature117.webp', fields: [] },
  FEATURE126: { label: 'FEATURE126', previewImage: '/admin/previews/feature/feature126.webp', fields: [] },
}
