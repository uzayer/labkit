/**
 * Loads dial-test's fixture records (dial-test/src/data/) into a Payload
 * database, so the ported DIAL frontend can be compared with the prototype
 * page for page.
 *
 * Development only. These are the prototype's hand-picked edge-case fixtures,
 * not DIAL's record — DIAL's launch data comes from the ingestion pipeline.
 * Point it at a throwaway database, never the one real imports go into:
 *
 *   TURSO_DATABASE_URL='file:./data/dial-fixtures.db' \
 *     bun run payload -- run scripts/dev/seed-dial-fixtures.ts
 *
 * It refuses to write when the target already holds Team, Publication, or
 * Project records. Images are fetched and uploaded to Media; the partner SVG
 * logos are rasterised to PNG in this visual fixture set.
 */
import path from 'node:path'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

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
import { venues } from '../../dial-test/src/data/venues'
import {
  awardData,
  contactFormData,
  context,
  createDialIds,
  createImageUploader,
  grantData,
  labInfoData,
  mapId,
  mapIds,
  newsData,
  organizationData,
  personRef,
  projectData,
  researchThemeData,
  teamData,
  type DialMapping,
} from '../ingestion/dial-records'

const PUBLIC_DIR = path.resolve(process.cwd(), 'dial-test/public')

const ids = createDialIds()
const mapping: DialMapping = {
  ids,
  organizationNames: new Map(organizations.map((org) => [org.id, org.name])),
}

// ─── Seed ───────────────────────────────────────────────────────────────────

async function main() {
  const databaseUrl = process.env.TURSO_DATABASE_URL
  if (!databaseUrl?.startsWith('file:') || !databaseUrl.includes('dial-fixtures')) {
    throw new Error('Use a local file: URL whose name contains dial-fixtures')
  }
  const payload = await getPayload({ config: configPromise })
  const uploadImage = createImageUploader(payload, { publicDir: PUBLIC_DIR, rasterizeSvg: true })
  const dbName = databaseUrl.slice('file:'.length)

  for (const collection of ['team', 'publications', 'projects'] as const) {
    const { totalDocs } = await payload.count({ collection })
    if (totalDocs > 0) {
      throw new Error(
        `Refusing to seed "${dbName}": it already has ${totalDocs} ${collection} records. ` +
          'Point TURSO_DATABASE_URL at an empty, throwaway SQLite database.',
      )
    }
  }
  payload.logger.info(`Seeding dial-test fixtures into "${dbName}"`)

  for (const org of organizations) {
    const logo = await uploadImage(org.logo?.src, `${org.name} logo`)
    const doc = await payload.create({
      context,
      collection: 'organizations',
      data: organizationData(org, logo),
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
      data: researchThemeData(theme),
    })
    ids.themes.set(theme.id, doc.id)
  }

  for (const member of team) {
    const photo = await uploadImage(member.photo, member.name)
    const doc = await payload.create({
      context,
      collection: 'team',
      data: teamData(mapping, member, photo),
    })
    ids.team.set(member.id, doc.id)
  }

  for (const grant of grants) {
    const doc = await payload.create({
      context,
      collection: 'grants',
      data: grantData(mapping, grant),
    })
    ids.grants.set(grant.id, doc.id)
  }

  for (const award of awards) {
    const doc = await payload.create({
      context,
      collection: 'awards',
      data: awardData(mapping, award),
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
          customAuthor: personRef(mapping, author.customAuthor),
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
    const heroImage = await uploadImage(project.heroImage, project.title)
    await payload.create({
      context,
      collection: 'projects',
      data: projectData(mapping, project, heroImage),
    })
  }

  for (const item of news) {
    const photo = await uploadImage(item.photo, item.title)
    await payload.create({ context, collection: 'news', data: newsData(item, photo) })
  }

  await payload.create({ context, collection: 'forms', data: contactFormData() })

  await payload.updateGlobal({
    context,
    slug: 'lab-info',
    data: labInfoData(mapping, labInfo, homePartnerOrganizationIds, collaboratingOrganizationIds),
  })

  payload.logger.info(
    `Seeded ${organizations.length} organizations, ${venues.length} venues, ` +
      `${researchThemes.length} themes, ${team.length} people, ${grants.length} grants, ` +
      `${awards.length} awards, ${publications.length} publications, ` +
      `${projects.length} projects, ${news.length} news items`,
  )
}

await main()
