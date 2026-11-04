import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '../../../utilities/cacheTags'

export const revalidateFeatures: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating features')
    revalidateTag(CACHE_TAGS.features, 'max')
  }
  return doc
}
