/**
 * Parse a .bib file (Zotero/Mendeley/EndNote/Google Scholar export) and
 * import each entry into Publications.
 *
 * Run: pnpm payload run scripts/ingestion/import-bibtex.ts <path.bib> [dry-run]
 *
 * Per entry: has a `doi` field -> hydrate via Crossref/OpenAlex (BibTeX only
 * supplies the DOI, those APIs stay the enrichment source of truth). No DOI
 * but has a `title` -> Crossref reverse-title-lookup, then same path. Neither
 * -> write directly from BibTeX fields alone (author list is already
 * structured by the parser), always flagged as low-confidence since it never
 * got Crossref/OpenAlex enrichment.
 */
import fs from 'node:fs'
import { parse, type BibtexCreator } from '@retorquere/bibtex-parser'
import { getPayload } from 'payload'
import config from '@payload-config'

import { resolveCrossrefTitle } from '@/lib/ingestion/fetch'
import {
  hydratePublicationFromDoi,
  hydratePublicationFromFields,
  loadPublicationIndexes,
} from '@/lib/ingestion/publications'
import { ImportReport } from '@/lib/ingestion/report'

const DRY_RUN = process.argv.includes('dry-run')
const bibPath = process.argv.slice(2).find((arg) => arg !== 'dry-run')

async function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

function creatorFullName(creator: BibtexCreator): string | undefined {
  if (creator.name) return creator.name
  const parts = [creator.firstName, creator.lastName].filter(Boolean)
  return parts.length > 0 ? parts.join(' ') : undefined
}

async function main() {
  if (!bibPath) {
    console.error('Usage: pnpm payload run scripts/ingestion/import-bibtex.ts <path.bib> [dry-run]')
    process.exit(1)
  }

  const bib = parse(fs.readFileSync(bibPath, 'utf-8'))
  console.log(`${bib.entries.length} entries found, ${bib.errors.length} parse errors.`)

  const payload = await getPayload({ config })
  const report = new ImportReport()
  const indexes = await loadPublicationIndexes(payload)

  for (const entry of bib.entries) {
    const sourceContext = `bibtex:${entry.key}`
    const doi = typeof entry.fields.doi === 'string' ? entry.fields.doi : undefined
    const title = typeof entry.fields.title === 'string' ? entry.fields.title : undefined

    if (doi) {
      await hydratePublicationFromDoi(payload, report, doi, indexes, DRY_RUN, sourceContext)
      await sleep(150)
      continue
    }

    if (title) {
      const resolution = await resolveCrossrefTitle(title)
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
        continue
      }
    }

    if (!title) {
      report.flagUnmatched({
        collection: 'publications',
        field: 'title',
        sourceContext,
        value: '(bibtex entry has no title field)',
      })
      continue
    }

    const yearRaw = typeof entry.fields.year === 'string' ? parseInt(entry.fields.year, 10) : NaN
    if (!Number.isFinite(yearRaw)) {
      report.flagUnmatched({
        collection: 'publications',
        field: 'year',
        sourceContext,
        value: '(bibtex entry has no parseable year field)',
      })
      continue
    }

    const authorField = Array.isArray(entry.fields.author) ? entry.fields.author : []
    const authors = (authorField as BibtexCreator[]).flatMap((creator) => {
      const fullName = creatorFullName(creator)
      return fullName ? [{ fullName }] : []
    })

    await hydratePublicationFromFields(
      payload,
      report,
      { title, year: yearRaw, authors },
      indexes,
      DRY_RUN,
      sourceContext,
    )
  }

  if (bib.errors.length > 0) {
    console.log(`\n--- BibTeX parse errors (${bib.errors.length}) ---`)
    for (const error of bib.errors) {
      console.log(error.error)
    }
  }

  report.print(DRY_RUN)
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
