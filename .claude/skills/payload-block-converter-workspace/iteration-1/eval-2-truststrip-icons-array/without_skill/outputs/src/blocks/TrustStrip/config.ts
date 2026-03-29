import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { Block } from 'payload'
import { variants } from './variants'

export type TrustStripDesignVersion = keyof typeof variants

export const TrustStripBlock: Block = {
  slug: 'trust-strip',
  interfaceName: 'TrustStripBlock',
  labels: {
    singular: 'Trust Strip',
    plural: 'Trust Strips',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Item', plural: 'Items' },
        fields: [
          icon({ admin: { description: 'Lucide icon name (e.g. "Truck", "Shield", "Star")' } }),
          { name: 'title', type: 'text', required: true, localized: true },
          { name: 'description', type: 'text', localized: true },
        ],
      },
    ]),
  ],
}
