import type { CollectionBeforeChangeHook } from 'payload'
import type { Organization } from '../../../types'

/**
 * Auto-populates organizationLabel from the selected organization's shortName (or name) if empty.
 * Allows manual override by keeping existing organizationLabel if already set.
 */
export const populateOrganizationLabel: CollectionBeforeChangeHook = async ({ data, req }) => {
  // Skip if organizationLabel is already set or no organization is selected
  if (data?.organizationLabel || !data?.organization) return data

  const { payload } = req

  try {
    // Handle both string ID and populated object
    const orgId =
      typeof data.organization === 'string'
        ? data.organization
        : (data.organization as Organization)?.id

    if (!orgId) return data

    const organization = await payload.findByID({
      collection: 'organizations',
      id: orgId,
      overrideAccess: true,
    })

    if (organization) {
      // Prefer shortName for display, fall back to full name
      data.organizationLabel = organization.shortName || organization.name
    }
  } catch (error) {
    payload.logger.error(`[Awards] Failed to populate organizationLabel: ${error}`)
  }

  return data
}
