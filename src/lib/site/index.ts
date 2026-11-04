import 'server-only'

import { unstable_cache } from 'next/cache'
import { cache } from 'react'

import type { Award, Grant, LabInfo, Media, Organization, Publication, Team } from '@/payload-types'

import { slugOf, teamMemberName } from './format'
import { loadSiteRecords, type SiteRecords } from './load'
import { SITE_CACHE_TAG } from './tag'

/**
 * The site's records, cached across requests and invalidated by tag.
 *
 * Every page reads from the same corpus, so the cache holds one entry, the full
 * load: an edit to anything expires everything (src/plugins/revalidateSite.ts),
 * which is correct and costs one reload. The hour-long `revalidate` is a
 * backstop for writes no hook sees (`payload run` scripts), and refreshes values
 * computed from today's date, like whether recruitment is open.
 *
 * The deployment id is part of the key because Vercel's data cache outlives a
 * deployment: new code must not read records cached by the previous one.
 */
const loadCachedSiteRecords = unstable_cache(
  loadSiteRecords,
  ['site-records', process.env.VERCEL_DEPLOYMENT_ID ?? process.env.VERCEL_GIT_COMMIT_SHA ?? ''],
  { tags: [SITE_CACHE_TAG], revalidate: 3600 },
)

/**
 * The records and their lookups for the current request. React `cache` builds
 * the lookups once per request, however many components ask.
 */
export const getSite = cache(async () => createSite(await loadCachedSiteRecords()))

export type Site = Awaited<ReturnType<typeof getSite>>

type Ref<T> = string | T | null | undefined

/** A relationship's id, whether or not Payload populated it. */
export const refId = <T extends { id: string }>(value: Ref<T>): string | null =>
  value == null ? null : typeof value === 'string' ? value : value.id

const refIds = <T extends { id: string }>(values: Ref<T>[] | null | undefined): string[] =>
  (values ?? []).map(refId).filter((id): id is string => Boolean(id))

/** A person credited on a record: a Team Member, or a custom (free-text) person. */
export interface Credit {
  key: string
  name: string
  /** Their page, for a Team Member shown on the site. */
  href: string | null
  /** A Team Member's record, for highlighting the Lab's own people. */
  member: Team | null
  affiliation: string | null
}

type CustomPerson = {
  name?: string | null
  affiliation?: Ref<Organization>
  affiliationLabel?: string | null
} | null

function createSite(records: SiteRecords) {
  const index = <T extends { id: string }>(docs: T[]) => new Map(docs.map((doc) => [doc.id, doc]))
  const teamById = index(records.team)
  const mediaById = index(records.media)
  const venueById = index(records.venues)
  const organizationById = index(records.organizations)
  const themeById = index(records.researchThemes)
  const projectById = index(records.projects)
  const grantById = index(records.grants)
  const awardById = index(records.awards)
  const publicationById = index(records.publications)

  const lookup =
    <T extends { id: string }>(map: Map<string, T>) =>
    (value: Ref<T>): T | undefined => {
      const id = refId(value)
      return id ? map.get(id) : undefined
    }
  const lookupAll =
    <T extends { id: string }>(map: Map<string, T>) =>
    (values: Ref<T>[] | null | undefined): T[] =>
      refIds(values).flatMap((id) => map.get(id) ?? [])

  const member = lookup(teamById)
  const media = lookup(mediaById)
  const venue = lookup(venueById)
  const organization = lookup(organizationById)
  const organizationsIn = lookupAll(organizationById)
  const themes = lookupAll(themeById)
  const projectsIn = lookupAll(projectById)
  const grantsIn = lookupAll(grantById)
  const awardsIn = lookupAll(awardById)
  const publicationsIn = lookupAll(publicationById)

  /** Shown on the site: hide, don't delete (ADR-0002). */
  const isListed = (person: Team) => person.displayInWebsite !== false
  const personHref = (person: Team) => (isListed(person) ? `/people/${slugOf(person)}` : null)

  /** An Organization's name, or the free-text label stored next to the relationship. */
  const organizationName = (value: Ref<Organization>, label?: string | null) => {
    const org = organization(value)
    return org?.name || label || null
  }

  const credit = (key: string, teamMember: Ref<Team>, custom: CustomPerson): Credit | null => {
    const person = member(teamMember)
    if (person) {
      return {
        key,
        name: teamMemberName(person),
        href: personHref(person),
        member: person,
        affiliation: organizationName(person.affiliation, person.affiliationLabel),
      }
    }
    if (!custom?.name) return null
    return {
      key,
      name: custom.name,
      href: null,
      member: null,
      affiliation: organizationName(custom.affiliation, custom.affiliationLabel),
    }
  }

  /** Team Members from a plain relationship list (a Project's team), as credits. */
  const peopleIn = (values: Ref<Team>[] | null | undefined): Credit[] =>
    (values ?? []).flatMap((ref, i) => credit(refId(ref) ?? String(i), ref, null) ?? [])

  const authorsOf = (pub: Publication): Credit[] =>
    [...(pub.authors ?? [])]
      .sort((a, b) => (a.authorPosition ?? 0) - (b.authorPosition ?? 0))
      .flatMap((a, i) => credit(a.id ?? String(i), a.teamMember, a.customAuthor ?? null) ?? [])

  const investigatorsOf = (grant: Grant) =>
    (grant.investigators ?? []).flatMap((inv, i) => {
      const person = credit(inv.id ?? String(i), inv.teamMember, inv.customInvestigator ?? null)
      return person ? [{ ...person, role: inv.role ?? null }] : []
    })

  const recipientsOf = (award: Award): Credit[] =>
    (award.recipients ?? []).flatMap(
      (r, i) => credit(r.id ?? String(i), r.teamMember, r.customRecipient ?? null) ?? [],
    )

  /** The venue's name, or `venueLabel` where there's no Venue record. */
  const venueName = (pub: Publication) => venue(pub.venue)?.name || pub.venueLabel || null

  const mediaUrl = (value: Ref<Media>) => media(value)?.url ?? null

  // Newest first; within a year, by date where known, then title.
  const publications = [...records.publications].sort(
    (a, b) =>
      b.year - a.year ||
      (b.publicationDate ?? '').localeCompare(a.publicationDate ?? '') ||
      a.title.localeCompare(b.title),
  )

  const authoredBy = (pub: Publication, memberId: string) =>
    pub.authors?.some((a) => refId(a.teamMember) === memberId)

  const labName = records.labInfo.name || 'Your Lab'

  return {
    ...records,
    publications,
    labName,
    /** The short name where the Lab has one, for tight spots like the header. */
    labShortName: records.labInfo.shortName || labName,
    listedTeam: records.team.filter(isListed),

    member,
    media,
    mediaUrl,
    venue,
    organization,
    organizationName,
    organizationsIn,
    themes,
    projectsIn,
    grantsIn,
    awardsIn,
    publicationsIn,
    isListed,
    personHref,
    peopleIn,
    authorsOf,
    investigatorsOf,
    recipientsOf,
    venueName,

    findPublication: (id: string) => publicationById.get(id),
    findPerson: (slug: string) => records.team.find((p) => slugOf(p) === slug && isListed(p)),
    findTheme: (slug: string) => records.researchThemes.find((t) => slugOf(t) === slug),
    findProject: (slug: string) => records.projects.find((p) => slugOf(p) === slug),
    findNews: (slug: string) => records.news.find((n) => slugOf(n) === slug),

    publicationsBy: (memberId: string) => publications.filter((p) => authoredBy(p, memberId)),
    publicationsForTheme: (themeId: string) =>
      publications.filter((p) => refIds(p.themes).includes(themeId)),
    /** Publications own their Awards (ADR-0002), so an Award's papers are a reverse lookup. */
    publicationsWithAward: (awardId: string) =>
      publications.filter((p) => refIds(p.awards).includes(awardId)),
    projectsWith: (memberId: string) =>
      records.projects.filter((p) => refIds(p.teamMembers).includes(memberId)),
    projectsForTheme: (themeId: string) =>
      records.projects.filter((p) => refIds(p.themes).includes(themeId)),
    projectsForPublication: (pubId: string) =>
      records.projects.filter((p) => refIds(p.publications).includes(pubId)),
    grantsWith: (memberId: string) =>
      records.grants.filter((g) => g.investigators?.some((i) => refId(i.teamMember) === memberId)),
    awardsFor: (memberId: string) =>
      records.awards.filter((a) => a.recipients?.some((r) => refId(r.teamMember) === memberId)),
    preprintsOf: (pubId: string) => publications.filter((p) => refId(p.versionOf) === pubId),

    /**
     * The Publication with its authors, venue and PDF populated, the shape
     * `@labkit/core/seo` needs for citation meta tags and JSON-LD.
     */
    populatedPublication: (pub: Publication): Publication => ({
      ...pub,
      authors: pub.authors.map((a) => ({ ...a, teamMember: member(a.teamMember) ?? null })),
      venue: venue(pub.venue) ?? null,
      pdf: pub.pdf ? { ...pub.pdf, upload: media(pub.pdf.upload) ?? null } : pub.pdf,
    }),
    populatedMember: (person: Team): Team => ({
      ...person,
      affiliation: organization(person.affiliation) ?? null,
      photo: media(person.photo) ?? null,
    }),
    populatedLabInfo: (): LabInfo => ({
      ...records.labInfo,
      logo: media(records.labInfo.logo) ?? null,
    }),
  }
}
