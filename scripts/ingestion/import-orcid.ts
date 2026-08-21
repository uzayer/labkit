/**
 * Pull an ORCID iD's works and import them as Publications.
 *
 * Run: bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]
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
 *
 * Routes through the shared staging + persistence engine (stageOrcidCandidates
 * + import-runs/review-items bookkeeping) instead of fetching and hydrating
 * inline — this CLI has no human selection step, so every staged candidate is
 * processed automatically regardless of its `selected` flag.
 */
import { getPayload } from 'payload'
import config from '@payload-config'

import {
  hydratePublicationFromDoi,
  loadPublicationIndexes,
  type HydratePublicationResult,
} from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'
import { finalizeRun, persistRunProgress, type RunProgress } from '@/lib/ingestion/run-persistence'
import { stageOrcidCandidates } from '@/lib/ingestion/staging'
import type { UpsertAction } from '@/lib/ingestion/upsert'

const DRY_RUN = process.argv.includes('dry-run')
const orcidId = process.argv.slice(2).find((arg) => arg !== 'dry-run')

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function bucketAction(progress: RunProgress, action: UpsertAction) {
  switch (action) {
    case 'created':
    case 'skipped-dry-run':
      progress.created++
      break
    case 'skipped-existing':
      progress.skippedExisting++
      break
    case 'updated':
      // Not expected from this pipeline (hydratePublicationFromDoi's own
      // existence check always precedes upsertByKey on the same key), but
      // bucket conservatively rather than drop the count.
      progress.created++
      break
  }
}

async function main() {
  if (!orcidId) {
    console.error(
      'Usage: bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]',
    )
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  const candidates = await stageOrcidCandidates(orcidId)
  console.log(`ORCID ${orcidId}: ${candidates.length} works found.`)

  const progress: RunProgress = {
    total: candidates.length,
    processed: 0,
    created: 0,
    skippedExisting: 0,
    failed: 0,
  }

  const run = await payload.create({
    collection: 'import-runs',
    data: {
      label: `ORCID import — ${orcidId}`,
      source: 'cli',
      status: 'running',
      params: { orcidId, dryRun: DRY_RUN },
      candidates,
      progress,
      startedAt: new Date().toISOString(),
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
  const runId = run.id

  try {
    for (const candidate of candidates) {
      let result: HydratePublicationResult | null = null

      if (candidate.doi) {
        result = await hydratePublicationFromDoi(
          payload,
          report,
          candidate.doi,
          indexes,
          DRY_RUN,
          `ORCID ${orcidId}`,
        )
        await sleep(150)
      } else {
        // ORCID's own title/sourceName isn't enough to build a Publication —
        // Crossref/OpenAlex stays the source of truth.
        report.flagUnmatched({
          collection: 'publications',
          field: 'doi',
          sourceContext: `ORCID ${orcidId} — "${candidate.title}"`,
          value: '(no DOI)',
        })
      }

      progress.processed++
      if (result) {
        bucketAction(progress, result.action)
      } else {
        progress.failed++
      }
      await persistRunProgress(payload, runId, progress)
    }
  } catch (err) {
    await finalizeRun(payload, runId, report, 'failed', String(err))
    throw err
  }

  report.print(DRY_RUN)
  await finalizeRun(payload, runId, report, 'completed')
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
