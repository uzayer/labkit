import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Warns (but does not block) when creating a venue that may be a duplicate.
 * Checks: name, shortName, issn, openalex_id (case-insensitive for names)
 */
export const warnDuplicateVenue: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'create' && operation !== 'update') return data

  // Empty string is a real value on a sparse unique index and would collide
  // across every venue without one — normalize to undefined instead.
  if (data?.openalex_id === '') {
    data.openalex_id = undefined
  }

  const { payload } = req
  const warnings: string[] = []

  // Build OR conditions for potential duplicates
  const orConditions: Array<Record<string, { equals: string } | { in: string[] }>> = []

  if (data?.name) {
    orConditions.push({ name: { equals: data.name } })
  }
  if (data?.shortName) {
    orConditions.push({ shortName: { equals: data.shortName } })
  }
  if (Array.isArray(data?.issn) && data.issn.length > 0) {
    orConditions.push({ issn: { in: data.issn } })
  }
  if (data?.openalex_id) {
    orConditions.push({ openalex_id: { equals: data.openalex_id } })
  }

  if (orConditions.length === 0) return data

  const existingVenues = await payload.find({
    collection: 'venues',
    where: {
      or: orConditions,
    },
    limit: 5,
  })

  // Filter out the current document if updating
  const duplicates = existingVenues.docs.filter((doc) => {
    if (operation === 'update' && originalDoc?.id === doc.id) return false
    return true
  })

  if (duplicates.length > 0) {
    for (const dup of duplicates) {
      if (data?.name?.toLowerCase() === dup.name?.toLowerCase()) {
        warnings.push(`Venue with name "${dup.name}" already exists`)
      }
      if (data?.shortName && data.shortName.toLowerCase() === dup.shortName?.toLowerCase()) {
        warnings.push(`Venue with short name "${dup.shortName}" already exists`)
      }
      const sharedIssn = data?.issn?.find((issn: string) => dup.issn?.includes(issn))
      if (sharedIssn) {
        warnings.push(`Venue with ISSN "${sharedIssn}" already exists`)
      }
      if (data?.openalex_id && data.openalex_id === dup.openalex_id) {
        warnings.push(`Venue with OpenAlex ID "${dup.openalex_id}" already exists`)
      }
    }

    if (warnings.length > 0) {
      // Log warning to console (visible in server logs)
      payload.logger.warn(
        `[Venues] Potential duplicate detected: ${warnings.join('; ')}. Existing IDs: ${duplicates.map((d) => d.id).join(', ')}`,
      )

      // Add a warning message to the request context
      if (req.context) {
        req.context.duplicateWarning = warnings.join('. ')
      }
    }
  }

  return data
}
