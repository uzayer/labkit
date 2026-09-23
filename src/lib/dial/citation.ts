/**
 * Citation formatting, shared by every surface that offers "Cite".
 *
 * APA text is stored on the record (`citationText`) because it is copied from
 * the Lab's own source, not generated. BibTeX is generated, because no source
 * carries it and a lab's reference manager needs it.
 */

export type CitationSource = {
  title: string
  /** Display names, comma-separated, in source order. */
  authors: string
  venue?: string | null
  type?: string | null
}

const ENTRY_TYPES: Record<string, string> = {
  conference: '@inproceedings',
  journal: '@article',
  workshop: '@inproceedings',
  preprint: '@misc',
  'extended-abstract': '@inproceedings',
  'study-protocol': '@article',
  'book-chapter': '@incollection',
}

/** "Nova Ahmed" → "Ahmed, Nova", which is how BibTeX wants a name. */
function formatAuthorBibTeX(name: string): string {
  const parts = name.trim().split(/\s+/)
  if (parts.length === 1) return name
  const last = parts[parts.length - 1]
  const first = parts.slice(0, -1).join(' ')
  return `${last}, ${first}`
}

export function generateBibTeX(pub: CitationSource, year: number): string {
  const entry = ENTRY_TYPES[pub.type ?? ''] ?? '@misc'

  const firstAuthorLastName =
    pub.authors.split(',')[0].trim().split(/\s+/).pop()?.toLowerCase() ?? 'unknown'
  const firstTitleWord = pub.title
    .split(/\s+/)[0]
    .replace(/[^a-z]/gi, '')
    .toLowerCase()
  const key = `${firstAuthorLastName}${year}${firstTitleWord}`

  const authorsFormatted = pub.authors.split(', ').map(formatAuthorBibTeX).join(' and ')

  const isArticle = entry === '@article'
  const venueField = isArticle ? 'journal' : 'booktitle'
  const venueValue = pub.venue
    ? isArticle
      ? pub.venue
      : `Proceedings of ${pub.venue} ${year}`
    : null

  return [
    `${entry}{${key},`,
    `  author    = {${authorsFormatted}},`,
    `  title     = {${pub.title}},`,
    venueValue ? `  ${venueField.padEnd(9)} = {${venueValue}},` : null,
    `  year      = {${year}},`,
    `}`,
  ]
    .filter(Boolean)
    .join('\n')
}

export async function copyToClipboard(text: string) {
  try {
    if (navigator?.clipboard?.writeText) {
      await navigator.clipboard.writeText(text)
      return
    }
    window.prompt('Copy this citation text:', text)
  } catch {
    // silent
  }
}
