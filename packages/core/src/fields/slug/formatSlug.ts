import type { FieldHook } from 'payload'

// Latin letters NFKD doesn't decompose into a base letter plus an accent.
const LATIN_EXTRAS: Record<string, string> = {
  ß: 'ss',
  æ: 'ae',
  œ: 'oe',
  ø: 'o',
  đ: 'd',
  ð: 'd',
  ħ: 'h',
  ı: 'i',
  ĸ: 'k',
  ł: 'l',
  ŋ: 'ng',
  ŧ: 't',
  þ: 'th',
}
const LATIN_EXTRAS_RE = new RegExp(`[${Object.keys(LATIN_EXTRAS).join('')}]`, 'g')

// A value already in slug form. Stored slugs pass through untouched, so a plain
// edit never changes a record's URL (older slugs can contain `--`).
const SLUG_FORM = /^[a-z0-9_-]+$/

// Accents fold to their base letter (Tomás → tomas) rather than vanishing.
// Scripts with no Latin form (Bengali, Chinese…) produce '', and the site falls
// back to the record ID.
export const formatSlug = (val: string): string =>
  val
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(LATIN_EXTRAS_RE, (c) => LATIN_EXTRAS[c] ?? c)
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/-{2,}/g, '-')
    .replace(/^-+|-+$/g, '')

type SlugSource = string | ((data: Record<string, unknown>) => unknown)

export const formatSlugHook =
  (source: SlugSource): FieldHook =>
  ({ data, operation, value }) => {
    if (typeof value === 'string' && SLUG_FORM.test(value)) return value

    // An empty or unusable slug (the admin form sends '') falls through to the fallback.
    const own = typeof value === 'string' ? formatSlug(value) : ''
    if (own) return own

    // On update, rebuild only when the slug was sent empty or is unlocked and unset,
    // so editing a title never moves a locked slug.
    const sentEmpty = typeof value === 'string'
    if (operation === 'create' || sentEmpty || (!data?.slug && !data?.slugLock)) {
      const fallbackData = typeof source === 'function' ? source(data ?? {}) : data?.[source]

      if (fallbackData && typeof fallbackData === 'string') {
        return formatSlug(fallbackData) || undefined
      }
    }

    return typeof value === 'string' ? undefined : value
  }
