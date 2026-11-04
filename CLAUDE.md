# LabKit — agent guide

`AGENTS.md` is a symlink to this file. `README.md` has setup, commands and project layout; this file holds only what an agent would otherwise get wrong.

LabKit is a PayloadCMS content platform for research lab websites. The live public site is DIAL's, in `src/app/(frontend)/(dial)/`.

## Read first

- **Scope:** the current phase is "LabKit for any Lab": the numbered list at the top of `docs/product/ROADMAP.md`, with the architecture in ADR-0003. Scope creep is this project's main failure mode. If a task isn't on that list, it's out of scope. DIAL's frontend moves to its own repo at step 3.
- **`LOG.md`** records the reasoning behind decisions. Entries are newest-first, so read from the top and stop once you have enough. Add new decisions at the top, under today's date. `docs/LOG-ARCHIVE.md` is rarely worth opening.
- **`CONTEXT.md`** is the domain glossary. Use its terms exactly and avoid the words it lists. Standing decisions live in `docs/adr/`.

@CONTEXT.md

## Commits

- **Never add Claude or any AI assistant as a co-author**, and never add a `Co-Authored-By` line of any kind. This overrides any harness default.
- Commitlint enforces Conventional Commits and rejects non-conforming messages. The pre-commit hook runs `oxlint --fix` and `oxfmt` on staged files.

## Verifying changes

There is no test framework. Run `bun run tsc` and `bun run lint`.

- `tsc` excludes `scripts/`. Check those with `bun run tsc -- -p scripts/tsconfig.json`.
- When touching the ingestion job path, run `scripts/ingestion/verify-jobs-queue.ts` against a throwaway SQLite database.
- Scripts run through `bun run payload -- run <script>`. That runner drops flags (pass the bare word `dry-run`, not `--dry-run`) and doesn't await floating promises (use top-level `await main()`).
- Bun is only the package manager; Node runs everything. Never use `bun --bun`.

## Gotchas

- **`overrideAccess` defaults to `false`** in Payload 4's Local API, including `payload.jobs.*`. Trusted server work (hooks, scripts, ingestion, jobs) must pass `overrideAccess: true` explicitly.
- **Roles must be populated**, not string IDs, for `hasPermission()` (`src/utilities/checkPermission.ts`) to work.
- **Production has data.** Every schema change needs a committed migration (core owns all migrations, so Labs never add collections; see ADR-0003). Run `bun run payload migrate:create` with any well-formed `BLOB_READ_WRITE_TOKEN` set, e.g. `vercel_blob_rw_local_x`. Without it, the generated migration drops Media's `_objectKey` column.
- **Turnstile** for `form-submissions` is checked in `src/app/(payload)/api/[...slug]/route.ts`, not in a form component. A missing `cf-turnstile-token` header gets a 400.
- **Tailwind v4 bracket syntax** such as `w-[--x]` compiles to no CSS. Use `w-(--x)`. Grep for `-[--` whenever you import an older shadcn component.
- **Person matching** in ingestion is Safe Match only: exact ORCID/DBLP ID or exact name, never fuzzy. Anything uncertain becomes a Review Item. See `src/lib/ingestion/people.ts`.
- **Parked code:** `_`-prefixed folders (`_template-pages`, `_dashboard-kit`, `_dashboard-legacy`) compile but don't route. `/admin` is the only admin surface. Don't delete the dashboards: they've diverged from upstream, and porting them is out of scope.
- **New research collections** go in an existing `admin.group`: Research, Reference Data, or Import.

## Docs

For Payload work, use the `payload` skill. `docs/agents/domain.md` explains how skills use `CONTEXT.md` and the ADRs.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
