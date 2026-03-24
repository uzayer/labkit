import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type ProjectsDesignVersion = keyof typeof variants

export const ProjectsBlock: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlock',
  labels: {
    singular: 'Projects',
    plural: 'Projects',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: {
        description: 'Main heading for the projects section',
      },
    },

    ...applyVariantConditions(variants, [
      {
        name: 'description',
        type: 'text',
        localized: true,
        admin: {
          description: 'Description text below the heading',
        },
      },
    ]),

    {
      name: 'projects',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'location',
          type: 'text',
        },
        // Explicit: nested array sub-field conditions can't use applyVariantConditions
        {
          name: 'year',
          type: 'text',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        link({
          appearances: ['default'],
          overrides: {
            required: true,
          },
        }),
      ],
    },
  ],
}
