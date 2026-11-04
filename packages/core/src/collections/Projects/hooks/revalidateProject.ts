import type { CollectionAfterChangeHook } from 'payload'

import { revalidateTag } from 'next/cache'

import type { Project } from '../../../types'
import { CACHE_TAGS } from '../../../utilities/cacheTags'

/**
 * Revalidates by tag only: which routes show a Project is the site's business,
 * so the site tags its own cached reads and revalidates its own paths.
 */
export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  // A draft that was never published isn't on the site, so nothing to refresh.
  if (doc._status !== 'published' && previousDoc?._status !== 'published') {
    return doc
  }

  payload.logger.info(`Revalidating project ${doc.slug}`)
  revalidateTag(CACHE_TAGS.projects, 'max')
  if (doc.slug) revalidateTag(CACHE_TAGS.project(doc.slug), 'max')
  if (previousDoc?.slug && previousDoc.slug !== doc.slug) {
    revalidateTag(CACHE_TAGS.project(previousDoc.slug), 'max')
  }

  return doc
}
