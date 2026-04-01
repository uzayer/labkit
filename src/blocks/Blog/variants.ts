import type { VariantManifest } from '@/blocks/utils'

// No designVersion-based field conditions — populateBy/selection conditions are independent.
// This file is the variant registry.
export const variants: VariantManifest = {
  BLOG14: {
    label: 'Blog 14 (Featured + Grid)',
    previewImage: '/admin/previews/blog/blog14.webp',
    fields: ['sectionLabel'],
  },
  BLOG29: {
    label: 'Blog 29 (Modern Card Layout)',
    previewImage: '/admin/previews/blog/blog29.webp',
    fields: [],
  },
}
