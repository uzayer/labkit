import type { FieldHook } from 'payload'

// Letters NFKD doesn't decompose into a base letter plus an accent.
const LATIN_EXTRAS: Record<string, string> = {
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ø: 'o',
  đ: 'd',
  ð: 'd',
  ł: 'l',
  þ: 'th',
}

// Accents fold to their base letter (Tomás → tomas) rather than vanishing.
// Scripts with no Latin form (Bengali, Chinese…) produce '', and the site falls
// back to the record ID. Already-stored slugs are ASCII, so they pass through unchanged.
export const formatSlug = (val: string): string =>
  val
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[ßæœøđðłþ]/g, (c) => LATIN_EXTRAS[c] ?? c)
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

type SlugSource = string | ((data: Record<string, unknown>) => unknown)

export const formatSlugHook =
  (source: SlugSource): FieldHook =>
  ({ data, operation, value }) => {
    // An empty slug (the admin form sends '') falls through to the fallback.
    if (typeof value === 'string' && value.trim() !== '') {
      return formatSlug(value) || undefined
    }

    if (operation === 'create' || (!data?.slug && !data?.slugLock)) {
      const fallbackData = typeof source === 'function' ? source(data ?? {}) : data?.[source]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData) || undefined
      }
    }

    return value
  }
