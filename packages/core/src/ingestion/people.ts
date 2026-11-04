import type { CollectionSlug, Payload } from 'payload'
import type { CrossrefAuthor } from './crossref'
import type { DblpAuthor } from './dblp'
import { diceCoefficient, type RorLookupEntry } from './match'
import { normalizeTitle } from './normalize'
import { resolveOrCreatePartnerOrg } from './organizations'
import type { OpenAlexAuthorship } from './openalex'
import type { ImportReport } from './report'
import { upsertByKey, type UpsertAction } from './upsert'

/**
 * Author identity matching, split into two safety tiers:
 *
 * 1. matchPersonToTeam — may auto-link to a real Team profile, so it only
 *    ever uses ORCID equality or exact full-name equality (against `name` or
 *    a curated Team.alternateNames spelling). Never fuzzy —
 *    match.ts's resolveByName fuzzy tier is documented as unsafe for people
 *    (homonym risk) and that risk is even higher here since a wrong match
 *    changes a real person's public site.
 * 2. dedupeCustomAuthor — lower stakes (never touches Team), so it can
 *    surface fuzzy suggestions, but those are NEVER auto-applied — only
 *    ORCID-equality dedup is applied automatically. Legacy path, still used
 *    by Grants/Awards (see below) — Publications no longer calls this.
 *
 * "Option A" (this file's newest addition, resolveOrCreateTeamMember) changes
 * what Publications ingestion does with every co-author, not the safety
 * tiers themselves: instead of falling back to a free-text `customAuthor`
 * entry on a miss, it now creates a real Team record (source: 'import',
 * displayInWebsite: false) so "People" means "everyone in the publication
 * graph." A fuzzy name hit against existing Team still NEVER auto-links —
 * it's surfaced via report.suggestDedupe for a human to merge later, exactly
 * like dedupeCustomAuthor's suggestion tier, it just no longer prevents a
 * new Team record from being created on that same miss.
 */

export interface TeamLookupEntry {
  id: string
  name: string
  /** Curated exact spellings from Team.alternateNames — matched exactly, like `name`. */
  alternateNames?: string[]
  orcid?: string
  dblpPid?: string
}

export interface MergedAuthor {
  fullName: string
  orcid?: string
  dblpPid?: string
  institutionName?: string
  institutionRor?: string
}

export interface PersonMatchResult {
  method: 'orcid' | 'dblp-pid' | 'name-exact' | 'none'
  team: TeamLookupEntry | null
}

export function matchPersonToTeam(
  person: MergedAuthor,
  team: TeamLookupEntry[],
): PersonMatchResult {
  if (person.orcid) {
    const byOrcid = team.find((member) => member.orcid && member.orcid === person.orcid)
    if (byOrcid) return { method: 'orcid', team: byOrcid }
  }

  if (person.dblpPid) {
    const byDblpPid = team.find((member) => member.dblpPid && member.dblpPid === person.dblpPid)
    if (byDblpPid) return { method: 'dblp-pid', team: byDblpPid }
  }

  const normalizedName = person.fullName.trim().toLowerCase()
  const nameMatches = team.filter((member) =>
    [member.name, ...(member.alternateNames ?? [])].some(
      (name) => name.trim().toLowerCase() === normalizedName,
    ),
  )
  if (nameMatches.length === 1) {
    return { method: 'name-exact', team: nameMatches[0] }
  }
  // Zero or ambiguous (>1) name matches both fall through to 'none' — never guess.
  return { method: 'none', team: null }
}

export interface CustomAuthorIndexEntry {
  name: string
  orcid?: string
  dblpPid?: string
  affiliationOrgId?: string
  sourceCollection: CollectionSlug
  sourceId: string
}

async function collectCustomEntries(
  payload: Payload,
  collection: CollectionSlug,
  arrayField: string,
  customField: string,
): Promise<CustomAuthorIndexEntry[]> {
  const { docs } = await payload.find({ collection, pagination: false, overrideAccess: true })
  const entries: CustomAuthorIndexEntry[] = []

  for (const doc of docs as unknown as Array<Record<string, unknown>>) {
    const rows = Array.isArray(doc[arrayField])
      ? (doc[arrayField] as Array<Record<string, unknown>>)
      : []

    for (const row of rows) {
      const custom = row[customField] as
        | {
            name?: string
            orcid?: string
            dblpPid?: string
            affiliation?: string | { id: string }
          }
        | undefined
      if (!custom?.name) continue

      entries.push({
        name: custom.name,
        orcid: custom.orcid || undefined,
        dblpPid: custom.dblpPid || undefined,
        affiliationOrgId:
          typeof custom.affiliation === 'string' ? custom.affiliation : custom.affiliation?.id,
        sourceCollection: collection,
        sourceId: doc.id as string,
      })
    }
  }

  return entries
}

/**
 * Loads every unmatched-to-Team author across Publications/Grants/Awards
 * once per run — no `join` field exists for a nested group, so this
 * paginates and flattens, same as hydrate-dial.ts's up-front org/team/theme
 * indexes.
 */
export async function buildCustomAuthorIndex(payload: Payload): Promise<CustomAuthorIndexEntry[]> {
  const [publications, grants, awards] = await Promise.all([
    collectCustomEntries(payload, 'publications', 'authors', 'customAuthor'),
    collectCustomEntries(payload, 'grants', 'investigators', 'customInvestigator'),
    collectCustomEntries(payload, 'awards', 'recipients', 'customRecipient'),
  ])

  return [...publications, ...grants, ...awards]
}

export interface CustomAuthorDedupResult {
  method: 'orcid-reuse' | 'dblp-pid-reuse' | 'suggestion' | 'none'
  entry: CustomAuthorIndexEntry | null
}

const FUZZY_NAME_THRESHOLD = 0.9

export function dedupeCustomAuthor(
  person: MergedAuthor,
  index: CustomAuthorIndexEntry[],
): CustomAuthorDedupResult {
  if (person.orcid) {
    const match = index.find((entry) => entry.orcid && entry.orcid === person.orcid)
    if (match) return { method: 'orcid-reuse', entry: match }
  }

  if (person.dblpPid) {
    const match = index.find((entry) => entry.dblpPid && entry.dblpPid === person.dblpPid)
    if (match) return { method: 'dblp-pid-reuse', entry: match }
  }

  const normalizedName = normalizeTitle(person.fullName)
  let best: CustomAuthorIndexEntry | null = null
  let bestScore = 0
  for (const entry of index) {
    const score = diceCoefficient(normalizedName, normalizeTitle(entry.name))
    if (score > bestScore) {
      bestScore = score
      best = entry
    }
  }
  if (best && bestScore >= FUZZY_NAME_THRESHOLD) {
    return { method: 'suggestion', entry: best } // never auto-applied — caller must surfaces via report.suggestDedupe
  }

  return { method: 'none', entry: null }
}

export interface TeamCreationIndexes {
  teamIndex: TeamLookupEntry[]
  orgIndex: RorLookupEntry[]
}

/**
 * Placeholder title for co-authors that only ever exist because ingestion
 * created them — nothing in Crossref/OpenAlex/DBLP carries a professional
 * title, and Team.title is a required field. Purely a schema-satisfying
 * default; a human editing the record afterward would replace it.
 */
const IMPORTED_TEAM_TITLE = 'External Collaborator'

/**
 * Naive first/last split on the last space; middleName only appears with 3+
 * tokens. Single-token names use the same token for both firstName and
 * lastName rather than an empty lastName — Team.lastName is required, so an
 * empty string would fail the collection's own field validation.
 */
function splitFullName(fullName: string): {
  firstName: string
  middleName?: string
  lastName: string
} {
  const tokens = fullName.trim().split(/\s+/).filter(Boolean)
  if (tokens.length <= 1) {
    const only = tokens[0] ?? fullName
    return { firstName: only, lastName: only }
  }
  if (tokens.length === 2) {
    return { firstName: tokens[0], lastName: tokens[1] }
  }
  return {
    firstName: tokens[0],
    middleName: tokens.slice(1, -1).join(' '),
    lastName: tokens[tokens.length - 1],
  }
}

/**
 * "Option A": on a matchPersonToTeam miss, create a real Team record instead
 * of the legacy free-text customAuthor entry (see this file's top comment).
 * A fuzzy name hit against existing Team is NEVER auto-linked — it only adds
 * a report.suggestDedupe entry alongside the newly created record, for a
 * human to merge later if the suggestion is a true positive.
 *
 * Only keys the write on ORCID/DBLP PID when present. With neither, a
 * name-based `where` would be unsafe here: matchPersonToTeam already ruled
 * out a *single* exact-name match, so reaching this point with no identifier
 * means either zero matches or an ambiguous (>1) one — using name as a find
 * key could silently land the update on an unrelated same-named record. No
 * safe identifier means always create.
 */
export async function resolveOrCreateTeamMember(
  payload: Payload,
  report: ImportReport,
  person: MergedAuthor,
  indexes: TeamCreationIndexes,
  sourceContext: string,
  dryRun: boolean,
): Promise<string | null> {
  const teamMatch = matchPersonToTeam(person, indexes.teamIndex)
  if (teamMatch.team) return teamMatch.team.id

  const normalizedName = normalizeTitle(person.fullName)
  let fuzzyMatch: TeamLookupEntry | null = null
  let bestScore = 0
  for (const member of indexes.teamIndex) {
    const score = diceCoefficient(normalizedName, normalizeTitle(member.name))
    if (score > bestScore) {
      bestScore = score
      fuzzyMatch = member
    }
  }
  const fuzzySuggestion = bestScore >= FUZZY_NAME_THRESHOLD ? fuzzyMatch : null

  let affiliationOrgId: string | undefined
  let affiliationLabel: string | undefined
  if (person.institutionName) {
    const orgId = await resolveOrCreatePartnerOrg(
      payload,
      report,
      { name: person.institutionName, ror: person.institutionRor },
      indexes.orgIndex,
      sourceContext,
      dryRun,
    )
    if (orgId) affiliationOrgId = orgId
    else affiliationLabel = person.institutionName
  }

  const { firstName, middleName, lastName } = splitFullName(person.fullName)
  const data: Record<string, unknown> = {
    name: person.fullName,
    firstName,
    middleName,
    lastName,
    title: IMPORTED_TEAM_TITLE,
    orcid: person.orcid,
    dblp_pid: person.dblpPid,
    affiliation: affiliationOrgId,
    affiliationLabel,
    role: 'external-collaborator',
    source: 'import',
    displayInWebsite: false,
  }

  let id: string | null
  let action: UpsertAction
  if (person.orcid || person.dblpPid) {
    const result = await upsertByKey({
      payload,
      collection: 'team',
      where: person.orcid
        ? { orcid: { equals: person.orcid } }
        : { dblp_pid: { equals: person.dblpPid! } },
      data,
      dryRun,
    })
    id = result.id
    action = result.action
  } else if (dryRun) {
    id = `DRY_RUN_PLACEHOLDER:team:${Math.random()}`
    action = 'skipped-dry-run'
  } else {
    const created = await payload.create({
      collection: 'team',
      data: data as any,
      overrideAccess: true,
      draft: undefined,
      context: { disableRevalidate: true },
    })
    id = (created as { id: string }).id
    action = 'created'
  }
  report.record('team', action, { id, data, sourceContext })

  if (!id) return null

  indexes.teamIndex.push({
    id,
    name: person.fullName,
    orcid: person.orcid,
    dblpPid: person.dblpPid,
  })

  if (fuzzySuggestion) {
    report.suggestDedupe({
      collection: 'team',
      field: 'name',
      sourceContext,
      value: `${person.fullName} (new id: ${id})`,
      suggestedMatch: `${fuzzySuggestion.name} (id: ${fuzzySuggestion.id})`,
      newTeamId: id,
      existingTeamId: fuzzySuggestion.id,
      score: bestScore,
    })
  }

  return id
}

/**
 * Merges Crossref's structured given/family authors with OpenAlex's
 * authorships by array position (both APIs preserve submission order).
 * Name spelling prefers Crossref (cleaner than OpenAlex's single
 * display_name); ORCID/institution enrichment prefers OpenAlex (Crossref's
 * author-level ORCID coverage is sparse in practice).
 */
export function mergeAuthors(
  crossrefAuthors: CrossrefAuthor[] | undefined,
  openalexAuthorships: OpenAlexAuthorship[] | undefined,
): MergedAuthor[] {
  const crossref = crossrefAuthors ?? []
  const openalex = openalexAuthorships ?? []
  const count = Math.max(crossref.length, openalex.length)
  const merged: MergedAuthor[] = []

  for (let i = 0; i < count; i++) {
    const cr = crossref[i]
    const oa = openalex[i]

    const crossrefName =
      cr && (cr.given || cr.family) ? [cr.given, cr.family].filter(Boolean).join(' ') : undefined
    const fullName = crossrefName ?? oa?.displayName
    if (!fullName) continue

    const institution = oa?.institutions[0]
    merged.push({
      fullName,
      orcid: cr?.orcid ?? oa?.orcid,
      institutionName: institution?.name,
      institutionRor: institution?.ror,
    })
  }

  return merged
}

const DBLP_NAME_MATCH_THRESHOLD = 0.85

/**
 * Attaches DBLP's already-disambiguated author pid to each merged author by
 * name similarity within the same paper's (small) author list — DBLP's own
 * author count/order can differ slightly from Crossref/OpenAlex (e.g.
 * middle-initial formatting), so position alone isn't reliable here the way
 * it is between Crossref and OpenAlex.
 */
export function attachDblpPids(merged: MergedAuthor[], dblpAuthors: DblpAuthor[]): MergedAuthor[] {
  if (dblpAuthors.length === 0) return merged

  return merged.map((person) => {
    const normalizedName = normalizeTitle(person.fullName)
    let best: DblpAuthor | null = null
    let bestScore = 0

    for (const author of dblpAuthors) {
      const score = diceCoefficient(normalizedName, normalizeTitle(author.name))
      if (score > bestScore) {
        bestScore = score
        best = author
      }
    }

    if (best && bestScore >= DBLP_NAME_MATCH_THRESHOLD) {
      return { ...person, dblpPid: best.pid }
    }
    return person
  })
}
