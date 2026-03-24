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

const BACKUPS_TO_KEEP = Number(process.env.BACKUPS_TO_KEEP) || 10
const COLLECTION_FILE_NAME = 'collections.json'

export async function getDb() {
  const payload = await getPayload({ config: configPromise })
  if (payload.db.name !== 'mongoose') {
    throw new Error('Backup failed: Not a mongoose database adapter')
  }
  const db = payload.db.connection.db
  if (!db) {
    console.error('Backup failed: Database not initialized')
    throw new Error('Backup failed: Database not initialized')
  }
  return db!
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
  return new Promise<{ name: string; content: Buffer }[]>((resolve, reject) => {
    const gunzip = zlib.createGunzip()
    const extract = tar.extract()

    const files: { name: string; content: Buffer }[] = []

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

export async function restoreBackup(
  downloadUrl: string,
  collectionBlacklist: string[] = [],
  mergeData = false,
) {
  'use server'
  const db = await getDb()
  const data = await fetch(downloadUrl)
  let collections: Record<string, { _id?: any }[]> = {}
  if (downloadUrl.split('?')?.[0]?.endsWith('.json')) {
    collections = EJSON.parse(await data.text())
  } else if (downloadUrl.split('?')?.[0]?.endsWith('.gz')) {
    const files = await resolveTarGzip(Buffer.from(await data.arrayBuffer()))
    collections = EJSON.parse(
      files.find((file) => file.name === COLLECTION_FILE_NAME)?.content?.toString() || '{}',
    )
    const medias = files.filter((file) => file.name !== COLLECTION_FILE_NAME)
    console.log(
      'Restored medias',
      await Promise.all(
        medias.map((media) => {
          return put(media.name, media.content, { access: 'public', addRandomSuffix: false })
        }),
      ),
    )
  } else {
    throw new Error(`File type of backup ${downloadUrl} not supported`)
  }

  for (const collectionName of Object.keys(collections)) {
    if (collectionBlacklist.includes(collectionName)) {
      continue
    }
    const collectionData = collections[collectionName]
    if (collectionData.length > 0) {
      console.log('Restoring collection', collectionName)
      const collection = db.collection(collectionName)
      const indexes = await collection.indexes()
      const uniqueIndexes = indexes
        .filter((idx) => idx.unique)
        .flatMap((idx) => Object.keys(idx.key))
      if (!mergeData) {
        await collection.deleteMany({})
      }
      const res = await collection.bulkWrite(
        collectionData.map((doc) => {
          return {
            updateOne: {
              filter:
                uniqueIndexes.length > 0
                  ? {
                      $or: [
                        { _id: doc._id },
                        ...uniqueIndexes.map((field) => ({ [field]: doc[field] })),
                      ],
                    }
                  : { _id: doc._id },
              update: { $set: doc },
              upsert: true,
            },
          }
        }),
      )
      console.log('Restoring done', res)
    }

    if (collectionName === 'pages' && (collectionData as any)?.slug) {
      Object.values((collectionData as any).breadcrumbs)
        .map((b: { url: string }[]) => b[b.length - 1]?.url)
        .forEach((path) => {
          console.log('revalidate path', path)
          revalidatePath(path)
        })
    }
  }
  revalidateTag('global_footer')
  revalidateTag('global_header')
  revalidateTag('global_page-config')
  revalidateTag('global_pageConfig')
  revalidateTag('global_theme-Config')
  revalidateTag('global_themeConfig')
  revalidatePath('/admin')
  redirect('/admin/logout')
}

export async function restoreSeedMedia() {
  'use server'
  const files = await fs.readdir(path.join(process.cwd(), 'public/seed/media'))
  for (const file of files) {
    const data = await fs.readFile(path.join(process.cwd(), 'public/seed/media', file))
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      // Upload file to vercel blob storage
      const blob = await put(file, data, { access: 'public', addRandomSuffix: false })
      console.log('Restored seed media to vercel blob storage', file, blob)
    } else {
      // Copy file to public media directory
      const folderPath = path.join(process.cwd(), 'public/media')
      const publicPath = path.join(folderPath, file)
      await fs.mkdir(folderPath, { recursive: true })
      await fs.writeFile(publicPath, data)
      console.log('Restored seed media to public directory', file, publicPath)
    }
  }
  console.log('Restored all files')
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
        console.warn('Backup: File was in collection but not in blob storage', media.filename)
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
export async function createBackup(cron: boolean = false, includeMedia: boolean = false) {
  const currentHostname = getCurrentHostname()
  const currentDbName = getCurrentDbName()

  if (cron) {
    const { blobs } = await list({
      prefix: 'backups/cron-',
      limit: 1000,
    })
    // Only keep the 10(BACKUPS_TO_KEEP) newest backups and delete the rest. Only for cron backups (prefix cron-).
    const sorted = blobs.sort(
      (a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime(),
    )
    const oldest = sorted.slice(BACKUPS_TO_KEEP - 1)
    for (const blob of oldest) {
      await del(blob.url)
      console.log('Deleted backup', blob.pathname)
    }
  }

  const db = await getDb()
  const collections = await db.listCollections().toArray()
  const allData = {}
  for (const collection of collections) {
    allData[collection.name] = await db.collection(collection.name).find({}).toArray()
  }
  const collectionBackupFile = EJSON.stringify(allData)
  const backupFile = includeMedia
    ? await createMediaBackupFile(collectionBackupFile, allData?.['media'] || [])
    : collectionBackupFile
  const name = `backups/${createBlobName(cron ? 'cron' : 'manual', currentDbName, currentHostname, Date.now().toString(), includeMedia ? 'tar.gz' : 'json')}`
  await put(name, backupFile, { access: 'public' })
  revalidatePath('/admin')
  console.log('Backup created', name)
}
export async function listBackups() {
  'use server'
  const { blobs } = await list({
    prefix: 'backups/',
    limit: 1000,
  })
  return blobs
}
