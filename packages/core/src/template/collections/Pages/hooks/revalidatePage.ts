import type { CollectionAfterChangeHook } from 'payload'

import { revalidatePath } from 'next/cache'

import type { Page } from '../../../../types'
import localization from '../../../../localization'
import { generateDocumentPath } from '../../../../utilities/generateDocumentPath'

const nonDefaultLocale = localization.locales.filter(
  (locale) => locale !== localization.defaultLocale,
)

export const revalidatePage: CollectionAfterChangeHook<Page> = ({
  doc,
  previousDoc,
  req: { payload },
}) => {
  const publishedPages = [doc, previousDoc].filter(
    (page): page is Page => page?._status === 'published',
  )
  const paths = new Set(
    publishedPages.flatMap((page) => [
      generateDocumentPath({ breadcrumbs: page.breadcrumbs, collection: 'pages', slug: page.slug }),
      ...nonDefaultLocale.map((locale) =>
        generateDocumentPath({
          breadcrumbs: page.breadcrumbs,
          collection: 'pages',
          locale: String(locale),
          slug: page.slug,
        }),
      ),
    ]),
  )

  for (const path of paths) {
    payload.logger.info(`Revalidating page at path: ${path}`)
    revalidatePath(path)
  }

  return doc
}
