import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type FaqDesignVersion = keyof typeof variants

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'badge',
        type: 'text',
        localized: true,
        defaultValue: 'FAQ',
      },
      {
        name: 'calloutText',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => rootFeatures,
        }),
      },
    ]),

    // Always-visible fields
    {
      name: 'headline',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'faqs',
      type: 'array',
      fields: [
        {
          name: 'question',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'answer',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [...rootFeatures, UnorderedListFeature()],
          }),
        },
      ],
    },

    // Explicit: function-created field with condition
    link({
      overrides: {
        name: 'calloutLink',
        admin: {
          condition: (_, { designVersion = '' } = {}) =>
            ['FAQ3', 'FAQ4'].includes(designVersion),
        },
      },
    }),
  ],
}
