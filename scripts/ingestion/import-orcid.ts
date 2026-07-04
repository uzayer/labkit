/**
 * Pull an ORCID iD's works and import them as Publications.
 *
 * Run: pnpm payload run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]
 *
 * Gotcha: `payload run` parses argv through minimist and only forwards
 * positional args to the script — use the bare word `dry-run`, not `--dry-run`.
 *
 * An ORCID record is a person's whole career, not a lab's output (a real
 * test record returned 122 works spanning 2004-2026, career-wide rather
 * than lab-scoped) — always review the dry-run report before running live.
 *
 * Idempotent: re-running skips any DOI that already has a Publication
 * (never overwrites) — see hydratePublicationFromDoi.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import { fetchOrcidWorks } from '@/lib/ingestion/orcid'
import { hydratePublicationFromDoi, loadPublicationIndexes } from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'

const DRY_RUN = process.argv.includes('dry-run')
const orcidId = process.argv.slice(2).find((arg) => arg !== 'dry-run')

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

async function main() {
  if (!orcidId) {
    console.error('Usage: pnpm payload run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]')
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const report = new ImportReport()

  const works = await fetchOrcidWorks(orcidId)
  console.log(`ORCID ${orcidId}: ${works.length} works found.`)

  const indexes = await loadPublicationIndexes(payload)
  const seenDois = new Set<string>()

  for (const work of works) {
    if (!work.doi) {
      // ORCID's own title/sourceName isn't enough to build a Publication —
      // Crossref/OpenAlex stays the source of truth.
      report.flagUnmatched({
        collection: 'publications',
        field: 'doi',
        sourceContext: `ORCID ${orcidId} — "${work.title}"`,
        value: '(no DOI)',
      })
      continue
    }

    // ORCID sometimes lists the same DOI under multiple work-groups (e.g.
    // both self-asserted and Crossref-pushed).
    if (seenDois.has(work.doi.toLowerCase())) continue
    seenDois.add(work.doi.toLowerCase())

    await hydratePublicationFromDoi(payload, report, work.doi, indexes, DRY_RUN, `ORCID ${orcidId}`)
    await sleep(150)
  }

  report.print(DRY_RUN)
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
