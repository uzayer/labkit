/**
 * Discovery metadata for a Lab's site: Google Scholar `citation_*` meta tags
 * and schema.org JSON-LD. Pure functions over Payload documents; nothing here
 * reads the database, so a site calls them with the records it already loaded.
 *
 * Google Scholar indexes Highwire-style `citation_*` meta tags, not JSON-LD
 * (https://scholar.google.com/intl/en/scholar/inclusion.html). JSON-LD serves
 * general search engines and link previews.
 */
import type { DataFromGlobalSlug } from 'payload'

import { crosswalkPublicationType } from '../publicationTypes'
import type { Organization, Publication, Team, Venue } from '../types'

type LabInfo = DataFromGlobalSlug<'lab-info'>

type Media = { url?: string | null }

export type MetaTag = { name: string; content: string }

export type JsonLd = Record<string, unknown>

type UrlOptions = {
  /**
   * The site's origin (e.g. `https://lab.example.org`). Relative media URLs are
   * made absolute against it; without it they are left out, because crawlers
   * need absolute URLs.
   */
  siteUrl?: string
}

// ─── Small helpers ──────────────────────────────────────────────────────────

function absolute(url: string | null | undefined, siteUrl?: string): string | undefined {
  if (!url) return undefined
  if (/^https?:\/\//i.test(url)) return url
  if (!siteUrl) return undefined
  return new URL(url, siteUrl).toString()
}

function mediaUrl(media: unknown, siteUrl?: string): string | undefined {
  return media && typeof media === 'object' ? absolute((media as Media).url, siteUrl) : undefined
}

function populated<T extends object>(value: unknown): T | undefined {
  return value && typeof value === 'object' ? (value as T) : undefined
}

/** Identifier stored bare or as a URL → its canonical URL. */
function idUrl(value: string | null | undefined, base: string): string | undefined {
  const id = value?.trim()
  if (!id) return undefined
  return /^https?:\/\//i.test(id) ? id : `${base}${id}`
}

/** Drops undefined, null, '' and empty arrays, so the JSON-LD carries only what is known. */
function compact(obj: JsonLd): JsonLd {
  return Object.fromEntries(
    Object.entries(obj).filter(
      ([, v]) => v !== undefined && v !== null && v !== '' && !(Array.isArray(v) && v.length === 0),
    ),
  )
}

function parseDate(iso: string | null | undefined): Date | undefined {
  if (!iso) return undefined
  const date = new Date(iso)
  return Number.isNaN(date.getTime()) ? undefined : date
}

function teamMemberName(member: Team): string {
  return (
    member.name || [member.firstName, member.middleName, member.lastName].filter(Boolean).join(' ')
  )
}

type ResolvedAuthor = {
  /** "Last, First Middle" when the parts are known, else the name as cited. */
  citationName: string
  displayName: string
  givenName?: string
  familyName?: string
  orcid?: string
}

/**
 * The Publication's authors in citation order. A Team Member author must be
 * populated (load the Publication with depth ≥ 1): an unpopulated ID would
 * silently drop an author, and a wrong author list is worse than none on Scholar.
 */
function resolveAuthors(pub: Publication): ResolvedAuthor[] {
  return (pub.authors ?? []).flatMap((author): ResolvedAuthor[] => {
    if (author.teamMember) {
      const member = populated<Team>(author.teamMember)
      if (!member) {
        throw new Error(
          `@labkit/core/seo: publication ${pub.id} has an unpopulated Team Member author; load it with depth >= 1.`,
        )
      }
      const given = [member.firstName, member.middleName].filter(Boolean).join(' ')
      return [
        {
          citationName:
            member.lastName && given ? `${member.lastName}, ${given}` : teamMemberName(member),
          displayName: teamMemberName(member),
          givenName: given || undefined,
          familyName: member.lastName || undefined,
          orcid: member.orcid ?? undefined,
        },
      ]
    }
    const name = author.customAuthor?.name?.trim()
    if (!name) return []
    return [
      { citationName: name, displayName: name, orcid: author.customAuthor?.orcid ?? undefined },
    ]
  })
}

function venueOf(pub: Publication): { name?: string; type?: Venue['type']; issn: string[] } {
  const venue = populated<Venue>(pub.venue)
  return {
    name: venue?.name || pub.venueLabel || undefined,
    type: venue?.type,
    issn: venue?.issn ?? [],
  }
}

function pdfUrl(pub: Publication, siteUrl?: string): string | undefined {
  if (pub.pdf?.type === 'link') return absolute(pub.pdf.link, siteUrl)
  if (pub.pdf?.type === 'upload') return mediaUrl(pub.pdf.upload, siteUrl)
  return undefined
}

// ─── Google Scholar ─────────────────────────────────────────────────────────

const JOURNAL_TYPES = new Set(['journal', 'study-protocol'])
const CONFERENCE_TYPES = new Set(['conference', 'workshop', 'extended-abstract'])

/**
 * Google Scholar `citation_*` meta tags for one Publication's own page, in the
 * order Scholar reads them. Put them only on that Publication's page: Scholar
 * treats every `citation_*` tag on a page as describing that page's paper.
 *
 * Per Scholar's inclusion guidelines:
 * - `citation_title`, one `citation_author` per author in author order, and
 *   `citation_publication_date` ("2010/5/12", or the year alone) are required.
 * - The venue tag depends on the kind of work: `citation_journal_title` (with
 *   volume, issue, pages, ISSN), `citation_conference_title`,
 *   `citation_dissertation_institution` or `citation_technical_report_institution`.
 *   Other types get no venue tag rather than a wrong one.
 * - `citation_pdf_url` only when the PDF is reachable at an absolute URL. Scholar
 *   indexes full text most reliably when the PDF is on the same site as the page.
 *
 * Authors that are Team Members must be populated (depth ≥ 1); the venue is used
 * when populated and falls back to `venueLabel`.
 */
export function publicationCitationMeta(pub: Publication, options: UrlOptions = {}): MetaTag[] {
  const tags: MetaTag[] = []
  const add = (name: string, content: string | number | null | undefined) => {
    const value = content === null || content === undefined ? '' : String(content).trim()
    if (value) tags.push({ name, content: value })
  }

  add('citation_title', pub.title)
  for (const author of resolveAuthors(pub)) add('citation_author', author.citationName)

  const date = parseDate(pub.publicationDate)
  add(
    'citation_publication_date',
    date ? `${date.getUTCFullYear()}/${date.getUTCMonth() + 1}/${date.getUTCDate()}` : pub.year,
  )

  const venue = venueOf(pub)
  const isJournal = pub.type ? JOURNAL_TYPES.has(pub.type) : venue.type === 'journal'
  const isConference = pub.type
    ? CONFERENCE_TYPES.has(pub.type)
    : venue.type === 'conference' || venue.type === 'workshop'

  if (isJournal) {
    add('citation_journal_title', venue.name)
    for (const issn of venue.issn) add('citation_issn', issn)
    add('citation_volume', pub.volume)
    add('citation_issue', pub.issue)
  } else if (isConference) {
    add('citation_conference_title', venue.name)
  } else if (pub.type === 'thesis') {
    add('citation_dissertation_institution', pub.publisher || venue.name)
  } else if (pub.type === 'report') {
    add('citation_technical_report_institution', pub.publisher || venue.name)
  }
  if (isJournal || isConference) {
    add('citation_firstpage', pub.pageStart)
    add('citation_lastpage', pub.pageEnd)
  }

  add('citation_doi', pub.doi)
  add('citation_pdf_url', pdfUrl(pub, options.siteUrl))
  return tags
}

/**
 * The same tags shaped for Next.js `Metadata.other`. Repeated names become
 * arrays, which Next renders as one meta tag per entry in order, so author
 * order survives.
 */
export function citationMetaToOther(tags: MetaTag[]): Record<string, string | string[]> {
  const out: Record<string, string | string[]> = {}
  for (const { name, content } of tags) {
    const existing = out[name]
    if (existing === undefined) out[name] = content
    else out[name] = Array.isArray(existing) ? [...existing, content] : [existing, content]
  }
  return out
}

// ─── schema.org JSON-LD ─────────────────────────────────────────────────────

const LICENSE_URLS: Record<string, string> = {
  'cc-by': 'https://creativecommons.org/licenses/by/4.0/',
  'cc-by-sa': 'https://creativecommons.org/licenses/by-sa/4.0/',
  'cc-by-nc': 'https://creativecommons.org/licenses/by-nc/4.0/',
  'cc-by-nc-sa': 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
  'cc-by-nd': 'https://creativecommons.org/licenses/by-nd/4.0/',
  'cc-by-nc-nd': 'https://creativecommons.org/licenses/by-nc-nd/4.0/',
  cc0: 'https://creativecommons.org/publicdomain/zero/1.0/',
}

function organizationJsonLd(
  org: Organization | undefined,
  label?: string | null,
): JsonLd | undefined {
  if (!org && !label) return undefined
  return compact({
    '@type': 'Organization',
    name: org?.name || label,
    url: org?.url,
    sameAs: idUrl(org?.ror_id, 'https://ror.org/'),
  })
}

/** schema.org JSON-LD for a Publication; `@type` comes from the type crosswalk. */
export function publicationJsonLd(
  pub: Publication,
  options: UrlOptions & { url?: string } = {},
): JsonLd {
  const venue = venueOf(pub)
  const date = parseDate(pub.publicationDate)
  const doiUrl = idUrl(pub.doi, 'https://doi.org/')
  const isJournal = pub.type ? JOURNAL_TYPES.has(pub.type) : venue.type === 'journal'

  return compact({
    '@context': 'https://schema.org',
    '@type': crosswalkPublicationType(pub.type).schemaOrg,
    name: pub.title,
    headline: pub.title,
    author: resolveAuthors(pub).map((a) =>
      compact({
        '@type': 'Person',
        name: a.displayName,
        givenName: a.givenName,
        familyName: a.familyName,
        sameAs: idUrl(a.orcid, 'https://orcid.org/'),
      }),
    ),
    datePublished: date ? date.toISOString().slice(0, 10) : pub.year ? String(pub.year) : undefined,
    abstract: pub.abstract,
    keywords: pub.keywords?.length ? pub.keywords.join(', ') : undefined,
    url: options.url,
    sameAs: doiUrl,
    identifier: pub.doi
      ? { '@type': 'PropertyValue', propertyID: 'DOI', value: pub.doi }
      : undefined,
    isPartOf:
      venue.name && isJournal
        ? compact({
            '@type': 'Periodical',
            name: venue.name,
            issn: venue.issn.length ? venue.issn : undefined,
          })
        : undefined,
    publisher: pub.publisher ? { '@type': 'Organization', name: pub.publisher } : undefined,
    isAccessibleForFree: pub.isOpenAccess ? true : undefined,
    license: pub.license ? LICENSE_URLS[pub.license] : undefined,
  })
}

/**
 * schema.org Person JSON-LD for a Team Member's page. The email is left out
 * unless `includeEmail` is set: machine-readable addresses get harvested, and
 * whether a person's email is public is the site's decision, not core's.
 */
export function personJsonLd(
  member: Team,
  options: UrlOptions & { url?: string; includeEmail?: boolean } = {},
): JsonLd {
  const affiliation = organizationJsonLd(
    populated<Organization>(member.affiliation),
    member.affiliationLabel,
  )
  return compact({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: teamMemberName(member),
    givenName: member.firstName,
    additionalName: member.middleName,
    familyName: member.lastName,
    jobTitle: member.title,
    image: mediaUrl(member.photo, options.siteUrl),
    email: options.includeEmail ? member.email : undefined,
    url: options.url,
    affiliation,
    identifier: member.orcid
      ? { '@type': 'PropertyValue', propertyID: 'ORCID', value: member.orcid }
      : undefined,
    sameAs: [
      idUrl(member.orcid, 'https://orcid.org/'),
      idUrl(member.openalex_id, 'https://openalex.org/'),
      idUrl(member.dblp_pid, 'https://dblp.org/pid/'),
      ...(member.socials ?? []).map((s) => s.url),
    ].filter(Boolean),
  })
}

/** schema.org ResearchOrganization JSON-LD for the Lab, from the LabInfo global. */
export function labJsonLd(lab: LabInfo, options: UrlOptions = {}): JsonLd {
  const founded = parseDate(lab.foundingDate)
  const address = compact({
    '@type': 'PostalAddress',
    streetAddress: lab.location?.address,
    addressLocality: lab.location?.city,
    addressCountry: lab.location?.country,
  })
  return compact({
    '@context': 'https://schema.org',
    '@type': 'ResearchOrganization',
    name: lab.name,
    alternateName: lab.shortName,
    description: lab.description,
    url: lab.url || options.siteUrl,
    logo: mediaUrl(lab.logo, options.siteUrl),
    email: lab.email,
    address: Object.keys(address).length > 1 ? address : undefined,
    parentOrganization: lab.parentOrganization?.name
      ? compact({
          '@type': 'Organization',
          name: lab.parentOrganization.name,
          url: lab.parentOrganization.url,
        })
      : undefined,
    foundingDate: founded ? String(founded.getUTCFullYear()) : undefined,
    sameAs: [
      idUrl(lab.identifiers?.ror_id, 'https://ror.org/'),
      idUrl(lab.identifiers?.wikidata_id, 'https://www.wikidata.org/wiki/'),
      idUrl(lab.identifiers?.openalex_id, 'https://openalex.org/'),
      ...(lab.socials ?? []).map((s) => s.url),
    ].filter(Boolean),
  })
}

/**
 * JSON for a `<script type="application/ld+json">` body. `<` is escaped so a
 * title or abstract containing `</script>` can't end the script element early.
 */
export function serializeJsonLd(data: JsonLd | JsonLd[]): string {
  return JSON.stringify(data).replace(/</g, '\\u003c')
}
