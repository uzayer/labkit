import { LocalizationConfig } from 'payload'

// You need to restart the development server after changing this file
// To enable German localization, uncomment the 'de' entries below
export const locales = ['en'] as const
// export const locales = ['en', 'de'] as const // Uncomment to enable German
export type Locale = (typeof locales)[number]

export const localization: LocalizationConfig = {
  locales: [...locales],
  defaultLocale: 'en',
  fallback: true,
} as const

export const localeLabels: Record<Locale, string> = {
  en: 'EN',
  // de: 'DE', // Uncomment to enable German
}

export default localization

if (!localization.locales.includes(localization.defaultLocale)) {
  throw new Error('Default locale is not in the locales array')
}
if (localization.locales.length < 1) {
  throw new Error(
    'Localization must be enabled. If you only want to use one locale, set the `defaultLocale` to that locale and set `locales` to an array with a single element.',
  )
}
