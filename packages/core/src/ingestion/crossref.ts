import type { PublicationTypeValue } from '../publicationTypes'
import { cleanText, normalizeDoi, normalizeOrcid, normalizeTitle } from './normalize'
import { mapCrossrefType, type WorkTypeMapping } from './work-types'

export type PublicationType = PublicationTypeValue
// Mirrors Publications.status's select options exactly — never invent a value.
export type PublicationStatus = 'published' | 'accepted-in-press' | 'submitted' | 'preprint'

/**
 * DOIs of other versions of the same work that a source asserts. Identifier
 * evidence: a link made from these may hide a preprint (versions.ts).
 */
export interface VersionRelations {
  /** This work is a preprint of these. */
  publishedVersions: string[]
  /** These are preprints of this work. */
  preprints: string[]
}

function relationDois(relation: unknown, key: string): string[] {
  const entries = (relation as Record<string, unknown> | undefined)?.[key]
  if (!Array.isArray(entries)) return []
  return entries.flatMap((entry) => {
    const { id, 'id-type': idType } = (entry ?? {}) as { id?: unknown; 'id-type'?: unknown }
    return idType === 'doi' && typeof id === 'string' ? [normalizeDoi(id)] : []
  })
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
  /**
   * Crossref's `authenticated-orcid`: true when the author confirmed the
   * ORCID through the publisher's ORCID sign-in rather than the publisher
   * typing it in. Both are per-paper assertions; this records how strong.
   */
  orcidAuthenticated?: boolean
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
  typeMapping?: WorkTypeMapping
  status?: PublicationStatus
  authors?: CrossrefAuthor[]
  relations?: VersionRelations
}

export function mapCrossrefToPublicationFields(json: unknown): CrossrefPublicationFields {
  const message = (json as { message?: Record<string, unknown> })?.message
  if (!message) return {}

  const fields: CrossrefPublicationFields = {}

  if (typeof message.abstract === 'string') {
    // JATS first, then cleanText for (multiply) escaped entities and any
    // tags that only appear once those are decoded.
    fields.abstract = cleanText(stripJats(message.abstract)) || undefined
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
    fields.venueName = cleanText(message['container-title'][0]) || undefined
  }
  if (Array.isArray(message.ISSN)) {
    const issn = message.ISSN.filter((value): value is string => typeof value === 'string')
    if (issn.length > 0) {
      fields.issn = issn
    }
  }
  if (Array.isArray(message.title) && typeof message.title[0] === 'string') {
    fields.title = cleanText(message.title[0]) || undefined
    // ACM and others deposit "Title: Subtitle" as two fields.
    const subtitle =
      Array.isArray(message.subtitle) && typeof message.subtitle[0] === 'string'
        ? cleanText(message.subtitle[0])
        : ''
    // Compared normalized: some deposits repeat the subtitle in the title with
    // different case or punctuation, and a plain `includes` then doubled it.
    if (
      fields.title &&
      subtitle &&
      !normalizeTitle(fields.title).includes(normalizeTitle(subtitle))
    ) {
      fields.title = `${fields.title.replace(/[\s:]+$/, '')}: ${subtitle}`
    }
  }
  const mapping = mapCrossrefType(
    typeof message.type === 'string' ? message.type : undefined,
    typeof message.subtype === 'string' ? message.subtype : undefined,
  )
  if (mapping) {
    fields.type = mapping.type
    fields.typeMapping = mapping
    if (mapping.type === 'preprint') fields.status = 'preprint'
  }
  const relations: VersionRelations = {
    publishedVersions: relationDois(message.relation, 'is-preprint-of'),
    preprints: relationDois(message.relation, 'has-preprint'),
  }
  if (relations.publishedVersions.length > 0 || relations.preprints.length > 0) {
    fields.relations = relations
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
        orcidAuthenticated:
          typeof author.ORCID === 'string' ? author['authenticated-orcid'] === true : undefined,
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
