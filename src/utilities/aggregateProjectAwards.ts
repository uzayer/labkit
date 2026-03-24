import { Award, Project, Publication } from '@/payload-types'

/**
 * Aggregates awards from both direct project relationships and associated publications.
 * Deduplicates awards by ID and returns only populated Award objects (not string IDs).
 *
 * This utility merges:
 * - Direct project awards (project.awards.docs)
 * - Awards from associated publications (project.publications.docs[].awards.docs)
 *
 * @param project - Project object with optional awards and publications join fields
 * @returns Array of unique Award objects, sorted by year (most recent first)
 */
export function aggregateProjectAwards(
  project: Project & {
    publications?: {
      docs?:
        | ((Publication & { awards?: { docs?: (Award | string)[] | null } | null }) | null)[]
        | null
    } | null
    awards?: { docs?: (Award | string)[] | null } | null
  },
): Award[] {
  const awardsMap = new Map<string, Award>()

  // Helper function to add award to map if it's a populated object
  const addAward = (award: Award | string | null | undefined) => {
    if (!award) return
    if (typeof award === 'string') return // Skip string IDs

    // Type guard: ensure it's an Award object with required fields
    if (typeof award === 'object' && 'id' in award && 'title' in award) {
      const awardObj = award as Award
      // Only add if not already present (deduplication)
      if (!awardsMap.has(awardObj.id)) {
        awardsMap.set(awardObj.id, awardObj)
      }
    }
  }

  // Add direct project awards from join field
  if (project.awards?.docs && Array.isArray(project.awards.docs)) {
    project.awards.docs.forEach(addAward)
  }

  // Add awards from publications join field
  if (project.publications?.docs && Array.isArray(project.publications.docs)) {
    project.publications.docs.forEach((publication) => {
      // Handle both populated Publication objects and string IDs
      if (typeof publication === 'string' || !publication) return

      const pub = publication as Publication & {
        awards?: { docs?: (Award | string)[] | null } | null
      }
      if (pub.awards?.docs && Array.isArray(pub.awards.docs)) {
        pub.awards.docs.forEach(addAward)
      }
    })
  }

  // Convert map to array and sort by year (most recent first)
  const awardsArray = Array.from(awardsMap.values())

  // Sort by year descending (most recent first)
  // Awards without year will appear last
  awardsArray.sort((a, b) => {
    const yearA = typeof a.year === 'number' ? a.year : 0
    const yearB = typeof b.year === 'number' ? b.year : 0
    return yearB - yearA
  })

  return awardsArray
}
