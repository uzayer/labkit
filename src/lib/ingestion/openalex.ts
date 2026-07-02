function reconstructAbstract(invertedIndex: Record<string, number[]>): string {
  const positions: Array<[number, string]> = []
  for (const [word, indices] of Object.entries(invertedIndex)) {
    for (const index of indices) {
      positions.push([index, word])
    }
  }
  positions.sort((a, b) => a[0] - b[0])
  return positions.map(([, word]) => word).join(' ')
}

export interface OpenAlexPublicationFields {
  abstract?: string
  openalex_id?: string
  isOpenAccess?: boolean
}

export function mapOpenAlexToPublicationFields(json: unknown): OpenAlexPublicationFields {
  const work = json as {
    id?: string
    abstract_inverted_index?: Record<string, number[]>
    open_access?: { is_oa?: boolean }
  }
  if (!work || (work as { error?: unknown }).error) return {}

  const fields: OpenAlexPublicationFields = {}

  if (work.abstract_inverted_index) {
    fields.abstract = reconstructAbstract(work.abstract_inverted_index)
  }
  if (typeof work.id === 'string') {
    fields.openalex_id = work.id
  }
  if (typeof work.open_access?.is_oa === 'boolean') {
    fields.isOpenAccess = work.open_access.is_oa
  }

  return fields
}
