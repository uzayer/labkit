/**
 * Generated citations: ACM Reference Format, APA, and BibTeX, formatted by
 * citation-js (citeproc-js underneath) from the Publication record's own
 * fields. Nothing here is written by hand, and nothing needs a network call,
 * so a paper without a DOI is cited exactly like one with.
 *
 * ACM leads because it is where DIAL publishes most (CHI, CHI EA, COMPASS,
 * ICTD, UbiComp, MobileHCI, JCSS) and what its readers paste into their own
 * papers. Server-only: citeproc is heavy and none of it should reach the
 * browser, which only ever receives the formatted strings.
 */
import 'server-only'

import { Cite, plugins, type CSL, type CSLName } from '@citation-js/core'
import '@citation-js/plugin-csl'
import '@citation-js/plugin-bibtex'

import { ACM_CSL } from '@/lib/dial/csl/acm'

export const CITATION_STYLES = [
  { value: 'acm', label: 'ACM' },
  { value: 'apa', label: 'APA' },
  { value: 'bibtex', label: 'BibTeX' },
] as const

export type CitationStyle = (typeof CITATION_STYLES)[number]['value']
export type Citations = Record<CitationStyle, string>

const cslConfig = plugins.config.get('@csl')
if (!cslConfig.styles.has('acm')) cslConfig.styles.add('acm', ACM_CSL)

// UTF-8 rather than LaTeX escapes: `Women’s`, not `Women\textquoteright{}s`.
// LaTeX has read UTF-8 input by default since 2018, and biber always has.
plugins.config.get('@bibtex').format.asciiOnly = false

/** A person as the record knows them: structured when it is a Team Member. */
export type CitationAuthor = { given: string; family: string } | { name: string }

export interface CitationInput {
  id: string
  /**
   * The BibTeX key, when the caller has disambiguated it across the corpus
   * (`baseCitationKey` plus a suffix). Otherwise the base key is used.
   */
  key?: string
  title: string
  authors: CitationAuthor[]
  /** LabKit's publication type, falling back to the Venue's. */
  type?: string | null
  /** The venue's full name: the journal, or the proceedings. */
  container?: string | null
  /** The venue's acronym, e.g. "CHI EA": ACM prints "(CHI EA ’26)" after it. */
  containerShort?: string | null
  year: number
  /** ISO date, when the day or month is known. */
  date?: string | null
  volume?: string | null
  issue?: string | null
  pageStart?: string | null
  pageEnd?: string | null
  publisher?: string | null
  location?: string | null
  doi?: string | null
  url?: string | null
  /** The record's status, when it is not simply published. */
  status?: string | null
}

const CSL_TYPES: Record<string, CSL['type']> = {
  conference: 'paper-conference',
  workshop: 'paper-conference',
  'extended-abstract': 'paper-conference',
  journal: 'article-journal',
  'study-protocol': 'article-journal',
  'book-chapter': 'chapter',
  'book-series': 'chapter',
  preprint: 'article',
}

const STATUS_NOTES: Record<string, string> = {
  'accepted-in-press': 'in press',
  submitted: 'submitted',
}

/**
 * A free-text name to CSL. "Family, Given" is taken at its word; otherwise the
 * last word is the family name — right for the Bangladeshi and English names
 * in DIAL's corpus, and the same rule the BibTeX importer's round trip uses.
 * Team Members never come through here: their record has the parts.
 */
function nameToCSL(author: CitationAuthor): CSLName {
  if ('given' in author) return author
  const name = author.name.trim()
  if (name.includes(',')) {
    const [family, given] = name.split(',', 2).map((part) => part.trim())
    return { family, given }
  }
  const parts = name.split(/\s+/)
  if (parts.length === 1) return { literal: name }
  return {
    family: parts[parts.length - 1],
    given: parts.slice(0, -1).join(' '),
  }
}

function issued(year: number, date?: string | null): CSL['issued'] {
  const match = date?.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (match && Number(match[1]) === year) {
    return { 'date-parts': [[year, Number(match[2]), Number(match[3])]] }
  }
  return { 'date-parts': [[year]] }
}

function monthOnly(date: CSL['issued']): CSL['issued'] {
  const [parts] = date?.['date-parts'] ?? []
  if (parts?.length !== 3) return date
  return { 'date-parts': [[parts[0], parts[1]]] }
}

/**
 * "amreen2026google": first author's family name, year, first title word that
 * says something. Two papers can share one; `key` on the input settles that.
 */
export function baseCitationKey(input: Pick<CitationInput, 'title' | 'year' | 'authors'>): string {
  const author = input.authors[0] ? nameToCSL(input.authors[0]) : undefined
  const family = (author?.family ?? author?.literal ?? 'unknown').normalize('NFKD')
  const word = input.title
    .normalize('NFKD')
    .split(/\s+/)
    .map((w) => w.replace(/[^a-z]/gi, ''))
    .find((w) => w.length > 3 && !/^(the|with|from|this|that|into|towards?)$/i.test(w))
  return `${family.replace(/[^a-z]/gi, '')}${input.year}${word ?? ''}`.toLowerCase()
}

/**
 * ACM names itself three ways across the imported records; its own reference
 * format says "ACM, New York, NY, USA".
 */
function publisherOf(publisher?: string | null): { name?: string; place?: string } {
  if (!publisher) return {}
  if (/^(ACM|Association for Computing Machinery)\b/.test(publisher)) {
    return { name: 'ACM', place: 'New York, NY, USA' }
  }
  return { name: publisher }
}

export function toCSL(input: CitationInput): CSL {
  const author = input.authors.map(nameToCSL)
  const publisher = publisherOf(input.publisher)
  // With no venue there are no proceedings to be "in": a conference-paper
  // style then prints the year twice around an empty container. A generic
  // document cites as author, year, title — what the record actually knows.
  const type = input.container ? (CSL_TYPES[input.type ?? ''] ?? 'paper-conference') : 'document'
  const page =
    input.pageStart && input.pageEnd && input.pageEnd !== input.pageStart
      ? `${input.pageStart}–${input.pageEnd}`
      : (input.pageStart ?? undefined)

  return {
    id: input.id,
    type,
    'citation-key': input.key ?? baseCitationKey(input),
    title: input.title,
    author,
    'container-title': input.container ?? undefined,
    issued: issued(input.year, input.date),
    volume: input.volume ?? undefined,
    issue: input.issue ?? undefined,
    page,
    // "CHI EA ’26", the way a proceedings is named in its own front matter.
    'collection-title':
      type === 'paper-conference' && input.containerShort
        ? `${input.containerShort} ’${String(input.year).slice(-2)}`
        : undefined,
    publisher: publisher.name,
    'publisher-place': publisher.place,
    'event-place': type === 'paper-conference' ? (input.location ?? undefined) : undefined,
    DOI: input.doi ?? undefined,
    URL: input.doi ? undefined : (input.url ?? undefined),
    status: input.status ? STATUS_NOTES[input.status] : undefined,
  }
}

// ─── BibTeX tidy-up ──────────────────────────────────────────────────────────
// citation-js's BibTeX is correct but reads like a machine wrote it: every
// capitalised word braced, fields alphabetical, numeric months, and `organization`
// where a reader expects `publisher`. This
// rewrites it into what the ACM Digital Library exports, which is what DIAL's
// readers are used to pasting.

/** The order a person reads an entry in: who, what, where, when, then IDs. */
const FIELD_ORDER = [
  'author',
  'title',
  'booktitle',
  'journal',
  'series',
  'editor',
  'volume',
  'number',
  'pages',
  'year',
  'month',
  'publisher',
  'address',
  'doi',
  'url',
  'note',
]

const MONTHS = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec']

/**
 * `{Google} {Maps}` → `Google Maps`. A brace around an ordinary capitalised
 * word only stops a style from lowercasing it; the ACM and IEEE styles never
 * do. Acronyms and odd casing (`{CHI}`, `{HerCare}`, `{iPhone}`) keep theirs,
 * because those are the words a sentence-case style would actually break.
 */
function unbraceWords(value: string): string {
  // Only inside the value's own delimiters: `{Autism}` is the whole field.
  const inner = value.match(/^\{([\s\S]*)\}$/)
  if (!inner) return value
  return `{${inner[1].replace(/\{([A-Z][a-z]*)\}/g, '$1')}}`
}

export function tidyBibTeX(raw: string): string {
  const lines = raw.trim().split('\n')
  const head = lines[0]
  const fields = new Map<string, string>()
  for (const line of lines.slice(1, -1)) {
    const match = line.match(/^\s*([\w-]+)\s*=\s*(.*?),?$/)
    if (match) fields.set(match[1], match[2])
  }

  for (const [name, value] of fields) {
    let next = value
    if (name === 'title' || name === 'booktitle' || name === 'journal' || name === 'series') {
      next = unbraceWords(next)
    }
    // UTF-8 output leaves LaTeX's own specials bare, and a bare `&` in
    // "IEEE Security & Privacy" stops the reader's paper compiling. A DOI or
    // URL is read verbatim, so it keeps its underscores.
    if (name !== 'doi' && name !== 'url') next = next.replace(/(?<!\\)([&%#$_])/g, '\\$1')
    // A page range is `--` in BibTeX; UTF-8 output hands back the en dash.
    if (name === 'pages') next = next.replace(/\s*[–—-]+\s*/g, '--')
    fields.set(name, next)
  }

  // citation-js files an inproceedings publisher as `organization`.
  const organization = fields.get('organization')
  if (organization && !fields.has('publisher')) {
    fields.set('publisher', organization)
    fields.delete('organization')
  }

  // `month = {7}` → `month = jul`: the bare macro every style knows.
  const month = fields.get('month')?.match(/^\{(\d{1,2})\}$/)
  if (month) fields.set('month', MONTHS[Number(month[1]) - 1] ?? fields.get('month')!)

  const rank = (name: string) => {
    const i = FIELD_ORDER.indexOf(name)
    return i === -1 ? FIELD_ORDER.length : i
  }
  const names = [...fields.keys()].sort((a, b) => rank(a) - rank(b))
  const width = Math.max(...names.map((name) => name.length))

  return [head, ...names.map((name) => `  ${name.padEnd(width)} = ${fields.get(name)},`), '}'].join(
    '\n',
  )
}

/** Formatted strings are a pure function of the input, so keep them per process. */
const memo = new Map<string, Citations>()

export function formatCitations(input: CitationInput): Citations {
  const key = JSON.stringify(input)
  const hit = memo.get(key)
  if (hit) return hit

  const csl = toCSL(input)
  const cite = new Cite(csl)
  const bibliography = (source: Cite, style: string) =>
    String(source.format('bibliography', { format: 'text', style, lang: 'en-US' }))
      .trim()
      // ACM numbers its reference list; one reference copied alone should not
      // arrive as "[1]".
      .replace(/^\[\d+\]\s*/, '')

  const citations: Citations = {
    acm: bibliography(cite, 'acm'),
    // APA has no place for a proceedings acronym; it would print "CHI EA ’26"
    // as if it were a series.
    apa: bibliography(new Cite({ ...csl, 'collection-title': undefined }), 'apa'),
    // BibTeX has no day: a full date comes out as `month = {apr 13}`.
    bibtex: tidyBibTeX(
      String(
        new Cite({ ...csl, issued: monthOnly(csl.issued) }).format('bibtex', { format: 'text' }),
      ),
    ),
  }
  memo.set(key, citations)
  return citations
}
