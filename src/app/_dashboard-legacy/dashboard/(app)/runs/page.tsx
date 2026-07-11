import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ImportRun } from '@/payload-types'

import { RunsTable } from './runs-table'

const DEFAULT_PAGE_SIZE = 20

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

interface RunsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function RunsPage({ searchParams }: RunsPageProps) {
  const params = await searchParams
  const page = parsePositiveInt(params.page, 1)
  const limit = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE)

  const payload = await getPayload({ config: configPromise })

  const result = await payload.find({
    collection: 'import-runs',
    page,
    limit,
    sort: '-createdAt',
    depth: 0,
    overrideAccess: true,
  })

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Ingestion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Import Runs</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          History of every staged, running, and completed import — ORCID pulls, BibTeX/citation
          pastes, DOI quick-adds, and CLI runs.
        </p>
      </div>
      <RunsTable
        rows={result.docs as ImportRun[]}
        page={result.page ?? page}
        pageSize={limit}
        pageCount={result.totalPages ?? 0}
        totalDocs={result.totalDocs ?? 0}
      />
    </main>
  )
}
