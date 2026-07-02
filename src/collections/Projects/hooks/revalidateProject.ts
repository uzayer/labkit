import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Project } from '../../../payload-types'

export const revalidateProject: CollectionAfterChangeHook<Project> = ({
  doc,
  previousDoc,
  req: { payload, context },
}) => {
  if (context.disableRevalidate) {
    return doc
  }

  if (doc._status === 'published') {
    const path = `/projects/${doc.slug}`

    payload.logger.info(`Revalidating project at path: ${path}`)

    revalidatePath(path)
  }

  // If the project was previously published, we need to revalidate the old path
  if (previousDoc._status === 'published' && doc._status !== 'published') {
    const oldPath = `/projects/${previousDoc.slug}`

    payload.logger.info(`Revalidating old project at path: ${oldPath}`)

    revalidatePath(oldPath)
  }

  return doc
}
