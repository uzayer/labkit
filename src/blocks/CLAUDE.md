# Blocks Directory — Conventions

The shadcnblocks page-builder block library was removed from LabKit. What remains here
renders collection content, not pages:

**Collection template renderers** (`Component.tsx` + variant `.tsx` files, no `config.ts`)
`BlogPost/` (+ `CaseStudy/`, one of its design versions), `ProjectPost/`, `RelatedPosts/` —
render a Post or Project document as a full detail page. Schema lives on the collection.
Entry points: `RenderPostDetailPage.tsx`, `RenderProjectDetailPage.tsx`.

**Rich-text embed blocks** (`config.ts` + `Component.tsx`)
`Code/`, `MediaBlock/`, `LexicalBlocks/Banner`, `LexicalBlocks/MotionText` — registered via
`BlocksFeature` in Posts/Projects richText editors (and the hero config for MotionText),
rendered by `src/components/RichText/serialize.tsx`.

**Project content blocks** (`config.ts` + `Component.tsx` + variant `.tsx` files)
`Stats/`, `Awards/` — the only blocks still selectable in a `blocks` field: Projects'
`appendLayoutBlock`. `RenderBlocks.tsx` is the (now tiny) component map for them.

## Adding a new blog post template

1. Create `src/blocks/BlogPost/blogpost6.tsx`
2. Add `BLOGPOST6` to `allPostDesignVersions` in `src/collections/Posts/index.ts`
3. Register in `src/blocks/BlogPost/Component.tsx`

No `config.ts` or `variants.ts` needed.

## Utilities

- `src/blocks/utils.ts` — `VariantManifest`, `variantsToOptions()`, `applyVariantConditions()`
  (still used by `Stats/` and `Awards/` configs)
- `src/utilities/parentLayoutCondition.ts` — parent-block lookup for admin `condition`
  functions on fields nested inside blocks (searches `appendLayoutBlock`)
