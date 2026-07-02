import fs from 'node:fs'
import type { CollectionSlug } from 'payload'
import type { UpsertAction } from './upsert'

interface UnmatchedRelation {
  collection: CollectionSlug
  field: string
  sourceContext: string
  value: string
}

export class ImportReport {
  private counts: Record<string, Record<UpsertAction, number>> = {}
  private unmatched: UnmatchedRelation[] = []

  record(collection: CollectionSlug, action: UpsertAction) {
    const key = collection
    if (!this.counts[key]) {
      this.counts[key] = { created: 0, updated: 0, 'skipped-dry-run': 0 }
    }
    this.counts[key][action]++
  }

  flagUnmatched(entry: UnmatchedRelation) {
    this.unmatched.push(entry)
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
  }

  writeJson(filePath: string) {
    fs.writeFileSync(
      filePath,
      JSON.stringify({ counts: this.counts, unmatched: this.unmatched }, null, 2),
    )
  }
}
