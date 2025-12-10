import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const allFaqDesignVersions = [
  'FAQ1',
  // 'FAQ2',
  // 'FAQ3',
  'FAQ4',
  'FAQ5',
] as const

export type FaqDesignVersion = (typeof allFaqDesignVersions)[number]

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allFaqDesignVersions.map((version) => ({ label: version, value: version })),
    },
    {
      name: 'badge',
      type: 'text',
      localized: true,
      defaultValue: 'FAQ',
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          ['FAQ4', 'FAQ5', 'FAQ6'].includes(designVersion),
      },
    },
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
    {
      name: 'calloutText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          ['FAQ3', 'FAQ4'].includes(designVersion),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => rootFeatures,
      }),
    },
    link({
      overrides: {
        name: 'calloutLink',
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['FAQ3', 'FAQ4'].includes(designVersion),
        },
      },
    }),
  ],
}
