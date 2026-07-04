import type { CollectionSlug, Payload } from 'payload'
import type { CrossrefAuthor } from './crossref'
import type { DblpAuthor } from './dblp'
import { diceCoefficient } from './match'
import { normalizeTitle } from './normalize'
import type { OpenAlexAuthorship } from './openalex'

/**
 * Author identity matching, split into two safety tiers:
 *
 * 1. matchPersonToTeam — may auto-link to a real Team profile, so it only
 *    ever uses ORCID equality or exact full-name equality. Never fuzzy —
 *    match.ts's resolveByName fuzzy tier is documented as unsafe for people
 *    (homonym risk) and that risk is even higher here since a wrong match
 *    changes a real person's public site.
 * 2. dedupeCustomAuthor — lower stakes (never touches Team), so it can
 *    surface fuzzy suggestions, but those are NEVER auto-applied — only
 *    ORCID-equality dedup is applied automatically.
 */

export interface TeamLookupEntry {
  id: string
  name: string
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
  const nameMatches = team.filter((member) => member.name.trim().toLowerCase() === normalizedName)
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
