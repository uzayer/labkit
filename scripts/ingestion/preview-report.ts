/**
 * Summarise an ingestion preview against what the public site needs to render.
 *
 * Run: pnpm payload run scripts/ingestion/preview-report.ts <preview.json> [since=YYYY]
 *
 * Every importer writes a preview file (`ingestion-previews/`, gitignored) holding
 * the records it would write. This script judges those records the way the
 * frontend will: each rule is a thing that would look wrong on the rendered
 * page (ROADMAP: "data needs to be presentable, not clean"). It prints counts
 * and a few short examples per rule — never whole records — so a dry run can be
 * read in one screen and compared run-over-run as fixes land.
 *
 * Adding a rule: append to PUBLICATION_RULES. A rule returns null when the
 * record is fine, or a short detail string used as the example.
 *
 * `since=YYYY` enables the out-of-range rule; without it, the preview's own
 * `since` (set by the importer) is used, then the year of LabInfo.foundingDate.
 */
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

import { normalizeTitle } from '@/lib/ingestion/normalize'
import type { CapturedRecord } from '@/lib/ingestion/report'

type Data = Record<string, any>

interface PreviewFile {
  meta: { label: string; dryRun?: boolean; since?: number; ownerMissing?: boolean }
  counts: Record<string, Record<string, number>>
  unmatched: Array<{ collection: string; field: string; value: string }>
  suggestions: Array<{ collection: string; value: string; suggestedMatch: string }>
  captured: CapturedRecord[]
}

interface PersonInfo {
  name: string
  isNew: boolean
  isLabMember: boolean
}

interface Context {
  people: Map<string, PersonInfo>
  venues: Map<string, { name: string; shortName?: string | null }>
  since?: number
  titleCounts: Map<string, number>
}

type Rule = { id: string; label: string; check: (pub: Data, ctx: Context) => string | null }

const truncate = (text: string, max = 70) =>
  text.length > max ? `${text.slice(0, max - 1).trimEnd()}…` : text

const MARKUP = /<[^>]+>|&[a-z]+;|&#\d+;/i

function isShouting(text: string): boolean {
  const letters = text.replace(/[^a-z]/gi, '')
  return letters.length > 10 && letters === letters.toUpperCase()
}

const PUBLICATION_RULES: Rule[] = [
  {
    id: 'no-lab-author',
    label: 'no author is a visible, hand-entered Team Member',
    check: (pub, ctx) => {
      const ids: string[] = (pub.authors ?? []).map((a: Data) => a.teamMember).filter(Boolean)
      return ids.some((id) => ctx.people.get(id)?.isLabMember) ? null : pub.title
    },
  },
  {
    id: 'venue-free-text',
    label: 'venue is free text (no acronym, not groupable)',
    check: (pub) => (!pub.venue && pub.venueLabel ? pub.venueLabel : null),
  },
  {
    id: 'venue-no-acronym',
    label: 'venue record has no shortName',
    check: (pub, ctx) => {
      const venue = pub.venue ? ctx.venues.get(pub.venue) : undefined
      return venue && !venue.shortName ? venue.name : null
    },
  },
  {
    id: 'venue-missing',
    label: 'no venue at all',
    check: (pub) => (!pub.venue && !pub.venueLabel ? pub.title : null),
  },
  {
    id: 'type-unmapped',
    label: 'publication type unset',
    check: (pub) => (pub.type ? null : pub.title),
  },
  {
    id: 'no-abstract',
    label: 'no abstract',
    check: (pub) => (pub.abstract ? null : pub.title),
  },
  {
    id: 'oa-no-pdf',
    label: 'open access but no PDF link',
    check: (pub) => (pub.isOpenAccess && !pub.pdf?.link ? pub.title : null),
  },
  {
    id: 'before-lab',
    label: 'published before the lab range',
    check: (pub, ctx) => (ctx.since && pub.year < ctx.since ? `${pub.year} — ${pub.title}` : null),
  },
  {
    id: 'title-markup',
    label: 'title has markup/entities or is all caps',
    check: (pub) => (MARKUP.test(pub.title) || isShouting(pub.title) ? pub.title : null),
  },
  {
    id: 'abstract-markup',
    label: 'abstract has markup or a leading "Abstract"',
    check: (pub) =>
      pub.abstract && (MARKUP.test(pub.abstract) || /^\s*abstract\b/i.test(pub.abstract))
        ? pub.abstract
        : null,
  },
  {
    id: 'duplicate-title',
    label: 'same title as another record in this run (preprint + published?)',
    check: (pub, ctx) =>
      (ctx.titleCounts.get(normalizeTitle(pub.title)) ?? 0) > 1 ? pub.title : null,
  },
]

/**
 * Leading name tokens that carry no identity for clustering — common honorific
 * or prefix given-names in Bangladeshi/South Asian names ("Md. Jahidul Islam").
 * Matched after `normalizeTitle`, so punctuation is already stripped ("md." → "md").
 * Reporting heuristic only; ingestion's person matching never uses this.
 */
const NAME_PREFIX_TOKENS = new Set([
  'md',
  'mohammad',
  'mohammed',
  'muhammad',
  'mohd',
  'sk',
  'sheikh',
])

function personKey(name: string): string {
  const tokens = normalizeTitle(name).split(' ').filter(Boolean)
  if (tokens.length === 0) return ''
  const last = tokens[tokens.length - 1]
  // Skip prefix tokens among the given names, but never consume the surname;
  // if every given name is a prefix, fall back to the first token.
  const given = tokens.slice(0, -1)
  const first = given.find((t) => !NAME_PREFIX_TOKENS.has(t)) ?? tokens[0]
  return `${last} ${first[0]}`
}

function printRow(id: string, count: number, total: number, examples: string[]) {
  const pct = total > 0 ? Math.round((count / total) * 100) : 0
  const head = `  ${id.padEnd(18)} ${String(count).padStart(4)}  ${String(pct).padStart(3)}%`
  if (count === 0) {
    console.log(`${head}  ok`)
    return
  }
  if (examples.length === 0) {
    console.log(head)
    return
  }
  console.log(`${head}  e.g. ${examples.map((e) => `"${truncate(e, 60)}"`).join(' · ')}`)
}

async function main() {
  const args = process.argv.slice(2)
  const file = args.find((arg) => !arg.startsWith('since='))
  const sinceArg = args.find((arg) => arg.startsWith('since='))
  if (!file) {
    console.error(
      'Usage: pnpm payload run scripts/ingestion/preview-report.ts <preview.json> [since=YYYY]',
    )
    process.exit(1)
  }

  const preview = JSON.parse(fs.readFileSync(file, 'utf8')) as PreviewFile
  const payload = await getPayload({ config })

  const [teamDocs, venueDocs, labInfo] = await Promise.all([
    payload.find({ collection: 'team', pagination: false, depth: 0, overrideAccess: true }),
    payload.find({ collection: 'venues', pagination: false, depth: 0, overrideAccess: true }),
    payload.findGlobal({ slug: 'lab-info', depth: 0, overrideAccess: true }),
  ])

  const people = new Map<string, PersonInfo>()
  for (const doc of teamDocs.docs) {
    people.set(doc.id, {
      name: doc.name ?? '',
      isNew: false,
      isLabMember: doc.source !== 'import' && doc.displayInWebsite !== false,
    })
  }
  const venues = new Map<string, { name: string; shortName?: string | null }>()
  for (const doc of venueDocs.docs) venues.set(doc.id, { name: doc.name, shortName: doc.shortName })

  const byCollection = (slug: string) => preview.captured.filter((c) => c.collection === slug)
  const newPeople = byCollection('team').filter((c) => c.id && !people.has(c.id))
  for (const record of newPeople) {
    people.set(record.id!, { name: record.data.name as string, isNew: true, isLabMember: false })
  }
  for (const record of byCollection('venues')) {
    if (record.id && !venues.has(record.id)) {
      venues.set(record.id, { name: record.data.name as string, shortName: null })
    }
  }

  const pubs = byCollection('publications').map((c) => c.data as Data)
  const titleCounts = new Map<string, number>()
  for (const pub of pubs) {
    const key = normalizeTitle(pub.title)
    titleCounts.set(key, (titleCounts.get(key) ?? 0) + 1)
  }

  const foundingYear = labInfo.foundingDate
    ? new Date(labInfo.foundingDate).getUTCFullYear()
    : undefined
  const since = sinceArg
    ? Number.parseInt(sinceArg.slice('since='.length), 10)
    : (preview.meta.since ?? foundingYear)
  const ctx: Context = { people, venues, since, titleCounts }

  const newOrgs = byCollection('organizations').filter((c) => c.action !== 'skipped-existing')
  console.log(
    `\n${preview.meta.label}${preview.meta.dryRun ? ' (dry run)' : ''} — ` +
      `${pubs.length} publications, ${newPeople.length} new people, ` +
      `${byCollection('venues').length} venues, ${newOrgs.length} organizations` +
      (since ? `, lab range from ${since}` : ', no lab range (pass since=YYYY)'),
  )

  if (preview.meta.ownerMissing) {
    console.log(
      '\n!!! ORCID owner is not a Team Member — import the lab roster first. In this preview the ' +
        'owner is a hidden imported co-author on their own papers.',
    )
  }

  console.log(`\nPublications (${pubs.length})`)
  for (const rule of PUBLICATION_RULES) {
    if (rule.id === 'before-lab' && !since) continue
    const failures = pubs.map((pub) => rule.check(pub, ctx)).filter((d): d is string => !!d)
    printRow(rule.id, failures.length, pubs.length, failures.slice(0, 3))
  }

  const labels = new Map<string, number>()
  for (const pub of pubs) {
    if (!pub.venue && pub.venueLabel)
      labels.set(pub.venueLabel, (labels.get(pub.venueLabel) ?? 0) + 1)
  }
  if (labels.size > 0) {
    const top = [...labels.entries()].sort((a, b) => b[1] - a[1]).slice(0, 5)
    console.log(`\n  ${labels.size} distinct free-text venues; most frequent:`)
    for (const [label, n] of top) console.log(`    ${String(n).padStart(3)}  ${truncate(label)}`)
  }

  console.log(`\nPeople`)
  const allPeople = [...people.entries()]
  const clusters = new Map<string, Set<string>>()
  for (const [, person] of allPeople) {
    const key = personKey(person.name)
    if (!key) continue
    if (!clusters.has(key)) clusters.set(key, new Set())
    clusters.get(key)!.add(person.name)
  }
  const splits = [...clusters.values()].filter(
    (names) =>
      names.size > 1 && [...names].some((n) => allPeople.some(([, p]) => p.isNew && p.name === n)),
  )
  const noAffiliation = newPeople.filter((p) => !p.data.affiliation && !p.data.affiliationLabel)
  printRow('new-hidden', newPeople.length, newPeople.length, [])
  printRow(
    'split-person',
    splits.length,
    splits.length,
    splits.slice(0, 3).map((names) => [...names].join(' / ')),
  )
  printRow(
    'no-affiliation',
    noAffiliation.length,
    newPeople.length,
    noAffiliation.slice(0, 3).map((p) => p.data.name as string),
  )

  console.log(`\nReview Items`)
  const grouped = new Map<string, number>()
  for (const entry of preview.unmatched) {
    const key = `${entry.collection}.${entry.field}`
    grouped.set(key, (grouped.get(key) ?? 0) + 1)
  }
  for (const [key, n] of [...grouped.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${key.padEnd(26)} ${String(n).padStart(4)}`)
  }
  console.log(
    `  ${'merge suggestions'.padEnd(26)} ${String(preview.suggestions.length).padStart(4)}`,
  )
  console.log('')

  process.exit(0)
}

await main()
