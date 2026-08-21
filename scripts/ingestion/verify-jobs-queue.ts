/**
 * Throwaway live verification for the codex-review fixes (lease lock,
 * per-item checkpointing, watchdog resume, skipped-candidate review items,
 * zero-author guard). Uses only DOI-less candidates so nothing is written to
 * publications/team/venues/organizations — only import-runs, review-items,
 * and payload-jobs, all cleaned up at the end.
 *
 * Run: bun run payload -- run scripts/ingestion/verify-jobs-queue.ts
 */
import { getPayload } from 'payload'

import config from '@payload-config'

import { queueImportRun } from '@/lib/ingestion/jobs/import-hydrate'
import { hydratePublicationFromFields, loadPublicationIndexes } from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'

const SELECTED_COUNT = 45

async function main() {
  const payload = await getPayload({ config })
  const failures: string[] = []
  const check = (name: string, cond: boolean, detail?: string) => {
    console.log(`${cond ? 'PASS' : 'FAIL'} — ${name}${detail ? ` [${detail}]` : ''}`)
    if (!cond) failures.push(name)
  }

  // --- zero-author guard (dry run, no writes) ---
  {
    const report = new ImportReport()
    const indexes = await loadPublicationIndexes(payload)
    const result = await hydratePublicationFromFields(
      payload,
      report,
      { title: `__verify zero-author ${Date.now()}`, year: 2026, authors: [] },
      indexes,
      true,
      '__verify',
    )
    const json = report.toJSON()
    check('zero-author input returns null instead of creating', result === null)
    check(
      'zero-author input flags a review entry',
      json.unmatched.some((u) => u.field === 'authors' && u.value.startsWith('no authors')),
    )
  }

  // --- staged run: 45 selected DOI-less candidates + 2 unselected noted ones ---
  const candidates: Record<string, unknown>[] = []
  for (let i = 0; i < SELECTED_COUNT; i++) {
    candidates.push({
      key: `verify:${i}`,
      title: `__verify work ${i}`,
      selected: true,
      status: 'pending',
    })
  }
  candidates.push({
    key: 'verify:skip-nodoi',
    title: '__verify skipped no-doi',
    note: 'no DOI found — career-wide ORCID result, needs manual review',
    selected: false,
    status: 'pending',
  })
  candidates.push({
    key: 'verify:skip-ambig',
    title: '__verify skipped ambiguous',
    note: 'ambiguous — 3 DOIs in one chunk',
    selected: false,
    status: 'pending',
  })

  const runDoc = await payload.create({
    collection: 'import-runs',
    data: { label: '[verify] jobs fixes', source: 'cli', status: 'staged', candidates },
    overrideAccess: true,
  })
  const runId = String(runDoc.id)
  console.log(`created verification run ${runId}`)

  const loadRun = () =>
    payload.findByID({ collection: 'import-runs', id: runId, overrideAccess: true })
  const runJobsForRun = async (runId: string) => {
    // Coerce any delayed jobs (watchdogs, contention replacements) to
    // runnable, then tick the queue once — stands in for the 1-minute cron.
    const pending = await payload.find({
      collection: 'payload-jobs',
      where: {
        and: [{ 'input.runId': { equals: runId } }, { completedAt: { exists: false } }],
      },
      limit: 100,
      overrideAccess: true,
    })
    for (const job of pending.docs) {
      await payload.update({
        collection: 'payload-jobs',
        id: job.id,
        data: { waitUntil: new Date(Date.now() - 1000).toISOString() },
        overrideAccess: true,
      })
    }
    await payload.jobs.run({ queue: 'imports', limit: 10 })
  }

  // --- contention: pre-claim the lease, queue + run, expect no processing ---
  await payload.db.updateOne({
    collection: 'import-runs',
    id: runId,
    data: { lock: { token: 'external-holder', heartbeatAt: new Date().toISOString() } },
  })
  await queueImportRun(payload, runId)
  let fresh = await loadRun()
  check('queueImportRun flips staged → running', fresh.status === 'running')

  await payload.jobs.run({ queue: 'imports', limit: 10 })
  fresh = await loadRun()
  const touched = (fresh.candidates as Record<string, unknown>[]).filter(
    (c) => c.status !== 'pending',
  ).length
  check('lease contention: zero candidates processed while lock held', touched === 0)

  const jobsAfterContention = await payload.find({
    collection: 'payload-jobs',
    where: { and: [{ 'input.runId': { equals: runId } }, { completedAt: { exists: false } }] },
    limit: 100,
    overrideAccess: true,
  })
  check(
    'contention handed the baton to a queued replacement job',
    jobsAfterContention.docs.length > 0,
    `${jobsAfterContention.docs.length} queued`,
  )

  // --- stale lease takeover + per-item checkpoint + batch chaining ---
  await payload.db.updateOne({
    collection: 'import-runs',
    id: runId,
    data: {
      lock: {
        token: 'external-holder',
        heartbeatAt: new Date(Date.now() - 10 * 60_000).toISOString(),
      },
    },
  })

  await runJobsForRun(runId)
  fresh = await loadRun()
  const progressMid = fresh.progress as { processed?: number } | undefined
  check(
    'stale lease was taken over and first batch processed + checkpointed',
    (progressMid?.processed ?? 0) > 0 && fresh.status === 'running',
    `processed=${progressMid?.processed}`,
  )

  let iterations = 0
  while (fresh.status === 'running' && iterations < 20) {
    await runJobsForRun(runId)
    fresh = await loadRun()
    iterations++
  }

  const progress = fresh.progress as {
    total?: number
    processed?: number
    failed?: number
    created?: number
  }
  check('run reached completed', fresh.status === 'completed', `after ${iterations} ticks`)
  check(
    'all selected candidates processed',
    progress.processed === SELECTED_COUNT && progress.total === SELECTED_COUNT,
    `processed=${progress.processed}/${progress.total}`,
  )
  check(
    'all DOI-less candidates flagged, none created',
    progress.failed === SELECTED_COUNT && progress.created === 0,
  )
  const lock = fresh.lock as { token?: string | null } | undefined
  check('lease released on finalize', !lock?.token)

  const reviewItems = await payload.find({
    collection: 'review-items',
    where: { run: { equals: runId } },
    limit: 200,
    overrideAccess: true,
  })
  const byKind = reviewItems.docs.reduce<Record<string, number>>((acc, item) => {
    acc[item.kind] = (acc[item.kind] ?? 0) + 1
    return acc
  }, {})
  check(
    'review items: 46 no-doi-work (45 processed + 1 skipped) + 1 unparsed-citation',
    byKind['no-doi-work'] === SELECTED_COUNT + 1 && byKind['unparsed-citation'] === 1,
    JSON.stringify(byKind),
  )

  // Watchdogs left behind must no-op cleanly against the terminal run and
  // not spawn replacements.
  await runJobsForRun(runId)
  const jobsLeft = await payload.find({
    collection: 'payload-jobs',
    where: { and: [{ 'input.runId': { equals: runId } }, { completedAt: { exists: false } }] },
    limit: 100,
    overrideAccess: true,
  })
  check('leftover watchdogs no-op after completion without requeuing', jobsLeft.docs.length === 0)

  // --- cleanup ---
  await payload.delete({
    collection: 'review-items',
    where: { run: { equals: runId } },
    overrideAccess: true,
  })
  await payload.delete({
    collection: 'payload-jobs',
    where: { 'input.runId': { equals: runId } },
    overrideAccess: true,
  })
  await payload.delete({ collection: 'import-runs', id: runId, overrideAccess: true })
  console.log('cleaned up verification docs')

  if (failures.length > 0) {
    console.error(`\n${failures.length} check(s) FAILED`)
    process.exit(1)
  }
  console.log('\nall checks passed')
  process.exit(0)
}

await main()
