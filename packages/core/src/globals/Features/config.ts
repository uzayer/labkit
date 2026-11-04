import type { GlobalConfig } from 'payload'

import { anyone } from '../../access/anyone'
import { isAdmin, isAdminHidden } from '../../access/isAdmin'
import { FEATURE_COLLECTIONS, type FeatureName } from './features'
import { revalidateFeatures } from './hooks/revalidateFeatures'

const LABELS: Record<FeatureName, string> = {
  projects: 'Projects',
  grants: 'Grants',
  awards: 'Awards',
  newsItems: 'News Items',
  researchThemes: 'Research Themes',
}

/**
 * Which optional modules this Lab uses. Publications and Team are always on.
 * Switching one off hides its collection in the admin and tells the site to drop
 * its routes and nav (`getFeatures`). The data and the tables stay: every Lab has
 * the same schema (ADR-0003).
 */
export const Features: GlobalConfig = {
  slug: 'features',
  label: 'Features',
  admin: {
    group: 'Settings',
    description:
      'Optional modules this Lab uses. Switching one off hides it in the admin and on the site; its records are kept.',
    hidden: isAdminHidden,
  },
  access: {
    read: anyone,
    update: isAdmin,
  },
  fields: (Object.keys(FEATURE_COLLECTIONS) as FeatureName[]).map((name) => ({
    name,
    label: LABELS[name],
    type: 'checkbox' as const,
    defaultValue: true,
  })),
  hooks: {
    afterChange: [revalidateFeatures],
  },
  versions: false,
  authorship: false,
}
