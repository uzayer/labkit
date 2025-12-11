import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
// import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

export const allTeamDesignVersions = [
  { label: 'TEAM5', value: 'TEAM5' },
  { label: 'TEAM5-9 (Filterable detailed cards)', value: 'TEAM5-9' },
  { label: 'TEAM9 (Filterable Directory)', value: 'TEAM9' },
] as const

export type TeamDesignVersion = (typeof allTeamDesignVersions)[number]['value']

export const TeamBlock: Block = {
  slug: 'team',
  interfaceName: 'TeamBlock',
  labels: {
    singular: 'Team',
    plural: 'Team Sections',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      options: allTeamDesignVersions.map((version) => ({
        label: version.label,
        value: version.value,
      })),
      defaultValue: 'TEAM5',
    },
    {
      name: 'heading',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Team',
    },
    {
      name: 'description',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'categories',
      type: 'array',
      label: 'Categories',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add categories with team members (TEAM9 & TEAM5-9)',
        condition: (_, { designVersion }) => ['TEAM9', 'TEAM5-9'].includes(designVersion),
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          label: 'Category Name',
          admin: {
            description: 'e.g., Engineering, Design, Marketing',
          },
        },
        {
          name: 'teamMembers',
          type: 'array',
          label: 'Team Members',
          minRows: 1,
          fields: [
            {
              name: 'name',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'role',
              type: 'text',
              required: true,
              localized: true,
            },
            {
              name: 'department',
              type: 'text',
              localized: true,
            },
            {
              name: 'avatar',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description:
                  'Upload team member photo. Use the focal point selector to position faces for circular display.',
              },
            },
            {
              name: 'description',
              type: 'textarea',
              label: 'Description',
              localized: true,
              admin: {
                description: 'Brief description or note about the team member',
              },
            },
            {
              name: 'expertise',
              type: 'array',
              fields: [
                {
                  name: 'skill',
                  type: 'text',
                  required: true,
                  localized: true,
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: 'teamMembers',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Team members (TEAM5 only)',
        condition: (_, { designVersion }) => designVersion === 'TEAM5',
      },
      fields: [
        {
          name: 'name',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'role',
          type: 'text',
          required: true,
          localized: true,
        },
        {
          name: 'department',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
        },
        {
          name: 'avatar',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'expertise',
          type: 'array',
          fields: [
            {
              name: 'skill',
              type: 'text',
              required: true,
              localized: true,
            },
          ],
        },
      ],
    },
    {
      name: 'enableCta',
      type: 'checkbox',
      label: 'Enable CTA Section',
      defaultValue: false,
      admin: {
        condition: (_, { designVersion }) => designVersion !== 'TEAM9',
      },
    },
    {
      name: 'ctaHeading',
      type: 'text',
      localized: true,
      label: 'CTA Heading',
      admin: {
        condition: (_, { enableCta, designVersion }) =>
          Boolean(enableCta) && designVersion !== 'TEAM9',
      },
    },
    {
      name: 'ctaDescription',
      type: 'textarea',
      localized: true,
      label: 'CTA Description',
      admin: {
        condition: (_, { enableCta, designVersion }) =>
          Boolean(enableCta) && designVersion !== 'TEAM9',
      },
    },
    link({
      overrides: {
        name: 'ctaLink',
        label: 'CTA Button',
        admin: {
          condition: (_, { enableCta, designVersion }) =>
            Boolean(enableCta) && designVersion !== 'TEAM9',
        },
      },
    }),
  ],
}
