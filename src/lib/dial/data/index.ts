/**
 * Lookups and relationship resolution over DIAL's records — the in-memory
 * joins the pages and views read from. `createDialData` closes over one
 * request's records (loaded from Payload by ./load.ts); every count or range
 * the site shows is computed here from the same records the pages render
 * (labs/dial/frontend.md, "Derived values"). Server-only: client components
 * receive mapped view models (./views.ts) as props.
 */
import type { DialRecords } from './load'
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

export type * from './types'

export function createDialData(records: DialRecords) {
  const {
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
    collaboratingOrganizationIds,
    homePartnerOrganizationIds,
  } = records

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

  const getTeamMember = (id: string): Team | undefined => teamById.get(id)
  const getProject = (id: string): Project | undefined => projectById.get(id)
  const getGrant = (id: string): Grant | undefined => grantById.get(id)
  const getAward = (id: string): Award | undefined => awardById.get(id)
  const getResearchTheme = (id: string): ResearchTheme | undefined => themeById.get(id)
  const getOrganization = (id: string): Organization | undefined => organizationById.get(id)
  const getVenue = (id: string): Venue | undefined => venueById.get(id)
  const getPublication = (id: string): Publication | undefined => publicationById.get(id)

  /** Resolve a list of ids, dropping any that do not exist. */
  function resolveIds<T>(
    ids: string[] | null | undefined,
    get: (id: string) => T | undefined,
  ): T[] {
    return (ids ?? []).map(get).filter((record): record is T => record !== undefined)
  }

  // Slugs equal ids for every collection with a slug.
  const getTeamMemberBySlug = (slug: string) => team.find((m) => m.slug === slug)
  const getProjectBySlug = (slug: string) => projects.find((p) => p.slug === slug)
  const getResearchThemeBySlug = (slug: string) => researchThemes.find((t) => t.slug === slug)

  // ─── Team ───────────────────────────────────────────────────────────────────

  /** Team Members the public site may show (`displayInWebsite` is not false). */
  const publicTeam = (): Team[] => team.filter((m) => m.displayInWebsite !== false)

  const director = (): Team | undefined => team.find((m) => m.role === 'director')

  const isAlumni = (m: Team) => m.role === 'alumni'

  const COLLABORATOR_ROLES = new Set(['external-collaborator', 'interdisciplinary-collaborator'])
  const isCollaborator = (m: Team) => COLLABORATOR_ROLES.has(m.role)

  /** Current student and research-staff members, i.e. people the Lab mentors. */
  const isCurrentResearcher = (m: Team) => m.role === 'graduate-ra' || m.role === 'undergraduate-ra'

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
  function teamIdForName(name: string | null | undefined): string | undefined {
    return name ? teamIdByName.get(normalizeName(name)) : undefined
  }

  // ─── Publications ───────────────────────────────────────────────────────────

  /** Author display names in source order, resolving linked Team Members. */
  function publicationAuthorNames(pub: Publication): string[] {
    return pub.authors
      .map((a) => (a.teamMember ? getTeamMember(a.teamMember)?.name : a.customAuthor?.name))
      .filter((name): name is string => Boolean(name))
  }

  /** Team ids among a publication's authors (explicit link, else Safe Match on name). */
  function publicationTeamIds(pub: Publication): string[] {
    const ids = pub.authors
      .map((a) => a.teamMember ?? teamIdForName(a.customAuthor?.name))
      .filter((id): id is string => Boolean(id))
    return [...new Set(ids)]
  }

  /** A publication with at least one author outside the Lab's own researchers. */
  function isCollaboration(pub: Publication): boolean {
    return pub.authors.some((a) => {
      const id = a.teamMember ?? teamIdForName(a.customAuthor?.name)
      const member = id ? getTeamMember(id) : undefined
      return !member || isCollaborator(member)
    })
  }

  function venueLabel(pub: Publication): string | null {
    const venue = pub.venue ? getVenue(pub.venue) : undefined
    return venue?.shortName ?? venue?.name ?? pub.venueLabel ?? null
  }

  /**
   * The venue written out, when that says something the short form does not.
   *
   * "CHI" is the only form worth printing in a list — the full name is eleven
   * words — but it is also opaque to anyone outside the field, which is most of
   * the people a lab site has to convince. So the list keeps the acronym and
   * carries the expansion alongside it. Null when there is nothing to expand:
   * a venue with no `shortName` already renders as its full name, and a
   * free-text `venueLabel` has no expansion to give.
   */
  function venueFullName(pub: Publication): string | null {
    const venue = pub.venue ? getVenue(pub.venue) : undefined
    if (!venue?.shortName || venue.shortName === venue.name) return null
    return venue.name
  }

  /** Venues that have DIAL publications, most-published first. */
  function venuesByPublicationCount(): Venue[] {
    const count = (v: Venue) => publications.filter((p) => p.venue === v.id).length
    return venues.filter((v) => count(v) > 0).sort((a, b) => count(b) - count(a))
  }

  const publicationsByYear = (): Publication[] =>
    [...publications].sort((a, b) => b.year - a.year || a.title.localeCompare(b.title))

  const publicationsByTeamMember = (teamId: string): Publication[] =>
    publicationsByYear().filter((pub) => publicationTeamIds(pub).includes(teamId))

  const publicationsForProject = (project: Project): Publication[] =>
    resolveIds(project.publications, getPublication)

  const projectsForPublication = (pubId: string): Project[] =>
    projects.filter((p) => p.publications?.includes(pubId))

  /**
   * Research Themes of a publication: its own `themes`, plus the themes of every
   * Project that lists it. publications.ts leaves `themes` unset, so for now the
   * Project relationship is what places a publication under a theme.
   */
  function publicationThemeIds(pub: Publication): string[] {
    const fromProjects = projectsForPublication(pub.id).flatMap((p) => p.themes ?? [])
    return [...new Set([...(pub.themes ?? []), ...fromProjects])]
  }

  const publicationsByTheme = (themeId: string): Publication[] =>
    publicationsByYear().filter((pub) => publicationThemeIds(pub).includes(themeId))

  /** Featured publications, most recent first. */
  const featuredPublications = (): Publication[] =>
    publicationsByYear().filter((pub) => pub.featured)

  /**
   * Other papers to read after this one: everything filed under a shared Research
   * Theme first, then everything from the same Venue. Both are real links in the
   * record — nothing here is a similarity score.
   */
  function relatedPublications(pub: Publication, limit = 4): Publication[] {
    const sameTheme = publicationThemeIds(pub).flatMap((id) => publicationsByTheme(id))
    const sameVenue = pub.venue ? publicationsByYear().filter((p) => p.venue === pub.venue) : []
    const seen = new Set([pub.id])
    const out: Publication[] = []
    for (const candidate of [...sameTheme, ...sameVenue]) {
      if (seen.has(candidate.id)) continue
      seen.add(candidate.id)
      out.push(candidate)
      if (out.length === limit) break
    }
    return out
  }

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
  const awardName = (award: Award): string => award.title.split(' — ')[0]

  /** The paper an award's title names after " — ", when it is in publications.ts. */
  function awardedPaperTitle(award: Award): string | null {
    const [, paper] = award.title.split(' — ')
    return paper ? paper.replace(/^"|"$/g, '').trim() : null
  }

  /**
   * The Publication an Award was given for. LabKit stores this on the
   * Publication (`awards`); publications.ts leaves that unset, so the link is
   * recovered by exact normalized title from the award's own title.
   */
  function awardPublication(award: Award): Publication | undefined {
    const paper = awardedPaperTitle(award)
    const id = paper ? publicationIdByTitle.get(normalizeTitle(paper)) : undefined
    return id ? getPublication(id) : undefined
  }

  function awardsForPublication(pub: Publication): Award[] {
    const linked = resolveIds(pub.awards, getAward)
    const byTitle = awards.filter((a) => awardPublication(a)?.id === pub.id)
    return [...new Set([...linked, ...byTitle])]
  }

  const labAwards = (): Award[] =>
    awards.filter((a) => a.scope !== 'personal').sort((a, b) => b.year - a.year)

  const awardsForTeamMember = (teamId: string): Award[] =>
    awards
      .filter((a) => a.recipients?.some((r) => r.teamMember === teamId))
      .sort((a, b) => b.year - a.year)

  const awardsForProject = (project: Project): Award[] => resolveIds(project.awards, getAward)

  const projectsForAward = (awardId: string): Project[] =>
    projects.filter((p) => p.awards?.includes(awardId))

  /** Award recipients as display names, Team Members first-class. */
  function awardRecipientNames(award: Award): { team: string[]; external: string[] } {
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

  const projectsByTheme = (themeId: string): Project[] =>
    projects.filter((p) => p.themes?.includes(themeId))

  const projectsByTeamMember = (teamId: string): Project[] =>
    projects.filter((p) => p.teamMembers?.includes(teamId))

  const featuredProjects = (): Project[] => projects.filter((p) => p.featured)

  const grantsByTheme = (themeId: string): Grant[] =>
    grants.filter((g) => g.themes?.includes(themeId))

  const grantsByTeamMember = (teamId: string): Grant[] =>
    grants.filter((g) => g.investigators?.some((i) => i.teamMember === teamId))

  const grantsForProject = (project: Project): Grant[] => resolveIds(project.grants, getGrant)

  const projectsForGrant = (grantId: string): Project[] =>
    projects.filter((p) => p.grants?.includes(grantId))

  const yearOf = (isoDate: string | null | undefined): number | null =>
    isoDate ? Number(isoDate.slice(0, 4)) : null

  const grantStartYear = (g: Grant) => yearOf(g.startDate)
  const grantEndYear = (g: Grant) => yearOf(g.endDate)

  /**
   * Whether a Grant is running now. An explicit `status` wins; otherwise the end
   * year decides, and a Grant with no recorded end is not counted as active.
   */
  function isGrantActive(g: Grant, now = new Date()): boolean {
    if (g.status) return g.status === 'active'
    const end = grantEndYear(g)
    return end !== null && end >= now.getFullYear()
  }

  /** Funder display name: the Organization's name, else the captured label. */
  function grantFunderName(g: Grant): string {
    const org = g.funder ? getOrganization(g.funder) : undefined
    return org?.name ?? g.funderLabel ?? 'Funder not recorded'
  }

  /** A Team Member's role on a Grant, in the prototype's wording. */
  function grantRoleFor(g: Grant, teamId: string): 'Principal Investigator' | 'Co-Investigator' {
    const role = g.investigators?.find((i) => i.teamMember === teamId)?.role
    return role === 'pi' ? 'Principal Investigator' : 'Co-Investigator'
  }

  // ─── Organizations ──────────────────────────────────────────────────────────

  const collaboratingOrganizations = (): Organization[] =>
    resolveIds(collaboratingOrganizationIds, getOrganization)

  const homePartnerOrganizations = (): Organization[] =>
    resolveIds(homePartnerOrganizationIds, getOrganization)

  // ─── Derived statistics ─────────────────────────────────────────────────────

  function yearRange(years: number[]): { min: number; max: number } | null {
    if (years.length === 0) return null
    return { min: Math.min(...years), max: Math.max(...years) }
  }

  /** Lab-wide counts, computed from the records. */
  function labStats(now = new Date()) {
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
      yearsOfResearch: labInfo.hciResearchSince
        ? now.getFullYear() - labInfo.hciResearchSince
        : null,
    }
  }

  /** Per-theme counts, computed from the records. */
  function themeStats(themeId: string) {
    return {
      projects: projectsByTheme(themeId).length,
      publications: publicationsByTheme(themeId).length,
      grants: grantsByTheme(themeId).length,
    }
  }

  // ─── Venues ─────────────────────────────────────────────────────────────────

  /**
   * A Venue as the Lab's record there: how many papers, over which years, and
   * the Lab's awards for papers it published there. Awards reach a Venue through
   * their Publication (`awardPublication`), so an award whose paper is not in
   * the record — or that is not for a paper at all — is not counted.
   */
  function venueRecords(limit?: number) {
    const records = venuesByPublicationCount().map((venue) => {
      const papers = publications.filter((p) => p.venue === venue.id)
      return {
        venue,
        publicationCount: papers.length,
        years: yearRange(papers.map((p) => p.year)),
        awards: labAwards().filter((a) => awardPublication(a)?.venue === venue.id),
      }
    })
    return limit ? records.slice(0, limit) : records
  }

  // ─── Research Themes ────────────────────────────────────────────────────────

  /** The Projects a Theme's row can name as evidence: featured first, then the rest. */
  const themeExampleProjects = (themeId: string, limit = 2): Project[] =>
    [...projectsByTheme(themeId)]
      .sort((a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)))
      .slice(0, limit)

  return {
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
    getTeamMember,
    getProject,
    getGrant,
    getAward,
    getResearchTheme,
    getOrganization,
    getVenue,
    getPublication,
    resolveIds,
    getTeamMemberBySlug,
    getProjectBySlug,
    getResearchThemeBySlug,
    publicTeam,
    director,
    isAlumni,
    isCollaborator,
    isCurrentResearcher,
    teamIdForName,
    publicationAuthorNames,
    publicationTeamIds,
    isCollaboration,
    venueLabel,
    venueFullName,
    venuesByPublicationCount,
    publicationsByYear,
    publicationsByTeamMember,
    publicationsForProject,
    projectsForPublication,
    publicationThemeIds,
    publicationsByTheme,
    featuredPublications,
    relatedPublications,
    awardName,
    awardedPaperTitle,
    awardPublication,
    awardsForPublication,
    labAwards,
    awardsForTeamMember,
    awardsForProject,
    projectsForAward,
    awardRecipientNames,
    projectsByTheme,
    projectsByTeamMember,
    featuredProjects,
    grantsByTheme,
    grantsByTeamMember,
    grantsForProject,
    projectsForGrant,
    grantStartYear,
    grantEndYear,
    isGrantActive,
    grantFunderName,
    grantRoleFor,
    collaboratingOrganizations,
    homePartnerOrganizations,
    yearRange,
    labStats,
    themeStats,
    venueRecords,
    themeExampleProjects,
  }
}

export type DialData = ReturnType<typeof createDialData>
