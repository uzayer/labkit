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
  if (Array.isArray(message['container-title']) && typeof message['container-title'][0] === 'string') {
    fields.venueName = message['container-title'][0]
  }
  if (Array.isArray(message.ISSN)) {
    const issn = message.ISSN.filter((value): value is string => typeof value === 'string')
    if (issn.length > 0) {
      fields.issn = issn
    }
  }

  const publishedDate =
    datePartsToIso(message['published-print'] as { 'date-parts'?: number[][] }) ??
    datePartsToIso(message['published-online'] as { 'date-parts'?: number[][] }) ??
    datePartsToIso(message.published as { 'date-parts'?: number[][] })
  if (publishedDate) fields.publicationDate = publishedDate

  return fields
}
