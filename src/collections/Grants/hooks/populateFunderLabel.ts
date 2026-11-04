import type { CollectionBeforeChangeHook } from 'payload'
import type { Organization } from '@/payload-types'

/**
 * Auto-populates funderLabel from the selected funder's shortName (or name) if empty.
 * Allows manual override by keeping existing funderLabel if already set.
 */
export const populateFunderLabel: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Skip if funderLabel is already set or no funder is selected
  if (data?.funderLabel || !data?.funder) return data

  const { payload } = req

  try {
    // Handle both string ID and populated object
    const funderId =
      typeof data.funder === 'string' ? data.funder : (data.funder as Organization)?.id

    if (!funderId) return data

    const funder = await payload.findByID({
      collection: 'organizations',
      id: funderId,
      overrideAccess: true,
    })

    if (funder) {
      // Prefer shortName for display, fall back to full name
      data.funderLabel = funder.shortName || funder.name
    }
  } catch (error) {
    payload.logger.error(`[Grants] Failed to populate funderLabel: ${error}`)
  }

  return data
}
