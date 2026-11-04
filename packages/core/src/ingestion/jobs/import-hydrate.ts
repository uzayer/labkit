import { randomUUID } from 'node:crypto'

import type { CollectionSlug, Payload, TaskConfig } from 'payload'
import { NotFound } from 'payload'

import type { ImportRun } from '../../types'

import { bibtexSearchInput, resolveCrossrefSearch, searchReviewData } from '../crossref-search'
import {
  hydratePublicationFromDoi,
  hydratePublicationFromFields,
  loadPublicationIndexes,
  type HydratePublicationResult,
} from '../publications'
import { ImportReport } from '../report'
import { finalizeRun, type RunProgress } from '../run-persistence'
import type { StagedCandidate } from '../staging'
import type { UpsertAction } from '../upsert'

/**
 * Candidates per job invocation, unless the job's input says otherwise. A
 * caller whose function has a hard time limit (the onboarding wizard on
 * Vercel, about 300s) asks for fewer: on slow sources one Candidate can take
 * several seconds, and DBLP or a Retry-After wait can stretch that. The size
 * rides in the job input, so every successor and watchdog job keeps it.
 */
export const DEFAULT_BATCH_SIZE = 20
// A sanity cap for scripts, not a time budget: callers with a limit pick their own size.
export const MAX_BATCH_SIZE = 100
const THROTTLE_MS = 150
const IMPORT_QUEUE = 'imports'

// Lease/watchdog timing. The lease holder refreshes lock.heartbeatAt after
// every candidate (each takes a few seconds), so a heartbeat older than
// LEASE_MS means the holding worker died and the lease may be taken over.
// A crashed Payload job stays `processing: true` forever and is never
// retried, so recovery has to come from a *separately queued* job — the
// watchdog queued at the top of every invocation, delayed by
// WATCHDOG_DELAY_MS via `waitUntil`. Together they maintain the invariant
// that a non-terminal run always has at least one queued job.
const LEASE_MS = 5 * 60_000
const WATCHDOG_DELAY_MS = 5 * 60_000
const CONTENTION_RETRY_MS = 60_000

interface ImportHydrateTaskIO {
  input: {
    runId: string
    batchSize?: number | null
  }
  output: Record<string, never>
}

function batchSizeOf(input: ImportHydrateTaskIO['input']): number {
  const size = input.batchSize
  if (typeof size !== 'number' || !Number.isInteger(size) || size < 1) return DEFAULT_BATCH_SIZE
  return Math.min(size, MAX_BATCH_SIZE)
}

type PersistedCandidateStatus =
  | StagedCandidate['status']
  | 'created'
  | 'updated'
  | 'skipped-existing'
  | 'failed'
  | 'flagged'

interface PersistedCandidate extends Omit<StagedCandidate, 'status'> {
  status: PersistedCandidateStatus
}

type ReportSummary = ReturnType<ImportReport['toJSON']>

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value)
}

function isUpsertAction(value: unknown): value is UpsertAction {
  return (
    value === 'created' ||
    value === 'updated' ||
    value === 'skipped-dry-run' ||
    value === 'skipped-existing'
  )
}

function isPersistedCandidateStatus(value: unknown): value is PersistedCandidateStatus {
  return (
    value === 'pending' ||
    value === 'created' ||
    value === 'updated' ||
    value === 'skipped-existing' ||
    value === 'failed' ||
    value === 'flagged'
  )
}

function normalizeCandidate(value: unknown): PersistedCandidate | null {
  if (!isRecord(value) || typeof value.key !== 'string' || typeof value.title !== 'string') {
    return null
  }

  return {
    key: value.key,
    title: value.title,
    year: typeof value.year === 'number' ? value.year : undefined,
    doi: typeof value.doi === 'string' ? value.doi : undefined,
    note: typeof value.note === 'string' ? value.note : undefined,
    selected: value.selected !== false,
    status: isPersistedCandidateStatus(value.status) ? value.status : 'pending',
    raw: isRecord(value.raw) ? value.raw : undefined,
  }
}

function parseCandidates(value: ImportRun['candidates']): PersistedCandidate[] {
  if (!Array.isArray(value)) return []

  return value.flatMap((candidate) => {
    const normalized = normalizeCandidate(candidate)
    return normalized ? [normalized] : []
  })
}

function createProgress(candidates: PersistedCandidate[]): RunProgress {
  return candidates.reduce<RunProgress>(
    (progress, candidate) => {
      if (candidate.selected === false) {
        return progress
      }

      progress.total++

      switch (candidate.status) {
        case 'created':
        case 'updated':
          progress.processed++
          progress.created++
          break
        case 'skipped-existing':
          progress.processed++
          progress.skippedExisting++
          break
        case 'failed':
        case 'flagged':
          progress.processed++
          progress.failed++
          break
      }

      return progress
    },
    {
      total: 0,
      processed: 0,
      created: 0,
      skippedExisting: 0,
      failed: 0,
    },
  )
}

/**
 * Compare-and-swap claim on the run's lease lock: succeeds only when no one
 * holds it (or the holder's heartbeat has gone stale). Serializes workers
 * per run — duplicate queued jobs, overlapping cron ticks, and manual
 * requeues all reduce to one active worker.
 */
async function claimRunLock(payload: Payload, runId: string): Promise<string | null> {
  const token = randomUUID()
  const staleCutoff = new Date(Date.now() - LEASE_MS).toISOString()

  const claimed = await payload.db.updateOne({
    collection: 'import-runs',
    where: {
      and: [
        { id: { equals: runId } },
        {
          or: [
            { 'lock.token': { exists: false } },
            { 'lock.token': { equals: null } },
            { 'lock.heartbeatAt': { less_than: staleCutoff } },
          ],
        },
      ],
    },
    data: { lock: { token, heartbeatAt: new Date().toISOString() } },
  })

  return claimed ? token : null
}

async function releaseRunLock(payload: Payload, runId: string, token: string): Promise<void> {
  await payload.db.updateOne({
    collection: 'import-runs',
    where: {
      and: [{ id: { equals: runId } }, { 'lock.token': { equals: token } }],
    },
    data: { lock: { token: null, heartbeatAt: null } },
  })
}

/**
 * Candidates staged with a warning note and never selected (ORCID works
 * without a DOI, bibtex entries without a doi field, ambiguous citation
 * chunks) still owe the operator a review-items row — deselection-by-default
 * at staging is a safety valve, not a resolution. Candidates a user
 * deselected deliberately (DOI-bearing, no note) stay silent.
 */
function flagSkippedCandidates(report: ImportReport, candidates: PersistedCandidate[]) {
  for (const candidate of candidates) {
    if (candidate.selected !== false || candidate.status !== 'pending' || !candidate.note) {
      continue
    }

    report.flagUnmatched({
      collection: 'publications',
      field: 'doi',
      sourceContext: candidate.title,
      // '(no DOI)' is the exact value run-persistence maps to the
      // 'no-doi-work' review kind; other notes ('ambiguous — …') map to
      // 'unparsed-citation'.
      value: candidate.note.startsWith('no DOI found') ? '(no DOI)' : candidate.note,
    })
  }
}

/**
 * Sanctioned kickoff for a staged run: queue the job FIRST, then flip the
 * run to `running`. In this order a failure between the two steps leaves a
 * queued job that sets the status itself on its first checkpoint — whereas
 * marking `running` first and then failing to queue strands the run with no
 * queued job for the cron safety net to resume (nothing scans for jobless
 * running runs). Dashboard actions and scripts should call this instead of
 * queueing + updating inline.
 */
export async function queueImportRun(
  payload: Payload,
  runId: string,
  options: { batchSize?: number } = {},
): Promise<void> {
  await payload.jobs.queue({
    queue: IMPORT_QUEUE,
    task: 'import-hydrate',
    input: { runId, batchSize: options.batchSize },
    overrideAccess: true,
  })

  await payload.update({
    collection: 'import-runs',
    id: runId,
    data: { status: 'running', startedAt: new Date().toISOString() },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
}

function restoreReport(report: ImportReport, summary: ImportRun['reportSummary']) {
  if (!isRecord(summary)) return

  if (isRecord(summary.counts)) {
    for (const [collection, actions] of Object.entries(summary.counts)) {
      if (!isRecord(actions)) continue

      for (const [action, count] of Object.entries(actions)) {
        if (!isUpsertAction(action) || typeof count !== 'number' || count < 1) continue

        for (let index = 0; index < count; index++) {
          report.record(collection as CollectionSlug, action)
        }
      }
    }
  }

  if (Array.isArray(summary.unmatched)) {
    for (const entry of summary.unmatched) {
      if (
        !isRecord(entry) ||
        typeof entry.collection !== 'string' ||
        typeof entry.field !== 'string' ||
        typeof entry.sourceContext !== 'string' ||
        typeof entry.value !== 'string'
      ) {
        continue
      }

      report.flagUnmatched({
        collection: entry.collection as CollectionSlug,
        field: entry.field,
        sourceContext: entry.sourceContext,
        value: entry.value,
        data: isRecord(entry.data) ? entry.data : undefined,
        kind:
          entry.kind === 'preprint-link' || entry.kind === 'possible-duplicate'
            ? entry.kind
            : undefined,
      })
    }
  }

  if (Array.isArray(summary.suggestions)) {
    for (const entry of summary.suggestions) {
      if (
        !isRecord(entry) ||
        typeof entry.collection !== 'string' ||
        typeof entry.field !== 'string' ||
        typeof entry.sourceContext !== 'string' ||
        typeof entry.value !== 'string' ||
        typeof entry.suggestedMatch !== 'string'
      ) {
        continue
      }

      report.suggestDedupe({
        collection: entry.collection as CollectionSlug,
        field: entry.field,
        sourceContext: entry.sourceContext,
        value: entry.value,
        suggestedMatch: entry.suggestedMatch,
        // Structured merge ids — must round-trip across batch invocations or
        // finalize would persist id-less suggestions for multi-batch runs.
        newTeamId: typeof entry.newTeamId === 'string' ? entry.newTeamId : undefined,
        existingTeamId: typeof entry.existingTeamId === 'string' ? entry.existingTeamId : undefined,
        score: typeof entry.score === 'number' ? entry.score : undefined,
        reason:
          entry.reason === 'orcid-name-conflict' ||
          entry.reason === 'dblp-pid-name-conflict' ||
          entry.reason === 'name-variant'
            ? entry.reason
            : undefined,
        identifier: typeof entry.identifier === 'string' ? entry.identifier : undefined,
      })
    }
  }
}

function isBibtexRaw(raw: PersistedCandidate['raw']): raw is Record<string, unknown> & {
  key: string
  authors?: Array<{ fullName: string }>
} {
  return isRecord(raw) && typeof raw.key === 'string' && Object.hasOwn(raw, 'authors')
}

function isCitationRaw(raw: PersistedCandidate['raw']): raw is Record<string, unknown> & {
  chunk: string
} {
  return isRecord(raw) && typeof raw.chunk === 'string'
}

function getStringParam(params: ImportRun['params'], key: string): string | undefined {
  if (!isRecord(params)) return undefined

  const value = params[key]
  return typeof value === 'string' && value.length > 0 ? value : undefined
}

function getOrcidSourceContext(run: ImportRun, candidate: PersistedCandidate): string {
  const orcidId = getStringParam(run.params, 'orcidId')
  return orcidId ? `ORCID ${orcidId}` : `ORCID ${candidate.title}`
}

function isAmbiguousCitation(candidate: PersistedCandidate): boolean {
  return candidate.note?.startsWith('ambiguous —') ?? false
}

function resultStatus(result: HydratePublicationResult): PersistedCandidateStatus {
  if (result.action === 'updated') return 'updated'
  if (result.action === 'skipped-existing') return 'skipped-existing'
  return 'created'
}

async function processBibtexCandidate(
  payload: Parameters<typeof hydratePublicationFromDoi>[0],
  report: ImportReport,
  indexes: Awaited<ReturnType<typeof loadPublicationIndexes>>,
  candidate: PersistedCandidate,
): Promise<HydratePublicationResult | null> {
  if (!isBibtexRaw(candidate.raw)) {
    return null
  }

  const sourceContext = `bibtex:${candidate.raw.key}`

  if (candidate.doi) {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      candidate.doi,
      indexes,
      false,
      sourceContext,
    )
    await sleep(THROTTLE_MS)
    return result
  }

  const titleMissing = candidate.title === candidate.raw.key

  if (titleMissing) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'title',
      sourceContext,
      value: '(bibtex entry has no title field)',
    })
    return null
  }

  const decision = await resolveCrossrefSearch(bibtexSearchInput(candidate))
  await sleep(THROTTLE_MS)

  if (decision.status === 'accepted') {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      decision.doi,
      indexes,
      false,
      sourceContext,
    )
    await sleep(THROTTLE_MS)
    return result
  }

  if (candidate.year === undefined) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'year',
      sourceContext,
      value: '(bibtex entry has no parseable year field)',
    })
    return null
  }

  return hydratePublicationFromFields(
    payload,
    report,
    {
      title: candidate.title,
      year: candidate.year,
      authors: (candidate.raw.authors as Array<{ fullName: string }> | undefined) ?? [],
      entryType: typeof candidate.raw.type === 'string' ? candidate.raw.type : undefined,
      searchReview: searchReviewData(decision),
    },
    indexes,
    false,
    sourceContext,
  )
}

async function processCitationCandidate(
  payload: Parameters<typeof hydratePublicationFromDoi>[0],
  report: ImportReport,
  indexes: Awaited<ReturnType<typeof loadPublicationIndexes>>,
  candidate: PersistedCandidate,
): Promise<HydratePublicationResult | null> {
  if (!isCitationRaw(candidate.raw)) {
    return null
  }

  const sourceContext = candidate.title

  if (isAmbiguousCitation(candidate)) {
    report.flagUnmatched({
      collection: 'publications',
      field: 'doi',
      sourceContext,
      value: candidate.note!,
    })
    return null
  }

  if (candidate.doi) {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      candidate.doi,
      indexes,
      false,
      sourceContext,
    )
    await sleep(THROTTLE_MS)
    return result
  }

  const chunk = candidate.raw.chunk
  const decision = await resolveCrossrefSearch({ chunk })
  await sleep(THROTTLE_MS)

  if (decision.status === 'accepted') {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      decision.doi,
      indexes,
      false,
      sourceContext,
    )
    await sleep(THROTTLE_MS)
    return result
  }

  report.flagUnmatched({
    collection: 'publications',
    field: 'doi',
    sourceContext,
    value: chunk.length > 200 ? `${chunk.slice(0, 200)}…` : chunk,
    data: searchReviewData(decision),
  })
  return null
}

async function processOrcidOrDoiCandidate(
  payload: Parameters<typeof hydratePublicationFromDoi>[0],
  run: ImportRun,
  report: ImportReport,
  indexes: Awaited<ReturnType<typeof loadPublicationIndexes>>,
  candidate: PersistedCandidate,
): Promise<HydratePublicationResult | null> {
  const sourceContext =
    run.source === 'doi' && candidate.doi
      ? `DOI ${candidate.doi}`
      : getOrcidSourceContext(run, candidate)

  if (candidate.doi) {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      candidate.doi,
      indexes,
      false,
      sourceContext,
    )
    await sleep(THROTTLE_MS)
    return result
  }

  report.flagUnmatched({
    collection: 'publications',
    field: 'doi',
    sourceContext,
    value: '(no DOI)',
  })
  return null
}

async function processCandidate(
  payload: Parameters<typeof hydratePublicationFromDoi>[0],
  run: ImportRun,
  report: ImportReport,
  indexes: Awaited<ReturnType<typeof loadPublicationIndexes>>,
  candidate: PersistedCandidate,
): Promise<HydratePublicationResult | null> {
  if (isBibtexRaw(candidate.raw)) {
    return processBibtexCandidate(payload, report, indexes, candidate)
  }

  if (isCitationRaw(candidate.raw)) {
    return processCitationCandidate(payload, report, indexes, candidate)
  }

  return processOrcidOrDoiCandidate(payload, run, report, indexes, candidate)
}

export const importHydrateTask: TaskConfig<ImportHydrateTaskIO> = {
  slug: 'import-hydrate',
  inputSchema: [
    { name: 'runId', type: 'text', required: true },
    { name: 'batchSize', type: 'number', min: 1, max: MAX_BATCH_SIZE },
  ],
  retries: 0,
  handler: async ({ input, req }) => {
    let run: ImportRun

    try {
      run = await req.payload.findByID({
        collection: 'import-runs',
        id: input.runId,
        overrideAccess: true,
      })
    } catch (error) {
      if (error instanceof NotFound) {
        return { output: {} }
      }
      throw error
    }

    if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
      return { output: {} }
    }

    const lockToken = await claimRunLock(req.payload, input.runId)
    if (!lockToken) {
      // Another worker holds the lease. Don't just exit: this job may be the
      // run's only remaining queued job (e.g. the watchdog firing while the
      // worker is mid-batch), and crash recovery depends on a non-terminal
      // run always having at least one queued job — so hand the baton to a
      // delayed replacement instead.
      await req.payload.jobs.queue({
        queue: IMPORT_QUEUE,
        task: 'import-hydrate',
        input: { runId: input.runId, batchSize: input.batchSize },
        waitUntil: new Date(Date.now() + CONTENTION_RETRY_MS),
        overrideAccess: true,
      })
      return { output: {} }
    }

    // Watchdog: queued before any processing, so a crash anywhere below
    // still leaves a queued job for the cron safety net to resume from the
    // last per-item checkpoint. On a healthy run it fires after completion
    // and no-ops at the terminal-status check above.
    await req.payload.jobs.queue({
      queue: IMPORT_QUEUE,
      task: 'import-hydrate',
      input: { runId: input.runId, batchSize: input.batchSize },
      waitUntil: new Date(Date.now() + WATCHDOG_DELAY_MS),
      overrideAccess: true,
    })

    const report = new ImportReport()
    restoreReport(report, run.reportSummary)

    const indexes = await loadPublicationIndexes(req.payload)
    const candidates = parseCandidates(run.candidates)
    const nextBatch = candidates
      .filter((candidate) => candidate.status === 'pending' && candidate.selected !== false)
      .slice(0, batchSizeOf(input))
    const startedAt = run.startedAt ?? new Date().toISOString()

    try {
      for (const candidate of nextBatch) {
        const result = await processCandidate(req.payload, run, report, indexes, candidate)

        candidate.status = result ? resultStatus(result) : 'flagged'

        // Per-item checkpoint: the run doc is the resume point, so candidate
        // statuses, progress, and the report must be durable after every
        // item — a worker that dies mid-batch loses at most the item it was
        // on, and a resumed run never replays already-written publications.
        // Also refreshes the lease heartbeat.
        await req.payload.update({
          collection: 'import-runs',
          id: input.runId,
          data: {
            status: 'running',
            startedAt,
            candidates,
            progress: createProgress(candidates),
            reportSummary: report.toJSON() as ReportSummary,
            lock: { token: lockToken, heartbeatAt: new Date().toISOString() },
          },
          overrideAccess: true,
          context: { disableRevalidate: true },
        })
      }
    } catch (error) {
      await finalizeRun(req.payload, input.runId, report, 'failed', String(error))
      throw error
    }

    const hasPendingCandidates = candidates.some(
      (candidate) => candidate.status === 'pending' && candidate.selected !== false,
    )

    if (hasPendingCandidates) {
      await req.payload.jobs.queue({
        queue: IMPORT_QUEUE,
        task: 'import-hydrate',
        input: { runId: input.runId, batchSize: input.batchSize },
        overrideAccess: true,
      })
      await releaseRunLock(req.payload, input.runId, lockToken)
      return { output: {} }
    }

    flagSkippedCandidates(report, candidates)
    // finalizeRun releases the lease along with its final status write.
    await finalizeRun(req.payload, input.runId, report, 'completed')
    return { output: {} }
  },
}

export default importHydrateTask
