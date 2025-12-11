import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import { icon } from '@/components/Icon/config'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

export const allStatDesignVersions = [
  { label: 'STATS1', value: 'STATS1', image: '/admin/previews/stats/stats1.webp' },
  { label: 'STATS10', value: 'STATS10', image: '/admin/previews/stats/stats10.webp' },
  { label: 'STATS2', value: 'STATS2', image: '/admin/previews/stats/stats2.webp' },
  { label: 'STATS4', value: 'STATS4', image: '/admin/previews/stats/stats4.webp' },
  { label: 'STATS5', value: 'STATS5', image: '/admin/previews/stats/stats5.webp' },
  { label: 'STATS6', value: 'STATS6', image: '/admin/previews/stats/stats6.webp' },
  { label: 'STATS7', value: 'STATS7', image: '/admin/previews/stats/stats7.webp' },
  { label: 'STATS8', value: 'STATS8', image: '/admin/previews/stats/stats8.webp' },
  // { label: 'STATS9', value: 'STATS9', image: '/admin/previews/stats/stats9.webp' },
  // { label: 'STATS11', value: 'STATS11', image: '/admin/previews/stats/stats11.webp' },
  // { label: 'STATS12', value: 'STATS12', image: '/admin/previews/stats/stats12.webp' },
  // { label: 'STATS13', value: 'STATS13', image: '/admin/previews/stats/stats13.webp' },
  // { label: 'STATS14', value: 'STATS14', image: '/admin/previews/stats/stats14.webp' },
  // { label: 'STATS15', value: 'STATS15', image: '/admin/previews/stats/stats15.webp' },
  // { label: 'STATS16', value: 'STATS16', image: '/admin/previews/stats/stats16.webp' },
  // { label: 'STATS17', value: 'STATS17', image: '/admin/previews/stats/stats17.webp' },
  // { label: 'STATS18', value: 'STATS18', image: '/admin/previews/stats/stats18.webp' },
  // { label: 'STATS19', value: 'STATS19', image: '/admin/previews/stats/stats19.webp' },
] as const

export type StatDesignVersion = (typeof allStatDesignVersions)[number]['value']

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allStatDesignVersions),
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
      name: 'stats',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion !== 'STATS10',
      },
      fields: [
        {
          name: 'counter',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
      ],
    },
    {
      name: 'gridColumns',
      type: 'select',
      defaultValue: '3',
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion === 'STATS10',
        description: 'Number of columns in the grid layout',
      },
      options: [
        { label: '2 Columns', value: '2' },
        { label: '3 Columns', value: '3' },
        { label: '4 Columns', value: '4' },
      ],
    },
    {
      name: 'stats10Cards',
      type: 'array',
      label: 'Stats Cards',
      labels: {
        singular: 'Stats Card',
        plural: 'Stats Cards',
      },
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion === 'STATS10',
      },
      fields: [
        icon({
          name: 'avatarIcon',
          admin: {
            description: 'Lucide icon name for avatar (e.g., "User", "Building2")',
          },
        }),
        {
          name: 'avatarFallback',
          type: 'text',
          maxLength: 2,
          admin: {
            description: 'Fallback text if icon fails to load (e.g., "JD")',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Optional company/brand logo',
          },
        },
        {
          name: 'heading',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Large stats number/text (e.g., "89%", "7 HRS")',
          },
        },
        {
          name: 'text',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Description text below the heading',
          },
        },
      ],
    },
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['STATS6', 'STATS8'].includes(designVersion),
        },
      },
    }),
  ],
}
