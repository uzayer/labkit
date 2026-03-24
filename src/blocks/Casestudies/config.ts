import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type CasestudiesDesignVersion = keyof typeof variants

export const logoSizeOptions = [
  {
    label: 'Small (16px and 24px)',
    value: 'h-4 md:h-6',
  },
  {
    label: 'Medium (24px and 32px)',
    value: 'h-6 md:h-8',
  },
  {
    label: 'Large (32px and 40px)',
    value: 'h-8 md:h-10',
  },
  {
    label: 'Extra Large (40px and 48px)',
    value: 'h-10 md:h-12',
  },
]

export const CasestudiesBlock: Block = {
  slug: 'casestudies',
  interfaceName: 'CasestudiesBlock',
  labels: {
    singular: 'Casestudies',
    plural: 'Casestudies',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    {
      name: 'slides',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Name',
        },
        {
          name: 'content',
          type: 'textarea',
          required: true,
          label: 'Content',
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          required: true,
          label: 'Logo',
        },
        {
          name: 'logoClass',
          type: 'select',
          defaultValue: 'h-6 md:h-8',
          options: logoSizeOptions,
          label: 'Logo Size',
        },
        {
          name: 'images',
          type: 'array',
          required: true,
          minRows: 1,
          maxRows: 9,
          fields: [
            {
              name: 'src',
              type: 'upload',
              relationTo: 'media',
              required: true,
              label: 'Image',
            },
            {
              name: 'position',
              type: 'number',
              required: true,
              min: 0,
              max: 8,
              label: 'Grid Position (0-8)',
            },
          ],
        },
      ],
    },
  ],
}
