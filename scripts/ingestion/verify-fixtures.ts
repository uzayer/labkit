/**
 * Offline regression check for ingestion identity and client behaviour,
 * replayed from recorded Crossref, OpenAlex and ORCID responses in
 * `scripts/ingestion/fixtures/`. No network and no database: global `fetch`
 * is replaced by a router over the fixtures and throws on any URL it doesn't
 * know, so an accidental live call fails the run instead of passing quietly.
 *
 * Run: bun run payload -- run scripts/ingestion/verify-fixtures.ts
 *
 * Fixtures were recorded on 2026-11-04. Each file keeps the URL it came from;
 * re-recording means fetching that URL again and re-checking the labels.
 * Crossref search items and OpenAlex works are trimmed to the fields
 * ingestion reads. Anything derived or reconstructed says so in its `note`.
 * DBLP serves API clients an anti-bot page, so its responses are built here
 * in DBLP's JSON shape and labelled synthetic.
 */
import assert from 'node:assert/strict'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { mapCrossrefToPublicationFields } from '@labkit/core/ingestion/crossref'
import { fetchDblpRecordByTitle } from '@labkit/core/ingestion/dblp'
import {
  fetchCrossrefByDoi,
  fetchJsonWithRetry,
  fetchOpenAlexByDoi,
  resolveCrossrefTitle,
} from '@labkit/core/ingestion/fetch'
import { normalizeDoi } from '@labkit/core/ingestion/normalize'
import { mapOpenAlexToPublicationFields } from '@labkit/core/ingestion/openalex'
import {
  attachDblpPids,
  matchPersonToTeam,
  mergeAuthors,
  planTeamLink,
  type MergedAuthor,
  type TeamLookupEntry,
} from '@labkit/core/ingestion/people'
import { matchVenueByName, type VenueLookupEntry } from '@labkit/core/ingestion/publications'
import { stageOrcidCandidates, type StagedCandidate } from '@labkit/core/ingestion/staging'

const FIXTURES = path.join(path.dirname(fileURLToPath(import.meta.url)), 'fixtures')

// ─── Result bookkeeping ──────────────────────────────────────────────────────

const results: Array<{ group: string; name: string; pass: boolean; detail?: string }> = []
function check(group: string, name: string, run: () => void | string) {
  try {
    const detail = run()
    results.push({ group, name, pass: true, detail: detail || undefined })
  } catch (error) {
    results.push({ group, name, pass: false, detail: (error as Error).message.split('\n')[0] })
  }
}
async function checkAsync(group: string, name: string, run: () => Promise<void | string>) {
  try {
    const detail = await run()
    results.push({ group, name, pass: true, detail: detail || undefined })
  } catch (error) {
    results.push({ group, name, pass: false, detail: (error as Error).message.split('\n')[0] })
  }
}

// ─── Fixture loading and the offline fetch router ───────────────────────────

interface Recorded<T = unknown> {
  url: string
  recordedAt: string
  note?: string
  body: T
}
interface SearchFixture extends Recorded<{ message: { items: Array<Record<string, unknown>> } }> {
  input: { title?: string; year?: number; authors?: string[]; venue?: string; chunk?: string }
  expected: { doi: string | null; why: string; alsoCorrect?: string[] }
  source: string
}

const readJson = <T>(...parts: string[]): T =>
  JSON.parse(fs.readFileSync(path.join(FIXTURES, ...parts), 'utf8')) as T
const slug = (doi: string) => doi.toLowerCase().replace(/[^a-z0-9.]+/g, '_')
const crossrefBody = (doi: string) => readJson<Recorded>('crossref', `${slug(doi)}.json`).body
const openalexBody = (doi: string, variant = '') =>
  readJson<Recorded>('openalex', `${slug(doi)}${variant}.json`).body

const searchFixtures = new Map<string, SearchFixture>()
for (const file of fs.readdirSync(path.join(FIXTURES, 'search')).sort()) {
  searchFixtures.set(file.replace(/\.json$/, ''), readJson<SearchFixture>('search', file))
}
const searchByQuery = new Map<string, SearchFixture>()
for (const fixture of searchFixtures.values()) {
  searchByQuery.set(new URL(fixture.url).searchParams.get('query.bibliographic')!, fixture)
}

interface LoggedRequest {
  url: URL
  init?: RequestInit
}
const requestLog: LoggedRequest[] = []
/** Per-test overrides: return a Response to answer a URL, or undefined to fall through. */
let override: ((url: URL) => Response | Promise<Response> | undefined) | null = null
/** Synthetic DBLP search responses, keyed by the `q` parameter. */
const dblpResponses = new Map<string, unknown>()

const json = (body: unknown, status = 200, headers: Record<string, string> = {}) =>
  new Response(body === null ? '' : JSON.stringify(body), {
    status,
    headers: { 'content-type': 'application/json', ...headers },
  })

globalThis.fetch = (async (input: string | URL | Request, init?: RequestInit) => {
  const url = new URL(typeof input === 'string' ? input : input instanceof URL ? input : input.url)
  requestLog.push({ url, init })
  const overridden = override?.(url)
  if (overridden) return overridden

  if (url.hostname === 'api.crossref.org' && url.pathname === '/works') {
    const query = url.searchParams.get('query.bibliographic') ?? ''
    const fixture = searchByQuery.get(query)
    if (!fixture) throw new Error(`offline: no Crossref search fixture for "${query.slice(0, 60)}"`)
    const rows = Number(url.searchParams.get('rows') ?? 20)
    return json({ message: { items: fixture.body.message.items.slice(0, rows) } })
  }
  if (url.hostname === 'api.crossref.org' && url.pathname.startsWith('/works/')) {
    const doi = decodeURIComponent(url.pathname.slice('/works/'.length))
    return json(crossrefBody(doi))
  }
  if (url.hostname === 'api.openalex.org' && url.pathname.startsWith('/works/')) {
    const doi = decodeURIComponent(url.pathname.slice('/works/'.length)).replace(
      /^https:\/\/doi\.org\//,
      '',
    )
    return json(openalexBody(doi))
  }
  if (url.hostname === 'pub.orcid.org') {
    const id = url.pathname.split('/')[2]
    return json(readJson<Recorded>('orcid', `${id}.json`).body)
  }
  if (url.hostname === 'dblp.org') {
    const body = dblpResponses.get(url.searchParams.get('q') ?? '')
    if (body !== undefined) return json(body)
  }
  throw new Error(`offline: no fixture for ${url.href}`)
}) as typeof fetch

// ─── Helpers ─────────────────────────────────────────────────────────────────

function merged(doi: string, openalexVariant = ''): MergedAuthor[] {
  const crossref = mapCrossrefToPublicationFields(crossrefBody(doi))
  const openalex = mapOpenAlexToPublicationFields(openalexBody(doi, openalexVariant))
  return mergeAuthors(crossref.authors, openalex.authorships)
}

/**
 * Plays one paper's authors through Team resolution the way
 * resolveOrCreateTeamMember does: link on a Safe Match, otherwise create a
 * hidden record (keyed by its identifiers) that later papers can match.
 */
function importPaper(authors: MergedAuthor[], team: TeamLookupEntry[]) {
  return authors.map((person) => {
    const { match, create } = planTeamLink(person, team)
    const conflicts = match.conflicts
    if (match.team) {
      return { printed: person.fullName, linked: match.team, method: match.method, conflicts }
    }
    const created: TeamLookupEntry = {
      id: `new:${create.fullName}`,
      name: create.fullName,
      orcid: create.orcid,
      dblpPid: create.dblpPid,
    }
    team.push(created)
    return { printed: person.fullName, linked: created, method: 'created' as const, conflicts }
  })
}

const ANIK_ORCID = '0000-0002-9240-2108'
const NOVA_ORCID = '0000-0002-7715-1742'

/** DIAL roster records as they stood before the September import (rehearsal.db). */
function dialRoster(): TeamLookupEntry[] {
  return [
    { id: 'roster:nova', name: 'Nova Ahmed', alternateNames: ['N. Ahmed'], orcid: NOVA_ORCID },
    { id: 'roster:anik-saha', name: 'Anik Saha' },
    { id: 'roster:anik-sinha', name: 'Anik Sinha' },
    { id: 'roster:salekul', name: 'Salekul Islam' },
    { id: 'roster:manoshi', name: 'Manoshi Das Turjo' },
    { id: 'roster:rony', name: 'Rahat Jahangir Rony', orcid: '0000-0001-5788-2145' },
    {
      id: 'roster:lamia',
      name: 'Lamia Amin',
      alternateNames: ['Lamia Amin Tisha'],
      orcid: '0009-0009-4289-9230',
    },
  ]
}

// ─── 1. The ORCID swap that spread to 17 papers (JMIR preprint 105485) ──────

const SWAP = 'orcid-swap'
check(
  SWAP,
  'preprint 105485 (Sept clustering): no author takes an ORCID the paper does not assert',
  () => {
    const authors = merged('10.2196/preprints.105485', '.2026-09')
    const sahariyar = authors.find((a) => a.fullName === 'Hussain Md. Sahariyar')
    assert.ok(sahariyar, 'Sahariyar missing from merged authors')
    assert.equal(sahariyar.orcid, undefined, `Sahariyar got ORCID ${sahariyar.orcid}`)
    const withOrcid = authors.filter((a) => a.orcid).map((a) => a.fullName)
    assert.deepEqual(withOrcid, ['Nova Ahmed'])
  },
)

check(SWAP, 'import 105485 then CHI EA 2024: Anik Saha stays on the roster record', () => {
  const team = dialRoster()
  importPaper(merged('10.2196/preprints.105485', '.2026-09'), team)
  const second = importPaper(merged('10.1145/3613905.3650969'), team)
  const anik = second.find((row) => row.printed === 'Anik Saha')!
  assert.equal(anik.linked.id, 'roster:anik-saha', `linked to ${anik.linked.name} (${anik.method})`)
})

check(
  SWAP,
  'corrupted Team (Sahariyar holds Anik ORCID): ORCID match is vetoed by the name',
  () => {
    const team = [
      ...dialRoster(),
      { id: 'hidden:sahariyar', name: 'Hussain Md. Sahariyar', orcid: ANIK_ORCID },
    ]
    const [anik] = importPaper(
      merged('10.1145/3613905.3650969').filter((a) => a.fullName === 'Anik Saha'),
      team,
    )
    assert.notEqual(anik.linked.id, 'hidden:sahariyar', `linked by ${anik.method}`)
    // The conflict is raised for review, and the author still lands on the
    // roster record through the exact-name Safe Match.
    assert.deepEqual(
      anik.conflicts.map((c) => `${c.identifier}:${c.holder.id}`),
      ['orcid:hidden:sahariyar'],
    )
    assert.equal(anik.linked.id, 'roster:anik-saha')
  },
)

check(SWAP, 'conflict with no name match: the new record is created without the ORCID', () => {
  const team = [{ id: 'hidden:sahariyar', name: 'Hussain Md. Sahariyar', orcid: ANIK_ORCID }]
  const { match, create } = planTeamLink(
    merged('10.1145/3613905.3650969').find((a) => a.fullName === 'Anik Saha')!,
    team,
  )
  assert.equal(match.team, null)
  assert.equal(create.orcid, undefined)
})

check(SWAP, 'CHI EA 2023: per-paper ORCID wins over a disagreeing OpenAlex profile ORCID', () => {
  const neha = merged('10.1145/3544549.3573806').find((a) => a.fullName === 'Neha Kumar')!
  assert.equal(neha.orcid, '0000-0002-8722-6920')
})

check(SWAP, 'upper-limb papers: profile-only ORCIDs are never attached', () => {
  for (const doi of ['10.2139/ssrn.4190884', '10.1007/978-3-031-34586-9_3']) {
    const stamped = merged(doi).filter((a) => a.orcid)
    assert.deepEqual(
      stamped.map((a) => `${a.fullName}=${a.orcid}`),
      [],
      `${doi} stamped profile ORCIDs`,
    )
  }
})

check(SWAP, 'author lists that differ: affiliations pair by name, never by position', () => {
  const doi = '10.1145/3544549.3573806'
  const crossref = mapCrossrefToPublicationFields(crossrefBody(doi))
  const openalex = mapOpenAlexToPublicationFields(openalexBody(doi))
  // Derived: OpenAlex missing one author (Faria Noor), as happens when a
  // source drops or merges an authorship.
  const shortened = openalex.authorships!.filter((a) => a.displayName !== 'Faria Noor')
  const authors = mergeAuthors(crossref.authors, shortened)
  const institution = (name: string) => authors.find((a) => a.fullName === name)?.institutionName
  assert.equal(institution('Faria Noor'), undefined, `Faria Noor got ${institution('Faria Noor')}`)
  assert.equal(institution('Dipto Das'), 'University of Colorado Boulder')
  assert.equal(institution('Neha Kumar'), shortened.at(-1)!.institutions[0]?.name)
})

// ─── 2. JMIR / SSRN preprint–published pairs ─────────────────────────────────

const PAIRS = 'preprint-pairs'
check(PAIRS, 'JMIR 76934: preprint and published link the same people', () => {
  const team = dialRoster()
  const preprint = importPaper(merged('10.2196/preprints.76934'), team)
  const published = importPaper(merged('10.2196/76934'), team)
  assert.deepEqual(
    preprint.map((row) => row.linked.id),
    published.map((row) => row.linked.id),
  )
  const lamia = published.find((row) => row.printed === 'Lamia Amin Tisha')!
  assert.equal(lamia.linked.id, 'roster:lamia')
})

check(PAIRS, 'JMIR 76934: types stay preprint vs journal', () => {
  assert.equal(
    mapCrossrefToPublicationFields(crossrefBody('10.2196/preprints.76934')).type,
    'preprint',
  )
  assert.equal(mapCrossrefToPublicationFields(crossrefBody('10.2196/76934')).type, 'journal')
})

check(PAIRS, 'SSRN 4190884 vs LNICST: both name lists pair with OpenAlex cleanly', () => {
  for (const doi of ['10.2139/ssrn.4190884', '10.1007/978-3-031-34586-9_3']) {
    assert.equal(merged(doi).length, 8, `${doi} lost or gained authors`)
  }
})

// ─── 3. CHI vs CHI Extended Abstracts ────────────────────────────────────────

const CHI = 'chi-vs-chi-ea'
// The two curated venues exactly as scripts/ingestion/seed-venues.ts seeds them.
const chiVenues: VenueLookupEntry[] = [
  {
    id: 'venue:chi',
    name: 'ACM CHI Conference on Human Factors in Computing Systems',
    alternateNames: [
      'CHI Conference on Human Factors in Computing Systems',
      'SIGCHI Conference on Human Factors in Computing Systems',
    ],
  },
  {
    id: 'venue:chi-ea',
    name: 'Extended Abstracts of the CHI Conference on Human Factors in Computing Systems',
    alternateNames: ['CHI Conference Extended Abstracts on Human Factors in Computing Systems'],
  },
]
const venueOf = (doi: string) =>
  matchVenueByName(mapCrossrefToPublicationFields(crossrefBody(doi)).venueName!, chiVenues)

check(CHI, 'CHI 2023 full paper resolves to CHI', () => {
  assert.equal(venueOf('10.1145/3544548.3580661'), 'venue:chi')
})
check(CHI, 'CHI EA 2023 resolves to CHI EA', () => {
  assert.equal(venueOf('10.1145/3544549.3573806'), 'venue:chi-ea')
})
check(CHI, 'CHI EA 2022 ("…Systems Extended Abstracts") never resolves to CHI', () => {
  assert.notEqual(venueOf('10.1145/3491101.3519675'), 'venue:chi')
})

await checkAsync(
  CHI,
  'DBLP: a same-title CHI hit with another DOI is not taken for the CHI EA paper',
  async () => {
    // Synthetic DBLP response: the full paper and the extended abstract share
    // a title and a year; only the DOI tells them apart.
    const title = 'Addressing the Technology Learning Divide Using Co-Learning'
    const hit = (doi: string, pid: string, name: string) => ({
      info: {
        title: `${title}.`,
        year: '2024',
        doi,
        authors: { author: [{ '@pid': pid, text: name }] },
      },
    })
    dblpResponses.set(title, {
      result: {
        hits: {
          hit: [
            hit('10.1145/0000000.0000001', 'synthetic/wrong', 'Wrong Person'),
            hit('10.1145/3613905.3650969', 'synthetic/right', 'Anik Saha'),
          ],
        },
      },
    })
    const fetchDblp = fetchDblpRecordByTitle as (
      title: string,
      year: number,
      doi?: string,
    ) => ReturnType<typeof fetchDblpRecordByTitle>
    const match = await fetchDblp(title, 2024, '10.1145/3613905.3650969')
    assert.equal(match?.authors[0]?.pid, 'synthetic/right')
  },
)

// ─── 4. Md./Mohammad name variants ───────────────────────────────────────────

const NAMES = 'name-variants'
const majedur: TeamLookupEntry = {
  id: 'roster:majedur',
  name: 'Majedur Rahman',
  alternateNames: ['Md. Majedur Rahman', 'M. M. Rahman'],
  orcid: '0000-0000-0000-0001',
}
check(NAMES, 'ORCID match survives a Md./Mohammad spelling difference', () => {
  const result = matchPersonToTeam({ fullName: 'Mohammad Majedur Rahman', orcid: majedur.orcid }, [
    majedur,
  ])
  assert.equal(result.team?.id, majedur.id)
})
check(NAMES, '"Md Majedur Rahman" without an ID is not linked by name (exact only)', () => {
  assert.equal(matchPersonToTeam({ fullName: 'Md Majedur Rahman' }, [majedur]).team, null)
})
check(NAMES, 'ORCID on a different Md. (same family, other given name) is vetoed', () => {
  const team = [{ id: 'roster:jahidul', name: 'Md. Jahidul Islam', orcid: '0000-0000-0000-0002' }]
  const result = matchPersonToTeam(
    { fullName: 'Md. Saiful Islam', orcid: '0000-0000-0000-0002' },
    team,
  )
  assert.equal(result.team, null, `linked by ${result.method}`)
})
check(NAMES, 'ORCID on another Islam (Salekul vs Md. Jahidul) is vetoed', () => {
  const team = [{ id: 'roster:salekul', name: 'Salekul Islam', orcid: '0000-0002-7262-0060' }]
  const result = matchPersonToTeam(
    { fullName: 'Md. Jahidul Islam', orcid: '0000-0002-7262-0060' },
    team,
  )
  assert.equal(result.team, null, `linked by ${result.method}`)
})
check(NAMES, '105485: "Md Hasibur Rahman" and "Md. Jahidul Islam" pair with OpenAlex', () => {
  const authors = merged('10.2196/preprints.105485')
  assert.equal(authors.length, 9)
  assert.ok(authors.some((a) => a.fullName === 'Md. Jahidul Islam'))
  assert.ok(authors.some((a) => a.fullName === 'Md Hasibur Rahman'))
})
check(NAMES, 'DBLP pid attaches only on an exact name, not a near-identical one', () => {
  const people = attachDblpPids(
    [{ fullName: 'Md Hasibur Rahman' }, { fullName: 'Md. Jahidul Islam' }],
    [
      { name: 'Md Habibur Rahman', pid: 'synthetic/habibur' },
      { name: 'Md. Jahidul Islam 0001', pid: 'synthetic/jahidul' },
    ],
  )
  assert.equal(people[0].dblpPid, undefined, `Hasibur got ${people[0].dblpPid}`)
  assert.equal(people[1].dblpPid, 'synthetic/jahidul')
})

// ─── 5. DOI-less title and citation search ───────────────────────────────────

const SEARCH = 'title-search'
type SearchOutcome = { doi: string | null; candidates: string[] }
async function decide(fixture: SearchFixture): Promise<SearchOutcome> {
  const query = fixture.input.chunk ?? fixture.input.title!
  const resolution = await resolveCrossrefTitle(query)
  return {
    doi: resolution.candidate ? normalizeDoi(resolution.candidate.doi) : null,
    candidates: [],
  }
}

const tally = { correct: 0, wrong: 0, missed: 0, rejected: 0 }
for (const [name, fixture] of searchFixtures) {
  const outcome = await decide(fixture)
  const right = [fixture.expected.doi, ...(fixture.expected.alsoCorrect ?? [])].filter(Boolean)
  if (outcome.doi && right.includes(outcome.doi)) tally.correct++
  else if (outcome.doi) tally.wrong++
  else if (fixture.expected.doi) tally.missed++
  else tally.rejected++
  check(SEARCH, name, () => {
    // The hard rule: a wrong DOI is never auto-applied. A miss is allowed —
    // it becomes a Review Item — and only counts against recall.
    if (outcome.doi) assert.ok(right.includes(outcome.doi), `auto-applied wrong DOI ${outcome.doi}`)
    if (fixture.expected.doi && !outcome.doi) return 'review (missed auto-apply)'
  })
}
const accepted = tally.correct + tally.wrong
console.log(
  `\nTitle search: ${tally.correct} correct, ${tally.wrong} wrong, ${tally.missed} sent to review, ` +
    `${tally.rejected} correctly not applied. Precision ${accepted ? ((tally.correct / accepted) * 100).toFixed(0) : '—'}%, ` +
    `recall ${((tally.correct / (tally.correct + tally.wrong + tally.missed)) * 100).toFixed(0)}%.`,
)

// ─── 6. ORCID parsing ────────────────────────────────────────────────────────

const ORCID = 'orcid-parsing'
const nova = await stageOrcidCandidates(NOVA_ORCID)
const greene = await stageOrcidCandidates('0000-0001-8713-9213')
const byTitle = (list: StagedCandidate[], start: string) =>
  list.find((candidate) => candidate.title.startsWith(start))

check(ORCID, 'DOIs are normalized before staging (upper-case IEEE DOI)', () => {
  const candidate = nova.find((c) => c.key === 'doi:10.1109/mprv.2024.3520397')
  assert.ok(candidate, 'candidate missing')
  assert.equal(candidate.doi, '10.1109/mprv.2024.3520397')
})
check(ORCID, 'a work with no DOI is staged unselected', () => {
  const candidate = nova.find((c) => !c.doi)
  assert.ok(candidate && candidate.selected === false)
})
check(ORCID, 'JMIR preprint and published version stay separate Candidates', () => {
  assert.ok(nova.some((c) => c.doi === '10.2196/preprints.76934'))
  assert.ok(nova.some((c) => c.doi === '10.2196/76934'))
})
check(ORCID, 'only `self` DOIs become the work DOI, never `version-of`', () => {
  const versionOf = new Set([
    '10.5281/zenodo.8431937',
    '10.5281/zenodo.15122187',
    '10.5281/zenodo.8226567',
    '10.5281/zenodo.8226547',
    '10.5281/zenodo.8186994',
    '10.5281/zenodo.10452633',
    '10.5281/zenodo.22035984',
    '10.5281/zenodo.20314128',
  ])
  const leaked = greene.filter((c) => c.doi && versionOf.has(normalizeDoi(c.doi)))
  assert.deepEqual(
    leaked.map((c) => c.doi),
    [],
  )
})
check(
  ORCID,
  'every work summary is read: the second DOI in a group is kept on the Candidate',
  () => {
    const candidate = byTitle(greene, 'A publishing infrastructure')
    assert.ok(candidate, 'candidate missing')
    const ids = (candidate.raw ?? {}) as { otherDois?: string[] }
    const all = [candidate.doi, ...(ids.otherDois ?? [])].map((doi) => normalizeDoi(doi!))
    assert.ok(all.includes('10.1093/jamia/ocae139') && all.includes('10.1101/2023.01.21.525030'))
  },
)
check(ORCID, 'arXiv and ISBN identifiers are captured on the Candidate', () => {
  const arxiv = byTitle(greene, 'Application of Traditional Vaccine')
  const isbn = byTitle(greene, 'Solving complex problems in human genetics')
  assert.equal((arxiv?.raw as { arxiv?: string } | undefined)?.arxiv, '2208.08907')
  assert.deepEqual((isbn?.raw as { isbn?: string[] } | undefined)?.isbn, ['9781605667058'])
})
check(ORCID, 'the ORCID request carries a timeout signal and a User-Agent', () => {
  const request = requestLog.find((r) => r.url.hostname === 'pub.orcid.org')
  assert.ok(request?.init?.signal, 'no timeout signal')
  assert.ok(new Headers(request.init.headers).get('user-agent'), 'no User-Agent')
})

// ─── 7. Client etiquette ─────────────────────────────────────────────────────

const CLIENT = 'client-etiquette'
await checkAsync(CLIENT, 'Retry-After on a 429 is honoured before retrying', async () => {
  let calls = 0
  override = (url) => {
    if (url.pathname !== '/retry-after') return undefined
    calls++
    return calls === 1 ? json({}, 429, { 'retry-after': '1' }) : json({ ok: true })
  }
  const started = Date.now()
  const body = await fetchJsonWithRetry('https://api.crossref.org/retry-after', {})
  override = null
  assert.deepEqual(body, { ok: true })
  assert.ok(Date.now() - started >= 1000, `retried after ${Date.now() - started}ms`)
})

await checkAsync(CLIENT, 'at most 3 concurrent Crossref requests', async () => {
  let inFlight = 0
  let peak = 0
  override = (url) => {
    const target = decodeURIComponent(url.pathname)
    if (url.hostname !== 'api.crossref.org' || !target.startsWith('/works/10.9999/')) {
      return undefined
    }
    inFlight++
    peak = Math.max(peak, inFlight)
    return new Promise<Response>((resolve) =>
      setTimeout(() => {
        inFlight--
        resolve(json({ message: {} }))
      }, 30),
    )
  }
  await Promise.all(Array.from({ length: 8 }, (_, i) => fetchCrossrefByDoi(`10.9999/c${i}`)))
  override = null
  assert.ok(peak <= 3, `peak ${peak}`)
})

await checkAsync(
  CLIENT,
  'mailto= on Crossref and api_key on OpenAlex when configured',
  async () => {
    process.env.LABKIT_CONTACT_EMAIL = 'operator@example.org'
    process.env.OPENALEX_API_KEY = 'test-key'
    override = (url) =>
      decodeURIComponent(url.pathname).includes('10.9998/')
        ? json({ message: {}, id: 'x' })
        : undefined
    requestLog.length = 0
    await fetchCrossrefByDoi('10.9998/m')
    await fetchOpenAlexByDoi('10.9998/m')
    override = null
    delete process.env.LABKIT_CONTACT_EMAIL
    delete process.env.OPENALEX_API_KEY
    const crossref = requestLog.find((r) => r.url.hostname === 'api.crossref.org')!
    const openalex = requestLog.find((r) => r.url.hostname === 'api.openalex.org')!
    assert.equal(crossref.url.searchParams.get('mailto'), 'operator@example.org')
    assert.equal(openalex.url.searchParams.get('api_key'), 'test-key')
  },
)

// ─── Report ──────────────────────────────────────────────────────────────────

let group = ''
for (const result of results) {
  if (result.group !== group) {
    group = result.group
    console.log(`\n[${group}]`)
  }
  console.log(
    `  ${result.pass ? 'PASS' : 'FAIL'}  ${result.name}${result.detail ? ` — ${result.detail}` : ''}`,
  )
}
const failed = results.filter((result) => !result.pass)
console.log(`\n${results.length - failed.length}/${results.length} fixture checks passed.`)
process.exit(failed.length === 0 ? 0 : 1)
