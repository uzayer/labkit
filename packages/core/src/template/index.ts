/**
 * The schema of the page-builder template LabKit started from: Pages, Posts and
 * Categories, the Header, Footer, ThemeConfig and PageConfig globals, and the
 * redirects, nested-docs, SEO, form-builder and search plugins. No Lab's site
 * renders most of it, but production databases hold its tables, so it stays in
 * core's schema until a migration drops it.
 */
import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { searchPlugin } from '@payloadcms/plugin-search'
import { seoPlugin } from '@payloadcms/plugin-seo'
import type { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { FixedToolbarFeature, HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import type { Config } from 'payload'

import { hasPermission, isAdminHidden } from '../access'
import type { Page, Post } from '../types'
import { generateDocumentPath } from '../utilities/generateDocumentPath'
import { serverUrl } from '../utilities/serverUrl'
import Categories from './collections/Categories'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Telephone } from './fields/telephone'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { PageConfig } from './globals/PageConfig/config'
import { ThemeConfig } from './globals/ThemeConfig/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { beforeSyncWithSearch } from './search/beforeSync'
import { searchFields } from './search/fieldOverrides'

export { Banner } from './blocks/Banner'
export { Code } from './blocks/Code'
export { MediaBlock } from './blocks/MediaBlock'
export type { SocialIconType } from './fields/socialIcon'
export { allPostDesignVersions } from './collections/Posts'

export const templateCollections = [Pages, Posts, Categories]
export const templateGlobals = [ThemeConfig, Header, Footer, PageConfig]

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | LabKit Website Template` : 'LabKit Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ collectionConfig, doc, locale }) => {
  if (!doc?.slug || !collectionConfig) return serverUrl

  const collection = collectionConfig.slug
  if (collection !== 'pages' && collection !== 'posts' && collection !== 'projects') {
    return serverUrl
  }

  const path = generateDocumentPath({
    breadcrumbs: 'breadcrumbs' in doc ? doc.breadcrumbs : undefined,
    collection,
    locale,
    slug: doc.slug,
  })

  return new URL(path, serverUrl).toString()
}

/** Applies the template's plugins, in the order the schema was generated with. */
export const applyTemplatePlugins = async (config: Config): Promise<Config> => {
  const plugins = [
    redirectsPlugin({
      collections: ['pages', 'posts', 'projects'],
      overrides: {
        admin: {
          hidden: isAdminHidden,
        },
        authorship: false,
        versions: false,
        // @ts-expect-error Type mismatch between redirects plugin field types and our runtime shape
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'from') {
              return {
                ...field,
                admin: {
                  description:
                    'Add new redirects here. The redirect will work immediately after saving. For example: /about or https://example.com/about',
                },
              }
            }
            return field
          })
        },
        hooks: {
          afterChange: [revalidateRedirects],
        },
        access: {
          create: hasPermission('canManageRedirects'),
          read: () => true,
          update: hasPermission('canManageRedirects'),
          delete: hasPermission('canManageRedirects'),
        },
      },
    }),
    nestedDocsPlugin({
      collections: ['categories', 'pages'],
      // This function is executed on save of the page. If you change this function make
      // sure to re-save all pages to update there URLs
      generateURL: (docs) => docs.reduce((url, doc) => `${url}/${doc.slug}`, ''),
    }),
    seoPlugin({
      generateTitle,
      generateURL,
    }),
    formBuilderPlugin({
      fields: {
        payment: false,
        telephone: Telephone,
      },
      formOverrides: {
        admin: {
          hidden: isAdminHidden,
        },
        authorship: false,
        versions: false,
        fields: ({ defaultFields }) => {
          return defaultFields.map((field) => {
            if ('name' in field && field.name === 'confirmationMessage') {
              return {
                ...field,
                editor: lexicalEditor({
                  features: ({ rootFeatures }) => {
                    return [
                      ...rootFeatures,
                      FixedToolbarFeature(),
                      HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
                    ]
                  },
                }),
              }
            }
            return field
          })
        },
      },
      formSubmissionOverrides: {
        authorship: false,
        versions: false,
        admin: {
          hidden: isAdminHidden,
          description: {
            de: 'Formularübermittlungen, die von Formularen im Frontend gesammelt wurden',
            en: 'Form submissions that got collected by forms in the frontend',
          },
        },
      },
    }),
    searchPlugin({
      collections: ['pages', 'posts', 'projects'],
      beforeSync: beforeSyncWithSearch,
      searchOverrides: {
        admin: {
          hidden: isAdminHidden,
        },
        fields: ({ defaultFields }) => {
          return [...defaultFields, ...searchFields]
        },
      },
    }),
  ]

  let result = config
  for (const plugin of plugins) result = await plugin(result)
  return result
}
