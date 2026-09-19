/**
 * Record → view-model mappers: the small, page-shaped layer the Payload port
 * will keep. Each function turns records (./index.ts) into the flat props a
 * component already expects, so porting a page means replacing the record
 * source, not the component. Server-side only; pages pass the results down.
 */
import type { Alumni } from '@/components/alumni-grid'
import type { Award as AwardRow, AwardCategory } from '@/components/awards-filter-table'
import type { ResearchProject } from '@/components/feature295'
import type { MemberProfileData, Social } from '@/components/member-profile'
import type { MemberPublication } from '@/components/member-publications'
import type { NavData } from '@/components/navbar4'
import type { NewsEntry } from '@/components/news-feed'
import type { PIProfileData } from '@/components/pi-profile'
import type { ProjectData } from '@/components/project-post'
import type { ProjectEntry } from '@/components/project-index'
import type {
  Publication as PublicationView,
  PublicationYear,
} from '@/components/publications1'
import type { SpotlightProject } from '@/components/research-sections'
import type { TeamMember as TeamGridMember } from '@/components/team5-9'
import type { CollaboratorGroup, RelatedTheme } from '@/components/theme-page-sections'

import {
  awardName,
  awardPublication,
  awardRecipientNames,
  awardedPaperTitle,
  awardsForProject,
  awardsForPublication,
  awardsForTeamMember,
  director,
  featuredProjects,
  getOrganization,
  getResearchTheme,
  getTeamMember,
  grantEndYear,
  grantFunderName,
  grantRoleFor,
  grantStartYear,
  grantsForProject,
  isAlumni,
  isCollaboration,
  isCollaborator,
  labAwards,
  labStats,
  news,
  projects,
  projectsByTheme,
  projectsForPublication,
  publicTeam,
  publicationAuthorNames,
  publicationThemeIds,
  researchThemes,
  resolveIds,
  venueLabel,
} from './index'
import type { Award, Grant, News, Project, Publication, ResearchTheme, Team } from './types'

const PLACEHOLDER_IMAGE = 'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg'

// ─── Publications ───────────────────────────────────────────────────────────

/** The Lab PI's name, emphasised in author lists. */
export const highlightAuthors = (): string[] => {
  const pi = director()
  return pi ? [pi.name] : []
}

/** Short award label for a publication badge, e.g. "Best Paper". */
function publicationAwardLabel(pub: Publication): string | null {
  const [award] = awardsForPublication(pub)
  return award ? awardName(award) : null
}

export function toPublicationView(pub: Publication): PublicationView {
  const [project] = projectsForPublication(pub.id)
  return {
    id: pub.id,
    title: pub.title,
    authors: publicationAuthorNames(pub).join(', '),
    venue: venueLabel(pub),
    award: publicationAwardLabel(pub),
    pdfLink: pub.pdf?.link ?? null,
    projectLink: project ? `/projects/${project.slug}` : null,
    doi: pub.doi ?? null,
    citationText: pub.citationText ?? null,
    themes: publicationThemeIds(pub)
      .map((id) => getResearchTheme(id)?.title)
      .filter((title): title is string => Boolean(title)),
    isOpenAccess: pub.isOpenAccess ?? null,
    isCollaboration: isCollaboration(pub),
    type: pub.type ?? null,
  }
}

/** Publications grouped by year, newest first, in the shape PublicationsSection takes. */
export function toPublicationYears(pubs: Publication[]): PublicationYear[] {
  const byYear = new Map<number, PublicationView[]>()
  for (const pub of pubs) {
    const list = byYear.get(pub.year) ?? []
    list.push(toPublicationView(pub))
    byYear.set(pub.year, list)
  }
  return [...byYear.entries()]
    .sort(([a], [b]) => b - a)
    .map(([year, publications]) => ({ year, publications }))
}

export function toMemberPublication(pub: Publication): MemberPublication {
  const view = toPublicationView(pub)
  return {
    id: pub.id,
    title: pub.title,
    authors: view.authors,
    venue: view.venue ?? '',
    year: pub.year,
    award: view.award ?? undefined,
    pdfLink: view.pdfLink ?? undefined,
    projectLink: view.projectLink ?? undefined,
    citationText: pub.citationText ?? undefined,
  }
}

// ─── Projects ───────────────────────────────────────────────────────────────

const themeTitles = (project: Project): string[] =>
  resolveIds(project.themes, getResearchTheme).map((t) => t.title)

/** The first linked Team Member, which the sources list as lead where they name one. */
function projectLead(project: Project): Team | undefined {
  return resolveIds(project.teamMembers, getTeamMember).find((m) => m.displayInWebsite !== false)
}

function projectAwardBadge(project: Project): { title: string } | undefined {
  const [award] = awardsForProject(project)
  return award ? { title: `${awardName(award)} · ${award.year}` } : undefined
}

export function toProjectEntry(project: Project): ProjectEntry {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    localName: project.localName ?? null,
    abstract: project.abstract ?? '',
    themes: themeTitles(project),
    status: project.status ?? null,
    leadResearcher: projectLead(project)?.name ?? null,
    award: projectAwardBadge(project),
    publicationCount: project.publications?.length ?? 0,
    teamMemberCount: project.teamMembers?.length ?? 0,
  }
}

export function toResearchProject(project: Project): ResearchProject {
  return {
    id: project.id,
    slug: project.slug,
    title: project.title,
    localName: project.localName ?? null,
    abstract: project.abstract ?? '',
    keywords: [],
    status: project.status ?? null,
    publicationCount: project.publications?.length ?? 0,
    teamMemberCount: project.teamMembers?.length ?? 0,
    award: projectAwardBadge(project),
  }
}

/** Splits a record's `## Heading` / paragraph content into titled sections. */
function contentSections(content: string | null | undefined): { heading: string; body: string }[] {
  if (!content) return []
  const sections: { heading: string; body: string }[] = []
  for (const block of content.split(/\n\n+/)) {
    const heading = block.match(/^## (.+)$/)
    if (heading) sections.push({ heading: heading[1], body: '' })
    else if (sections.length > 0) {
      const last = sections[sections.length - 1]
      last.body = last.body ? `${last.body}\n\n${block}` : block
    } else sections.push({ heading: 'About the project', body: block })
  }
  return sections
}

function formatAmount(g: Grant): string | null {
  if (g.amountValue != null && g.amountCurrency) {
    return `${g.amountCurrency} ${g.amountValue.toLocaleString('en-US')}`
  }
  return g.amountLabel ?? null
}

function teamRoleLabel(member: Team): string {
  if (member.role === 'director') return 'Principal Investigator'
  if (isAlumni(member)) return 'Alumni'
  return member.title.split(/[;,]/)[0]
}

export function toProjectPost(project: Project): ProjectData {
  const team = resolveIds(project.teamMembers, getTeamMember).filter(
    (m) => m.displayInWebsite !== false,
  )
  const grants = grantsForProject(project)
  const metaItems = grants.map((g) => ({
    label: 'Funding',
    value: [grantFunderName(g), g.title, formatAmount(g)].filter(Boolean).join(' · '),
  }))
  if (project.externalUrl) metaItems.push({ label: 'Project site', value: project.externalUrl })
  return {
    title: project.title,
    localName: project.localName ?? undefined,
    overview: project.abstract ?? '',
    heroImageUrl: project.heroImage ?? undefined,
    startDate: project.startDate ?? undefined,
    endDate: project.endDate ?? undefined,
    status: project.status ?? null,
    teamMembers: team.map((m) => ({
      id: m.id,
      name: m.name,
      role: teamRoleLabel(m),
      avatarUrl: m.photo ?? undefined,
    })),
    themes: resolveIds(project.themes, getResearchTheme).map((t) => ({
      id: t.id,
      slug: t.slug,
      title: t.title,
      href: `/research/${t.slug}`,
    })),
    awards: awardsForProject(project).map((a) => ({ id: a.id, title: awardName(a), year: a.year })),
    content: [
      { heading: 'Overview', body: project.abstract ?? '' },
      ...contentSections(project.content),
    ].filter((section) => section.body),
    metaItems,
  }
}

export function toSpotlightProject(project: Project): SpotlightProject {
  const [award] = awardsForProject(project)
  return {
    title: project.title,
    localName: project.localName ?? null,
    description: project.abstract ?? '',
    href: `/projects/${project.slug}`,
    badge: award ? awardName(award) : (themeTitles(project)[0] ?? 'Project'),
    image: project.heroImage ?? PLACEHOLDER_IMAGE,
  }
}

// ─── Team ───────────────────────────────────────────────────────────────────

const socialUrl = (member: Team, platform: string) =>
  member.socials?.find((s) => s.platform === platform)?.url

function affiliationName(member: Team): string {
  const org = member.affiliation ? getOrganization(member.affiliation) : undefined
  return member.affiliationLabel ?? org?.name ?? ''
}

function shortAffiliation(member: Team): string {
  const org = member.affiliation ? getOrganization(member.affiliation) : undefined
  return org?.shortName ?? affiliationName(member)
}

export function toTeamGridMember(member: Team): TeamGridMember {
  return {
    name: member.name,
    slug: member.slug,
    title: member.title,
    affiliation: shortAffiliation(member),
    badge: member.rosterSection === 'emerging' ? 'Emerging' : undefined,
    interests: member.researchInterests ?? undefined,
    scholar: socialUrl(member, 'google-scholar'),
    site: socialUrl(member, 'website'),
  }
}

/** The People page's groups, derived from roles and roster sections. */
export function peopleGroups() {
  const visible = publicTeam()
  const in_ = (section: Team['rosterSection']) => (m: Team) =>
    !isAlumni(m) && m.role !== 'director' && m.rosterSection === section
  return {
    facultyStaff: visible.filter(in_('researchers')).map(toTeamGridMember),
    graduateRAs: visible.filter(in_('graduate')).map(toTeamGridMember),
    undergraduateRAs: [
      ...visible.filter(in_('undergraduate')),
      ...visible.filter(in_('emerging')),
    ].map(toTeamGridMember),
    collaborators: visible.filter(isCollaborator).map(toTeamGridMember),
  }
}

export function toAlumni(member: Team): Alumni {
  return {
    name: member.name,
    currentPosition: member.currentPosition ?? undefined,
    alumniYear: member.alumniYear ?? undefined,
  }
}

export const alumniList = (): Alumni[] => publicTeam().filter(isAlumni).map(toAlumni)

const MEMBER_ROLE: Record<Team['role'], MemberProfileData['role']> = {
  director: 'director',
  faculty: 'faculty',
  'graduate-ra': 'graduate-ra',
  'undergraduate-ra': 'undergrad-ra',
  alumni: 'alumni',
  'interdisciplinary-collaborator': 'research-staff',
  'external-collaborator': 'research-staff',
}

const SOCIAL_PLATFORM: Record<string, Social['platform']> = {
  'google-scholar': 'google-scholar',
  linkedin: 'linkedin',
  github: 'github',
  x: 'x',
  website: 'personal-site',
}

export function toMemberProfile(member: Team): MemberProfileData {
  const org = member.affiliation ? getOrganization(member.affiliation) : undefined
  const title = isAlumni(member) && member.currentPosition
    ? `${member.currentPosition} · formerly ${member.title}`
    : member.title
  return {
    name: member.name,
    title,
    role:
      member.rosterSection === 'researchers' && member.role === 'graduate-ra'
        ? 'research-staff'
        : MEMBER_ROLE[member.role],
    affiliation: { name: affiliationName(member), url: org?.url ?? undefined },
    photo: member.photo ?? undefined,
    bio: member.bio ?? '',
    researchInterests: member.researchInterests ?? [],
    email: member.email ?? undefined,
    orcid: member.orcid ?? undefined,
    socials: (member.socials ?? []).flatMap((s) =>
      SOCIAL_PLATFORM[s.platform] ? [{ platform: SOCIAL_PLATFORM[s.platform], url: s.url }] : [],
    ),
    awards: awardsForTeamMember(member.id).map((a) => ({ title: `${awardName(a)} · ${a.year}` })),
  }
}

/** A Grant as the member page lists it. */
export function toMemberGrant(g: Grant, teamId: string) {
  return {
    id: g.id,
    title: g.title,
    funder: grantFunderName(g),
    yearStart: grantStartYear(g),
    yearEnd: grantEndYear(g),
    role: grantRoleFor(g, teamId),
  }
}

export function toPIProfile(): PIProfileData | null {
  const pi = director()
  if (!pi) return null
  return {
    name: pi.name,
    title: pi.title,
    photo: pi.photo ?? null,
    bio: pi.bio ?? null,
    awards: awardsForTeamMember(pi.id)
      .filter((a) => a.featured)
      .map((a) => [awardName(a), [a.organizationLabel, a.year].filter(Boolean).join(' ')].join(' · ')),
    scholarUrl: socialUrl(pi, 'google-scholar') ?? null,
    email: pi.email ?? null,
    profileHref: `/people/${pi.slug}`,
  }
}

// ─── Awards ─────────────────────────────────────────────────────────────────

const AWARD_CATEGORIES: AwardCategory[] = [
  'best-paper',
  'best-poster',
  'honorable-mention',
  'impact',
  'research-grant',
  'fellowship',
  'recognition',
  'competition',
  'scholarship',
  'other',
]

export function toAwardRow(award: Award): AwardRow {
  const recipients = awardRecipientNames(award)
  const category = AWARD_CATEGORIES.find((c) => c === award.category) ?? 'other'
  return {
    title: awardName(award),
    year: award.year,
    category,
    organization:
      award.organizationLabel ??
      (award.organization ? getOrganization(award.organization)?.name : undefined) ??
      '—',
    linkedPublication: awardPublication(award)?.title ?? awardedPaperTitle(award) ?? undefined,
    recipients: recipients.team,
    externalRecipients: recipients.external.length ? recipients.external.join(', ') : undefined,
    isFeatured: award.featured ?? false,
  }
}

// ─── News ───────────────────────────────────────────────────────────────────

export function toNewsEntry(item: News): NewsEntry {
  return {
    type: item.type,
    date: item.date,
    datePrecision: item.datePrecision ?? undefined,
    title: item.title,
    description: item.description,
    photo: item.photo ?? undefined,
    url: item.url ?? undefined,
  }
}

export const newsEntries = (): NewsEntry[] => news.map(toNewsEntry)

// ─── Research Themes ────────────────────────────────────────────────────────

/** Collaborators on a theme: collaborator-role Team Members on its Projects, by affiliation. */
export function themeCollaboratorGroups(themeId: string): CollaboratorGroup[] {
  const people = new Map<string, Team>()
  for (const project of projectsByTheme(themeId)) {
    for (const member of resolveIds(project.teamMembers, getTeamMember)) {
      if (isCollaborator(member) && member.displayInWebsite !== false) people.set(member.id, member)
    }
  }
  const groups = new Map<string, CollaboratorGroup>()
  for (const member of people.values()) {
    const institution = affiliationName(member) || 'Independent'
    const group = groups.get(institution) ?? { institution, collaborators: [] }
    group.collaborators.push({ name: member.name, role: member.title })
    groups.set(institution, group)
  }
  return [...groups.values()]
}

export function toRelatedTheme(theme: ResearchTheme): RelatedTheme {
  return { name: theme.title, slug: theme.slug, description: theme.shortDescription ?? '' }
}

// ─── Navigation ─────────────────────────────────────────────────────────────

/** Everything the (client) navbar shows, computed on the server. */
export function getNavData(): NavData {
  const stats = labStats()
  const visible = publicTeam()
  const pi = director()
  const featuredLab = labAwards().filter((a) => a.featured)
  const [headline] = featuredLab
  const minYear = stats.awardYears?.min

  const awarded = projects.filter((p) => (p.awards?.length ?? 0) > 0)
  const featured = featuredProjects()
  const card = (project: Project) => {
    const [award] = awardsForProject(project)
    return {
      id: project.id,
      title: project.title,
      description: award ? `${awardName(award)} · ${award.year}` : (themeTitles(project)[0] ?? ''),
      href: `/projects/${project.slug}`,
    }
  }
  const countIn = (section: Team['rosterSection']) =>
    visible.filter((m) => !isAlumni(m) && m.rosterSection === section).length

  return {
    researchThemes: researchThemes.map((t) => ({
      id: t.id,
      title: t.title,
      slug: t.slug,
      description: t.shortDescription ?? '',
    })),
    awardedProjects: awarded.slice(0, 3).map((p) => {
      const [award] = awardsForProject(p)
      return { id: p.id, title: p.title, slug: p.slug, award: `${awardName(award)} · ${award.year}` }
    }),
    projectCategories: [
      { title: 'Featured Projects', projects: featured.slice(0, 3).map(card) },
      { title: 'More Projects', projects: featured.slice(3, 6).map(card) },
    ].filter((category) => category.projects.length > 0),
    headlineAward: headline
      ? {
          title: awardName(headline),
          body: `${headline.organizationLabel ?? ''} ${headline.year} — one of ${stats.labAwards} Lab honours${
            minYear ? ` since ${minYear}` : ''
          }.`.trim(),
        }
      : null,
    publicationRecognition: featuredLab.slice(0, 5).map((a) => ({
      id: a.id,
      title: awardName(a),
      body: `${a.organizationLabel ?? ''} · ${a.year}`,
      href: '/awards',
    })),
    teamCategories: [
      { id: 'graduate', title: 'Graduate Research Assistants', description: `${countIn('graduate')} active researchers at NSU`, href: '/people' },
      { id: 'undergraduate', title: 'Undergraduate Assistants', description: `${countIn('undergraduate')} student researchers at NSU`, href: '/people' },
      { id: 'emerging', title: 'Emerging Researchers', description: `${countIn('emerging')} early-career lab members`, href: '/people' },
      { id: 'everyone', title: 'Meet Everyone', description: 'Full team directory', href: '/people' },
    ],
    alumniTeaser: visible
      .filter((m) => isAlumni(m) && m.currentPosition)
      .sort((a, b) => (b.alumniYear ?? 0) - (a.alumniYear ?? 0))
      .slice(0, 4)
      .map((m) => ({ name: m.name, placement: m.currentPosition ?? '' })),
    alumniCount: stats.alumni,
    pi: pi ? { name: pi.name, title: pi.title, photo: pi.photo ?? null } : null,
  }
}

