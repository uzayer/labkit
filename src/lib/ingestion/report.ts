import fs from 'node:fs'
import type { CollectionSlug } from 'payload'
import type { UpsertAction } from './upsert'

interface UnmatchedRelation {
  collection: CollectionSlug
  field: string
  sourceContext: string
  value: string
}

interface DedupeSuggestion {
  collection: CollectionSlug
  field: string
  sourceContext: string
  value: string
  suggestedMatch: string
}

export class ImportReport {
  private counts: Record<string, Record<UpsertAction, number>> = {}
  private unmatched: UnmatchedRelation[] = []
  private suggestions: DedupeSuggestion[] = []

  record(collection: CollectionSlug, action: UpsertAction) {
    const key = collection
    if (!this.counts[key]) {
      this.counts[key] = { created: 0, updated: 0, 'skipped-dry-run': 0, 'skipped-existing': 0 }
    }
    this.counts[key][action]++
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
}
