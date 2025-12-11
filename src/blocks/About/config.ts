import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'

// About2: headline richText, text1 richText, text2 richText, 6 images, logos, counter: { value, title, optional description }
// About4: headline richText, text1 richText, text2 richText, 6 images, link
// About3: headline richText, text1 richText, text2 richText, 6 images, 6 logos, link
// About5: headline richText, text1 richText, text2 richText, 6 images, logos, counter: { value, title, optional description }

export const allAboutDesignVersions = [
  { label: 'ABOUT1', value: 'ABOUT1', image: '/admin/previews/about/about1.webp' },
  { label: 'ABOUT2', value: 'ABOUT2', image: '/admin/previews/about/about2.webp' },
  { label: 'ABOUT3', value: 'ABOUT3', image: '/admin/previews/about/about3.webp' },
  { label: 'ABOUT4', value: 'ABOUT4', image: '/admin/previews/about/about4.webp' },
  { label: 'ABOUT5', value: 'ABOUT5', image: '/admin/previews/about/about5.webp' },
  // { label: 'ABOUT6', value: 'ABOUT6', image: '/admin/previews/about/about6.webp' },
  // { label: 'ABOUT7', value: 'ABOUT7', image: '/admin/previews/about/about7.webp' },
  // { label: 'ABOUT8', value: 'ABOUT8', image: '/admin/previews/about/about8.webp' },
  // { label: 'ABOUT9', value: 'ABOUT9', image: '/admin/previews/about/about9.webp' },
  // { label: 'ABOUT10', value: 'ABOUT10', image: '/admin/previews/about/about10.webp' },
  // { label: 'ABOUT13', value: 'ABOUT13', image: '/admin/previews/about/about13.webp' },
  // { label: 'ABOUT14', value: 'ABOUT14', image: '/admin/previews/about/about14.webp' },
  // { label: 'ABOUT15', value: 'ABOUT15', image: '/admin/previews/about/about15.webp' },
  // { label: 'ABOUT16', value: 'ABOUT16', image: '/admin/previews/about/about16.webp' },
  // { label: 'ABOUT17', value: 'ABOUT17', image: '/admin/previews/about/about17.webp' },
  // { label: 'ABOUT18', value: 'ABOUT18', image: '/admin/previews/about/about18.webp' },
  // { label: 'ABOUT19', value: 'ABOUT19', image: '/admin/previews/about/about19.webp' },
] as const

export type AboutDesignVersion = (typeof allAboutDesignVersions)[number]['value']

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About',
    plural: 'multiple About',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allAboutDesignVersions),

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

    link({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['ABOUT3', 'ABOUT4'].includes(designVersion),
        },
      },
    }),

    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
    },
    {
      name: 'logos',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          ['ABOUT3', 'ABOUT2', 'ABOUT5'].includes(designVersion),
      },
    },

    {
      name: 'counter',
      type: 'array',
      fields: [
        { name: 'value', type: 'text', required: true },
        { name: 'title', type: 'text', required: true },
        { name: 'description', type: 'text', required: false },
      ],
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          ['ABOUT5', 'ABOUT2', 'ABOUT3'].includes(designVersion),
      },
    },
  ],
}
