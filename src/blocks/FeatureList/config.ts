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

export const FeatureListBlock: Block = {
  slug: 'feature-list',
  interfaceName: 'FeatureListBlock',
  labels: {
    singular: 'Feature List',
    plural: 'Feature Lists',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['FEATURE99', 'FEATURE103', 'FEATURE25'].includes(designVersion),
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          !['FEATURE91', 'FEATURE159'].includes(designVersion),
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
          condition: (_, { designVersion = '' } = {}) => designVersion === 'FEATURE97',
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
            condition: createBlockItemCondition(['FEATURE97', 'FEATURE159'], {
              blockType: 'feature-list',
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
          name: 'USPFeatures',
          type: 'array',
          admin: {
            description: 'USPs can feature 1 or many features, with icon and richText',
            condition: createBlockItemCondition(['FEATURE25', 'FEATURE91'], {
              blockType: 'feature-list',
            }),
          },
          fields: [
            icon({
              admin: {
                condition: createBlockItemCondition(['NOT FEATURE25'], {
                  blockType: 'feature-list',
                }),
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
                const designVersion = data.layout?.find(
                  (block: any) => block.blockType === 'feature-list',
                )?.designVersion
                return ['FEATURE91'].includes(designVersion)
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
                  (block: any) => block.blockType === 'feature-list',
                )?.designVersion
                return ['FEATURE103'].includes(designVersion)
              },
            },
          },
        }),
      ],
    },
  ],
}
