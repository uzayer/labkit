import { PUBLICATION_TYPES, type PublicationTypeValue } from '../publicationTypes'

/**
 * Maps each source's work type onto a Publication `type`.
 *
 * Nothing is dropped any more: a type with no counterpart becomes `other`,
 * `mapped` is false so the caller raises an unmapped-type Review Item, and
 * `raw` goes into provenance. The tables only cover types a Lab's output
 * plausibly has. A wrong guess changes which admin fields show, so anything
 * unclear stays `other` for a person to pick.
 */
export interface WorkTypeMapping {
  type: PublicationTypeValue
  mapped: boolean
  /** "source: type", recorded in provenance. */
  raw: string
}

function lookup(
  source: string,
  table: Record<string, PublicationTypeValue>,
  raw: string | undefined,
): WorkTypeMapping | undefined {
  if (!raw) return undefined
  // Own keys only: a source type like `constructor` must not find Object's.
  const key = raw.toLowerCase()
  const type = Object.hasOwn(table, key) ? table[key] : undefined
  return { type: type ?? 'other', mapped: Boolean(type), raw: `${source}: ${raw}` }
}

// https://api.crossref.org/types
const CROSSREF: Record<string, PublicationTypeValue> = {
  'journal-article': 'journal',
  'proceedings-article': 'conference',
  'posted-content': 'preprint',
  'book-chapter': 'book-chapter',
  'book-section': 'book-chapter',
  'book-part': 'book-chapter',
  'reference-entry': 'book-chapter',
  book: 'book',
  monograph: 'book',
  'edited-book': 'book',
  'reference-book': 'book',
  'book-set': 'book',
  // A whole proceedings volume, not a paper in one.
  proceedings: 'book',
  dissertation: 'thesis',
  report: 'report',
  'report-component': 'report',
  'report-series': 'report',
  dataset: 'dataset',
  database: 'dataset',
}

// Crossref posted-content subtypes. A working paper is a report, not a preprint.
const CROSSREF_POSTED: Record<string, PublicationTypeValue> = {
  preprint: 'preprint',
  'working-paper': 'report',
  working_paper: 'report',
  dissertation: 'thesis',
  report: 'report',
}

export function mapCrossrefType(
  type: string | undefined,
  subtype?: string,
): WorkTypeMapping | undefined {
  if (
    type === 'posted-content' &&
    subtype &&
    Object.hasOwn(CROSSREF_POSTED, subtype.toLowerCase())
  ) {
    return lookup('crossref', CROSSREF_POSTED, subtype)
  }
  return lookup('crossref', CROSSREF, type)
}

// https://docs.openalex.org/api-entities/works/work-object#type
const OPENALEX: Record<string, PublicationTypeValue> = {
  article: 'journal',
  // OpenAlex types a review article as `review`; it is still a journal article.
  review: 'journal',
  letter: 'journal',
  editorial: 'journal',
  'conference-paper': 'conference',
  preprint: 'preprint',
  'book-chapter': 'book-chapter',
  'reference-entry': 'book-chapter',
  book: 'book',
  dissertation: 'thesis',
  report: 'report',
  dataset: 'dataset',
  software: 'software',
}

export function mapOpenAlexType(type: string | undefined): WorkTypeMapping | undefined {
  return lookup('openalex', OPENALEX, type)
}

/**
 * DataCite `resourceTypeGeneral`, inverted from the crosswalk in
 * publicationTypes.ts (the first type listing it wins, so ConferencePaper
 * is `conference`, not `workshop`). `Text` and `Other` say nothing and stay
 * unmapped: arXiv files every paper as Text.
 */
const DATACITE: Record<string, PublicationTypeValue> = {}
for (const entry of PUBLICATION_TYPES) {
  const key = entry.datacite.toLowerCase()
  if (entry.value !== 'other' && !Object.hasOwn(DATACITE, key)) DATACITE[key] = entry.value
}

export function mapDataciteType(
  resourceTypeGeneral: string | undefined,
): WorkTypeMapping | undefined {
  return lookup('datacite', DATACITE, resourceTypeGeneral)
}

// BibTeX and biblatex entry types.
const BIBTEX: Record<string, PublicationTypeValue> = {
  article: 'journal',
  inproceedings: 'conference',
  conference: 'conference',
  incollection: 'book-chapter',
  inbook: 'book-chapter',
  book: 'book',
  proceedings: 'book',
  phdthesis: 'thesis',
  mastersthesis: 'thesis',
  thesis: 'thesis',
  techreport: 'report',
  report: 'report',
  dataset: 'dataset',
  software: 'software',
}

export function mapBibtexType(entryType: string | undefined): WorkTypeMapping | undefined {
  return lookup('bibtex', BIBTEX, entryType)
}

// DOI prefixes that only ever name preprints. SSRN deposits its preprints in
// Crossref as journal-article ("SSRN Electronic Journal") and arXiv's DataCite
// records say Text, so neither source's type alone would call them preprints.
const PREPRINT_DOI = [/^10\.48550\/arxiv\./i, /^10\.2139\/ssrn\./i, /^10\.2196\/preprints\./i]

export function isPreprintServerDoi(doi: string | null | undefined): boolean {
  return Boolean(doi) && PREPRINT_DOI.some((pattern) => pattern.test(doi!))
}

export function isArxivDoi(doi: string | null | undefined): boolean {
  return Boolean(doi) && /^10\.48550\/arxiv\./i.test(doi!)
}
