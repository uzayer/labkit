export interface CoverageRow {
  doi: string
  crossref: {
    ok: boolean
    abstract: boolean
    funder: boolean
    issn: boolean
    page: boolean
    volume: boolean
    publisher: boolean
    authorOrcid: boolean
    publishedDate: boolean
  }
  openalex: {
    ok: boolean
    abstractIndex: boolean
    oaStatus: boolean
    authorships: boolean
    grants: boolean
  }
}

export type CoverageReport = CoverageRow[]

function coverageFromCrossref(json: unknown): CoverageRow['crossref'] {
  const message = (json as { message?: Record<string, unknown> })?.message
  if (!message) {
    return {
      ok: false,
      abstract: false,
      funder: false,
      issn: false,
      page: false,
      volume: false,
      publisher: false,
      authorOrcid: false,
      publishedDate: false,
    }
  }

  const authors = Array.isArray(message.author) ? message.author : []

  return {
    ok: true,
    abstract: Boolean(message.abstract),
    funder: Array.isArray(message.funder) && message.funder.length > 0,
    issn: Array.isArray(message.ISSN) && message.ISSN.length > 0,
    page: Boolean(message.page),
    volume: Boolean(message.volume),
    publisher: Boolean(message.publisher),
    authorOrcid: authors.some((author) => Boolean((author as { ORCID?: unknown }).ORCID)),
    publishedDate: Boolean(
      message['published-print'] || message['published-online'] || message.published,
    ),
  }
}

function coverageFromOpenAlex(json: unknown): CoverageRow['openalex'] {
  const work = json as {
    error?: unknown
    abstract_inverted_index?: unknown
    open_access?: { oa_status?: unknown }
    authorships?: unknown[]
    grants?: unknown[]
  } | null

  if (!work || work.error) {
    return { ok: false, abstractIndex: false, oaStatus: false, authorships: false, grants: false }
  }

  return {
    ok: true,
    abstractIndex: Boolean(work.abstract_inverted_index),
    oaStatus: Boolean(work.open_access?.oa_status),
    authorships: Array.isArray(work.authorships) && work.authorships.length > 0,
    grants: Array.isArray(work.grants) && work.grants.length > 0,
  }
}

export function buildCoverageReport(
  dois: string[],
  crossrefJson: Array<unknown | null>,
  openalexJson: Array<unknown | null>,
): CoverageReport {
  return dois.map((doi, index) => ({
    doi,
    crossref: coverageFromCrossref(crossrefJson[index]),
    openalex: coverageFromOpenAlex(openalexJson[index]),
  }))
}
