import type { PublicationType } from './crossref'
import { cleanText, normalizeOrcid } from './normalize'

// OpenAlex work types with no equivalent Publications.type value are left
// unmapped, same policy as CROSSREF_TYPE_MAP in crossref.ts.
const OPENALEX_TYPE_MAP: Record<string, PublicationType> = {
  article: 'journal',
  preprint: 'preprint',
  'book-chapter': 'book-chapter',
}

function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
  const positions: Array<[number, string]> = []
  for (const [word, indices] of Object.entries(invertedIndex)) {
    for (const index of indices) {
      positions.push([index, word])
    }
  }
  positions.sort((a, b) => a[0] - b[0])
  return positions.map(([, word]) => word).join(' ')
}

export interface OpenAlexInstitution {
  name: string
  ror?: string
  countryCode?: string
}

export interface OpenAlexAuthorship {
  authorId?: string
  /** The ORCID asserted on this work (`raw_orcid`), never the clustered profile's. */
  orcid?: string
  displayName: string
  /** The name as printed on this work, before OpenAlex's disambiguation. */
  rawAuthorName?: string
  position: 'first' | 'middle' | 'last'
  institutions: OpenAlexInstitution[]
}

export interface OpenAlexPublicationFields {
  abstract?: string
  openalex_id?: string
  isOpenAccess?: boolean
  title?: string
  year?: number
  type?: PublicationType
  authorships?: OpenAlexAuthorship[]
  venueOpenAlexSourceId?: string
  venueIssn?: string[]
  /** Direct link to a full-text PDF, when OpenAlex knows an open copy. */
  pdfUrl?: string
}

interface OpenAlexWork {
  id?: string
  title?: string
  publication_year?: number
  type?: string
  abstract_inverted_index?: Record<string, number[]>
  open_access?: { is_oa?: boolean }
  authorships?: Array<{
    author_position?: 'first' | 'middle' | 'last'
    raw_author_name?: string | null
    raw_orcid?: string | null
    author?: { id?: string; orcid?: string; display_name?: string }
    institutions?: Array<{ display_name?: string; ror?: string; country_code?: string }>
  }>
  primary_location?: {
    is_oa?: boolean
    pdf_url?: string | null
    source?: { id?: string; issn?: string[] }
  }
  best_oa_location?: { pdf_url?: string | null } | null
}

export function mapOpenAlexToPublicationFields(json: unknown): OpenAlexPublicationFields {
  const work = json as OpenAlexWork & { error?: unknown }
  if (!work || work.error) return {}

  const fields: OpenAlexPublicationFields = {}

  if (work.abstract_inverted_index) {
    fields.abstract = cleanText(reconstructAbstract(work.abstract_inverted_index)) || undefined
  }
  if (typeof work.id === 'string') {
    fields.openalex_id = work.id
  }
  if (typeof work.open_access?.is_oa === 'boolean') {
    fields.isOpenAccess = work.open_access.is_oa
  }
  if (typeof work.title === 'string') {
    fields.title = cleanText(work.title) || undefined
  }
  if (typeof work.publication_year === 'number') {
    fields.year = work.publication_year
  }
  if (typeof work.type === 'string') {
    const mapped = OPENALEX_TYPE_MAP[work.type]
    if (mapped) fields.type = mapped
  }
  if (Array.isArray(work.authorships)) {
    fields.authorships = work.authorships.map((authorship) => ({
      authorId: authorship.author?.id,
      // `author.orcid` belongs to the disambiguated *profile* this authorship
      // was clustered into, not to the work. One mis-clustered profile stamps
      // its ORCID on every paper in the cluster: in DIAL's import that put
      // Anik Saha's ORCID on a co-author and spread to 17 papers. Only the
      // ORCID asserted on this work (`raw_orcid`) is identity evidence.
      orcid: normalizeOrcid(authorship.raw_orcid),
      displayName: authorship.author?.display_name ?? '',
      rawAuthorName: authorship.raw_author_name ?? undefined,
      position: authorship.author_position ?? 'middle',
      institutions: (authorship.institutions ?? []).flatMap((institution) =>
        institution.display_name
          ? [
              {
                name: institution.display_name,
                ror: institution.ror,
                countryCode: institution.country_code,
              },
            ]
          : [],
      ),
    }))
  }
  if (typeof work.primary_location?.source?.id === 'string') {
    fields.venueOpenAlexSourceId = work.primary_location.source.id
  }
  if (Array.isArray(work.primary_location?.source?.issn)) {
    const issn = work.primary_location.source.issn.filter(
      (value): value is string => typeof value === 'string',
    )
    if (issn.length > 0) fields.venueIssn = issn
  }
  // best_oa_location is OpenAlex's pick of the most open copy. The primary
  // location's PDF is only a fallback when that location is itself open —
  // otherwise it is usually a paywalled publisher URL that 403s for readers.
  const pdfUrl =
    work.best_oa_location?.pdf_url ||
    (work.primary_location?.is_oa ? work.primary_location.pdf_url : undefined)
  if (typeof pdfUrl === 'string' && /^https?:\/\//i.test(pdfUrl)) fields.pdfUrl = pdfUrl

  return fields
}
