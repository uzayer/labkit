import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

import { CACHE_TAGS } from '../../../utilities/cacheTags'

export const revalidateLabInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating lab-info')
    revalidateTag(CACHE_TAGS.labInfo, 'max')
  }
  return doc
}
