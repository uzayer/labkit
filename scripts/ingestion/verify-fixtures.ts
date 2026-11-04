/**
 * Offline regression check for ingestion identity and client behaviour,
 * replayed from recorded Crossref, OpenAlex, ORCID, DataCite, doi.org
 * registration-agency and ROR responses in
 * `scripts/ingestion/fixtures/`. No network and no database: global `fetch`
 * is replaced by a router over the fixtures and throws on any URL it doesn't
 * know, so an accidental live call fails the run instead of passing quietly.
 *
 * Run: bun run payload -- run scripts/ingestion/verify-fixtures.ts
 *
 * Fixtures were recorded on 2026-11-04. Each file keeps the URL it came from;
 * a recorded 404 keeps `status: 404` and a null body.
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
import { decideCrossrefSearch, resolveCrossrefSearch } from '@labkit/core/ingestion/crossref-search'
import { mapDataciteToPublicationFields } from '@labkit/core/ingestion/datacite'
import { fetchDblpRecordByTitle } from '@labkit/core/ingestion/dblp'
import {
  fetchCrossrefByDoi,
  fetchDataciteByDoi,
  fetchJsonWithRetry,
  fetchOpenAlexByDoi,
  fetchRegistrationAgency,
  fetchRorOrganization,
} from '@labkit/core/ingestion/fetch'
import { nearDuplicateNames, normalizeDoi } from '@labkit/core/ingestion/normalize'
import { mapOpenAlexToPublicationFields } from '@labkit/core/ingestion/openalex'
import { mapRorTypes } from '@labkit/core/ingestion/organizations'
import {
  attachDblpPids,
  matchPersonToTeam,
  mergeAuthors,
  nameVariantMatches,
  planTeamLink,
  type MergedAuthor,
  type TeamLookupEntry,
} from '@labkit/core/ingestion/people'
import { matchVenueByName, type VenueLookupEntry } from '@labkit/core/ingestion/publications'
import { stageOrcidCandidates, type StagedCandidate } from '@labkit/core/ingestion/staging'
import {
  authorKeysOf,
  planVersionLinks,
  titleMatches,
  type PublicationLookupEntry,
  type VersionEvidence,
} from '@labkit/core/ingestion/versions'
import {
  isPreprintServerDoi,
  mapBibtexType,
  mapCrossrefType,
  mapDataciteType,
  mapOpenAlexType,
} from '@labkit/core/ingestion/work-types'
import { PUBLICATION_TYPES, crosswalkPublicationType } from '@labkit/core/publication-types'

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
  status?: number
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
const hasFixture = (dir: string, name: string) =>
  fs.existsSync(path.join(FIXTURES, dir, `${name}.json`))
/** A recorded response, replayed with its status (a 404 has a null body). */
const replay = (dir: string, name: string) => {
  const recorded = readJson<Recorded>(dir, `${name}.json`)
  return recorded.status === 404
    ? new Response('Resource not found.', {
        status: 404,
        headers: { 'content-type': 'text/plain' },
      })
    : json(recorded.body)
}

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
    return replay('crossref', slug(doi))
  }
  if (url.hostname === 'doi.org' && url.pathname.startsWith('/ra/')) {
    return replay('ra', slug(decodeURIComponent(url.pathname.slice('/ra/'.length))))
  }
  if (url.hostname === 'api.datacite.org' && url.pathname.startsWith('/dois/')) {
    return replay('datacite', slug(decodeURIComponent(url.pathname.slice('/dois/'.length))))
  }
  if (url.hostname === 'api.ror.org' && url.pathname.startsWith('/v2/organizations/')) {
    return replay('ror', url.pathname.slice('/v2/organizations/'.length))
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
// The two curated venues exactly as DIAL's venue seed (dial-site's scripts/seed-venues.ts) writes them.
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
check(NAMES, 'pairing: a different full given name with the same initial gets no ORCID', () => {
  const authors = mergeAuthors(
    [{ given: 'Salekul', family: 'Islam' }],
    [
      {
        displayName: 'Saiful Islam',
        rawAuthorName: 'Saiful Islam',
        orcid: '0000-0000-0000-0003',
        position: 'first',
        institutions: [],
      },
    ],
  )
  assert.equal(authors[0].orcid, undefined)
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
  const decision = await resolveCrossrefSearch(fixture.input)
  if (process.env.VERIFY_DEBUG) {
    console.log(`\n${fixture.expected.doi ?? 'null'}  ${decision.status}`)
    for (const c of decision.candidates) {
      console.log(
        `   ${c.doi} sim=${c.similarity.toFixed(2)} n=${c.normalizedScore.toFixed(2)} [${c.support}] ${c.blocked ?? ''}`,
      )
    }
  }
  return {
    doi: decision.status === 'accepted' ? decision.doi : null,
    candidates: decision.candidates.map((candidate) => candidate.doi),
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
// Synthetic hits for the two guards that the recorded corpus doesn't exercise.
const syntheticHit = (overrides: Record<string, unknown>) => ({
  DOI: '10.0000/synthetic',
  score: 60,
  type: 'journal-article',
  title: ['Mobile health records for rural clinics'],
  author: [{ given: 'Ann', family: 'Hall' }],
  issued: { 'date-parts': [[2021]] },
  'container-title': ['Journal of Rural Health'],
  ...overrides,
})
check(SEARCH, 'an off-by-one year is not an agreeing field', () => {
  const decision = decideCrossrefSearch(
    { title: 'Mobile health records for rural clinics', year: 2020, authors: ['Ann Hall'] },
    'Mobile health records for rural clinics',
    [syntheticHit({})],
  )
  assert.equal(decision.status, 'review')
})
check(
  SEARCH,
  "citation line: the candidate's own title words are not author or venue evidence",
  () => {
    const chunk = 'B. Smith. Hall effect sensors in rural health clinics. 2021.'
    const decision = decideCrossrefSearch({ chunk }, chunk, [
      syntheticHit({
        title: ['Hall effect sensors in rural health clinics'],
        author: [{ given: 'Ann', family: 'Hall' }],
        'container-title': ['Rural Health'],
      }),
    ])
    assert.equal(decision.status, 'review')
  },
)
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

// ─── 8. Preprint ↔ published linking ─────────────────────────────────────────

/**
 * A work as hydration sees it: its Lab index entry and its version evidence,
 * built from whichever recorded sources exist for the DOI.
 */
function workFromFixtures(doi: string, overrides: Partial<PublicationLookupEntry> = {}) {
  const name = slug(doi)
  const recorded = (dir: string) =>
    hasFixture(dir, name) ? readJson<Recorded>(dir, `${name}.json`).body : null
  const crossref = recorded('crossref') ? mapCrossrefToPublicationFields(recorded('crossref')) : {}
  const openalex = recorded('openalex') ? mapOpenAlexToPublicationFields(recorded('openalex')) : {}
  const datacite = recorded('datacite') ? mapDataciteToPublicationFields(recorded('datacite')) : {}
  const type = isPreprintServerDoi(doi)
    ? 'preprint'
    : (crossref.type ?? datacite.type ?? openalex.type ?? 'other')
  const authors = mergeAuthors(crossref.authors ?? datacite.authors, openalex.authorships)
  const entry: PublicationLookupEntry = {
    id: `pub:${doi}`,
    doi: normalizeDoi(doi),
    title: crossref.title ?? datacite.title ?? openalex.title ?? '',
    year: crossref.year ?? datacite.year ?? openalex.year,
    type,
    status: type === 'preprint' ? 'preprint' : 'published',
    openalexId: openalex.openalex_id,
    authorKeys: authorKeysOf(authors.map((a) => a.fullName)),
    ...overrides,
  }
  const relations = {
    publishedVersions: [
      ...(crossref.relations?.publishedVersions ?? []),
      ...(datacite.relations?.publishedVersions ?? []),
    ],
    preprints: [...(crossref.relations?.preprints ?? []), ...(datacite.relations?.preprints ?? [])],
  }
  const evidence: VersionEvidence = {
    relations,
    openalexId: openalex.openalex_id,
    openalexWorkDois: openalex.workDois,
  }
  return { entry, evidence }
}
const linkPairs = (plan: ReturnType<typeof planVersionLinks>) =>
  plan.links.map((link) => `${link.preprint.doi} -> ${link.published.doi}`)

const LINKS = 'preprint-linking'
check(LINKS, 'JMIR 76934: Crossref relations are read on both records', () => {
  assert.deepEqual(workFromFixtures('10.2196/preprints.76934').evidence.relations, {
    publishedVersions: ['10.2196/76934'],
    preprints: [],
  })
  assert.deepEqual(workFromFixtures('10.2196/76934').evidence.relations, {
    publishedVersions: [],
    preprints: ['10.2196/preprints.76934'],
  })
})
check(LINKS, 'JMIR 76934: preprint imported after the published version links to it', () => {
  const published = workFromFixtures('10.2196/76934').entry
  const { entry, evidence } = workFromFixtures('10.2196/preprints.76934')
  const plan = planVersionLinks(entry, evidence, [published])
  assert.deepEqual(linkPairs(plan), ['10.2196/preprints.76934 -> 10.2196/76934'])
})
check(
  LINKS,
  'JMIR 76934: published imported after the preprint finds it through the preprint relation',
  () => {
    // Derived: the published record's own `has-preprint` removed, the
    // one-sided case Crossref usually gives. Only the preprint asserts it.
    const preprint = workFromFixtures('10.2196/preprints.76934')
    const { entry } = workFromFixtures('10.2196/76934')
    const known = new Map([[preprint.entry.id, preprint.evidence.relations!]])
    const plan = planVersionLinks(entry, {}, [preprint.entry], known)
    assert.deepEqual(linkPairs(plan), ['10.2196/preprints.76934 -> 10.2196/76934'])
  },
)
check(
  LINKS,
  'JMIR 76934: preprint imported after a published version that lists it links through that',
  () => {
    // Derived: the preprint's own `is-preprint-of` and OpenAlex evidence
    // removed; only the published record (hydrated earlier) names it.
    const published = workFromFixtures('10.2196/76934')
    const { entry } = workFromFixtures('10.2196/preprints.76934')
    const known = new Map([[published.entry.id, published.evidence.relations!]])
    const plan = planVersionLinks(entry, {}, [published.entry], known)
    assert.deepEqual(linkPairs(plan), ['10.2196/preprints.76934 -> 10.2196/76934'])
  },
)
check(LINKS, 'a relation never hides a record that is not typed as a preprint', () => {
  // Synthetic relation: the JMIR article claims the CHI 2023 paper as its preprint.
  const { entry } = workFromFixtures('10.2196/76934')
  const chi = workFromFixtures('10.1145/3544548.3580661').entry
  const plan = planVersionLinks(
    entry,
    { relations: { publishedVersions: [], preprints: [chi.doi!] } },
    [chi],
  )
  assert.deepEqual(linkPairs(plan), [])
})
check(LINKS, 'SSRN 4190884 is a preprint even though Crossref files it as journal-article', () => {
  assert.equal(mapCrossrefToPublicationFields(crossrefBody('10.2139/ssrn.4190884')).type, 'journal')
  assert.equal(workFromFixtures('10.2139/ssrn.4190884').entry.type, 'preprint')
})
check(LINKS, 'SSRN 4190884 ↔ LNICST chapter: one OpenAlex work links them, either order', () => {
  const ssrn = workFromFixtures('10.2139/ssrn.4190884')
  const chapter = workFromFixtures('10.1007/978-3-031-34586-9_3')
  const expected = ['10.2139/ssrn.4190884 -> 10.1007/978-3-031-34586-9_3']
  assert.deepEqual(
    linkPairs(planVersionLinks(ssrn.entry, ssrn.evidence, [chapter.entry])),
    expected,
  )
  assert.deepEqual(
    linkPairs(planVersionLinks(chapter.entry, chapter.evidence, [ssrn.entry])),
    expected,
  )
})
check(LINKS, 'a title match alone never links (identifiers removed from the JMIR pair)', () => {
  const published = workFromFixtures('10.2196/76934', { openalexId: undefined }).entry
  const { entry } = workFromFixtures('10.2196/preprints.76934', { openalexId: undefined })
  assert.deepEqual(linkPairs(planVersionLinks(entry, {}, [published])), [])
  // The real titles: the preprint's carries JMIR's " (Preprint)" suffix.
  assert.ok(entry.title.endsWith('(Preprint)'), entry.title)
  assert.deepEqual(
    titleMatches(entry, [published]).map((m) => m.reason),
    ['preprint-title-match'],
  )
})
check(LINKS, 'two JMIR preprints under one OpenAlex work are not linked to each other', () => {
  const { entry, evidence } = workFromFixtures('10.2196/preprints.105485')
  assert.ok(evidence.openalexWorkDois?.includes('10.2196/preprints.85023'))
  const other: PublicationLookupEntry = {
    id: 'pub:85023',
    doi: '10.2196/preprints.85023',
    title: entry.title,
    type: 'preprint',
    authorKeys: [],
  }
  assert.deepEqual(linkPairs(planVersionLinks(entry, evidence, [other])), [])
})
check(LINKS, 'a preprint already linked by hand is left alone', () => {
  const published = workFromFixtures('10.2196/76934').entry
  const { entry, evidence } = workFromFixtures('10.2196/preprints.76934', {
    versionOf: 'pub:chosen-by-hand',
  })
  assert.deepEqual(linkPairs(planVersionLinks(entry, evidence, [published])), [])
})

// ─── 9. DataCite fallback ────────────────────────────────────────────────────

const DATACITE = 'datacite'
await checkAsync(DATACITE, 'arXiv DOI: Crossref 404, doi.org names DataCite', async () => {
  assert.equal(await fetchCrossrefByDoi('10.48550/arXiv.2208.08907'), null)
  assert.equal(await fetchRegistrationAgency('10.48550/arXiv.2208.08907'), 'DataCite')
})
await checkAsync(DATACITE, 'arXiv DataCite record maps title, year, authors', async () => {
  const fields = mapDataciteToPublicationFields(
    await fetchDataciteByDoi('10.48550/arXiv.2208.08907'),
  )
  assert.equal(
    fields.title,
    'Application of Traditional Vaccine Development Strategies to SARS-CoV-2',
  )
  assert.equal(fields.year, 2022)
  assert.equal(fields.status, 'preprint')
  assert.equal(fields.venueName, 'arXiv')
  assert.deepEqual(fields.authors?.[0], {
    given: 'Halie M.',
    family: 'Rando',
    orcid: undefined,
    sequence: 'first',
    affiliationName: undefined,
  })
})
check(DATACITE, 'arXiv: IsVersionOf names the published DOI, and links to it', () => {
  const arxiv = workFromFixtures('10.48550/arXiv.2208.08907')
  assert.deepEqual(arxiv.evidence.relations?.publishedVersions, ['10.1128/msystems.00927-22'])
  const published = workFromFixtures('10.1128/msystems.00927-22').entry
  assert.equal(published.type, 'journal', 'OpenAlex `review` should map to journal')
  assert.deepEqual(linkPairs(planVersionLinks(arxiv.entry, arxiv.evidence, [published])), [
    '10.48550/arxiv.2208.08907 -> 10.1128/msystems.00927-22',
  ])
})
await checkAsync(
  DATACITE,
  'Zenodo preprint: per-work ORCIDs, HasVersion is not a published version',
  async () => {
    assert.equal(await fetchRegistrationAgency('10.5281/zenodo.20314127'), 'DataCite')
    const fields = mapDataciteToPublicationFields(
      await fetchDataciteByDoi('10.5281/zenodo.20314127'),
    )
    assert.equal(fields.type, 'preprint')
    assert.equal(fields.authors?.[0]?.orcid, '0000-0001-7075-4287')
    assert.equal(fields.relations, undefined)
    const merged = mergeAuthors(fields.authors, undefined, 'datacite')
    assert.equal(merged[0].orcidSource, 'datacite')
  },
)

// ─── 10. Type mapping ────────────────────────────────────────────────────────

const TYPES = 'type-mapping'
check(TYPES, 'Crossref types onto the widened Publication types', () => {
  const t = (type: string, subtype?: string) => mapCrossrefType(type, subtype)?.type
  assert.equal(t('journal-article'), 'journal')
  assert.equal(t('proceedings-article'), 'conference')
  assert.equal(t('posted-content', 'preprint'), 'preprint')
  assert.equal(t('dissertation'), 'thesis')
  assert.equal(t('monograph'), 'book')
  assert.equal(t('dataset'), 'dataset')
  assert.equal(
    mapCrossrefToPublicationFields(crossrefBody('10.1007/978-3-031-34586-9_3')).type,
    'book-chapter',
  )
})
check(TYPES, 'an unknown type is kept as `other`, flagged unmapped, with its raw type', () => {
  assert.deepEqual(mapCrossrefType('component'), {
    type: 'other',
    mapped: false,
    raw: 'crossref: component',
  })
  assert.equal(mapDataciteType('Text')?.mapped, false)
  assert.equal(mapBibtexType('misc')?.type, 'other')
})
check(TYPES, 'a source type named like an Object property is not a mapping', () => {
  assert.deepEqual(mapCrossrefType('constructor'), {
    type: 'other',
    mapped: false,
    raw: 'crossref: constructor',
  })
})
check(TYPES, 'OpenAlex conference-paper and review', () => {
  assert.equal(
    mapOpenAlexToPublicationFields(openalexBody('10.1145/3544548.3580661')).type,
    'conference',
  )
  assert.equal(mapOpenAlexType('review')?.type, 'journal')
})
check(TYPES, 'BibTeX entry types', () => {
  assert.equal(mapBibtexType('inproceedings')?.type, 'conference')
  assert.equal(mapBibtexType('phdthesis')?.type, 'thesis')
  assert.equal(mapBibtexType('incollection')?.type, 'book-chapter')
})
check(TYPES, 'DataCite types round-trip through crosswalkPublicationType', () => {
  for (const entry of PUBLICATION_TYPES) {
    const { datacite } = crosswalkPublicationType(entry.value)
    const mapped = mapDataciteType(datacite)
    if (entry.value === 'other') {
      assert.equal(mapped?.mapped, false)
      continue
    }
    assert.equal(crosswalkPublicationType(mapped?.type).datacite, datacite, entry.value)
  }
})
check(TYPES, 'a subtitle Crossref repeats in the title in another case is not doubled', () => {
  // Synthetic Crossref message.
  const fields = mapCrossrefToPublicationFields({
    message: { title: ['Shonabondhu: A Cognitive Aid'], subtitle: ['a cognitive aid'] },
  })
  assert.equal(fields.title, 'Shonabondhu: A Cognitive Aid')
})

// ─── 11. Organization type from ROR ──────────────────────────────────────────

const ROR = 'ror-types'
for (const [ror, expected] of [
  ['05wdbfp45', 'university'], // North South University: education + funder
  ['01w86pt71', 'healthcare'], // Sibu Hospital
  ['0456r8d26', 'nonprofit'], // Gates Foundation: funder + nonprofit
  ['00njsd438', 'company'], // Google: company + funder
  ['00k4cwq24', 'government'], // a ministry: funder + government
  ['01ggx4157', 'research-institute'], // CERN: facility + funder
] as const) {
  await checkAsync(ROR, `${ror} → ${expected}`, async () => {
    const record = (await fetchRorOrganization(`https://ror.org/${ror}`)) as { types?: unknown }
    assert.equal(mapRorTypes(record?.types), expected)
  })
}

// ─── 12. Name variants: veto and near-duplicates ─────────────────────────────

const VARIANTS = 'name-veto-and-variants'
check(VARIANTS, 'ORCID printed on "Saiful Islam" but held by "Salekul Islam" does not link', () => {
  const team = [{ id: 'roster:salekul', name: 'Salekul Islam', orcid: '0000-0000-0000-0004' }]
  const result = matchPersonToTeam({ fullName: 'Saiful Islam', orcid: '0000-0000-0000-0004' }, team)
  assert.equal(result.team, null, `linked by ${result.method}`)
  assert.equal(result.conflicts.length, 1)
})
check(VARIANTS, 'an initial still fits the ORCID holder\'s full given name ("N. Ahmed")', () => {
  const result = matchPersonToTeam({ fullName: 'N. Ahmed', orcid: NOVA_ORCID }, dialRoster())
  assert.equal(result.team?.id, 'roster:nova')
})
check(VARIANTS, 'CHI EA 2019: Gaytán-Lugo and Dray spellings are near-duplicates', () => {
  const doi = '10.1145/3290607.3299004'
  const printed = mapCrossrefToPublicationFields(crossrefBody(doi)).authors!.map((a) =>
    [a.given, a.family].join(' '),
  )
  const profiles = mapOpenAlexToPublicationFields(openalexBody(doi)).authorships!.map(
    (a) => a.displayName,
  )
  const pairs = printed.flatMap((name) =>
    profiles
      .filter((other) => nearDuplicateNames(name, other))
      .map((other) => `${name} ~ ${other}`),
  )
  assert.deepEqual(pairs, [
    'Marisol Wong-Villacres ~ Marisol Wong-Villacrés',
    'Laura S. Gaytán-Lugo ~ Laura Sanely Gaytan-Lugo',
    'Susan Dray ~ Susan M. Dray',
  ])
})
check(VARIANTS, 'a near-duplicate co-author is suggested, never linked', () => {
  const team: TeamLookupEntry[] = [
    { id: 'hidden:laura', name: 'Laura Sanely Gaytan-Lugo' },
    { id: 'hidden:susan', name: 'Susan M. Dray' },
  ]
  for (const printed of ['Laura S. Gaytán-Lugo', 'Susan Dray']) {
    assert.equal(planTeamLink({ fullName: printed }, team).match.team, null, `${printed} linked`)
    assert.equal(nameVariantMatches(printed, team).length, 1, `${printed} not suggested`)
  }
})
check(VARIANTS, 'different given names are not near-duplicates', () => {
  assert.equal(nearDuplicateNames('Saiful Islam', 'Salekul Islam'), false)
  assert.equal(nearDuplicateNames('Md. Jahidul Islam', 'Md. Saiful Islam'), false)
  assert.equal(nearDuplicateNames('Nova Ahmed', 'Nova Ahmed'), false)
})

// ─── 13. Duplicate Candidates across Front Doors ─────────────────────────────

const DUPES = 'duplicates'
// The CHI 2023 paper as hydrated from its DOI, against a derived BibTeX-only
// copy (no DOI, sentence case, a year off by one, one author).
const chi = workFromFixtures('10.1145/3544548.3580661').entry
const bibtexCopy = (overrides: Partial<PublicationLookupEntry> = {}): PublicationLookupEntry => ({
  id: 'bibtex:copy',
  title: `${chi.title.toLowerCase()}.`,
  year: chi.year! + 1,
  authorKeys: [chi.authorKeys[0]],
  ...overrides,
})
check(DUPES, 'a BibTeX-only copy of a DOI record is flagged (title, year ±1, an author)', () => {
  assert.deepEqual(
    titleMatches(bibtexCopy(), [chi]).map((m) => m.reason),
    ['title-match'],
  )
})
check(DUPES, 'years two apart are not duplicates', () => {
  assert.deepEqual(titleMatches(bibtexCopy({ year: chi.year! + 2 }), [chi]), [])
})
check(DUPES, 'no shared family name and initial: not duplicates', () => {
  assert.deepEqual(titleMatches(bibtexCopy({ authorKeys: ['nobody:x'] }), [chi]), [])
})
check(DUPES, 'two different DOIs, neither a preprint, veto the match', () => {
  assert.deepEqual(titleMatches(bibtexCopy({ doi: '10.1145/0000000.0000002' }), [chi]), [])
})

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
