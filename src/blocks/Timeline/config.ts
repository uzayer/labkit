import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import {
  HeadingFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type TimelineDesignVersion = keyof typeof variants

export interface TimelineSection {
  tagline: string
  richText: string
  image: string
}

export const TimelineBlock: Block = {
  slug: 'timeline',
  interfaceName: 'TimelineBlock',
  labels: {
    singular: 'Timeline',
    plural: 'Timelines',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    {
      name: 'heading',
      type: 'text',
      localized: true,
      required: true,
    },
    {
      name: 'sections',
      type: 'array',
      minRows: 1,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['TIMELINE2', 'TIMELINE8'].includes(designVersion),
      },
      fields: [
        {
          name: 'date',
          type: 'date',
          localized: true,
          required: true,
          admin: {
            condition: createBlockItemCondition(['TIMELINE8']),
          },
        },
        {
          name: 'tagline',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            condition: createBlockItemCondition(['TIMELINE2']),
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
          admin: {
            condition: createBlockItemCondition(['TIMELINE2']),
          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                UnorderedListFeature(),
                OrderedListFeature(),
              ]
            },
          }),
        },
      ],
    },
  ],
}
