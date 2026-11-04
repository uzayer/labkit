import path from 'path'
import { fileURLToPath } from 'url'

export { labkitPlugin, type LabkitPluginOptions } from './plugin'
export type { ProjectsOptions } from './collections/Projects'

/** Core owns every migration. Point the db adapter's `migrationDir` here. */
export const migrationDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'migrations')
