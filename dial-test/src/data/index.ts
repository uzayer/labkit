/**
 * Lookups and relationship resolution over the prototype's records — the
 * stand-in for Payload Local API queries and joins. Server-only in practice:
 * client components receive mapped view models (./views.ts) as props instead
 * of importing this module.
 *
 * The records are a small fixture set, not DIAL's full data: enough to
 * exercise every page and edge case (a project with no image or publications,
 * a theme with no projects, hidden and alumni people, custom recipients,
 * year-only news dates), small enough to reshape by hand when the data shape
 * changes. The full scraped set is archived in labs/dial/dial-test-full-data/.
 *
 * Every count or range the site shows is computed here from the same records
 * the pages render (labs/dial/frontend.md, "Derived values").
 */
import { awards } from './awards'
import { grants } from './grants'
import { labInfo } from './lab-info'
import { news } from './news'
import {
  collaboratingOrganizationIds,
  homePartnerOrganizationIds,
  organizations,
} from './organizations'
import { projects } from './projects'
import { publications } from './publications'
import { researchThemes } from './research-themes'
import { team } from './team'
import type {
  Award,
  Grant,
  Organization,
  Project,
  Publication,
  ResearchTheme,
  Team,
  Venue,
} from './types'
import { venues } from './venues'

export {
  awards,
  grants,
  labInfo,
  news,
  organizations,
  projects,
  publications,
  researchThemes,
  team,
  venues,
}
export type * from './types'

// ─── byId maps ──────────────────────────────────────────────────────────────

function indexById<T extends { id: string }>(records: T[]): Map<string, T> {
  return new Map(records.map((record) => [record.id, record]))
}

const teamById = indexById(team)
const projectById = indexById(projects)
const grantById = indexById(grants)
const awardById = indexById(awards)
const themeById = indexById(researchThemes)
const organizationById = indexById(organizations)
const venueById = indexById(venues)
const publicationById = indexById(publications)

export const getTeamMember = (id: string): Team | undefined => teamById.get(id)
export const getProject = (id: string): Project | undefined => projectById.get(id)
export const getGrant = (id: string): Grant | undefined => grantById.get(id)
export const getAward = (id: string): Award | undefined => awardById.get(id)
export const getResearchTheme = (id: string): ResearchTheme | undefined => themeById.get(id)
export const getOrganization = (id: string): Organization | undefined => organizationById.get(id)
export const getVenue = (id: string): Venue | undefined => venueById.get(id)
export const getPublication = (id: string): Publication | undefined => publicationById.get(id)

/** Resolve a list of ids, dropping any that do not exist. */
export function resolveIds<T>(ids: string[] | null | undefined, get: (id: string) => T | undefined): T[] {
  return (ids ?? []).map(get).filter((record): record is T => record !== undefined)
}

// Slugs equal ids for every collection with a slug.
export const getTeamMemberBySlug = (slug: string) => team.find((m) => m.slug === slug)
export const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
export const getResearchThemeBySlug = (slug: string) => researchThemes.find((t) => t.slug === slug)

// ─── Team ───────────────────────────────────────────────────────────────────

/** Team Members the public site may show (`displayInWebsite` is not false). */
export const publicTeam = (): Team[] => team.filter((m) => m.displayInWebsite !== false)

export const director = (): Team | undefined => team.find((m) => m.role === 'director')

export const isAlumni = (m: Team) => m.role === 'alumni'

const COLLABORATOR_ROLES = new Set(['external-collaborator', 'interdisciplinary-collaborator'])
export const isCollaborator = (m: Team) => COLLABORATOR_ROLES.has(m.role)

/** Current student and research-staff members, i.e. people the Lab mentors. */
export const isCurrentResearcher = (m: Team) =>
  m.role === 'graduate-ra' || m.role === 'undergraduate-ra'

function normalizeName(name: string): string {
  return name
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const teamIdByName = new Map<string, string>()
for (const member of team) {
  for (const name of [member.name, ...(member.nameVariants ?? [])]) {
    teamIdByName.set(normalizeName(name), member.id)
  }
}

/**
 * The Team Member an author name refers to, by exact (normalized) full name or
 * a captured spelling variant — LabKit's Safe Match rule. Never fuzzy.
 */
export function teamIdForName(name: string | null | undefined): string | undefined {
  return name ? teamIdByName.get(normalizeName(name)) : undefined
}

// ─── Publications ───────────────────────────────────────────────────────────

/** Author display names in source order, resolving linked Team Members. */
export function publicationAuthorNames(pub: Publication): string[] {
  return pub.authors
    .map((a) => (a.teamMember ? getTeamMember(a.teamMember)?.name : a.customAuthor?.name))
    .filter((name): name is string => Boolean(name))
}

/** Team ids among a publication's authors (explicit link, else Safe Match on name). */
export function publicationTeamIds(pub: Publication): string[] {
  const ids = pub.authors
    .map((a) => a.teamMember ?? teamIdForName(a.customAuthor?.name))
    .filter((id): id is string => Boolean(id))
  return [...new Set(ids)]
}

/** A publication with at least one author outside the Lab's own researchers. */
export function isCollaboration(pub: Publication): boolean {
  return pub.authors.some((a) => {
    const id = a.teamMember ?? teamIdForName(a.customAuthor?.name)
    const member = id ? getTeamMember(id) : undefined
    return !member || isCollaborator(member)
  })
}

export function venueLabel(pub: Publication): string | null {
  const venue = pub.venue ? getVenue(pub.venue) : undefined
  return venue?.shortName ?? venue?.name ?? pub.venueLabel ?? null
}

/** Venues that have DIAL publications, most-published first. */
export function venuesByPublicationCount(): Venue[] {
  const count = (v: Venue) => publications.filter((p) => p.venue === v.id).length
  return venues.filter((v) => count(v) > 0).sort((a, b) => count(b) - count(a))
}

export const publicationsByYear = (): Publication[] =>
  [...publications].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))

export const publicationsByTeamMember = (teamId: string): Publication[] =>
  publicationsByYear().filter((pub) => publicationTeamIds(pub).includes(teamId))

export const publicationsForProject = (project: Project): Publication[] =>
  resolveIds(project.publications, getPublication)

export const projectsForPublication = (pubId: string): Project[] =>
  projects.filter((p) => p.publications?.includes(pubId))

/**
 * Research Themes of a publication: its own `themes`, plus the themes of every
 * Project that lists it. publications.ts leaves `themes` unset, so for now the
 * Project relationship is what places a publication under a theme.
 */
export function publicationThemeIds(pub: Publication): string[] {
  const fromProjects = projectsForPublication(pub.id).flatMap((p) => p.themes ?? [])
  return [...new Set([...(pub.themes ?? []), ...fromProjects])]
}

export const publicationsByTheme = (themeId: string): Publication[] =>
  publicationsByYear().filter((pub) => publicationThemeIds(pub).includes(themeId))

/** Featured publications, most recent first. */
export const featuredPublications = (): Publication[] =>
  publicationsByYear().filter((pub) => pub.featured)

// ─── Awards ─────────────────────────────────────────────────────────────────

function normalizeTitle(title: string): string {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

const publicationIdByTitle = new Map(publications.map((p) => [normalizeTitle(p.title), p.id]))

/** An award's display name without the paper title that follows " — ". */
export const awardName = (award: Award): string => award.title.split(' — ')[0]

/** The paper an award's title names after " — ", when it is in publications.ts. */
export function awardedPaperTitle(award: Award): string | null {
  const [, paper] = award.title.split(' — ')
  return paper ? paper.replace(/^"|"$/g, '').trim() : null
}

/**
 * The Publication an Award was given for. LabKit stores this on the
 * Publication (`awards`); publications.ts leaves that unset, so the link is
 * recovered by exact normalized title from the award's own title.
 */
export function awardPublication(award: Award): Publication | undefined {
  const paper = awardedPaperTitle(award)
  const id = paper ? publicationIdByTitle.get(normalizeTitle(paper)) : undefined
  return id ? getPublication(id) : undefined
}

export function awardsForPublication(pub: Publication): Award[] {
  const linked = resolveIds(pub.awards, getAward)
  const byTitle = awards.filter((a) => awardPublication(a)?.id === pub.id)
  return [...new Set([...linked, ...byTitle])]
}

export const labAwards = (): Award[] =>
  awards.filter((a) => a.scope !== 'personal').sort((a, b) => b.year - a.year)

export const awardsForTeamMember = (teamId: string): Award[] =>
  awards
    .filter((a) => a.recipients?.some((r) => r.teamMember === teamId))
    .sort((a, b) => b.year - a.year)

export const awardsForProject = (project: Project): Award[] => resolveIds(project.awards, getAward)

export const projectsForAward = (awardId: string): Project[] =>
  projects.filter((p) => p.awards?.includes(awardId))

/** Award recipients as display names, Team Members first-class. */
export function awardRecipientNames(award: Award): { team: string[]; external: string[] } {
  const teamNames: string[] = []
  const external: string[] = []
  for (const r of award.recipients ?? []) {
    const member = r.teamMember ? getTeamMember(r.teamMember) : undefined
    if (member && !isCollaborator(member)) teamNames.push(member.name)
    else if (member) external.push(member.name)
    else if (r.customRecipient?.name) external.push(r.customRecipient.name)
  }
  return { team: teamNames, external }
}

// ─── Projects & Grants ──────────────────────────────────────────────────────

export const projectsByTheme = (themeId: string): Project[] =>
  projects.filter((p) => p.themes?.includes(themeId))

export const projectsByTeamMember = (teamId: string): Project[] =>
  projects.filter((p) => p.teamMembers?.includes(teamId))

export const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

export const grantsByTheme = (themeId: string): Grant[] =>
  grants.filter((g) => g.themes?.includes(themeId))

export const grantsByTeamMember = (teamId: string): Grant[] =>
  grants.filter((g) => g.investigators?.some((i) => i.teamMember === teamId))

export const grantsForProject = (project: Project): Grant[] => resolveIds(project.grants, getGrant)

export const projectsForGrant = (grantId: string): Project[] =>
  projects.filter((p) => p.grants?.includes(grantId))

const yearOf = (isoDate: string | null | undefined): number | null =>
  isoDate ? Number(isoDate.slice(0, 4)) : null

export const grantStartYear = (g: Grant) => yearOf(g.startDate)
export const grantEndYear = (g: Grant) => yearOf(g.endDate)

/**
 * Whether a Grant is running now. An explicit `status` wins; otherwise the end
 * year decides, and a Grant with no recorded end is not counted as active.
 */
export function isGrantActive(g: Grant, now = new Date()): boolean {
  if (g.status) return g.status === 'active'
  const end = grantEndYear(g)
  return end !== null && end >= now.getFullYear()
}

/** Funder display name: the Organization's name, else the captured label. */
export function grantFunderName(g: Grant): string {
  const org = g.funder ? getOrganization(g.funder) : undefined
  return org?.name ?? g.funderLabel ?? 'Funder not recorded'
}

/** A Team Member's role on a Grant, in the prototype's wording. */
export function grantRoleFor(g: Grant, teamId: string): 'Principal Investigator' | 'Co-Investigator' {
  const role = g.investigators?.find((i) => i.teamMember === teamId)?.role
  return role === 'pi' ? 'Principal Investigator' : 'Co-Investigator'
}

// ─── Organizations ──────────────────────────────────────────────────────────

export const collaboratingOrganizations = (): Organization[] =>
  resolveIds(collaboratingOrganizationIds, getOrganization)

export const homePartnerOrganizations = (): Organization[] =>
  resolveIds(homePartnerOrganizationIds, getOrganization)

// ─── Derived statistics ─────────────────────────────────────────────────────

export function yearRange(years: number[]): { min: number; max: number } | null {
  if (years.length === 0) return null
  return { min: Math.min(...years), max: Math.max(...years) }
}

/** Lab-wide counts, computed from the records. */
export function labStats(now = new Date()) {
  const visible = publicTeam()
  const alumni = visible.filter(isAlumni)
  const lab = labAwards()
  return {
    publications: publications.length,
    publicationYears: yearRange(publications.map((p) => p.year)),
    projects: projects.length,
    ongoingProjects: projects.filter((p) => p.status === 'ongoing').length,
    completedProjects: projects.filter((p) => p.status === 'completed').length,
    grants: grants.length,
    activeGrants: grants.filter((g) => isGrantActive(g, now)).length,
    labAwards: lab.length,
    bestPaperAwards: lab.filter((a) => a.category === 'best-paper').length,
    awardYears: yearRange(lab.map((a) => a.year)),
    currentResearchers: visible.filter(isCurrentResearcher).length,
    alumni: alumni.length,
    alumniPlaced: alumni.filter((m) => m.currentPosition).length,
    /** Everyone the Lab has trained: current researchers plus alumni. */
    researchersMentored: visible.filter((m) => isCurrentResearcher(m) || isAlumni(m)).length,
    yearsOfResearch: labInfo.hciResearchSince ? now.getFullYear() - labInfo.hciResearchSince : null,
  }
}

/** Per-theme counts, computed from the records. */
export function themeStats(themeId: string) {
  return {
    projects: projectsByTheme(themeId).length,
    publications: publicationsByTheme(themeId).length,
    grants: grantsByTheme(themeId).length,
  }
}
