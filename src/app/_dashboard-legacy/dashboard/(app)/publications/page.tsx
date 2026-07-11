import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { Publication } from '@/payload-types'

import { PublicationsTable } from './publications-table'

const DEFAULT_PAGE_SIZE = 20

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

interface PublicationsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PublicationsPage({ searchParams }: PublicationsPageProps) {
  const params = await searchParams
  const page = parsePositiveInt(params.page, 1)
  const limit = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE)

  const payload = await getPayload({ config: configPromise })

  // depth: 0 — authors[].teamMember/venue aren't rendered here, only the
  // author array's length and the already-denormalized venueLabel/provenance
  // fields, so there's no need to populate relationships for this table.
  const result = await payload.find({
    collection: 'publications',
    page,
    limit,
    sort: '-year',
    depth: 0,
    overrideAccess: true,
  })

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Research Directory
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Publications</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Every Publications record, newest first. Read-only — edit a record from the admin panel.
        </p>
      </div>
      <PublicationsTable
        rows={result.docs as Publication[]}
        page={result.page ?? page}
        pageSize={limit}
        pageCount={result.totalPages ?? 0}
        totalDocs={result.totalDocs ?? 0}
      />
    </main>
  )
}
