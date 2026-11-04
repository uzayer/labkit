import type { VersionRelations } from './crossref'
import { authorKey, normalizeTitle } from './normalize'
import { isPreprintServerDoi } from './work-types'

/**
 * Preprint ↔ published linking and duplicate detection across Front Doors.
 * Pure planning only; publications.ts applies the plans.
 *
 * Two tiers, as for people:
 * - Identifier evidence (a Crossref or DataCite version relation, or OpenAlex
 *   filing both DOIs under one work) links the preprint to its published
 *   version (`versionOf`) and hides the preprint. A Review Item still records
 *   every link so a person sees each automatic hide.
 * - A title match (Zotero's duplicate rule) never links, hides or merges. It
 *   only raises a Review Item.
 */

/** A Publication already in the Lab (or written earlier in this run). */
export interface PublicationLookupEntry {
  id: string
  doi?: string
  title: string
  year?: number
  type?: string | null
  status?: string | null
  versionOf?: string | null
  openalexId?: string
  /** authorKey() of each author, for the title rule. */
  authorKeys: string[]
}

/** What one work's own sources say about its other versions. */
export interface VersionEvidence {
  relations?: VersionRelations
  openalexId?: string
  /** Every DOI OpenAlex files under this work (openalex.ts `workDois`). */
  openalexWorkDois?: string[]
}

export function isPreprintEntry(entry: Pick<PublicationLookupEntry, 'type' | 'status' | 'doi'>) {
  return entry.type === 'preprint' || entry.status === 'preprint' || isPreprintServerDoi(entry.doi)
}

export function authorKeysOf(names: string[]): string[] {
  return [...new Set(names.flatMap((name) => authorKey(name) ?? []))]
}

export interface VersionLink {
  preprint: PublicationLookupEntry
  published: PublicationLookupEntry
  evidence: string[]
}

export interface VersionPlan {
  /** Links to apply. `work` is on one side of each. */
  links: VersionLink[]
  /** Several published versions claim this preprint: none is linked, a person picks. */
  ambiguous: PublicationLookupEntry[]
}

/**
 * The identifier links between `work` and records in `index`. `known` holds
 * the relations other records assert about themselves: Crossref usually
 * records `is-preprint-of` on the preprint only, so a published version
 * imported after its preprint finds the link there and nowhere else (and a
 * preprint imported after a published version that lists it, likewise).
 */
export function planVersionLinks(
  work: PublicationLookupEntry,
  evidence: VersionEvidence,
  index: PublicationLookupEntry[],
  known: Map<string, VersionRelations> = new Map(),
): VersionPlan {
  const workIsPreprint = isPreprintEntry(work)
  const published: VersionLink[] = []
  const preprints: VersionLink[] = []

  for (const other of index) {
    if (other.id === work.id) continue
    const otherIsPreprint = isPreprintEntry(other)
    const theirs = known.get(other.id)
    // Directed: the relation itself says which side is the preprint. Both
    // sides must still be typed that way: only a preprint is ever hidden, and
    // the published side must not itself be a preprint (Zenodo files a
    // deposit as IsVersionOf its own concept record).
    const workIsPreprintOf: string[] = []
    const otherIsPreprintOf: string[] = []
    if (other.doi && evidence.relations?.publishedVersions.includes(other.doi)) {
      workIsPreprintOf.push('relation: is preprint of')
    }
    if (work.doi && theirs?.preprints.includes(work.doi)) {
      workIsPreprintOf.push('relation: has preprint')
    }
    if (other.doi && evidence.relations?.preprints.includes(other.doi)) {
      otherIsPreprintOf.push('relation: has preprint')
    }
    if (work.doi && theirs?.publishedVersions.includes(work.doi)) {
      otherIsPreprintOf.push('relation: is preprint of')
    }
    // Undirected: OpenAlex merged both DOIs into one work. Its location
    // version labels are unreliable, so the record types decide the direction.
    const sameWork =
      (evidence.openalexId !== undefined && other.openalexId === evidence.openalexId) ||
      (other.doi !== undefined && Boolean(evidence.openalexWorkDois?.includes(other.doi)))
    if (sameWork && workIsPreprint && !otherIsPreprint) workIsPreprintOf.push('openalex: same work')
    if (sameWork && otherIsPreprint && !workIsPreprint)
      otherIsPreprintOf.push('openalex: same work')

    if (workIsPreprintOf.length > 0 && workIsPreprint && !otherIsPreprint) {
      published.push({ preprint: work, published: other, evidence: workIsPreprintOf })
    }
    if (otherIsPreprintOf.length > 0 && otherIsPreprint && !workIsPreprint && !other.versionOf) {
      preprints.push({ preprint: other, published: work, evidence: otherIsPreprintOf })
    }
  }

  const links = [...preprints]
  let ambiguous: PublicationLookupEntry[] = []
  if (!work.versionOf && published.length === 1) links.push(published[0])
  if (!work.versionOf && published.length > 1) ambiguous = published.map((link) => link.published)
  return { links, ambiguous }
}

export type TitleMatchReason = 'title-match' | 'preprint-title-match'

/**
 * normalizeTitle, minus the " (Preprint)" JMIR Preprints appends to every
 * preprint title. Without this, no JMIR preprint ever matches its published
 * version on title.
 */
function comparableTitle(title: string): string {
  return normalizeTitle(title.replace(/\s*\(preprint\)\s*$/i, ''))
}

/**
 * Zotero's duplicate rule (its duplicates.js): same normalized title, years at most one apart, and,
 * when both list authors, at least one shared family name and first initial.
 * Different DOIs veto the match, except between a preprint and a non-preprint,
 * which is the shape a preprint and its published version take.
 */
export function titleMatches(
  work: PublicationLookupEntry,
  index: PublicationLookupEntry[],
): Array<{ entry: PublicationLookupEntry; reason: TitleMatchReason }> {
  const title = comparableTitle(work.title)
  if (!title) return []
  return index.flatMap(
    (other): Array<{ entry: PublicationLookupEntry; reason: TitleMatchReason }> => {
      if (other.id === work.id || other.versionOf === work.id || work.versionOf === other.id)
        return []
      if (comparableTitle(other.title) !== title) return []
      if (
        work.year !== undefined &&
        other.year !== undefined &&
        Math.abs(work.year - other.year) > 1
      ) {
        return []
      }
      if (
        work.authorKeys.length > 0 &&
        other.authorKeys.length > 0 &&
        !work.authorKeys.some((key) => other.authorKeys.includes(key))
      ) {
        return []
      }
      if (work.doi && other.doi) {
        if (work.doi === other.doi) return []
        if (isPreprintEntry(work) === isPreprintEntry(other)) return []
        return [{ entry: other, reason: 'preprint-title-match' }]
      }
      return [{ entry: other, reason: 'title-match' }]
    },
  )
}
