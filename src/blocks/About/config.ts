import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type AboutDesignVersion = keyof typeof variants

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About',
    plural: 'multiple About',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    // Always-visible fields
    {
      name: 'headline',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
        ],
      }),
    },
    {
      name: 'text1',
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
      name: 'text2',
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
      name: 'text3',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },

    // Explicit: function-created field with condition
    link({
      overrides: {
        admin: {
          condition: (_, { designVersion = '' } = {}) =>
            ['ABOUT3', 'ABOUT4'].includes(designVersion),
        },
      },
    }),

    ...applyVariantConditions(variants, [
      {
        name: 'label1',
        type: 'text',
        localized: true,
      },
      {
        name: 'label2',
        type: 'text',
        localized: true,
      },
      {
        name: 'logos',
        type: 'upload',
        relationTo: 'media',
        hasMany: true,
      },
      {
        name: 'counter',
        type: 'array',
        fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
        ],
      },
    ]),
  ],
}
