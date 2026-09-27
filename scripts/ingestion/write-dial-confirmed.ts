/**
 * Write DIAL's `confirmed` review-manifest rows into Payload. The records come
 * from labs/dial/dial-test-full-data; the manifest decides which of them exist.
 * Publications are not written here — they come from the ORCID/BibTeX Front
 * Doors — but Projects and Awards are linked to the ones already imported.
 *
 *   bun run payload -- run scripts/ingestion/write-dial-confirmed.ts [dry-run] [local-media] [include-unverified]
 *
 * `include-unverified` also writes `unverified` rows (never `rejected` or
 * `conflict`), for an Operator building the database to review in /admin
 * before DIAL has confirmed rows one by one. Manifest statuses are unchanged.
 *
 * Run it before the imports (a live ORCID run needs its owner on the Team
 * roster, and Safe Match uses the roster's alternate names) and again after
 * them. It is create-only: a record that already exists is never changed, so
 * admin edits survive re-runs. The exceptions only fill what is missing: an
 * existing Project with no Publications gets them, a Publication gains a
 * confirmed Award it lacks, and an empty photo or hero image is filled.
 *
 * Media goes wherever Payload stores it. Without BLOB_READ_WRITE_TOKEN that is
 * local disk, which a Vercel deployment cannot serve, so a live run then needs
 * the bare word `local-media`; upload public/media/ to Blob before deploying.
 * Captured Google Sites images are read from data/dial-images/ (run
 * labs/dial/working-data/fetch-images.py first). Partner logos come from
 * dial-test/public. LabInfo is filled only if it has never been saved.
 */
import { readFile } from 'node:fs/promises'
import path from 'node:path'

import configPromise from '@payload-config'
import { normalizeDoi } from '@/lib/ingestion/normalize'
import { getPayload, type Payload } from 'payload'

import {
  awards,
  grants,
  news,
  organizations,
  projects,
  publications,
  researchThemes,
  team,
} from '../../labs/dial/dial-test-full-data/index'
import {
  collaboratingOrganizationIds,
  homePartnerOrganizationIds,
} from '../../labs/dial/dial-test-full-data/organizations'
import { labInfo } from '../../labs/dial/dial-test-full-data/lab-info'
import { organizations as prototypeOrganizations } from '../../dial-test/src/data/organizations'
import {
  awardData,
  contactFormData,
  context,
  createDialIds,
  createImageUploader,
  grantData,
  labInfoData,
  newsData,
  organizationData,
  projectData,
  researchThemeData,
  teamData,
  type DialMapping,
} from './dial-records'

const DRY_RUN = process.argv.includes('dry-run')
const LOCAL_MEDIA = process.argv.includes('local-media')
const INCLUDE_UNVERIFIED = process.argv.includes('include-unverified')
// DIAL_MANIFEST points at a scratch copy, for testing against a throwaway database.
const MANIFEST = path.resolve(
  process.cwd(),
  process.env.DIAL_MANIFEST ?? 'labs/dial/working-data/review-manifest.json',
)
const PUBLIC_DIR = path.resolve(process.cwd(), 'dial-test/public')
const IMAGE_CACHE = path.resolve(process.cwd(), 'data/dial-images')
const logos = new Map(prototypeOrganizations.map((org) => [org.id, org.logo?.src]))

interface ManifestRow {
  collection: string
  recordId: string
  status: string
}

type Where = NonNullable<Parameters<Payload['find']>[0]['where']>
type Found = { id: string; [key: string]: unknown }
type Slug = Parameters<Payload['find']>[0]['collection']

const ids = createDialIds()
const mapping: DialMapping = {
  ids,
  organizationNames: new Map(organizations.map((org) => [org.id, org.name])),
}

const report = new Map<string, { created: number; existing: number; linked: number }>()
const dropped: string[] = []

function tally(collection: string, key: 'created' | 'existing' | 'linked') {
  const row = report.get(collection) ?? { created: 0, existing: 0, linked: 0 }
  row[key]++
  report.set(collection, row)
}

/** Relationships the manifest has not confirmed are dropped; say which. */
function noteDropped(
  owner: string,
  kind: string,
  map: Map<string, string>,
  list?: (string | null | undefined)[] | null,
) {
  for (const id of list ?? []) if (id && !map.has(id)) dropped.push(`${owner} → ${kind}/${id}`)
}

async function main() {
  const rows = JSON.parse(await readFile(MANIFEST, 'utf8')) as ManifestRow[]
  const confirmed = (collection: string) =>
    new Set(
      rows
        .filter(
          (r) =>
            r.collection === collection &&
            (r.status === 'confirmed' || (INCLUDE_UNVERIFIED && r.status === 'unverified')),
        )
        .map((r) => r.recordId),
    )

  if (!DRY_RUN && !process.env.BLOB_READ_WRITE_TOKEN && !LOCAL_MEDIA) {
    throw new Error(
      'BLOB_READ_WRITE_TOKEN is not set, so Media would be stored on local disk. ' +
        'Set it for a launch database, or pass `local-media` for a throwaway one.',
    )
  }

  const payload = await getPayload({ config: configPromise })
  const cached = await readFile(path.join(IMAGE_CACHE, 'index.json'), 'utf8').then(
    (text) => Object.entries(JSON.parse(text) as Record<string, string>),
    (): [string, string][] => [],
  )
  const uploadImage = createImageUploader(payload, {
    publicDir: PUBLIC_DIR,
    localCopies: new Map(cached.map(([url, file]) => [url, path.join(IMAGE_CACHE, file)])),
  })
  payload.logger.info(
    `${DRY_RUN ? '[dry-run] ' : ''}Writing ${INCLUDE_UNVERIFIED ? 'confirmed and unverified' : 'confirmed'} ` +
      `DIAL rows to ${process.env.TURSO_DATABASE_URL ?? 'file:./labkit.db'}; ${cached.length} cached images`,
  )

  const findOne = async (collection: Slug, where: Where) =>
    (
      await payload.find({
        collection,
        where,
        limit: 1,
        depth: 0,
        pagination: false,
      })
    ).docs[0] as unknown as Found | undefined

  /** Find the existing record, else create it; records the prototype id → Payload id. */
  async function ensure<T>(
    collection: Slug,
    record: { id: string },
    map: Map<string, string> | undefined,
    match: Where[],
    create: () => Promise<T>,
  ) {
    for (const where of match) {
      const existing = await findOne(collection, where)
      if (existing) {
        map?.set(record.id, existing.id)
        tally(collection, 'existing')
        return existing
      }
    }
    tally(collection, 'created')
    if (DRY_RUN) {
      // Later records still resolve their links in a dry run.
      map?.set(record.id, `dry-run:${record.id}`)
      return undefined
    }
    const doc = (await payload.create({
      context,
      collection,
      data: (await create()) as never,
    })) as unknown as Found
    map?.set(record.id, doc.id)
    return doc
  }

  /** Give an existing record its image only while the field is empty (a later cache fill). */
  async function fillImage(
    collection: 'team' | 'projects' | 'news',
    doc: Found | undefined,
    field: 'photo' | 'heroImage',
    src: string | null | undefined,
    alt: string,
  ) {
    if (!doc || doc[field] || !src) return
    tally(`${collection} (${field})`, 'linked')
    if (DRY_RUN) return
    const image = await uploadImage(src, alt)
    if (image)
      await payload.update({
        context,
        collection,
        id: doc.id,
        data: { [field]: image },
      })
  }

  // Publications already imported, matched by DOI, else title ignoring case and
  // punctuation: Crossref and the scraped pages capitalise the same title differently.
  const titleKey = (title: string) => title.toLowerCase().replace(/[^\p{L}\p{N}]+/gu, '')
  const byTitle = new Map(
    (
      await payload.find({
        collection: 'publications',
        depth: 0,
        pagination: false,
        select: { title: true },
      })
    ).docs.map((doc) => [titleKey(doc.title), doc.id]),
  )
  for (const pub of publications) {
    const match =
      (
        await (pub.doi
          ? findOne('publications', { doi: { equals: normalizeDoi(pub.doi) } })
          : undefined)
      )?.id ?? byTitle.get(titleKey(pub.title))
    if (match) ids.publications.set(pub.id, match)
  }
  payload.logger.info(`${ids.publications.size} prototype Publications matched imported records`)

  const orgIds = confirmed('organizations')
  for (const org of organizations.filter((o) => orgIds.has(o.id))) {
    await ensure(
      'organizations',
      org,
      ids.organizations,
      [...(org.ror_id ? [{ ror_id: { equals: org.ror_id } }] : []), { name: { equals: org.name } }],
      async () => organizationData(org, await uploadImage(logos.get(org.id), `${org.name} logo`)),
    )
  }

  const themeIds = confirmed('research-themes')
  for (const theme of researchThemes.filter((t) => themeIds.has(t.id))) {
    await ensure(
      'research-themes',
      theme,
      ids.themes,
      [{ slug: { equals: theme.slug } }],
      async () => researchThemeData(theme),
    )
  }

  const teamIds = confirmed('team')
  for (const member of team.filter((m) => teamIds.has(m.id))) {
    noteDropped(`team/${member.id}`, 'organizations', ids.organizations, [member.affiliation])
    const person = await ensure(
      'team',
      member,
      ids.team,
      [
        ...(member.orcid ? [{ orcid: { equals: member.orcid } }] : []),
        { slug: { equals: member.slug } },
        {
          and: [
            { firstName: { equals: member.firstName } },
            { lastName: { equals: member.lastName } },
          ],
        },
      ],
      async () => teamData(mapping, member, await uploadImage(member.photo, member.name)),
    )
    await fillImage('team', person, 'photo', member.photo, member.name)
  }

  const grantIds = confirmed('grants')
  for (const grant of grants.filter((g) => grantIds.has(g.id))) {
    noteDropped(
      `grants/${grant.id}`,
      'team',
      ids.team,
      grant.investigators?.map((i) => i.teamMember),
    )
    noteDropped(`grants/${grant.id}`, 'themes', ids.themes, grant.themes)
    await ensure('grants', grant, ids.grants, [{ slug: { equals: grant.slug } }], async () =>
      grantData(mapping, grant),
    )
  }

  const awardIds = confirmed('awards')
  for (const award of awards.filter((a) => awardIds.has(a.id))) {
    noteDropped(
      `awards/${award.id}`,
      'team',
      ids.team,
      award.recipients?.map((r) => r.teamMember),
    )
    await ensure(
      'awards',
      award,
      ids.awards,
      [
        {
          and: [{ title: { equals: award.title } }, { year: { equals: award.year } }],
        },
      ],
      async () => awardData(mapping, award),
    )
  }

  // Publications own their Awards; add each confirmed one the Publication lacks.
  for (const pub of publications) {
    const pubId = ids.publications.get(pub.id)
    const wanted = (pub.awards ?? [])
      .map((id) => ids.awards.get(id))
      .filter((id): id is string => Boolean(id))
    if (!pubId || !wanted.length) continue
    const doc = await payload.findByID({
      collection: 'publications',
      id: pubId,
      depth: 0,
    })
    const current = ((doc.awards ?? []) as string[]).map(String)
    const missing = wanted.filter((id) => !current.includes(id))
    if (!missing.length) continue
    tally('publications (award links)', 'linked')
    if (!DRY_RUN) {
      await payload.update({
        context,
        collection: 'publications',
        id: pubId,
        data: { awards: [...current, ...missing] },
      })
    }
  }

  const projectIds = confirmed('projects')
  for (const project of projects.filter((p) => projectIds.has(p.id))) {
    const owner = `projects/${project.id}`
    noteDropped(owner, 'team', ids.team, project.teamMembers)
    noteDropped(owner, 'grants', ids.grants, project.grants)
    noteDropped(owner, 'themes', ids.themes, project.themes)
    noteDropped(owner, 'publications (not imported)', ids.publications, project.publications)
    noteDropped(owner, 'awards', ids.awards, project.awards)
    const existing = await ensure(
      'projects',
      project,
      undefined,
      [{ slug: { equals: project.slug } }],
      async () =>
        projectData(mapping, project, await uploadImage(project.heroImage, project.title)),
    )
    await fillImage('projects', existing, 'heroImage', project.heroImage, project.title)
    // Second run, after the imports: fill Publication links only where none exist.
    const links = projectData(mapping, project).publications ?? []
    if (existing && !(existing.publications as unknown[] | undefined)?.length && links.length) {
      tally('projects', 'linked')
      if (!DRY_RUN) {
        await payload.update({
          context,
          collection: 'projects',
          id: existing.id,
          data: { publications: links },
        })
      }
    }
  }

  const newsIds = confirmed('news')
  for (const item of news.filter((n) => newsIds.has(n.id))) {
    const doc = await ensure('news', item, undefined, [{ slug: { equals: item.id } }], async () =>
      newsData(item, await uploadImage(item.photo, item.title)),
    )
    await fillImage('news', doc, 'photo', item.photo, item.title)
  }

  // Configuration rather than DIAL data: the contact page needs this Form.
  await ensure(
    'forms',
    { id: 'contact' },
    undefined,
    [{ title: { equals: 'Contact' } }],
    async () => contactFormData(),
  )

  // LabInfo is a global: fill it only if it has never been saved. An unsaved
  // global still reads back its field defaults, so `name` alone proves nothing.
  const current = await payload.findGlobal({ slug: 'lab-info', depth: 0 })
  if (current.updatedAt) {
    tally('lab-info', 'existing')
  } else {
    tally('lab-info', 'created')
    if (!DRY_RUN) {
      await payload.updateGlobal({
        context,
        slug: 'lab-info',
        data: labInfoData(
          mapping,
          labInfo,
          homePartnerOrganizationIds,
          collaboratingOrganizationIds,
        ),
      })
    }
  }

  for (const [collection, { created, existing, linked }] of report) {
    console.log(
      `${collection.padEnd(28)} created ${created}, existing ${existing}, linked ${linked}`,
    )
  }
  console.log(`Unconfirmed or unimported references dropped: ${dropped.length}`)
  for (const line of dropped) console.log(`  ${line}`)
  if (DRY_RUN) console.log('dry-run: nothing written')
}

await main()
