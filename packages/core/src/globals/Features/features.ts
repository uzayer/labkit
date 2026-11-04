import type { Payload, PayloadRequest } from 'payload'
import { cache } from 'react'

/** Each switchable Feature, and the collection it switches. */
export const FEATURE_COLLECTIONS = {
  projects: 'projects',
  grants: 'grants',
  awards: 'awards',
  newsItems: 'news',
  researchThemes: 'research-themes',
} as const

export type FeatureName = keyof typeof FEATURE_COLLECTIONS

export type LabFeatures = Record<FeatureName, boolean>

const FEATURE_NAMES = Object.keys(FEATURE_COLLECTIONS) as FeatureName[]

/**
 * Reads the Features global. Anything not explicitly `false` counts as on, so a
 * database that has never saved the global (no row yet) behaves like DIAL today.
 */
export async function readFeatures(payload: Payload, req?: PayloadRequest): Promise<LabFeatures> {
  const doc = (await payload.findGlobal({
    slug: 'features',
    depth: 0,
    overrideAccess: true,
    req,
  })) as Partial<Record<FeatureName, boolean | null>> | null
  return Object.fromEntries(
    FEATURE_NAMES.map((name) => [name, doc?.[name] !== false]),
  ) as LabFeatures
}

/**
 * The Lab's Features, for a frontend deciding which routes and nav items exist.
 * Deduplicated per server request by React `cache`; outside a React server
 * render it simply reads each time.
 */
export const getFeatures: (payload: Payload) => Promise<LabFeatures> = cache((payload: Payload) =>
  readFeatures(payload),
)

const CONTEXT_KEY = 'labkitFeatures'

/** `readFeatures`, read at most once per request through `req.context`. */
export async function readFeaturesForRequest(req: PayloadRequest): Promise<LabFeatures> {
  const cached = req.context[CONTEXT_KEY] as Promise<LabFeatures> | undefined
  if (cached) return cached
  const pending = readFeatures(req.payload, req)
  req.context[CONTEXT_KEY] = pending
  return pending
}

/**
 * `admin.hidden` for a Feature's collection. Payload calls `admin.hidden`
 * synchronously with only the user, so it can't read the global itself; the
 * Users collection's virtual `features` field loads it onto `req.user` when the
 * request authenticates (see Users). With no user, nothing is hidden.
 */
export const hiddenUnlessFeature =
  (name: FeatureName) =>
  ({ user }: { user: unknown }): boolean =>
    (user as { features?: Partial<LabFeatures> | null } | null)?.features?.[name] === false
