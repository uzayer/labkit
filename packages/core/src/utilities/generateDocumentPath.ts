import localization from '../localization'
interface Breadcrumb {
  url?: string | null
}

const collectionPrefixMap = {
  pages: '',
  posts: '/posts',
  projects: '/projects',
}

export type PublicDocumentCollection = keyof typeof collectionPrefixMap

interface GenerateDocumentPathArgs {
  breadcrumbs?: Breadcrumb[] | null
  collection: PublicDocumentCollection
  locale?: string
  slug?: string | null
}

/**
 * Returns the public route for a CMS document, including its collection,
 * locale, and (for Pages) complete nested breadcrumb path.
 */
export const generateDocumentPath = ({
  breadcrumbs,
  collection,
  locale = localization.defaultLocale,
  slug,
}: GenerateDocumentPathArgs) => {
  const localePrefix = locale === localization.defaultLocale ? '' : `/${locale}`
  const collectionPrefix = collectionPrefixMap[collection] || ''
  const breadcrumbPath = breadcrumbs?.at(-1)?.url
  const documentPath =
    collection === 'pages' && slug !== 'home' && breadcrumbPath ? breadcrumbPath : `/${slug || ''}`

  return `${localePrefix}${collectionPrefix}${slug === 'home' ? '/' : documentPath}`
}
