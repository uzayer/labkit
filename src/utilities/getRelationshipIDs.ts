/**
 * Takes a mixed array of IDs and/or populated documents from a relationship
 * field and returns a clean array of just the IDs.
 * This is necessary because data submitted from the admin panel can be
 * a mix of existing IDs and newly added full objects.
 *
 * @param items The array of relationship data to process.
 * @returns A clean array of string or number IDs.
 */
export function getRelationshipIDs(
  items: (string | number | { id: string | number })[] | undefined | null,
): (string | number)[] {
  if (!items) {
    return []
  }

  return items.map((item) => {
    if (typeof item === 'object' && item !== null && 'id' in item) {
      return item.id
    }
    return item
  })
}
