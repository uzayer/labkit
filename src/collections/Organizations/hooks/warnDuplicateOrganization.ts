import type { CollectionBeforeChangeHook } from 'payload'

/**
 * Warns (but does not block) when creating an organization that may be a duplicate.
 * Checks: name, shortName, ror_id, openalex_id (case-insensitive for names)
 */
export const warnDuplicateOrganization: CollectionBeforeChangeHook = async ({
  data,
  req,
  operation,
  originalDoc,
}) => {
  if (operation !== 'create' && operation !== 'update') return data

  // Empty string is a real value on a sparse unique index and would collide
  // across every organization without one — normalize to undefined instead.
  if (data?.ror_id === '') {
    data.ror_id = undefined
  }
  if (data?.openalex_id === '') {
    data.openalex_id = undefined
  }

  const { payload } = req
  const warnings: string[] = []

  // Build OR conditions for potential duplicates
  const orConditions: Array<{ [key: string]: { equals: string } }> = []

  if (data?.name) {
    orConditions.push({ name: { equals: data.name } })
  }
  if (data?.shortName) {
    orConditions.push({ shortName: { equals: data.shortName } })
  }
  if (data?.ror_id) {
    orConditions.push({ ror_id: { equals: data.ror_id } })
  }
  if (data?.openalex_id) {
    orConditions.push({ openalex_id: { equals: data.openalex_id } })
  }

  if (orConditions.length === 0) return data

  const existingOrgs = await payload.find({
    collection: 'organizations',
    where: {
      or: orConditions,
    },
    limit: 5,
  })

  // Filter out the current document if updating
  const duplicates = existingOrgs.docs.filter((doc) => {
    if (operation === 'update' && originalDoc?.id === doc.id) return false
    return true
  })

  if (duplicates.length > 0) {
    for (const dup of duplicates) {
      if (data?.name?.toLowerCase() === dup.name?.toLowerCase()) {
        warnings.push(`Organization with name "${dup.name}" already exists`)
      }
      if (data?.shortName && data.shortName.toLowerCase() === dup.shortName?.toLowerCase()) {
        warnings.push(`Organization with short name "${dup.shortName}" already exists`)
      }
      if (data?.ror_id && data.ror_id === dup.ror_id) {
        warnings.push(`Organization with ROR ID "${dup.ror_id}" already exists`)
      }
      if (data?.openalex_id && data.openalex_id === dup.openalex_id) {
        warnings.push(`Organization with OpenAlex ID "${dup.openalex_id}" already exists`)
      }
    }

    if (warnings.length > 0) {
      // Log warning to console (visible in server logs)
      payload.logger.warn(
        `[Organizations] Potential duplicate detected: ${warnings.join('; ')}. Existing IDs: ${duplicates.map((d) => d.id).join(', ')}`,
      )

      // Add a warning message to the request context
      // This will be visible in admin UI via afterChange toast
      if (req.context) {
        req.context.duplicateWarning = warnings.join('. ')
      }
    }
  }

  return data
}
