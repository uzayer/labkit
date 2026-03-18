import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import { icon } from '@/components/Icon/config'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type StatDesignVersion = keyof typeof variants

export const StatsBlock: Block = {
  slug: 'stats',
  interfaceName: 'StatsBlock',
  labels: {
    singular: 'Stats',
    plural: 'Stats',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    // Always-visible
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

    ...applyVariantConditions(variants, [
      {
        name: 'stats',
        type: 'array',
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
    ]),

    // Explicit: function-created field with condition
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
