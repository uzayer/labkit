import type { CollectionSlug, TaskConfig } from 'payload'
import { NotFound } from 'payload'

import type { ImportRun } from '@/payload-types'

import { resolveCrossrefTitle } from '../fetch'
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

const BATCH_SIZE = 20
const THROTTLE_MS = 150
const IMPORT_QUEUE = 'imports'

interface ImportHydrateTaskIO {
  input: {
    runId: string
  }
  output: Record<string, never>
}

type PersistedCandidateStatus =
  StagedCandidate['status'] | 'created' | 'updated' | 'skipped-existing' | 'failed' | 'flagged'

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

function bucketAction(progress: RunProgress, action: UpsertAction) {
  switch (action) {
    case 'created':
    case 'skipped-dry-run':
    case 'updated':
      progress.created++
      break
    case 'skipped-existing':
      progress.skippedExisting++
      break
  }
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

  const resolution = await resolveCrossrefTitle(candidate.title)
  await sleep(THROTTLE_MS)

  if (resolution.method === 'crossref' && resolution.candidate) {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      resolution.candidate.doi,
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
  const resolution = await resolveCrossrefTitle(chunk)
  await sleep(THROTTLE_MS)

  if (resolution.method === 'crossref' && resolution.candidate) {
    const result = await hydratePublicationFromDoi(
      payload,
      report,
      resolution.candidate.doi,
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
  inputSchema: [{ name: 'runId', type: 'text', required: true }],
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

    const report = new ImportReport()
    restoreReport(report, run.reportSummary)

    const indexes = await loadPublicationIndexes(req.payload)
    const candidates = parseCandidates(run.candidates)
    const nextBatch = candidates
      .filter((candidate) => candidate.status === 'pending' && candidate.selected !== false)
      .slice(0, BATCH_SIZE)
    const progress = createProgress(candidates)

    try {
      for (const candidate of nextBatch) {
        const result = await processCandidate(req.payload, run, report, indexes, candidate)

        progress.processed++
        if (result) {
          candidate.status = resultStatus(result)
          bucketAction(progress, result.action)
        } else {
          candidate.status = 'flagged'
          progress.failed++
        }
      }
    } catch (error) {
      await finalizeRun(req.payload, input.runId, report, 'failed', String(error))
      throw error
    }

    await req.payload.update({
      collection: 'import-runs',
      id: input.runId,
      data: {
        status: 'running',
        startedAt: run.startedAt ?? new Date().toISOString(),
        candidates,
        progress,
        reportSummary: report.toJSON() as ReportSummary,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })

    const hasPendingCandidates = candidates.some(
      (candidate) => candidate.status === 'pending' && candidate.selected !== false,
    )

    if (hasPendingCandidates) {
      await req.payload.jobs.queue({
        queue: IMPORT_QUEUE,
        task: 'import-hydrate',
        input: { runId: input.runId },
      })
      return { output: {} }
    }

    await finalizeRun(req.payload, input.runId, report, 'completed')
    return { output: {} }
  },
}

export default importHydrateTask
