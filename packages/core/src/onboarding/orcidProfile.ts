import { defaultHeaders, fetchJsonWithRetry } from '../ingestion/fetch'
import { normalizeOrcid } from '../ingestion/normalize'

/**
 * The bare `0000-0000-0000-000X` form of an ORCID iD, or null when the input
 * isn't one or its check digit is wrong. Accepts the `https://orcid.org/…` URL
 * form too. The checksum is ISO 7064 MOD 11-2, as ORCID specifies it; checking
 * it here catches a mistyped digit before we fetch someone else's record.
 */
export function parseOrcidId(raw: string): string | null {
  const id = normalizeOrcid(raw.trim())?.toUpperCase()
  if (!id || !/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/.test(id)) return null

  const digits = id.replace(/-/g, '')
  let total = 0
  for (const char of digits.slice(0, 15)) total = (total + Number(char)) * 2
  const result = (12 - (total % 11)) % 11
  const check = result === 10 ? 'X' : String(result)
  return digits[15] === check ? id : null
}

export interface OrcidEmployment {
  organization: string
  department?: string
  roleTitle?: string
  city?: string
  /** Country name, from ORCID's ISO 3166 code. */
  country?: string
  startYear?: number
  endYear?: number
  current: boolean
}

export interface OrcidProfile {
  orcid: string
  givenNames?: string
  familyName?: string
  creditName?: string
  country?: string
  employments: OrcidEmployment[]
}

type Value = { value?: string | null } | null | undefined

interface OrcidPerson {
  name?: {
    'given-names'?: Value
    'family-name'?: Value
    'credit-name'?: Value
  } | null
  addresses?: { address?: Array<{ country?: Value }> } | null
}

interface OrcidDate {
  year?: Value
}

interface OrcidEmploymentSummary {
  'department-name'?: string | null
  'role-title'?: string | null
  'start-date'?: OrcidDate | null
  'end-date'?: OrcidDate | null
  organization?: {
    name?: string | null
    address?: { city?: string | null; country?: string | null } | null
  } | null
}

interface OrcidEmployments {
  'affiliation-group'?: Array<{
    summaries?: Array<{ 'employment-summary'?: OrcidEmploymentSummary }>
  }>
}

const text = (value: Value | string | null | undefined): string | undefined => {
  const raw = typeof value === 'string' ? value : value?.value
  return raw?.trim() || undefined
}

const year = (date: OrcidDate | null | undefined): number | undefined => {
  const parsed = Number.parseInt(date?.year?.value ?? '', 10)
  return Number.isFinite(parsed) ? parsed : undefined
}

const countryName = (code: string | null | undefined): string | undefined => {
  if (!code) return undefined
  try {
    return new Intl.DisplayNames(['en'], { type: 'region' }).of(code.toUpperCase()) ?? code
  } catch {
    return code
  }
}

const orcidHeaders = () => defaultHeaders({ Accept: 'application/json' })

/**
 * The public parts of an ORCID record the wizard prefills from: the person's
 * name and country, and their employments. Returns null when the record can't
 * be fetched (unknown iD, network failure); the editor then types everything.
 */
export async function fetchOrcidProfile(orcid: string): Promise<OrcidProfile | null> {
  const base = `https://pub.orcid.org/v3.0/${encodeURIComponent(orcid)}`
  const [person, employments] = (await Promise.all([
    fetchJsonWithRetry(`${base}/person`, { headers: orcidHeaders() }),
    fetchJsonWithRetry(`${base}/employments`, { headers: orcidHeaders() }),
  ])) as [OrcidPerson | null, OrcidEmployments | null]

  if (!person) return null

  const jobs = (employments?.['affiliation-group'] ?? [])
    .flatMap((group) => group.summaries ?? [])
    .flatMap(({ 'employment-summary': summary }): OrcidEmployment[] => {
      const organization = text(summary?.organization?.name)
      if (!summary || !organization) return []
      const endYear = year(summary['end-date'])
      return [
        {
          organization,
          department: text(summary['department-name']),
          roleTitle: text(summary['role-title']),
          city: text(summary.organization?.address?.city),
          country: countryName(summary.organization?.address?.country),
          startYear: year(summary['start-date']),
          endYear,
          current: endYear === undefined,
        },
      ]
    })
    // Current posts first, and among them the longest-held. A PI often lists an
    // adjunct or visiting post next to their home appointment; the oldest
    // current one is more likely the institution the Lab belongs to.
    .sort((a, b) => {
      if (a.current !== b.current) return a.current ? -1 : 1
      return (a.startYear ?? 9999) - (b.startYear ?? 9999)
    })

  return {
    orcid,
    givenNames: text(person.name?.['given-names']),
    familyName: text(person.name?.['family-name']),
    creditName: text(person.name?.['credit-name']),
    country: countryName(text(person.addresses?.address?.[0]?.country)),
    employments: jobs,
  }
}
