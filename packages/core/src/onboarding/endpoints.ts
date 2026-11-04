import type { Endpoint, PayloadRequest } from 'payload'
import { addDataAndFileToRequest } from 'payload'

import type { ImportRun } from '../types'
import { MAX_BATCH_SIZE, queueImportRun } from '../ingestion/jobs/import-hydrate'
import { OrcidUnavailableError } from '../ingestion/orcid'
import { stageOrcidCandidates } from '../ingestion/staging'
import { checkRole } from '../utilities/checkRole'
import { fetchOrcidProfile, parseOrcidId } from './orcidProfile'
import { ONBOARDING_RUN_VIA, findOnboardingRun, getOnboardingStatus, runSummary } from './status'

const json = (body: unknown, status = 200) => Response.json(body, { status })

/**
 * Every wizard endpoint is admin-only: it writes Import Runs and runs jobs,
 * which only admins may do. Past this check the handlers act for the system,
 * so they pass `overrideAccess: true` explicitly (Payload 4's Local API
 * defaults it to false, `payload.jobs.*` included).
 */
const adminOnly =
  (handler: (req: PayloadRequest) => Promise<Response>) =>
  async (req: PayloadRequest): Promise<Response> => {
    if (!checkRole(['admin'], req.user as never)) return json({ error: 'Admins only.' }, 403)
    return handler(req)
  }

/** Import steps refuse once the Lab is set up, so the wizard can't re-run on a live Lab. */
const notSetUp = async (req: PayloadRequest): Promise<Response | null> =>
  (await getOnboardingStatus(req.payload)).needed
    ? null
    : json({ error: 'This Lab is already set up.' }, 409)

async function body(req: PayloadRequest): Promise<Record<string, unknown>> {
  await addDataAndFileToRequest(req)
  return (req.data ?? {}) as Record<string, unknown>
}

async function loadRun(req: PayloadRequest, id: unknown): Promise<ImportRun | null> {
  if (typeof id !== 'string' || !id) return null
  const run = await req.payload
    .findByID({ collection: 'import-runs', id, depth: 0, overrideAccess: true })
    .catch(() => null)
  const via = (run?.params as Record<string, unknown> | null)?.via
  return run && via === ONBOARDING_RUN_VIA ? run : null
}

/** Step 1: validate the PI's ORCID iD and read their public record. */
const orcidProfile: Endpoint = {
  path: '/labkit/onboarding/orcid',
  method: 'get',
  handler: adminOnly(async (req) => {
    const orcid = parseOrcidId(String(req.searchParams.get('id') ?? ''))
    if (!orcid) {
      return json(
        { error: 'That is not a valid ORCID iD. Check the digits and the last character.' },
        400,
      )
    }

    const [profile, existing] = await Promise.all([
      fetchOrcidProfile(orcid),
      // Exact ORCID only. The wizard never links a person by name.
      req.payload.find({
        collection: 'team',
        where: { orcid: { equals: orcid } },
        limit: 1,
        depth: 0,
        overrideAccess: true,
      }),
    ])
    const member = existing.docs[0]
    return json({
      orcid,
      profile,
      teamMember: member ? { id: member.id, name: member.name ?? null } : null,
    })
  }),
}

/**
 * Step 4a: Staging. Fetches the ORCID works and stores them as a `staged` Import
 * Run, with no Candidate selected: an ORCID record covers the PI's whole career,
 * not the Lab's output, so the editor opts each work in. Storing the run is what
 * lets the selection survive a page reload.
 */
const stage: Endpoint = {
  path: '/labkit/onboarding/import/stage',
  method: 'post',
  handler: adminOnly(async (req) => {
    const refused = await notSetUp(req)
    if (refused) return refused
    const orcid = parseOrcidId(String((await body(req)).orcid ?? ''))
    if (!orcid) return json({ error: 'Invalid ORCID iD.' }, 400)

    const current = await findOnboardingRun(req.payload)
    // One wizard import at a time: a running one is resumed, not duplicated.
    if (current?.status === 'running') return json(runSummary(current))
    if (current?.status === 'staged') {
      const params = (current.params ?? {}) as Record<string, unknown>
      if (params.orcidId === orcid) return json(runSummary(current))
    }

    let staged: Awaited<ReturnType<typeof stageOrcidCandidates>>
    try {
      staged = await stageOrcidCandidates(orcid)
    } catch (error) {
      // fetchOrcidWorks throws when ORCID can't be reached, rather than
      // passing off an outage as "no works". Any other error is a bug: rethrow.
      if (!(error instanceof OrcidUnavailableError)) throw error
      req.payload.logger.error({ err: error, msg: 'ORCID works fetch failed' })
      return json({ error: 'ORCID could not be reached. Try again in a minute.' }, 502)
    }
    const candidates = staged.map((candidate) => ({
      ...candidate,
      selected: false,
    }))
    if (candidates.length === 0) {
      return json({ error: 'ORCID returned no works for this iD.' }, 404)
    }

    const run = await req.payload.create({
      collection: 'import-runs',
      data: {
        label: `ORCID import (setup wizard): ${orcid}`,
        source: 'orcid',
        status: 'staged',
        params: { orcidId: orcid, via: ONBOARDING_RUN_VIA },
        candidates,
      },
      overrideAccess: true,
      context: { disableRevalidate: true },
    })
    return json(runSummary(run))
  }),
}

/**
 * Step 4b: hand the selected Candidates to Hydration. Like the ORCID CLI, the
 * run keeps only the works the editor chose: the unselected rest of a career
 * would otherwise each become a Review Item. Only DOI Candidates can be
 * hydrated from ORCID, so only those are accepted.
 */
const start: Endpoint = {
  path: '/labkit/onboarding/import/start',
  method: 'post',
  handler: adminOnly(async (req) => {
    const refused = await notSetUp(req)
    if (refused) return refused
    const data = await body(req)
    const run = await loadRun(req, data.runId)
    if (!run) return json({ error: 'Import Run not found.' }, 404)
    if (run.status !== 'staged') return json(runSummary(run))

    const keys = new Set(
      Array.isArray(data.keys) ? data.keys.filter((k) => typeof k === 'string') : [],
    )
    // Optional; absent means the job's default. Checked before the run is
    // claimed, so a bad value leaves it `staged`.
    const batchSize = data.batchSize ?? undefined
    if (
      batchSize !== undefined &&
      !(
        Number.isInteger(batchSize) &&
        (batchSize as number) >= 1 &&
        (batchSize as number) <= MAX_BATCH_SIZE
      )
    ) {
      return json({ error: `batchSize must be a whole number from 1 to ${MAX_BATCH_SIZE}.` }, 400)
    }

    const staged = runSummary(run).candidates
    const selected = staged
      .filter((candidate) => keys.has(candidate.key) && candidate.doi)
      .map((candidate) => ({ ...candidate, selected: true }))
    if (selected.length === 0) return json({ error: 'Select at least one work with a DOI.' }, 400)

    const since = Number(data.since)
    // Compare-and-set on `staged`, so a double click or a second tab can't
    // queue the same run twice.
    const claimed = await req.payload.db.updateOne({
      collection: 'import-runs',
      where: { and: [{ id: { equals: run.id } }, { status: { equals: 'staged' } }] },
      data: {
        status: 'running',
        candidates: selected,
        params: {
          ...(run.params as Record<string, unknown>),
          since: Number.isInteger(since) && since > 0 ? since : null,
          stagedCount: staged.length,
        },
        progress: {
          total: selected.length,
          processed: 0,
          created: 0,
          skippedExisting: 0,
          failed: 0,
        },
      },
    })
    if (!claimed) return json(runSummary((await loadRun(req, run.id))!))

    try {
      await queueImportRun(req.payload, run.id, { batchSize: batchSize as number | undefined })
    } catch (error) {
      // No job was queued: put the run back so it isn't left `running` with nothing to run it.
      await req.payload.db.updateOne({
        collection: 'import-runs',
        where: { id: { equals: run.id } },
        data: { status: 'staged' },
      })
      throw error
    }
    const queued = await loadRun(req, run.id)
    return json(runSummary(queued!))
  }),
}

/**
 * Step 4c: run this Import Run's next queued job, then report progress. The
 * wizard calls this in a loop while the run is `running`.
 *
 * Why the browser drives the queue: on Vercel there is no jobs cron, so
 * `jobs.autoRun` never fires, and a function lives about 300s. Each job
 * invocation hydrates one bounded batch, checkpoints after every Candidate, and
 * queues its own successor, so one call here is one batch inside one function.
 * A call that dies mid-batch loses at most a Candidate: Payload's processing
 * lease and the job's own watchdog job (due five minutes later) pick the run up
 * again on a later call. Closing the tab just pauses the run; reopening the
 * wizard resumes it.
 */
const tick: Endpoint = {
  path: '/labkit/onboarding/import/tick',
  method: 'post',
  handler: adminOnly(async (req) => {
    const data = await body(req)
    const run = await loadRun(req, data.runId)
    if (!run) return json({ error: 'Import Run not found.' }, 404)

    if (run.status === 'running') {
      try {
        await req.payload.jobs.run({
          queue: 'imports',
          limit: 1,
          where: { 'input.runId': { equals: run.id } },
          overrideAccess: true,
          silent: true,
        })
      } catch (error) {
        // The job records a failure on the run itself (finalizeRun 'failed').
        req.payload.logger.error({ err: error, msg: 'Onboarding import batch failed' })
      }
    }

    const fresh = (await loadRun(req, run.id))!
    const openReviewItems = (
      await req.payload.count({
        collection: 'review-items',
        where: { and: [{ run: { equals: run.id } }, { status: { equals: 'open' } }] },
        overrideAccess: true,
      })
    ).totalDocs
    return json({ ...runSummary(fresh), openReviewItems })
  }),
}

export const onboardingEndpoints: Endpoint[] = [orcidProfile, stage, start, tick]
