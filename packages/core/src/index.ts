import path from 'path'
import { fileURLToPath } from 'url'

export { labkitPlugin, type LabkitPluginOptions } from './plugin'
export type { ProjectsOptions } from './collections/Projects'
export {
  FEATURE_COLLECTIONS,
  FEATURE_DEFAULTS,
  getFeatures,
  type FeatureName,
  type LabFeatures,
} from './globals/Features/features'
export { CACHE_TAGS } from './utilities/cacheTags'
export { TEAM_ROLES, type TeamRoleValue } from './collections/Team/roles'

/** Core owns every migration. Point the db adapter's `migrationDir` here. */
export const migrationDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'migrations')
