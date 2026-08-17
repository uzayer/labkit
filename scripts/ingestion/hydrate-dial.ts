/**
 * One-time hydrate: reads DIAL's curated markdown data
 * (labs/dial/dial-data/) and upserts it into PayloadCMS via the
 * Local API, in dependency order (themes -> orgs -> venues -> team ->
 * grants -> publications -> awards -> projects).
 *
 * Run: pnpm payload run scripts/ingestion/hydrate-dial.ts [dry-run]
 *
 * Gotcha: `payload run` parses argv through minimist and only forwards
 * positional args to the script — a `--dry-run` flag is silently swallowed
 * before it reaches process.argv. Use the bare word `dry-run`, not `--dry-run`.
 *
 * Idempotent: re-running upserts by stable key (slug / DOI / title / name)
 * instead of tracking IDs across runs. A second run should report 0 created.
 */
import fs from 'node:fs'
import path from 'node:path'
import { getPayload } from 'payload'
import type { Where } from 'payload'
import config from '@payload-config'

import {
  readFrontmatter,
  readFrontmatterWithBody,
  readYamlBody,
  listMarkdownFiles,
} from '@/lib/ingestion/frontmatter'
import { slugify } from '@/lib/ingestion/normalize'
import { resolveByName, type NameLookupEntry, type TitleCandidate } from '@/lib/ingestion/match'
import { hydrateAward } from '@/lib/ingestion/awards'
import { mapCrossrefToPublicationFields } from '@/lib/ingestion/crossref'
import { hydrateGrant } from '@/lib/ingestion/grants'
import { mapOpenAlexToPublicationFields } from '@/lib/ingestion/openalex'
import { hydrateProject } from '@/lib/ingestion/projects'
import { upsertByKey } from '@/lib/ingestion/upsert'
import { ImportReport } from '@/lib/ingestion/report'
import { hydrateTeamMember, splitTeamMemberName } from '@/lib/ingestion/team'

const DRY_RUN = process.argv.includes('dry-run')
const DATA_DIR = path.resolve(process.cwd(), 'labs/dial/dial-data')
const FIXTURES_DIR = path.join(DATA_DIR, '_fixtures')

type Payload = Awaited<ReturnType<typeof getPayload>>
type Report = ImportReport
type IdEntry = { id: string }

function readJsonFixture(subdir: string, doi: string): unknown | null {
  const filePath = path.join(FIXTURES_DIR, subdir, `${doi.replace(/\//g, '_')}.json`)
  if (!fs.existsSync(filePath)) return null
  return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
}

// --- 1. Research Themes -----------------------------------------------

async function hydrateThemes(payload: Payload, report: Report) {
  const body = readYamlBody(path.join(DATA_DIR, '_reference/research-themes.md')) as {
    entries: Array<{ title: string; slug: string; shortDescription?: string; featured?: boolean }>
  }
  const index = new Map<string, { id: string; title: string }>()

  for (const entry of body.entries) {
    const { id, action } = await upsertByKey({
      payload,
      collection: 'research-themes',
      where: { slug: { equals: entry.slug } },
      data: {
        title: entry.title,
        slug: entry.slug,
        slugLock: true,
        shortDescription: entry.shortDescription,
        featured: entry.featured ?? false,
      },
      dryRun: DRY_RUN,
    })
    report.record('research-themes', action)
    index.set(entry.slug, { id: id!, title: entry.title })
  }
  return index
}

// --- 2. Organizations ---------------------------------------------------

async function hydrateOrganizations(payload: Payload, report: Report) {
  const body = readYamlBody(path.join(DATA_DIR, '_reference/organizations.md')) as {
    entries: Array<{
      name: string
      shortName?: string
      type?: string
      url?: string
      country?: string
    }>
  }
  const index: NameLookupEntry[] = []

  for (const entry of body.entries) {
    const { id, action } = await upsertByKey({
      payload,
      collection: 'organizations',
      where: { name: { equals: entry.name } },
      data: {
        name: entry.name,
        shortName: entry.shortName,
        type: entry.type,
        url: entry.url,
        country: entry.country,
      },
      dryRun: DRY_RUN,
    })
    report.record('organizations', action)
    index.push({ id: id!, name: entry.name, shortName: entry.shortName })
  }
  return index
}

// --- 3. Venues -----------------------------------------------------------

async function hydrateVenues(payload: Payload, report: Report, orgIndex: NameLookupEntry[]) {
  const body = readYamlBody(path.join(DATA_DIR, '_reference/venues.md')) as {
    entries: Array<{
      name: string
      shortName?: string
      type?: string
      publisher?: string
      url?: string
      issn?: string
    }>
  }
  const index: NameLookupEntry[] = []

  for (const entry of body.entries) {
    const publisherOrg = entry.publisher ? resolveByName(entry.publisher, orgIndex) : null
    const where: Where = entry.shortName
      ? { shortName: { equals: entry.shortName } }
      : { name: { equals: entry.name } }

    const { id, action } = await upsertByKey({
      payload,
      collection: 'venues',
      where,
      data: {
        name: entry.name,
        shortName: entry.shortName,
        type: entry.type,
        url: entry.url,
        issn: entry.issn,
        publisher: publisherOrg?.id,
      },
      dryRun: DRY_RUN,
    })
    report.record('venues', action)
    if (entry.publisher && !publisherOrg) {
      report.flagUnmatched({
        collection: 'venues',
        field: 'publisher',
        sourceContext: entry.name,
        value: entry.publisher,
      })
    }
    index.push({ id: id!, name: entry.name, shortName: entry.shortName })
  }
  return index
}

// --- 4. Team ---------------------------------------------------------------

async function hydrateTeam(
  payload: Payload,
  report: Report,
  orgIndex: NameLookupEntry[],
  themeIndex: Map<string, { id: string; title: string }>,
) {
  const index = new Map<string, IdEntry>()
  const byNormalizedName = new Map<string, string>()

  // Slugged single-person files.
  const slugFiles = [
    ...listMarkdownFiles(path.join(DATA_DIR, 'team/faculty')),
    ...listMarkdownFiles(path.join(DATA_DIR, 'team/researchers')),
  ]
  for (const filePath of slugFiles) {
    const { frontmatter, body } = readFrontmatterWithBody(filePath) as {
      frontmatter: Record<string, any>
      body: string
    }
    const fm = frontmatter
    const bioSource = [fm.note, body].filter(Boolean).join('\n\n')
    const fullName = `${fm.firstName} ${fm.lastName}`
    const id = await hydrateTeamMember(
      payload,
      report,
      {
        slug: fm.slug,
        firstName: fm.firstName,
        lastName: fm.lastName,
        fullName,
        rawRole: fm.role,
        alumniNote: fm.alumniNote,
        title: fm.title,
        email: fm.email,
        displayInWebsite: fm.displayInWebsite,
        researchInterests: fm.researchInterests,
        socials: fm.socials,
        affiliation: fm.affiliation,
        bioText: bioSource || undefined,
        reportUnmatchedAffiliation: true,
      },
      orgIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(fm.slug, { id })
    byNormalizedName.set(fullName.trim().toLowerCase(), fm.slug)
  }

  // Alumni roster — dedupe against slugged files by normalized full name.
  const alumniBody = readYamlBody(path.join(DATA_DIR, 'team/alumni.md')) as {
    members: Array<{ name: string; alumniNote?: string; currentPosition?: string }>
  }
  for (const member of alumniBody.members) {
    const normalized = member.name.trim().toLowerCase()
    if (byNormalizedName.has(normalized)) {
      console.log(
        `[team] Merged duplicate alumni roster entry into existing record: "${member.name}"`,
      )
      continue
    }
    const { firstName, lastName } = splitTeamMemberName(member.name)
    const slug = slugify(member.name)
    const id = await hydrateTeamMember(
      payload,
      report,
      {
        slug,
        firstName,
        lastName,
        fullName: member.name,
        rawRole: 'alumni',
        alumniNote: member.alumniNote,
        currentPosition: member.currentPosition ?? member.alumniNote,
        title: member.currentPosition ?? member.alumniNote ?? 'Alumni',
      },
      orgIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(slug, { id })
    byNormalizedName.set(normalized, slug)
  }

  // Collaborators — two sections (current/past), different field names.
  const collabBody = readYamlBody(path.join(DATA_DIR, 'team/collaborators.md')) as {
    current: Array<{ name: string; affiliation?: string }>
    past: Array<{ name: string; note?: string }>
  }
  for (const collaborator of [...collabBody.current, ...collabBody.past]) {
    const normalized = collaborator.name.trim().toLowerCase()
    if (byNormalizedName.has(normalized)) continue

    const { firstName, lastName } = splitTeamMemberName(collaborator.name)
    const slug = slugify(collaborator.name)
    const affiliationText =
      (collaborator as { affiliation?: string }).affiliation ??
      (collaborator as { note?: string }).note
    const id = await hydrateTeamMember(
      payload,
      report,
      {
        slug,
        firstName,
        lastName,
        fullName: collaborator.name,
        rawRole: 'external-collaborator',
        title: 'External Collaborator',
        affiliation: affiliationText,
      },
      orgIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(slug, { id })
    byNormalizedName.set(normalized, slug)
  }

  // Graduate RAs.
  const gradBody = readYamlBody(path.join(DATA_DIR, 'team/graduate-ras.md')) as {
    members: Array<{ firstName: string; lastName: string }>
  }
  for (const member of gradBody.members) {
    const fullName = `${member.firstName} ${member.lastName}`
    if (byNormalizedName.has(fullName.trim().toLowerCase())) continue
    const slug = slugify(fullName)
    const id = await hydrateTeamMember(
      payload,
      report,
      {
        slug,
        firstName: member.firstName,
        lastName: member.lastName,
        fullName,
        rawRole: 'graduate-ra',
        title: 'Graduate Research Assistant',
      },
      orgIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(slug, { id })
    byNormalizedName.set(fullName.trim().toLowerCase(), slug)
  }

  // Undergraduate RAs.
  const undergradBody = readYamlBody(path.join(DATA_DIR, 'team/undergraduate-ras.md')) as {
    members: Array<{ firstName: string; lastName: string; note?: string }>
  }
  for (const member of undergradBody.members) {
    const fullName = `${member.firstName} ${member.lastName}`
    if (byNormalizedName.has(fullName.trim().toLowerCase())) continue
    const slug = slugify(fullName)
    const title = member.note
      ? `Undergraduate Research Assistant (${member.note})`
      : 'Undergraduate Research Assistant'
    const id = await hydrateTeamMember(
      payload,
      report,
      {
        slug,
        firstName: member.firstName,
        lastName: member.lastName,
        fullName,
        rawRole: 'undergraduate-ra',
        title,
      },
      orgIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(slug, { id })
    byNormalizedName.set(fullName.trim().toLowerCase(), slug)
  }

  return index
}

// --- 5. Grants -------------------------------------------------------------

async function hydrateGrants(
  payload: Payload,
  report: Report,
  orgIndex: NameLookupEntry[],
  teamIndex: Map<string, IdEntry>,
  themeIndex: Map<string, { id: string; title: string }>,
) {
  const index = new Map<string, IdEntry>()

  for (const filePath of listMarkdownFiles(path.join(DATA_DIR, 'grants'))) {
    const fm = readFrontmatter(filePath) as Record<string, any>
    const id = await hydrateGrant(
      payload,
      report,
      {
        slug: fm.slug,
        title: fm.title,
        description: fm.description,
        grantNumber: fm.grantNumber,
        amountValue: fm.amountValue,
        amountCurrency: fm.amountCurrency,
        startYear: fm.startDate,
        endYear: fm.endDate,
        status: fm.status,
        funder: fm.funder,
        investigators: ((fm.investigators ?? []) as Array<Record<string, any>>).map((inv) => ({
          teamMemberSlug: inv.teamMember,
          customInvestigator: inv.customInvestigator,
          role: inv.role,
        })),
        themes: fm.themes,
      },
      orgIndex,
      teamIndex,
      themeIndex,
      DRY_RUN,
    )
    index.set(fm.slug, { id })
  }
  return index
}

// --- 6. Publications ---------------------------------------------------------

async function hydratePublications(
  payload: Payload,
  report: Report,
  venueIndex: NameLookupEntry[],
  teamIndex: Map<string, IdEntry>,
  themeIndex: Map<string, { id: string; title: string }>,
) {
  const index: Array<{ id: string; title: string; doi?: string }> = []

  for (const filePath of listMarkdownFiles(path.join(DATA_DIR, 'publications'))) {
    const fm = readFrontmatter(filePath) as { year?: number; sourceNote?: string }
    const body = readYamlBody(filePath) as { publications: Array<Record<string, any>> }

    for (const pub of body.publications) {
      const year = pub.year ?? fm.year
      const venue = pub.venue ? resolveByName(pub.venue, venueIndex) : null
      const themes = ((pub.themes ?? []) as string[])
        .map((slug) => themeIndex.get(slug)?.id)
        .filter((id): id is string => Boolean(id))

      const authors = ((pub.authors ?? []) as Array<Record<string, any>>).map((a) => {
        if (a.teamMember) {
          const team = teamIndex.get(a.teamMember)
          if (!team) {
            report.flagUnmatched({
              collection: 'publications',
              field: 'authors.teamMember',
              sourceContext: pub.title,
              value: a.teamMember,
            })
            return { customAuthor: { name: a.teamMember } }
          }
          return { teamMember: team.id }
        }
        return { customAuthor: { name: a.customAuthor } }
      })

      const doi: string | undefined = pub.doi
      let apiFields: Record<string, unknown> = {}
      if (doi) {
        const crossrefFixture = readJsonFixture('crossref', doi)
        const openalexFixture = readJsonFixture('openalex', doi)
        apiFields = {
          ...(crossrefFixture ? mapCrossrefToPublicationFields(crossrefFixture) : {}),
          ...(openalexFixture ? mapOpenAlexToPublicationFields(openalexFixture) : {}),
        }
      }

      const data: Record<string, unknown> = {
        title: pub.title,
        year,
        status: pub.status ?? 'published',
        type: pub.type,
        doi,
        themes,
        authors,
        ...apiFields,
        provenance: {
          source: doi ? 'crossref' : 'manual',
          importedAt: new Date().toISOString(),
          sourceNote: fm.sourceNote,
        },
      }
      if (venue) data.venue = venue.id
      else if (pub.venue) data.venueLabel = pub.venue

      const where: Where = doi ? { doi: { equals: doi } } : { title: { equals: pub.title } }
      const { id, action } = await upsertByKey({
        payload,
        collection: 'publications',
        where,
        data,
        dryRun: DRY_RUN,
      })
      report.record('publications', action)
      index.push({ id: id!, title: pub.title, doi })

      if (pub.venue && !venue) {
        report.flagUnmatched({
          collection: 'publications',
          field: 'venue',
          sourceContext: pub.title,
          value: pub.venue,
        })
      }
    }
  }
  return index
}

// --- 7. Awards ---------------------------------------------------------------

async function hydrateAwards(
  payload: Payload,
  report: Report,
  orgIndex: NameLookupEntry[],
  teamIndex: Map<string, IdEntry>,
  pubIndex: Array<{ id: string; title: string; doi?: string }>,
) {
  const fm = readFrontmatter(path.join(DATA_DIR, 'awards/awards.md')) as { sourceNote?: string }
  const body = readYamlBody(path.join(DATA_DIR, 'awards/awards.md')) as {
    awards: Array<Record<string, any>>
  }
  const pubCandidates: TitleCandidate[] = pubIndex.map((p) => ({ id: p.id, title: p.title }))

  for (const award of body.awards) {
    await hydrateAward(
      payload,
      report,
      {
        title: award.title,
        year: award.year,
        endYear: award.endYear,
        category: award.category,
        scope: award.scope,
        featured: award.isFeatured,
        organization: award.organization,
        recipientSlugs: award.recipients,
        externalRecipients: award.externalRecipients,
        linkedPublication: award.linkedPublication,
        sourceNote: fm.sourceNote,
      },
      orgIndex,
      teamIndex,
      pubCandidates,
      DRY_RUN,
    )
  }
}

// --- 8. Projects ---------------------------------------------------------------

async function hydrateProjects(
  payload: Payload,
  report: Report,
  teamIndex: Map<string, IdEntry>,
  grantIndex: Map<string, IdEntry>,
  pubIndex: Array<{ id: string; title: string; doi?: string }>,
  themeIndex: Map<string, { id: string; title: string }>,
) {
  const pubCandidates: TitleCandidate[] = pubIndex.map((p) => ({ id: p.id, title: p.title }))

  for (const filePath of listMarkdownFiles(path.join(DATA_DIR, 'projects'))) {
    const { frontmatter, body } = readFrontmatterWithBody(filePath) as {
      frontmatter: Record<string, any>
      body: string
    }
    const fm = frontmatter
    await hydrateProject(
      payload,
      report,
      {
        title: fm.title,
        slug: fm.slug,
        teamMemberSlugs: fm.teamMembers,
        grantSlugs: fm.grants,
        themes: fm.themes,
        publicationQueries: fm.publications,
        status: fm.status,
        needsResearch: fm['needs-research'],
        contentText: body || undefined,
      },
      teamIndex,
      grantIndex,
      pubCandidates,
      themeIndex,
      DRY_RUN,
    )
  }
}

// --- main ---------------------------------------------------------------

async function main() {
  const payload = await getPayload({ config })
  const report = new ImportReport()

  const themeIndex = await hydrateThemes(payload, report)
  const orgIndex = await hydrateOrganizations(payload, report)
  const venueIndex = await hydrateVenues(payload, report, orgIndex)
  const teamIndex = await hydrateTeam(payload, report, orgIndex, themeIndex)
  const grantIndex = await hydrateGrants(payload, report, orgIndex, teamIndex, themeIndex)
  const pubIndex = await hydratePublications(payload, report, venueIndex, teamIndex, themeIndex)
  await hydrateAwards(payload, report, orgIndex, teamIndex, pubIndex)
  await hydrateProjects(payload, report, teamIndex, grantIndex, pubIndex, themeIndex)

  report.print(DRY_RUN)
  fs.mkdirSync(FIXTURES_DIR, { recursive: true })
  report.writeJson(path.join(FIXTURES_DIR, 'hydrate-report.json'))

  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
