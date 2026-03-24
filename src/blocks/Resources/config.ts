import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type ResourcesDesignVersion = keyof typeof variants

export const ResourcesBlock: Block = {
  slug: 'resources',
  interfaceName: 'ResourcesBlock',
  labels: {
    singular: 'Resources',
    plural: 'Resources',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    {
      name: 'label',
      type: 'text',
      localized: true,
      admin: {
        description: 'Label/tag displayed at the top left',
      },
    },
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      admin: {
        description: 'Heading content for the resources section',
      },
    },
    {
      name: 'resources',
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
        },
        {
          name: 'category',
          type: 'text',
          required: true,
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
          required: false,
        },
        {
          name: 'date',
          type: 'date',
          required: true,
        },
        link({
          appearances: ['default'],
          overrides: {
            required: true,
          },
        }),
      ],
    },
  ],
}
