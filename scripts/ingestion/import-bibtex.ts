/**
 * Parse a .bib file (Zotero/Mendeley/EndNote/Google Scholar export) and
 * import each entry into Publications.
 *
 * Run: bun run payload -- run scripts/ingestion/import-bibtex.ts <path.bib> [dry-run]
 *
 * Per entry: has a `doi` field -> hydrate via Crossref/OpenAlex (BibTeX only
 * supplies the DOI, those APIs stay the enrichment source of truth). No DOI
 * but has a `title` -> Crossref reverse-title-lookup, then same path. Neither
 * -> write directly from BibTeX fields alone (author list is already
 * structured by the parser), always flagged as low-confidence since it never
 * got Crossref/OpenAlex enrichment.
 *
 * Routes through the shared staging + persistence engine (stageBibtexCandidates
 * + import-runs/review-items bookkeeping) instead of parsing and hydrating
 * inline — this CLI has no human selection step, so every staged candidate is
 * processed automatically regardless of its `selected` flag. `parse()` is
 * still called directly here (in addition to stageBibtexCandidates internally
 * re-parsing) solely to preserve the original "N entries found, M parse
 * errors" console output, since StagedCandidate doesn't carry parser errors.
 */
import path from 'node:path'
import fs from 'node:fs'
import { parse } from '@retorquere/bibtex-parser'
import { getPayload } from 'payload'
import config from '@payload-config'

import { resolveCrossrefTitle } from '@/lib/ingestion/fetch'
import {
  hydratePublicationFromDoi,
  hydratePublicationFromFields,
  loadPublicationIndexes,
  type HydratePublicationResult,
} from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'
import { finalizeRun, persistRunProgress, type RunProgress } from '@/lib/ingestion/run-persistence'
import { stageBibtexCandidates } from '@/lib/ingestion/staging'
import type { UpsertAction } from '@/lib/ingestion/upsert'

const DRY_RUN = process.argv.includes('dry-run')
const bibPath = process.argv.slice(2).find((arg) => arg !== 'dry-run')

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
      // Not expected from this pipeline (hydratePublicationFromDoi/Fields'
      // own existence check always precedes upsertByKey on the same key),
      // but bucket conservatively rather than drop the count.
      progress.created++
      break
  }
}

async function main() {
  if (!bibPath) {
    console.error(
      'Usage: bun run payload -- run scripts/ingestion/import-bibtex.ts <path.bib> [dry-run]',
    )
    process.exit(1)
  }

  const bibText = fs.readFileSync(bibPath, 'utf-8')

  // Parsed directly (in addition to stageBibtexCandidates' own internal
  // parse) purely to preserve the original entries/parse-errors console
  // output — StagedCandidate has no field for parser errors.
  const bib = parse(bibText)
  console.log(`${bib.entries.length} entries found, ${bib.errors.length} parse errors.`)

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  const candidates = await stageBibtexCandidates(bibText)

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
      label: `BibTeX import — ${bibPath}`,
      source: 'cli',
      status: 'running',
      params: { bibPath, dryRun: DRY_RUN },
      rawInput: bibText,
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
      const sourceContext = `bibtex:${candidate.raw?.key}`
      let result: HydratePublicationResult | null = null

      if (candidate.doi) {
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
        // stageBibtexCandidates falls back to entry.key as `title` when the
        // entry has no title field at all — that's the only signal left to
        // detect the "no title" case from a staged candidate.
        const titleMissing = candidate.title === candidate.raw?.key

        if (titleMissing) {
          report.flagUnmatched({
            collection: 'publications',
            field: 'title',
            sourceContext,
            value: '(bibtex entry has no title field)',
          })
        } else {
          const resolution = await resolveCrossrefTitle(candidate.title)
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
          } else if (candidate.year === undefined) {
            report.flagUnmatched({
              collection: 'publications',
              field: 'year',
              sourceContext,
              value: '(bibtex entry has no parseable year field)',
            })
          } else {
            result = await hydratePublicationFromFields(
              payload,
              report,
              {
                title: candidate.title,
                year: candidate.year,
                authors: (candidate.raw?.authors as Array<{ fullName: string }>) ?? [],
              },
              indexes,
              DRY_RUN,
              sourceContext,
            )
          }
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

  if (bib.errors.length > 0) {
    console.log(`\n--- BibTeX parse errors (${bib.errors.length}) ---`)
    for (const error of bib.errors) {
      console.log(error.error)
    }
  }

  report.print(DRY_RUN)
  const previewPath = report.writePreview(`bibtex-${path.basename(bibPath ?? '')}`, {
    bibPath,
    dryRun: DRY_RUN,
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
