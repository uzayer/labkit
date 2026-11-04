import { sqliteAdapter } from '@payloadcms/db-sqlite'
import path from 'path'
import { fileURLToPath } from 'url'

/** Core owns every migration. A Lab's app never creates its own. */
export const migrationDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), 'migrations')

/**
 * The SQLite/Turso adapter with the settings core's migrations assume: UUID text IDs and
 * core's migrationDir. `TURSO_DATABASE_URL` picks the database (`file:` locally,
 * `libsql://` in production); `PAYLOAD_DB_PUSH=false` keeps a local file migration-only.
 */
export const labkitDb = ({
  url = process.env.TURSO_DATABASE_URL || 'file:./labkit.db',
  authToken = process.env.TURSO_AUTH_TOKEN,
}: { url?: string; authToken?: string } = {}) => {
  // Scoped to Vercel, where a file: database is ephemeral. A local `next build`
  // also runs with NODE_ENV=production and should keep using the local file.
  if (process.env.VERCEL && (!url.startsWith('libsql://') || !authToken)) {
    throw new Error('Production requires TURSO_DATABASE_URL=libsql://... and TURSO_AUTH_TOKEN')
  }

  return sqliteAdapter({
    client: { url, authToken },
    idType: 'uuid',
    allowIDOnCreate: true,
    migrationDir,
    // PAYLOAD_DB_PUSH=false keeps a local database migration-only, so it can be
    // uploaded to Turso without a dev-push marker.
    push: process.env.NODE_ENV !== 'production' && process.env.PAYLOAD_DB_PUSH !== 'false',
    busyTimeout: url.startsWith('file:') ? 10_000 : 0,
    wal: url.startsWith('file:'),
  })
}
