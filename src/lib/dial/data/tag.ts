/**
 * The cache tag on DIAL's records. Kept apart from ./get.ts so the Payload
 * plugin that revalidates it (src/plugins/revalidateDial.ts) does not import
 * the loader, which imports the Payload config.
 */
export const DIAL_CACHE_TAG = 'dial'
