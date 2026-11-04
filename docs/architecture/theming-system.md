# Theming System

This doc is intentionally short because the theming system is in flux. Treat the code as the source of truth for implementation details.

## What exists today

LabKit currently uses a CMS-driven theme layer:

- a Payload global stores theme values
- a frontend component injects CSS variables
- the app reads those variables in its styling layer
- theme preference is toggled on the client

The design goal is simple: editors should be able to change brand-level styling without touching code.

## What is stable

These parts still appear to be the lasting intent:

- theme values live in content, not hardcoded per deployment
- the system is built around CSS variables, not one-off component overrides
- light and dark variants are meant to be centrally managed

## What is probably not trustworthy in old docs

Do not rely on older claims that the system is fully stable or fully aligned with the broader shadcn ecosystem. The implementation is being revisited, and parts of the previous writeup were too detailed for a moving target.

In particular, verify in code before assuming:

- exact variable coverage
- dark mode behavior
- compatibility with imported shadcn theme presets
- admin editing UX quality

## Source of truth

When working on theming, inspect the actual implementation:

- `packages/core/src/template/globals/ThemeConfig/` (schema) and `src/globals/ThemeConfig/` (rendering)
- `src/providers/Theme/`
- frontend `globals.css`

This doc should stay focused on intent and major constraints, not file-by-file mechanics.
