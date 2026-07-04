import { normalizeOrcid } from './normalize'

// Mirrors Publications.type / Publications.status select options exactly
// (src/collections/Publications/index.ts) — never invent a value outside these.
export type PublicationType =
  | 'conference'
  | 'journal'
  | 'workshop'
  | 'preprint'
  | 'extended-abstract'
  | 'study-protocol'
  | 'book-chapter'
export type PublicationStatus = 'published' | 'accepted-in-press' | 'submitted' | 'preprint'

// Crossref work types with no equivalent Publications.type value (dataset,
// dissertation, monograph, component, ...) are deliberately left unmapped —
// callers must flag these rather than guess, since a wrong `type` changes
// which conditional admin fields show (location for conference, editor for
// book-chapter).
const CROSSREF_TYPE_MAP: Record<string, PublicationType> = {
  'journal-article': 'journal',
  'proceedings-article': 'conference',
  'book-chapter': 'book-chapter',
  'posted-content': 'preprint',
}

function stripJats(text: string): string {
  return text
    .replace(/<\/?jats:[^>]+>/g, '')
    .replace(/<\/?[a-z][^>]*>/gi, '')
    .trim()
}

function datePartsToIso(dateParts?: { 'date-parts'?: number[][] }): string | undefined {
  const parts = dateParts?.['date-parts']?.[0]
  if (!parts || parts.length === 0) return undefined
  const [year, month = 1, day = 1] = parts
  return new Date(Date.UTC(year, month - 1, day)).toISOString()
}

function yearFromDateParts(dateParts?: { 'date-parts'?: number[][] }): number | undefined {
  return dateParts?.['date-parts']?.[0]?.[0]
}

export interface CrossrefAuthor {
  given?: string
  family?: string
  orcid?: string
  sequence?: 'first' | 'additional'
  affiliationName?: string
}

export interface CrossrefPublicationFields {
  abstract?: string
  volume?: string
  issue?: string
  pageStart?: string
  pageEnd?: string
  publisher?: string
  publicationDate?: string
  venueName?: string
  issn?: string[]
  title?: string
  year?: number
  type?: PublicationType
  status?: PublicationStatus
  authors?: CrossrefAuthor[]
}

export function mapCrossrefToPublicationFields(json: unknown): CrossrefPublicationFields {
  const message = (json as { message?: Record<string, unknown> })?.message
  if (!message) return {}

  const fields: CrossrefPublicationFields = {}

  if (typeof message.abstract === 'string') {
    fields.abstract = stripJats(message.abstract)
  }
  if (typeof message.volume === 'string') {
    fields.volume = message.volume
  }
  if (typeof message.issue === 'string') {
    fields.issue = message.issue
  }
  if (typeof message.page === 'string') {
    const [start, end] = message.page.split('-')
    fields.pageStart = start?.trim()
    if (end) fields.pageEnd = end.trim()
  }
  if (typeof message.publisher === 'string') {
    fields.publisher = message.publisher
  }
  if (
    Array.isArray(message['container-title']) &&
    typeof message['container-title'][0] === 'string'
  ) {
    fields.venueName = message['container-title'][0]
  }
  if (Array.isArray(message.ISSN)) {
    const issn = message.ISSN.filter((value): value is string => typeof value === 'string')
    if (issn.length > 0) {
      fields.issn = issn
    }
  }
  if (Array.isArray(message.title) && typeof message.title[0] === 'string') {
    fields.title = message.title[0]
  }
  if (typeof message.type === 'string') {
    const mapped = CROSSREF_TYPE_MAP[message.type]
    if (mapped) {
      fields.type = mapped
      if (mapped === 'preprint') fields.status = 'preprint'
    }
  }
  if (Array.isArray(message.author)) {
    fields.authors = (message.author as Array<Record<string, unknown>>).map((author) => {
      const affiliations = Array.isArray(author.affiliation) ? author.affiliation : []
      const affiliationName =
        typeof affiliations[0] === 'object' && affiliations[0] !== null
          ? (affiliations[0] as { name?: string }).name
          : undefined

      return {
        given: typeof author.given === 'string' ? author.given : undefined,
        family: typeof author.family === 'string' ? author.family : undefined,
        orcid: normalizeOrcid(typeof author.ORCID === 'string' ? author.ORCID : undefined),
        sequence: author.sequence === 'first' ? 'first' : 'additional',
        affiliationName,
      } satisfies CrossrefAuthor
    })
  }

  const publishedDateParts =
    (message['published-print'] as { 'date-parts'?: number[][] }) ??
    (message['published-online'] as { 'date-parts'?: number[][] }) ??
    (message.published as { 'date-parts'?: number[][] })
  const publishedDate = datePartsToIso(publishedDateParts)
  if (publishedDate) fields.publicationDate = publishedDate
  const year = yearFromDateParts(publishedDateParts)
  if (year) fields.year = year

  return fields
}
