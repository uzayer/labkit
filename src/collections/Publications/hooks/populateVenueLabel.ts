import type { CollectionBeforeChangeHook } from 'payload'
// import type { Organization, Venue } from '@/payload-types'
import type { Venue } from '@/payload-types'

/**
 * Auto-populates venueLabel from the selected venue's shortName (or name) if empty.
 * Allows manual override by keeping existing venueLabel if already set.
 */
export const populateVenueLabel: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Skip if venueLabel is already set or no venue is selected
  if (data?.venueLabel || !data?.venue) return data

  const { payload } = req

  try {
    // Handle both string ID and populated object
    const venueId = typeof data.venue === 'string' ? data.venue : (data.venue as Venue)?.id

    if (!venueId) return data

    const venue = await payload.findByID({
      collection: 'venues',
      id: venueId,
      overrideAccess: true,
    })

    if (venue) {
      // Prefer shortName for display, fall back to full name
      data.venueLabel = venue.shortName || venue.name
    }
  } catch (error) {
    payload.logger.error(`[Publications] Failed to populate venueLabel: ${error}`)
  }

  return data
}
