# SQLite and Turso setup

LabKit starts with a fresh database. The old MongoDB records and the
`dial-fixtures` prototype are not launch data and are not imported. Payload
3.90.1 uses `@payloadcms/db-sqlite` with text UUID IDs. Local development uses
`TURSO_DATABASE_URL=file:./labkit.db`; production uses a `libsql://` Turso URL
and `TURSO_AUTH_TOKEN`.

## Local development

1. `bun install && cp .env.example .env`; set a unique `PAYLOAD_SECRET`.
2. `bun run payload migrate` creates `labkit.db` from the committed SQL
   migration. `bun run payload migrate:status` confirms it is applied.
3. `bun run dev` starts the site and creates the two default Roles. Create the
   first Lab Editor account at `/admin`, then add reviewed DIAL records.

Development schema push is available for iteration. The committed migration is
the production schema source. Create a new migration for every later schema
change; apply it before starting the corresponding production release.

## Backups and restore

`bun run backup` uses SQLite's online `.backup` command and prints an ignored
backup file path. To restore locally, stop the app, choose a **new** `file:`
database URL, then run `bun run backup:apply -- <backup-file>`. The restore
refuses to overwrite an existing file. Check the copy with
`sqlite3 <restored-file> 'PRAGMA integrity_check;'` before starting Payload.

For Turso, create a dated database branch before each schema migration:
`turso db branch <source-database> <target-database>`. Verify it by checking
table counts. For an off-service copy, use
`turso db export <name> --output-file backup/<name>.db` and keep the `.db`
with its `.db-wal` if present. Materialize a consistent file with
`sqlite3 backup/<name>.db ".backup 'backup/<name>-complete.db'"`, then run
`PRAGMA integrity_check`. Create a restored Turso database with
`turso db create <restore-name> --from-file backup/<name>-complete.db --wait`.
Restore traffic by switching the deployment URL and token to the verified
branch or restored database, then restarting the app.

Uploaded Media files are separate from database records. Keep
`BLOB_READ_WRITE_TOKEN` for durable deployed storage; back up and restore
`public/media/` separately when local files are used.

## Production launch steps

The launch database is built and reviewed locally, then uploaded to Turso once.
It is not seeded from code: the reviewed database file is the artifact. After
launch, production is the source of truth and data only flows down
(`turso db export`), never up again.

1. Set `BLOB_READ_WRITE_TOKEN` in the local `.env` **before** writing any
   records, so Media uploads land in Vercel Blob. Without it Media is stored in
   `public/media/`, which the deployment cannot serve.
2. Create a fresh, migration-only local database. `PAYLOAD_DB_PUSH=false` stops
   schema push, which would otherwise add a `dev` row to `payload_migrations`
   that `migrate` then warns about in production. Keep it set for every command
   against this file, including `bun run dev` for the admin review:
   ```bash
   export TURSO_DATABASE_URL=file:./data/dial-launch.db PAYLOAD_DB_PUSH=false
   bun run payload migrate
   ```
3. Mark reviewed manifest rows `confirmed`, then write them:
   `bun run payload -- run scripts/ingestion/write-dial-confirmed.ts dry-run`,
   then without `dry-run`. This puts the ORCID owner and the roster's alternate
   names in place before the imports.
4. Run the reviewed ORCID selection and the Google Scholar BibTeX import, then
   run `write-dial-confirmed.ts` again to link Projects to the imported
   Publications. Work the Review Items in local `/admin`.
5. Check the file: `sqlite3 data/dial-launch.db "select name, batch from
   payload_migrations"` shows only committed migrations (no `batch = -1` row),
   and `bun run payload migrate:status` shows nothing pending. Stop the app, take
   a consistent copy with `sqlite3 data/dial-launch.db ".backup
   'backup/dial-launch.db'"`, and run `PRAGMA integrity_check` on the copy.
6. Upload it: `turso db create <name> --from-file backup/dial-launch.db --wait`.
   Get its URL with `turso db show --url <name>` and a token with
   `turso db tokens create <name>`.
7. Set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`, a
   strong `PAYLOAD_SECRET`, and the other production secrets in
   `.env.example` in Vercel. Run `bun run payload migrate:status` against Turso
   before deploying. Production has `push: false`.
8. Deploy. Verify admin login and editing; `/`, `/people`, `/publications`, a
   Publication detail route; uploaded Media; and the imports job queue before
   moving traffic. Keep a Turso branch for rollback.

Payload's multi-operation SQLite transactions are disabled. An overlapping
import watchdog regression produced `SQLITE_BUSY_SNAPSHOT` with both deferred
and immediate transactions; all 13 queue checks passed with the adapter
default. A failed hydration can leave a partial Publication graph. The
Operator should inspect its Import Run and Review Items before retrying.

No production database was created or changed during this repository migration.
