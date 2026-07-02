import type { Payload } from 'payload'
import type { NameLookupEntry, TitleCandidate } from './match'
import { matchTitle, resolveByName } from './match'
import { splitCommaList } from './normalize'
import { ImportReport } from './report'
import { upsertByKey } from './upsert'

export interface AwardInput {
  title: string
  year: number
  endYear?: number
  category?: string
  scope?: string
  featured?: boolean
  organization?: string
  recipientSlugs?: string[]
  externalRecipients?: string
  linkedPublication?: string
  sourceNote?: string
}

export async function hydrateAward(
  payload: Payload,
  report: ImportReport,
  award: AwardInput,
  orgIndex: NameLookupEntry[],
  teamIndex: Map<string, { id: string }>,
  pubCandidates: TitleCandidate[],
  dryRun: boolean,
): Promise<void> {
  const orgMatch = award.organization ? resolveByName(award.organization, orgIndex) : null

  const recipients = (award.recipientSlugs ?? []).map((slug) => {
    const team = teamIndex.get(slug)
    if (!team) {
      report.flagUnmatched({
        collection: 'awards',
        field: 'recipients',
        sourceContext: award.title,
        value: slug,
      })
      return { customRecipient: slug }
    }

    return { teamMember: team.id }
  })

  for (const external of splitCommaList(award.externalRecipients)) {
    recipients.push({ customRecipient: external })
  }

  const data: Record<string, unknown> = {
    title: award.title,
    year: award.year,
    endYear: award.endYear,
    category: award.category,
    scope: award.scope ?? 'lab',
    featured: award.featured ?? false,
    recipients,
    provenance: {
      source: 'manual',
      importedAt: new Date().toISOString(),
      sourceNote: award.sourceNote,
    },
  }

  if (orgMatch) data.organization = orgMatch.id
  else if (award.organization) data.organizationLabel = award.organization

  const { id, action } = await upsertByKey({
    payload,
    collection: 'awards',
    where: { and: [{ title: { equals: award.title } }, { year: { equals: award.year } }] },
    data,
    dryRun,
  })
  report.record('awards', action)

  if (award.organization && !orgMatch) {
    report.flagUnmatched({
      collection: 'awards',
      field: 'organization',
      sourceContext: award.title,
      value: award.organization,
    })
  }

  if (!award.linkedPublication) {
    return
  }

  const match = matchTitle(award.linkedPublication, pubCandidates)
  if (!match.candidate) {
    report.flagUnmatched({
      collection: 'awards',
      field: 'linkedPublication',
      sourceContext: award.title,
      value: award.linkedPublication,
    })
    return
  }

  if (dryRun || !id) {
    return
  }

  const publication = (await payload.findByID({
    collection: 'publications',
    id: match.candidate.id,
    overrideAccess: true,
  })) as { awards?: Array<string | { id: string }> }

  const existingAwardIds = (publication.awards ?? []).map((entry) =>
    typeof entry === 'string' ? entry : entry.id,
  )
  if (existingAwardIds.includes(id)) {
    return
  }

  await payload.update({
    collection: 'publications',
    id: match.candidate.id,
    data: { awards: [...existingAwardIds, id] },
    overrideAccess: true,
    context: { disableRevalidate: true },
  })
}
