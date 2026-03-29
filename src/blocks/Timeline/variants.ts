import type { VariantManifest } from '@/blocks/utils'

// sections array is shown for all variants — always-visible pass-through.
// Per-section field conditions use createBlockItemCondition and remain explicit in config.ts.
export const variants: VariantManifest = {
  TIMELINE2: {
    label: 'TIMELINE2',
    previewImage: '/admin/previews/timeline/timeline2.webp',
    fields: [],
  },
  TIMELINE8: {
    label: 'TIMELINE8',
    previewImage: '/admin/previews/timeline/timeline8.webp',
    fields: [],
  },
  TIMELINE14: {
    label: 'TIMELINE14',
    previewImage: '/admin/previews/timeline/timeline14.webp',
    fields: [],
  },
}
