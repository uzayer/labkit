import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import {
  lexicalEditor,
  HeadingFeature,
  FixedToolbarFeature,
  InlineToolbarFeature,
} from '@payloadcms/richtext-lexical'

export const allPublicationsBlockDesignVersions = ['publications1', 'publications-dynamic'] as const

export type PublicationsBlockDesignVersion = (typeof allPublicationsBlockDesignVersions)[number]

export const PublicationsBlock: Block = {
  slug: 'publicationsBlock',
  interfaceName: 'PublicationsBlock',
  labels: {
    singular: 'Publications',
    plural: 'Publications',
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      required: true,
      defaultValue: 'publications1',
      options: allPublicationsBlockDesignVersions.map((version) => ({
        label: version,
        value: version,
      })),
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
        description: 'Heading content for the publications section',
      },
    },
    {
      name: 'years',
      type: 'array',
      required: true,
      minRows: 1,
      labels: {
        singular: 'Year',
        plural: 'Years',
      },
      admin: {
        description: 'Add years to group publications',
        condition: (_, { designVersion } = {}) => designVersion === 'publications1',
      },
      fields: [
        {
          name: 'year',
          type: 'number',
          required: true,
          admin: {
            description: 'Year for grouping publications (e.g., 2024)',
            step: 1,
          },
          validate: (value) => {
            if (typeof value === 'number' && value >= 1900 && value <= 2100) {
              return true
            }
            return 'Year must be between 1900 and 2100'
          },
        },
        {
          name: 'publications',
          type: 'array',
          required: true,
          minRows: 1,
          labels: {
            singular: 'Publication',
            plural: 'Publications',
          },
          admin: {
            description: 'Add publications for this year',
          },
          fields: [
            {
              name: 'title',
              type: 'text',
              required: true,
            },
            {
              name: 'authors',
              type: 'text',
              required: true,
            },
            link({
              appearances: ['default'],
              overrides: {
                required: false,
              },
            }),
            {
              name: 'pdfLink',
              type: 'text',
              required: false,
              admin: {
                description: 'URL to PDF document (e.g., https://example.com/paper.pdf)',
              },
            },
            {
              name: 'citationText',
              type: 'textarea',
              required: false,
              admin: {
                description:
                  'Citation text to display in popover (e.g., "Author, A. (2024). Title. Journal, 1(1), 1-10.")',
                rows: 4,
              },
            },
            {
              name: 'projectLink',
              type: 'text',
              required: false,
              admin: {
                description: 'URL to project page',
              },
            },
            {
              name: 'venue',
              type: 'text',
              required: false,
              admin: {
                description: 'Venue name (e.g., "CHI \'24", "JAMA")',
              },
            },
            {
              name: 'award',
              type: 'text',
              required: false,
              admin: {
                description: 'Award name (e.g., "Best Paper Award")',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'filters',
      type: 'group',
      admin: {
        condition: (_, { designVersion } = {}) => designVersion === 'publications-dynamic',
        description: 'Configure filters to determine which publications to display',
      },
      fields: [
        {
          name: 'projects',
          type: 'relationship',
          relationTo: 'projects',
          hasMany: true,
          admin: {
            description: 'Filter by associated projects (AND logic - must match ALL selected)',
          },
        },
        {
          name: 'authors',
          type: 'relationship',
          relationTo: 'team',
          hasMany: true,
          admin: {
            description: 'Filter by authors (AND logic - must include ALL selected authors)',
          },
        },
        {
          name: 'themes',
          type: 'relationship',
          relationTo: 'research-themes',
          hasMany: true,
          admin: {
            description: 'Filter by research themes (AND logic)',
          },
        },
        {
          name: 'types',
          type: 'select',
          hasMany: true,
          options: [
            { label: 'Conference', value: 'conference' },
            { label: 'Journal', value: 'journal' },
            { label: 'Workshop', value: 'workshop' },
            { label: 'Preprint', value: 'preprint' },
            { label: 'Extended Abstract', value: 'extended-abstract' },
            { label: 'Study Protocol', value: 'study-protocol' },
            { label: 'Book Chapter', value: 'book-chapter' },
          ],
          admin: {
            description: 'Filter by publication type (OR logic - matches any selected type)',
          },
        },
        {
          name: 'fromYear',
          type: 'number',
          admin: {
            description: 'Show publications from this year onwards',
            step: 1,
          },
        },
        {
          name: 'toPresent',
          type: 'checkbox',
          defaultValue: true,
          admin: {
            description: 'Include publications up to present year',
          },
        },
        {
          name: 'toYear',
          type: 'number',
          admin: {
            description: 'Show publications up to this year',
            step: 1,
            condition: (_, { toPresent } = {}) => toPresent === false,
          },
        },
        {
          name: 'featuredOnly',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Only show featured publications',
          },
        },
        {
          name: 'statuses',
          type: 'select',
          hasMany: true,
          defaultValue: ['published', 'accepted-in-press', 'submitted', 'preprint'],
          options: [
            { label: 'Published', value: 'published' },
            { label: 'Accepted/In Press', value: 'accepted-in-press' },
            { label: 'Submitted', value: 'submitted' },
            { label: 'Preprint', value: 'preprint' },
          ],
          admin: {
            description: 'Filter by publication status (OR logic)',
          },
        },
        {
          name: 'awardWinningOnly',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: 'Only show publications that have received awards',
          },
        },
        {
          name: 'limit',
          type: 'number',
          admin: {
            description:
              'Maximum number of publications to show initially (rest shown in collapsible). Leave blank to show all.',
            step: 1,
          },
        },
      ],
    },
    {
      name: 'pinnedPublications',
      type: 'relationship',
      relationTo: 'publications',
      hasMany: true,
      admin: {
        condition: (_, { designVersion } = {}) => designVersion === 'publications-dynamic',
        description:
          'Pin specific publications to appear first within their year (drag to reorder)',
      },
    },
  ],
}
