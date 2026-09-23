/**
 * Snapshot the already-structured DIAL prototype records as review Candidates.
 * No Payload connection or writes. Run once with:
 * bun run payload -- run scripts/ingestion/init-dial-review-manifest.ts
 */
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

import {
  awards,
  grants,
  news,
  organizations,
  projects,
  publications,
  researchThemes,
  team,
} from '../../labs/dial/dial-test-full-data/index'

const sources = {
  team,
  projects,
  grants,
  awards,
  'research-themes': researchThemes,
  news,
  publications,
  organizations,
}

const candidates = Object.entries(sources).flatMap(([collection, records]) =>
  records.map((record) => {
    if (!record.provenance?.sourceNote) {
      throw new Error(`Missing source note: ${collection}/${record.id}`)
    }
    return {
      id: `${collection}/${record.id}`,
      collection,
      recordId: record.id,
      label: 'title' in record ? record.title : 'name' in record ? record.name : record.id,
      source: record.provenance.source ?? 'unknown',
      sourceNote: record.provenance.sourceNote,
      status: 'unverified',
      decisionNote: '',
    }
  }),
)

if (new Set(candidates.map((candidate) => candidate.id)).size !== candidates.length) {
  throw new Error('Duplicate candidate IDs')
}

const destination = path.resolve(process.cwd(), 'labs/dial/working-data/review-manifest.json')
await mkdir(path.dirname(destination), { recursive: true })
await writeFile(destination, `${JSON.stringify(candidates, null, 2)}\n`, { flag: 'wx' })
console.log(`Wrote ${candidates.length} unverified Candidates to ${destination}`)
