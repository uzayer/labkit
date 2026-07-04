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
 * resolveOrCreatePartnerOrg — see src/lib/ingestion/publications.ts and
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

  for (const entry of unmatched) {
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

  for (const entry of suggestions) {
    await payload.create({
      collection: 'review-items',
      data: {
        kind: 'person-merge-suggestion',
        status: 'open',
        run: runId,
        value: entry.value,
        sourceContext: entry.sourceContext,
        // DedupeSuggestion doesn't carry team IDs today, just name strings —
        // pass through what exists rather than inventing fields it lacks.
        data: { suggestedMatch: entry.suggestedMatch },
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
      ...(error !== undefined ? { error } : {}),
    },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
}
