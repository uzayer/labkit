import { sharpTransformer } from '@payloadcms/transformer-sharp'
import type { CollectionConfig, Config, JobsConfig, Plugin } from 'payload'
import sharp from 'sharp'

import Awards from './collections/Awards'
import Grants from './collections/Grants'
import ImportRuns from './collections/ImportRuns'
import { createMedia, mediaSharpConfig } from './collections/Media'
import News from './collections/News'
import Organizations from './collections/Organizations'
import { createProjects } from './collections/Projects'
import Publications from './collections/Publications'
import ResearchThemes from './collections/ResearchThemes'
import ReviewItems from './collections/ReviewItems'
import Roles from './collections/Roles'
import Team from './collections/Team'
import Users from './collections/Users'
import Venues from './collections/Venues'
import { Features } from './globals/Features/config'
import { type FeatureName, hiddenUnlessFeature } from './globals/Features/features'
import { LabInfo } from './globals/LabInfo/config'
import { importHydrateTask } from './ingestion/jobs/import-hydrate'
import { onboardingEndpoints } from './onboarding/endpoints'
import { ONBOARDING_PATH } from './onboarding/status'
import { assertStrongCronSecret } from './utilities/assertCronSecret'
import { checkRole } from './utilities/checkRole'
import { initializeRoles } from './utilities/initRoles'
import { googleLoginActive, googleLoginPlugin } from './auth/googleLogin'
import { labkitEditor } from './editor'
import { localization } from './localization'
import {
  applyTemplatePlugins,
  Banner,
  Code,
  MediaBlock,
  templateCollections,
  templateGlobals,
} from './template'
import { generatePreviewPath } from './utilities/generatePreviewPath'
import { serverUrl } from './utilities/serverUrl'

export interface LabkitPluginOptions {
  /** Absolute path for Media uploads when no storage adapter handles them. Defaults to `<cwd>/public/media`. */
  mediaStaticDir?: string
}

const jobsAccess: JobsConfig['access'] = {
  run: async ({ req }) => {
    const authHeader = req.headers.get('authorization')

    if (process.env.CRON_SECRET) {
      try {
        const cronSecret = assertStrongCronSecret()
        if (authHeader === `Bearer ${cronSecret}`) return true
      } catch {
        // falls through to admin check below
      }
    }

    return checkRole(['admin'], req.user)
  },
}

/** A Feature's collection, hidden in the admin while the Feature is switched off. */
const behindFeature = (collection: CollectionConfig, feature: FeatureName): CollectionConfig => ({
  ...collection,
  admin: { ...collection.admin, hidden: hiddenUnlessFeature(feature) },
})

/**
 * Adds everything that defines a Lab's schema, so every Lab's database matches core's
 * migrations: the research collections, the LabInfo and Features globals, users and
 * roles, Media (with its WebP variants), the template's collections, globals and
 * plugins, the root rich-text editor and localization. Also adds the ingestion job,
 * default-role seeding, optional Google login, and the first-run setup wizard
 * (`/admin/onboarding`) with its dashboard checklist.
 *
 * Put it first in `plugins`, so plugins that target its collections find them. The app
 * supplies the rest: `labkitDb()`, `labkitMediaStorage()`, email, admin branding.
 */
export const labkitPlugin =
  (options: LabkitPluginOptions = {}): Plugin =>
  async (config) => {
    const withCore: Config = {
      ...config,
      // A Payload 4 feature LabKit doesn't use; disabling it avoids its collection.
      llmInstructions: false,
      // Payload 4 lowered the default to 1. Keep 3.x's 2 so queries that omit depth behave as before.
      defaultDepth: config.defaultDepth ?? 2,
      editor: labkitEditor(),
      localization,
      admin: {
        ...config.admin,
        user: config.admin?.user ?? Users.slug,
        livePreview: config.admin?.livePreview ?? {
          breakpoints: [
            { label: 'Mobile', name: 'mobile', width: 375, height: 667 },
            { label: 'Tablet', name: 'tablet', width: 768, height: 1024 },
            { label: 'Desktop', name: 'desktop', width: 1440, height: 900 },
          ],
        },
        components: {
          ...config.admin?.components,
          afterLogin: [
            ...(config.admin?.components?.afterLogin ?? []),
            ...(googleLoginActive ? ['@labkit/core/client#GoogleLoginButton'] : []),
          ],
          // The setup link before the wizard is done, the leftover checklist after.
          beforeDashboard: [
            '@labkit/core/rsc#DashboardSetup',
            ...(config.admin?.components?.beforeDashboard ?? []),
          ],
          views: {
            ...config.admin?.components?.views,
            labkitOnboarding: {
              Component: '@labkit/core/rsc#OnboardingView',
              path: ONBOARDING_PATH,
              exact: true,
            },
          },
        },
      },
      // Order is nav order: Payload renders groups in the order their first collection
      // appears. Research first (what a Lab Editor came to do), then Reference Data,
      // then Import, then the site's own collections, then the ungrouped base ones.
      collections: [
        Publications,
        Team,
        behindFeature(News, 'newsItems'),
        behindFeature(
          createProjects({
            contentBlocks: [Banner, Code, MediaBlock],
            previewURL: ({ slug, breadcrumbs, locale }) =>
              `${serverUrl}${generatePreviewPath({ slug, breadcrumbs, collection: 'projects', locale })}`,
          }),
          'projects',
        ),
        behindFeature(Awards, 'awards'),
        behindFeature(Grants, 'grants'),
        behindFeature(ResearchThemes, 'researchThemes'),
        Venues,
        Organizations,
        ImportRuns,
        ReviewItems,
        ...templateCollections,
        ...(config.collections ?? []),
        createMedia({ staticDir: options.mediaStaticDir }),
        Users,
        Roles,
      ],
      globals: [...templateGlobals, ...(config.globals ?? []), LabInfo, Features],
      endpoints: [...(config.endpoints ?? []), ...onboardingEndpoints],
      jobs: {
        ...config.jobs,
        tasks: [...(config.jobs?.tasks ?? []), importHydrateTask],
        autoRun: config.jobs?.autoRun ?? [{ cron: '* * * * *', queue: 'imports', limit: 1 }],
        access: config.jobs?.access ?? jobsAccess,
      },
      onInit: async (payload) => {
        await config.onInit?.(payload)
        // Add the default roles if needed on system startup
        await initializeRoles(payload)
      },
      upload: {
        ...config.upload,
        transformers: [
          ...(config.upload?.transformers ?? []),
          sharpTransformer({ sharp, collections: { media: mediaSharpConfig } }),
        ],
      },
    }

    return googleLoginPlugin()(await applyTemplatePlugins(withCore))
  }
