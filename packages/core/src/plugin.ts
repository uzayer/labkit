import { sharpTransformer } from '@payloadcms/transformer-sharp'
import type { CollectionConfig, JobsConfig, Plugin } from 'payload'
import sharp from 'sharp'

import Awards from './collections/Awards'
import Grants from './collections/Grants'
import ImportRuns from './collections/ImportRuns'
import { createMedia, mediaSharpConfig } from './collections/Media'
import News from './collections/News'
import Organizations from './collections/Organizations'
import { createProjects, type ProjectsOptions } from './collections/Projects'
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

export interface LabkitPluginOptions {
  /** Absolute path for Media uploads when no storage adapter handles them. Defaults to `<cwd>/public/media`. */
  mediaStaticDir?: string
  projects?: ProjectsOptions
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
 * Adds LabKit's research collections, the LabInfo and Features globals, users and roles, Media
 * (with its WebP variants), the ingestion job, default-role seeding, and the
 * first-run setup wizard (`/admin/onboarding`) with its dashboard checklist.
 * Put it first in `plugins`, so plugins that target `projects` or `users` find them.
 */
export const labkitPlugin =
  (options: LabkitPluginOptions = {}): Plugin =>
  (config) => ({
    ...config,
    admin: {
      ...config.admin,
      user: config.admin?.user ?? Users.slug,
      components: {
        ...config.admin?.components,
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
      behindFeature(createProjects(options.projects), 'projects'),
      behindFeature(Awards, 'awards'),
      behindFeature(Grants, 'grants'),
      behindFeature(ResearchThemes, 'researchThemes'),
      Venues,
      Organizations,
      ImportRuns,
      ReviewItems,
      ...(config.collections ?? []),
      createMedia({ staticDir: options.mediaStaticDir }),
      Users,
      Roles,
    ],
    globals: [...(config.globals ?? []), LabInfo, Features],
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
  })
