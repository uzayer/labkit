/**
 * Record → view-model mappers: the small, page-shaped layer the Payload port
 * will keep. Each function turns records (./index.ts) into the flat props a
 * component already expects, so porting a page means replacing the record
 * source, not the component. Server-side only; pages pass the results down.
 */
import type { Alumni } from '@/components/dial/alumni-grid'
import type { AwardListItem } from '@/components/dial/award-list'
import type { Award as AwardRow, AwardCategory } from '@/components/dial/awards-filter-table'
import type { ResearchProject } from '@/components/dial/feature295'
import type { MemberProfileData, Social } from '@/components/dial/member-profile'
import type { NavData } from '@/components/dial/navbar4'
import type { NewsPostData } from '@/components/dial/news-post'
import type { NewsEntry } from '@/lib/dial/news'
import type { Person } from '@/components/dial/person-chip'
import type { PIProfileData } from '@/components/dial/pi-profile'
import type { ProjectData } from '@/components/dial/project-post'
import type { ProjectEntry } from '@/components/dial/project-index'
import type { PublicationPostData } from '@/components/dial/publication-post'
import type {
  Publication as PublicationView,
  PublicationYear,
} from '@/components/dial/publications1'
import type { SpotlightProject } from '@/components/dial/research-sections'
import type { TeamMember as TeamGridMember } from '@/components/dial/team5-9'
import type { VenueLedgerEntry } from '@/components/dial/venue-ledger'
import type { CollaboratorGroup, RelatedTheme } from '@/components/dial/theme-page-sections'

import type { DialData } from './index'
import type { Award, Grant, News, Project, Publication, ResearchTheme, Team } from './types'
import {
  baseCitationKey,
  formatCitations,
  type CitationAuthor,
  type CitationInput,
  type Citations,
} from '@/lib/dial/cite'

export function createDialViews(d: DialData) {
  const {
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
    getVenue,
    grantEndYear,
    grantFunderName,
    grantRoleFor,
    grantStartYear,
    grantsForProject,
    isAlumni,
    isCollaboration,
    isCollaborator,
    labAwards,
    labInfo,
    labStats,
    news,
    projects,
    projectsByTheme,
    projectsForPublication,
    publicationsForProject,
    relatedPublications,
    publicTeam,
    publicationAuthorNames,
    publicationsByYear,
    publicationTeamIds,
    publicationThemeIds,
    publications,
    researchThemes,
    resolveIds,
    teamIdForName,
    venueFullName,
    venueLabel,
    venueRecords,
  } = d

  const PLACEHOLDER_IMAGE =
    'https://deifkwefumgah.cloudfront.net/shadcnblocks/block/placeholder-dark-1.svg'

  // ─── Publications ───────────────────────────────────────────────────────────

  /** The Lab PI's name, emphasised in author lists. */
  const highlightAuthors = (): string[] => {
    const pi = director()
    return pi ? [pi.name] : []
  }

  /**
   * The Lab's own people among a publication's authors, in author order, for the
   * row's faces. Only Team Members the site may show: an unreviewed imported
   * person has no business appearing on a public page.
   */
  function publicationFaces(pub: Publication): Person[] {
    return publicationTeamIds(pub)
      .map((id) => getTeamMember(id))
      .filter((m): m is Team => m !== undefined && m.displayInWebsite !== false)
      .map((m) => ({ name: m.name, seed: m.slug, photo: m.photo, href: `/people/${m.slug}` }))
  }

  /** Short award label for a publication badge, e.g. "Best Paper". */
  function publicationAwardLabel(pub: Publication): string | null {
    const [award] = awardsForPublication(pub)
    return award ? awardName(award) : null
  }

  function toPublicationView(pub: Publication): PublicationView {
    const [project] = projectsForPublication(pub.id)
    return {
      id: pub.id,
      title: pub.title,
      href: `/publications/${pub.id}`,
      authors: publicationAuthorNames(pub).join(', '),
      authorFaces: publicationFaces(pub),
      venue: venueLabel(pub),
      venueFull: venueFullName(pub),
      award: publicationAwardLabel(pub),
      pdfLink: pub.pdf?.link ?? null,
      projectLink: project ? `/projects/${project.slug}` : null,
      doi: pub.doi ?? null,
      themes: publicationThemeIds(pub)
        .map((id) => getResearchTheme(id)?.title)
        .filter((title): title is string => Boolean(title)),
      isOpenAccess: pub.isOpenAccess ?? null,
      isCollaboration: isCollaboration(pub),
      type: pub.type ?? null,
    }
  }

  /** Publications grouped by year, newest first, in the shape PublicationsSection takes. */
  function toPublicationYears(pubs: Publication[]): PublicationYear[] {
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

  const TYPE_LABELS: Record<string, string> = {
    conference: 'Conference Paper',
    journal: 'Journal Article',
    workshop: 'Workshop Paper',
    preprint: 'Preprint',
    'extended-abstract': 'Extended Abstract',
    'study-protocol': 'Study Protocol',
    'book-chapter': 'Book Chapter',
  }

  /** Printed only where it is not the plain case; "published" needs no saying. */
  const STATUS_LABELS: Record<string, string> = {
    'accepted-in-press': 'Accepted, in press',
    submitted: 'Under review',
    preprint: 'Preprint',
  }

  /** The Team Member an author entry names, when the record safely matches one. */
  function authorTeamMember(author: Publication['authors'][number]): Team | undefined {
    const id = author.teamMember ?? teamIdForName(author.customAuthor?.name)
    return id ? getTeamMember(id) : undefined
  }

  /** The record's authors as the citation generator takes them. */
  function citationAuthors(pub: Publication): CitationAuthor[] {
    return pub.authors.flatMap((author): CitationAuthor[] => {
      const member = author.teamMember ? getTeamMember(author.teamMember) : undefined
      if (member) {
        const given = [member.firstName, member.middleName].filter(Boolean).join(' ')
        return [{ given, family: member.lastName }]
      }
      const name = author.customAuthor?.name
      return name ? [{ name }] : []
    })
  }

  /**
   * BibTeX keys, unique across the Lab's publications. Two papers that would
   * share "rony2024understanding" both take a letter, oldest first, the way
   * Google Scholar and biblatex do — so a reader citing both gets two entries,
   * and neither key changes when a third, unrelated paper is added.
   */
  let citationKeys: Map<string, string> | undefined
  function citationKeyFor(pub: Publication): string {
    if (!citationKeys) {
      const groups = new Map<string, Publication[]>()
      for (const p of publications) {
        const key = baseCitationKey({ title: p.title, year: p.year, authors: citationAuthors(p) })
        groups.set(key, [...(groups.get(key) ?? []), p])
      }
      citationKeys = new Map()
      for (const [key, group] of groups) {
        if (group.length === 1) {
          citationKeys.set(group[0].id, key)
          continue
        }
        group
          .sort(
            (a, b) =>
              (a.publicationDate ?? '').localeCompare(b.publicationDate ?? '') ||
              a.title.localeCompare(b.title),
          )
          .forEach((p, i) => citationKeys!.set(p.id, key + String.fromCharCode(97 + i)))
      }
    }
    return citationKeys.get(pub.id) ?? ''
  }

  /**
   * A paper's citations, generated from the record. A Team Member author is
   * cited from their structured name; anyone else from the name as printed.
   */
  function citationsFor(pub: Publication): Citations {
    const venue = pub.venue ? getVenue(pub.venue) : undefined
    const input: CitationInput = {
      id: pub.id,
      key: citationKeyFor(pub) || undefined,
      title: pub.title,
      authors: citationAuthors(pub),
      type: pub.type ?? venue?.type ?? null,
      container: venue?.name ?? pub.venueLabel ?? null,
      containerShort: venue?.shortName && venue.shortName !== venue.name ? venue.shortName : null,
      year: pub.year,
      date: pub.publicationDate,
      volume: pub.volume,
      issue: pub.issue,
      pageStart: pub.pageStart,
      pageEnd: pub.pageEnd,
      publisher: pub.publisher,
      location: pub.location,
      doi: pub.doi,
      url: pub.externalUrl,
      status: pub.status === 'published' ? null : pub.status,
    }
    return formatCitations(input)
  }

  /** One paper's own page: the record, plus the links out of it. */
  function toPublicationPost(pub: Publication): PublicationPostData {
    const venue = pub.venue ? getVenue(pub.venue) : undefined

    return {
      title: pub.title,
      year: pub.year,
      typeLabel: pub.type ? (TYPE_LABELS[pub.type] ?? null) : null,
      statusLabel: STATUS_LABELS[pub.status] ?? null,
      authors: pub.authors.map((author, i) => {
        const member = authorTeamMember(author)
        // Only people the site actually shows get a link; a hidden or
        // collaborator-only record is still just a name in the byline.
        const linked = member && member.displayInWebsite !== false && !isCollaborator(member)
        return {
          id: member?.id ?? `${pub.id}-author-${i}`,
          name: member?.name ?? author.customAuthor?.name ?? '',
          href: linked ? `/people/${member.slug}` : null,
          role: linked ? teamRoleLabel(member) : null,
          photo: linked ? (member.photo ?? null) : null,
        }
      }),
      venue: venue
        ? { name: venue.name, shortName: venue.shortName ?? null, url: venue.url ?? null }
        : pub.venueLabel
          ? { name: pub.venueLabel }
          : null,
      abstract: pub.abstract ?? null,
      citations: citationsFor(pub),
      doi: pub.doi ?? null,
      externalUrl: pub.externalUrl ?? null,
      pdfLink: pub.pdf?.link ?? null,
      isOpenAccess: pub.isOpenAccess ?? false,
      themes: publicationThemeIds(pub)
        .map(getResearchTheme)
        .filter((theme): theme is ResearchTheme => Boolean(theme))
        .map((theme) => ({
          id: theme.id,
          slug: theme.slug,
          title: theme.title,
          href: `/research/${theme.slug}`,
        })),
      projects: projectsForPublication(pub.id).map((project) => ({
        id: project.id,
        slug: project.slug,
        title: project.title,
        href: `/projects/${project.slug}`,
      })),
      awards: awardsForPublication(pub).map((award) => ({
        id: award.id,
        title: awardName(award),
        year: award.year,
        organization:
          award.organizationLabel ??
          (award.organization ? (getOrganization(award.organization)?.name ?? null) : null),
      })),
      related: toPublicationYears(relatedPublications(pub)),
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

  function toProjectEntry(project: Project): ProjectEntry {
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

  function toResearchProject(project: Project): ResearchProject {
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
  function contentSections(
    content: string | null | undefined,
  ): { heading: string; body: string }[] {
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

  /**
   * The heading a project's team is filed under. Coarser than a person's title on
   * purpose: the aside is scanned by role, and eleven slightly different titles
   * make eleven headings of one. In the order the aside prints them.
   */
  const TEAM_GROUPS = [
    'Principal Investigator',
    'Faculty',
    'Researchers',
    'Collaborators',
    'Alumni',
  ] as const

  function teamGroup(member: Team): (typeof TEAM_GROUPS)[number] {
    if (member.role === 'director') return 'Principal Investigator'
    if (member.role === 'faculty') return 'Faculty'
    if (isAlumni(member)) return 'Alumni'
    if (isCollaborator(member)) return 'Collaborators'
    return 'Researchers'
  }

  function toProjectPost(project: Project): ProjectData {
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
      heroImageAlt: project.heroImageAlt ?? undefined,
      startDate: project.startDate ?? undefined,
      endDate: project.endDate ?? undefined,
      status: project.status ?? null,
      teamMembers: [...team]
        .sort((a, b) => TEAM_GROUPS.indexOf(teamGroup(a)) - TEAM_GROUPS.indexOf(teamGroup(b)))
        .map((m) => ({
          id: m.id,
          name: m.name,
          role: teamRoleLabel(m),
          group: teamGroup(m),
          avatarUrl: m.photo ?? undefined,
          slug: m.slug,
          // Every Team Member the site may show has a profile page.
          href: `/people/${m.slug}`,
        })),
      themes: resolveIds(project.themes, getResearchTheme).map((t) => ({
        id: t.id,
        slug: t.slug,
        title: t.title,
        href: `/research/${t.slug}`,
      })),
      awards: awardsForProject(project).map((a) => ({
        id: a.id,
        title: awardName(a),
        year: a.year,
      })),
      publications: toPublicationYears(publicationsForProject(project)),
      content: [
        { heading: 'Overview', body: project.abstract ?? '' },
        ...contentSections(project.content),
      ].filter((section) => section.body),
      trace:
        project.slug === 'protibadi'
          ? {
              heading: 'From a place to ask for help to a device that can respond in the moment.',
              steps: [
                {
                  label: 'Starting point',
                  detail: 'A website designed to support women facing sexual harassment.',
                },
                {
                  label: 'Material outcome',
                  detail:
                    'A low-cost wearable designed to work through available connections, from Bluetooth to cellular and cloud networks.',
                },
                {
                  label: 'Research context',
                  detail: 'Bangladesh, with later exploration in India and Pakistan.',
                },
              ],
            }
          : undefined,
      metaItems,
    }
  }

  function toSpotlightProject(project: Project): SpotlightProject {
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

  /**
   * The affiliation only when it is somewhere other than the Lab's own
   * institution. DIAL sits inside NSU, so "NSU" beside a name says nothing; the
   * tag is there to mark the people who come from elsewhere.
   */
  function externalAffiliation(member: Team): string | null {
    if (affiliationName(member).toLowerCase() === labInfo.institution.toLowerCase()) return null
    return shortAffiliation(member) || null
  }

  function toTeamGridMember(member: Team): TeamGridMember {
    return {
      name: member.name,
      slug: member.slug,
      title: member.title,
      affiliation: externalAffiliation(member) ?? '',
      badge: member.rosterSection === 'emerging' ? 'Emerging' : undefined,
      interests: member.researchInterests ?? undefined,
      scholar: socialUrl(member, 'google-scholar'),
      site: socialUrl(member, 'website'),
      photo: member.photo ?? undefined,
    }
  }

  /** The People page's groups, derived from roles and roster sections. */
  function peopleGroups() {
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

  function toAlumni(member: Team): Alumni {
    return {
      name: member.name,
      slug: member.slug,
      photo: member.photo ?? undefined,
      currentPosition: member.currentPosition ?? undefined,
      alumniYear: member.alumniYear ?? undefined,
    }
  }

  const alumniList = (): Alumni[] => publicTeam().filter(isAlumni).map(toAlumni)

  const MEMBER_ROLE: Record<Team['role'], MemberProfileData['role']> = {
    director: 'director',
    faculty: 'faculty',
    'research-staff': 'research-staff',
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

  function toMemberProfile(member: Team): MemberProfileData {
    const org = member.affiliation ? getOrganization(member.affiliation) : undefined
    const title =
      isAlumni(member) && member.currentPosition
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
      awards: awardsForTeamMember(member.id).map(toAwardListItem),
    }
  }

  /** A Grant as the member page lists it. */
  function toMemberGrant(g: Grant, teamId: string) {
    return {
      id: g.id,
      title: g.title,
      funder: grantFunderName(g),
      yearStart: grantStartYear(g),
      yearEnd: grantEndYear(g),
      role: grantRoleFor(g, teamId),
    }
  }

  /**
   * An Award as a person's page lists it, in parts rather than one joined line,
   * so the list can set name, body, year and paper each in its own place. The
   * paper links to its page when it is in the record.
   */
  function toAwardListItem(award: Award): AwardListItem {
    const pub = awardPublication(award)
    const paperTitle = pub?.title ?? awardedPaperTitle(award)
    return {
      name: awardName(award),
      organization:
        award.organizationLabel ??
        (award.organization ? getOrganization(award.organization)?.name : null) ??
        null,
      year: award.year,
      category: award.category ?? null,
      paper: paperTitle
        ? { title: paperTitle, href: pub ? `/publications/${pub.id}` : null }
        : null,
    }
  }

  function toPIProfile(): PIProfileData | null {
    const pi = director()
    if (!pi) return null
    return {
      name: pi.name,
      title: pi.title,
      photo: pi.photo ?? null,
      photoAlt: pi.photoAlt ?? null,
      bio: pi.bio ?? null,
      awards: awardsForTeamMember(pi.id)
        .filter((a) => a.featured)
        .map(toAwardListItem),
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

  function toAwardRow(award: Award): AwardRow {
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

  function toNewsEntry(item: News): NewsEntry {
    return {
      slug: item.slug,
      type: item.type,
      date: item.date,
      datePrecision: item.datePrecision ?? undefined,
      title: item.title,
      description: item.description,
      photo: item.photo ?? undefined,
      photoAlt: item.photoAlt ?? undefined,
      url: item.url ?? undefined,
    }
  }

  const newsEntries = (): NewsEntry[] => news.map(toNewsEntry)

  /**
   * One news entry with its neighbours in the archive. News records carry no
   * relationships, so "what else" is the archive either side of this date — the
   * honest adjacency, not an invented topical one.
   */
  function toNewsPost(slug: string): NewsPostData | null {
    const entry = news.find((item) => item.slug === slug)
    if (!entry) return null
    // Newest first, which is the order the archive prints in.
    const ordered = [...news].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
    )
    const i = ordered.findIndex((item) => item.slug === slug)
    const neighbour = (n: News | undefined) =>
      n ? { slug: n.slug, title: n.title, type: n.type } : null
    return {
      entry: toNewsEntry(entry),
      newer: neighbour(ordered[i - 1]),
      older: neighbour(ordered[i + 1]),
    }
  }

  // ─── Research Themes ────────────────────────────────────────────────────────

  /** Collaborators on a theme: collaborator-role Team Members on its Projects, by affiliation. */
  function themeCollaboratorGroups(themeId: string): CollaboratorGroup[] {
    const people = new Map<string, Team>()
    for (const project of projectsByTheme(themeId)) {
      for (const member of resolveIds(project.teamMembers, getTeamMember)) {
        if (isCollaborator(member) && member.displayInWebsite !== false)
          people.set(member.id, member)
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

  function toRelatedTheme(theme: ResearchTheme): RelatedTheme {
    return { name: theme.title, slug: theme.slug, description: theme.shortDescription ?? '' }
  }

  // ─── Navigation ─────────────────────────────────────────────────────────────

  /** Everything the (client) navbar shows, computed on the server. */
  function getNavData(): NavData {
    const stats = labStats()
    const visible = publicTeam()
    const pi = director()
    const featuredLab = labAwards().filter((a) => a.featured)

    const featured = featuredProjects()
    const card = (project: Project) => {
      const [award] = awardsForProject(project)
      return {
        id: project.id,
        title: project.title,
        description: award
          ? `${awardName(award)} · ${award.year}`
          : (themeTitles(project)[0] ?? ''),
        href: `/projects/${project.slug}`,
      }
    }

    // Current lab members, in roster order. A portrait where Media has one,
    // otherwise the printed initial (PersonChip). The menu is an overview, not
    // the roster: each column prints its first few and counts the rest.
    const MENU_ROSTER_LIMIT = 4
    const current = (section: Team['rosterSection']) =>
      visible
        .filter((m) => !isAlumni(m) && m.role !== 'director' && m.rosterSection === section)
        .map((m) => ({
          name: m.name,
          slug: m.slug,
          photo: m.photo ?? null,
          role: externalAffiliation(m),
        }))
    const rosterGroup = (title: string, people: ReturnType<typeof current>) => ({
      title,
      people: people.slice(0, MENU_ROSTER_LIMIT),
      more: Math.max(0, people.length - MENU_ROSTER_LIMIT),
    })

    const pubs = publicationsByYear()
    const years = pubs.map((p) => p.year).filter(Number.isFinite)

    return {
      researchThemes: researchThemes.map((t) => ({
        id: t.id,
        title: t.title,
        slug: t.slug,
        description: t.shortDescription ?? '',
      })),
      projectCategories: [
        { title: 'Featured Projects', projects: featured.slice(0, 3).map(card) },
        { title: 'More Projects', projects: featured.slice(3, 6).map(card) },
      ].filter((category) => category.projects.length > 0),
      projectCount: projects.length,

      // Real papers, not query-param links back to the same page: the menu can
      // show what the list contains, which the list's own filter bar cannot.
      recentPublications: pubs.slice(0, 5).map((pub) => {
        const [award] = awardsForPublication(pub)
        return {
          id: pub.id,
          title: pub.title,
          venue: venueLabel(pub) ?? '',
          year: pub.year,
          href: `/publications/${pub.id}`,
          award: award ? awardName(award) : null,
        }
      }),
      publicationCount: pubs.length,
      publicationYears: years.length ? `${Math.min(...years)}–${Math.max(...years)}` : '',
      publicationRecognition: featuredLab.slice(0, 4).map((a) => ({
        id: a.id,
        title: awardName(a),
        body: `${a.organizationLabel ?? ''} · ${a.year}`.replace(/^ · /, ''),
        href: '/awards',
      })),

      pi: pi
        ? {
            name: pi.name,
            title: pi.title,
            photo: pi.photo ?? null,
            photoAlt: pi.photoAlt ?? null,
            href: `/people/${pi.slug}`,
          }
        : null,
      rosterGroups: [
        rosterGroup('Faculty & research staff', current('researchers')),
        rosterGroup('Graduate researchers', current('graduate')),
        rosterGroup('Undergraduate researchers', [
          ...current('undergraduate'),
          ...current('emerging'),
        ]),
      ].filter((group) => group.people.length > 0),
      teamCount: visible.filter((m) => !isAlumni(m)).length,
      alumniTeaser: visible
        .filter((m) => isAlumni(m) && m.currentPosition)
        .sort((a, b) => (b.alumniYear ?? 0) - (a.alumniYear ?? 0))
        .slice(0, 4)
        .map((m) => ({ name: m.name, placement: m.currentPosition ?? '' })),
      alumniCount: stats.alumni,
    }
  }

  // ─── Venues ─────────────────────────────────────────────────────────────────

  /**
   * The Lab's top venues as ledger entries, most-published first: the prestige
   * signal on /about and /research.
   */
  function topVenueEntries(limit = 6): VenueLedgerEntry[] {
    return venueRecords(limit).map(({ venue, publicationCount, years, awards }) => ({
      shortName: venue.shortName ?? venue.name,
      name: venue.name,
      type: venue.type,
      publicationCount,
      years: years
        ? years.min === years.max
          ? String(years.min)
          : `${years.min}–${years.max}`
        : null,
      awards: awards.map((a) => `${awardName(a)}, ${a.year}`),
    }))
  }

  return {
    highlightAuthors,
    citationsFor,
    toPublicationView,
    toPublicationYears,
    toPublicationPost,
    toProjectEntry,
    toResearchProject,
    toProjectPost,
    toSpotlightProject,
    toTeamGridMember,
    peopleGroups,
    toAlumni,
    alumniList,
    toMemberProfile,
    toMemberGrant,
    toPIProfile,
    toAwardRow,
    toNewsEntry,
    newsEntries,
    toNewsPost,
    themeCollaboratorGroups,
    toRelatedTheme,
    getNavData,
    topVenueEntries,
  }
}

export type DialViews = ReturnType<typeof createDialViews>
