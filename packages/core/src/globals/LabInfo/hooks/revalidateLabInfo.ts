import type { GlobalAfterChangeHook } from 'payload'
import { revalidateTag } from 'next/cache'

export const revalidateLabInfo: GlobalAfterChangeHook = ({ doc, req: { payload, context } }) => {
  if (!context.disableRevalidate) {
    payload.logger.info('Revalidating lab-info')
    revalidateTag('lab-info', 'max')
  }
  return doc
}
