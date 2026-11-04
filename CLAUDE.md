# LabKit — agent guide

`AGENTS.md` is a symlink to this file. `README.md` has setup, commands and project layout; this file holds only what an agent would otherwise get wrong.

LabKit is a PayloadCMS content platform for research lab websites. The live public site is DIAL's, in `src/app/(frontend)/(dial)/`.

## Read first

- **Scope:** the current phase is "LabKit for any Lab": the numbered list at the top of `docs/product/ROADMAP.md`, with the architecture in ADR-0003. Scope creep is this project's main failure mode. If a task isn't on that list, it's out of scope. DIAL's frontend moves to its own repo at step 3.
- **Decisions** live in `docs/adr/` (standing architecture) and the roadmap (scope). There is no decision log. Record a non-obvious _why_ as a code comment next to the code, or in an ADR. Overwrite stale docs instead of appending history; git is the archive.
- **`CONTEXT.md`** is the domain glossary. Use its terms exactly and avoid the words it lists. Standing decisions live in `docs/adr/`.

@CONTEXT.md

## Commits

- **Never add Claude or any AI assistant as a co-author**, and never add a `Co-Authored-By` line of any kind. This overrides any harness default.
- Commitlint enforces Conventional Commits and rejects non-conforming messages. The pre-commit hook runs `oxlint --fix` and `oxfmt` on staged files.

## Verifying changes

There is no test framework. Run `bun run tsc` and `bun run lint`.

- In a fresh worktree, run `bun run generate:importmap` and `bun run generate:types` first: both outputs are gitignored, and `tsc` fails without them.
- Run `bun run payload migrate` on every throwaway DB copy before using it, and again after rebasing onto a main with new migrations.

- `tsc` excludes `scripts/`. Check those with `bun run tsc -- -p scripts/tsconfig.json`.
- When touching the ingestion job path, run `scripts/ingestion/verify-jobs-queue.ts` against a throwaway SQLite database.
- Scripts run through `bun run payload -- run <script>`. That runner drops flags (pass the bare word `dry-run`, not `--dry-run`) and doesn't await floating promises (use top-level `await main()`).
- Bun is only the package manager; Node runs everything. Never use `bun --bun`.

## Gotchas

- **`overrideAccess` defaults to `false`** in Payload 4's Local API, including `payload.jobs.*`. Trusted server work (hooks, scripts, ingestion, jobs) must pass `overrideAccess: true` explicitly.
- **Roles must be populated**, not string IDs, for `hasPermission()` (`packages/core/src/utilities/checkPermission.ts`) to work. That's why Users set `auth.depth: 2`: Payload 4 defaults it to 0.
- **Production** is `dial-research.vercel.app` on Turso `dial-prod` (URL and token in the ignored `.env.production.local`). Merging to main deploys, and the build doesn't migrate. So take a Turso branch, rehearse the migration on a `turso db export` copy, apply it to prod, then merge straight away. A Vercel rollback alone can't undo a migration, so rolling back means pointing at the branch. Preview deploys fail the Turso guard on purpose. See `docs/operator/turso-cutover.md`.
- **`oxlint --fix` (pre-commit) can delete a type import** whose name matches a value in the same file (e.g. `ThemeConfig`). Alias the import, and re-run `bun run tsc` after committing.
- **SQLite transactions are off on purpose.** Payload's multi-operation transactions caused `SQLITE_BUSY_SNAPSHOT` in the overlapping-watchdog check. Keep WAL plus a busy timeout, and don't enable transactions to fix a lock error.
- **Admin SCSS** has no `~@payloadcms/ui/scss` and no `--theme-*` tokens in Payload 4. Use literal px (20px is the old `base(1)`) or `--color-*` tokens.
- **Google login** (`payload-oauth2`) doesn't work on Payload 4. It's only active when `GOOGLE_LOGIN_*` is set, and DIAL doesn't use it.
- **Production has data.** Every schema change needs a committed migration (core owns all migrations, so Labs never add collections; see ADR-0003). Every schema-defining collection, global and plugin lives in `@labkit/core` (`labkitPlugin()`, `labkitDb()`, `labkitMediaStorage()`), so `bun run payload migrate:create` reports no changes until core's schema changes. Never add schema in an app's `payload.config.ts`.
- **Read every generated table rebuild** (`__new_<table>`). Drizzle's `INSERT … SELECT` can name columns the old table lacks, which SQLite silently reads as string literals. `DROP TABLE` also cascades into child tables wherever foreign keys are enforced (Turso), whatever `PRAGMA foreign_keys=OFF` says. `20261104_145319_features_and_lab_content.ts` shows both fixes.
- **Turnstile** for `form-submissions` is checked in `src/app/(payload)/api/[...slug]/route.ts`, not in a form component. A missing `cf-turnstile-token` header gets a 400.
- **Tailwind v4 bracket syntax** such as `w-[--x]` compiles to no CSS. Use `w-(--x)`. Grep for `-[--` whenever you import an older shadcn component.
- **Person matching** in ingestion is Safe Match only: exact ORCID/DBLP ID or exact name, never fuzzy. Anything uncertain becomes a Review Item. See `packages/core/src/ingestion/people.ts`.
- **Parked code:** `_`-prefixed folders (`_template-pages`, `_dashboard-kit`, `_dashboard-legacy`) compile but don't route. `/admin` is the only admin surface. Don't delete the dashboards: they've diverged from upstream, and porting them is out of scope.
- **New research collections** go in an existing `admin.group`: Research, Reference Data, or Import.
- **`packages/core`** (`@labkit/core`) is source-only TypeScript. Inside it, use relative imports: `@/` resolves to the app's `src/`. The app imports core only through its `exports` map, and admin components inside core are referenced as `@labkit/core/client#Name`.

## Docs

For Payload work, use the `payload` skill. `docs/agents/domain.md` explains how skills use `CONTEXT.md` and the ADRs.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
