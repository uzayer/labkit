/**
 * The cache tags core's hooks revalidate. Core knows records, not routes: a site
 * tags its own cached reads (`unstable_cache`, `cacheTag`) with these, and
 * revalidates any route paths it needs itself.
 */
export const CACHE_TAGS = {
  features: 'labkit:features',
  labInfo: 'labkit:lab-info',
  projects: 'labkit:projects',
  project: (slug: string) => `labkit:project:${slug}`,
  grants: 'labkit:grants',
  grant: (slug: string) => `labkit:grant:${slug}`,
} as const
