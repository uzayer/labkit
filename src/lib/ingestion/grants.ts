import type { Payload } from 'payload'
import type { NameLookupEntry } from './match'
import { resolveByName } from './match'
import { yearToDate } from './normalize'
import { ImportReport } from './report'
import { upsertByKey } from './upsert'

export interface GrantInput {
  slug: string
  title: string
  description?: string
  grantNumber?: string
  amountValue?: number
  amountCurrency?: string
  startYear?: string | number
  endYear?: string | number
  status?: string
  funder?: string
  investigators?: Array<{
    teamMemberSlug?: string
    customInvestigator?: string
    role?: string
  }>
  themes?: string[]
}

export async function hydrateGrant(
  payload: Payload,
  report: ImportReport,
  grant: GrantInput,
  orgIndex: NameLookupEntry[],
  teamIndex: Map<string, { id: string }>,
  themeIndex: Map<string, { id: string; title: string }>,
  dryRun: boolean,
): Promise<string> {
  const funderOrg = grant.funder ? resolveByName(grant.funder, orgIndex) : null

  const investigators = (grant.investigators ?? [])
    .map((investigator) => {
      if (investigator.teamMemberSlug) {
        const team = teamIndex.get(investigator.teamMemberSlug)
        if (!team) {
          report.flagUnmatched({
            collection: 'grants',
            field: 'investigators.teamMember',
            sourceContext: grant.slug,
            value: investigator.teamMemberSlug,
          })
          return null
        }

        return { teamMember: team.id, role: investigator.role }
      }

      return {
        customInvestigator: investigator.customInvestigator,
        role: investigator.role,
      }
    })
    .filter((investigator) => investigator !== null)

  const themes = (grant.themes ?? [])
    .map((slug) => themeIndex.get(slug)?.id)
    .filter((id): id is string => Boolean(id))

  const data: Record<string, unknown> = {
    title: grant.title,
    slug: grant.slug,
    slugLock: true,
    description: grant.description,
    grantNumber: grant.grantNumber,
    amountValue: grant.amountValue,
    amountCurrency: grant.amountCurrency,
    startDate: grant.startYear ? yearToDate(grant.startYear) : undefined,
    endDate: grant.endYear ? yearToDate(grant.endYear, true) : undefined,
    status: grant.status,
    investigators,
    themes,
  }

  if (funderOrg) data.funder = funderOrg.id
  else if (grant.funder) data.funderLabel = grant.funder

  const { id, action } = await upsertByKey({
    payload,
    collection: 'grants',
    where: { slug: { equals: grant.slug } },
    data,
    dryRun,
  })
  report.record('grants', action)

  if (grant.funder && !funderOrg) {
    report.flagUnmatched({
      collection: 'grants',
      field: 'funder',
      sourceContext: grant.slug,
      value: grant.funder,
    })
  }

  return id!
}
