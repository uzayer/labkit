import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor, UnorderedListFeature } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const allFaqDesignVersions = [
  { label: 'FAQ1', value: 'FAQ1', image: '/admin/previews/faq/faq1.webp' },
  { label: 'FAQ2', value: 'FAQ2', image: '/admin/previews/faq/faq2.webp' },
  { label: 'FAQ3', value: 'FAQ3', image: '/admin/previews/faq/faq3.webp' },
  { label: 'FAQ4', value: 'FAQ4', image: '/admin/previews/faq/faq4.webp' },
  { label: 'FAQ5', value: 'FAQ5', image: '/admin/previews/faq/faq5.webp' },
  // { label: 'FAQ6', value: 'FAQ6', image: '/admin/previews/faq/faq6.webp' },
  // { label: 'FAQ7', value: 'FAQ7', image: '/admin/previews/faq/faq7.webp' },
  // { label: 'FAQ8', value: 'FAQ8', image: '/admin/previews/faq/faq8.webp' },
  // { label: 'FAQ9', value: 'FAQ9', image: '/admin/previews/faq/faq9.webp' },
  // { label: 'FAQ10', value: 'FAQ10', image: '/admin/previews/faq/faq10.webp' },
  // { label: 'FAQ11', value: 'FAQ11', image: '/admin/previews/faq/faq11.webp' },
  // { label: 'FAQ12', value: 'FAQ12', image: '/admin/previews/faq/faq12.webp' },
  // { label: 'FAQ14', value: 'FAQ14', image: '/admin/previews/faq/faq14.webp' },
  // { label: 'FAQ15', value: 'FAQ15', image: '/admin/previews/faq/faq15.webp' },
  // { label: 'FAQ16', value: 'FAQ16', image: '/admin/previews/faq/faq16.webp' },
  // { label: 'FAQ17', value: 'FAQ17', image: '/admin/previews/faq/faq17.webp' },
] as const

export type FaqDesignVersion = (typeof allFaqDesignVersions)[number]['value']

export const FaqBlock: Block = {
  slug: 'faq',
  interfaceName: 'FaqBlock',
  labels: {
    singular: 'FAQ',
    plural: 'FAQs',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allFaqDesignVersions),
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
