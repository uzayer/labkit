import { resendAdapter } from '@payloadcms/email-resend'
import { en } from '@payloadcms/translations/languages/en'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'

import { labkitDb, labkitMediaStorage, labkitPlugin } from '@labkit/core'
import { validateRuntimeSecrets } from '@labkit/core/secrets'
import { revalidateSitePlugin } from './plugins/revalidateSite'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

// The schema (collections, globals, schema plugins, editor, localization) all comes
// from labkitPlugin(), so it matches core's migrations. This file holds only what
// belongs to this app.
export default buildConfig({
  admin: {
    components: {
      beforeLogin: ['@/components/AdminDashboard/BeforeLogin'],
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
  },
  db: labkitDb(),
  cors: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  csrf: [process.env.PAYLOAD_PUBLIC_SERVER_URL || ''].filter(Boolean),
  plugins: [
    labkitPlugin({ mediaStaticDir: path.resolve(dirname, '../public/media') }),
    // After labkitPlugin, which adds the collections and globals it hooks.
    revalidateSitePlugin,
  ],
  email: resendAdapter({
    defaultFromAddress: process.env.EMAIL_FROM_ADDRESS!,
    defaultFromName: 'LabKit Website',
    apiKey: process.env.RESEND_API_KEY || '',
  }),
  secret: validateRuntimeSecrets(),
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  i18n: {
    supportedLanguages: { en },
  },
  storage: [labkitMediaStorage()],
})
