import { backgroundColor } from '@/fields/color'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { Page, AwardsBlock as AwardsBlockType } from '@/payload-types'
import { parentLayoutCondition } from '@/utilities/parentLayoutCondition'

export const allAwardsDesignVersions = ['AWARDS2', 'AWARDS3', 'AWARDS4'] as const

export type AwardsDesignVersion = (typeof allAwardsDesignVersions)[number]

export const AwardsBlock: Block = {
  slug: 'awards',
  interfaceName: 'AwardsBlock',
  labels: {
    singular: 'Awards',
    plural: 'Awards',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allAwardsDesignVersions.map((version) => ({ label: version, value: version })),
      defaultValue: 'AWARDS2',
    },
    {
      name: 'sectionLabel',
      type: 'text',
      localized: true,
      defaultValue: 'AWARDS',
      admin: {
        description: 'Label displayed in the sticky sidebar',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS2',
      },
    },
    {
      name: 'accentColor',
      type: 'select',
      required: true,
      defaultValue: 'orange-500',
      options: [
        { label: 'Orange', value: 'orange-500' },
        { label: 'Blue', value: 'blue-500' },
        { label: 'Green', value: 'green-500' },
        { label: 'Red', value: 'red-500' },
        { label: 'Purple', value: 'purple-500' },
        { label: 'Pink', value: 'pink-500' },
        { label: 'Yellow', value: 'yellow-500' },
        { label: 'Indigo', value: 'indigo-500' },
        { label: 'Teal', value: 'teal-500' },
        { label: 'Cyan', value: 'cyan-500' },
      ],
      admin: {
        description: 'Color for the accent dot next to the section label',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS2',
      },
    },
    {
      name: 'headline',
      type: 'richText',
      localized: true,
      admin: {
        description: 'Main section heading',
        condition: (_, { designVersion = '' } = {}) =>
          designVersion === 'AWARDS3' || designVersion === 'AWARDS4',
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'description',
      type: 'textarea',
      localized: true,
      admin: {
        description: 'Descriptive text below the headline',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS3',
      },
    },
    {
      name: 'dateRange',
      type: 'text',
      localized: true,
      defaultValue: '(2015-25©)',
      admin: {
        description: 'Date range text displayed in header (e.g., "(2015-25©)")',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS4',
      },
    },
    {
      name: 'nameColumnHeader',
      type: 'text',
      localized: true,
      defaultValue: 'Name',
      admin: {
        description: 'Header text for the name column in the table',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS4',
      },
    },
    {
      name: 'nominationColumnHeader',
      type: 'text',
      localized: true,
      defaultValue: 'Nomination',
      admin: {
        description: 'Header text for the nomination/description column in the table',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS4',
      },
    },
    {
      name: 'yearColumnHeader',
      type: 'text',
      localized: true,
      defaultValue: 'Year',
      admin: {
        description: 'Header text for the year column in the table',
        condition: (_, { designVersion = '' } = {}) => designVersion === 'AWARDS4',
      },
    },
    {
      name: 'awards',
      label: {
        singular: 'Award',
        plural: 'Awards',
      },
      type: 'array',
      required: true,
      minRows: 1,
      fields: [
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Award title or name',
          },
        },
        {
          name: 'year',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Year the award was received',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description:
              'Optional description or additional details about the award. For AWARDS4, this is displayed in the Nomination column.',
            condition: (parent: Page, { id }) => {
              const designVersion = parentLayoutCondition<AwardsBlockType>(
                parent,
                id,
                'awards',
              )?.designVersion
              return designVersion === 'AWARDS2' || designVersion === 'AWARDS4'
            },
          },
        },
        {
          name: 'categories',
          type: 'array',
          label: {
            singular: 'Category',
            plural: 'Categories',
          },
          admin: {
            description: 'Award categories (e.g., "Digital Design", "UI/UX")',
            condition: (parent: Page, { id }) =>
              parentLayoutCondition<AwardsBlockType>(parent, id, 'awards')?.designVersion ===
              'AWARDS3',
          },
          fields: [
            {
              name: 'category',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
        {
          name: 'color',
          type: 'select',
          required: true,
          defaultValue: 'amber-300',
          options: [
            { label: 'Amber 300', value: 'amber-300' },
            { label: 'Red 500', value: 'red-500' },
            { label: 'Blue 500', value: 'blue-500' },
            { label: 'Green 500', value: 'green-500' },
            { label: 'Purple 500', value: 'purple-500' },
            { label: 'Pink 500', value: 'pink-500' },
            { label: 'Yellow 500', value: 'yellow-500' },
            { label: 'Orange 500', value: 'orange-500' },
            { label: 'Indigo 500', value: 'indigo-500' },
            { label: 'Teal 500', value: 'teal-500' },
            { label: 'Cyan 500', value: 'cyan-500' },
          ],
          admin: {
            description: 'Color for the award indicator box',
            condition: (parent: Page, { id }) =>
              parentLayoutCondition<AwardsBlockType>(parent, id, 'awards')?.designVersion ===
              'AWARDS3',
          },
        },
        {
          name: 'logo',
          type: 'upload',
          relationTo: 'media',
          admin: {
            description: 'Award logo or image (displayed in the table)',
            condition: (parent: Page, { id }) =>
              parentLayoutCondition<AwardsBlockType>(parent, id, 'awards')?.designVersion ===
              'AWARDS4',
          },
        },
      ],
    },
  ],
}
