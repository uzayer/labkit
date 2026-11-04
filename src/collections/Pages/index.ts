import { isAdminHidden, authenticatedOrPublished, hasPermission } from '@labkit/core/access'
import type { CollectionConfig } from 'payload'

import { hero } from '@/heros/config'

import { slugField } from '@labkit/core/fields'
import { populatePublishedAt } from '@/hooks/populatePublishedAt'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { revalidatePage } from './hooks/revalidatePage'

import {
  MetaDescriptionField,
  MetaImageField,
  MetaTitleField,
  OverviewField,
  PreviewField,
} from '@payloadcms/plugin-seo/fields'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'

export const Pages: CollectionConfig = {
  slug: 'pages',
  labels: {
    plural: {
      en: 'Pages',
      de: 'Seiten',
    },
    singular: {
      en: 'Page',
      de: 'Seite',
    },
  },
  access: {
    create: hasPermission('canManageContent'),
    delete: hasPermission('canManageContent'),
    read: authenticatedOrPublished,
    update: hasPermission('canManageContent'),
  },
  admin: {
    hidden: isAdminHidden,
    defaultColumns: ['title', 'slug', 'updatedAt'],
    livePreview: {
      url: ({ data, locale, req }) => {
        const path = generatePreviewPath({
          slug: typeof data?.slug === 'string' ? data.slug : '',
          breadcrumbs: data?.breadcrumbs,
          collection: 'pages',
          locale: locale.code,
          req,
        })

        return `${NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: (data, options) => {
      const path = generatePreviewPath({
        slug: typeof data?.slug === 'string' ? data.slug : '',
        breadcrumbs: data?.breadcrumbs as Breadcrumb[],
        collection: 'pages',
        locale: options.locale,
        req: options.req,
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
          fields: [hero],
          label: 'Hero',
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
    {
      name: 'publishedAt',
      type: 'date',
      admin: {
        position: 'sidebar',
      },
    },

    ...slugField(),
    {
      name: 'enableBreadcrumbs',
      type: 'checkbox',
      defaultValue: false,
      label: {
        en: 'Breadcrumbs',
        de: 'Breadcumbs',
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'Enable breadcrumbs for the page',
          de: 'Breadcumbs für die Seite aktivieren',
        },
      },
    },
  ],
  hooks: {
    afterChange: [revalidatePage],
    beforeChange: [populatePublishedAt],
  },
  versions: {
    drafts: {
      autosave: {
        interval: 100, // We set this interval for optimal live preview
      },
    },
    maxPerDoc: 50,
  },
  authorship: false,
}
