import type { Payload } from 'payload'

import type { ImportRun } from '../types'
import type { StagedCandidate } from '../ingestion/staging'
import { readFeatures } from '../globals/Features/features'

/** `params.via` on an Import Run the wizard started. */
export const ONBOARDING_RUN_VIA = 'onboarding'

/** The admin path of the wizard view, relative to the admin route. */
export const ONBOARDING_PATH = '/onboarding'

interface LabInfoState {
  name?: string | null
  email?: string | null
  about?: unknown
  onboardingCompleted?: boolean | null
}

export async function readLabInfo(payload: Payload): Promise<LabInfoState> {
  return (await payload.findGlobal({
    slug: 'lab-info',
    depth: 0,
    overrideAccess: true,
  })) as LabInfoState
}

/** The newest Import Run the wizard created, if any. */
export async function findOnboardingRun(payload: Payload): Promise<ImportRun | null> {
  const { docs } = await payload.find({
    collection: 'import-runs',
    where: { 'params.via': { equals: ONBOARDING_RUN_VIA } },
    sort: '-createdAt',
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  return docs[0] ?? null
}

const count = async (
  payload: Payload,
  collection: 'publications' | 'research-themes' | 'review-items' | 'team',
  where?: Parameters<Payload['count']>[0]['where'],
) => (await payload.count({ collection, where, overrideAccess: true })).totalDocs

export interface OnboardingStatus {
  /** The wizard hasn't been finished. */
  needed: boolean
  /** Nothing has been set up yet, so the dashboard sends the editor straight to the wizard. */
  pristine: boolean
  completed: boolean
}

/**
 * Whether this Lab still needs the wizard. A Lab that already has a name and
 * Publications was set up some other way (DIAL was onboarded by hand before the
 * wizard existed, and its `onboardingCompleted` is false), so it never gets the
 * wizard. Once the wizard has started an Import Run, though, the new Lab has a
 * name and Publications too; the run marks it as mid-wizard until Done.
 */
export async function getOnboardingStatus(payload: Payload): Promise<OnboardingStatus> {
  const labInfo = await readLabInfo(payload)
  if (labInfo.onboardingCompleted) return { needed: false, pristine: false, completed: true }

  const [publications, run] = await Promise.all([
    count(payload, 'publications'),
    findOnboardingRun(payload),
  ])
  const hasName = Boolean(labInfo.name?.trim())
  const setUpElsewhere = hasName && publications > 0 && !run
  return {
    needed: !setUpElsewhere,
    pristine: !hasName && publications === 0 && !run,
    completed: false,
  }
}

export interface ChecklistItem {
  key: string
  label: string
  href: string
}

/**
 * What a new Lab still has to do after the wizard. Every item is derived from
 * data, so it drops off by itself once the work is done; nothing is stored.
 */
export async function getSetupChecklist(
  payload: Payload,
  adminRoute: string,
): Promise<ChecklistItem[]> {
  const labInfo = await readLabInfo(payload)
  const features = await readFeatures(payload)
  const collections = `${adminRoute}/collections`

  const [withoutPhoto, themes, openReview] = await Promise.all([
    count(payload, 'team', {
      and: [{ displayInWebsite: { equals: true } }, { photo: { exists: false } }],
    }),
    features.researchThemes ? count(payload, 'research-themes') : Promise.resolve(-1),
    count(payload, 'review-items', { status: { equals: 'open' } }),
  ])

  const items: ChecklistItem[] = []
  if (withoutPhoto > 0) {
    items.push({
      key: 'team-photos',
      label: `Add photos for ${withoutPhoto} Team ${withoutPhoto === 1 ? 'Member' : 'Members'} shown on the site`,
      href: `${collections}/team?where[and][0][displayInWebsite][equals]=true&where[and][1][photo][exists]=false`,
    })
  }
  if (themes === 0) {
    items.push({
      key: 'research-themes',
      label: 'Add your Research Themes',
      href: `${collections}/research-themes/create`,
    })
  }
  if (openReview > 0) {
    items.push({
      key: 'review-items',
      label: `Work through ${openReview} open Review ${openReview === 1 ? 'Item' : 'Items'}`,
      href: `${collections}/review-items?where[status][equals]=open`,
    })
  }
  if (!labInfo.about) {
    items.push({
      key: 'about',
      label: 'Write your About page',
      href: `${adminRoute}/globals/lab-info`,
    })
  }
  if (!labInfo.email) {
    items.push({
      key: 'email',
      label: 'Set a contact email',
      href: `${adminRoute}/globals/lab-info`,
    })
  }
  return items
}

/** What the wizard shows of a run: enough to render progress and the Candidates. */
export function runSummary(run: ImportRun) {
  const params = (run.params ?? {}) as Record<string, unknown>
  return {
    id: run.id,
    status: run.status,
    orcidId: typeof params.orcidId === 'string' ? params.orcidId : null,
    candidates: Array.isArray(run.candidates) ? (run.candidates as StagedCandidate[]) : [],
    progress: run.progress ?? null,
    error: run.error ?? null,
  }
}
