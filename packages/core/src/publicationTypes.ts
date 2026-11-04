/**
 * Publication `type`: the options and their crosswalk to the standards.
 *
 * LabKit keeps its own stored values (`conference`, `journal`, …) and maps them
 * in code instead of storing a standard's slugs. Renaming stored values would
 * rewrite production rows and every `type ===` check for no visible gain, and no
 * single standard fits: CSL has no poster, DataCite has no workshop, ORCID has
 * sixty types. Add values freely; never rename one.
 *
 * - `csl`: CSL-JSON 1.0.2 `type`, for citation formatting and BibTeX/CSL export.
 * - `datacite`: DataCite 4.x `resourceTypeGeneral`.
 * - `orcid`: ORCID 3.0 work type.
 * - `schemaOrg`: the schema.org type used for JSON-LD.
 */
export const PUBLICATION_TYPES = [
  {
    value: 'conference',
    label: 'Conference',
    csl: 'paper-conference',
    datacite: 'ConferencePaper',
    orcid: 'conference-paper',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    value: 'journal',
    label: 'Journal',
    csl: 'article-journal',
    datacite: 'JournalArticle',
    orcid: 'journal-article',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    value: 'workshop',
    label: 'Workshop',
    csl: 'paper-conference',
    datacite: 'ConferencePaper',
    orcid: 'conference-paper',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    // CSL has no preprint type; its spec files preprints and working papers under `article`.
    value: 'preprint',
    label: 'Preprint',
    csl: 'article',
    datacite: 'Preprint',
    orcid: 'preprint',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    value: 'extended-abstract',
    label: 'Extended Abstract',
    csl: 'paper-conference',
    datacite: 'ConferencePaper',
    orcid: 'conference-abstract',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    // A published protocol paper (e.g. JMIR Research Protocols), not a trial
    // registration, so it maps as a journal article rather than DataCite's StudyRegistration.
    value: 'study-protocol',
    label: 'Study Protocol',
    csl: 'article-journal',
    datacite: 'JournalArticle',
    orcid: 'journal-article',
    schemaOrg: 'ScholarlyArticle',
  },
  {
    value: 'book-chapter',
    label: 'Book Chapter',
    csl: 'chapter',
    datacite: 'BookChapter',
    orcid: 'book-chapter',
    schemaOrg: 'Chapter',
  },
  {
    value: 'thesis',
    label: 'Thesis',
    csl: 'thesis',
    datacite: 'Dissertation',
    orcid: 'dissertation-thesis',
    schemaOrg: 'Thesis',
  },
  {
    value: 'book',
    label: 'Book',
    csl: 'book',
    datacite: 'Book',
    orcid: 'book',
    schemaOrg: 'Book',
  },
  {
    value: 'report',
    label: 'Report',
    csl: 'report',
    datacite: 'Report',
    orcid: 'report',
    schemaOrg: 'Report',
  },
  {
    // CSL's `speech` explicitly covers posters and talks. schema.org has no poster type.
    value: 'poster',
    label: 'Poster',
    csl: 'speech',
    datacite: 'Poster',
    orcid: 'conference-poster',
    schemaOrg: 'CreativeWork',
  },
  {
    value: 'presentation',
    label: 'Presentation',
    csl: 'speech',
    datacite: 'Presentation',
    orcid: 'lecture-speech',
    schemaOrg: 'PresentationDigitalDocument',
  },
  {
    value: 'dataset',
    label: 'Dataset',
    csl: 'dataset',
    datacite: 'Dataset',
    orcid: 'data-set',
    schemaOrg: 'Dataset',
  },
  {
    value: 'software',
    label: 'Software',
    csl: 'software',
    datacite: 'Software',
    orcid: 'software',
    schemaOrg: 'SoftwareSourceCode',
  },
  {
    value: 'other',
    label: 'Other',
    csl: 'document',
    datacite: 'Other',
    orcid: 'other',
    schemaOrg: 'CreativeWork',
  },
] as const

export type PublicationTypeValue = (typeof PUBLICATION_TYPES)[number]['value']

export type PublicationTypeCrosswalk = {
  csl: string
  datacite: string
  orcid: string
  schemaOrg: string
}

/** The admin select's options. */
export const PUBLICATION_TYPE_OPTIONS = PUBLICATION_TYPES.map(({ label, value }) => ({
  label,
  value,
}))

const OTHER = PUBLICATION_TYPES.find((t) => t.value === 'other')!

/**
 * The CSL, DataCite, ORCID and schema.org types for a Publication `type`. An
 * untyped or unknown value maps like `other`: ingestion leaves `type` empty when
 * it can't map a source's type, and guessing "article" there would be wrong for
 * the theses, datasets and reports that end up untyped.
 */
export function crosswalkPublicationType(
  type: string | null | undefined,
): PublicationTypeCrosswalk {
  const entry = PUBLICATION_TYPES.find((t) => t.value === type) ?? OTHER
  return {
    csl: entry.csl,
    datacite: entry.datacite,
    orcid: entry.orcid,
    schemaOrg: entry.schemaOrg,
  }
}
