import { defaultHeaders, fetchJsonWithRetry } from './fetch'
import { normalizeDoi } from './normalize'

export interface OrcidWork {
  title: string
  /** The work's own DOI, normalized. */
  doi?: string
  /** Further `self` DOIs the work lists (a preprint and its published version grouped as one work). */
  otherDois: string[]
  arxiv?: string
  pmid?: string
  isbn: string[]
  year?: number
  sourceName: string
}

interface OrcidExternalId {
  'external-id-type'?: string
  'external-id-value'?: string
  'external-id-relationship'?: string
}

interface OrcidWorkSummary {
  title?: { title?: { value?: string } }
  source?: { 'source-name'?: { value?: string } }
  'publication-date'?: { year?: { value?: string } }
  'external-ids'?: { 'external-id'?: OrcidExternalId[] }
}

interface OrcidWorkGroup {
  'external-ids'?: { 'external-id'?: OrcidExternalId[] }
  'work-summary'?: OrcidWorkSummary[]
}

// arXiv DOIs (10.48550/arXiv.2208.08907) are DataCite's wrapper around an arXiv id.
const ARXIV_DOI = /^10\.48550\/arxiv\.(.+)$/i

/**
 * Reads one ORCID work group. A group is ORCID's merge of several sources'
 * records for one work, so identifiers are read from the group and from every
 * summary in it, not just the first.
 *
 * Only `self` identifiers describe the work. `version-of` points at another
 * version (Zenodo lists every deposit version this way) and `part-of` at the
 * container (a chapter's book), so taking the first DOI regardless of
 * relationship staged a dataset's old version, or a book, as the work.
 */
export function parseOrcidWorkGroup(group: OrcidWorkGroup): OrcidWork | null {
  const summaries = group['work-summary'] ?? []
  // The first summary is the one ORCID displays (the preferred source).
  const preferred = summaries[0]
  const title = preferred?.title?.title?.value?.trim()
  const sourceName = preferred?.source?.['source-name']?.value?.trim()
  if (!title || !sourceName) return null

  // Preferred summary first, so a published DOI it lists outranks a preprint
  // or arXiv DOI the group also carries.
  const ids = [
    ...summaries.flatMap((summary) => summary['external-ids']?.['external-id'] ?? []),
    ...(group['external-ids']?.['external-id'] ?? []),
  ].filter((id) => id['external-id-relationship'] === 'self')
  const values = (type: string) =>
    ids.flatMap((id) => {
      const value = id['external-id-value']?.trim()
      return id['external-id-type'] === type && value ? [value] : []
    })

  const dois = [...new Set(values('doi').map(normalizeDoi))]
  const arxivFromDoi = dois.map((doi) => ARXIV_DOI.exec(doi)?.[1]).find(Boolean)
  const nonArxiv = dois.filter((doi) => !ARXIV_DOI.test(doi))
  // An arXiv DOI is the work's DOI only when it has no other.
  const ordered =
    nonArxiv.length > 0 ? [...nonArxiv, ...dois.filter((d) => ARXIV_DOI.test(d))] : dois

  const arxiv = values('arxiv')[0]?.replace(/^arxiv:/i, '') ?? arxivFromDoi
  const yearValue = preferred['publication-date']?.year?.value
  const year = yearValue ? Number.parseInt(yearValue, 10) : undefined

  return {
    title,
    doi: ordered[0],
    otherDois: ordered.slice(1),
    arxiv: arxiv?.toLowerCase(),
    pmid: values('pmid')[0],
    isbn: [...new Set(values('isbn').map((isbn) => isbn.replace(/[\s-]/g, '')))],
    year: Number.isFinite(year) ? year : undefined,
    sourceName,
  }
}

/** ORCID couldn't be reached or refused the request, as opposed to a record with no works. */
export class OrcidUnavailableError extends Error {
  constructor(orcidId: string) {
    super(`ORCID works for ${orcidId} could not be fetched`)
    this.name = 'OrcidUnavailableError'
  }
}

export async function fetchOrcidWorks(orcidId: string): Promise<OrcidWork[]> {
  const json = await fetchJsonWithRetry(
    `https://pub.orcid.org/v3.0/${encodeURIComponent(orcidId)}/works`,
    { headers: defaultHeaders({ Accept: 'application/json' }) },
    // A full works list for a long career is slow to build server-side. Not
    // cached: the list is what the Lab just edited on ORCID, and a week-old
    // copy would hide the change.
    { timeoutMs: 30_000, cache: false },
  )
  // Throw rather than return []: an empty list reads as "this person has no
  // works" and would produce an empty run instead of an error.
  if (json === null) throw new OrcidUnavailableError(orcidId)

  const groups = (json as { group?: OrcidWorkGroup[] }).group ?? []
  return groups.flatMap((group) => {
    const work = parseOrcidWorkGroup(group)
    return work ? [work] : []
  })
}
