/**
 * Pull an ORCID iD's works and import them as Publications.
 *
 * Run: bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run] [since=YYYY]
 *
 * `since=YYYY` drops works whose ORCID year is earlier, before any
 * Crossref/OpenAlex call. Works ORCID gives no year for are kept — there is
 * nothing to judge them by, and dropping them would silently lose papers.
 *
 * Roster first: the ORCID owner must already exist as a Team Member with this
 * ORCID. Otherwise hydration would create them as a hidden imported co-author
 * on their own papers. A live run refuses; a dry run warns and records
 * `ownerMissing` in the preview so preview-report.ts repeats the warning.
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

import path from 'node:path'

import { configureFetchCache } from '@/lib/ingestion/fetch'
import {
  hydratePublicationFromDoi,
  loadPublicationIndexes,
  prefetchDoiSources,
  type HydratePublicationResult,
} from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'
import { finalizeRun, persistRunProgress, type RunProgress } from '@/lib/ingestion/run-persistence'
import { normalizeOrcid } from '@/lib/ingestion/normalize'
import { stageOrcidCandidates } from '@/lib/ingestion/staging'
import type { UpsertAction } from '@/lib/ingestion/upsert'

const args = process.argv.slice(2)
const DRY_RUN = args.includes('dry-run')
const sinceArg = args.find((arg) => arg.startsWith('since='))
const orcidId = args.find((arg) => arg !== 'dry-run' && !arg.startsWith('since='))

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
      'Usage: bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run] [since=YYYY]',
    )
    process.exit(1)
  }
  const since = sinceArg ? Number(sinceArg.slice('since='.length)) : undefined
  if (sinceArg && !(Number.isInteger(since) && since! >= 1900 && since! <= 2100)) {
    console.error(`Invalid ${sinceArg} — expected since=YYYY`)
    process.exit(1)
  }

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  // Owner preflight (roster first) — see the header comment.
  const ownerOrcid = normalizeOrcid(orcidId)
  const owner = indexes.teamIndex.find((entry) => normalizeOrcid(entry.orcid) === ownerOrcid)
  const ownerMissing = !owner
  if (ownerMissing) {
    const message =
      `No Team Member has ORCID ${ownerOrcid}. Import the lab roster first — the ORCID owner ` +
      'would otherwise be created as a hidden external collaborator on their own papers.'
    if (!DRY_RUN) {
      console.error(`ERROR: ${message}`)
      process.exit(1)
    }
    console.warn(`\n!!! WARNING (dry run continues): ${message}\n`)
  }

  const staged = await stageOrcidCandidates(orcidId)
  const withoutYear = staged.filter((candidate) => candidate.year === undefined).length
  const candidates =
    since === undefined
      ? staged
      : staged.filter((candidate) => candidate.year === undefined || candidate.year >= since)
  console.log(
    since === undefined
      ? `ORCID ${orcidId}: ${staged.length} works found.`
      : `ORCID ${orcidId}: ${staged.length} works found, ${candidates.length} in range (since ${since}), ` +
          `${withoutYear} without a year (kept).`,
  )

  // Network in parallel into the cache, then hydrate sequentially from it.
  // Cached answers persist across runs, so re-running a dry run after a fix
  // costs seconds, not minutes.
  configureFetchCache({ dir: path.resolve(process.cwd(), 'ingestion-previews/.cache') })
  const dois = candidates.flatMap((candidate) => (candidate.doi ? [candidate.doi] : []))
  const prefetchStarted = Date.now()
  await prefetchDoiSources(dois, {
    onProgress: (done) => {
      if (done % 20 === 0 || done === dois.length) console.log(`  fetched ${done}/${dois.length}`)
    },
  })
  console.log(`Sources fetched in ${Math.round((Date.now() - prefetchStarted) / 1000)}s.`)

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
      params: { orcidId, dryRun: DRY_RUN, since },
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
  const previewPath = report.writePreview(`orcid-${orcidId}`, {
    orcidId,
    dryRun: DRY_RUN,
    since,
    ownerMissing,
  })
  console.log(
    `\nPreview: ${previewPath}\n  bun run payload -- run scripts/ingestion/preview-report.ts ${previewPath}`,
  )
  await finalizeRun(payload, runId, report, 'completed')
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
