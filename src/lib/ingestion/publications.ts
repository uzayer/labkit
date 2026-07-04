import type { Payload } from 'payload'
import { mapCrossrefToPublicationFields } from './crossref'
import { fetchDblpRecordByTitle } from './dblp'
import { fetchCrossrefByDoi, fetchOpenAlexByDoi } from './fetch'
import type { RorLookupEntry } from './match'
import { normalizeDoi } from './normalize'
import { mapOpenAlexToPublicationFields } from './openalex'
import {
  attachDblpPids,
  buildCustomAuthorIndex,
  dedupeCustomAuthor,
  matchPersonToTeam,
  mergeAuthors,
  type CustomAuthorIndexEntry,
  type MergedAuthor,
  type TeamLookupEntry,
} from './people'
import { resolveOrCreatePartnerOrg } from './organizations'
import type { ImportReport } from './report'
import { upsertByKey, type UpsertAction } from './upsert'

/**
 * Tolerates a legacy bare-string `issn` value alongside the current
 * hasMany array shape — Payload doesn't migrate existing Mongo documents
 * when a field's `hasMany` flag changes.
 */
function normalizeIssn(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.length > 0 ? raw : undefined
  if (typeof raw === 'string' && raw) return [raw]
  return undefined
}

export interface VenueLookupEntry {
  id: string
  name: string
  issn?: string[]
  openalexSourceId?: string
}

export interface PublicationIndexes {
  teamIndex: TeamLookupEntry[]
  orgIndex: RorLookupEntry[]
  venueIndex: VenueLookupEntry[]
  /** Mutated in place as new customAuthor entries are written, so later
   *  publications in the SAME run dedupe against them too. */
  customAuthorIndex: CustomAuthorIndexEntry[]
}

export async function loadPublicationIndexes(payload: Payload): Promise<PublicationIndexes> {
  const [teamDocs, orgDocs, venueDocs, customAuthorIndex] = await Promise.all([
    payload.find({ collection: 'team', pagination: false, overrideAccess: true }),
    payload.find({ collection: 'organizations', pagination: false, overrideAccess: true }),
    payload.find({ collection: 'venues', pagination: false, overrideAccess: true }),
    buildCustomAuthorIndex(payload),
  ])

  return {
    teamIndex: teamDocs.docs.map((doc) => ({
      id: doc.id,
      name: doc.name ?? '',
      orcid: doc.orcid ?? undefined,
      dblpPid: doc.dblp_pid ?? undefined,
    })),
    orgIndex: orgDocs.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      rorId: doc.ror_id ?? undefined,
    })),
    venueIndex: venueDocs.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      // `issn` was widened from a single text field to hasMany — existing
      // Mongo docs written before that change still store a bare string, and
      // Payload doesn't migrate historical data on a schema change. Normalize
      // defensively rather than assume every doc already matches the array shape.
      issn: normalizeIssn(doc.issn),
      openalexSourceId: doc.openalex_id ?? undefined,
    })),
    customAuthorIndex,
  }
}

export interface HydratePublicationResult {
  id: string
  action: UpsertAction
}

async function resolveAuthors(
  payload: Payload,
  report: ImportReport,
  merged: MergedAuthor[],
  indexes: PublicationIndexes,
  sourceContext: string,
  dryRun: boolean,
): Promise<Array<Record<string, unknown>>> {
  const authors: Array<Record<string, unknown>> = []

  for (const person of merged) {
    const teamMatch = matchPersonToTeam(person, indexes.teamIndex)
    if (teamMatch.team) {
      authors.push({ teamMember: teamMatch.team.id })
      continue
    }

    const dedupe = dedupeCustomAuthor(person, indexes.customAuthorIndex)
    if ((dedupe.method === 'orcid-reuse' || dedupe.method === 'dblp-pid-reuse') && dedupe.entry) {
      authors.push({
        customAuthor: {
          name: dedupe.entry.name,
          orcid: dedupe.entry.orcid,
          dblpPid: dedupe.entry.dblpPid,
          affiliation: dedupe.entry.affiliationOrgId,
        },
      })
      continue
    }

    if (dedupe.method === 'suggestion' && dedupe.entry) {
      // Never auto-applied — still write a fresh entry from this paper's own
      // data below, just surface the possible match for human review.
      report.suggestDedupe({
        collection: 'publications',
        field: 'authors.customAuthor',
        sourceContext,
        value: person.fullName,
        suggestedMatch: dedupe.entry.name,
      })
    }

    let affiliationOrgId: string | null = null
    if (person.institutionName) {
      affiliationOrgId = await resolveOrCreatePartnerOrg(
        payload,
        report,
        { name: person.institutionName, ror: person.institutionRor },
        indexes.orgIndex,
        sourceContext,
        dryRun,
      )
    }

    indexes.customAuthorIndex.push({
      name: person.fullName,
      orcid: person.orcid,
      dblpPid: person.dblpPid,
      affiliationOrgId: affiliationOrgId ?? undefined,
      sourceCollection: 'publications',
      sourceId: sourceContext, // no Publication id exists yet — sourceContext is the best identifier available at write time
    })

    authors.push({
      customAuthor: {
        name: person.fullName,
        orcid: person.orcid,
        dblpPid: person.dblpPid,
        affiliation: affiliationOrgId ?? undefined,
      },
    })
  }

  return authors
}

function mergeIssn(a?: string[], b?: string[]): string[] | undefined {
  const merged = [...(a ?? []), ...(b ?? [])].filter(
    (value, index, all) => all.indexOf(value) === index,
  )
  return merged.length > 0 ? merged : undefined
}

async function resolveVenue(
  payload: Payload,
  report: ImportReport,
  venue: { name?: string; issn?: string[]; openalexSourceId?: string },
  venueIndex: VenueLookupEntry[],
  sourceContext: string,
  dryRun: boolean,
): Promise<{ venue?: string; venueLabel?: string }> {
  if (!venue.name) return {}

  if (venue.openalexSourceId) {
    const existing = venueIndex.find((entry) => entry.openalexSourceId === venue.openalexSourceId)
    if (existing) return { venue: existing.id }
  }
  if (venue.issn && venue.issn.length > 0) {
    // Any overlap counts — print/electronic ISSN pairs for the same venue
    // don't always appear in the same order across different API calls.
    const existing = venueIndex.find((entry) =>
      entry.issn?.some((existingIssn) => venue.issn?.includes(existingIssn)),
    )
    if (existing) return { venue: existing.id }
  }

  // Safe-identifier gate, same posture as Organizations: only auto-create
  // when OpenAlex gives a Source ID or ISSN to key on. A bare container-title
  // string is exactly the "guess from a name" risk avoided for Organizations.
  if (venue.openalexSourceId || (venue.issn && venue.issn.length > 0)) {
    const { id, action } = await upsertByKey({
      payload,
      collection: 'venues',
      where: venue.openalexSourceId
        ? { openalex_id: { equals: venue.openalexSourceId } }
        : { issn: { in: venue.issn! } },
      data: {
        name: venue.name,
        openalex_id: venue.openalexSourceId,
        // Persist every ISSN variant this call saw (not just the first) so a
        // later import using a different print/electronic variant still matches.
        issn: venue.issn,
      },
      dryRun,
    })
    report.record('venues', action)
    if (id) {
      venueIndex.push({
        id,
        name: venue.name,
        issn: venue.issn,
        openalexSourceId: venue.openalexSourceId,
      })
      return { venue: id }
    }
  }

  report.flagUnmatched({
    collection: 'venues',
    field: 'name',
    sourceContext,
    value: venue.name,
  })
  return { venueLabel: venue.name }
}

export async function hydratePublicationFromDoi(
  payload: Payload,
  report: ImportReport,
  doi: string,
  indexes: PublicationIndexes,
  dryRun: boolean,
  sourceContext: string,
): Promise<HydratePublicationResult | null> {
  const normalizedDoi = normalizeDoi(doi)

  // Existence check BEFORE any network call — protects human edits on
  // re-import (decision: never overwrite an existing Publication) and saves
  // Crossref/OpenAlex rate-limit budget on repeat runs.
  const existing = await payload.find({
    collection: 'publications',
    where: { doi: { equals: normalizedDoi } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    report.record('publications', 'skipped-existing')
    return { id: existing.docs[0].id, action: 'skipped-existing' }
  }

  const [crossrefJson, openalexJson] = await Promise.all([
    fetchCrossrefByDoi(normalizedDoi),
    fetchOpenAlexByDoi(normalizedDoi),
  ])

  if (!crossrefJson && !openalexJson) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'doi',
      sourceContext,
      value: normalizedDoi,
    })
    return null
  }

  const crossrefFields = crossrefJson ? mapCrossrefToPublicationFields(crossrefJson) : {}
  const openalexFields = openalexJson ? mapOpenAlexToPublicationFields(openalexJson) : {}

  const title = crossrefFields.title ?? openalexFields.title
  const year = crossrefFields.year ?? openalexFields.year
  if (!title || !year) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'title',
      sourceContext,
      value: `neither Crossref nor OpenAlex returned a title/year for ${normalizedDoi}`,
    })
    return null
  }

  const type = crossrefFields.type ?? openalexFields.type
  if (!type) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'type',
      sourceContext,
      value: `unmapped work type for ${normalizedDoi} — needs manual type selection`,
    })
  }

  let merged = mergeAuthors(crossrefFields.authors, openalexFields.authorships)

  // DBLP enrichment is CS-venue only — a miss is the expected common case,
  // not an error, so no flagUnmatched call here (unlike the Crossref/OpenAlex
  // title/year check above).
  const dblpMatch = await fetchDblpRecordByTitle(title, year)
  if (dblpMatch) {
    merged = attachDblpPids(merged, dblpMatch.authors)
  }

  const authors = await resolveAuthors(payload, report, merged, indexes, sourceContext, dryRun)

  const venueFields = await resolveVenue(
    payload,
    report,
    {
      name: crossrefFields.venueName,
      // Merge both sources' ISSN arrays (deduped) — Crossref and OpenAlex
      // don't always agree on which print/electronic variant they surface.
      issn: mergeIssn(crossrefFields.issn, openalexFields.venueIssn),
      openalexSourceId: openalexFields.venueOpenAlexSourceId,
    },
    indexes.venueIndex,
    sourceContext,
    dryRun,
  )

  const data: Record<string, unknown> = {
    title,
    year,
    type,
    status: crossrefFields.status ?? 'published',
    doi: normalizedDoi,
    // OpenAlex's inverted-index abstract reconstruction is frequently more
    // complete than Crossref's own `abstract` field — deliberate exception
    // to "Crossref wins on everything else."
    abstract: openalexFields.abstract ?? crossrefFields.abstract,
    volume: crossrefFields.volume,
    issue: crossrefFields.issue,
    pageStart: crossrefFields.pageStart,
    pageEnd: crossrefFields.pageEnd,
    publisher: crossrefFields.publisher,
    publicationDate: crossrefFields.publicationDate,
    openalex_id: openalexFields.openalex_id,
    isOpenAccess: openalexFields.isOpenAccess,
    authors,
    ...venueFields,
    provenance: {
      source: crossrefJson ? 'crossref' : 'openalex',
      importedAt: new Date().toISOString(),
      sourceNote: sourceContext,
    },
  }

  const { id, action } = await upsertByKey({
    payload,
    collection: 'publications',
    where: { doi: { equals: normalizedDoi } },
    data,
    dryRun,
  })
  report.record('publications', action)

  return id ? { id, action } : null
}

export interface BibtexOnlyFields {
  title: string
  year: number
  authors: Array<{ fullName: string }>
}

/**
 * Sibling to hydratePublicationFromDoi for BibTeX entries with no DOI and no
 * Crossref title match — no Crossref/OpenAlex enrichment is possible, so
 * this always self-flags as low-confidence via the caller's report call.
 */
export async function hydratePublicationFromFields(
  payload: Payload,
  report: ImportReport,
  fields: BibtexOnlyFields,
  indexes: PublicationIndexes,
  dryRun: boolean,
  sourceContext: string,
): Promise<HydratePublicationResult | null> {
  // Same "never overwrite an existing Publication" policy as
  // hydratePublicationFromDoi — just keyed by title since there's no DOI.
  const existing = await payload.find({
    collection: 'publications',
    where: { title: { equals: fields.title } },
    limit: 1,
    overrideAccess: true,
  })
  if (existing.docs.length > 0) {
    report.record('publications', 'skipped-existing')
    return { id: existing.docs[0].id, action: 'skipped-existing' }
  }

  const merged: MergedAuthor[] = fields.authors.map((author) => ({ fullName: author.fullName }))
  const authors = await resolveAuthors(payload, report, merged, indexes, sourceContext, dryRun)

  const data: Record<string, unknown> = {
    title: fields.title,
    year: fields.year,
    status: 'published',
    authors,
    provenance: {
      source: 'bibtex',
      importedAt: new Date().toISOString(),
      sourceNote: sourceContext,
    },
  }

  const { id, action } = await upsertByKey({
    payload,
    collection: 'publications',
    where: { title: { equals: fields.title } },
    data,
    dryRun,
  })
  report.record('publications', action)

  report.flagUnmatched({
    collection: 'publications',
    field: 'enrichment',
    sourceContext,
    value: 'no Crossref/OpenAlex match — bibtex-only, needs manual review',
  })

  return id ? { id, action } : null
}
