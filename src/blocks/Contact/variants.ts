import type { VariantManifest } from '@/blocks/utils'

// All Contact variants share the same fields — no conditional fields exist.
// This manifest serves as the registry of registered variants.
export const variants: VariantManifest = {
  CONTACT1: {
    label: 'CONTACT1',
    previewImage: '/admin/previews/contact/contact1.webp',
    fields: [],
  },
  CONTACT2: {
    label: 'CONTACT2',
    previewImage: '/admin/previews/contact/contact2.webp',
    fields: [],
  },
  CONTACT3: {
    label: 'CONTACT3',
    previewImage: '/admin/previews/contact/contact3.webp',
    fields: [],
  },
  CONTACT4: {
    label: 'CONTACT4',
    previewImage: '/admin/previews/contact/contact4.webp',
    fields: [],
  },
}
