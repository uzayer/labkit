import type { CollectionSlug, Payload, Where } from 'payload'

export type UpsertAction = 'created' | 'updated' | 'skipped-dry-run'

export interface UpsertResult<T> {
  doc: T | null
  id: string | null
  action: UpsertAction
}

interface UpsertOptions {
  payload: Payload
  collection: CollectionSlug
  where: Where
  data: Record<string, unknown>
  dryRun: boolean
  /** For draft-enabled collections (e.g. Projects) — needs-research stubs go in as drafts. */
  draft?: boolean
}

/**
 * Idempotent upsert keyed by a `where` clause (slug, DOI, normalized name,
 * etc.) rather than an ID, since re-running the hydrate script must find the
 * same record it created last time without tracking IDs across runs.
 *
 * In `--dry-run`, existence is still checked against the real DB (read-only,
 * harmless) so the preview counts are accurate, but no write happens. A
 * `DRY_RUN_PLACEHOLDER:<collection>` id is returned for records that would
 * be newly created, so downstream relationship resolution in the same dry
 * run has something to point at.
 */
export async function upsertByKey<T = Record<string, unknown>>({
  payload,
  collection,
  where,
  data,
  dryRun,
  draft,
}: UpsertOptions): Promise<UpsertResult<T>> {
  // The existence check must find a matching record regardless of its
  // current draft/published state — otherwise a project first imported as
  // a needs-research draft would never be found once the source data drops
  // the flag, and re-running would wrongly `create` a duplicate instead of
  // publishing the existing doc. `draft: true` returns the latest version
  // (draft or published) on drafts-enabled collections; it's a no-op
  // elsewhere, since Payload only honors it when the collection config
  // actually has versions.drafts enabled.
  const existing = await payload.find({
    collection,
    where,
    limit: 1,
    overrideAccess: true,
    draft: draft !== undefined ? true : undefined,
  })

  if (existing.docs.length > 0) {
    const doc = existing.docs[0] as { id: string }
    if (dryRun) {
      return { doc: doc as T, id: doc.id, action: 'skipped-dry-run' }
    }
    const updated = await payload.update({
      collection,
      id: doc.id,
      data,
      overrideAccess: true,
      draft,
      // Scripts run outside a Next.js request — revalidatePath() would throw
      // "static generation store missing" without this.
      context: { disableRevalidate: true },
    })
    return { doc: updated as T, id: (updated as { id: string }).id, action: 'updated' }
  }

  if (dryRun) {
    return {
      doc: null,
      id: `DRY_RUN_PLACEHOLDER:${collection}:${Math.random()}`,
      action: 'skipped-dry-run',
    }
  }

  const created = await payload.create({
    collection,
    data,
    overrideAccess: true,
    draft,
    context: { disableRevalidate: true },
  })
  return { doc: created as T, id: (created as { id: string }).id, action: 'created' }
}
