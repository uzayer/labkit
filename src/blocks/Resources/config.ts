import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const allResourcesDesignVersions = ['resources4'] as const

export type ResourcesDesignVersion = (typeof allResourcesDesignVersions)[number]

export const ResourcesBlock: Block = {
  slug: 'resources',
  interfaceName: 'ResourcesBlock',
  labels: {
    singular: 'Resources',
    plural: 'Resources',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      defaultValue: 'resources4',
      options: allResourcesDesignVersions.map((version) => ({ label: version, value: version })),
    },
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
