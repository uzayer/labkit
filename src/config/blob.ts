/**
 * The public origin of the Vercel Blob store that holds Media, or null when
 * there is no store (no token: Media is on local disk). The store id is read
 * from the read-write token the same way @payloadcms/storage-vercel-blob does,
 * including its emulator override.
 */
const storeId = process.env.BLOB_READ_WRITE_TOKEN?.match(
  /^vercel_blob_rw_([a-z\d]+)_[a-z\d]+$/i,
)?.[1]?.toLowerCase()

// No store id means the plugin is off and Media is on disk, whatever the override says.
export const blobBaseUrl: string | null = storeId
  ? process.env.STORAGE_VERCEL_BLOB_BASE_URL || `https://${storeId}.public.blob.vercel-storage.com`
  : null
