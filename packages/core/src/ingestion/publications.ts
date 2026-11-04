import type { Payload } from 'payload'
import {
  mapCrossrefToPublicationFields,
  type CrossrefPublicationFields,
  type VersionRelations,
} from './crossref'
import { mapDataciteToPublicationFields, type DatacitePublicationFields } from './datacite'
import { fetchDblpRecordByTitle } from './dblp'
import {
  fetchCrossrefByDoi,
  fetchDataciteByDoi,
  fetchOpenAlexByDoi,
  fetchRegistrationAgency,
} from './fetch'
import type { RorLookupEntry } from './match'
import { normalizeDoi, normalizeTitle, normalizeVenueName } from './normalize'
import { mapOpenAlexToPublicationFields, type OpenAlexPublicationFields } from './openalex'
import {
  attachDblpPids,
  mergeAuthors,
  resolveOrCreateTeamMember,
  type MergedAuthor,
  type TeamLookupEntry,
} from './people'
import type { ImportReport } from './report'
import { upsertByKey, type UpsertAction } from './upsert'
import {
  authorKeysOf,
  isPreprintEntry,
  planVersionLinks,
  titleMatches,
  type PublicationLookupEntry,
  type VersionEvidence,
} from './versions'
import { isArxivDoi, isPreprintServerDoi, mapBibtexType, type WorkTypeMapping } from './work-types'

/**
 * Tolerates a legacy bare-string `issn` value alongside the current
 * hasMany array shape in records imported before the schema was frozen.
 */
function normalizeIssn(raw: unknown): string[] | undefined {
  if (Array.isArray(raw)) return raw.length > 0 ? raw : undefined
  if (typeof raw === 'string' && raw) return [raw]
  return undefined
}

export interface VenueLookupEntry {
  id: string
  name: string
  alternateNames?: string[]
  issn?: string[]
  openalexSourceId?: string
}

export interface PublicationIndexes {
  teamIndex: TeamLookupEntry[]
  orgIndex: RorLookupEntry[]
  venueIndex: VenueLookupEntry[]
  /** The Lab's Publications, plus those written earlier in this run (versions.ts). */
  publicationIndex: PublicationLookupEntry[]
  /**
   * Version relations records assert about themselves, by Publication id:
   * unlinked Lab preprints' fetched once per index on first need
   * (loadPreprintRelations), and every work hydrated through this index.
   */
  knownRelations?: Map<string, VersionRelations>
}

function relationId(value: unknown): string | undefined {
  if (typeof value === 'string') return value
  const id = (value as { id?: unknown } | null | undefined)?.id
  return typeof id === 'string' ? id : undefined
}

export async function loadPublicationIndexes(payload: Payload): Promise<PublicationIndexes> {
  const [teamDocs, orgDocs, venueDocs, publicationDocs] = await Promise.all([
    payload.find({ collection: 'team', pagination: false, overrideAccess: true }),
    payload.find({ collection: 'organizations', pagination: false, overrideAccess: true }),
    payload.find({ collection: 'venues', pagination: false, overrideAccess: true }),
    payload.find({
      collection: 'publications',
      pagination: false,
      depth: 0,
      overrideAccess: true,
      select: {
        doi: true,
        title: true,
        year: true,
        type: true,
        status: true,
        versionOf: true,
        openalex_id: true,
        authors: true,
      },
    }),
  ])

  const teamIndex: TeamLookupEntry[] = teamDocs.docs.map((doc) => ({
    id: doc.id,
    name: doc.name ?? '',
    alternateNames: doc.alternateNames ?? undefined,
    orcid: doc.orcid ?? undefined,
    dblpPid: doc.dblp_pid ?? undefined,
  }))
  const teamNames = new Map(teamIndex.map((member) => [member.id, member.name]))

  return {
    teamIndex,
    publicationIndex: publicationDocs.docs.map((doc) => ({
      id: doc.id,
      doi: doc.doi ? normalizeDoi(doc.doi) : undefined,
      title: doc.title ?? '',
      year: doc.year ?? undefined,
      type: doc.type,
      status: doc.status,
      versionOf: relationId(doc.versionOf),
      openalexId: doc.openalex_id ?? undefined,
      authorKeys: authorKeysOf(
        (doc.authors ?? []).flatMap((author) => {
          const teamId = relationId(author.teamMember)
          const name = (teamId && teamNames.get(teamId)) || author.customAuthor?.name
          return name ? [name] : []
        }),
      ),
    })),
    orgIndex: orgDocs.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      rorId: doc.ror_id ?? undefined,
    })),
    venueIndex: venueDocs.docs.map((doc) => ({
      id: doc.id,
      name: doc.name,
      alternateNames: doc.alternateNames ?? undefined,
      // `issn` was widened from a single text field to hasMany — existing
      // Mongo docs written before that change still store a bare string, and
      // Payload doesn't migrate historical data on a schema change. Normalize
      // defensively rather than assume every doc already matches the array shape.
      issn: normalizeIssn(doc.issn),
      openalexSourceId: doc.openalex_id ?? undefined,
    })),
  }
}

export interface HydratePublicationResult {
  id: string
  action: UpsertAction
}

/**
 * "Option A": every merged co-author becomes a real Team record — an
 * existing match via resolveOrCreateTeamMember (ORCID/DBLP-PID/exact-name,
 * or a fuzzy hit that's only ever surfaced as a suggestion, never
 * auto-linked), or a freshly created one (source: 'import', displayInWebsite:
 * false). The legacy free-text `customAuthor` field is no longer written by
 * this path at all — see people.ts's top comment and resolveOrCreateTeamMember.
 */
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
    const teamId = await resolveOrCreateTeamMember(
      payload,
      report,
      person,
      indexes,
      sourceContext,
      dryRun,
    )
    if (teamId) {
      authors.push({ teamMember: teamId })
    }
  }

  return authors
}

function mergeIssn(a?: string[], b?: string[]): string[] | undefined {
  const merged = [...(a ?? []), ...(b ?? [])].filter(
    (value, index, all) => all.indexOf(value) === index,
  )
  return merged.length > 0 ? merged : undefined
}

export function matchVenueByName(name: string, venueIndex: VenueLookupEntry[]): string | undefined {
  const key = normalizeVenueName(name)
  if (!key) return undefined
  const ids = new Set<string>()
  for (const entry of venueIndex) {
    const names = [entry.name, ...(entry.alternateNames ?? [])]
    if (names.some((candidate) => normalizeVenueName(candidate) === key)) ids.add(entry.id)
  }
  return ids.size === 1 ? [...ids][0] : undefined
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

  // Curated name match: the Operator seeds recurring venues with their
  // per-year spellings as alternateNames (scripts/ingestion/seed-venues.ts).
  // Exact after normalizeVenueName, and only when exactly one venue matches —
  // never fuzzy. Runs before the auto-create gate so a seeded venue (with its
  // shortName) wins over a fresh per-edition record keyed to an OpenAlex ID.
  const curated = matchVenueByName(venue.name, venueIndex)
  if (curated) return { venue: curated }

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
    report.record('venues', action, {
      id,
      data: { name: venue.name, openalex_id: venue.openalexSourceId, issn: venue.issn },
      sourceContext,
    })
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

/** Everything the external sources say about one DOI. */
interface WorkSources {
  crossref: CrossrefPublicationFields
  openalex: OpenAlexPublicationFields
  datacite: DatacitePublicationFields
  found: { crossref: boolean; openalex: boolean; datacite: boolean }
}

/**
 * Crossref and OpenAlex, then DataCite when Crossref has no record and
 * doi.org says DataCite registered the DOI (arXiv, Zenodo, figshare). Before
 * this, those DOIs ended as failed-doi Review Items unless OpenAlex knew them.
 */
async function fetchWorkSources(doi: string): Promise<WorkSources> {
  const [crossrefJson, openalexJson] = await Promise.all([
    fetchCrossrefByDoi(doi),
    fetchOpenAlexByDoi(doi),
  ])
  const dataciteJson =
    !crossrefJson && (await fetchRegistrationAgency(doi))?.toLowerCase() === 'datacite'
      ? await fetchDataciteByDoi(doi)
      : null
  return {
    crossref: crossrefJson ? mapCrossrefToPublicationFields(crossrefJson) : {},
    openalex: openalexJson ? mapOpenAlexToPublicationFields(openalexJson) : {},
    datacite: dataciteJson ? mapDataciteToPublicationFields(dataciteJson) : {},
    found: {
      crossref: Boolean(crossrefJson),
      openalex: Boolean(openalexJson),
      datacite: Boolean(dataciteJson),
    },
  }
}

function versionRelationsOf(sources: WorkSources): VersionRelations {
  const both = [sources.crossref.relations, sources.datacite.relations]
  return {
    publishedVersions: [...new Set(both.flatMap((r) => r?.publishedVersions ?? []))],
    preprints: [...new Set(both.flatMap((r) => r?.preprints ?? []))],
  }
}

function evidenceOf(sources: WorkSources): VersionEvidence {
  return {
    relations: versionRelationsOf(sources),
    openalexId: sources.openalex.openalex_id,
    openalexWorkDois: sources.openalex.workDois,
  }
}

/**
 * The relations each unlinked Lab preprint asserts. Crossref usually records
 * `is-preprint-of` on the preprint alone, so a published version imported
 * after its preprint only finds the link here. One lookup per preprint per
 * index (a job batch, or a CLI run), and only once a non-preprint needs it.
 */
async function loadPreprintRelations(
  indexes: PublicationIndexes,
): Promise<Map<string, VersionRelations>> {
  indexes.knownRelations ??= new Map()
  for (const entry of indexes.publicationIndex) {
    if (!entry.doi || entry.versionOf || !isPreprintEntry(entry)) continue
    if (indexes.knownRelations.has(entry.id)) continue
    const crossrefJson = await fetchCrossrefByDoi(entry.doi)
    let relations = crossrefJson
      ? mapCrossrefToPublicationFields(crossrefJson).relations
      : undefined
    if (!crossrefJson && (await fetchRegistrationAgency(entry.doi))?.toLowerCase() === 'datacite') {
      const dataciteJson = await fetchDataciteByDoi(entry.doi)
      relations = dataciteJson ? mapDataciteToPublicationFields(dataciteJson).relations : undefined
    }
    indexes.knownRelations.set(entry.id, relations ?? { publishedVersions: [], preprints: [] })
  }
  return indexes.knownRelations
}

const isPlaceholder = (id: string) => id.startsWith('DRY_RUN_PLACEHOLDER')

/**
 * Sets `versionOf` on the preprint and hides it. Only ever called with
 * identifier evidence (versions.ts planVersionLinks). A Review Item records
 * every link: hiding a record is a visible change a person should see.
 */
async function applyVersionLink(
  payload: Payload,
  report: ImportReport,
  link: { preprint: PublicationLookupEntry; published: PublicationLookupEntry; evidence: string[] },
  sourceContext: string,
  dryRun: boolean,
  { alreadyWritten = false }: { alreadyWritten?: boolean } = {},
): Promise<void> {
  const { preprint, published } = link
  if (!alreadyWritten && !dryRun && !isPlaceholder(preprint.id) && !isPlaceholder(published.id)) {
    await payload.update({
      collection: 'publications',
      id: preprint.id,
      data: { versionOf: published.id, displayInWebsite: false },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }
  preprint.versionOf = published.id
  report.flagUnmatched({
    kind: 'preprint-link',
    collection: 'publications',
    field: 'versionOf',
    sourceContext,
    value: `${preprint.doi ?? preprint.title} is a preprint of ${published.doi ?? published.title} — preprint hidden`,
    data: {
      preprintId: preprint.id,
      preprintDoi: preprint.doi ?? null,
      publishedId: published.id,
      publishedDoi: published.doi ?? null,
      evidence: link.evidence,
      applied: !dryRun,
    },
  })
}

function reportAmbiguousVersions(
  report: ImportReport,
  preprint: PublicationLookupEntry,
  candidates: PublicationLookupEntry[],
  sourceContext: string,
) {
  report.flagUnmatched({
    kind: 'possible-duplicate',
    collection: 'publications',
    field: 'versionOf',
    sourceContext,
    value: `${preprint.doi ?? preprint.title} is linked by identifier to ${candidates.length} published versions — not linked`,
    data: {
      reason: 'several-published-versions',
      publicationId: preprint.id,
      candidates: candidates.map((c) => ({ id: c.id, doi: c.doi ?? null, title: c.title })),
    },
  })
}

/** Title-rule matches against the Lab's Publications: Review Items only (versions.ts). */
function reportTitleMatches(
  report: ImportReport,
  work: PublicationLookupEntry,
  index: PublicationLookupEntry[],
  sourceContext: string,
) {
  for (const { entry, reason } of titleMatches(work, index)) {
    report.flagUnmatched({
      kind: 'possible-duplicate',
      collection: 'publications',
      field: 'title',
      sourceContext,
      value:
        reason === 'preprint-title-match'
          ? `"${work.title}" shares its title with ${entry.doi ?? entry.id} — possibly a preprint and its published version; not linked`
          : `"${work.title}" may duplicate ${entry.doi ?? entry.id} (same title, year and an author)`,
      data: {
        reason,
        publicationId: work.id,
        publicationDoi: work.doi ?? null,
        matchId: entry.id,
        matchDoi: entry.doi ?? null,
      },
    })
  }
}

/**
 * A DOI that is already in the Lab is never re-imported, but it may now pair
 * with a version imported since. An unlinked preprint re-reads its sources
 * (cached on the CLI) for relations; a published record checks only what is
 * already in memory: a shared OpenAlex work and the relations Lab preprints
 * assert.
 */
async function linkExistingPublication(
  payload: Payload,
  report: ImportReport,
  existingId: string,
  doi: string,
  indexes: PublicationIndexes,
  dryRun: boolean,
  sourceContext: string,
): Promise<void> {
  const entry = indexes.publicationIndex.find((e) => e.id === existingId)
  if (!entry || entry.versionOf) return

  let plan
  if (isPreprintEntry(entry)) {
    const evidence = evidenceOf(await fetchWorkSources(doi))
    evidence.openalexId = entry.openalexId ?? evidence.openalexId
    plan = planVersionLinks(entry, evidence, indexes.publicationIndex)
  } else {
    const known = await loadPreprintRelations(indexes)
    plan = planVersionLinks(
      entry,
      { openalexId: entry.openalexId },
      indexes.publicationIndex,
      known,
    )
  }
  for (const link of plan.links) {
    await applyVersionLink(payload, report, link, sourceContext, dryRun)
  }
  if (plan.ambiguous.length > 0) {
    reportAmbiguousVersions(report, entry, plan.ambiguous, sourceContext)
  }
}

/**
 * Warms the fetch cache for a batch of DOIs — Crossref + OpenAlex (and
 * DataCite after a Crossref miss), then DBLP by the resolved title — with
 * bounded concurrency, so the sequential hydrate loop that follows reads from
 * memory.
 *
 * Hydration itself must stay sequential: it appends newly created people,
 * venues, and organizations to shared in-memory indexes, and two works
 * hydrating at once could each create the same co-author. Only the network is
 * parallel. A no-op unless `configureFetchCache` was called — without a cache
 * the prefetched responses would simply be discarded.
 */
export async function prefetchDoiSources(
  dois: string[],
  {
    concurrency = 4,
    onProgress,
  }: { concurrency?: number; onProgress?: (done: number) => void } = {},
): Promise<void> {
  const queue = [...new Set(dois.map(normalizeDoi))]
  let done = 0

  async function worker() {
    for (let doi = queue.shift(); doi !== undefined; doi = queue.shift()) {
      const { crossref, openalex, datacite } = await fetchWorkSources(doi)
      const title = crossref.title ?? datacite.title ?? openalex.title
      const year = crossref.year ?? datacite.year ?? openalex.year
      if (title && year) await fetchDblpRecordByTitle(title, year, doi)
      onProgress?.(++done)
    }
  }

  await Promise.all(Array.from({ length: Math.max(1, concurrency) }, worker))
}

/**
 * An ALL-CAPS title (some publishers deposit them) takes OpenAlex's spelling
 * when the two are the same title once normalized. Case is never computed:
 * title-casing breaks acronyms and non-English words.
 */
function restoreTitleCase(title: string | undefined, openalexTitle: string | undefined) {
  if (!title || !openalexTitle) return title ?? openalexTitle
  const allCaps = title === title.toUpperCase() && /\p{Lu}/u.test(title)
  const mixed = openalexTitle !== openalexTitle.toUpperCase()
  return allCaps && mixed && normalizeTitle(title) === normalizeTitle(openalexTitle)
    ? openalexTitle
    : title
}

function typeMappings(sources: WorkSources): WorkTypeMapping[] {
  return [
    sources.crossref.typeMapping,
    sources.datacite.typeMapping,
    sources.openalex.typeMapping,
  ].filter((m): m is WorkTypeMapping => Boolean(m))
}

/**
 * The first source type that maps (Crossref, then DataCite, then OpenAlex),
 * or else the first one given, which maps to `other`.
 */
function chooseType(sources: WorkSources): WorkTypeMapping | undefined {
  const mappings = typeMappings(sources)
  return mappings.find((m) => m.mapped) ?? mappings[0]
}

export async function hydratePublicationFromDoi(
  payload: Payload,
  report: ImportReport,
  doi: string,
  indexes: PublicationIndexes,
  dryRun: boolean,
  sourceContext: string,
  /** Set when this call imports an arXiv preprint's published version; stops the recursion. */
  { forPreprint }: { forPreprint?: string } = {},
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
    await linkExistingPublication(
      payload,
      report,
      existing.docs[0].id,
      normalizedDoi,
      indexes,
      dryRun,
      sourceContext,
    )
    return { id: existing.docs[0].id, action: 'skipped-existing' }
  }

  const sources = await fetchWorkSources(normalizedDoi)
  const { crossref: crossrefFields, openalex: openalexFields, datacite: dataciteFields } = sources

  if (!sources.found.crossref && !sources.found.openalex && !sources.found.datacite) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'doi',
      sourceContext,
      value: normalizedDoi,
    })
    return null
  }

  // DataCite stands in for Crossref only when Crossref has no record.
  const primary = sources.found.crossref ? crossrefFields : dataciteFields
  const title = restoreTitleCase(primary.title, openalexFields.title)
  const year = primary.year ?? openalexFields.year
  if (!title || !year) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'title',
      sourceContext,
      value: `neither Crossref nor OpenAlex returned a title/year for ${normalizedDoi}`,
    })
    return null
  }

  const evidence = evidenceOf(sources)

  // An arXiv preprint whose published version DataCite names: import the
  // published version first (if the Lab lacks it), so the paper is listed
  // under its published DOI and the arXiv record links to it as its preprint.
  if (isArxivDoi(normalizedDoi) && !forPreprint) {
    const publishedDoi = evidence.relations?.publishedVersions.find((d) => !isPreprintServerDoi(d))
    if (publishedDoi) {
      await hydratePublicationFromDoi(
        payload,
        report,
        publishedDoi,
        indexes,
        dryRun,
        `${sourceContext} (published version of ${normalizedDoi})`,
        { forPreprint: normalizedDoi },
      )
    }
  }

  const typeMapping = chooseType(sources)
  // A preprint server's DOI is a preprint whatever the source type says
  // (work-types.ts isPreprintServerDoi).
  const type = isPreprintServerDoi(normalizedDoi) ? 'preprint' : (typeMapping?.type ?? 'other')
  if (type !== 'preprint' && !typeMapping?.mapped) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'type',
      sourceContext,
      value: `unmapped work type (${typeMapping?.raw ?? 'none given'}) for ${normalizedDoi} — stored as other, needs manual type selection`,
    })
  }

  let merged = mergeAuthors(
    primary.authors,
    openalexFields.authorships,
    sources.found.crossref ? 'crossref' : 'datacite',
  )

  // DBLP enrichment is CS-venue only — a miss is the expected common case,
  // not an error, so no flagUnmatched call here (unlike the Crossref/OpenAlex
  // title/year check above).
  const dblpMatch = await fetchDblpRecordByTitle(title, year, normalizedDoi)
  if (dblpMatch) {
    merged = attachDblpPids(merged, dblpMatch.authors)
  }

  const authors = await resolveAuthors(payload, report, merged, indexes, sourceContext, dryRun)

  // minRows: 1 on Publications.authors — a zero-author list (source metadata
  // carried no authors at all, or every co-author failed to resolve) must
  // never reach a doomed payload.create/update call; it becomes a review
  // item instead.
  if (authors.length === 0) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'authors',
      sourceContext,
      value:
        merged.length === 0
          ? 'no authors in source metadata — publication not created'
          : 'all authors failed to resolve — publication not created',
    })
    return null
  }

  const venueFields = await resolveVenue(
    payload,
    report,
    {
      name: primary.venueName,
      // Merge both sources' ISSN arrays (deduped) — Crossref and OpenAlex
      // don't always agree on which print/electronic variant they surface.
      issn: mergeIssn(crossrefFields.issn, openalexFields.venueIssn),
      openalexSourceId: openalexFields.venueOpenAlexSourceId,
    },
    indexes.venueIndex,
    sourceContext,
    dryRun,
  )

  const status = type === 'preprint' ? 'preprint' : (primary.status ?? 'published')
  const work: PublicationLookupEntry = {
    id: '',
    doi: normalizedDoi,
    title,
    year,
    type,
    status,
    openalexId: openalexFields.openalex_id,
    authorKeys: authorKeysOf(merged.map((author) => author.fullName)),
  }
  const plan = planVersionLinks(
    work,
    evidence,
    indexes.publicationIndex,
    // A preprint needs no fetch: it carries its own relations, and only the
    // relations already known (works hydrated in this run) can add to them.
    isPreprintEntry(work) ? indexes.knownRelations : await loadPreprintRelations(indexes),
  )
  const publishedVersion = plan.links.find((link) => link.preprint === work)?.published
  // Publications.openalex_id is unique, and OpenAlex gives a preprint and its
  // published version one work id. The record already holding it keeps it.
  const openalexIdTaken = indexes.publicationIndex.some(
    (entry) => work.openalexId !== undefined && entry.openalexId === work.openalexId,
  )

  const data: Record<string, unknown> = {
    title,
    year,
    type,
    status,
    doi: normalizedDoi,
    // OpenAlex's inverted-index abstract reconstruction is frequently more
    // complete than Crossref's own `abstract` field — deliberate exception
    // to "Crossref wins on everything else." DataCite's is the last resort.
    abstract: openalexFields.abstract ?? crossrefFields.abstract ?? dataciteFields.abstract,
    volume: crossrefFields.volume,
    issue: crossrefFields.issue,
    pageStart: crossrefFields.pageStart,
    pageEnd: crossrefFields.pageEnd,
    publisher: primary.publisher,
    publicationDate: crossrefFields.publicationDate,
    openalex_id: openalexIdTaken ? undefined : openalexFields.openalex_id,
    isOpenAccess: openalexFields.isOpenAccess,
    ...(openalexFields.pdfUrl ? { pdf: { type: 'link', link: openalexFields.pdfUrl } } : {}),
    ...(publishedVersion ? { versionOf: publishedVersion.id, displayInWebsite: false } : {}),
    authors,
    ...venueFields,
    provenance: {
      source: sources.found.crossref
        ? 'crossref'
        : sources.found.datacite
          ? 'datacite'
          : 'openalex',
      importedAt: new Date().toISOString(),
      // Every source's raw type is kept so `other` (or any mapping) can be checked later.
      sourceNote: typeMapping
        ? `${sourceContext}\nSource type: ${typeMappings(sources)
            .map((m) => m.raw)
            .join('; ')}`
        : sourceContext,
    },
  }

  const { id, action } = await upsertByKey({
    payload,
    collection: 'publications',
    where: { doi: { equals: normalizedDoi } },
    data,
    dryRun,
  })
  report.record('publications', action, { id, data, sourceContext })
  if (!id) return null

  work.id = id
  if (openalexIdTaken) work.openalexId = undefined
  for (const link of plan.links) {
    await applyVersionLink(payload, report, link, sourceContext, dryRun, {
      alreadyWritten: link.preprint === work,
    })
  }
  if (plan.ambiguous.length > 0) {
    reportAmbiguousVersions(report, work, plan.ambiguous, sourceContext)
  }
  reportTitleMatches(report, work, indexes.publicationIndex, sourceContext)
  indexes.publicationIndex.push(work)
  // Kept for works hydrated later through this index, in either direction.
  indexes.knownRelations ??= new Map()
  indexes.knownRelations.set(
    work.id,
    evidence.relations ?? { publishedVersions: [], preprints: [] },
  )

  return { id, action }
}

export interface BibtexOnlyFields {
  title: string
  year: number
  authors: Array<{ fullName: string }>
  /** The BibTeX entry type (`article`, `inproceedings`…), mapped onto Publication `type`. */
  entryType?: string
  /** Crossref candidates a validated search found but didn't apply (crossref-search.ts), for the Review Item. */
  searchReview?: Record<string, unknown>
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

  // minRows: 1 on Publications.authors — never attempt a doomed write with a
  // zero-author list, whether the bibtex entry had no authors or every
  // co-author failed to resolve (see hydratePublicationFromDoi).
  if (authors.length === 0) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'authors',
      sourceContext,
      value:
        merged.length === 0
          ? 'no authors in source metadata — publication not created'
          : 'all authors failed to resolve — publication not created',
    })
    return null
  }

  const typeMapping = mapBibtexType(fields.entryType)
  if (typeMapping && !typeMapping.mapped) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'type',
      sourceContext,
      value: `unmapped work type (${typeMapping.raw}) — stored as other, needs manual type selection`,
    })
  }

  const data: Record<string, unknown> = {
    title: fields.title,
    year: fields.year,
    type: typeMapping?.type,
    status: typeMapping?.type === 'preprint' ? 'preprint' : 'published',
    authors,
    provenance: {
      source: 'bibtex',
      importedAt: new Date().toISOString(),
      sourceNote: typeMapping ? `${sourceContext}\nSource type: ${typeMapping.raw}` : sourceContext,
    },
  }

  const { id, action } = await upsertByKey({
    payload,
    collection: 'publications',
    where: { title: { equals: fields.title } },
    data,
    dryRun,
  })
  report.record('publications', action, { id, data, sourceContext })

  if (id) {
    // The exact-title check above only keeps re-runs idempotent. A record
    // from another Front Door can differ in case, punctuation or year by one;
    // the title rule flags those, and never merges them.
    const work: PublicationLookupEntry = {
      id,
      title: fields.title,
      year: fields.year,
      type: typeMapping?.type,
      status: data.status as string,
      authorKeys: authorKeysOf(fields.authors.map((author) => author.fullName)),
    }
    reportTitleMatches(report, work, indexes.publicationIndex, sourceContext)
    indexes.publicationIndex.push(work)
  }

  report.flagUnmatched({
    collection: 'publications',
    field: 'enrichment',
    sourceContext,
    value: fields.searchReview
      ? 'no validated Crossref match — bibtex-only; candidate DOIs in data, needs manual review'
      : 'no Crossref/OpenAlex match — bibtex-only, needs manual review',
    data: fields.searchReview,
  })

  return id ? { id, action } : null
}
