import type { Payload } from 'payload'
import type { RorLookupEntry } from './match'
import { resolveByRor } from './match'
import type { ImportReport } from './report'
import { upsertByKey } from './upsert'

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

  const { id, action } = await upsertByKey({
    payload,
    collection: 'organizations',
    where: { ror_id: { equals: institution.ror } },
    data: {
      name: institution.name,
      ror_id: institution.ror,
      // `type` isn't guessed — OpenAlex authorship data doesn't distinguish
      // university/company/government, and `type` isn't required on this
      // collection. Left unset for a human to fill in on review.
      provenance: {
        source: 'openalex',
        importedAt: new Date().toISOString(),
        sourceNote: sourceContext,
      },
    },
    dryRun,
  })
  report.record('organizations', action)

  if (id) {
    orgIndex.push({ id, name: institution.name, rorId: institution.ror })
  }

  return id
}
