/**
 * Parse a pasted citation wall (a text file — the median artifact most labs
 * hand over during onboarding: a docx/PDF export with citations grouped by
 * year) and import each into Publications.
 *
 * Run: pnpm payload run scripts/ingestion/import-citations.ts <path-to-text-file> [dry-run]
 *
 * Segmentation: split on blank lines first (citations are usually already
 * one-per-paragraph/line once exported to plain text — no LLM segmentation
 * needed for the common case). Per chunk: regex-extract an embedded DOI; if
 * none, fall back to Crossref's bibliographic reverse-lookup. A chunk that
 * resolves nothing is flagged for manual review, never silently dropped.
 *
 * Routes through the shared staging + persistence engine
 * (stageCitationCandidates + import-runs/review-items bookkeeping) instead of
 * chunking and hydrating inline — this CLI has no human selection step, so
 * every staged candidate is processed automatically regardless of its
 * `selected` flag.
 */
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

import { resolveCrossrefTitle } from '@/lib/ingestion/fetch'
import {
  hydratePublicationFromDoi,
  loadPublicationIndexes,
  type HydratePublicationResult,
} from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'
import { finalizeRun, persistRunProgress, type RunProgress } from '@/lib/ingestion/run-persistence'
import { stageCitationCandidates } from '@/lib/ingestion/staging'
import type { UpsertAction } from '@/lib/ingestion/upsert'

const DRY_RUN = process.argv.includes('dry-run')
const filePath = process.argv.slice(2).find((arg) => arg !== 'dry-run')

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
  if (!filePath) {
    console.error(
      'Usage: pnpm payload run scripts/ingestion/import-citations.ts <path-to-text-file> [dry-run]',
    )
    process.exit(1)
  }

  const text = fs.readFileSync(filePath, 'utf-8')

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  const candidates = await stageCitationCandidates(text)
  console.log(`${candidates.length} citation chunks found.`)

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
      label: `Citation import — ${filePath}`,
      source: 'cli',
      status: 'running',
      params: { filePath, dryRun: DRY_RUN },
      rawInput: text,
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
      // Staging carries the same truncated-chunk string as `title`.
      const sourceContext = candidate.title
      let result: HydratePublicationResult | null = null

      if (candidate.note?.startsWith('ambiguous —')) {
        // Multiple citations glued onto one chunk — a genuine segmentation
        // failure, not something to guess our way through.
        report.flagUnmatched({
          collection: 'publications',
          field: 'doi',
          sourceContext,
          value: candidate.note,
        })
      } else if (candidate.doi) {
        result = await hydratePublicationFromDoi(
          payload,
          report,
          candidate.doi,
          indexes,
          DRY_RUN,
          sourceContext,
        )
        await sleep(150)
      } else {
        const chunk = (candidate.raw?.chunk as string | undefined) ?? candidate.title
        const resolution = await resolveCrossrefTitle(chunk)
        await sleep(150)

        if (resolution.method === 'crossref' && resolution.candidate) {
          result = await hydratePublicationFromDoi(
            payload,
            report,
            resolution.candidate.doi,
            indexes,
            DRY_RUN,
            sourceContext,
          )
          await sleep(150)
        } else {
          report.flagUnmatched({
            collection: 'publications',
            field: 'doi',
            sourceContext,
            value: chunk.length > 200 ? `${chunk.slice(0, 200)}…` : chunk,
          })
        }
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
