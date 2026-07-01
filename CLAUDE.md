# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

LabKit is a PayloadCMS content platform for research lab websites: research-domain collections (Publications, Grants, Awards, Team, etc.) with a shadcn/ui frontend. Originally built on the [shadcnblocks Payload template](https://docs.shadcnblocks.com/payload/getting-started/); the page-builder block library was removed and lives on in the `payblocks-autana` fork (Autana Systems' agency website-builder). The `dial-test/` directory holds the standalone Next.js template that will become the lab site frontend once collections are finalized.

This repo is the current working instance (see @docs/architecture/STRATEGY.md for the upstream waterfall plan toward splitting into base template → LabKit → client instances).

## Commands

```bash
pnpm dev                    # Dev server (Turbopack)
pnpm build                  # Generate types + Next.js build
pnpm tsc                    # Type check only
pnpm lint                   # ESLint
pnpm lint:fix               # Auto-fix lint
pnpm format                 # Prettier
pnpm generate:types         # Regenerate src/payload-types.ts
pnpm generate:importmap     # Regenerate Payload admin import map
pnpm dev:debug              # Dev with Node inspector
pnpm backup                 # Export MongoDB pages → backup/pages.json
pnpm backup:apply           # Import backup/pages.json → MongoDB
```

No test framework is configured. Verify changes with `pnpm tsc` and `pnpm lint`.

## Git Commit Guidelines

**CRITICAL: NEVER add Claude or any AI assistant as a co-author in git commits.**

Do not include `Co-Authored-By: Claude` or any similar attribution in commit messages. All commits should be authored solely by the human developer.

This is a strict policy. Violating it requires rewriting git history to remove the unwanted attributions.

## Architecture

### Rendering

The page-builder layout system was removed. Pages are now Hero + SEO only (70+ hero variants in `src/heros/config.ts`, dispatched by `src/heros/RenderHero.tsx`). Posts and Projects render as full detail pages via `src/blocks/RenderPostDetailPage.tsx` / `RenderProjectDetailPage.tsx`. The only remaining `blocks` fields are richText embeds (Code, MediaBlock, Banner, MotionText) and Projects' `appendLayoutBlock` (Stats, Awards). See `src/blocks/CLAUDE.md`.

### Collections & Globals

See `src/payload.config.ts` for the authoritative list. Beyond the base template (Pages, Posts, Media, Categories, Users, Roles), this repo adds: **ResearchThemes, Projects, Publications, Team, Awards, Organizations, Venues, Grants** (the LabKit research-domain collections).

Globals: **ThemeConfig, Header, Footer, PageConfig, LabInfo**.

### Routing

`src/app/(frontend)/[[...slugs]]/page.tsx` — catch-all route. The `nestedDocsPlugin` generates hierarchical URLs from page breadcrumbs (e.g. `/parent/child`).

### Access control

Role-based via `Users` ↔ `Roles` (many-to-many). Permission flags: `canManageContent`, `canPublish`, `canManageUsers`, `canManageRedirects`. Use `hasPermission()` from `srctilities/checkPermission.ts`.

**Gotcha:** Roles must be **populated** (not string IDs) for permission checks to work. The system warns on string IDs.

## Gotchas & Non-obvious Behavior

- **Tailwind bg-\* classes:** `RenderBlocks.tsx` has a manual switch statement enumerating every `bg-{color}` class so Tailwind's compiler includes them. If you add a new theme color, you must add a case there too.
- **`overrideAccess` defaults to `true`** in Payload's Local API — always set `overrideAccess: false` when access control should apply.
- **Conditional fields:** Blocks hide/show fields based on `designVersion` using `admin.condition`. Pattern: `condition: (_, { designVersion = '' } = {}) => ['1', '2'].includes(designVersion)`.
- **`NODE_OPTIONS=--no-deprecation`** is set on all scripts via `cross-env` to suppress noisy warnings.
- **TypeScript:** `strict: false` but `strictNullChecks: true`. ESLint has `no-explicit-any: off` and `no-unused-vars: off` (uses `unused-imports` plugin instead).
- **Localization:** English enabled, German commented out. Both admin i18n and content localization configured in `src/localization.config.ts`.
- **Default roles** are auto-created on startup via `onInit` → `initializeRoles()`.
- **Nested docs URL generation:** Runs on save. Changing the `generateURL` function in config requires re-saving all pages to update URLs.
- **Turnstile on form submissions:** `src/app/(payload)/api/[...slug]/route.ts` wraps `POST` for `form-submissions` with Cloudflare Turnstile verification when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set. The middleware is in the catch-all API route, not the Form block component — easy to miss. Frontend must send a `cf-turnstile-token` header or the request is silently rejected with 400.
- **Standalone form components ≠ Payload forms:** Components in `src/components/` like `contact10.tsx`, `waitlist*.tsx`, and `wishlist*.tsx` use react-hook-form but only `console.log` on submit. They are **not** wired to Payload's `form-submissions` collection. To wire them up, see @docs/guides/forms.md.

## Code style

- Use `@/` imports (maps to `src/*`). `@payload-config` maps to `src/payload.config.ts`.
- Functional components, named exports, TypeScript interfaces over types.
- Prefer React Server Components; minimize `'use client'`.
- ES modules (`type: "module"` in package.json).

## Environment

See `.env.example` for all variables. Key ones: `MONGODB_URI`, `PAYLOAD_SECRET`, `NEXT_PRIVATE_DRAFT_SECRET`, `REVALIDATION_KEY`. `NEXT_PUBLIC_SERVER_URL` auto-derives from Vercel or defaults to `http://localhost:3000`.

Node: `^18.20.2 || ^20.9.0 || ^22.0.0 || ^23.6.0 || ^24.6.0` — pnpm 9.15.9 (enforced).

## Context7

IMPORTANT: Always use Context7 MCP tools for code generation, setup, or library/API documentation — resolve library IDs and fetch docs automatically without being asked.

Library IDs: Next.js `/vercel/next.js`, React `/facebook/react`, Tailwind CSS `/websites/tailwindcss`, MongoDB `/mongodb/mongo`.

**PayloadCMS:** Use the `payload` skill instead of Context7 — it has bundled reference docs (fields, hooks, access control, queries, adapters) that are faster and more targeted than ctx7 lookups.

## Further reading

- @docs/architecture/STRATEGY.md — upstream waterfall architecture & business model
- @docs/architecture/SCHEMA.md — data schema
- @docs/architecture/theming-system.md — theming implementation
- @docs/guides/forms.md — form submissions system, wiring standalone forms to Payload
- @docs/security-issues.md — security audit findings
