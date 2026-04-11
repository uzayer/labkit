import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import { link } from '@/fields/link'
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
import { backgroundColor } from '@/fields/color'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export const FeatureMediaBlock: Block = {
  slug: 'feature-media',
  interfaceName: 'FeatureMediaBlock',
  labels: {
    singular: 'Feature Media',
    plural: 'Feature Media',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE57', 'FEATURE105', 'FEATURE126'].includes(designVersion),
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) => designVersion !== 'FEATURE53',
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
          condition: (_, { designVersion = '' } = {}) =>
            ['FEATURE50', 'FEATURE72', 'FEATURE126'].includes(designVersion),
        },
      },
    }),

    {
      name: 'USPs',
      type: 'array',
      minRows: 1,
      fields: [
        icon({
          label: 'Icon',
          name: 'uspIcon',
          admin: {
            condition: createBlockItemCondition(['FEATURE57', 'FEATURE105', 'FEATURE117'], {
              blockType: 'feature-media',
            }),
          },
        }),
        {
          name: 'tagline',
          type: 'text',
          localized: true,
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {
            condition: createBlockItemCondition(['NOT FEATURE53', 'NOT FEATURE105'], {
              blockType: 'feature-media',
            }),
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              FixedToolbarFeature(),
              InlineToolbarFeature(),
              ParagraphFeature(),
              OrderedListFeature(),
              UnorderedListFeature(),
            ],
          }),
          label: false,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          hasMany: false,
        },
        linkGroup({
          overrides: {
            maxRows: 2,
            admin: {
              condition: (data, _) => {
                const designVersion = data.layout?.find(
                  (block: any) => block.blockType === 'feature-media',
                )?.designVersion
                return ['FEATURE70'].includes(designVersion)
              },
            },
          },
        }),
        link({
          appearances: false,
          overrides: {
            admin: {
              description:
                'Single link for this USP. Icons might be set automatically, depending on the design version',
              condition: (data, _) => {
                const designVersion = data.layout?.find(
                  (block: any) => block.blockType === 'feature-media',
                )?.designVersion
                return ['FEATURE117'].includes(designVersion)
              },
            },
          },
        }),
      ],
    },
  ],
}
