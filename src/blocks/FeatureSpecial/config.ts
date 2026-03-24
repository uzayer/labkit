import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import { link } from '@/fields/link'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

const featureSpecialOptions = [
  { label: 'FEATURE19', value: 'FEATURE19', image: '/admin/previews/feature/feature19.webp' },
  { label: 'FEATURE114', value: 'FEATURE114', image: '/admin/previews/feature/feature114.webp' },
  { label: 'FEATURE250', value: 'FEATURE250', image: '/admin/previews/feature/feature250.webp' },
] as const

export const FeatureSpecialBlock: Block = {
  slug: 'feature-special',
  interfaceName: 'FeatureSpecialBlock',
  labels: {
    singular: 'Feature Special',
    plural: 'Feature Specials',
  },
  fields: [
    backgroundColor,
    designVersionPreview(featureSpecialOptions),

    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE114', 'FEATURE250'].includes(designVersion),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE114',
        },
      },
    }),

    /**
     * Single image: used as central AnimatedBeam node in FEATURE250
     */
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE250',
      },
    },

    /**
     * Multiple images / avatars — FEATURE114
     */
    {
      name: 'images',
      label: 'Images / Avatars',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE114',
      },
    },

    /**
     * Metrics — FEATURE114
     */
    {
      name: 'metrics',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE114',
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'subline',
          type: 'text',
          localized: true,
        },
      ],
    },

    /**
     * USPs — FEATURE114 and FEATURE250
     */
    {
      name: 'USPs',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE114', 'FEATURE250'].includes(designVersion),
      },
      fields: [
        icon({
          label: 'Icon',
          name: 'uspIcon',
        }),
        {
          name: 'tagline',
          type: 'text',
          localized: true,
          admin: {
            condition: createBlockItemCondition(['FEATURE114'], { blockType: 'feature-special' }),
          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {
            condition: createBlockItemCondition(['FEATURE114'], { blockType: 'feature-special' }),
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
            ],
          }),
          label: false,
        },
      ],
    },

    /**
     * Slides — FEATURE19 (tabbed UI; note: component uses its own hardcoded demo data)
     */
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      minRows: 2,
      admin: {
        description: 'Configure the tabbed slides displayed for FEATURE19.',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE19',
      },
      fields: [
        {
          name: 'tabName',
          label: 'Tab label',
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
          type: 'textarea',
          localized: true,
        },
        {
          name: 'features',
          label: 'Bullet points',
          type: 'array',
          minRows: 1,
          fields: [
            {
              name: 'text',
              label: 'Text',
              type: 'text',
              localized: true,
              required: true,
            },
          ],
        },
        link({
          disableIcon: true,
          appearances: ['default', 'outline', 'ghost'],
          overrides: {
            admin: {
              description: 'Optional CTA link for this slide.',
            },
          },
        }),
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
    },
  ],
}
