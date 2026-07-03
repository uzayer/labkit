import type { CollectionConfig, Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  HorizontalRuleFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  UnorderedListFeature,
  BlockquoteFeature,
  UploadFeature,
} from '@payloadcms/richtext-lexical'

import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { hasPermission } from '@/utilities/checkPermission'
import { Banner } from '@/blocks/LexicalBlocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { StatsBlock } from '@/blocks/Stats/config'
import { AwardsBlock } from '@/blocks/Awards/config'
import { revalidateProject } from './hooks/revalidateProject'
import { populateAuthors } from './hooks/populateAuthors'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { calculateReadTime } from '@/collections/Posts/hooks/calculcateReadTime'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { slugField } from '@/fields/slug'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'
import { isValidExternalHttpUrl } from '@/utilities/validation'

const PROJECT_CASE_STUDY_DESIGN = 'ProjectPost1'

const projectPost1Fields: Field[] = [
  {
    name: 'heroImage',
    type: 'upload',
    relationTo: 'media',
    label: 'Featured Image',
    admin: {
      description: 'Primary illustration displayed beside the intro content',
    },
  },
  {
    name: 'overview',
    type: 'textarea',
    label: 'Abstract Override',
    admin: {
      description:
        'Optional override: Only used if the main Abstract field (above) is empty. If both are filled, the main Abstract field takes priority.',
      placeholder:
        'Describe the company or initiative this project covers (e.g. "A modern platform…")',
    },
  },
  {
    name: 'metaItems',
    type: 'array',
    label: 'Sidebar Metadata',
    labels: {
      singular: 'Meta item',
      plural: 'Meta items',
    },
    admin: {
      description: 'Add sidebar metadata such as Sector, Team size, Location, Funding, etc.',
    },
    fields: [
      {
        name: 'label',
        type: 'text',
        required: true,
      },
      {
        name: 'value',
        type: 'text',
        required: true,
      },
    ],
  },
  {
    name: 'problem',
    type: 'textarea',
    label: 'Problem Statement',
    admin: {
      placeholder: 'Describe the challenge or friction this project addresses',
    },
  },
  {
    name: 'approach',
    type: 'textarea',
    label: 'Approach Description',
    admin: {
      placeholder: 'Explain the solution, methodology, or strategy that was applied',
    },
  },
  {
    name: 'outcomes',
    type: 'array',
    labels: {
      singular: 'Outcome',
      plural: 'Outcomes',
    },
    admin: {
      description: 'List impact statements or results (e.g. “Accelerated growth initiatives”).',
    },
    fields: [
      {
        name: 'headline',
        type: 'text',
        required: true,
        label: 'Outcome',
      },
    ],
  },
  {
    name: 'shareLabel',
    type: 'text',
    label: 'Share Label',
    admin: {
      placeholder: 'Share this content:',
    },
  },
]

const projectDesignVersions = [{ label: 'Case Study', value: PROJECT_CASE_STUDY_DESIGN }]

export const Projects: CollectionConfig = {
  slug: 'projects',
  labels: {
    singular: 'Project',
    plural: 'Projects',
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
    update: hasPermission('canManageContent'),
  },
  admin: {
    defaultColumns: ['title', 'status', 'featured', 'startDate'],
    group: 'Research',
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          breadcrumbs: data?.breadcrumbs,
          collection: 'projects',
          locale: locale.code,
        })

        return `${NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, options) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        breadcrumbs: data?.breadcrumbs as Breadcrumb[],
        collection: 'projects',
        locale: options.locale,
      })

      return `${NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    // Title at top for visibility
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    ...slugField(),

    {
      type: 'tabs',
      tabs: [
        // TAB 1: Overview - "What is this project?"
        {
          label: 'Overview',
          fields: [
            {
              name: 'localName',
              type: 'text',
              admin: {
                description:
                  "Name in the lab's local language (e.g., Bengali), used as the visual headline on project cards",
              },
            },
            {
              name: 'abstract',
              type: 'textarea',
              admin: {
                description: 'Brief project description for cards and listings',
                rows: 3,
              },
            },
            {
              name: 'heroImage',
              type: 'upload',
              relationTo: 'media',
              label: 'Featured Image',
            },
            {
              type: 'row',
              fields: [
                {
                  name: 'startDate',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                  },
                },
                {
                  name: 'endDate',
                  type: 'date',
                  index: true,
                  admin: {
                    width: '50%',
                    date: { pickerAppearance: 'dayOnly' },
                    condition: (data) => data?.status === 'completed',
                  },
                },
              ],
            },
            {
              name: 'externalUrl',
              label: 'Project URL',
              type: 'text',
              validate: (value) => {
                if (!value) return true

                return (
                  isValidExternalHttpUrl(value) ||
                  'Project URL must be a valid http:// or https:// URL.'
                )
              },
              admin: {
                description: 'External website, repository, or demo link',
              },
            },
          ],
        },

        // TAB 2: Team & Funding - "Who and how?"
        {
          label: 'Team & Funding',
          fields: [
            {
              name: 'teamMembers',
              type: 'relationship',
              relationTo: 'team',
              hasMany: true,
              admin: {
                description: 'Lab members contributing to this project',
              },
            },
            {
              name: 'grants',
              type: 'relationship',
              relationTo: 'grants',
              hasMany: true,
              admin: {
                description: 'Grants funding this project',
              },
            },
            {
              name: 'themes',
              type: 'relationship',
              relationTo: 'research-themes',
              hasMany: true,
              admin: {
                description: 'Research themes this project belongs to',
              },
            },
          ],
        },

        // TAB 3: Outputs - "What came out of it?"
        {
          label: 'Outputs',
          fields: [
            {
              name: 'publications',
              type: 'relationship',
              relationTo: 'publications',
              hasMany: true,
              admin: {
                description: 'Publications from this project',
              },
            },
            {
              name: 'awards',
              type: 'relationship',
              relationTo: 'awards',
              hasMany: true,
              admin: {
                description: 'Awards received by this project',
              },
            },
          ],
        },

        // TAB 4: Content - detailed write-up
        {
          label: 'Content',
          fields: [
            {
              name: 'content',
              type: 'richText',
              label: false,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => [
                  ...rootFeatures,
                  HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                  BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                  FixedToolbarFeature(),
                  InlineToolbarFeature(),
                  HorizontalRuleFeature(),
                  OrderedListFeature(),
                  UnorderedListFeature(),
                  BlockquoteFeature(),
                  UploadFeature({
                    collections: { media: { fields: [] } },
                  }),
                ],
              }),
            },
            {
              name: 'appendLayoutBlock',
              type: 'blocks',
              label: 'Additional Blocks',
              blocks: [StatsBlock, AwardsBlock],
            },
            // Case study fields - only show when design version selected
            {
              name: 'projectLayoutSettings',
              type: 'group',
              label: 'Case Study Fields',
              admin: {
                condition: (data) => data?.designVersion === PROJECT_CASE_STUDY_DESIGN,
              },
              fields: projectPost1Fields,
            },
          ],
        },

        // TAB 5: SEO
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({ hasGenerateFn: true }),
            MetaImageField({ relationTo: 'media' }),
            MetaDescriptionField({}),
            PreviewField({
              hasGenerateFn: true,
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },

    // SIDEBAR - Essential status/visibility controls only
    {
      name: 'status',
      type: 'select',
      index: true,
      defaultValue: 'ongoing',
      options: [
        { label: 'Ongoing', value: 'ongoing' },
        { label: 'Completed', value: 'completed' },
      ],
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'featured',
      type: 'checkbox',
      index: true,
      defaultValue: false,
      admin: {
        description: 'Show on homepage',
        position: 'sidebar',
      },
    },
    designVersionPreview(projectDesignVersions, {
      admin: {
        position: 'sidebar',
      },
    }),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
        date: { pickerAppearance: 'dayAndTime' },
      },
      hooks: {
        beforeChange: [
          ({ siblingData, value }) => {
            if (siblingData._status === 'published' && !value) {
              return new Date()
            }
            return value
          },
        ],
      },
    },
    {
      name: 'pageAuthor',
      type: 'relationship',
      relationTo: 'users',
      hasMany: true,
      admin: {
        position: 'sidebar',
        description: 'Content author (internal)',
      },
    },

    // Hidden/system fields
    {
      name: 'readTime',
      type: 'number',
      admin: { hidden: true },
    },
    {
      name: 'populatedAuthors',
      type: 'array',
      admin: { hidden: true },
      access: { update: () => false },
      fields: [
        { name: 'id', type: 'text' },
        { name: 'name', type: 'text' },
      ],
    },
    // Legacy fields - hidden for backward compatibility
    {
      name: 'overview',
      type: 'textarea',
      admin: { hidden: true },
    },
    {
      name: 'bannerImage',
      type: 'upload',
      relationTo: 'media',
      admin: { hidden: true },
    },
  ],
  hooks: {
    beforeChange: [calculateReadTime],
    afterChange: [revalidateProject],
    afterRead: [populateAuthors],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 2000, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
}
