import type { Block, CollectionConfig } from 'payload'

import { authenticated } from '@/access/authenticated'
import { authenticatedOrPublished } from '@/access/authenticatedOrPublished'

import { FormBlock } from '@/blocks/Form/config'
import { FeatureBlock } from '@/blocks/Feature/config'
import { CtaBlock } from '@/blocks/Cta/config'
import { AboutBlock } from '@/blocks/About/config'
import { LogosBlock } from '@/blocks/Logos/config'
import { Gallery } from '@/blocks/Gallery/config'
import { TestimonialBlock } from '@/blocks/Testimonial/config'
import { FaqBlock } from '@/blocks/Faq/config'
import { StatBlock } from '@/blocks/Stat/config'
import { SplitViewBlock } from '@/blocks/SplitView/config'
import { TextBlock } from '@/blocks/TextBlock/config'
import { MediaBlock } from '@/blocks/MediaBlock/config'
import { hero } from '@/heros/config'
import { CustomBlock } from '@/blocks/CustomBlock/config'
import { ChangelogBlock } from '@/blocks/Changelog/config'

import { slugField } from '@/fields/slug'
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
import { ContactBlock } from '@/blocks/Contact/config'
import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'
import { Blog } from '@/blocks/Blog/config'
import { BannerBlock } from '@/blocks/Banner/config'
import { CasestudiesBlock } from '@/blocks/Casestudies/config'
import { TimelineBlock } from '@/blocks/Timeline/config'
import { LoginBlock } from '@/blocks/Login/config'
import { SignupBlock } from '@/blocks/Signup/config'

export const PageBlocks: Block[] = [
  FeatureBlock,
  FormBlock,
  CtaBlock,
  LogosBlock,
  AboutBlock,
  ContactBlock,
  Gallery,
  TestimonialBlock,
  FaqBlock,
  StatBlock,
  SplitViewBlock,
  TextBlock,
  MediaBlock,
  CustomBlock,
  ChangelogBlock,
  Blog,
  BannerBlock,
  CasestudiesBlock,
  TimelineBlock,
  LoginBlock,
  SignupBlock,
]

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
    create: authenticated,
    delete: authenticated,
    read: authenticatedOrPublished,
    update: authenticated,
  },
  admin: {
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
          fields: [
            {
              name: 'layout',
              type: 'blocks',
              blocks: PageBlocks,
              required: true,
            },
          ],
          label: 'Content',
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
}
