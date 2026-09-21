import type { CollectionConfig } from 'payload'

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
import { revalidateProject } from './hooks/revalidateProject'

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
  ],
  hooks: {
    afterChange: [revalidateProject],
  },
  versions: {
    // Drafts without autosave: autosave wrote an empty draft the moment "Create" was
    // opened. Live preview (server-side RefreshRouteOnSave) still works, but now
    // refreshes on "Save draft" rather than every 2s.
    drafts: true,
    maxPerDoc: 50,
  },
}
