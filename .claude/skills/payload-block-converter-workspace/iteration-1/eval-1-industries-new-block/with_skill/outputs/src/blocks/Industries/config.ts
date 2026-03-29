import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { Block } from 'payload'
import { variants } from './variants'

export type IndustriesDesignVersion = keyof typeof variants

export const IndustriesBlock: Block = {
  slug: 'industries',
  interfaceName: 'IndustriesBlock',
  labels: {
    singular: 'Industries',
    plural: 'Industries',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'title',
        type: 'text',
        localized: true,
      },
      {
        name: 'industryLabel',
        type: 'text',
        localized: true,
        admin: {
          description:
            'Label shown in the hover overlay above the industry description (e.g. "Overview")',
        },
      },
      {
        name: 'industries',
        type: 'array',
        labels: { singular: 'Industry', plural: 'Industries' },
        fields: [
          { name: 'name', type: 'text', required: true, localized: true },
          { name: 'description', type: 'text', localized: true },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          },
          { name: 'url', type: 'text' },
        ],
      },
    ]),
  ],
}
