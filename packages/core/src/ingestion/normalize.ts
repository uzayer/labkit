export { formatSlug as slugify } from '../fields/slug/formatSlug'

export function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/** Strips the "https://orcid.org/" prefix ORCID/OpenAlex/Crossref all wrap the bare ID in. */
export function normalizeOrcid(raw?: string | null): string | undefined {
  if (!raw) return undefined
  const trimmed = raw.replace(/^https?:\/\/orcid\.org\//i, '').trim()
  return trimmed || undefined
}

/**
 * Lowercases a DOI before any uniqueness check. `Publications.doi` is
 * `unique: true` with a case-insensitive format validator, but nothing
 * normalizes case before the check — "10.1145/ABC" and "10.1145/abc" would
 * otherwise be treated as different values by Mongo's case-sensitive index.
 */
export function normalizeDoi(raw: string): string {
  return raw
    .replace(/^https?:\/\/(dx\.)?doi\.org\//i, '')
    .trim()
    .toLowerCase()
}

export function splitCommaList(value?: string): string[] {
  if (!value) return []
  return value
    .split(',')
    .map((part) => part.trim())
    .filter(Boolean)
}

/**
 * DIAL's grant dates are quoted year-only strings (e.g. "2019"). Convert to
 * an ISO date so they fit the Grants collection's `date` fields.
 */
export function yearToDate(year: string | number, endOfYear = false): string {
  const y = typeof year === 'string' ? parseInt(year, 10) : year
  return endOfYear
    ? new Date(Date.UTC(y, 11, 31)).toISOString()
    : new Date(Date.UTC(y, 0, 1)).toISOString()
}

const NAMED_ENTITIES: Record<string, string> = {
  amp: '&',
  lt: '<',
  gt: '>',
  quot: '"',
  apos: "'",
  nbsp: ' ',
  ndash: '–',
  mdash: '—',
  lsquo: '‘',
  rsquo: '’',
  ldquo: '“',
  rdquo: '”',
  hellip: '…',
}

/** One pass of HTML entity decoding — named (common subset) and numeric. Unknown names are left as-is. */
function decodeEntitiesOnce(text: string): string {
  return text.replace(/&(#x[0-9a-f]+|#\d+|[a-z]+);/gi, (match, body: string) => {
    if (body[0] === '#') {
      const code =
        body[1] === 'x' || body[1] === 'X'
          ? Number.parseInt(body.slice(2), 16)
          : Number.parseInt(body.slice(1), 10)
      return Number.isFinite(code) && code > 0 && code <= 0x10ffff
        ? String.fromCodePoint(code)
        : match
    }
    return NAMED_ENTITIES[body.toLowerCase()] ?? match
  })
}

/**
 * Cleans a title / venue name / abstract from Crossref or OpenAlex into plain
 * text. Publisher metadata is sometimes escaped more than once (`&amp;amp;`,
 * `&lt;sub&gt;`), so decoding repeats until the string stops changing —
 * bounded at 3 passes so a pathological input cannot loop. Tags are stripped
 * only after decoding, because an escaped `&lt;p&gt;` only becomes a tag once
 * decoded.
 */
export function cleanText(raw: string): string {
  let text = raw
  for (let pass = 0; pass < 3; pass++) {
    const decoded = decodeEntitiesOnce(text)
    if (decoded === text) break
    text = decoded
  }
  return text
    .replace(/<\/?[a-z][^>]*>/gi, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

/**
 * Key for exact venue matching (a Safe Match for venues): two strings match
 * only if they are identical after this deterministic normalisation. Never
 * used for similarity — there is no fuzzy step anywhere in venue matching.
 */
export function normalizeVenueName(raw: string): string {
  return (
    cleanText(raw) // Crossref container-titles carry escaped entities ("Information &amp; Communication")
      .toLowerCase()
      // "Information & Communication" and "Information and Communication" are the same venue.
      .replace(/&/g, ' and ')
      // Punctuation varies across years and sources ("SIGCAS/SIGCHI", "Electronics, and Vision (ICIEV)").
      .replace(/[^\p{L}\p{N}\s]/gu, ' ')
      // Per-edition years ("the 2023 CHI Conference") name one edition, not a different venue.
      .replace(/\b\d{4}\b/g, ' ')
      // Numeric edition ordinals ("13th International Conference ...") — word ordinals are out of scope.
      .replace(/\b\d+(st|nd|rd|th)\b/g, ' ')
      // Crossref prefixes some editions with "Proceedings of the" and not others.
      .replace(/\bproceedings\s+of(\s+the)?\b/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()
  )
}

/**
 * Lowercased, accent-folded name tokens with periods, commas and hyphens
 * removed. Only for *compatibility* checks (namesCompatible), which can
 * withhold a link but never make one, so folding accents is safe here. It
 * would not be safe in an identity key.
 */
export function nameTokens(name: string): string[] {
  return name
    .normalize('NFKD')
    .replace(/\p{M}/gu, '')
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/[-‐‑–]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
}

// Given-name prefixes so common in Bangladesh and the wider region ("Md." is
// Mohammad) that sharing one says nothing about identity. They are skipped
// when comparing initials, but never dropped from a name: "Md." is part of
// the person's name, not an honorific.
const NON_DISCRIMINATING_GIVEN = new Set([
  'md',
  'mohd',
  'mohammad',
  'mohammed',
  'muhammad',
  'muhammed',
  'mohamed',
  'mst',
  'most',
  'mosammat',
  'sk',
  'sheikh',
])

/**
 * Deterministic "cannot be the same person" test, after S2AND's cannot-link
 * constraints. Two printed names are compatible when they share a family
 * name (either side's last token appears in the other, which tolerates
 * family-first order) and their other given-name initials overlap.
 *
 * Only ever used to withhold a link (identifier matches, author pairing). A
 * false "incompatible" costs a Review Item; a false "compatible" changes
 * nothing compared with not checking at all.
 */
export function namesCompatible(a: string, b: string): boolean {
  const tokensA = nameTokens(a)
  const tokensB = nameTokens(b)
  if (tokensA.length === 0 || tokensB.length === 0) return false

  const familyA = tokensA[tokensA.length - 1]
  const familyB = tokensB[tokensB.length - 1]
  const shared = tokensB.includes(familyA) ? familyA : tokensA.includes(familyB) ? familyB : null
  if (!shared) return false

  const initials = (tokens: string[]) => {
    const given = tokens.filter((token) => token !== shared)
    const meaningful = given.filter((token) => !NON_DISCRIMINATING_GIVEN.has(token))
    return new Set((meaningful.length > 0 ? meaningful : given).map((token) => token[0]))
  }
  const initialsA = initials(tokensA)
  const initialsB = initials(tokensB)
  // A family-name-only form or a mononym has no initials to conflict on.
  if (initialsA.size === 0 || initialsB.size === 0) return true
  return [...initialsA].some((initial) => initialsB.has(initial))
}

/**
 * Whether two printed names can be the same person *on one paper*, strictly
 * enough to carry an ORCID or affiliation from one source's author to the
 * other's. Stricter than namesCompatible: given names must agree token by
 * token, where an initial agrees with a full name it starts but two
 * different full names never agree ("Saiful Islam" is not "Salekul Islam",
 * though their initials are the same). Md./Mohammad-style prefixes are
 * ignored, as in namesCompatible.
 */
export function namesPair(a: string, b: string): boolean {
  if (!namesCompatible(a, b)) return false
  const tokensA = nameTokens(a)
  const tokensB = nameTokens(b)
  const familyA = tokensA[tokensA.length - 1]
  const shared = tokensB.includes(familyA) ? familyA : tokensB[tokensB.length - 1]
  const given = (tokens: string[]) =>
    tokens.filter((token) => token !== shared && !NON_DISCRIMINATING_GIVEN.has(token))
  const [fewer, more] = [given(tokensA), given(tokensB)].sort((x, y) => x.length - y.length)
  return fewer.every((token) =>
    more.some(
      (other) =>
        token === other || ((token.length === 1 || other.length === 1) && token[0] === other[0]),
    ),
  )
}

/**
 * Typography-only key for names that must be *equal*: Unicode form, case,
 * periods, commas, hyphens and spacing. Diacritics are kept, because folding
 * them can merge genuinely different names.
 */
export function exactNameKey(name: string): string {
  return name
    .normalize('NFKC')
    .toLowerCase()
    .replace(/[.,]/g, ' ')
    .replace(/[-‐‑–]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}
