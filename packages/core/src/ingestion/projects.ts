import type { Payload } from 'payload'
import type { TitleCandidate } from './match'
import { matchTitle } from './match'
import { textToLexical } from './lexical'
import { ImportReport } from './report'
import { upsertByKey } from './upsert'

export interface ProjectInput {
  title: string
  slug: string
  teamMemberSlugs?: string[]
  grantSlugs?: string[]
  themes?: string[]
  publicationQueries?: string[]
  status?: string
  needsResearch?: boolean
  contentText?: string
}

export async function hydrateProject(
  payload: Payload,
  report: ImportReport,
  project: ProjectInput,
  teamIndex: Map<string, { id: string }>,
  grantIndex: Map<string, { id: string }>,
  pubCandidates: TitleCandidate[],
  themeIndex: Map<string, { id: string; title: string }>,
  dryRun: boolean,
): Promise<void> {
  const teamMembers = (project.teamMemberSlugs ?? [])
    .map((slug) => {
      const team = teamIndex.get(slug)
      if (!team) {
        report.flagUnmatched({
          collection: 'projects',
          field: 'teamMembers',
          sourceContext: project.slug,
          value: slug,
        })
      }
      return team?.id
    })
    .filter((id): id is string => Boolean(id))

  const grants = (project.grantSlugs ?? [])
    .map((slug) => {
      const grant = grantIndex.get(slug)
      if (!grant) {
        report.flagUnmatched({
          collection: 'projects',
          field: 'grants',
          sourceContext: project.slug,
          value: slug,
        })
      }
      return grant?.id
    })
    .filter((id): id is string => Boolean(id))

  const themes = (project.themes ?? [])
    .map((slug) => themeIndex.get(slug)?.id)
    .filter((id): id is string => Boolean(id))

  const publications = (project.publicationQueries ?? [])
    .map((query) => {
      const match = matchTitle(query, pubCandidates)
      if (!match.candidate) {
        report.flagUnmatched({
          collection: 'projects',
          field: 'publications',
          sourceContext: project.slug,
          value: query,
        })
        return null
      }

      return match.candidate.id
    })
    .filter((id): id is string => Boolean(id))

  const status = project.status === 'completed' ? 'completed' : 'ongoing'
  const needsResearch = Boolean(project.needsResearch)

  const data: Record<string, unknown> = {
    title: project.title,
    slug: project.slug,
    slugLock: true,
    teamMembers,
    grants,
    themes,
    publications,
    status,
    content: project.contentText ? textToLexical(project.contentText) : undefined,
    _status: needsResearch ? 'draft' : 'published',
  }

  const { action } = await upsertByKey({
    payload,
    collection: 'projects',
    where: { slug: { equals: project.slug } },
    data,
    dryRun,
    draft: needsResearch,
  })
  report.record('projects', action)
}
