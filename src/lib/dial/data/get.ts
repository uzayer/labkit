import 'server-only'

import { cache } from 'react'

import { createDialData } from './index'
import { loadDialRecords } from './load'
import { createDialViews } from './views'

/**
 * DIAL's records, lookups, and view mappers for the current request. Loaded
 * from Payload once per request (React `cache`), however many components ask.
 */
export const getDial = cache(async () => {
  const data = createDialData(await loadDialRecords())
  return { ...data, ...createDialViews(data) }
})

export type Dial = Awaited<ReturnType<typeof getDial>>
