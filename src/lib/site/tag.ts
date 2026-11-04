/**
 * The cache tag on the site's records. Kept apart from ./load.ts so the Payload
 * plugin that revalidates it (src/plugins/revalidateSite.ts) does not import the
 * loader, which imports the Payload config.
 */
export const SITE_CACHE_TAG = 'site'
