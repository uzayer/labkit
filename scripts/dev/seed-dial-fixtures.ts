/**
 * Loads dial-test's fixture records (dial-test/src/data/) into a Payload
 * database, so the ported DIAL frontend can be compared with the prototype
 * page for page.
 *
 * Development only. These are the prototype's hand-picked edge-case fixtures,
 * not DIAL's record — DIAL's launch data comes from the ingestion pipeline.
 * Point it at a throwaway database, never the one real imports go into:
 *
 *   MONGODB_URI='mongodb://127.0.0.1:27017/dial-fixtures?replicaSet=rs0' \
 *     bun run payload -- run scripts/dev/seed-dial-fixtures.ts
 *
 * It refuses to write when the target already holds Team, Publication, or
 * Project records. Images are fetched and uploaded to Media; the partner SVG
 * logos are rasterised to PNG first, because Media does not accept SVG.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload, type Payload } from 'payload'
import sharp from 'sharp'

import { awards } from '../../dial-test/src/data/awards'
import { grants } from '../../dial-test/src/data/grants'
import { labInfo } from '../../dial-test/src/data/lab-info'
import { news } from '../../dial-test/src/data/news'
import {
  collaboratingOrganizationIds,
  homePartnerOrganizationIds,
  organizations,
} from '../../dial-test/src/data/organizations'
import { projects } from '../../dial-test/src/data/projects'
import { publications } from '../../dial-test/src/data/publications'
import { researchThemes } from '../../dial-test/src/data/research-themes'
import { team } from '../../dial-test/src/data/team'
import type { PersonRef } from '../../dial-test/src/data/types'
import { venues } from '../../dial-test/src/data/venues'

const PUBLIC_DIR = path.resolve(process.cwd(), 'dial-test/public')

/** Fixture id → Payload id, per collection. */
const ids = {
  organizations: new Map<string, string>(),
  venues: new Map<string, string>(),
  themes: new Map<string, string>(),
  team: new Map<string, string>(),
  grants: new Map<string, string>(),
  awards: new Map<string, string>(),
  publications: new Map<string, string>(),
}

const mapId = (map: Map<string, string>, id: string | null | undefined) =>
  id ? map.get(id) : undefined

const mapIds = (map: Map<string, string>, list: string[] | null | undefined) =>
  (list ?? []).map((id) => map.get(id)).filter((id): id is string => Boolean(id))

/** Payload date fields need a full date; the fixtures sometimes give a year. */
const toDate = (value: string | null | undefined) =>
  !value
    ? undefined
    : /^\d{4}$/.test(value)
      ? `${value}-01-01`
      : /^\d{4}-\d{2}$/.test(value)
        ? `${value}-01`
        : value

/** `## Heading` / paragraph text as Lexical, the shape DIAL's rich text uses. */
function toLexical(text: string | null | undefined) {
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
  const base = { direction: 'ltr' as const, format: '' as const, indent: 0, version: 1 }
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
            ? { type: 'heading', tag: 'h2', ...base, children: [textNode(block.slice(3))] }
            : { type: 'paragraph', ...base, children: [textNode(block)] },
        ),
    },
  }
}

const personRef = (ref: PersonRef | undefined) =>
  ref
    ? {
        name: ref.name ?? undefined,
        orcid: ref.orcid ?? undefined,
        affiliation: mapId(ids.organizations, ref.affiliation),
        affiliationLabel:
          ref.affiliation && !ids.organizations.has(ref.affiliation) ? ref.affiliation : undefined,
      }
    : undefined

// ─── Media ──────────────────────────────────────────────────────────────────

// Revalidation hooks need a running Next server; a CLI write has none.
const context = { disableRevalidate: true }

const mediaCache = new Map<string, string | undefined>()

/** Upload a local (`/…`, from dial-test/public) or remote image; undefined on failure. */
async function uploadImage(payload: Payload, src: string | null | undefined, alt: string) {
  if (!src) return undefined
  if (mediaCache.has(src)) return mediaCache.get(src)
  let id: string | undefined
  try {
    let data: Buffer
    let mimetype: string
    let name = path.basename(new URL(src, 'http://local').pathname) || 'image'
    if (src.startsWith('/')) {
      data = await readFile(path.join(PUBLIC_DIR, src))
      mimetype = src.endsWith('.webp')
        ? 'image/webp'
        : src.endsWith('.png')
          ? 'image/png'
          : 'image/svg+xml'
    } else {
      const res = await fetch(src)
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      data = Buffer.from(await res.arrayBuffer())
      mimetype = res.headers.get('content-type')?.split(';')[0] ?? 'image/jpeg'
      name = `${alt
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .slice(0, 60)}.${mimetype.split('/')[1] ?? 'jpg'}`
    }
    if (mimetype === 'image/svg+xml') {
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
  mediaCache.set(src, id)
  return id
}

// ─── Seed ───────────────────────────────────────────────────────────────────

async function main() {
  const payload = await getPayload({ config: configPromise })
  const dbName = new URL(process.env.MONGODB_URI ?? 'mongodb://x/unknown').pathname.slice(1)

  for (const collection of ['team', 'publications', 'projects'] as const) {
    const { totalDocs } = await payload.count({ collection })
    if (totalDocs > 0) {
      throw new Error(
        `Refusing to seed "${dbName}": it already has ${totalDocs} ${collection} records. ` +
          'Point MONGODB_URI at an empty, throwaway database.',
      )
    }
  }
  payload.logger.info(`Seeding dial-test fixtures into "${dbName}"`)

  for (const org of organizations) {
    const logo = await uploadImage(payload, org.logo?.src, `${org.name} logo`)
    const doc = await payload.create({
      context,
      collection: 'organizations',
      data: {
        name: org.name,
        shortName: org.shortName ?? undefined,
        country: org.country ?? undefined,
        type: org.type ?? undefined,
        url: org.url ?? undefined,
        ror_id: org.ror_id ?? undefined,
        logo,
      },
    })
    ids.organizations.set(org.id, doc.id)
  }

  for (const venue of venues) {
    const doc = await payload.create({
      context,
      collection: 'venues',
      data: {
        name: venue.name,
        shortName: venue.shortName ?? undefined,
        type: venue.type ?? undefined,
        url: venue.url ?? undefined,
      },
    })
    ids.venues.set(venue.id, doc.id)
  }

  for (const theme of researchThemes) {
    const doc = await payload.create({
      context,
      collection: 'research-themes',
      data: {
        title: theme.title,
        slug: theme.slug,
        shortDescription: theme.shortDescription ?? undefined,
        featured: theme.featured ?? undefined,
      },
    })
    ids.themes.set(theme.id, doc.id)
  }

  for (const member of team) {
    const photo = await uploadImage(payload, member.photo, member.name)
    const doc = await payload.create({
      context,
      collection: 'team',
      data: {
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
        affiliation: mapId(ids.organizations, member.affiliation),
        affiliationLabel: member.affiliationLabel ?? undefined,
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
      },
    })
    ids.team.set(member.id, doc.id)
  }

  for (const grant of grants) {
    const doc = await payload.create({
      context,
      collection: 'grants',
      data: {
        title: grant.title,
        slug: grant.slug,
        description: grant.description ?? undefined,
        funder: mapId(ids.organizations, grant.funder),
        funderLabel: grant.funderLabel ?? undefined,
        amountValue: grant.amountValue ?? undefined,
        amountCurrency: grant.amountCurrency ?? undefined,
        amountLabel: grant.amountLabel ?? undefined,
        startDate: toDate(grant.startDate),
        endDate: toDate(grant.endDate),
        investigators: grant.investigators?.map((i) => ({
          teamMember: mapId(ids.team, i.teamMember),
          customInvestigator: personRef(i.customInvestigator),
          role: i.role ?? undefined,
        })),
        url: grant.url ?? undefined,
        status: grant.status ?? undefined,
        featured: grant.featured ?? undefined,
        themes: mapIds(ids.themes, grant.themes),
      },
    })
    ids.grants.set(grant.id, doc.id)
  }

  for (const award of awards) {
    const doc = await payload.create({
      context,
      collection: 'awards',
      data: {
        title: award.title,
        year: award.year,
        endYear: award.endYear ?? undefined,
        category: award.category ?? undefined,
        scope: award.scope ?? undefined,
        recipients: award.recipients?.map((r) => ({
          teamMember: mapId(ids.team, r.teamMember),
          customRecipient: personRef(r.customRecipient),
        })),
        organization: mapId(ids.organizations, award.organization),
        organizationLabel: award.organizationLabel ?? undefined,
        url: award.url ?? undefined,
        featured: award.featured ?? undefined,
      },
    })
    ids.awards.set(award.id, doc.id)
  }

  for (const pub of publications) {
    const doc = await payload.create({
      context,
      collection: 'publications',
      data: {
        title: pub.title,
        abstract: pub.abstract ?? undefined,
        authors: pub.authors.map((author, i) => ({
          teamMember: mapId(ids.team, author.teamMember),
          customAuthor: personRef(author.customAuthor),
          authorPosition: i + 1,
        })),
        year: pub.year,
        status: pub.status,
        type: pub.type ?? undefined,
        venue: mapId(ids.venues, pub.venue),
        venueLabel: pub.venueLabel ?? undefined,
        citationText: pub.citationText ?? undefined,
        doi: pub.doi ?? undefined,
        externalUrl: pub.externalUrl ?? undefined,
        isOpenAccess: pub.isOpenAccess ?? undefined,
        pdf: pub.pdf?.link ? { type: 'link', link: pub.pdf.link } : undefined,
        featured: pub.featured ?? undefined,
        themes: mapIds(ids.themes, pub.themes),
        awards: mapIds(ids.awards, pub.awards),
        provenance: { source: 'manual', sourceNote: 'dial-test fixture (dev seed)' },
      },
    })
    ids.publications.set(pub.id, doc.id)
  }

  for (const project of projects) {
    const heroImage = await uploadImage(payload, project.heroImage, project.title)
    await payload.create({
      context,
      collection: 'projects',
      data: {
        _status: 'published',
        title: project.title,
        slug: project.slug,
        localName: project.localName ?? undefined,
        abstract: project.abstract ?? undefined,
        heroImage,
        startDate: toDate(project.startDate),
        endDate: toDate(project.endDate),
        externalUrl: project.externalUrl ?? undefined,
        teamMembers: mapIds(ids.team, project.teamMembers),
        grants: mapIds(ids.grants, project.grants),
        themes: mapIds(ids.themes, project.themes),
        publications: mapIds(ids.publications, project.publications),
        awards: mapIds(ids.awards, project.awards),
        content: toLexical(project.content) as never,
        status: project.status ?? undefined,
        featured: project.featured ?? undefined,
      },
    })
  }

  for (const item of news) {
    const photo = await uploadImage(payload, item.photo, item.title)
    await payload.create({
      context,
      collection: 'news',
      data: {
        title: item.title,
        slug: item.id,
        date: item.date,
        datePrecision: item.datePrecision ?? 'day',
        type: item.type,
        description: item.description,
        photo,
        url: item.url ?? undefined,
      },
    })
  }

  // The Form the contact page submits to, looked up by this title.
  await payload.create({
    context,
    collection: 'forms',
    data: {
      title: 'Contact',
      fields: [
        { blockType: 'text', name: 'name', label: 'Name', required: true },
        { blockType: 'email', name: 'email', label: 'Email', required: true },
        { blockType: 'textarea', name: 'message', label: 'Message', required: true },
      ],
      confirmationType: 'message',
      confirmationMessage: toLexical("Thank you. We'll be in touch soon.") as never,
    },
  })

  await payload.updateGlobal({
    context,
    slug: 'lab-info',
    data: {
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
      homePartners: mapIds(ids.organizations, homePartnerOrganizationIds),
      collaborators: mapIds(ids.organizations, collaboratingOrganizationIds),
      recruitment: labInfo.recruitment ?? undefined,
    },
  })

  payload.logger.info(
    `Seeded ${organizations.length} organizations, ${venues.length} venues, ` +
      `${researchThemes.length} themes, ${team.length} people, ${grants.length} grants, ` +
      `${awards.length} awards, ${publications.length} publications, ` +
      `${projects.length} projects, ${news.length} news items`,
  )
}

await main()
