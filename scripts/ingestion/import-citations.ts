/**
 * Parse a pasted citation wall (a text file — the median artifact most labs
 * hand over during onboarding: a docx/PDF export with citations grouped by
 * year) and import each into Publications.
 *
 * Run: pnpm payload run scripts/ingestion/import-citations.ts <path-to-text-file> [dry-run]
 *
 * Segmentation: split on blank lines first (citations are usually already
 * one-per-paragraph/line once exported to plain text — no LLM segmentation
 * needed for the common case). Per chunk: regex-extract an embedded DOI; if
 * none, fall back to Crossref's bibliographic reverse-lookup. A chunk that
 * resolves nothing is flagged for manual review, never silently dropped.
 */
import fs from 'node:fs'
import { getPayload } from 'payload'
import config from '@payload-config'

import { extractDois } from '@/lib/ingestion/doi'
import { resolveCrossrefTitle } from '@/lib/ingestion/fetch'
import { hydratePublicationFromDoi, loadPublicationIndexes } from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'

const DRY_RUN = process.argv.includes('dry-run')
const filePath = process.argv.slice(2).find((arg) => arg !== 'dry-run')

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function splitIntoChunks(text: string): string[] {
  return text
    .split(/\n{2,}/)
    .map((chunk) => chunk.trim())
    .filter(Boolean)
}

async function main() {
  if (!filePath) {
    console.error(
      'Usage: pnpm payload run scripts/ingestion/import-citations.ts <path-to-text-file> [dry-run]',
    )
    process.exit(1)
  }

  const text = fs.readFileSync(filePath, 'utf-8')
  const chunks = splitIntoChunks(text)
  console.log(`${chunks.length} citation chunks found.`)

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  for (const chunk of chunks) {
    const sourceContext = chunk.length > 80 ? `${chunk.slice(0, 80)}…` : chunk
    const dois = extractDois(chunk)

    if (dois.length > 1) {
      // Multiple citations glued onto one chunk — a genuine segmentation
      // failure, not something to guess our way through.
      report.flagUnmatched({
        collection: 'publications',
        field: 'doi',
        sourceContext,
        value: `ambiguous — ${dois.length} DOIs in one chunk: ${dois.join(', ')}`,
      })
      continue
    }

    if (dois.length === 1) {
      await hydratePublicationFromDoi(payload, report, dois[0], indexes, DRY_RUN, sourceContext)
      await sleep(150)
      continue
    }

    const resolution = await resolveCrossrefTitle(chunk)
    await sleep(150)
    if (resolution.method === 'crossref' && resolution.candidate) {
      await hydratePublicationFromDoi(
        payload,
        report,
        resolution.candidate.doi,
        indexes,
        DRY_RUN,
        sourceContext,
      )
      await sleep(150)
    } else {
      report.flagUnmatched({
        collection: 'publications',
        field: 'doi',
        sourceContext,
        value: chunk.length > 200 ? `${chunk.slice(0, 200)}…` : chunk,
      })
    }
  }

  report.print(DRY_RUN)
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
