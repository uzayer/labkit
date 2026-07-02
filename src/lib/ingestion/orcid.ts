export interface OrcidWork {
  title: string
  doi?: string
  year?: number
  sourceName: string
}

interface OrcidWorkGroup {
  'external-ids'?: {
    'external-id'?: Array<{
      'external-id-type'?: string
      'external-id-value'?: string
    }>
  }
  'work-summary'?: Array<{
    title?: { title?: { value?: string } }
    source?: { 'source-name'?: { value?: string } }
    'publication-date'?: { year?: { value?: string } }
  }>
}

function extractDoi(group: OrcidWorkGroup): string | undefined {
  const externalIds = group['external-ids']?.['external-id'] ?? []
  for (const externalId of externalIds) {
    if (externalId['external-id-type'] !== 'doi') continue
    const doi = externalId['external-id-value']?.trim()
    if (doi) return doi
  }
  return undefined
}

export async function fetchOrcidWorks(orcidId: string): Promise<OrcidWork[]> {
  const response = await fetch(`https://pub.orcid.org/v3.0/${encodeURIComponent(orcidId)}/works`, {
    headers: {
      Accept: 'application/json',
    },
  })

  if (!response.ok) {
    return []
  }

  const json = (await response.json()) as { group?: OrcidWorkGroup[] }
  const groups = json.group ?? []

  return groups.flatMap((group) => {
    const summary = group['work-summary']?.[0]
    if (!summary) {
      return []
    }

    const title = summary?.title?.title?.value?.trim()
    const sourceName = summary?.source?.['source-name']?.value?.trim()

    if (!title || !sourceName) {
      return []
    }

    const yearValue = summary['publication-date']?.year?.value
    const year = yearValue ? Number.parseInt(yearValue, 10) : undefined

    return [
      {
        title,
        doi: extractDoi(group),
        year: Number.isFinite(year) ? year : undefined,
        sourceName,
      },
    ]
  })
}
