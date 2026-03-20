# Codebase Split: Extract Base Template

**Priority:** After MVP — do not start until research templates are done
**Area:** DevOps

## Context

Once the research MVP is complete, extract the generic base template by removing research-specific modules. This becomes the foundation for DAY and future agency clients.

## Prerequisites

- [ ] Task 02 done (research modules manifest exists)
- [ ] Task 03 done (block registry exists)
- [ ] Research MVP deployed and stable for DIAL

## Tasks

- [ ] Create a new repo (or branch) for the base template
- [ ] Remove everything listed in RESEARCH_MODULES.md
- [ ] Remove research-specific blocks from RenderBlocks.tsx and Pages config
- [ ] Clean up payload.config.ts (remove research collections/globals)
- [ ] Verify the base template builds and runs cleanly (`pnpm tsc`, `pnpm lint`, `pnpm build`)
- [ ] Update CLAUDE.md and docs for the base template context
- [ ] Decide on naming for the base template repo

## Done when

Two repos exist: one is the research product, one is a clean block-based website builder template.
