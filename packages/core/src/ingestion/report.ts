import fs from 'node:fs'
import path from 'node:path'
import type { CollectionSlug } from 'payload'
import type { UpsertAction } from './upsert'

interface UnmatchedRelation {
  collection: CollectionSlug
  field: string
  sourceContext: string
  value: string
  /** Structured payload persisted on the Review Item, e.g. the Crossref candidates a search didn't apply. */
  data?: Record<string, unknown>
}

interface DedupeSuggestion {
  collection: CollectionSlug
  field: string
  sourceContext: string
  value: string
  suggestedMatch: string
  // Structured payload for person-merge suggestions, so the review queue can
  // act on real Team ids instead of parsing them out of the display strings.
  // Optional: dry runs carry placeholder ids, and older persisted summaries
  // predate these fields.
  newTeamId?: string
  existingTeamId?: string
  score?: number
  /**
   * Why this was raised. Absent means a fuzzy name similarity. The conflict
   * reasons mean an ORCID or DBLP pid on the paper matched a Team Member
   * whose name can't be the printed author's (people.ts matchPersonToTeam).
   */
  reason?: 'orcid-name-conflict' | 'dblp-pid-name-conflict'
  /** The conflicting ORCID or DBLP pid. */
  identifier?: string
}

/**
 * The record a write site would have written (or did write). Kept so a dry
 * run can be judged on what it *would produce*, not only on its counts — see
 * `writePreview` and scripts/ingestion/preview-report.ts.
 */
export interface CapturedRecord {
  collection: CollectionSlug
  /** Real id, or a DRY_RUN_PLACEHOLDER id that other captured records reference. */
  id: string | null
  action: UpsertAction
  sourceContext: string
  data: Record<string, unknown>
}

export class ImportReport {
  private counts: Record<string, Record<UpsertAction, number>> = {}
  private unmatched: UnmatchedRelation[] = []
  private suggestions: DedupeSuggestion[] = []
  private captured: CapturedRecord[] = []

  record(
    collection: CollectionSlug,
    action: UpsertAction,
    capture?: { id: string | null; data: Record<string, unknown>; sourceContext: string },
  ) {
    const key = collection
    if (!this.counts[key]) {
      this.counts[key] = { created: 0, updated: 0, 'skipped-dry-run': 0, 'skipped-existing': 0 }
    }
    this.counts[key][action]++
    if (capture) this.captured.push({ collection, action, ...capture })
  }

  flagUnmatched(entry: UnmatchedRelation) {
    this.unmatched.push(entry)
  }

  /**
   * A non-blocking, never-auto-applied suggestion — e.g. a fuzzy name match
   * between a new customAuthor and one seen on an earlier publication. Always
   * surfaced for human review, never merged automatically (see people.ts).
   */
  suggestDedupe(entry: DedupeSuggestion) {
    this.suggestions.push(entry)
  }

  print(dryRun: boolean) {
    console.log(`\n--- Import report${dryRun ? ' (dry run)' : ''} ---`)
    for (const [collection, actions] of Object.entries(this.counts)) {
      const parts = Object.entries(actions)
        .filter(([, n]) => n > 0)
        .map(([action, n]) => `${n} ${action}`)
      console.log(`${collection}: ${parts.join(', ') || 'no changes'}`)
    }

    if (this.unmatched.length > 0) {
      console.log(`\n--- Unmatched relations (${this.unmatched.length}) ---`)
      for (const entry of this.unmatched) {
        console.log(
          `[${entry.collection}.${entry.field}] "${entry.value}" — ${entry.sourceContext}`,
        )
      }
    } else {
      console.log('\nNo unmatched relations.')
    }

    if (this.suggestions.length > 0) {
      console.log(`\n--- Suggestions (${this.suggestions.length}) ---`)
      for (const entry of this.suggestions) {
        console.log(
          `[${entry.collection}.${entry.field}] "${entry.value}" ~ "${entry.suggestedMatch}" — ${entry.sourceContext}`,
        )
      }
    }
  }

  toJSON() {
    return { counts: this.counts, unmatched: this.unmatched, suggestions: this.suggestions }
  }

  writeJson(filePath: string) {
    fs.writeFileSync(filePath, JSON.stringify(this.toJSON(), null, 2))
  }

  /**
   * Writes the report plus every captured record to `ingestion-previews/`
   * (gitignored) and returns the path. The file is the input to
   * scripts/ingestion/preview-report.ts; it is meant to be summarised, not read.
   */
  writePreview(label: string, meta: Record<string, unknown> = {}): string {
    const dir = path.resolve(process.cwd(), 'ingestion-previews')
    fs.mkdirSync(dir, { recursive: true })
    const stamp = new Date().toISOString().replace(/[:.]/g, '-')
    const safeLabel = label.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
    const filePath = path.join(dir, `${stamp}-${safeLabel}.json`)
    fs.writeFileSync(
      filePath,
      JSON.stringify(
        { meta: { label, ...meta }, ...this.toJSON(), captured: this.captured },
        null,
        2,
      ),
    )
    return filePath
  }
}
