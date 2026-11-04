import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import { createDialData } from './index'
import { loadDialRecords } from './load'
import { createDialViews } from './views'
import { DIAL_CACHE_TAG } from './tag'

/**
 * DIAL's records, cached across requests and invalidated by tag.
 *
 * The whole corpus is a few hundred small records and every page reads from
 * all of it, so the cache holds one entry, the full load, rather than one per
 * query: an edit to anything revalidates everything, which is correct and costs
 * one reload of the corpus. The hour-long `revalidate` is a backstop for writes
 * that never reach a hook in this deployment (scripts run with `payload run`,
 * which has no Next.js cache to revalidate), and it also refreshes the
 * date-derived values a page computes from the current time.
 *
 * The deployment id is part of the key because Vercel's data cache outlives a
 * deployment: without it, new code could read records cached in the shape the
 * previous deployment's mappers produced.
 */
const loadCachedDialRecords = unstable_cache(
  loadDialRecords,
  ['dial-records', process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? ''],
  { tags: [DIAL_CACHE_TAG], revalidate: 3600 },
)

/**
 * DIAL's records, lookups, and view mappers for the current request. The
 * records come from the cross-request cache above; React `cache` then builds
 * the lookups once per request, however many components ask.
 */
export const getDial = cache(async () => {
  const data = createDialData(await loadCachedDialRecords())
  return { ...data, ...createDialViews(data) }
})

export type Dial = Awaited<ReturnType<typeof getDial>>
