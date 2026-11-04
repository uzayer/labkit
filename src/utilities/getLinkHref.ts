import type { Page, Post } from '@/payload-types'
import localization from '@labkit/core/localization'

type LinkField = {
  type?: 'reference' | 'custom' | null
  url?: string | null
  reference?: {
    relationTo: 'pages' | 'posts'
    value: Page | Post | string | number
  } | null
  section?: string | null
  newTab?: boolean | null
}

type LinkHrefResult = {
  href: string
  target?: string
  rel?: string
}

/**
 * Extract href string from PayloadCMS link field object
 * Handles both reference (internal) and custom (external) link types
 *
 * Based on CMSLink component logic from src/components/Link/index.tsx
 *
 * @param link - Link field object from PayloadCMS
 * @param locale - Current locale (defaults to defaultLocale)
 * @returns Object with href, target, and rel properties, or null if invalid
 */
export function getLinkHref(
  link: LinkField | null | undefined,
  locale?: string,
): LinkHrefResult | null {
  if (!link) return null

  const { type, url, reference, section, newTab } = link
  const currentLocale = locale || localization.defaultLocale

  let href = url

  // Handle reference-based (internal) links
  if (type === 'reference' && typeof reference?.value === 'object' && reference.value.slug) {
    // Prefix url with locale if it's not the default locale
    const localePrefix = currentLocale !== localization.defaultLocale ? `/${currentLocale}` : ''

    // Prefix url with collection name if it's not the pages collection
    const relationToPrefix = reference?.relationTo !== 'pages' ? `/${reference?.relationTo}` : ''

    // Add remaining url path
    const pageValue = reference?.value as Page
    const breadcrumbs = pageValue?.breadcrumbs
    const lastBreadcrumbUrl =
      reference?.relationTo === 'pages' && Array.isArray(breadcrumbs)
        ? breadcrumbs[breadcrumbs.length - 1]?.url
        : undefined
    const remainingPath = lastBreadcrumbUrl || `/${reference.value.slug}`

    const normalizedRemainingPath = reference.value.slug === 'home' ? '' : remainingPath
    href = `${localePrefix}${relationToPrefix}${normalizedRemainingPath}`
  }

  // Add section anchor if provided
  if (type === 'reference' && section) {
    href += `#${section}`
  }

  // Default empty href to '/' for home page links
  if (!href && type === 'reference') {
    href = '/'
  }

  // Return null if no valid href
  if (!href) return null

  // Build result object
  const result: LinkHrefResult = { href }

  // Add new tab properties if specified
  if (newTab) {
    result.target = '_blank'
    result.rel = 'noopener noreferrer'
  }

  return result
}
