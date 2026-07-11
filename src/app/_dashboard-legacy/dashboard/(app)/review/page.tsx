import { getPayload } from 'payload'
import configPromise from '@payload-config'

import type { ReviewItem } from '@/payload-types'

import { ReviewQueueTable } from './review-table'

async function loadOpenReviewItems(): Promise<ReviewItem[]> {
  const payload = await getPayload({ config: configPromise })

  const { docs } = await payload.find({
    collection: 'review-items',
    where: { status: { equals: 'open' } },
    sort: '-createdAt',
    pagination: false,
    depth: 1,
    overrideAccess: true,
  })

  return docs
}

export default async function ReviewQueuePage() {
  const items = await loadOpenReviewItems()

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-muted-foreground text-xs font-medium tracking-[0.24em] uppercase">
          Ingestion
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">Review Queue</h1>
        <p className="text-muted-foreground max-w-2xl text-sm leading-6">
          Items flagged by the ingestion engine for human review — unmatched venues and
          organizations, possible duplicate people, and citations the importer couldn&apos;t fully
          parse.
        </p>
      </div>
      <ReviewQueueTable initialItems={items} />
    </main>
  )
}
