import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'

/**
 * Media in Vercel Blob. Its storage plugin adds Media's `prefix` and `_objectKey`
 * columns, which core's migrations include, so every Lab uses it. Without a token
 * it stays off and Media is written to local disk, with the same schema.
 */
export const labkitMediaStorage = (token = process.env.BLOB_READ_WRITE_TOKEN || '') =>
  vercelBlobStorage({
    collections: {
      media: true,
    },
    token,
  })
