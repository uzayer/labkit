'use server'
import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { del, list, put } from '@vercel/blob'
import { revalidatePath, revalidateTag } from 'next/cache'
import { createBlobName, getCurrentHostname } from './utils'
import { getCurrentDbName } from './utils'
import { redirect } from 'next/navigation'
import { EJSON } from 'bson'
import fs from 'node:fs/promises'
import path from 'node:path'
import zlib from 'node:zlib'
import tar from 'tar-stream'
import { Readable } from 'node:stream'
import { checkRole } from '@/utilities/checkRole'
import { getMeUser } from '@/utilities/getMeUser'
import { assertStrongCronSecret, createSignedBackupDownloadUrl, isBackupPathname } from './security'

const BACKUPS_TO_KEEP = Number(process.env.BACKUPS_TO_KEEP) || 10
const COLLECTION_FILE_NAME = 'collections.json'
const GLOBAL_REVALIDATE_TAGS = [
  'global_footer',
  'global_header',
  'global_page-config',
  'global_pageConfig',
  'global_theme-Config',
  'global_themeConfig',
] as const

interface BackupFile {
  content: Buffer
  name: string
}

interface BackupDocument extends Record<string, unknown> {
  _id: unknown
}

interface PageBreadcrumb {
  url?: string
}

interface PageBackupDocument extends BackupDocument {
  breadcrumbs?: PageBreadcrumb[][]
}

type BackupCollections = Record<string, BackupDocument[]>

function logBackupEvent(
  level: 'log' | 'warn' | 'error',
  event: string,
  metadata?: Record<string, unknown>,
) {
  console[level](`[BackupDashboard] ${event}`, metadata ?? {})
}

async function requireAdminUser() {
  const { user } = await getMeUser()

  if (!checkRole(['admin'], user)) {
    throw new Error('Unauthorized backup operation')
  }

  return user
}

export async function getDb() {
  const payload = await getPayload({ config: configPromise })
  if (payload.db.name !== 'mongoose') {
    throw new Error('Backup failed: Not a mongoose database adapter')
  }
  const db = payload.db.connection.db
  if (!db) {
    logBackupEvent('error', 'database_not_initialized')
    throw new Error('Backup failed: Database not initialized')
  }
  return db!
}

type BackupDb = Awaited<ReturnType<typeof getDb>>

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function parseBackupCollections(raw: unknown): BackupCollections {
  if (!isPlainObject(raw)) {
    throw new Error('Backup restore failed: Expected top-level object keyed by collection name')
  }

  return Object.entries(raw).reduce<BackupCollections>((acc, [collectionName, records]) => {
    if (!Array.isArray(records)) {
      throw new Error(
        `Backup restore failed: Collection "${collectionName}" must be an array of records`,
      )
    }

    acc[collectionName] = records.map((record, index) => {
      if (!isPlainObject(record)) {
        throw new Error(
          `Backup restore failed: Collection "${collectionName}" record ${index} must be an object`,
        )
      }

      if (!('_id' in record)) {
        throw new Error(
          `Backup restore failed: Collection "${collectionName}" record ${index} is missing "_id"`,
        )
      }

      return record as BackupDocument
    })

    return acc
  }, {})
}

function parseBackupText(serializedCollections: string): BackupCollections {
  return parseBackupCollections(EJSON.parse(serializedCollections))
}

function getBackupExtension(downloadUrl: string) {
  return downloadUrl.split('?')[0] ?? downloadUrl
}

async function fetchBackupResponse(downloadUrl: string) {
  const response = await fetch(downloadUrl)

  if (!response.ok) {
    throw new Error(
      `Backup restore failed: Unable to download backup (${response.status} ${response.statusText})`,
    )
  }

  return response
}

async function resolveBackupDownloadUrl(pathname: string) {
  if (!isBackupPathname(pathname)) {
    throw new Error('Invalid backup pathname')
  }

  return createSignedBackupDownloadUrl(pathname)
}

async function restoreBackupMedia(files: BackupFile[]) {
  if (files.length === 0) {
    return
  }

  const restoredMedia = await Promise.all(
    files.map((media) =>
      put(media.name, media.content, { access: 'public', addRandomSuffix: false }),
    ),
  )

  logBackupEvent('log', 'media_restored', { count: restoredMedia.length })
}

async function loadBackupCollections(downloadUrl: string): Promise<BackupCollections> {
  const backupPath = getBackupExtension(downloadUrl)
  const response = await fetchBackupResponse(downloadUrl)

  if (backupPath.endsWith('.json')) {
    return parseBackupText(await response.text())
  }

  if (backupPath.endsWith('.gz')) {
    const files = await resolveTarGzip(Buffer.from(await response.arrayBuffer()))
    const collectionFile = files.find((file) => file.name === COLLECTION_FILE_NAME)

    if (!collectionFile) {
      throw new Error(
        `Backup restore failed: Archive is missing required file "${COLLECTION_FILE_NAME}"`,
      )
    }

    await restoreBackupMedia(files.filter((file) => file.name !== COLLECTION_FILE_NAME))

    return parseBackupText(collectionFile.content.toString())
  }

  throw new Error(`File type of backup ${downloadUrl} not supported`)
}

function getUniqueIndexFields(indexes: { key: Record<string, unknown>; unique?: boolean }[]) {
  return indexes.filter((index) => index.unique).flatMap((index) => Object.keys(index.key))
}

function createRestoreFilter(doc: BackupDocument, uniqueIndexes: string[]) {
  if (uniqueIndexes.length === 0) {
    return { _id: doc._id }
  }

  return {
    $or: [{ _id: doc._id }, ...uniqueIndexes.map((field) => ({ [field]: doc[field] }))],
  }
}

async function restoreCollection(
  db: BackupDb,
  collectionName: string,
  collectionData: BackupDocument[],
  mergeData: boolean,
) {
  if (collectionData.length === 0) {
    return
  }

  logBackupEvent('log', 'collection_restore_started', {
    collectionName,
    documentCount: collectionData.length,
  })

  const collection = db.collection(collectionName)
  const uniqueIndexes = getUniqueIndexFields(await collection.indexes())

  if (!mergeData) {
    await collection.deleteMany({})
  }

  const operations = collectionData.map((doc) => ({
    updateOne: {
      filter: createRestoreFilter(doc, uniqueIndexes),
      update: { $set: doc },
      upsert: true,
    },
  }))

  const result = await collection.bulkWrite(
    operations as Parameters<typeof collection.bulkWrite>[0],
  )

  logBackupEvent('log', 'collection_restore_completed', {
    collectionName,
    matchedCount: result.matchedCount,
    modifiedCount: result.modifiedCount,
    upsertedCount: result.upsertedCount,
  })
}

function revalidateRestoredPages(collectionData: BackupDocument[]) {
  collectionData
    .flatMap((page) =>
      ((page as PageBackupDocument).breadcrumbs ?? []).map((crumbs) => crumbs.at(-1)?.url),
    )
    .filter((pathName): pathName is string => Boolean(pathName))
    .forEach((pathName) => {
      logBackupEvent('log', 'page_revalidated', { path: pathName })
      revalidatePath(pathName)
    })
}

function revalidateBackupGlobals() {
  GLOBAL_REVALIDATE_TAGS.forEach((tag) => revalidateTag(tag, 'max'))
  revalidatePath('/admin')
}

/**
 * Creates a gzipped tar archive from multiple file buffers
 * @param {Array} files - Array of objects { name: 'filename.txt', content: Buffer }
 * @returns {Promise<Buffer>} - The gzipped tar archive as a buffer
 */
function createTarGzip(files: { name: string; content: Buffer }[]) {
  return new Promise<Buffer>((resolve, reject) => {
    const pack = tar.pack() // Create a tar stream
    const gzip = zlib.createGzip()
    const chunks: Buffer[] = []

    // Add each file to the tar archive
    files.forEach(({ name, content }) => {
      pack.entry({ name }, content)
    })

    pack.finalize() // Finalize tar archive

    // Pipe the tar archive through gzip
    const compressedStream = pack.pipe(gzip)

    compressedStream.on('data', (chunk: Buffer) => chunks.push(chunk))
    compressedStream.on('end', () => resolve(Buffer.concat(chunks)))
    compressedStream.on('error', reject)
  })
}

function resolveTarGzip(fileBuffer: Buffer) {
  return new Promise<BackupFile[]>((resolve, reject) => {
    const gunzip = zlib.createGunzip()
    const extract = tar.extract()

    const files: BackupFile[] = []

    extract.on('entry', (header, stream, next) => {
      const chunks: Buffer[] = []
      stream.on('data', (chunk) => chunks.push(chunk))
      stream.on('end', () => {
        files.push({
          name: header.name,
          content: Buffer.concat(chunks),
        })
        next()
      })
      stream.resume()
    })
    extract.on('finish', () => {
      resolve(files)
    })
    extract.on('error', reject)

    const stream = Readable.from(fileBuffer)
    stream.pipe(gunzip).pipe(extract)
  })
}

async function restoreBackupFromDownloadUrl(
  downloadUrl: string,
  collectionBlacklist: string[] = [],
  mergeData = false,
  skipAuthorization = false,
) {
  if (!skipAuthorization) {
    await requireAdminUser()
  }

  const db = await getDb()
  const collections = await loadBackupCollections(downloadUrl)

  for (const collectionName of Object.keys(collections)) {
    if (collectionBlacklist.includes(collectionName)) {
      continue
    }

    const collectionData = collections[collectionName]
    await restoreCollection(db, collectionName, collectionData, mergeData)

    if (collectionName === 'pages') {
      revalidateRestoredPages(collectionData)
    }
  }

  revalidateBackupGlobals()
  redirect('/admin/logout')
}

export async function restoreBackup(
  pathname: string,
  collectionBlacklist: string[] = [],
  mergeData = false,
  skipAuthorization = false,
) {
  'use server'
  return restoreBackupFromDownloadUrl(
    await resolveBackupDownloadUrl(pathname),
    collectionBlacklist,
    mergeData,
    skipAuthorization,
  )
}

export async function restoreExternalBackup(
  downloadUrl: string,
  collectionBlacklist: string[] = [],
  mergeData = false,
  skipAuthorization = false,
) {
  'use server'
  return restoreBackupFromDownloadUrl(
    downloadUrl,
    collectionBlacklist,
    mergeData,
    skipAuthorization,
  )
}

export async function restoreSeedMedia() {
  'use server'
  await requireAdminUser()
  const files = await fs.readdir(path.join(process.cwd(), 'public/seed/media'))
  for (const file of files) {
    const data = await fs.readFile(path.join(process.cwd(), 'public/seed/media', file))
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload file to vercel blob storage
      const blob = await put(file, data, { access: 'public', addRandomSuffix: false })
      logBackupEvent('log', 'seed_media_restored_to_blob', { file, url: blob.url })
    } else {
      // Copy file to public media directory
      const folderPath = path.join(process.cwd(), 'public/media')
      const publicPath = path.join(folderPath, file)
      await fs.mkdir(folderPath, { recursive: true })
      await fs.writeFile(publicPath, data)
      logBackupEvent('log', 'seed_media_restored_to_public_dir', { file, publicPath })
    }
  }
  logBackupEvent('log', 'seed_media_restore_completed', { fileCount: files.length })
  return files
}

export async function createMediaBackupFile(
  collectionBackupFile: string,
  mediaCollection: { filename: string }[],
): Promise<Buffer> {
  const mediaFiles = await Promise.all(
    mediaCollection.map(async (media) => {
      const matchingFiles = await list({ limit: 2, prefix: media.filename })
      const blob = matchingFiles.blobs.find((blob) => blob.pathname === media.filename)
      if (!blob) {
        logBackupEvent('warn', 'media_missing_from_blob_storage', {
          filename: media.filename,
        })
        return undefined
      }
      const data = await fetch(blob.downloadUrl)
      return { name: media.filename, content: Buffer.from(await data.arrayBuffer()) }
    }),
  )
  return await createTarGzip([
    { name: COLLECTION_FILE_NAME, content: Buffer.from(collectionBackupFile) },
    ...(mediaFiles.filter(Boolean) as { name: string; content: Buffer }[]),
  ])
}

async function pruneOldCronBackups() {
  const { blobs } = await list({
    prefix: 'backups/cron-',
    limit: 1000,
  })

  const sorted = blobs.sort(
    (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
  )
  const backupsToDelete = sorted.slice(BACKUPS_TO_KEEP)

  for (const blob of backupsToDelete) {
    await del(blob.url)
    logBackupEvent('log', 'cron_backup_deleted', { pathname: blob.pathname })
  }
}

async function collectAllDbData(db: BackupDb): Promise<Record<string, unknown[]>> {
  const collections = await db.listCollections().toArray()
  const allData: Record<string, unknown[]> = {}

  for (const collection of collections) {
    allData[collection.name] = await db.collection(collection.name).find({}).toArray()
  }

  return allData
}

async function buildBackupFile(allData: Record<string, unknown[]>, includeMedia: boolean) {
  const collectionBackupFile = EJSON.stringify(allData)

  if (!includeMedia) {
    return collectionBackupFile
  }

  return createMediaBackupFile(
    collectionBackupFile,
    ((allData.media as { filename: string }[] | undefined) ?? []).filter(
      (media): media is { filename: string } =>
        isPlainObject(media) && typeof media.filename === 'string',
    ),
  )
}

export async function createBackup(
  cron: boolean = false,
  includeMedia: boolean = false,
  skipAuthorization = false,
) {
  if (!cron) {
    if (!skipAuthorization) {
      await requireAdminUser()
    }
  } else {
    assertStrongCronSecret()
  }

  const currentHostname = getCurrentHostname()
  const currentDbName = getCurrentDbName()

  if (cron) {
    await pruneOldCronBackups()
  }

  const db = await getDb()
  const allData = await collectAllDbData(db)
  const backupFile = await buildBackupFile(allData, includeMedia)
  const name = `backups/${createBlobName(cron ? 'cron' : 'manual', currentDbName, currentHostname, Date.now().toString(), includeMedia ? 'tar.gz' : 'json')}`
  await put(name, backupFile, { access: 'private' })
  revalidatePath('/admin')
  logBackupEvent('log', 'backup_created', { name, includeMedia, cron })
}

export async function listBackups(skipAuthorization = false) {
  'use server'
  if (!skipAuthorization) {
    await requireAdminUser()
  }
  const { blobs } = await list({
    prefix: 'backups/',
    limit: 1000,
  })
  return blobs
}

export async function getBackupDownloadUrl(pathname: string) {
  'use server'
  await requireAdminUser()

  return resolveBackupDownloadUrl(pathname)
}

export async function downloadBackup(pathname: string) {
  'use server'
  redirect(await getBackupDownloadUrl(pathname))
}

export async function deleteBackup(pathname: string) {
  'use server'
  await requireAdminUser()

  if (!isBackupPathname(pathname)) {
    throw new Error('Invalid backup pathname')
  }

  await del(pathname)
  revalidatePath('/admin')
}
