import type { CollectionAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

import type { Grant } from '../../../types'
import { CACHE_TAGS } from '../../../utilities/cacheTags'

/** Revalidates by tag only; see revalidateProject. */
export const revalidateGrant: CollectionAfterChangeHook<Grant> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (!context.disableRevalidate) {
    payload.logger.info(`Revalidating grant ${doc.slug}`)
    revalidateTag(CACHE_TAGS.grants, 'max')
    if (doc.slug) revalidateTag(CACHE_TAGS.grant(doc.slug), 'max')
    if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
      revalidateTag(CACHE_TAGS.grant(previousDoc.slug), 'max')
    }
  }

  return doc
}
