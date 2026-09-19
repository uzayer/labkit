/**
 * Onboarding diagnostic: fetch each DOI from Crossref + OpenAlex and print a
 * field-coverage report, to see what a new Lab's bibliographic data looks like
 * before importing it.
 *
 * Run: pnpm payload run scripts/ingestion/probe-doi.ts <doi>...
 */
import {
  buildCoverageReport,
  type CoverageReport,
  type CoverageRow,
} from '@/lib/ingestion/coverage'
import { fetchCrossrefByDoi, fetchOpenAlexByDoi } from '@/lib/ingestion/fetch'

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  const dois = process.argv.slice(2).filter((arg) => arg !== 'dry-run')
  if (dois.length === 0) {
    console.error('Usage: pnpm payload run scripts/ingestion/probe-doi.ts <doi>...')
    process.exit(1)
  }

  const crossrefResponses: Array<unknown | null> = []
  const openalexResponses: Array<unknown | null> = []

  for (const doi of dois) {
    console.log(`Fetching ${doi}`)
    crossrefResponses.push(await fetchCrossrefByDoi(doi))
    await sleep(150)
    openalexResponses.push(await fetchOpenAlexByDoi(doi))
    await sleep(150)
  }

  const coverage: CoverageReport = buildCoverageReport(dois, crossrefResponses, openalexResponses)

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
}

// `payload run` does `await import(scriptPath)` then calls `process.exit(0)`
// immediately after — an unawaited `main()` gets killed mid-flight. Top-level
// await keeps the process alive until the script actually finishes.
await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
