import type { PublicationType } from './crossref'
import { normalizeOrcid } from './normalize'

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
  orcid?: string
  displayName: string
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
    author?: { id?: string; orcid?: string; display_name?: string }
    institutions?: Array<{ display_name?: string; ror?: string; country_code?: string }>
  }>
  primary_location?: { source?: { id?: string; issn?: string[] } }
}

export function mapOpenAlexToPublicationFields(json: unknown): OpenAlexPublicationFields {
  const work = json as OpenAlexWork & { error?: unknown }
  if (!work || work.error) return {}

  const fields: OpenAlexPublicationFields = {}

  if (work.abstract_inverted_index) {
    fields.abstract = reconstructAbstract(work.abstract_inverted_index)
  }
  if (typeof work.id === 'string') {
    fields.openalex_id = work.id
  }
  if (typeof work.open_access?.is_oa === 'boolean') {
    fields.isOpenAccess = work.open_access.is_oa
  }
  if (typeof work.title === 'string') {
    fields.title = work.title
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
      orcid: normalizeOrcid(authorship.author?.orcid),
      displayName: authorship.author?.display_name ?? '',
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

  return fields
}
