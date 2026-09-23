/** Safety regression check; no network or database. */
import assert from 'node:assert/strict'
import { mkdtemp, rm, writeFile } from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import type { StagedCandidate } from '@/lib/ingestion/staging'
import { loadOrcidSelection } from './orcid-selection'

const candidates: StagedCandidate[] = [
  { key: 'doi:10.1/a', title: 'A', doi: '10.1/a', year: 2021, selected: true, status: 'pending' },
  { key: 'doi:10.1/b', title: 'B', doi: '10.1/b', year: 2020, selected: true, status: 'pending' },
  { key: 'orcid:2', title: 'No DOI', selected: false, status: 'pending' },
]
const directory = await mkdtemp(path.join(os.tmpdir(), 'dial-orcid-selection-'))
const filePath = path.join(directory, 'selection.json')

async function select(includeKeys: string[], excludeKeys: string[], since = 2017) {
  await writeFile(
    filePath,
    JSON.stringify({ orcidId: '0000-0002-7715-1742', since, includeKeys, excludeKeys }),
  )
  return loadOrcidSelection(filePath, '0000-0002-7715-1742', 2017, candidates)
}

try {
  assert.deepEqual(
    (await select(['doi:10.1/a'], ['doi:10.1/b', 'orcid:2'])).map((item) => item.key),
    ['doi:10.1/a'],
  )
  await assert.rejects(select(['doi:10.1/a'], ['orcid:2']), /unreviewed Candidates/)
  await assert.rejects(select(['doi:10.1/a', 'doi:10.1/a'], ['doi:10.1/b', 'orcid:2']), /unique/)
  await assert.rejects(select(['orcid:2'], ['doi:10.1/a', 'doi:10.1/b']), /no DOI/)
  await assert.rejects(select(['doi:10.1/a'], ['doi:10.1/b', 'orcid:2'], 2020), /year filter/)
  console.log('ORCID selection safety checks passed.')
} finally {
  await rm(directory, { recursive: true, force: true })
}
