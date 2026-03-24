import localization, { Locale, locales } from '@/localization.config'

/**
 * Resolves URL slugs for the multi-language routing system, handling both localized and non-localized routes.
 * This function is crucial for the application's internationalization (i18n) routing strategy.
 *
 * The function handles several URL patterns:
 * 1. "/" -> Maps to home page in default locale
 * 2. "/de" -> Maps to home page in German
 * 3. "/about" -> Maps to about page in default locale
 * 4. "/de/about" -> Maps to about page in German
 *
 * Special cases:
 * - Prevents serving default locale in URL (e.g., "/en" redirects to "/")
 * - Prevents redundant "home" slug (e.g., "/home" or "/de/home" redirect to "/" or "/de")
 * - Handles nested routes by preserving additional segments after the main slug
 *
 * @param slugs - An array of URL path segments (e.g., ["de", "about"] for "/de/about")
 * @returns An object containing:
 *   - isNotFound: true if the route should trigger a 404, false otherwise
 *   - locale: The resolved locale (either default or specified in URL)
 *   - cleanSlugs: Processed array of slugs with proper handling of home pages and nested routes
 *
 * @example
 * resolveSlugs(["de", "about"]) // { isNotFound: false, locale: "de", cleanSlugs: ["about"] }
 * resolveSlugs(["about"]) // { isNotFound: false, locale: "en", cleanSlugs: ["about"] }
 * resolveSlugs([]) // { isNotFound: false, locale: "en", cleanSlugs: ["home"] }
 */
export function resolveSlugs(
  slugs: Array<string>,
):
  | { isNotFound: true; locale: Locale; cleanSlugs?: string[] }
  | { isNotFound: false; locale: Locale; cleanSlugs: string[] } {
  const localeOrSlug = slugs?.[0]
  const slugRaw = slugs?.[1]
  const remainingSlugs = slugs?.slice(2)

  // We do not want to serve under default locale. Default locale should run directly under /
  if (localeOrSlug === localization.defaultLocale) {
    return { isNotFound: true, locale: localization.defaultLocale as Locale }
  }

  let locale: Locale = localization.defaultLocale as Locale
  let firstSlug: string = 'home'
  if (locales.includes(localeOrSlug as Locale)) {
    // localeOrSlug is a locale (default locale is already filtered out by the if statement above)
    locale = localeOrSlug as Locale
    if (slugRaw === 'home') {
      // We do not want to serve under /de/home. This route should be served directly under /de
      return { isNotFound: true, locale }
    }
    // If no slug is provided, we want to serve page saved under slug "home" under /de url
    firstSlug = slugRaw || 'home'

    return { locale, cleanSlugs: [firstSlug, ...remainingSlugs], isNotFound: false }
  } else {
    // If localeOrSlug is not a locale, we want to serve page with default locale
    locale = localization.defaultLocale as Locale
    // localeOrSlug is a slug
    if (localeOrSlug === 'home') {
      // We do not want to serve under /home. This route should be served directly under /
      return { isNotFound: true, locale }
    }
    // If no slug is provided, we want to serve page saved under slug "home" under / url
    firstSlug = localeOrSlug || 'home'

    // If localeOrSlug is a slug, then slugRaw has to be empty
    if (slugRaw) {
      return { locale, cleanSlugs: [firstSlug, slugRaw, ...remainingSlugs], isNotFound: false }
    } else {
      return { locale, cleanSlugs: [firstSlug, ...remainingSlugs], isNotFound: false }
    }
  }
}
