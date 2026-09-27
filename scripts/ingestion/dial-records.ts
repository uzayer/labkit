/**
 * The DIAL prototype's record shapes (dial-test/src/data, and the fuller
 * labs/dial/dial-test-full-data) mapped to Payload collection data. Shared by
 * the throwaway fixture seed and the writer for confirmed manifest rows, so the
 * two cannot drift.
 *
 * Every relationship goes through `DialIds`. A prototype id with no Payload id
 * (not written, or not confirmed) is dropped, and the free-text `*Label` field
 * gets the referenced Organization's name instead.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import type { Payload, RequiredDataFromCollectionSlug } from 'payload'
import sharp from 'sharp'

import type {
  Award,
  Grant,
  LabInfo,
  News,
  Organization,
  PersonRef,
  Project,
  ResearchTheme,
  Team,
} from '../../labs/dial/dial-test-full-data/types'

type Data<T extends Parameters<Payload['create']>[0]['collection']> =
  RequiredDataFromCollectionSlug<T>

/** Prototype id → Payload id, per collection. */
export interface DialIds {
  organizations: Map<string, string>
  venues: Map<string, string>
  themes: Map<string, string>
  team: Map<string, string>
  grants: Map<string, string>
  awards: Map<string, string>
  publications: Map<string, string>
}

export const createDialIds = (): DialIds => ({
  organizations: new Map(),
  venues: new Map(),
  themes: new Map(),
  team: new Map(),
  grants: new Map(),
  awards: new Map(),
  publications: new Map(),
})

export interface DialMapping {
  ids: DialIds
  /** Prototype Organization id → name, for labels when the id is unmapped. */
  organizationNames: Map<string, string>
}

export const mapId = (map: Map<string, string>, id: string | null | undefined) =>
  id ? map.get(id) : undefined

export const mapIds = (map: Map<string, string>, list: string[] | null | undefined) =>
  (list ?? []).map((id) => map.get(id)).filter((id): id is string => Boolean(id))

/** The label to store when an Organization reference could not be linked. */
const organizationLabel = (
  { ids, organizationNames }: DialMapping,
  id: string | null | undefined,
  label?: string | null,
) => label ?? (id && !ids.organizations.has(id) ? (organizationNames.get(id) ?? id) : undefined)

/** Payload date fields need a full date; the prototype sometimes gives a year. */
export const toDate = (value: string | null | undefined) =>
  !value
    ? undefined
    : /^\d{4}$/.test(value)
      ? `${value}-01-01`
      : /^\d{4}-\d{2}$/.test(value)
        ? `${value}-01`
        : value

/** `## Heading` / paragraph text as Lexical, the shape DIAL's rich text uses. */
export function toLexical(text: string | null | undefined) {
  if (!text) return undefined
  const textNode = (value: string) => ({
    type: 'text',
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    text: value,
    version: 1,
  })
  const base = {
    direction: 'ltr' as const,
    format: '' as const,
    indent: 0,
    version: 1,
  }
  return {
    root: {
      type: 'root',
      ...base,
      children: text
        .split(/\n{2,}/)
        .map((block) => block.trim())
        .filter(Boolean)
        .map((block) =>
          block.startsWith('## ')
            ? {
                type: 'heading',
                tag: 'h2',
                ...base,
                children: [textNode(block.slice(3))],
              }
            : { type: 'paragraph', ...base, children: [textNode(block)] },
        ),
    },
  }
}

export const personRef = (mapping: DialMapping, ref: PersonRef | undefined) =>
  ref
    ? {
        name: ref.name ?? undefined,
        orcid: ref.orcid ?? undefined,
        affiliation: mapId(mapping.ids.organizations, ref.affiliation),
        affiliationLabel: organizationLabel(mapping, ref.affiliation),
      }
    : undefined

// ─── Media ──────────────────────────────────────────────────────────────────

// Revalidation hooks need a running Next server; a CLI write has none.
export const context = { disableRevalidate: true }

export interface ImageOptions {
  /** Where `/…` paths resolve: the prototype's `public/` folder. */
  publicDir: string
  /** Convert SVG to PNG. The fixture seed does; Media accepts safe SVGs. */
  rasterizeSvg?: boolean
  /**
   * Remote URL → local file, for sources that no longer download directly
   * (DIAL's captured Google Sites images; see labs/dial/working-data/fetch-images.py).
   */
  localCopies?: Map<string, string>
}

const slugify = (alt: string) =>
  alt
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .slice(0, 60)

/** Upload a local (`/…`) or remote image, once per source; undefined on failure. */
export function createImageUploader(payload: Payload, options: ImageOptions) {
  const cache = new Map<string, string | undefined>()
  return async (src: string | null | undefined, alt: string) => {
    if (!src) return undefined
    if (cache.has(src)) return cache.get(src)
    let id: string | undefined
    try {
      let data: Buffer
      let mimetype: string
      let name = path.basename(new URL(src, 'http://local').pathname) || 'image'
      const local = src.startsWith('/')
        ? path.join(options.publicDir, src)
        : options.localCopies?.get(src)
      if (local) {
        data = await readFile(local)
        mimetype = local.endsWith('.webp')
          ? 'image/webp'
          : local.endsWith('.png')
            ? 'image/png'
            : local.endsWith('.svg')
              ? 'image/svg+xml'
              : 'image/jpeg'
        // A cached remote image has an opaque token for a path; name it by its alt.
        if (!src.startsWith('/')) name = `${slugify(alt)}${path.extname(local)}`
      } else {
        const res = await fetch(src)
        if (!res.ok) throw new Error(`HTTP ${res.status}`)
        data = Buffer.from(await res.arrayBuffer())
        mimetype = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
        name = `${slugify(alt)}.${mimetype.split('/')[1]?.replace('+xml', '') ?? 'jpg'}`
      }
      if (options.rasterizeSvg && mimetype === 'image/svg+xml') {
        data = await sharp(data, { density: 300 }).png().toBuffer()
        mimetype = 'image/png'
        name = name.replace(/\.svg$/, '.png')
      }
      const doc = await payload.create({
        context,
        collection: 'media',
        data: { alt },
        file: { data, mimetype, name, size: data.length },
      })
      id = doc.id
    } catch (error) {
      payload.logger.warn(`Skipped image for "${alt}": ${(error as Error).message}`)
    }
    cache.set(src, id)
    return id
  }
}

// ─── Records ────────────────────────────────────────────────────────────────

export const organizationData = (org: Organization, logo?: string): Data<'organizations'> => ({
  name: org.name,
  shortName: org.shortName ?? undefined,
  country: org.country ?? undefined,
  type: org.type ?? undefined,
  url: org.url ?? undefined,
  ror_id: org.ror_id ?? undefined,
  logo,
})

export const researchThemeData = (theme: ResearchTheme): Data<'research-themes'> => ({
  title: theme.title,
  slug: theme.slug,
  shortDescription: theme.shortDescription ?? undefined,
  featured: theme.featured ?? undefined,
})

export const teamData = (mapping: DialMapping, member: Team, photo?: string): Data<'team'> => ({
  firstName: member.firstName,
  middleName: member.middleName ?? undefined,
  lastName: member.lastName,
  slug: member.slug,
  title: member.title,
  // The prototype filed research staff as graduate RAs in a "researchers" section.
  role:
    member.rosterSection === 'researchers' && member.role === 'graduate-ra'
      ? 'research-staff'
      : member.role,
  emerging: member.rosterSection === 'emerging' || undefined,
  affiliation: mapId(mapping.ids.organizations, member.affiliation),
  affiliationLabel: organizationLabel(mapping, member.affiliation, member.affiliationLabel),
  photo,
  bio: toLexical(member.bio) as never,
  researchInterests: member.researchInterests ?? undefined,
  socials: member.socials ?? undefined,
  email: member.email ?? undefined,
  orcid: member.orcid ?? undefined,
  alternateNames: member.nameVariants ?? undefined,
  displayInWebsite: member.displayInWebsite ?? true,
  alumniYear: member.alumniYear ?? undefined,
  currentPosition: member.currentPosition ?? undefined,
})

export const grantData = (mapping: DialMapping, grant: Grant): Data<'grants'> => ({
  title: grant.title,
  slug: grant.slug,
  description: grant.description ?? undefined,
  funder: mapId(mapping.ids.organizations, grant.funder),
  funderLabel: organizationLabel(mapping, grant.funder, grant.funderLabel),
  amountValue: grant.amountValue ?? undefined,
  amountCurrency: grant.amountCurrency ?? undefined,
  amountLabel: grant.amountLabel ?? undefined,
  startDate: toDate(grant.startDate),
  endDate: toDate(grant.endDate),
  investigators: grant.investigators?.map((i) => ({
    teamMember: mapId(mapping.ids.team, i.teamMember),
    customInvestigator: personRef(mapping, i.customInvestigator),
    role: i.role ?? undefined,
  })),
  url: grant.url ?? undefined,
  status: grant.status ?? undefined,
  featured: grant.featured ?? undefined,
  themes: mapIds(mapping.ids.themes, grant.themes),
})

export const awardData = (mapping: DialMapping, award: Award): Data<'awards'> => ({
  title: award.title,
  year: award.year,
  endYear: award.endYear ?? undefined,
  category: award.category ?? undefined,
  scope: award.scope ?? undefined,
  recipients: award.recipients?.map((r) => ({
    teamMember: mapId(mapping.ids.team, r.teamMember),
    customRecipient: personRef(mapping, r.customRecipient),
  })),
  organization: mapId(mapping.ids.organizations, award.organization),
  organizationLabel: organizationLabel(mapping, award.organization, award.organizationLabel),
  url: award.url ?? undefined,
  featured: award.featured ?? undefined,
})

export const projectData = (
  mapping: DialMapping,
  project: Project,
  heroImage?: string,
): Data<'projects'> => ({
  _status: 'published',
  title: project.title,
  slug: project.slug,
  localName: project.localName ?? undefined,
  abstract: project.abstract ?? undefined,
  heroImage,
  startDate: toDate(project.startDate),
  endDate: toDate(project.endDate),
  externalUrl: project.externalUrl ?? undefined,
  teamMembers: mapIds(mapping.ids.team, project.teamMembers),
  grants: mapIds(mapping.ids.grants, project.grants),
  themes: mapIds(mapping.ids.themes, project.themes),
  publications: mapIds(mapping.ids.publications, project.publications),
  awards: mapIds(mapping.ids.awards, project.awards),
  content: toLexical(project.content) as never,
  status: project.status ?? undefined,
  featured: project.featured ?? undefined,
})

export const newsData = (item: News, photo?: string): Data<'news'> => ({
  title: item.title,
  slug: item.id,
  date: item.date,
  datePrecision: item.datePrecision ?? 'day',
  type: item.type,
  description: item.description,
  photo,
  url: item.url ?? undefined,
})

/** The Form the contact page submits to, looked up by this title. */
export const contactFormData = (): Data<'forms'> => ({
  title: 'Contact',
  fields: [
    { blockType: 'text', name: 'name', label: 'Name', required: true },
    { blockType: 'email', name: 'email', label: 'Email', required: true },
    {
      blockType: 'textarea',
      name: 'message',
      label: 'Message',
      required: true,
    },
  ],
  confirmationType: 'message',
  confirmationMessage: toLexical("Thank you. We'll be in touch soon.") as never,
})

/** The LabInfo global, with the prototype's home partners and collaborators linked. */
export const labInfoData = (
  mapping: DialMapping,
  labInfo: LabInfo,
  homePartnerIds: string[],
  collaboratorIds: string[],
) => ({
  name: labInfo.name,
  shortName: labInfo.shortName,
  description: labInfo.tagline ?? undefined,
  parentOrganization: { name: labInfo.institution },
  email: labInfo.email ?? undefined,
  location: { address: labInfo.address ?? undefined },
  socials: (labInfo.socials ?? []).map((s) => ({
    platform: s.platform as 'x' | 'linkedin' | 'facebook',
    url: s.url,
  })),
  foundingDate: labInfo.foundedYear ? `${labInfo.foundedYear}-01-01` : undefined,
  homePartners: mapIds(mapping.ids.organizations, homePartnerIds),
  collaborators: mapIds(mapping.ids.organizations, collaboratorIds),
  recruitment: labInfo.recruitment ?? undefined,
})
