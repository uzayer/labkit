// storage-adapter-import-placeholder
// import { postgresAdapter } from '@payloadcms/db-postgres'
import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import { en } from '@payloadcms/translations/languages/en'
import { de } from '@payloadcms/translations/languages/de'

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
import sharp from 'sharp' // editor-import
import path from 'path'
import { buildConfig, PayloadRequest } from 'payload'
import { fileURLToPath } from 'url'

import Categories from './collections/Categories'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Posts } from './collections/Posts'
import Users from './collections/Users'
import Roles from './collections/Roles'
import { Footer } from './globals/Footer/config'
import { Header } from './globals/Header/config'
import { ThemeConfig } from './globals/ThemeConfig/config'
import { revalidateRedirects } from './hooks/revalidateRedirects'
import { GenerateTitle, GenerateURL } from '@payloadcms/plugin-seo/types'
import { Page, Post } from 'src/payload-types'

import { searchFields } from '@/search/fieldOverrides'
import { beforeSyncWithSearch } from '@/search/beforeSync'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import localization from './localization.config'
import { initializeRoles } from './utilities/initRoles'
import { isAdminHidden } from './access/isAdmin'
import { hasPermission } from './utilities/checkPermission'
import { PageConfig } from './globals/PageConfig/config'
import { Telephone } from './fields/formBuilder/telephone'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

const generateTitle: GenerateTitle<Post | Page> = ({ doc }) => {
  return doc?.title ? `${doc.title} | Payblocks Website Template` : 'Payblocks Website Template'
}

const generateURL: GenerateURL<Post | Page> = ({ doc }) => {
  // TODO: add multi slug
  return doc?.slug ? `${NEXT_PUBLIC_SERVER_URL!}/${doc.slug}` : NEXT_PUBLIC_SERVER_URL!
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
      beforeDashboard: ['@/components/AdminDashboard/BeforeDashboard'],
      afterDashboard: ['@/components/AdminDashboard/BackupDashboard'],
      graphics: {
        Icon: '@/components/AdminDashboard/PayblocksIcon',
        Logo: '@/components/AdminDashboard/PayblocksLogo',
      },
    },
    importMap: {
      baseDir: path.resolve(dirname),
    },
    user: Users.slug,
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
          enabledCollections: ['pages', 'posts'],
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
                  condition: ({ linkType }) => linkType !== 'internal',
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
  db: mongooseAdapter({
    url: process.env.MONGODB_URI || '',
  }),
  collections: [Pages, Posts, Media, Categories, Users, Roles],
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  globals: [ThemeConfig, Header, Footer, PageConfig],
  plugins: [
    redirectsPlugin({
      collections: ['pages', 'posts'],
      overrides: {
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
        admin: {
          description: {
            de: 'Formularübermittlungen, die von Formularen im Frontend gesammelt wurden',
            en: 'Form submissions that got collected by forms in the frontend',
          },
        },
      },
    }),
    searchPlugin({
      collections: ['pages', 'posts'],
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
    vercelBlobStorage({
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN || '',
    }),
    OAuth2Plugin({
      enabled: googleAuthActive,
      strategyName: 'google',
      useEmailAsIdentity: true,
      serverURL: NEXT_PUBLIC_SERVER_URL || 'http://localhost:3000',
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
        // redirect to state
        if (req.query.state && (req.query.state as string).startsWith('/')) {
          return `${req.query.state}`
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
    defaultFromName: 'Payblocks Website',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: process.env.PAYLOAD_SECRET!,
  sharp,
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  onInit: async (payload) => {
    /**
     * Add the default roles if needed on system startup
     */
    await initializeRoles(payload)
  },
  // Enable localization for the website
  localization,
  // Enable localization for admin panel
  i18n: {
    supportedLanguages: { en, de },
  },
})
