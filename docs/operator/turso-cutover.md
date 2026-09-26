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

1. Finish the DIAL review. Only approved Publications, Team Members,
   Research Themes, Projects, and supporting records belong in the launch
   database. Prototype fixtures remain isolated.
2. Create a **new empty** Turso database. Obtain its URL with
   `turso db show --url <name>` and create a database token with
   `turso db tokens create <name>`.
3. Set `TURSO_DATABASE_URL`, `TURSO_AUTH_TOKEN`, and a strong
   `PAYLOAD_SECRET` in both the migration and deployment environments.
   Configure durable Media storage and the other production secrets in
   `.env.example`.
4. Run `bun run payload migrate`, then `bun run payload migrate:status`
   against that Turso database **before** starting the app. Production has
   `push: false`; development schema push is not a deployment step.
5. Deploy, create the first Lab Editor account, then enter or ingest only
   reviewed DIAL data. Inspect Import Runs and Review Items as each Front Door
   completes.
6. Verify admin login and editing; `/`, `/people`, `/publications`, a
   Publication detail route; uploaded Media; and the imports job queue before
   moving traffic. Keep a Turso branch and Media backup for rollback.

Payload's multi-operation SQLite transactions are disabled. An overlapping
import watchdog regression produced `SQLITE_BUSY_SNAPSHOT` with both deferred
and immediate transactions; all 13 queue checks passed with the adapter
default. A failed hydration can leave a partial Publication graph. The
Operator should inspect its Import Run and Review Items before retrying.

No production database was created or changed during this repository migration.
