/**
 * One-time backfill: run this against any existing (non-fresh) database
 * BEFORE deploying a schema version that adds `unique: true` to a
 * previously-non-unique field.
 *
 * Why this can't just be a Payload beforeChange hook: Payload/Mongoose
 * builds the unique index during connection setup (`ensureIndexes()` inside
 * the db-mongodb adapter's `connect()`), which runs before any application
 * code — including onInit hooks — gets a chance to run. If the collection
 * already has multiple documents with `''` (empty string, not absent) in a
 * field that's about to become `unique: true`, index creation throws a
 * duplicate-key error and `getPayload()` never resolves. By the time a
 * Payload-based fixup script could run, the crash has already happened.
 *
 * This script sidesteps that entirely by talking to MongoDB directly with
 * the native driver — no Payload, no Mongoose schema, no index sync — so it
 * can safely normalize legacy `''` values to "field absent" (via $unset)
 * ahead of the index ever being built.
 *
 * Run: bun run payload -- run scripts/migrations/backfill-unique-fields.ts
 * (No DB access happens via Payload — `payload run` is used here purely for
 * its .env loading + TS support, not for its Local API.)
 */
import { MongoClient } from 'mongodb'

const MONGODB_URI = process.env.MONGODB_URI
if (!MONGODB_URI) {
  throw new Error('MONGODB_URI is not set')
}

// Every field this repo has added `unique: true` to that was previously
// unconstrained. Keep this list in sync with src/collections/*/index.ts.
const TARGETS: Array<{ collection: string; field: string }> = [
  { collection: 'publications', field: 'doi' },
  { collection: 'publications', field: 'openalex_id' },
  { collection: 'team', field: 'orcid' },
  { collection: 'team', field: 'openalex_id' },
  { collection: 'venues', field: 'openalex_id' },
  { collection: 'organizations', field: 'ror_id' },
  { collection: 'organizations', field: 'openalex_id' },
]

async function main() {
  const client = new MongoClient(MONGODB_URI!)
  await client.connect()
  const db = client.db()

  console.log('Backfilling empty-string values on soon-to-be-unique fields...\n')

  for (const { collection, field } of TARGETS) {
    const result = await db
      .collection(collection)
      .updateMany({ [field]: '' }, { $unset: { [field]: '' } })
    console.log(`${collection}.${field}: ${result.modifiedCount} document(s) normalized`)
  }

  await client.close()
  console.log('\nDone. Safe to deploy the unique-index schema change now.')
  process.exit(0)
}

await main().catch((err) => {
  console.error(err)
  process.exit(1)
})
