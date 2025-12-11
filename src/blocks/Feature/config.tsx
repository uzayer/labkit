import { icon } from '@/components/Icon/config'
import { linkGroup } from '@/fields/linkGroup'
import { link } from '@/fields/link'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { designVersionDescription } from '@/components/AdminDashboard/DesignVersionDescription'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { backgroundColor } from '@/fields/color'

export const allFeatureDesignVersions = [
  { label: 'FEATURE1', value: 'FEATURE1', image: '/admin/previews/feature/feature1.webp' },
  // 'FEATURE2',
  // 'FEATURE3',
  // 'FEATURE4',
  // 'FEATURE5',
  // 'FEATURE6',
  // 'FEATURE7',
  // 'FEATURE8',
  // 'FEATURE9',
  // 'FEATURE10',
  // 'FEATURE11',
  // 'FEATURE12',
  // 'FEATURE13',
  // 'FEATURE14',
  // 'FEATURE15',
  // 'FEATURE16',
  // 'FEATURE17',
  // 'FEATURE18',
  { label: 'FEATURE19', value: 'FEATURE19', image: '/admin/previews/feature/feature19.webp' },
  // 'FEATURE20',
  // 'FEATURE21',
  // 'FEATURE22',
  // 'FEATURE23',
  // 'FEATURE24',
  { label: 'FEATURE25', value: 'FEATURE25', image: '/admin/previews/feature/feature25.webp' },
  // 'FEATURE26',
  // 'FEATURE27',
  // 'FEATURE28',
  // 'FEATURE29',
  // 'FEATURE30',
  // 'FEATURE31',
  // 'FEATURE32',
  // 'FEATURE33',
  // 'FEATURE34',
  // 'FEATURE35',
  // 'FEATURE36',
  // 'FEATURE37',
  // 'FEATURE38',
  // 'FEATURE39',
  // 'FEATURE41',
  // 'FEATURE42',
  // 'FEATURE43',
  // 'FEATURE44',
  { label: 'FEATURE50', value: 'FEATURE50', image: '/admin/previews/feature/feature50.webp' },
  // 'FEATURE51',
  // 'FEATURE52',
  { label: 'FEATURE53', value: 'FEATURE53', image: '/admin/previews/feature/feature53.webp' },
  // 'FEATURE54',
  // 'FEATURE55',
  // 'FEATURE56',
  { label: 'FEATURE57', value: 'FEATURE57', image: '/admin/previews/feature/feature57.webp' },
  // 'FEATURE58',
  // 'FEATURE59',
  // 'FEATURE60',
  // 'FEATURE61',
  // 'FEATURE62',
  // 'FEATURE63',
  // 'FEATURE64',
  // 'FEATURE65',
  // 'FEATURE66',
  // 'FEATURE67',
  // 'FEATURE68',
  // 'FEATURE69',
  { label: 'FEATURE70', value: 'FEATURE70', image: '/admin/previews/feature/feature70.webp' },
  // 'FEATURE71',
  { label: 'FEATURE72', value: 'FEATURE72', image: '/admin/previews/feature/feature72.webp' },
  // 'FEATURE73',
  // 'FEATURE74',
  // 'FEATURE75',
  // 'FEATURE76',
  // 'FEATURE77',
  // 'FEATURE78',
  // 'FEATURE79',
  // 'FEATURE80',
  // 'FEATURE81',
  // 'FEATURE82',
  // 'FEATURE83',
  // 'FEATURE85',
  // 'FEATURE86',
  // 'FEATURE87',
  // 'FEATURE89',
  // 'FEATURE90',
  { label: 'FEATURE91', value: 'FEATURE91', image: '/admin/previews/feature/feature91.webp' },
  // 'FEATURE92',
  // 'FEATURE93',
  // 'FEATURE94',
  // 'FEATURE95',
  { label: 'FEATURE97', value: 'FEATURE97', image: '/admin/previews/feature/feature97.webp' },
  // 'FEATURE98',
  { label: 'FEATURE99', value: 'FEATURE99', image: '/admin/previews/feature/feature99.webp' },
  // 'FEATURE101',
  { label: 'FEATURE102', value: 'FEATURE102', image: '/admin/previews/feature/feature102.webp' },
  { label: 'FEATURE103', value: 'FEATURE103', image: '/admin/previews/feature/feature103.webp' },
  // 'FEATURE104',
  { label: 'FEATURE105', value: 'FEATURE105', image: '/admin/previews/feature/feature105.webp' },
  // 'FEATURE106',
  // 'FEATURE107',
  // 'FEATURE108',
  // 'FEATURE109',
  { label: 'FEATURE114', value: 'FEATURE114', image: '/admin/previews/feature/feature114.webp' },
  { label: 'FEATURE117', value: 'FEATURE117', image: '/admin/previews/feature/feature117.webp' },
  { label: 'FEATURE126', value: 'FEATURE126', image: '/admin/previews/feature/feature126.webp' },
  { label: 'FEATURE159', value: 'FEATURE159', image: '/admin/previews/feature/feature159.webp' },
  { label: 'FEATURE250', value: 'FEATURE250', image: '/admin/previews/feature/feature250.webp' },
] as const

export type FeatureDesignVersion = (typeof allFeatureDesignVersions)[number]['value']

/**
 * The Feature block is the shadcnblocks.com feature block integrated in payload.
 * It is using the same field namings as the heros -> PageHero
 */
export const FeatureBlock: Block = {
  slug: 'feature',
  interfaceName: 'FeatureBlock',
  fields: [
    backgroundColor,
    designVersionPreview(allFeatureDesignVersions),
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          [
            'FEATURE1',
            'FEATURE2',
            'FEATURE3',
            'FEATURE4',
            'FEATURE5',
            'FEATURE6',
            'FEATURE57',
            'FEATURE105',
            'FEATURE126',
          ].includes(designVersion),
      },
    },
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE99', 'FEATURE103', 'FEATURE25'].includes(designVersion),
      },
    },
    icon({
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          [
            'FEATURE1',
            'FEATURE2',
            'FEATURE20',
            'FEATURE21',
            'FEATURE24',
            'FEATURE38',
            'FEATURE6',
            'FEATURE7',
          ].includes(designVersion),
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ![
            'FEATURE14',
            'FEATURE28',
            'FEATURE37',
            'FEATURE5',
            'FEATURE51',
            'FEATURE52',
            'FEATURE53',
            'FEATURE56',
            'FEATURE58',
            'FEATURE59',
            'FEATURE62',
            'FEATURE106',
            'FEATURE91',
            'FEATURE159',
          ].includes(designVersion),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { designVersion = '' } = {}) =>
            [
              'FEATURE1',
              'FEATURE2',
              'FEATURE11',
              'FEATURE38',
              'FEATURE50',
              'FEATURE71',
              'FEATURE72',
              'FEATURE73',
              'FEATURE74',
              'FEATURE78',
              'FEATURE80',
              'FEATURE82',
              'FEATURE86',
              'FEATURE90',
              'FEATURE94',
              'FEATURE97',
              'FEATURE98',
              'FEATURE109',
              'FEATURE114',
              'FEATURE126',
            ].includes(designVersion),
        },
      },
    }),
    {
      /**
       * some Features have just one single image
       */
      name: 'image',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          [
            'FEATURE1',
            'FEATURE95',
            'FEATURE87',
            'FEATURE11',
            'FEATURE2',
            'FEATURE24',
            'FEATURE33',
            'FEATURE38',
            'FEATURE58',
            'FEATURE250',
          ].includes(designVersion),
      },
      relationTo: 'media',
      hasMany: false,
    },

    designVersionDescription(
      'description3',
      (_, { designVersion } = {}) => ['FEATURE3'].includes(designVersion),
      {
        en: 'You have feature 3 selected',
        de: 'Du hast feature 3 ausgewählt',
      },
    ),
    designVersionDescription(
      'description91',
      (_, { designVersion } = {}) => ['FEATURE91'].includes(designVersion),
      {
        en: 'You need to have exactly two USPs for FEATURE 91 block to work',
        de: 'Du musst genau zwei USPs haben, damit dieser Block funktioniert',
      },
    ),

    /**
     * multiple images
     */
    {
      name: 'images',
      label: 'Images / Avatars',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['FEATURE114'].includes(designVersion),
      },
      relationTo: 'media',
      hasMany: true,
    },

    /**
     * Metrics with optional subline
     */
    {
      name: 'metrics',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE114', 'FEATURE120', 'FEATURE136'].includes(designVersion),
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

    {
      name: 'USPs',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ![
            'FEATURE1',
            'FEATURE2',
            'FEATURE6',
            'FEATURE7',
            'FEATURE11',
            'FEATURE19',
            'FEATURE24',
            'FEATURE30',
            'FEATURE38',
            'FEATURE55',
            'FEATURE60',
            'FEATURE80',
            'FEATURE86',
            'FEATURE90',
          ].includes(designVersion),
      },
      fields: [
        icon({
          label: 'Icon',
          name: 'uspIcon',
          admin: {
            condition: createBlockItemCondition([
              'FEATURE4',
              'FEATURE5',
              'FEATURE15',
              'FEATURE16',
              'FEATURE26',
              'FEATURE51',
              'FEATURE52',
              'FEATURE57',
              'FEATURE58',
              'FEATURE67',
              'FEATURE76',
              'FEATURE83',
              'FEATURE85',
              'FEATURE89',
              'FEATURE93',
              'FEATURE97',
              'FEATURE101',
              'FEATURE104',
              'FEATURE105',
              'FEATURE106',
              'FEATURE107',
              'FEATURE108',
              'FEATURE114',
              'FEATURE117',
              'FEATURE159',
              'FEATURE250',
            ]),
          },
        }),
        /**
         * Single tagline per USP, for example for feature117
         */
        {
          name: 'tagline',
          type: 'text',
          localized: true,
          admin: {
            condition: createBlockItemCondition([
              'FEATURE1',
              'FEATURE25',
              'FEATURE50',
              'FEATURE53',
              'FEATURE57',
              'FEATURE70',
              'FEATURE72',
              'FEATURE91',
              'FEATURE97',
              'FEATURE99',
              'FEATURE102',
              'FEATURE103',
              'FEATURE114',
              'FEATURE117',
              'FEATURE126',
              'FEATURE159',
            ]),
          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {
            condition: createBlockItemCondition([
              'FEATURE1',
              'FEATURE25',
              'FEATURE50',
              'FEATURE53',
              'FEATURE57',
              'FEATURE70',
              'FEATURE72',
              'FEATURE91',
              'FEATURE97',
              'FEATURE99',
              'FEATURE102',
              'FEATURE103',
              'FEATURE114',
              'FEATURE117',
              'FEATURE126',
              'FEATURE159',
              'NOT FEATURE105',
              // add any other versions as needed, but NOT 'FEATURE105'
            ]),
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
                ParagraphFeature(),
                OrderedListFeature(),
                UnorderedListFeature(),
              ]
            },
          }),
          label: false,
        },
        /**
         * USPs can have 1 or many nested features, with icon and richText.
         * This is a whitelist condition - expand this list when adding new feature blocks
         * that need nested USPFeatures functionality.
         * Currently used by: FEATURE22, FEATURE25, FEATURE91
         */
        {
          name: 'USPFeatures',
          type: 'array',
          admin: {
            description: 'USPs can feature 1 or many features, with icon and richText',
            condition: createBlockItemCondition(['FEATURE22', 'FEATURE25', 'FEATURE91']),
          },
          fields: [
            icon({
              admin: {
                // Show icon for all features except feature25
                condition: createBlockItemCondition(['NOT FEATURE25']),
              },
            }),
            {
              name: 'richText',
              type: 'richText',
              localized: true,
            },
          ],
        },
        linkGroup({
          overrides: {
            maxRows: 2,
            admin: {
              condition: (data, _) => {
                const designVersion = data.layout.find(
                  (block) => block.blockType === 'feature',
                ).designVersion
                return ['FEATURE70', 'FEATURE91'].includes(designVersion)
              },
            },
          },
        }),
        /**
         * Just a single link
         */
        link({
          appearances: false,
          overrides: {
            admin: {
              description:
                'Single link for this USP. Icons might be set automatically, depending on the design version',
              condition: (data, _) => {
                const designVersion = data.layout.find(
                  (block) => block.blockType === 'feature',
                ).designVersion
                return ['FEATURE103', 'FEATURE117'].includes(designVersion)
              },
            },
          },
        }),
        /**
         * USP images
         */
        {
          name: 'image',
          type: 'upload',
          admin: {
            condition: createBlockItemCondition([
              'FEATURE3',
              'FEATURE50',
              'FEATURE51',
              'FEATURE53',
              'FEATURE57',
              'FEATURE102',
              'FEATURE66',
              'FEATURE70',
              'FEATURE72',
              'FEATURE78',
              'FEATURE81',
              'FEATURE117',
              'FEATURE126',
              'FEATURE105',
            ]),
          },
          relationTo: 'media',
          hasMany: false,
        },
      ],
      minRows: 1,
    },
    {
      name: 'slides',
      label: 'Slides',
      type: 'array',
      minRows: 2,
      admin: {
        description: 'Configure the tabbed slides displayed for Feature19.',
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
  labels: {
    singular: 'Feature',
    plural: 'Features',
  },
}
