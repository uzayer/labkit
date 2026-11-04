import 'server-only'

import configPromise from '@payload-config'
import { getPayload } from 'payload'

import { getFeatures, type LabFeatures } from '@labkit/core'

import type {
  Award,
  Grant,
  LabInfo,
  Media,
  News,
  Organization,
  Project,
  Publication,
  ResearchTheme,
  Team,
  Venue,
} from '@/payload-types'

/**
 * Everything the site renders, read from Payload in one pass.
 *
 * A Lab's whole corpus is a few hundred small records, so it is loaded whole,
 * once, and cached across requests until a record changes (see ./index.ts).
 * Reads are depth 0: every related record is already in the load, so
 * relationships are resolved in memory by id instead of populated by Payload.
 */
export interface SiteRecords {
  labInfo: LabInfo
  features: LabFeatures
  team: Team[]
  publications: Publication[]
  venues: Venue[]
  organizations: Organization[]
  media: Media[]
  researchThemes: ResearchTheme[]
  projects: Project[]
  grants: Grant[]
  awards: Award[]
  news: News[]
  /** The Payload Form the contact page submits to, if the Lab has made one. */
  contactFormId: string | null
}

/**
 * The Form (Admin → Forms) the contact page submits to: the one titled
 * "Contact", with `name`, `email` and `message` fields. `scripts/seed-demo.ts`
 * creates it.
 */
export const CONTACT_FORM_TITLE = 'Contact'

export async function loadSiteRecords(): Promise<SiteRecords> {
  const payload = await getPayload({ config: configPromise })
  const features = await getFeatures(payload)

  // Public reads: access control applies, so draft Projects stay out. Join
  // fields are skipped because the loader resolves relationships itself.
  const read = { depth: 0, limit: 0, pagination: false, overrideAccess: false } as const
  const readSkippingJoins = { ...read, joins: false } as const

  // A switched-off Feature loads nothing, so its records drop out of every page
  // (a Person's Projects, a Publication's Awards) as well as its own routes.
  const when = async <T>(on: boolean, docs: () => Promise<{ docs: T[] }>) =>
    on ? (await docs()).docs : []

  const [
    labInfo,
    team,
    publications,
    venues,
    organizations,
    media,
    researchThemes,
    projects,
    grants,
    awards,
    news,
    forms,
  ] = await Promise.all([
    payload.findGlobal({ slug: 'lab-info', depth: 0, overrideAccess: false }),
    payload.find({ collection: 'team', ...readSkippingJoins, sort: 'lastName' }),
    payload.find({
      collection: 'publications',
      ...readSkippingJoins,
      sort: '-year',
      // Hide, don't delete (ADR-0002): a hidden Publication stays off the site.
      where: { displayInWebsite: { not_equals: false } },
    }),
    payload.find({ collection: 'venues', ...readSkippingJoins }),
    payload.find({ collection: 'organizations', ...readSkippingJoins }),
    payload.find({ collection: 'media', ...read }),
    when(features.researchThemes, () =>
      payload.find({ collection: 'research-themes', ...readSkippingJoins, sort: 'createdAt' }),
    ),
    when(features.projects, () => payload.find({ collection: 'projects', ...read, sort: 'title' })),
    when(features.grants, () =>
      payload.find({ collection: 'grants', ...readSkippingJoins, sort: '-startDate' }),
    ),
    when(features.awards, () =>
      payload.find({ collection: 'awards', ...readSkippingJoins, sort: '-year' }),
    ),
    when(features.newsItems, () => payload.find({ collection: 'news', ...read, sort: '-date' })),
    payload.find({
      collection: 'forms',
      depth: 0,
      limit: 1,
      overrideAccess: false,
      where: { title: { equals: CONTACT_FORM_TITLE } },
      select: {},
    }),
  ])

  return {
    labInfo,
    features,
    team: team.docs,
    publications: publications.docs,
    venues: venues.docs,
    organizations: organizations.docs,
    media: media.docs,
    researchThemes,
    projects,
    grants,
    awards,
    news,
    contactFormId: forms.docs[0]?.id ?? null,
  }
}
