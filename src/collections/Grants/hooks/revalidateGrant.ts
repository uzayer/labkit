import type { CollectionAfterChangeHook } from 'payload'
import { revalidatePath, revalidateTag } from 'next/cache'

import type { Grant } from '@/payload-types'

export const revalidateGrant: CollectionAfterChangeHook<Grant> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    const path = `/grants/${doc.slug}`

    payload.logger.info(`Revalidating grant at path: ${path}`)

    revalidatePath(path)
    revalidateTag('grants-sitemap', 'max')

    // If the slug changed, revalidate the old path too
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      const oldPath = `/grants/${previousDoc.slug}`

      payload.logger.info(`Revalidating old grant at path: ${oldPath}`)

      revalidatePath(oldPath)
    }
  }

  return doc
}
