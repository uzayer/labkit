import { revalidateTag } from 'next/cache'
import type { CollectionConfig, GlobalConfig, Plugin } from 'payload'

import { DIAL_CACHE_TAG } from '@/lib/dial/data/tag'

/** Every collection and global `loadDialRecords` reads (src/lib/dial/data/load.ts). */
const DIAL_COLLECTIONS = new Set([
  'awards',
  'grants',
  'media',
  'news',
  'organizations',
  'projects',
  'publications',
  'research-themes',
  'team',
  'venues',
])
const DIAL_GLOBALS = new Set(['lab-info'])

/**
 * Expires DIAL's cached records, and the pages rendered from them, whenever a
 * record the site reads changes. Expired outright (`expire: 0`) rather than
 * served stale while it refreshes, so a Lab Editor who saves and reloads sees
 * the edit on that reload. The SQLite adapter runs without transactions, so the
 * write is committed by the time the hook runs; turning transactions on would
 * let a page regenerate from the old row in between.
 *
 * `context.disableRevalidate` is not honoured: ingestion sets it to skip the
 * per-document path revalidation, but marking one tag is cheap and an import
 * should show on the site. Outside a Next.js request (`payload run` scripts)
 * there is no cache to revalidate and `revalidateTag` throws; the cache's
 * hour-long backstop picks those writes up instead.
 */
function revalidateDial() {
  try {
    revalidateTag(DIAL_CACHE_TAG, { expire: 0 })
  } catch {
    // No Next.js request scope: see above.
  }
}

/**
 * Adds the hooks from here rather than in each collection's config, so the
 * cache's dependency list sits next to the loader it mirrors.
 */
export const revalidateDialPlugin: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection): CollectionConfig => {
    if (!DIAL_COLLECTIONS.has(collection.slug)) return collection
    return {
      ...collection,
      hooks: {
        ...collection.hooks,
        afterChange: [...(collection.hooks?.afterChange ?? []), revalidateDial],
        afterDelete: [...(collection.hooks?.afterDelete ?? []), revalidateDial],
      },
    }
  }),
  globals: config.globals?.map((global): GlobalConfig => {
    if (!DIAL_GLOBALS.has(global.slug)) return global
    return {
      ...global,
      hooks: {
        ...global.hooks,
        afterChange: [...(global.hooks?.afterChange ?? []), revalidateDial],
      },
    }
  }),
})
