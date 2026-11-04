import { mkdir, readFile, writeFile } from 'node:fs/promises'
import path from 'node:path'

import type { StagedCandidate } from '@labkit/core/ingestion/staging'

interface OrcidSelection {
  orcidId: string
  since: number | null
  includeKeys: string[]
  excludeKeys: string[]
}

/** A reviewed selection accounts for every in-range Candidate, including undated works. */
export async function loadOrcidSelection(
  filePath: string,
  orcidId: string,
  since: number | undefined,
  candidates: StagedCandidate[],
): Promise<StagedCandidate[]> {
  const selection = JSON.parse(await readFile(filePath, 'utf8')) as OrcidSelection
  if (selection.orcidId !== orcidId) {
    throw new Error(`Selection ORCID ${selection.orcidId} does not match ${orcidId}`)
  }
  if (selection.since !== (since ?? null)) {
    throw new Error(
      `Selection year filter ${selection.since} does not match since=${since ?? 'all'}`,
    )
  }
  if (!Array.isArray(selection.includeKeys) || !Array.isArray(selection.excludeKeys)) {
    throw new Error('Selection must contain includeKeys and excludeKeys arrays')
  }

  const keys = [...selection.includeKeys, ...selection.excludeKeys]
  if (keys.some((key) => typeof key !== 'string') || new Set(keys).size !== keys.length) {
    throw new Error('Selection keys must be unique strings')
  }

  const candidateKeys = new Set(candidates.map((candidate) => candidate.key))
  const selectedKeys = new Set(keys)
  const unknown = keys.filter((key) => !candidateKeys.has(key))
  const unreviewed = candidates.filter((candidate) => !selectedKeys.has(candidate.key))
  if (unknown.length || unreviewed.length) {
    throw new Error(
      `Selection does not match the staged set: ${unknown.length} unknown keys, ` +
        `${unreviewed.length} unreviewed Candidates. Re-stage and review the whole in-range set.`,
    )
  }

  const included = new Set(selection.includeKeys)
  const withoutDoi = candidates.filter((candidate) => included.has(candidate.key) && !candidate.doi)
  if (withoutDoi.length) {
    throw new Error(
      `${withoutDoi.length} included Candidates have no DOI; this CLI cannot hydrate them. ` +
        'Route them through BibTeX or citation review instead.',
    )
  }
  return candidates.filter((candidate) => included.has(candidate.key))
}

export async function writeOrcidSelectionTemplate(
  orcidId: string,
  since: number | undefined,
  candidates: StagedCandidate[],
): Promise<string> {
  const templatePath = path.resolve(
    process.cwd(),
    'ingestion-previews',
    `orcid-${orcidId}-since-${since ?? 'all'}-selection.template.json`,
  )
  await mkdir(path.dirname(templatePath), { recursive: true })
  try {
    await writeFile(
      templatePath,
      `${JSON.stringify(
        {
          orcidId,
          since: since ?? null,
          includeKeys: [],
          excludeKeys: candidates.map((candidate) => candidate.key),
          candidates: candidates.map(({ key, title, year, doi, raw }) => ({
            key,
            title,
            year,
            doi,
            sourceName: raw?.sourceName,
          })),
        },
        null,
        2,
      )}\n`,
      { flag: 'wx' },
    )
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') throw error
    // The existing file may contain human decisions. Never replace it.
  }
  return templatePath
}
