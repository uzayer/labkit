# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LabKit is a PayloadCMS content platform for research lab websites: research-domain collections (Publications, Grants, Awards, Team, etc.) with a shadcn/ui frontend. Originally built on the [shadcnblocks Payload template](https://docs.shadcnblocks.com/payload/getting-started/); the page-builder block library was removed. The `dial-test/` directory holds a standalone static design prototype that is being ported in as the lab site frontend (see Frontend below).

Generic website-builder concerns belong upstream with the template; this repo should stay focused on LabKit-specific product and implementation work.

Before starting nontrivial work, read `LOG.md` — a running record of non-obvious product/architecture decisions and the reasoning behind them. It catches things a fresh read of the code can't (why a rejected approach was rejected, what a prior session confirmed against real data). **Do not read it whole.** Entries are newest-first, so read from the top and stop once you have the context you need; older material is in `docs/LOG-ARCHIVE.md` and is usually not worth opening. When you make or learn a decision that isn't obvious from the diff alone, add an entry **at the top**, under today's date.

Also read @CONTEXT.md — the domain glossary. Use its terms exactly; it is opinionated about which words to avoid. `LOG.md` is chronological (_why_ a decision was made), `CONTEXT.md` is structural (_what a word means today_), and `docs/adr/` holds standing architectural decisions.

**Current scope (decided 2026-08-18): the MVP is "DIAL's public website is live," and nothing else.** See the MVP section at the top of @docs/product/ROADMAP.md for what is in and — more importantly — what is explicitly out. This project's dominant failure mode is scope creep; if a task doesn't move DIAL's site toward launch, it isn't MVP work.

## Commands

```bash
bun run dev                 # Dev server (Turbopack)
bun run build               # Generate types + Next.js build
bun run tsc                 # Type check only
bun run lint                # oxlint
bun run lint:fix            # oxlint --fix
bun run format              # oxfmt
bun run format:check        # oxfmt --check
bun run generate:types      # Regenerate src/payload-types.ts
bun run generate:importmap  # Regenerate Payload admin import map
bun run dev:debug           # Dev with Node inspector
bun run backup              # Consistent local SQLite backup
bun run backup:apply -- <file> # Restore into a new local SQLite file
bun run payload migrate     # Apply committed SQL migrations before production startup
bun install                 # Install locked dependencies
```

Ingestion and migration scripts run through Payload's own runner, not `tsx`/`node`:

```bash
bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]
bun run payload -- run scripts/ingestion/import-bibtex.ts <file.bib> [dry-run]
bun run payload -- run scripts/ingestion/import-citations.ts <file.txt> [dry-run]
bun run payload -- run scripts/ingestion/probe-doi.ts <doi>...    # onboarding diagnostic
bun run payload -- run scripts/ingestion/verify-jobs-queue.ts     # jobs-queue regression check (writes only bookkeeping)
```

**`payload run` swallows flags.** It parses argv through minimist and forwards only _positional_ args, so `--dry-run` silently vanishes — every script takes the bare word `dry-run` instead. It also exits after module evaluation without awaiting a floating promise: script entrypoints must use top-level `await main()`, never `void main()`.

No test framework is configured. Verify changes with `bun run tsc` and `bun run lint`, plus `verify-jobs-queue.ts` on a throwaway SQLite database when touching the ingestion job path (13 live checks: contention, stale-lease takeover, checkpoint visibility, watchdog drain).

**What the checks don't cover:** the root `tsconfig.json` excludes `scripts/` and `dial-test/`, and `.oxlintrc.json` ignores `dial-test/**` and `docs/**`. So `bun run tsc` does _not_ type-check the ingestion scripts — use `bun run tsc -- -p scripts/tsconfig.json` for those.

**`dial-test/` is a separate app, not part of this build.** It has its own `package.json`, `node_modules`, lockfiles, and `CLAUDE.md`, and is excluded from the root typecheck, lint, and Next build. Run its commands from inside that directory.

`bun install` is the sanctioned install. The root `bun.lock` is the single source of dependency resolution, and `trustedDependencies` in `package.json` allowlists native build scripts.

A Husky `pre-commit` hook runs `oxlint --fix` + `oxfmt` on staged files (lint-staged) and `commit-msg` enforces Conventional Commits via commitlint — a non-conforming commit message is rejected, not just warned about.

## Git Commit Guidelines

**CRITICAL: NEVER add Claude or any AI assistant as a co-author in git commits.**

Do not include `Co-Authored-By: Claude` or any similar attribution in commit messages. All commits should be authored solely by the human developer.

This is a strict policy. Violating it requires rewriting git history to remove the unwanted attributions.

## Architecture

### Rendering

The page-builder layout system was removed. Pages are now Hero + SEO only (70+ hero variants in `src/heros/config.ts`, dispatched by `src/heros/RenderHero.tsx`). The template renderer for Pages and Posts (`src/blocks/RenderPostDetailPage.tsx`, `RenderProjectDetailPage.tsx`) is parked with the template catch-all in `src/app/(frontend)/_template-pages/` and does not route (see Routing). The only remaining `blocks` fields are richText embeds (Code, MediaBlock, Banner, MotionText). See `src/blocks/CLAUDE.md`.

### Collections & Globals

See `src/payload.config.ts` for the authoritative list. Beyond the base template (Pages, Posts, Media, Categories, Users, Roles), this repo adds: **ResearchThemes, Projects, Publications, Team, Awards, Organizations, Venues, Grants, News** (the LabKit research-domain collections) plus **ImportRuns, ReviewItems** — bookkeeping for the ingestion pipeline (see below).

Globals: **ThemeConfig, Header, Footer, PageConfig, LabInfo**.

The research collections set `admin.group` so the Payload sidebar reads as a deliberate v1 dashboard: **Research** (Publications, Projects, Team, Grants, Awards, ResearchThemes, News), **Reference Data** (Venues, Organizations), **Import** (ImportRuns, ReviewItems). The base-template collections are deliberately left ungrouped. Any new research-domain collection should pick one of these three groups rather than inventing a fourth.

### Routing

The public site is DIAL's: `src/app/(frontend)/(dial)/` is its own root layout and owns `/`. Its `[...slug]` catch-all follows Payload redirects, then renders DIAL's 404. The template's Pages/Posts catch-all (formerly `[[...slugs]]`, which also matched `/`) was moved to the private folder `src/app/(frontend)/_template-pages/`. It still compiles and its `globals.css` is still imported by `early-access` and `(frontend)/not-found.tsx`, but it generates no routes. `/admin`, `/api`, `/next/*` and `/early-access/labkit` are unchanged.

### Access control

Role-based via `Users` ↔ `Roles` (many-to-many). Permission flags: `canManageContent`, `canPublish`, `canManageUsers`, `canManageRedirects`. Use `hasPermission()` from `src/utilities/checkPermission.ts`.

**Gotcha:** Roles must be **populated** (not string IDs) for permission checks to work. The system warns on string IDs.

### Ingestion pipeline

`src/lib/ingestion/` is the engine that pulls Publications (and the Venues/Organizations/Team records they reference) from external sources — ORCID, DOI/Crossref/OpenAlex, DBLP, BibTeX, and citation-list paste (LLM-assisted via `llm.ts`, Gemini-gated). Front doors are `scripts/ingestion/{import-orcid,import-citations,import-bibtex}.ts`, all funneling into the same `hydratePublicationFromDoi`/`hydratePublicationFromFields` core in `publications.ts`. Runs are tracked in the `ImportRuns` collection (immutable history) and flagged items land in `ReviewItems` (a mutable work queue) via `run-persistence.ts`. The async path (`src/lib/ingestion/jobs/import-hydrate.ts`, registered under `jobs.tasks` in `payload.config.ts`) uses a lease-lock + watchdog crash-recovery model, not Payload's default job retry — see `docs/LOG-ARCHIVE.md` (2026-07-05) for why and how. Person-matching is deliberately conservative (ORCID/DBLP-exact or exact-name only, never fuzzy) — see the safety-tier notes at the top of `people.ts`.

### Frontend

The live frontend is the DIAL site in `src/app/(frontend)/(dial)/`, ported from the `dial-test/` prototype (2026-09-23). Every public route renders on request from Payload (`force-dynamic`).

- **Data:** `src/lib/dial/data/load.ts` reads every public record in one Local API pass (`overrideAccess: false`) and flattens it to the prototype's record shapes (`types.ts`). `index.ts` (lookups/joins) and `views.ts` (view models) are factories over those records, and `getDial()` in `get.ts` builds them once per request with React `cache`. Pages call `const { … } = await getDial()`. The corpus is small enough that loading it all per request is the design, not a shortcut.
- **Prose** (stable copy, per ROADMAP's "split routes by churn") stays in code: page copy, `faqs.ts`, and `lab-info.ts` (`DIAL_PROSE`, for values LabInfo has no field for). The nine `/research/<slug>` routes are hardcoded and resolve their Research Theme by slug.
- **Components** live in `src/components/dial/`, with their own Base UI `ui/` copies so the DIAL styling is independent of the root `src/components/ui/`. Lib code is in `src/lib/dial/`. The CSS (`(dial)/globals.css`) scans only those folders and its own routes.
- **Contact** posts to `form-submissions` against a Form titled `Contact` (honeypot plus Turnstile when configured).
- `dial-test/` stays as the visual reference, and its fixtures are the source for `scripts/dev/seed-dial-fixtures.ts` (seed a _throwaway_ database for side-by-side comparison). Keep them small; real launch data comes from the ingestion pipeline.

### Dashboard

**There is no live custom dashboard. Both are parked, and neither routes.** `/admin` (Payload) is the only real admin surface.

- `src/app/_dashboard-kit/` — the shadcnblocks Admin Kit template shell (147 files), adopted wholesale as the _eventual_ internal dashboard. Most routes (dashboard-1/2/3, tasks, users, developers, settings) are still template scaffolding; only auth (`login`) was ever wired to Payload.
- `src/app/_dashboard-legacy/` — the previously-working v1 dashboard (import wizard, review queue, runs, people, publications, LabInfo settings), intact and importable.

Both are Next.js private folders (`_`-prefixed): they compile and their exports are importable, but they generate no routes. The kit was moved out of `(dashboard)` because `/dashboard/login` plus unwired register/forgot-password stubs are a support liability on a real lab's production site.

**Do not delete either.** `_dashboard-kit` is genuinely diverged from the upstream checkout at `~/Developer/web/shadcn-admin` (Payload auth wiring, zod v4 / react-day-picker v9 adaptations, `/dashboard` route-prefix rewrite) — deleting means redoing that work from a v3-era template. Don't assume a feature is live in one just because it exists in the other; as of 2026-08-18 the port between them is **out of MVP scope entirely**.

## Gotchas & Non-obvious Behavior

- **Tailwind bg-\* classes:** `RenderBlocks.tsx` has a manual switch statement enumerating every `bg-{color}` class so Tailwind's compiler includes them. If you add a new theme color, you must add a case there too.
- **`overrideAccess` defaults to `true`** in Payload's Local API — always set `overrideAccess: false` when access control should apply.
- **Conditional fields:** Blocks hide/show fields based on `designVersion` using `admin.condition`. Pattern: `condition: (_, { designVersion = '' } = {}) => ['1', '2'].includes(designVersion)`.
- **Bun installs; Node runs.** `bun install` is the supported installer; Node runs Next.js, Payload, TypeScript, and all project CLIs. Native build scripts are explicitly allowlisted in `package.json`'s `trustedDependencies`.
- **TypeScript:** `strict: false` but `strictNullChecks: true`. ESLint has `no-explicit-any: off` and `no-unused-vars: off` (uses `unused-imports` plugin instead).
- **Localization:** English enabled, German commented out. Both admin i18n and content localization configured in `src/localization.config.ts`.
- **Default roles** are auto-created on startup via `onInit` → `initializeRoles()`.
- **Nested docs URL generation:** Runs on save. Changing the `generateURL` function in config requires re-saving all pages to update URLs.
- **Turnstile on form submissions:** `src/app/(payload)/api/[...slug]/route.ts` wraps `POST` for `form-submissions` with Cloudflare Turnstile verification when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. The middleware is in the catch-all API route, not the Form block component — easy to miss. Frontend must send a `cf-turnstile-token` header or the request is silently rejected with 400.
- **Standalone form components ≠ Payload forms:** Components in `src/components/` like `contact10.tsx`, `waitlist*.tsx`, and `wishlist*.tsx` use react-hook-form but only `console.log` on submit. They are **not** wired to Payload's `form-submissions` collection. To wire them up, see @docs/guides/forms.md.
- **Tailwind v4 arbitrary-value syntax silently produces no CSS:** vendored/older shadcn components use `w-[--sidebar-width]`-style syntax; Tailwind v4 only recognizes the parenthesized form `w-(--sidebar-width)` as `var()` shorthand. The bracket form compiles and lints clean but generates zero CSS — a real, previously-shipped bug. Grep for `-[--` when importing any older shadcn component. See `docs/LOG-ARCHIVE.md` (2026-07-05).

## Code style

- Use `@/` imports (maps to `src/*`). `@payload-config` maps to `src/payload.config.ts`.
- Functional components, named exports, TypeScript interfaces over types.
- Prefer React Server Components; minimize `'use client'`.
- ES modules (`type: "module"` in package.json).

## Environment

See `.env.example` for all variables. Local SQLite uses `TURSO_DATABASE_URL=file:./labkit.db`; production requires a `libsql://` URL and `TURSO_AUTH_TOKEN`. See `docs/operator/turso-cutover.md` for migrations, backups, and cutover. `PAYLOAD_SECRET`, `NEXT_PRIVATE_DRAFT_SECRET`, and `REVALIDATION_KEY` remain required where configured. `NEXT_PUBLIC_SERVER_URL` auto-derives from Vercel or defaults to `http://localhost:3000`.

Node: `>=24`. Bun: `1.4.2` (pinned via `packageManager`).

## Context7

IMPORTANT: Always use Context7 MCP tools for code generation, setup, or library/API documentation — resolve library IDs and fetch docs automatically without being asked.

Library IDs: Next.js `/vercel/next.js`, React `/facebook/react`, Tailwind CSS `/websites/tailwindcss`.

**PayloadCMS:** Use the `payload` skill instead of Context7 — it has bundled reference docs (fields, hooks, access control, queries, adapters) that are faster and more targeted than ctx7 lookups.

## Agent skills

### Issue tracker

Linear, via the `linear-autana` MCP — `autana systems` team, `LabKit` project. See `docs/agents/issue-tracker.md`.

### Triage labels

4 labels total: state labels ready-for-agent/ready-for-human plus category labels Bug/Feature. The skills' other three state roles (needs-triage/needs-info/wontfix) map to workflow state, not a label. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context — no monorepo signals. See `docs/agents/domain.md`.

## Further reading

- @CONTEXT.md — domain glossary: canonical terms and words to avoid
- `LOG.md` — decision log: why, not just what. Newest-first; read from the top, not whole
- `docs/LOG-ARCHIVE.md` — older decisions (2026-07 and earlier); open only when `LOG.md` falls short
- @docs/adr/ — standing architectural decisions (0001: why CERIF alignment is deferred)
- @docs/product/ROADMAP.md — **start here for scope**: the MVP definition and what's explicitly out
- @docs/product/VISION.md — product vision, positioning, competitive landscape
- @docs/architecture/data-schema.md — data schema
- @docs/architecture/theming-system.md — theming implementation
- @docs/guides/forms.md — form submissions system, wiring standalone forms to Payload
- @docs/agents/issue-tracker.md — Linear issue tracker config for agent skills
- @docs/agents/triage-labels.md — triage label vocabulary mapping
- @docs/agents/domain.md — domain doc consumer rules for agent skills

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
