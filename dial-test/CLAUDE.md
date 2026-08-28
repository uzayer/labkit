# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

@AGENTS.md

## Commands

```bash
pnpm dev       # Start dev server
pnpm build     # Production build
pnpm lint      # Run ESLint
```

No test runner is configured yet.

## Stack

- **Next.js 16.2.4** (App Router) with React 19 and React Compiler enabled (`reactCompiler: true` in `next.config.ts`)
- **Tailwind CSS v4** — configured via CSS imports in `globals.css`, not a `tailwind.config.*` file
- **shadcn/ui** — `radix-nova` style, components live in `src/components/ui/`, added via `npx shadcn add <component>`
- **shadcnblocks** registry at `https://shadcnblocks.com/r/{name}` — requires `SHADCNBLOCKS_API_KEY` env var; blocks land directly in `src/components/`
- **`@/`** path alias maps to `src/`

## Architecture

This is a minimal App Router project. All routes go under `src/app/`. Shared UI primitives go in `src/components/ui/`; page-level blocks go in `src/components/`. Utility functions live in `src/lib/utils.ts` (exports `cn` for class merging).

## Pages

### `/news`

A photo-card feed of lab activity, year-grouped with type filters.

**Types:** `academic` (conference trips, invited talks, presentations, summer schools), `event` (hosted or co-organised events — symposiums, workshops at conferences), `community` (outreach, humanitarian, professional service).

**Data model (`NewsEntry`):** `type`, `date` (ISO string), `title`, `description`, `photo?` (URL), `url?` (external link). All entries are expected to have photos in production — DIAL's photos come from exactly these moments.

**Layout:** Two sections — upcoming events as photo cards (§1, hidden when empty), past entries as a changelog-style temporal list grouped by year with type-filter pills (§2). Implemented in `src/components/news-feed.tsx` (`NewsFeed` + `UpcomingCard`).

**Needs another look:** Page hero/header section — current plain `<h1>` treatment is placeholder; pick a proper hero block later.

**Payload CMS note:** `academic` entries overlap with the Publications collection (conference presentations) but are intentionally kept in News — getting funded to travel and present is itself newsworthy for a Global South lab, and the trip photos live here. The Publications collection holds the scholarly record; News holds the lab activity record. A `relatedPublication` relationship field should be added when building the Payload News collection.

## Key conventions

- CSS theme tokens are defined as OKLCH variables in `globals.css` — do not use raw hex/rgb colors; use `var(--token)` or the mapped Tailwind tokens (`bg-background`, `text-foreground`, etc.).
- Dark mode is toggled via a `.dark` class on an ancestor (not `prefers-color-scheme`): `@custom-variant dark (&:is(.dark *))`.
- All new shadcn components should be added with `npx shadcn add <name>` rather than hand-authored, to stay consistent with the `radix-nova` style.
