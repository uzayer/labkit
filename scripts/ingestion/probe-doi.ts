/**
 * One-off probe: fetch every DOI in labs/dial/dial-data/publications/*.md
 * from Crossref + OpenAlex, save raw JSON fixtures, and print a field-coverage
 * report. Also demos reverse title lookup for a handful of DOI-less 2024 works.
 *
 * Run: bun run payload -- run scripts/ingestion/probe-doi.ts
 */
import fs from 'node:fs'
import path from 'node:path'
import matter from 'gray-matter'
import {
  buildCoverageReport,
  type CoverageReport,
  type CoverageRow,
} from '@/lib/ingestion/coverage'
import {
  fetchCrossrefByDoi,
  fetchOpenAlexByDoi,
  searchCrossrefByTitle,
} from '@/lib/ingestion/fetch'

const PUBLICATIONS_DIR = path.resolve(process.cwd(), 'labs/dial/dial-data/publications')
const FIXTURES_DIR = path.resolve(process.cwd(), 'labs/dial/dial-data/_fixtures')

interface PublicationRecord {
  title: string
  year: number
  doi?: string
}

function loadDoiRecordsFromArgs(dois: string[]): PublicationRecord[] {
  return dois.map((doi) => ({
    title: doi,
    year: 0,
    doi,
  }))
}

function loadPublications(): PublicationRecord[] {
  const files = fs.readdirSync(PUBLICATIONS_DIR).filter((f) => f.endsWith('.md'))

  const records: PublicationRecord[] = []

  for (const file of files) {
    const raw = fs.readFileSync(path.join(PUBLICATIONS_DIR, file), 'utf-8')
    const { data: frontmatter, content } = matter(raw)
    // The `publications:` list lives in the body below the frontmatter
    // fence, not inside it — re-parse the body as its own YAML frontmatter
    // block to get it out.
    const { data: body } = matter(`---\n${content}\n---`)
    const fileYear = frontmatter.year as number | undefined
    const publications = (body.publications ?? []) as Array<{
      title: string
      year?: number
      doi?: string
    }>

    for (const pub of publications) {
      records.push({
        title: pub.title,
        year: pub.year ?? fileYear ?? 0,
        doi: pub.doi,
      })
    }
  }

  return records
}

function doiToFilename(doi: string): string {
  return doi.replace(/\//g, '_') + '.json'
}

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[“”"']/g, '')
    .replace(/[^\w\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

async function main() {
  fs.mkdirSync(path.join(FIXTURES_DIR, 'crossref'), { recursive: true })
  fs.mkdirSync(path.join(FIXTURES_DIR, 'openalex'), { recursive: true })
  fs.mkdirSync(path.join(FIXTURES_DIR, 'reverse-lookup'), { recursive: true })

  const inputDois = process.argv.slice(2).filter((arg) => arg !== 'dry-run')
  const records = inputDois.length > 0 ? loadDoiRecordsFromArgs(inputDois) : loadPublications()
  const withDoi = records.filter((r) => r.doi)
  const doiLess2024 = inputDois.length > 0 ? [] : records.filter((r) => !r.doi && r.year === 2024)

  console.log(`Found ${records.length} publications total, ${withDoi.length} with DOI.`)

  const crossrefResponses: Array<unknown | null> = []
  const openalexResponses: Array<unknown | null> = []

  for (const rec of withDoi) {
    const doi = rec.doi!
    console.log(`Fetching ${doi} — "${rec.title.slice(0, 60)}..."`)

    const crossrefJson = await fetchCrossrefByDoi(doi)
    if (crossrefJson) {
      fs.writeFileSync(
        path.join(FIXTURES_DIR, 'crossref', doiToFilename(doi)),
        JSON.stringify(crossrefJson, null, 2),
      )
    }
    crossrefResponses.push(crossrefJson)
    await sleep(150)

    const openalexJson = await fetchOpenAlexByDoi(doi)
    if (openalexJson) {
      fs.writeFileSync(
        path.join(FIXTURES_DIR, 'openalex', doiToFilename(doi)),
        JSON.stringify(openalexJson, null, 2),
      )
    }
    openalexResponses.push(openalexJson)
    await sleep(150)
  }

  const coverage: CoverageReport = buildCoverageReport(
    withDoi.map((record) => record.doi!),
    crossrefResponses,
    openalexResponses,
  )

  fs.writeFileSync(
    path.join(FIXTURES_DIR, 'coverage-report.json'),
    JSON.stringify(coverage, null, 2),
  )

  console.log('\n--- Coverage summary (Crossref) ---')
  const crCount = (key: keyof CoverageRow['crossref']) =>
    coverage.filter((c) => c.crossref[key]).length
  console.log(`abstract: ${crCount('abstract')}/${coverage.length}`)
  console.log(`funder: ${crCount('funder')}/${coverage.length}`)
  console.log(`issn: ${crCount('issn')}/${coverage.length}`)
  console.log(`page: ${crCount('page')}/${coverage.length}`)
  console.log(`volume: ${crCount('volume')}/${coverage.length}`)
  console.log(`publisher: ${crCount('publisher')}/${coverage.length}`)
  console.log(`authorOrcid: ${crCount('authorOrcid')}/${coverage.length}`)
  console.log(`publishedDate: ${crCount('publishedDate')}/${coverage.length}`)

  console.log('\n--- Coverage summary (OpenAlex) ---')
  const oaCount = (key: keyof CoverageRow['openalex']) =>
    coverage.filter((c) => c.openalex[key]).length
  console.log(`abstractIndex: ${oaCount('abstractIndex')}/${coverage.length}`)
  console.log(`oaStatus: ${oaCount('oaStatus')}/${coverage.length}`)
  console.log(`authorships: ${oaCount('authorships')}/${coverage.length}`)
  console.log(`grants: ${oaCount('grants')}/${coverage.length}`)

  console.log('\n--- Reverse lookup demo (DOI-less 2024 titles) ---')
  const sample = doiLess2024.slice(0, 5)
  for (const rec of sample) {
    console.log(`\nTitle: "${rec.title}"`)
    const items = await searchCrossrefByTitle(rec.title)
    await sleep(150)
    const result = {
      message: {
        items: items.map((item) => ({
          title: [item.title],
          DOI: item.doi,
          score: item.score,
        })),
      },
    }
    const filename = normalizeTitle(rec.title).replace(/\s+/g, '_').slice(0, 80) + '.json'
    fs.writeFileSync(
      path.join(FIXTURES_DIR, 'reverse-lookup', filename),
      JSON.stringify(result, null, 2),
    )

    if (items.length === 0) {
      console.log('  No candidates returned.')
      continue
    }

    const top = items[0]
    const topTitle = top.title
    const matched = normalizeTitle(topTitle) === normalizeTitle(rec.title)
    console.log(`  Top hit: "${topTitle}"`)
    console.log(`  Score: ${top.score}, DOI: ${top.doi}, exact-normalized-match: ${matched}`)
  }

  console.log(`\nFixtures written to ${FIXTURES_DIR}`)
}

// `payload run` does `await import(scriptPath)` then calls `process.exit(0)`
// immediately after — an unawaited `main()` gets killed mid-flight. Top-level
// await keeps the process alive until the script actually finishes.
await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
