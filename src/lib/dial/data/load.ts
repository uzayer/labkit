import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import type {
  Award as PayloadAward,
  Grant as PayloadGrant,
  LabInfo as PayloadLabInfo,
  Media,
  News as PayloadNews,
  Organization as PayloadOrganization,
  Project as PayloadProject,
  Publication as PayloadPublication,
  ResearchTheme as PayloadResearchTheme,
  Team as PayloadTeam,
  Venue as PayloadVenue,
} from '@/payload-types'

import { blobBaseUrl } from '@/config/blob'

import { DIAL_PROSE } from './lab-info'
import type {
  Award,
  Grant,
  LabInfo,
  News,
  Organization,
  PersonRef,
  Project,
  Publication,
  ResearchTheme,
  Team,
  Venue,
} from './types'

/**
 * Everything the DIAL site renders, read from Payload in one pass.
 *
 * DIAL's whole corpus is a few hundred small records, so it is loaded whole,
 * once, and cached across requests until a record changes (see `getDial` in
 * ./get.ts), and the lookups in
 * ./index.ts resolve relationships in memory. Reads are depth 0 for the same
 * reason: every related record is already loaded, so Payload populating them
 * would only repeat work the mappers throw away. Media is the one relation the
 * mappers need fields from, so it is loaded alongside and joined by id here.
 * This keeps the prototype's
 * record shapes (./types.ts) as the seam: Payload documents are flattened to
 * them here, and nothing downstream knows where they came from.
 */
export interface DialRecords {
  awards: Award[]
  grants: Grant[]
  labInfo: LabInfo
  news: News[]
  organizations: Organization[]
  projects: Project[]
  publications: Publication[]
  researchThemes: ResearchTheme[]
  team: Team[]
  venues: Venue[]
  /** LabInfo's curated partner lists, as Organization ids. */
  homePartnerOrganizationIds: string[]
  collaboratingOrganizationIds: string[]
}

// ─── Lexical → plain text ───────────────────────────────────────────────────

interface LexicalNode {
  type?: string
  tag?: string
  text?: string
  children?: LexicalNode[]
}

const nodeText = (node: LexicalNode): string =>
  node.text ?? (node.children ?? []).map(nodeText).join('')

/**
 * Rich text as the `## Heading` / paragraph string the prototype's views
 * expect. Only headings and block boundaries survive; inline formatting is
 * dropped, which is all DIAL's bios and project write-ups use.
 */
function lexicalToText(value: { root?: { children?: LexicalNode[] } } | null | undefined) {
  const blocks = (value?.root?.children ?? [])
    .map((node) => {
      const text = nodeText(node).trim()
      if (!text) return ''
      return node.type === 'heading' ? `## ${text}` : text
    })
    .filter(Boolean)
  return blocks.length > 0 ? blocks.join('\n\n') : null
}

// ─── Relationship helpers ───────────────────────────────────────────────────

/** A relationship's id, whether or not Payload populated it. */
const refId = (value: string | { id: string } | null | undefined): string | null =>
  value == null ? null : typeof value === 'string' ? value : value.id

const refIds = (values: (string | { id: string })[] | null | undefined): string[] =>
  (values ?? []).map(refId).filter((id): id is string => Boolean(id))

/** Media records by id, for the upload fields the mappers read URLs from. */
type MediaById = Map<string, Media>

const mediaDoc = (value: string | Media | null | undefined, media: MediaById) => {
  const id = refId(value)
  return id ? media.get(id) : undefined
}

/**
 * Where the site loads a Media file from: its public Blob URL, not the `url`
 * Payload gives it. Payload's `/api/media/file/<name>` is a function that
 * fetches from Blob on every request and is never cached by Vercel's CDN, and
 * the name in it can be reused when a file is replaced. A Blob URL is served
 * from the CDN, and it never changes content: every upload is written under a
 * fresh random `_objectKey` folder, so a replaced file gets a new URL and a
 * year-long cache cannot go stale. That holds for server uploads, which is all
 * this config allows; re-check it if client uploads are ever enabled. (Files
 * from before Payload 4 have no `_objectKey` and sit at the store's root; they
 * are never overwritten either, since a replacement is a new upload into a new
 * folder.)
 *
 * This is done here, for the public site, rather than with the storage
 * plugin's `disablePayloadAccessControl` or `generateFileURL`. Those change the
 * URL Payload expects a record to have, and Payload compares that against the
 * stored `url` to recognise a pre-Payload-4 record's files (every record here
 * is one), so its file tracking would stop matching them. The proxy keeps
 * serving the admin and any old link, under Media's access rules.
 */
function fileUrl(doc: Media): string | null {
  if (!blobBaseUrl || !doc.filename) return doc.url ?? null
  const folder = [doc.prefix, doc._objectKey].filter(Boolean).join('/')
  return `${blobBaseUrl}/${folder ? `${folder}/` : ''}${encodeURIComponent(doc.filename)}`
}

function mediaUrl(value: string | Media | null | undefined, media: MediaById): string | null {
  const doc = mediaDoc(value, media)
  return doc ? fileUrl(doc) : null
}

/** A Media file's natural width, for frames that size themselves from it. */
const mediaWidth = (value: string | Media | null | undefined, media: MediaById) =>
  mediaDoc(value, media)?.width ?? null

/** The Media record's alt text; components fall back to the record's title. */
const mediaAlt = (value: string | Media | null | undefined, media: MediaById): string | null =>
  mediaDoc(value, media)?.alt || null

function personRef(
  ref:
    | {
        name?: string | null
        orcid?: string | null
        affiliation?: string | PayloadOrganization | null
        affiliationLabel?: string | null
      }
    | null
    | undefined,
): PersonRef | undefined {
  if (!ref) return undefined
  return {
    name: ref.name ?? null,
    orcid: ref.orcid ?? null,
    affiliation: refId(ref.affiliation) ?? ref.affiliationLabel ?? null,
  }
}

// ─── Record mappers ─────────────────────────────────────────────────────────

const DIAL_PUBLICATION_TYPES = new Set<string>([
  'conference',
  'journal',
  'workshop',
  'preprint',
  'extended-abstract',
  'study-protocol',
  'book-chapter',
])

/**
 * Core's wider `type` list (thesis, dataset, …) is narrowed to the types DIAL's
 * views know; DIAL has no records of the others, which show untyped if added.
 */
function dialPublicationType(type: string | null | undefined): Publication['type'] {
  return type && DIAL_PUBLICATION_TYPES.has(type) ? (type as Publication['type']) : null
}

/**
 * The People page section a Team Member is listed under. The prototype stored
 * this by hand; LabKit derives it from `role` and `emerging`. Members on leave
 * stay in their section: `onLeave` does not make someone alumni.
 */
function rosterSection(doc: PayloadTeam): Team['rosterSection'] {
  switch (doc.role) {
    case 'faculty':
    case 'research-staff':
      return 'researchers'
    case 'graduate-ra':
      return 'graduate'
    case 'undergraduate-ra':
      return doc.emerging ? 'emerging' : 'undergraduate'
    default:
      return null
  }
}

function toTeam(doc: PayloadTeam, media: MediaById): Team {
  return {
    id: doc.id,
    name: doc.name ?? [doc.firstName, doc.middleName, doc.lastName].filter(Boolean).join(' '),
    slug: doc.slug ?? doc.id,
    title: doc.title,
    firstName: doc.firstName,
    middleName: doc.middleName ?? null,
    lastName: doc.lastName,
    role: doc.role,
    affiliation: refId(doc.affiliation),
    affiliationLabel: doc.affiliationLabel ?? null,
    photo: mediaUrl(doc.photo, media),
    photoAlt: mediaAlt(doc.photo, media),
    bio: lexicalToText(doc.bio),
    researchInterests: doc.researchInterests ?? null,
    socials: doc.socials?.map(({ platform, url }) => ({ platform, url })) ?? null,
    email: doc.email ?? null,
    orcid: doc.orcid ?? null,
    displayInWebsite: doc.displayInWebsite ?? null,
    alumniYear: doc.alumniYear ?? null,
    currentPosition: doc.currentPosition ?? null,
    nameVariants: doc.alternateNames ?? null,
    rosterSection: rosterSection(doc),
  }
}

function toPublication(doc: PayloadPublication, media: MediaById): Publication {
  return {
    id: doc.id,
    title: doc.title,
    abstract: doc.abstract ?? null,
    authors: [...doc.authors]
      .sort((a, b) => (a.authorPosition ?? 0) - (b.authorPosition ?? 0))
      .map((author) => ({
        teamMember: refId(author.teamMember),
        customAuthor: personRef(author.customAuthor),
      })),
    year: doc.year,
    status: doc.status,
    type: dialPublicationType(doc.type),
    venue: refId(doc.venue),
    venueLabel: doc.venueLabel ?? null,
    citationText: doc.citationText ?? null,
    doi: doc.doi ?? null,
    externalUrl: doc.externalUrl ?? null,
    publicationDate: doc.publicationDate ?? null,
    location: doc.location ?? null,
    volume: doc.volume ?? null,
    issue: doc.issue ?? null,
    pageStart: doc.pageStart ?? null,
    pageEnd: doc.pageEnd ?? null,
    publisher: doc.publisher ?? null,
    isOpenAccess: doc.isOpenAccess ?? null,
    pdf: {
      link: doc.pdf?.type === 'upload' ? mediaUrl(doc.pdf.upload, media) : (doc.pdf?.link ?? null),
    },
    featured: doc.featured ?? null,
    themes: refIds(doc.themes),
    awards: refIds(doc.awards),
  }
}

function toProject(doc: PayloadProject, media: MediaById): Project {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug ?? doc.id,
    localName: doc.localName ?? null,
    abstract: doc.abstract ?? null,
    heroImage: mediaUrl(doc.heroImage, media),
    heroImageAlt: mediaAlt(doc.heroImage, media),
    startDate: doc.startDate ?? null,
    endDate: doc.endDate ?? null,
    externalUrl: doc.externalUrl ?? null,
    teamMembers: refIds(doc.teamMembers),
    grants: refIds(doc.grants),
    themes: refIds(doc.themes),
    publications: refIds(doc.publications),
    awards: refIds(doc.awards),
    content: lexicalToText(doc.content),
    status: doc.status ?? null,
    featured: doc.featured ?? null,
  }
}

function toGrant(doc: PayloadGrant): Grant {
  return {
    id: doc.id,
    title: doc.title,
    slug: doc.slug ?? doc.id,
    description: doc.description ?? null,
    funder: refId(doc.funder),
    funderLabel: doc.funderLabel ?? null,
    amountValue: doc.amountValue ?? null,
    amountCurrency: doc.amountCurrency ?? null,
    amountLabel: doc.amountLabel ?? null,
    startDate: doc.startDate ?? null,
    endDate: doc.endDate ?? null,
    investigators:
      doc.investigators?.map((i) => ({
        teamMember: refId(i.teamMember),
        customInvestigator: personRef(i.customInvestigator),
        role: i.role ?? null,
      })) ?? null,
    url: doc.url ?? null,
    status: doc.status ?? null,
    featured: doc.featured ?? null,
    themes: refIds(doc.themes),
  }
}

function toAward(doc: PayloadAward): Award {
  return {
    id: doc.id,
    title: doc.title,
    year: doc.year,
    endYear: doc.endYear ?? null,
    category: doc.category ?? null,
    scope: doc.scope ?? null,
    recipients:
      doc.recipients?.map((r) => ({
        teamMember: refId(r.teamMember),
        customRecipient: personRef(r.customRecipient),
      })) ?? null,
    organization: refId(doc.organization),
    organizationLabel: doc.organizationLabel ?? null,
    url: doc.url ?? null,
    featured: doc.featured ?? null,
  }
}

function toNews(doc: PayloadNews, media: MediaById): News {
  return {
    id: doc.id,
    slug: doc.slug ?? doc.id,
    type: doc.type,
    date: doc.date,
    datePrecision: doc.datePrecision,
    title: doc.title,
    description: doc.description,
    photo: mediaUrl(doc.photo, media),
    photoAlt: mediaAlt(doc.photo, media),
    photoWidth: mediaWidth(doc.photo, media),
    url: doc.url ?? null,
  }
}

function toOrganization(doc: PayloadOrganization, media: MediaById): Organization {
  const logo = mediaDoc(doc.logo, media)
  return {
    id: doc.id,
    name: doc.name,
    shortName: doc.shortName ?? null,
    country: doc.country ?? null,
    type: doc.type ?? null,
    url: doc.url ?? null,
    ror_id: doc.ror_id ?? null,
    logo:
      logo?.url && logo.width && logo.height
        ? {
            src: fileUrl(logo) ?? logo.url,
            width: logo.width,
            height: logo.height,
            alt: logo.alt || null,
          }
        : null,
  }
}

const toVenue = (doc: PayloadVenue): Venue => ({
  id: doc.id,
  name: doc.name,
  shortName: doc.shortName ?? null,
  type: doc.type ?? null,
  url: doc.url ?? null,
})

const toResearchTheme = (doc: PayloadResearchTheme): ResearchTheme => ({
  id: doc.id,
  title: doc.title,
  slug: doc.slug ?? doc.id,
  shortDescription: doc.shortDescription ?? null,
  featured: doc.featured ?? null,
})

/**
 * LabInfo's recorded fields, with the stable prose DIAL's site states about
 * itself (./lab-info.ts) filling what the global has no field for.
 */
function toLabInfo(doc: PayloadLabInfo): LabInfo {
  const address = [doc.location?.address, doc.location?.city, doc.location?.country]
    .filter(Boolean)
    .join(', ')
  const foundedYear = doc.foundingDate ? Number(doc.foundingDate.slice(0, 4)) : null
  return {
    name: doc.name || DIAL_PROSE.name,
    shortName: doc.shortName || DIAL_PROSE.shortName,
    institution: doc.parentOrganization?.name || DIAL_PROSE.institution,
    tagline: doc.description || DIAL_PROSE.tagline,
    email: doc.email ?? null,
    address: address || null,
    socials: doc.socials?.map(({ platform, url }) => ({ platform, url })) ?? null,
    foundedYear: foundedYear ?? DIAL_PROSE.foundedYear,
    hciResearchSince: DIAL_PROSE.hciResearchSince,
    parentGroup: DIAL_PROSE.parentGroup,
    recruitment:
      doc.recruitment?.opens && doc.recruitment.closes
        ? { opens: doc.recruitment.opens.slice(0, 10), closes: doc.recruitment.closes.slice(0, 10) }
        : null,
  }
}

// ─── Loader ─────────────────────────────────────────────────────────────────

export async function loadDialRecords(): Promise<DialRecords> {
  const payload = await getPayload({ config: configPromise })
  // Public reads: access control applies, so unpublished Projects stay out.
  const read = {
    depth: 0,
    limit: 0,
    pagination: false,
    overrideAccess: false,
  } as const

  const [
    awards,
    grants,
    news,
    organizations,
    projects,
    publications,
    researchThemes,
    team,
    venues,
    labInfo,
    mediaDocs,
  ] = await Promise.all([
    payload.find({ collection: 'awards', ...read, sort: '-year' }),
    payload.find({ collection: 'grants', ...read }),
    payload.find({ collection: 'news', ...read, sort: '-date' }),
    payload.find({ collection: 'organizations', ...read }),
    payload.find({ collection: 'projects', ...read, sort: 'title' }),
    payload.find({
      collection: 'publications',
      ...read,
      where: { displayInWebsite: { not_equals: false } },
    }),
    payload.find({
      collection: 'research-themes',
      ...read,
      sort: 'createdAt',
    }),
    payload.find({ collection: 'team', ...read }),
    payload.find({ collection: 'venues', ...read }),
    payload.findGlobal({ slug: 'lab-info', depth: 0, overrideAccess: false }),
    payload.find({ collection: 'media', ...read }),
  ])

  const media: MediaById = new Map(mediaDocs.docs.map((doc) => [doc.id, doc]))

  return {
    awards: awards.docs.map(toAward),
    grants: grants.docs.map(toGrant),
    labInfo: toLabInfo(labInfo),
    news: news.docs.map((doc) => toNews(doc, media)),
    organizations: organizations.docs.map((doc) => toOrganization(doc, media)),
    projects: projects.docs.map((doc) => toProject(doc, media)),
    publications: publications.docs.map((doc) => toPublication(doc, media)),
    researchThemes: researchThemes.docs.map(toResearchTheme),
    team: team.docs.map((doc) => toTeam(doc, media)),
    venues: venues.docs.map(toVenue),
    homePartnerOrganizationIds: refIds(labInfo.homePartners),
    collaboratingOrganizationIds: refIds(labInfo.collaborators),
  }
}
