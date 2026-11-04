import { revalidateTag } from 'next/cache'
import type { CollectionConfig, GlobalConfig, Plugin } from 'payload'

import { SITE_CACHE_TAG } from '@/lib/site/tag'

/** Every collection and global `loadSiteRecords` reads (src/lib/site/load.ts). */
const SITE_COLLECTIONS = new Set([
  'awards',
  'forms',
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
const SITE_GLOBALS = new Set(['features', 'lab-info'])

/**
 * Expires the site's cached records, and the pages rendered from them, whenever
 * a record the site reads changes. Expired outright (`expire: 0`) rather than
 * served stale while it refreshes, so a Lab Editor who saves and reloads sees
 * the edit on that reload.
 *
 * Outside a Next.js request (`payload run` scripts) there is no cache to
 * revalidate and `revalidateTag` throws; the cache's hour-long backstop picks
 * those writes up instead.
 */
function revalidateSite() {
  try {
    revalidateTag(SITE_CACHE_TAG, { expire: 0 })
  } catch {
    // No Next.js request scope: see above.
  }
}

/**
 * Adds the hooks here rather than in each collection's config, so the cache's
 * dependency list sits next to the loader it mirrors. Hooks only: this changes
 * no schema, so it needs no migration.
 */
export const revalidateSitePlugin: Plugin = (config) => ({
  ...config,
  collections: config.collections?.map((collection): CollectionConfig => {
    if (!SITE_COLLECTIONS.has(collection.slug)) return collection
    return {
      ...collection,
      hooks: {
        ...collection.hooks,
        afterChange: [...(collection.hooks?.afterChange ?? []), revalidateSite],
        afterDelete: [...(collection.hooks?.afterDelete ?? []), revalidateSite],
      },
    }
  }),
  globals: config.globals?.map((global): GlobalConfig => {
    if (!SITE_GLOBALS.has(global.slug)) return global
    return {
      ...global,
      hooks: {
        ...global.hooks,
        afterChange: [...(global.hooks?.afterChange ?? []), revalidateSite],
      },
    }
  }),
})
