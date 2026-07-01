import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Grant } from '@/payload-types'

export const revalidateGrant: CollectionAfterChangeHook<Grant> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    if (doc._status === 'published') {
      const path = `/grants/${doc.slug}`

      payload.logger.info(`Revalidating grant at path: ${path}`)

      revalidatePath(path)
      revalidateTag('grants-sitemap', 'max')
    }

    // If the grant was previously published, we need to revalidate the old path
    if (previousDoc._status === 'published' && doc._status !== 'published') {
      const oldPath = `/grants/${previousDoc.slug}`

      payload.logger.info(`Revalidating old grant at path: ${oldPath}`)

      revalidatePath(oldPath)
      revalidateTag('grants-sitemap', 'max')
    }
  }

  return doc
}
