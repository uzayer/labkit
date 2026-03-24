import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type LogosDesignVersion = keyof typeof variants

export const LogosBlock: Block = {
  slug: 'logos',
  interfaceName: 'LogosBlock',
  labels: {
    singular: 'Logos',
    plural: 'multiple Logos',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    // Always-visible fields
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'logos',
      type: 'upload',
      relationTo: 'media',
      required: true,
      minRows: 5,
      hasMany: true,
    },

    // Explicit: function-created field with condition
    link({
      overrides: {
        admin: {
          condition: (_, { designVersion = '' } = {}) => ['LOGOS2'].includes(designVersion),
        },
      },
    }),

    ...applyVariantConditions(variants, [
      {
        name: 'testimonials',
        type: 'array',
        fields: [
          {
            name: 'quote',
            type: 'text',
            localized: true,
          },
          {
            name: 'name',
            type: 'text',
            localized: true,
          },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
            hasMany: false,
          },
        ],
      },
    ]),
  ],
}
