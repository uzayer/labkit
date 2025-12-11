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

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'
import { Banner } from '@/blocks/LexicalBlocks/Banner/config'
import { Code } from '@/blocks/Code/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { populateAuthors } from './hooks/populateAuthors'
import { revalidatePost } from './hooks/revalidatePost'

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
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { calculateReadTime } from './hooks/calculcateReadTime'

export const allPostDesignVersions = [
  {
    label: 'BLOGPOST4',
    value: 'BLOGPOST4',
    image: '/admin/previews/blogpost/blogpost4.webp',
  },
  {
    label: 'BLOGPOST5',
    value: 'BLOGPOST5',
    image: '/admin/previews/blogpost/blogpost5.webp',
  },
  {
    label: 'CASESTUDY3',
    value: 'CASESTUDY3',
  },
]

export const Posts: CollectionConfig = {
  slug: 'posts',
  access: {
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          breadcrumbs: data?.breadcrumbs,
          collection: 'posts',
          locale: locale.code,
        })

        return `${NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, options) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        breadcrumbs: data?.breadcrumbs as Breadcrumb[],
        collection: 'posts',
        locale: options.locale,
      })

      return `${NEXT_PUBLIC_SERVER_URL}${path}`
    },
    useAsTitle: 'title',
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      type: 'tabs',
      tabs: [
        {
          fields: [
            {
              name: 'bannerImage',
              type: 'upload',
              relationTo: 'media',
              admin: {
                description: 'Banner image displayed at the top of the blog post',
                condition: (data) => data?.designVersion === 'BLOGPOST5',
                position: 'sidebar',
              },
            },
            {
              name: 'content',
              type: 'richText',
              localized: true,
              editor: lexicalEditor({
                features: ({ rootFeatures }) => {
                  return [
                    ...rootFeatures,
                    HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    BlocksFeature({ blocks: [Banner, Code, MediaBlock] }),
                    FixedToolbarFeature(),
                    InlineToolbarFeature(),
                    HorizontalRuleFeature(),
                    OrderedListFeature(),
                    UnorderedListFeature(),
                    BlockquoteFeature(),
                    UploadFeature({
                      collections: {
                        media: {
                          fields: [],
                        },
                      },
                    }),
                  ]
                },
              }),
              label: false,
              required: true,
            },
            {
              name: 'caseStudy3',
              type: 'group',
              admin: {
                condition: (data) => data?.designVersion === 'CASESTUDY3',
              },
              fields: [
                {
                  name: 'heroImage',
                  type: 'upload',
                  relationTo: 'media',
                  admin: {
                    description: 'Primary illustration displayed beside the intro content',
                  },
                },
                {
                  name: 'overview',
                  type: 'textarea',
                  admin: {
                    description: 'Short overview copy shown in the sidebar',
                    placeholder:
                      'Describe the company or initiative this case study covers (e.g. “A modern platform…”)',
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
                    description:
                      'Add sidebar metadata such as Sector, Team size, Location, Funding, etc.',
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
                    placeholder: 'Describe the challenge or friction this case study addresses',
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
                    description:
                      'List impact statements or results (e.g. “Accelerated growth initiatives”).',
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
              ],
              label: 'Case Study 3 Settings',
            },
          ],
          label: 'Content',
        },
        {
          fields: [
            {
              name: 'relatedPosts',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              filterOptions: ({ id }) => {
                return {
                  id: {
                    not_in: [id],
                  },
                }
              },
              hasMany: true,
              relationTo: 'posts',
            },
            {
              name: 'categories',
              type: 'relationship',
              admin: {
                position: 'sidebar',
              },
              hasMany: true,
              relationTo: 'categories',
            },
          ],
          label: 'Meta',
        },
        {
          name: 'meta',
          label: 'SEO',
          fields: [
            OverviewField({
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
              imagePath: 'meta.image',
            }),
            MetaTitleField({
              hasGenerateFn: true,
            }),
            MetaImageField({
              relationTo: 'media',
            }),

            MetaDescriptionField({}),
            PreviewField({
              // if the `generateUrl` function is configured
              hasGenerateFn: true,

              // field paths to match the target field for data
              titlePath: 'meta.title',
              descriptionPath: 'meta.description',
            }),
          ],
        },
      ],
    },
    designVersionPreview(allPostDesignVersions, {
      admin: {
        position: 'sidebar',
      },
    }),
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
        position: 'sidebar',
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
      name: 'authors',
      type: 'relationship',
      admin: {
        position: 'sidebar',
      },
      hasMany: true,
      relationTo: 'users',
    },
    // This field is only used to populate the user data via the `populateAuthors` hook
    // This is because the `user` collection has access control locked to protect user privacy
    // GraphQL will also not return mutated user data that differs from the underlying schema
    {
      name: 'populatedAuthors',
      type: 'array',
      access: {
        update: () => false,
      },
      admin: {
        disabled: true,
        readOnly: true,
      },
      fields: [
        {
          name: 'id',
          type: 'text',
        },
        {
          name: 'name',
          type: 'text',
        },
      ],
    },
    // This is an internal, hidden field to store the average read time. We calculate this in a hook
    {
      name: 'readTime',
      type: 'number',
      admin: {
        disabled: true,
        readOnly: true,
      },
    },
    ...slugField(),
  ],
  hooks: {
    beforeChange: [calculateReadTime],
    afterChange: [revalidatePost],
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
