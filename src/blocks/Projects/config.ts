import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'

export const allProjectsDesignVersions = ['17', '17b'] as const

export type ProjectsDesignVersion = (typeof allProjectsDesignVersions)[number]

export const ProjectsBlock: Block = {
  slug: 'projects',
  interfaceName: 'ProjectsBlock',
  labels: {
    singular: 'Projects',
    plural: 'Projects',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      defaultValue: '17',
      options: allProjectsDesignVersions.map((version) => ({ label: version, value: version })),
    },
    {
      name: 'heading',
      type: 'text',
      localized: true,
      admin: {
        description: 'Main heading for the projects section',
      },
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
      admin: {
        description: 'Description text below the heading',
        condition: (_, { designVersion }) => designVersion === '17b',
      },
    },
    {
      name: 'projects',
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
          name: 'location',
          type: 'text',
        },
        {
          name: 'year',
          type: 'text',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'category',
          type: 'text',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'description',
          type: 'textarea',
          admin: {
            condition: (_, { designVersion }) => designVersion === '17b',
          },
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: false,
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
