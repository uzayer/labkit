import type { Payload } from 'payload'
import type { Organization } from '../types'
import { fetchRorOrganization } from './fetch'
import type { RorLookupEntry } from './match'
import { resolveByRor } from './match'
import type { ImportReport } from './report'
import { upsertByKey } from './upsert'

// ROR v2 `types`, most specific first. Almost every ROR record also lists
// `funder` (North South University, Google and CERN all do), so `funder`
// only decides when nothing else is listed. `archive` and `other` stay unset.
const ROR_TYPE_PRIORITY: Array<[string, NonNullable<Organization['type']>]> = [
  ['education', 'university'],
  ['healthcare', 'healthcare'],
  ['facility', 'research-institute'],
  ['government', 'government'],
  ['nonprofit', 'nonprofit'],
  ['company', 'company'],
  ['funder', 'funding-agency'],
]

export function mapRorTypes(types: unknown): Organization['type'] | undefined {
  if (!Array.isArray(types)) return undefined
  return ROR_TYPE_PRIORITY.find(([rorType]) => types.includes(rorType))?.[1]
}

export interface PartnerInstitution {
  name: string
  ror?: string
}

/**
 * Partner-organization resolution for co-author affiliations pulled from
 * OpenAlex authorships. Auto-creates ONLY when a ROR ID is present and
 * unmatched — an authoritative external identifier justifies writing a new
 * record automatically. With no ROR, never guess from the bare institution
 * name (name collisions/variants are common); flag for manual review instead.
 */
export async function resolveOrCreatePartnerOrg(
  payload: Payload,
  report: ImportReport,
  institution: PartnerInstitution,
  orgIndex: RorLookupEntry[],
  sourceContext: string,
  dryRun: boolean,
): Promise<string | null> {
  if (!institution.ror) {
    report.flagUnmatched({
      collection: 'organizations',
      field: 'name',
      sourceContext,
      value: institution.name,
    })
    return null
  }

  const existing = resolveByRor(institution.ror, orgIndex)
  if (existing) return existing.id

  // `type` comes from the ROR record, never from the name. If ROR can't be
  // reached or lists no usable type, it stays unset for a person to fill in.
  const ror = (await fetchRorOrganization(institution.ror)) as { types?: unknown } | null
  const type = mapRorTypes(ror?.types)

  const { id, action } = await upsertByKey({
    payload,
    collection: 'organizations',
    where: { ror_id: { equals: institution.ror } },
    data: {
      name: institution.name,
      ror_id: institution.ror,
      type,
      provenance: {
        source: 'openalex',
        importedAt: new Date().toISOString(),
        sourceNote: sourceContext,
      },
    },
    dryRun,
  })
  report.record('organizations', action, {
    id,
    data: { name: institution.name, ror_id: institution.ror, type },
    sourceContext,
  })

  if (id) {
    orgIndex.push({ id, name: institution.name, rorId: institution.ror })
  }

  return id
}
