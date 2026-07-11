import { getPayload } from 'payload'
import configPromise from '@payload-config'
import type { Where } from 'payload'

import type { ReviewItem, Team } from '@/payload-types'

import { PeopleTable, type PeopleTab } from './people-table'

const DEFAULT_PAGE_SIZE = 20

function parseTab(value: string | string[] | undefined): PeopleTab {
  const raw = Array.isArray(value) ? value[0] : value
  if (raw === 'everyone' || raw === 'needs-review') return raw
  return 'members'
}

function parsePositiveInt(value: string | string[] | undefined, fallback: number): number {
  const raw = Array.isArray(value) ? value[0] : value
  const parsed = raw ? Number.parseInt(raw, 10) : NaN
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback
}

/**
 * Both sides of an open person-merge-suggestion review item embed a Team
 * record id inside a parenthesized substring — see resolveOrCreateTeamMember
 * in src/lib/ingestion/people.ts. `value` looks like "Jane Doe (new id: 66f...)"
 * (the newly created record) and `data.suggestedMatch` looks like
 * "Jane Doe (id: 66a...)" (the pre-existing record it fuzzy-matched against).
 * There is no first-class id field for this yet — parsing both sides is the
 * only way to surface every Team record a human should look at for this tab.
 */
function extractTeamId(source: string | null | undefined, marker: 'new id' | 'id'): string | null {
  if (!source) return null
  const pattern = new RegExp(`\\(${marker}: ([a-f0-9]+)\\)`, 'i')
  return source.match(pattern)?.[1] ?? null
}

function getSuggestedMatch(data: ReviewItem['data']): string | null {
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    const value = (data as Record<string, unknown>).suggestedMatch
    return typeof value === 'string' ? value : null
  }
  return null
}

type PayloadClient = Awaited<ReturnType<typeof getPayload>>

async function loadNeedsReviewTeamIds(payload: PayloadClient): Promise<string[]> {
  const { docs } = await payload.find({
    collection: 'review-items',
    where: { kind: { equals: 'person-merge-suggestion' }, status: { equals: 'open' } },
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })

  const ids = new Set<string>()
  for (const item of docs as ReviewItem[]) {
    const newId = extractTeamId(item.value, 'new id')
    if (newId) ids.add(newId)
    const existingId = extractTeamId(getSuggestedMatch(item.data), 'id')
    if (existingId) ids.add(existingId)
  }
  return Array.from(ids)
}

interface LoadTeamPageArgs {
  payload: PayloadClient
  tab: PeopleTab
  page: number
  limit: number
  needsReviewIds: string[]
}

async function loadTeamPage({ payload, tab, page, limit, needsReviewIds }: LoadTeamPageArgs) {
  if (tab === 'needs-review' && needsReviewIds.length === 0) {
    return { docs: [] as Team[], totalDocs: 0, totalPages: 0, page: 1 }
  }

  let where: Where | undefined
  if (tab === 'members') where = { displayInWebsite: { equals: true } }
  if (tab === 'needs-review') where = { id: { in: needsReviewIds } }

  return payload.find({
    collection: 'team',
    where,
    page,
    limit,
    sort: 'lastName',
    depth: 1,
    overrideAccess: true,
  })
}

interface PeoplePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}

export default async function PeoplePage({ searchParams }: PeoplePageProps) {
  const params = await searchParams
  const tab = parseTab(params.tab)
  const page = parsePositiveInt(params.page, 1)
  const limit = parsePositiveInt(params.pageSize, DEFAULT_PAGE_SIZE)

  const payload = await getPayload({ config: configPromise })
  const needsReviewIds = await loadNeedsReviewTeamIds(payload)

  const [membersCount, everyoneCount, result] = await Promise.all([
    payload.count({
      collection: 'team',
      where: { displayInWebsite: { equals: true } },
      overrideAccess: true,
    }),
    payload.count({ collection: 'team', overrideAccess: true }),
    loadTeamPage({ payload, tab, page, limit, needsReviewIds }),
  ])

  return (
    <main className="flex flex-1 flex-col gap-4 p-6 md:p-8">
      <div className="space-y-2">
        <p className="text-xs font-medium tracking-[0.24em] text-muted-foreground uppercase">
          Research Directory
        </p>
        <h1 className="text-3xl font-semibold tracking-tight">People</h1>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground">
          Every Team record the ingestion engine and admin panel know about — toggle who shows up on
          the public site, and see who a person-merge suggestion still needs a human look at.
        </p>
      </div>
      <PeopleTable
        rows={result.docs as Team[]}
        tab={tab}
        page={result.page ?? page}
        pageSize={limit}
        pageCount={result.totalPages ?? 0}
        totalDocs={result.totalDocs ?? 0}
        counts={{
          members: membersCount.totalDocs,
          everyone: everyoneCount.totalDocs,
          needsReview: needsReviewIds.length,
        }}
      />
    </main>
  )
}
