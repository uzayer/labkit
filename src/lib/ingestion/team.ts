import type { Payload } from 'payload'
import { textToLexical } from './lexical'
import { resolveByName, type NameLookupEntry } from './match'
import { upsertByKey } from './upsert'
import { ImportReport } from './report'

const VALID_ROLES = new Set([
  'director',
  'faculty',
  'research-staff',
  'graduate-ra',
  'undergraduate-ra',
  'alumni',
  'interdisciplinary-collaborator',
  'external-collaborator',
])

export interface TeamMemberInput {
  slug: string
  firstName: string
  lastName: string
  fullName: string
  rawRole?: string
  alumniNote?: string
  title?: string
  email?: string
  displayInWebsite?: boolean
  researchInterests?: string[]
  socials?: unknown[]
  affiliation?: string
  bioText?: string
  currentPosition?: string
  reportUnmatchedAffiliation?: boolean
}

export function mapTeamRole(rawRole: string | undefined, hasAlumniNote: boolean): string {
  if (hasAlumniNote) return 'alumni'
  if (rawRole && VALID_ROLES.has(rawRole)) return rawRole
  if (rawRole === 'researcher') return 'research-staff'
  if (rawRole === 'collaborator') return 'external-collaborator'
  return 'external-collaborator'
}

export function splitTeamMemberName(fullName: string): { firstName: string; lastName: string } {
  const parts = fullName.trim().split(/\s+/)
  const firstName = parts.slice(0, -1).join(' ') || parts[0]
  const lastName = parts.length > 1 ? parts[parts.length - 1] : parts[0]
  return { firstName, lastName }
}

export async function hydrateTeamMember(
  payload: Payload,
  report: ImportReport,
  member: TeamMemberInput,
  orgIndex: NameLookupEntry[],
  themeIndex: Map<string, { id: string; title: string }>,
  dryRun: boolean,
): Promise<string> {
  const role = mapTeamRole(member.rawRole, Boolean(member.alumniNote))
  const affiliationOrg = member.affiliation ? resolveByName(member.affiliation, orgIndex) : null
  const researchInterests = (member.researchInterests ?? [])
    .map((slug) => themeIndex.get(slug)?.title)
    .filter((title): title is string => Boolean(title))

  const data: Record<string, unknown> = {
    role,
    firstName: member.firstName,
    lastName: member.lastName,
    title: member.title,
    email: member.email,
    displayInWebsite: member.displayInWebsite ?? true,
    researchInterests,
    socials: Array.isArray(member.socials) ? member.socials : undefined,
    slug: member.slug,
    slugLock: true,
  }

  if (affiliationOrg) data.affiliation = affiliationOrg.id
  else if (member.affiliation) data.affiliationLabel = member.affiliation
  if (member.bioText) data.bio = textToLexical(member.bioText)
  if (role === 'alumni' && member.alumniNote) {
    data.currentPosition = member.currentPosition ?? member.alumniNote
  } else if (member.currentPosition) {
    data.currentPosition = member.currentPosition
  }

  const { id, action } = await upsertByKey({
    payload,
    collection: 'team',
    where: { slug: { equals: member.slug } },
    data,
    dryRun,
  })
  report.record('team', action)

  if (member.reportUnmatchedAffiliation && member.affiliation && !affiliationOrg) {
    report.flagUnmatched({
      collection: 'team',
      field: 'affiliation',
      sourceContext: member.slug,
      value: member.affiliation,
    })
  }

  return id!
}
