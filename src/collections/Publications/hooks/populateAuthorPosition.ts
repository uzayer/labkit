import type { CollectionBeforeChangeHook } from 'payload'

import type { Publication } from '@/payload-types'

/**
 * Auto-populates authorPosition based on array index
 * This ensures author order is explicitly stored for JSON-LD output
 */
export const populateAuthorPosition: CollectionBeforeChangeHook<Publication> = async ({ data }) => {
  if (data?.authors && Array.isArray(data.authors)) {
    data.authors = data.authors.map((author, index) => ({
      ...author,
      authorPosition: index + 1, // 1-indexed position
    }))
  }

  return data
}
