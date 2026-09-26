import { copyFile, mkdir, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'

const [mode, file] = process.argv.slice(2)
const url = process.env.TURSO_DATABASE_URL || 'file:./labkit.db'
if (!url.startsWith('file:'))
  throw new Error('Local SQLite only; use Turso branches/PITR for remote backups')
const database = path.resolve(url.slice(5))
const backup = file ? path.resolve(file) : path.resolve('backup', `labkit-${Date.now()}.db`)

if (mode === 'create') {
  await stat(database)
  await mkdir(path.dirname(backup), { recursive: true })
  // SQLite's online backup command includes committed WAL changes.
  const result = spawnSync('sqlite3', [database, `.backup '${backup.replaceAll("'", "''")}'`], {
    stdio: 'inherit',
  })
  if (result.status !== 0) throw new Error('SQLite backup failed')
  console.log(backup)
} else if (mode === 'restore') {
  if (!file) throw new Error('Pass a backup file path')
  await stat(backup)
  await mkdir(path.dirname(database), { recursive: true })
  await copyFile(backup, database, 1) // COPYFILE_EXCL: never overwrite a live database
  console.log(`Restored into ${database}. Start Payload only after checking this copy.`)
} else {
  throw new Error('Usage: sqlite-backup.mjs create [file] | restore <file>')
}
