# DIAL frontend

DIAL's public site. It moves to its own `dial-site` repo at roadmap step 3 (ADR-0003).

## Data

`src/lib/dial/data/index.ts` and `views.ts` are factories over one corpus load per request. Don't split them into per-query fetches without a measured need. Citations (ACM by default, plus APA and BibTeX) are generated server-side with citation-js in `src/lib/dial/cite.ts`, using a vendored ACM CSL. Hand-written `citationText` isn't shown. List rows fetch `/publications/<id>/cite` lazily.

## Design rules

- A hovered link gets at most one word signal (a squiggle, or a margin rule on long titles) and one mark signal (`.mark-lift` or an arrow turn).
- Hover backgrounds never darken. Hover styles apply only under `(hover: hover) and (pointer: fine)`, which also stops an iOS long-press painting the squiggle solid.
- The squiggle marks links only, never page titles.
- The megamenu opens instantly: a 75ms intent delay and no animation.
- `sectionSpacing` (`py-12 md:py-16`) is the only section rhythm. The first section under a header uses `pt-0`.
- The home scroll hero's root is `overflow-clip`.
- The reference is `/design-system`.
- UI is shadcn `base-nova` on Base UI. cmdk, Vaul, Sonner, React Day Picker and the charts stay independent libraries.
