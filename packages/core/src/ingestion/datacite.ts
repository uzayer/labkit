import type {
  CrossrefAuthor,
  PublicationStatus,
  PublicationType,
  VersionRelations,
} from './crossref'
import { cleanText, normalizeDoi, normalizeOrcid } from './normalize'
import { isPreprintServerDoi, mapDataciteType, type WorkTypeMapping } from './work-types'

/**
 * DataCite holds the DOIs Crossref doesn't: arXiv (10.48550), Zenodo,
 * figshare, OSF and many repositories. Read only after Crossref has no record
 * and doi.org names DataCite as the registration agency (publications.ts).
 */
export interface DatacitePublicationFields {
  title?: string
  year?: number
  type?: PublicationType
  typeMapping?: WorkTypeMapping
  status?: PublicationStatus
  abstract?: string
  publisher?: string
  venueName?: string
  /** Same shape as Crossref's: DataCite creators are the work's own author list, ORCIDs per work. */
  authors?: CrossrefAuthor[]
  relations?: VersionRelations
}

interface DataciteCreator {
  name?: string
  nameType?: string
  givenName?: string
  familyName?: string
  affiliation?: Array<string | { name?: string }>
  nameIdentifiers?: Array<{ nameIdentifier?: string; nameIdentifierScheme?: string }>
}

interface DataciteAttributes {
  doi?: string
  titles?: Array<{ title?: string; titleType?: string }>
  creators?: DataciteCreator[]
  publicationYear?: number | string
  publisher?: string | { name?: string }
  container?: { title?: string }
  types?: { resourceTypeGeneral?: string }
  descriptions?: Array<{ description?: string; descriptionType?: string }>
  relatedIdentifiers?: Array<{
    relationType?: string
    relatedIdentifier?: string
    relatedIdentifierType?: string
  }>
}

function mapCreator(creator: DataciteCreator): CrossrefAuthor | null {
  if (creator.nameType === 'Organizational') return null
  let { givenName: given, familyName: family } = creator
  if (!given && !family && creator.name) {
    // "Family, Given" is DataCite's convention for a personal name.
    const [last, first] = creator.name.split(/,\s*/, 2)
    family = last
    given = first
  }
  if (!given && !family) return null
  const orcid = creator.nameIdentifiers?.find(
    (id) => id.nameIdentifierScheme?.toUpperCase() === 'ORCID',
  )?.nameIdentifier
  const affiliation = creator.affiliation?.[0]
  return {
    given: given?.trim() || undefined,
    family: family?.trim() || undefined,
    orcid: normalizeOrcid(orcid),
    sequence: 'additional',
    affiliationName: typeof affiliation === 'string' ? affiliation : affiliation?.name,
  }
}

/**
 * The version relations DataCite asserts. `HasPreprint` names preprints of
 * this work. Pointing the other way, `IsPreprintOf` always, and `IsVersionOf`
 * only when this record is itself a preprint: arXiv files the journal DOI
 * that way, while for a Zenodo deposit `IsVersionOf` names its own concept
 * record.
 */
function versionRelations(attributes: DataciteAttributes, isPreprint: boolean): VersionRelations {
  const relations: VersionRelations = { publishedVersions: [], preprints: [] }
  for (const related of attributes.relatedIdentifiers ?? []) {
    if (related.relatedIdentifierType !== 'DOI' || !related.relatedIdentifier) continue
    const doi = normalizeDoi(related.relatedIdentifier)
    if (related.relationType === 'HasPreprint') relations.preprints.push(doi)
    if (
      related.relationType === 'IsPreprintOf' ||
      (isPreprint && related.relationType === 'IsVersionOf')
    ) {
      relations.publishedVersions.push(doi)
    }
  }
  return relations
}

export function mapDataciteToPublicationFields(json: unknown): DatacitePublicationFields {
  const attributes = (json as { data?: { attributes?: DataciteAttributes } } | null)?.data
    ?.attributes
  if (!attributes) return {}

  const fields: DatacitePublicationFields = {}

  const main = attributes.titles?.find((t) => !t.titleType && t.title)?.title
  const subtitle = attributes.titles?.find((t) => t.titleType === 'Subtitle')?.title
  if (main) {
    const title = cleanText(main)
    fields.title = subtitle ? `${title.replace(/[\s:]+$/, '')}: ${cleanText(subtitle)}` : title
  }
  const year = Number(attributes.publicationYear)
  if (Number.isInteger(year) && year > 0) fields.year = year

  const mapping = mapDataciteType(attributes.types?.resourceTypeGeneral)
  const isPreprint = mapping?.type === 'preprint' || isPreprintServerDoi(attributes.doi)
  if (mapping) {
    fields.type = mapping.type
    fields.typeMapping = mapping
  }
  if (isPreprint) fields.status = 'preprint'

  const abstract = attributes.descriptions?.find(
    (d) => d.descriptionType === 'Abstract' && d.description,
  )?.description
  if (abstract) fields.abstract = cleanText(abstract) || undefined

  const publisher =
    typeof attributes.publisher === 'string' ? attributes.publisher : attributes.publisher?.name
  if (publisher) fields.publisher = publisher
  // A repository (arXiv, Zenodo) is the venue when the record names no container.
  const venue = attributes.container?.title ?? publisher
  if (venue) fields.venueName = cleanText(venue)

  const authors = (attributes.creators ?? []).flatMap((creator) => {
    const author = mapCreator(creator)
    return author ? [author] : []
  })
  if (authors.length > 0) {
    authors[0].sequence = 'first'
    fields.authors = authors
  }

  const relations = versionRelations(attributes, isPreprint)
  if (relations.publishedVersions.length > 0 || relations.preprints.length > 0) {
    fields.relations = relations
  }

  return fields
}
