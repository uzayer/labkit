// One-off: copy Media files written in local-file mode (public/media/) into
// Vercel Blob, under the same pathnames the storage adapter reads, so the
// database's `/api/media/file/<filename>` URLs resolve without a rewrite.
import { readFile, stat } from 'node:fs/promises'
import { spawnSync } from 'node:child_process'
import path from 'node:path'
import { head, put } from '@vercel/blob'

const [file, mode] = process.argv.slice(2)
const token = process.env.BLOB_READ_WRITE_TOKEN
if (!file) throw new Error('Usage: media-to-blob.mjs <database.db> [dry-run]')
if (!token && mode !== 'dry-run') throw new Error('Set BLOB_READ_WRITE_TOKEN')

const columns = ['filename', 'mime_type']
for (const size of ['thumbnail', 'avatar', 'card', 'og'])
  columns.push(`sizes_${size}_filename`, `sizes_${size}_mime_type`)
const query = spawnSync('sqlite3', ['-json', path.resolve(file), `select ${columns} from media`], {
  encoding: 'utf8',
})
if (query.status !== 0) throw new Error(query.stderr)

const files = new Map()
for (const row of JSON.parse(query.stdout || '[]')) {
  for (let i = 0; i < columns.length; i += 2) {
    const name = row[columns[i]]
    if (name) files.set(name, row[columns[i + 1]] || undefined)
  }
}

const missing = []
for (const name of files.keys()) {
  try {
    await stat(path.resolve('public/media', name))
  } catch {
    missing.push(name)
  }
}
if (missing.length) throw new Error(`Missing from public/media/: ${missing.join(', ')}`)
console.log(`${files.size} files referenced by Media`)
if (mode === 'dry-run') process.exit(0)

let uploaded = 0
const queue = [...files]
// A few uploads in flight; one at a time takes minutes for a few hundred files.
async function worker() {
  for (let next = queue.shift(); next; next = queue.shift()) {
    const [name, contentType] = next
    const body = await readFile(path.resolve('public/media', name))
    // Idempotent: re-running skips what already landed.
    const existing = await head(name, { token }).catch(() => null)
    if (existing?.size === body.length) continue
    await put(name, body, {
      access: 'public',
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      token,
    })
    uploaded++
  }
}
await Promise.all(Array.from({ length: 8 }, worker))
console.log(`Uploaded ${uploaded}, skipped ${files.size - uploaded} already present`)
