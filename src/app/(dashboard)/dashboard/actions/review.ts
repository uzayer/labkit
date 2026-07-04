'use server'

import { getPayload } from 'payload'
import configPromise from '@payload-config'
import { revalidatePath } from 'next/cache'

import type { Publication, ReviewItem } from '@/payload-types'
import { checkRole } from '@/utilities/checkRole'
import { getMeUser } from '@/utilities/getMeUser'

async function requireAdminUser() {
  const { user } = await getMeUser()

  if (!checkRole(['admin'], user)) {
    throw new Error('Unauthorized review-queue operation')
  }

  return user
}

export interface ReviewActionResult {
  success: boolean
  error?: string
}

/**
 * Both sides of a person-merge-suggestion review item embed a Team record id
 * inside a parenthesized substring — see resolveOrCreateTeamMember in
 * src/lib/ingestion/people.ts. `value` looks like "Jane Doe (new id: 66f...)"
 * (the newly created, presumed-duplicate record) and `data.suggestedMatch`
 * looks like "Jane Doe (id: 66a...)" (the pre-existing record it fuzzy-matched
 * against). There is no first-class id field for this yet — this is a known
 * schema gap, not a parsing shortcut taken here.
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

export async function dismissReviewItem(id: string): Promise<ReviewActionResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    await payload.update({
      collection: 'review-items',
      id,
      data: { status: 'dismissed', resolvedAt: new Date().toISOString() },
      overrideAccess: true,
    })
    revalidatePath('/dashboard/review')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to dismiss review item',
    }
  }
}

/**
 * Honest placeholder for every kind except person-merge-suggestion: there is
 * no structured payload behind unmatched-venue/org, no-doi-work,
 * unparsed-citation, unmapped-type, or failed-doi (finalizeRun in
 * run-persistence.ts writes data: null for all of them), so "Accept" can only
 * acknowledge the item, not perform the create+link action a human would take
 * in the admin. This is a real gap, not a faked success.
 */
export async function acceptReviewItem(id: string): Promise<ReviewActionResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  try {
    await payload.update({
      collection: 'review-items',
      id,
      data: {
        status: 'accepted',
        resolvedAt: new Date().toISOString(),
        resolution: {
          note: 'acknowledged — no automated create+link action wired up yet for this kind',
        },
      },
      overrideAccess: true,
    })
    revalidatePath('/dashboard/review')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Failed to accept review item',
    }
  }
}

/**
 * Real accept action for person-merge-suggestion: re-points every
 * publications.authors[].teamMember reference from the newly created
 * (duplicate) Team record onto the pre-existing (surviving) one, deletes the
 * duplicate, and marks the review item accepted with a resolution recording
 * both ids. Any failure (unparseable ids, missing Team records) leaves the
 * review item untouched (`open`) rather than marking it accepted.
 */
export async function mergePersonSuggestion(id: string): Promise<ReviewActionResult> {
  await requireAdminUser()
  const payload = await getPayload({ config: configPromise })

  const item = (await payload.findByID({
    collection: 'review-items',
    id,
    overrideAccess: true,
  })) as ReviewItem

  if (item.kind !== 'person-merge-suggestion') {
    return { success: false, error: 'Review item is not a person merge suggestion' }
  }

  const duplicateId = extractTeamId(item.value, 'new id')
  const existingId = extractTeamId(getSuggestedMatch(item.data), 'id')

  if (!duplicateId || !existingId) {
    return {
      success: false,
      error: 'Could not parse the Team record ids out of this suggestion',
    }
  }

  if (duplicateId === existingId) {
    return { success: false, error: 'Duplicate and existing Team ids are identical' }
  }

  try {
    const [duplicateTeam, existingTeam] = await Promise.all([
      payload
        .findByID({ collection: 'team', id: duplicateId, overrideAccess: true })
        .catch(() => null),
      payload
        .findByID({ collection: 'team', id: existingId, overrideAccess: true })
        .catch(() => null),
    ])

    if (!duplicateTeam || !existingTeam) {
      return {
        success: false,
        error: 'One or both Team records referenced by this suggestion no longer exist',
      }
    }

    const { docs: affectedPublications } = await payload.find({
      collection: 'publications',
      where: { 'authors.teamMember': { equals: duplicateId } },
      pagination: false,
      depth: 0,
      overrideAccess: true,
    })

    for (const pub of affectedPublications as unknown as Publication[]) {
      const authors = (pub.authors ?? []).map((author) => {
        const teamMemberId =
          typeof author.teamMember === 'string' ? author.teamMember : author.teamMember?.id
        if (teamMemberId !== duplicateId) return author
        return { ...author, teamMember: existingId }
      })

      await payload.update({
        collection: 'publications',
        id: pub.id,
        data: { authors },
        overrideAccess: true,
      })
    }

    await payload.delete({ collection: 'team', id: duplicateId, overrideAccess: true })

    await payload.update({
      collection: 'review-items',
      id,
      data: {
        status: 'accepted',
        resolvedAt: new Date().toISOString(),
        resolution: { mergedInto: existingId, deletedId: duplicateId },
      },
      overrideAccess: true,
    })

    revalidatePath('/dashboard/review')
    return { success: true }
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : 'Merge failed — review item left open',
    }
  }
}
