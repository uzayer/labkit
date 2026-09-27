/**
 * First-pass DIAL scope triage of the review manifest with TypeSafe's Jev.
 *
 * Writes only a `triage` routing hint onto each row; `status` and
 * `decisionNote` stay the Operator's. "confirmed" still needs the PI or a Lab
 * Editor. No Payload connection or writes.
 *
 *   TYPESAFE_API_KEY=… bun run payload -- run scripts/ingestion/triage-dial-manifest.ts [dry-run]
 *
 * Jev sees only the raw capture excerpt the row's sourceNote cites, never the
 * prototype record, because the prototype's own copy may already assert DIAL
 * ownership the source does not. Rows with no raw excerpt (ORCID-only
 * Publications) are `no-excerpt` without a call. The scope rule is the one that
 * scored 12/12 in labs/dial/benchmark/run-jev.py: kind "none" → outside, else
 * an explicit-ownership probability ≥ 0.5 → dial, else review.
 */
import { readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

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

const DRY_RUN = process.argv.includes('dry-run')
const MANIFEST = path.resolve(process.cwd(), 'labs/dial/working-data/review-manifest.json')
const SCRAPES = path.resolve(process.cwd(), 'labs/dial/scraped-data')
const URL = `${(process.env.TYPESAFE_BASE_URL ?? 'https://api.typesafe.ai').replace(/\/$/, '')}/v1/systemone`
const CONCURRENCY = 8
const EXCERPT_LIMIT = 4000

interface ManifestRow {
  id: string
  collection: string
  recordId: string
  label: string
  source: string
  sourceNote: string
  status: string
  decisionNote: string
  triage?: Triage
}

interface Triage {
  suggestion: 'dial' | 'review' | 'outside' | 'no-excerpt'
  model?: string
  dialOwned?: number
  kind?: string
  /** False when Jev read the excerpt as a different record type than the row. */
  kindMatches?: boolean
  excerptFrom: string[]
}

// Same wording as the benchmark, where it is measured.
const KIND = {
  type: 'choice',
  instructions: 'What is the primary LabKit record this excerpt claims?',
  criteria: {
    team: 'A named researcher',
    publication: 'A scholarly citation',
    project: 'A named body of research work',
    grant: 'Funding',
    award: 'A recognition',
    news: 'An event or dated announcement',
    none: 'No record',
  },
}
const DIAL_OWNED = {
  type: 'noul',
  instructions:
    'The excerpt explicitly states that DIAL (the Design Inclusion and Access Lab) ' +
    'itself owns, ran, or is the affiliation of this person or work. DIAL members ' +
    'merely attending or appearing somewhere does not count.',
}
// Unmeasured variant: the benchmark has no Organization cases.
const DIAL_PARTNER = {
  type: 'noul',
  instructions:
    'The excerpt explicitly states that this organization partners with, funds, or ' +
    'collaborates with DIAL (the Design Inclusion and Access Lab).',
}

const EXPECTED_KIND: Record<string, string> = {
  team: 'team',
  publications: 'publication',
  projects: 'project',
  grants: 'grant',
  awards: 'award',
  news: 'news',
}

const records = new Map<string, Record<string, unknown>>(
  Object.entries({
    team,
    projects,
    grants,
    awards,
    'research-themes': researchThemes,
    news,
    publications,
    organizations,
  }).flatMap(([collection, list]) =>
    (list as Record<string, unknown>[]).map((record) => [`${collection}/${record.id}`, record]),
  ),
)

/** Names a raw capture would use for this record, most specific first. */
function searchTerms(row: ManifestRow) {
  const record = records.get(row.id) ?? {}
  // `"Section" → "Entry"`: the entry is the most specific name for the row.
  const arrowed = [...row.sourceNote.matchAll(/→\s*["“]?([^"”;]+)["”]/g)].map((m) => m[1].trim())
  // Any other quoted heading, last and only when long enough to be distinctive.
  const quoted = [...row.sourceNote.matchAll(/["“]([^"”]{8,})["”]/g)].map((m) => m[1].trim())
  return [
    ...arrowed,
    record.name,
    record.title,
    record.shortName,
    record.lastName && record.firstName ? `${record.firstName} ${record.lastName}` : undefined,
    ...quoted,
  ]
    .filter(
      (term): term is string => typeof term === 'string' && term.length >= 4 && !/^\d+$/.test(term),
    )
    .map((term) => term.toLowerCase())
}

const FILE =
  /(?:labs\/dial\/scraped-data\/)?((?:nsu-hci-current-website|nova-ahmed-personal-site)\/[\w.-]+\.md|DIAL Proposal\.md)/g

const fileCache = new Map<string, string[] | null>()
async function lines(file: string) {
  if (!fileCache.has(file)) {
    fileCache.set(
      file,
      await readFile(path.join(SCRAPES, file), 'utf8').then(
        (text) => text.split('\n'),
        () => null,
      ),
    )
  }
  return fileCache.get(file)
}

/** The raw capture lines the sourceNote points at: cited lines, else the first name hit. */
async function excerpt(row: ManifestRow) {
  const matches = [...row.sourceNote.matchAll(FILE)]
  const parts: string[] = []
  const from: string[] = []
  for (const [index, match] of matches.entries()) {
    const file = match[1]
    const text = await lines(file)
    if (!text || from.includes(file)) continue
    const clause = row.sourceNote.slice(
      match.index + match[0].length,
      matches[index + 1]?.index ?? undefined,
    )
    const cited = clause.match(/^:(\d+)(?:-(\d+))?/) ?? clause.match(/\bline (\d+)/)
    let start: number
    let end: number
    if (cited) {
      start = Number(cited[1]) - 1
      end = cited[2] ? Number(cited[2]) : start + 1
    } else {
      const terms = searchTerms(row)
      // Most specific term first: a vaguer term must not win on an earlier line.
      // Table-of-contents and nav lines are bare links, not the record itself.
      const isLink = (line: string) => /^\s*[-*]?\s*\[[^\]]*\]\([^)]*\)\s*$/.test(line)
      const find = (term: string, skipLinks: boolean) =>
        text.findIndex((line) => line.toLowerCase().includes(term) && !(skipLinks && isLink(line)))
      const hit =
        terms.map((term) => find(term, true)).find((index) => index >= 0) ??
        terms.map((term) => find(term, false)).find((index) => index >= 0) ??
        -1
      if (hit < 0) continue
      start = hit
      end = hit + 6
    }
    const block = text
      .slice(Math.max(0, start - 1), Math.min(text.length, end + 1))
      .join('\n')
      .trim()
    if (!block) continue
    parts.push(block.slice(0, 1500))
    from.push(file)
  }
  return { state: parts.join('\n\n').slice(0, EXCERPT_LIMIT), from }
}

async function ask(state: string, questions: Record<string, unknown>) {
  for (let attempt = 1; ; attempt++) {
    const res = await fetch(URL, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ model: 'jev-latest', state, questions }),
    })
    if (res.ok) {
      return (await res.json()) as {
        model: string
        answers: Record<string, { choice?: string; noul?: number }>
        usage?: { input_tokens?: number }
      }
    }
    if (attempt >= 4 || (res.status !== 429 && res.status < 500)) {
      throw new Error(`Jev ${res.status}: ${(await res.text()).slice(0, 300)}`)
    }
    await new Promise((resolve) => setTimeout(resolve, 1000 * 2 ** attempt))
  }
}

let inputTokens = 0

async function triage(row: ManifestRow): Promise<Triage> {
  // The Lab's own taxonomy; no capture states it (see the rows' sourceNotes).
  if (row.collection === 'research-themes') return { suggestion: 'no-excerpt', excerptFrom: [] }
  const { state, from } = await excerpt(row)
  if (!state) return { suggestion: 'no-excerpt', excerptFrom: [] }
  const expectedKind = EXPECTED_KIND[row.collection]
  const questions: Record<string, unknown> = {
    dial_owned: row.collection === 'organizations' ? DIAL_PARTNER : DIAL_OWNED,
  }
  if (expectedKind) questions.kind = KIND
  const response = await ask(state, questions)
  inputTokens += response.usage?.input_tokens ?? 0
  const dialOwned = response.answers.dial_owned.noul ?? 0
  const kind = response.answers.kind?.choice
  return {
    suggestion: kind === 'none' ? 'outside' : dialOwned >= 0.5 ? 'dial' : 'review',
    model: response.model,
    dialOwned: Math.round(dialOwned * 100) / 100,
    kind,
    kindMatches: expectedKind ? kind === expectedKind : undefined,
    excerptFrom: from,
  }
}

async function main() {
  if (!process.env.TYPESAFE_API_KEY) throw new Error('Set TYPESAFE_API_KEY')
  const rows = JSON.parse(await readFile(MANIFEST, 'utf8')) as ManifestRow[]
  let next = 0
  await Promise.all(
    Array.from({ length: CONCURRENCY }, async () => {
      while (next < rows.length) {
        const row = rows[next++]
        row.triage = await triage(row)
      }
    }),
  )

  const tally = new Map<string, number>()
  for (const row of rows) {
    const key = `${row.collection} ${row.triage?.suggestion}`
    tally.set(key, (tally.get(key) ?? 0) + 1)
  }
  for (const [key, count] of [...tally].sort()) console.log(`${key.padEnd(34)} ${count}`)
  const mismatched = rows.filter((row) => row.triage?.kindMatches === false)
  console.log(`kind mismatches: ${mismatched.length}`)
  for (const row of mismatched) console.log(`  ${row.id} → ${row.triage?.kind}`)
  // ORCID-only Publications have no capture by design; anything else is worth a look.
  const unexcerpted = rows.filter(
    (row) => row.triage?.suggestion === 'no-excerpt' && row.collection !== 'publications',
  )
  console.log(`no excerpt found (outside Publications): ${unexcerpted.length}`)
  for (const row of unexcerpted) console.log(`  ${row.id} — ${row.sourceNote.slice(0, 120)}`)
  console.log(`Jev input tokens: ${inputTokens}`)

  if (DRY_RUN) {
    console.log('dry-run: manifest not written')
    return
  }
  await writeFile(MANIFEST, `${JSON.stringify(rows, null, 2)}\n`)
  console.log(`Wrote triage hints to ${MANIFEST}`)
}

await main()
