// storage-adapter-import-placeholder
import { sqliteAdapter } from '@payloadcms/db-sqlite'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
// import { de } from '@payloadcms/translations/languages/de' // Uncomment to enable German

import { OAuth2Plugin } from 'payload-oauth2'

import { formBuilderPlugin } from '@payloadcms/plugin-form-builder'
import { nestedDocsPlugin } from '@payloadcms/plugin-nested-docs'
import { redirectsPlugin } from '@payloadcms/plugin-redirects'
import { seoPlugin } from '@payloadcms/plugin-seo'
import { searchPlugin } from '@payloadcms/plugin-search'
import { resendAdapter } from '@payloadcms/email-resend'
import {
  BoldFeature,
  FixedToolbarFeature,
  HeadingFeature,
  ItalicFeature,
  LinkFeature,
  lexicalEditor,
  UnderlineFeature,
  ParagraphFeature,
  TextStateFeature,
  defaultColors,
} from '@payloadcms/richtext-lexical'
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import { labkitPlugin, migrationDir } from '@labkit/core'
import { hasPermission, isAdminHidden } from '@labkit/core/access'
import Categories from './collections/Categories'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import { Banner } from './blocks/LexicalBlocks/Banner/config'
import { Code } from './blocks/Code/config'
import { MediaBlock } from './blocks/MediaBlock/config'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { ThemeConfig } from './globals/ThemeConfig/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { revalidateDialPlugin } from './plugins/revalidateDial'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from '@/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import localization from './localization.config'
import { PageConfig } from './globals/PageConfig/config'
import { Telephone } from './fields/formBuilder/telephone'
import { validateRuntimeSecrets } from '@labkit/core/secrets'
import { generateDocumentPath } from '@/utilities/generateDocumentPath'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)
const payloadSecret = validateRuntimeSecrets()
const databaseUrl = process.env.TURSO_DATABASE_URL || 'file:./labkit.db'
// Scoped to Vercel, where a file: database is ephemeral. A local `next build`
// also runs with NODE_ENV=production and should keep using labkit.db.
if (process.env.VERCEL && (!databaseUrl.startsWith('libsql://') || !process.env.TURSO_AUTH_TOKEN)) {
  throw new Error('Production requires TURSO_DATABASE_URL=libsql://... and TURSO_AUTH_TOKEN')
}

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | LabKit Website Template` : 'LabKit Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ collectionConfig, doc, locale }) => {
  if (!doc?.slug || !collectionConfig) return NEXT_PUBLIC_SERVER_URL!

  const collection = collectionConfig.slug
  if (collection !== 'pages' && collection !== 'posts' && collection !== 'projects') {
    return NEXT_PUBLIC_SERVER_URL!
  }

  const path = generateDocumentPath({
    breadcrumbs: 'breadcrumbs' in doc ? doc.breadcrumbs : undefined,
    collection,
    locale,
    slug: doc.slug,
  })

  return new URL(path, NEXT_PUBLIC_SERVER_URL).toString()
}

/**
 * Only show the google login button if the client id and secret are set
 */
const googleAuthActive = !!(
  process.env.GOOGLE_LOGIN_CLIENT_ID && process.env.GOOGLE_LOGIN_CLIENT_SECRET
)

export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/AdminDashboard/BeforeLogin'],
      afterLogin: googleAuthActive ? ['@/components/AdminDashboard/LoginButton'] : [],
      graphics: {
        Icon: '@/components/AdminDashboard/LabKitIcon',
        Logo: '@/components/AdminDashboard/LabKitLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '— LabKit',
      // One dark-ink favicon: browser tabs don't follow the page's theme.
      icons: [{ rel: 'icon', type: 'image/svg+xml', url: '/brand/labkit-mark.svg' }],
    },
    livePreview: {
      breakpoints: [
        {
          label: 'Mobile',
          name: 'mobile',
          width: 375,
          height: 667,
        },
        {
          label: 'Tablet',
          name: 'tablet',
          width: 768,
          height: 1024,
        },
        {
          label: 'Desktop',
          name: 'desktop',
          width: 1440,
          height: 900,
        },
      ],
    },
  },
  // A Payload 4 feature this project doesn't use; disabling it avoids its collection.
  llmInstructions: false,
  // Payload 4 lowered the default to 1. Keep 3.x's 2 so queries that omit depth behave as before.
  defaultDepth: 2,
  // This config helps us configure global or default features that the other editors can inherit
  editor: lexicalEditor({
    features: () => {
      return [
        HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
        FixedToolbarFeature(),
        UnderlineFeature(),
        BoldFeature(),
        ItalicFeature(),
        ParagraphFeature(),
        LinkFeature({
          enabledCollections: ['pages', 'posts', 'projects'],
          fields: ({ defaultFields }) => {
            const defaultFieldsWithoutUrl = defaultFields.filter((field) => {
              if ('name' in field && field.name === 'url') return false
              return true
            })

            return [
              ...defaultFieldsWithoutUrl,
              {
                name: 'url',
                type: 'text',
                admin: {
                  condition: (_, siblingData) => siblingData.linkType !== 'internal',
                },
                label: ({ t }) => t('fields:enterURL'),
                required: true,
              },
            ]
          },
        }),

        TextStateFeature({
          state: {
            color: {
              'text-grey': {
                label: 'Grey',

                css: {
                  color: 'hsl(0, 0%, 41%)',
                },
              },
              ...defaultColors.text,
            },
          },
        }),
      ]
    },
  }),
  db: sqliteAdapter({
    client: {
      url: databaseUrl,
      authToken: process.env.TURSO_AUTH_TOKEN,
    },
    idType: 'uuid',
    allowIDOnCreate: true,
    migrationDir,
    // PAYLOAD_DB_PUSH=false keeps a local database migration-only, so it can be
    // uploaded to Turso without a dev-push marker (docs/operator/turso-cutover.md).
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH !== 'false',
    busyTimeout: databaseUrl.startsWith('file:') ? 10_000 : 0,
    wal: databaseUrl.startsWith('file:'),
  }),
  // labkitPlugin() puts the research collections before these and Media, Users and
  // Roles after them; see its nav-order note.
  collections: [Pages, Posts, Categories],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  globals: [ThemeConfig, Header, Footer, PageConfig],
  plugins: [
    // First, so the plugins below that target `projects` and `users` find them.
    labkitPlugin({
      mediaStaticDir: path.resolve(dirname, '../public/media'),
      projects: {
        contentBlocks: [Banner, Code, MediaBlock],
        previewURL: ({ slug, breadcrumbs, locale }) =>
          `${NEXT_PUBLIC_SERVER_URL}${generatePreviewPath({ slug, breadcrumbs, collection: 'projects', locale })}`,
      },
    }),
    // After labkitPlugin, which adds the collections and LabInfo global it hooks.
    revalidateDialPlugin,
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
    OAuth2Plugin({
      enabled: googleAuthActive,
      strategyName: 'google',
      useEmailAsIdentity: true,
      serverURL: NEXT_PUBLIC_SERVER_URL,
      authCollection: 'users',
      clientId: process.env.GOOGLE_LOGIN_CLIENT_ID || '',
      subFieldName: 'sub',
      clientSecret: process.env.GOOGLE_LOGIN_CLIENT_SECRET || '',
      tokenEndpoint: 'https://oauth2.googleapis.com/token',
      scopes: [
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
        'openid',
      ],
      providerAuthorizationUrl: 'https://accounts.google.com/o/oauth2/v2/auth',
      getUserInfo: async (accessToken: string) => {
        const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${accessToken}` },
        })
        const user = await response.json()
        if (!user.email_verified) {
          throw new Error('Email not verified')
        }
        /**
         * Set your own allowed email domains here if needed to limit access
         * to payload for specific email domains
         */
        const allowedDomains = process.env.ALLOWED_EMAIL_DOMAINS?.split(',')
        if (allowedDomains && !allowedDomains.includes(user.email.split('@')?.[1])) {
          throw new Error('Email domain not allowed')
        }

        return {
          email: user.email,
          sub: user.sub,
          name: user.name,
        }
      },
      successRedirect: (req: PayloadRequest) => {
        const state = typeof req.query.state === 'string' ? req.query.state : ''

        // Only allow local root-relative paths, not protocol-relative redirects.
        if (state.startsWith('/') && !state.startsWith('//') && !state.startsWith('/\\')) {
          return state
        }
        return '/admin'
      },
      failureRedirect: (_, error) => {
        console.error(error)
        return '/login'
      },
    }),
  ],
  /**
   * Use the Resend adapter or switch to your own email service here: https://payloadcms.com/docs/email/overview
   */
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
    defaultFromName: 'LabKit Website',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: payloadSecret,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  // Enable localization for the website
  localization,
  // Enable localization for admin panel
  i18n: {
    supportedLanguages: { en },
    // supportedLanguages: { en, de }, // Uncomment to enable German
  },
  storage: [
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
  ],
})
