import type { Payload } from 'payload'
import type { ImportReport } from './report'

type ReportJSON = ReturnType<ImportReport['toJSON']>
type UnmatchedEntry = ReportJSON['unmatched'][number]

type ReviewItemKind =
  | 'unmatched-venue'
  | 'unmatched-org'
  | 'person-merge-suggestion'
  | 'no-doi-work'
  | 'unparsed-citation'
  | 'unmapped-type'
  | 'failed-doi'

export interface RunProgress {
  total: number
  processed: number
  created: number
  skippedExisting: number
  failed: number
}

export async function persistRunProgress(
  payload: Payload,
  runId: string,
  progress: RunProgress,
): Promise<void> {
  await payload.update({
    collection: 'import-runs',
    id: runId,
    data: { progress },
    overrideAccess: true,
    // Runs outside a Next.js request (background job / CLI) — same reason
    // upsertByKey disables revalidation.
    context: { disableRevalidate: true },
  })
}

/**
 * Maps an UnmatchedRelation onto a review-items `kind`. The (collection,
 * field, value) combinations below are the ones actually produced by
 * hydratePublicationFromDoi/hydratePublicationFromFields and resolveVenue /
 * resolveOrCreatePartnerOrg — see ./publications.ts and
 * organizations.ts. Anything unrecognized falls back to 'unparsed-citation'
 * (the closest thing to a generic "needs a human look" bucket) rather than
 * throwing, since new call sites elsewhere in the engine may flag relations
 * this mapping hasn't seen yet.
 */
function inferReviewKind(entry: UnmatchedEntry): ReviewItemKind {
  if (entry.collection === 'venues') return 'unmatched-venue'
  if (entry.collection === 'organizations') return 'unmatched-org'

  if (entry.collection === 'publications') {
    if (entry.field === 'doi') {
      if (entry.value === '(no DOI)') return 'no-doi-work'
      if (entry.value.startsWith('ambiguous —')) return 'unparsed-citation'
      return 'failed-doi'
    }
    if (entry.field === 'type') return 'unmapped-type'
    if (entry.field === 'title') {
      if (entry.value === '(bibtex entry has no title field)') return 'unparsed-citation'
      return 'failed-doi'
    }
    if (entry.field === 'year' || entry.field === 'enrichment') return 'unparsed-citation'
    // Zero-author works (minRows: 1 guard in publications.ts) — nothing was
    // created, a human has to supply the author list.
    if (entry.field === 'authors') return 'unparsed-citation'
  }

  return 'unparsed-citation'
}

export async function finalizeRun(
  payload: Payload,
  runId: string,
  report: ImportReport,
  status: 'completed' | 'failed',
  error?: string,
): Promise<void> {
  const { unmatched, suggestions } = report.toJSON()

  // A dry run's Review Items would land in the same open queue the Operator
  // works from, indistinguishable from real ones, and point at records that
  // were never written. The run keeps its reportSummary (and the importer
  // writes a preview file), so nothing is lost by not queueing them.
  const run = await payload.findByID({
    collection: 'import-runs',
    id: runId,
    depth: 0,
    overrideAccess: true,
  })
  const params = run.params as { dryRun?: unknown } | null | undefined
  const isDryRun = params?.dryRun === true

  // Idempotency: a finalize that crashed halfway (or a double-finalize from a
  // requeued job) must not leave duplicate review items. Review items for a
  // run only ever exist once finalize has run, so wiping the run's items and
  // recreating from the full report is safe — nobody can have resolved one
  // for a run that hasn't finished yet.
  await payload.delete({
    collection: 'review-items',
    where: { run: { equals: runId } },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })

  for (const entry of isDryRun ? [] : unmatched) {
    await payload.create({
      collection: 'review-items',
      data: {
        kind: inferReviewKind(entry),
        status: 'open',
        run: runId,
        value: entry.value,
        sourceContext: entry.sourceContext,
        data: null,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  for (const entry of isDryRun ? [] : suggestions) {
    await payload.create({
      collection: 'review-items',
      data: {
        kind: 'person-merge-suggestion',
        status: 'open',
        run: runId,
        value: entry.value,
        sourceContext: entry.sourceContext,
        // Structured ids so the review queue can merge without parsing them
        // out of the display strings. Older persisted summaries (and dry-run
        // placeholders) may lack them — nullable by design.
        data: {
          suggestedMatch: entry.suggestedMatch,
          newTeamId: entry.newTeamId ?? null,
          existingTeamId: entry.existingTeamId ?? null,
          score: entry.score ?? null,
        },
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
  }

  await payload.update({
    collection: 'import-runs',
    id: runId,
    data: {
      status,
      reportSummary: report.toJSON(),
      finishedAt: new Date().toISOString(),
      // Release the job lease (no-op for CLI runs, which never take one).
      lock: { token: null, heartbeatAt: null },
      ...(error !== undefined ? { error } : {}),
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
}
