import { themeArt, themeInk } from '@/components/dial/theme-marks'

import type { OgCard, PressInk } from './og-image'
import { getDial } from '@/lib/dial/data/get'

/**
 * What each route's Open Graph card says, read by that route's
 * `opengraph-image.tsx`. Each composition matches the one on that page's own
 * header, and every count is computed from the same records the page prints,
 * so a card cannot go stale on its own.
 */

const plural = (n: number, word: string) => `${n} ${word}${n === 1 ? '' : 's'}`

export const siteCard: OgCard = {
  eyebrow: 'North South University · Dhaka',
  title: 'Design Inclusion & Access Lab',
  art: 'bloom',
  logo: true,
}

// ─── Detail pages ────────────────────────────────────────────────────────────

export async function publicationCard(id: string): Promise<OgCard | undefined> {
  const d = await getDial()
  const pub = d.getPublication(id)
  if (!pub) return undefined
  return {
    eyebrow: ['Publication', pub.year, d.venueLabel(pub)].filter(Boolean).join(' · '),
    title: pub.title,
    art: 'strata',
  }
}

export async function personCard(slug: string): Promise<OgCard | undefined> {
  const d = await getDial()
  const member = d.getTeamMemberBySlug(slug)
  if (!member || member.displayInWebsite === false) return undefined
  return { eyebrow: 'People', title: member.name, description: member.title, art: 'bloom' }
}

export async function projectCard(slug: string): Promise<OgCard | undefined> {
  const d = await getDial()
  const project = d.getProjectBySlug(slug)
  if (!project) return undefined
  return { eyebrow: 'Project', title: project.title, description: project.abstract, art: 'field' }
}

export async function newsCard(slug: string): Promise<OgCard | undefined> {
  const d = await getDial()
  const post = d.toNewsPost(slug)
  if (!post) return undefined
  return {
    eyebrow: 'News',
    title: post.entry.title,
    description: post.entry.description,
    art: 'signal',
  }
}

/** A Research Theme, printed in its own ink with its own glyph, as its page is. */
export async function themeCard(slug: string): Promise<OgCard | undefined> {
  const d = await getDial()
  const theme = d.getResearchThemeBySlug(slug)
  if (!theme) return undefined
  const stats = d.themeStats(theme.id)
  const counts = [
    stats.projects && plural(stats.projects, 'project'),
    stats.publications && plural(stats.publications, 'publication'),
  ].filter(Boolean)
  return {
    eyebrow: ['Research Theme', ...counts].join(' · '),
    title: theme.title,
    description: theme.shortDescription,
    art: themeArt(theme.slug),
    ink: themeInk(theme.slug) as PressInk,
    glyph: theme.slug,
  }
}

// ─── Index and prose pages ───────────────────────────────────────────────────

export async function aboutCard(): Promise<OgCard> {
  const d = await getDial()
  return {
    eyebrow: 'About DIAL',
    title: 'HCI research from the margins, built with the people it serves.',
    description: `An HCI lab at ${d.labInfo.institution}, Dhaka, founded in ${d.labInfo.foundedYear}.`,
    art: 'orbit',
  }
}

export async function researchCard(): Promise<OgCard> {
  const d = await getDial()
  const stats = d.labStats()
  return {
    eyebrow: `Research · ${plural(d.researchThemes.length, 'theme')} · ${plural(stats.projects, 'project')}`,
    title: 'Research at the margins',
    description:
      'Access, inclusion, safety, wellbeing, and development in low-resource settings, studied and built with the people expected to use it.',
    art: 'orbit',
  }
}

export async function projectsCard(): Promise<OgCard> {
  const d = await getDial()
  const ongoing = d.projects.filter((p) => p.status === 'ongoing').length
  return {
    eyebrow: `Research · ${plural(d.projects.length, 'project')} · ${ongoing} ongoing`,
    title: 'Projects',
    description:
      'Every DIAL project, from participatory fieldwork to low-cost hardware, with the people, publications, and awards behind each one.',
    art: 'field',
  }
}

export async function publicationsCard(): Promise<OgCard> {
  const d = await getDial()
  const stats = d.labStats()
  const years = stats.publicationYears
  return {
    eyebrow: [
      'Research',
      plural(stats.publications, 'publication'),
      years && `${years.min}–${years.max}`,
    ]
      .filter(Boolean)
      .join(' · '),
    title: 'Publications',
    description:
      'Peer-reviewed papers, extended abstracts, and preprints from DIAL, with links to each paper and its citation.',
    art: 'strata',
  }
}

export async function peopleCard(): Promise<OgCard> {
  const d = await getDial()
  const stats = d.labStats()
  return {
    eyebrow: `Lab · ${stats.researchersMentored} researchers mentored`,
    title: 'People',
    description:
      "The faculty, research assistants, and collaborators who run DIAL's fieldwork and write its papers, and the alumni who have moved on.",
    art: 'bloom',
  }
}

export async function newsIndexCard(): Promise<OgCard> {
  const d = await getDial()
  return {
    eyebrow: `Lab · ${plural(d.news.length, 'entry')}`.replace('entrys', 'entries'),
    title: 'News',
    description:
      'Conference trips, invited talks, hosted events, and community work: the lab activity behind the papers.',
    art: 'signal',
  }
}

export async function awardsCard(): Promise<OgCard> {
  const d = await getDial()
  const awards = d.labAwards()
  const bestPapers = awards.filter((a) => a.category === 'best-paper').length
  return {
    eyebrow: [
      'Recognition',
      plural(awards.length, 'award'),
      bestPapers && plural(bestPapers, 'best paper'),
    ]
      .filter(Boolean)
      .join(' · '),
    title: 'Awards',
    description: "Recognition for DIAL's work at international academic venues.",
    art: 'signal',
  }
}

export function joinCard(): OgCard {
  return {
    eyebrow: 'Join the lab · Open year-round',
    title: 'No prerequisites. Just curiosity.',
    description:
      'Graduate and undergraduate students at NSU: write to the lab about what draws you to HCI research.',
    art: 'signal',
  }
}

export async function contactCard(): Promise<OgCard> {
  const d = await getDial()
  return {
    eyebrow: 'Contact',
    title: 'Get in touch',
    description: d.labInfo.address ?? `${d.labInfo.institution}, Dhaka`,
    art: 'orbit',
  }
}

export function designSystemCard(): OgCard {
  return {
    eyebrow: 'Design system',
    title: 'DIAL design system and guidelines',
    description:
      'The riso notebook: warm paper, a few inks laid slightly out of register, and marks made by hand in the margin.',
    art: 'strata',
  }
}
