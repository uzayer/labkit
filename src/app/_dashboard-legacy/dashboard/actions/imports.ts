'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { after } from 'next/server'

import { normalizeDoi } from '@labkit/core/ingestion/normalize'
import {
  hydratePublicationFromDoi,
  loadPublicationIndexes,
} from '@labkit/core/ingestion/publications'
import { ImportReport } from '@labkit/core/ingestion/report'
import { finalizeRun } from '@labkit/core/ingestion/run-persistence'
import {
  stageBibtexCandidates,
  stageCitationCandidates,
  stageOrcidCandidates,
  type StagedCandidate,
} from '@labkit/core/ingestion/staging'
import type { ImportRun } from '@/payload-types'
import { checkRole } from '@labkit/core/access'
import { getMeUser } from '@/utilities/getMeUser'

const IMPORT_QUEUE = 'imports'

async function requireAdminUser() {
  const { user } = await getMeUser()

  if (!checkRole(['admin'], user)) {
    throw new Error('Unauthorized import operation')
  }

  return user
}

export type ImportSource = 'orcid' | 'bibtex' | 'citations'

export interface StageImportInput {
  orcidId?: string
  bibtexText?: string
  citationText?: string
}

export type StageImportResult = { runId: string } | { error: string }

function buildLabel(source: ImportSource, input: StageImportInput): string {
  if (source === 'orcid') return `ORCID import — ${input.orcidId ?? 'unknown'}`
  if (source === 'bibtex') return 'BibTeX import'
  return 'Citation paste import'
}

export async function stageImport(
  source: ImportSource,
  input: StageImportInput,
): Promise<StageImportResult> {
  await requireAdminUser()

  try {
    let candidates: StagedCandidate[]
    let params: Record<string, unknown>
    let rawInput: string | undefined

    if (source === 'orcid') {
      if (!input.orcidId) return { error: 'An ORCID iD is required' }
      candidates = await stageOrcidCandidates(input.orcidId)
      params = { orcidId: input.orcidId }
    } else if (source === 'bibtex') {
      if (!input.bibtexText) return { error: 'BibTeX text is required' }
      candidates = await stageBibtexCandidates(input.bibtexText)
      params = {}
      rawInput = input.bibtexText
    } else {
      if (!input.citationText) return { error: 'Citation text is required' }
      candidates = await stageCitationCandidates(input.citationText)
      params = {}
      rawInput = input.citationText
    }

    if (candidates.length === 0) {
      return { error: 'No candidates found — nothing to stage' }
    }

    const payload = await getPayload({ config: configPromise })

    const run = await payload.create({
      collection: 'import-runs',
      data: {
        label: buildLabel(source, input),
        source,
        status: 'staged',
        params,
        rawInput,
        candidates: candidates as unknown as ImportRun['candidates'],
        progress: {
          total: candidates.length,
          processed: 0,
          created: 0,
          skippedExisting: 0,
          failed: 0,
        },
      },
      overrideAccess: true,
    })

    return { runId: run.id }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to stage import' }
  }
}

export interface StartImportResult {
  success: boolean
  error?: string
}

export async function startImport(
  runId: string,
  selectedKeys: string[],
): Promise<StartImportResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    const run = await payload.findByID({
      collection: 'import-runs',
      id: runId,
      overrideAccess: true,
    })

    if (run.status !== 'staged') {
      return { success: false, error: `Run is already ${run.status} — cannot restart it` }
    }

    const selected = new Set(selectedKeys)
    const candidates = Array.isArray(run.candidates) ? run.candidates : []
    const nextCandidates = candidates.map((candidate) => {
      if (!candidate || typeof candidate !== 'object' || Array.isArray(candidate)) {
        return candidate
      }
      const key = (candidate as Record<string, unknown>).key
      return { ...candidate, selected: typeof key === 'string' && selected.has(key) }
    })

    await payload.update({
      collection: 'import-runs',
      id: runId,
      data: {
        status: 'running',
        startedAt: new Date().toISOString(),
        candidates: nextCandidates as unknown as ImportRun['candidates'],
      },
      overrideAccess: true,
    })

    await payload.jobs.queue({
      queue: IMPORT_QUEUE,
      task: 'import-hydrate',
      input: { runId },
      overrideAccess: true,
    })

    after(payload.jobs.run({ queue: IMPORT_QUEUE, overrideAccess: true }))

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to start import' }
  }
}

export async function getRunStatus(runId: string): Promise<ImportRun | { error: string }> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    return await payload.findByID({
      collection: 'import-runs',
      id: runId,
      overrideAccess: true,
    })
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to load run status' }
  }
}

export interface CancelImportResult {
  success: boolean
  error?: string
}

export async function cancelImport(runId: string): Promise<CancelImportResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    const run = await payload.findByID({
      collection: 'import-runs',
      id: runId,
      overrideAccess: true,
    })

    if (run.status === 'completed' || run.status === 'failed' || run.status === 'cancelled') {
      return { success: false, error: `Run is already ${run.status}` }
    }

    await payload.update({
      collection: 'import-runs',
      id: runId,
      data: { status: 'cancelled', finishedAt: new Date().toISOString() },
      overrideAccess: true,
    })

    return { success: true }
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : 'Failed to cancel import' }
  }
}

export interface QuickAddDoiResult {
  title?: string
  action?: string
  reviewCount?: number
  error?: string
}

export async function quickAddDoi(doi: string): Promise<QuickAddDoiResult> {
  await requireAdminUser()

  if (!doi.trim()) {
    return { error: 'A DOI is required' }
  }

  const payload = await getPayload({ config: configPromise })
  const normalizedDoi = normalizeDoi(doi)

  try {
    const indexes = await loadPublicationIndexes(payload)
    const report = new ImportReport()

    const result = await hydratePublicationFromDoi(
      payload,
      report,
      normalizedDoi,
      indexes,
      false,
      'dashboard-doi-quick-add',
    )

    const candidate: StagedCandidate = {
      key: `doi:${normalizedDoi}`,
      title: normalizedDoi,
      doi: normalizedDoi,
      selected: true,
      status: 'pending',
    }

    const run = await payload.create({
      collection: 'import-runs',
      data: {
        label: `DOI quick-add — ${normalizedDoi}`,
        source: 'doi',
        status: 'running',
        params: { doi: normalizedDoi },
        candidates: [candidate] as unknown as ImportRun['candidates'],
        progress: {
          total: 1,
          processed: 1,
          created: result && result.action !== 'skipped-existing' ? 1 : 0,
          skippedExisting: result?.action === 'skipped-existing' ? 1 : 0,
          failed: result ? 0 : 1,
        },
        startedAt: new Date().toISOString(),
      },
      overrideAccess: true,
    })

    await finalizeRun(payload, run.id, report, 'completed')

    const { unmatched, suggestions } = report.toJSON()
    const reviewCount = unmatched.length + suggestions.length

    let title: string | undefined
    if (result) {
      const publication = await payload.findByID({
        collection: 'publications',
        id: result.id,
        overrideAccess: true,
        depth: 0,
      })
      title = publication.title
    }

    return {
      title,
      action: result ? result.action : 'flagged',
      reviewCount,
    }
  } catch (err) {
    return { error: err instanceof Error ? err.message : 'Failed to import DOI' }
  }
}
