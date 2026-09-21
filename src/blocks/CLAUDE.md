# Blocks Directory — Conventions

The shadcnblocks page-builder block library was removed from LabKit. What remains here
renders collection content, not pages:

**Collection template renderers** (`Component.tsx` + variant `.tsx` files, no `config.ts`)
`BlogPost/` (+ `CaseStudy/`, one of its design versions), `RelatedPosts/` — render a Post
as a full detail page. Schema lives on the collection. Entry point: `RenderPostDetailPage.tsx`.
`RenderProjectDetailPage.tsx` is a minimal stand-in for Projects until the dial-test port
(AUT-147); the template's `ProjectPost/` case-study renderer was removed in the schema freeze
(ADR-0002).

**Rich-text embed blocks** (`config.ts` + `Component.tsx`)
`Code/`, `MediaBlock/`, `LexicalBlocks/Banner`, `LexicalBlocks/MotionText` — registered via
`BlocksFeature` in Posts/Projects richText editors (and the hero config for MotionText),
rendered by `src/components/RichText/serialize.tsx`.

## Adding a new blog post template

1. Create `src/blocks/BlogPost/blogpost6.tsx`
2. Add `BLOGPOST6` to `allPostDesignVersions` in `src/collections/Posts/index.ts`
3. Register in `src/blocks/BlogPost/Component.tsx`

No `config.ts` or `variants.ts` needed.
