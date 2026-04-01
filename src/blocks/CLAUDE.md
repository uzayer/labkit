# Blocks Directory — Conventions

## Four patterns in this directory

**Pattern A — Design variant blocks** (`variants.ts` + `config.ts` + `Component.tsx` + variant `.tsx` files)
These are shadcnblocks page-builder blocks. Every block with a `designVersion` field belongs here.

**Pattern B — Collection template renderers** (`Component.tsx` + variant `.tsx` files, no `config.ts`)
`BlogPost/`, `ProjectPost/` — render a Post or Project document as a full detail page. Schema lives on the collection, not a block. `BlogContent/` is dead code (unwired).

**Pattern C — Payload/shadcnblocks utility blocks** (`config.ts` only, no `variants.ts`)
Single-template blocks from Payload's website template or shadcnblocks base: `ArchiveBlock`, `Code`, `Form`, `MediaBlock`, `RelatedPosts`, `TextBlock`, `SplitView`. Their select fields configure behavior, not visual variants — do not add `variants.ts`.

**Pattern D — Legacy / decommission**
`Feature/` is being replaced by `FeatureHero/`, `FeatureList/`, `FeatureMedia/`, `FeatureSpecial/`. Do not add variants to `Feature/`. Delete it after all pages are migrated.

---

## Pattern A rules

### Every Pattern A block must have `variants.ts`

```typescript
// variants.ts — authoritative variant registry
import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  MYBLOCK1: {
    label: 'My Block 1',
    previewImage: '/admin/previews/myblock/myblock1.webp',
    fields: ['badge', 'richText'], // field names shown only for this variant
  },
  MYBLOCK2: {
    label: 'My Block 2',
    previewImage: '/admin/previews/myblock/myblock2.webp',
    fields: ['image'],
  },
}
```

`fields[]` lists field names that are conditional on this variant. Fields not listed in any variant are always visible (pass-through). Fields with complex conditions (negations, `createBlockItemCondition`, compound logic) stay explicit in `config.ts` — do not force them into `fields[]`.

### `config.ts` must use `variantsToOptions` and `applyVariantConditions`

```typescript
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type MyBlockDesignVersion = keyof typeof variants
```

- Use `designVersionPreview(variantsToOptions(variants))` — not a raw `select` field
- Use `...applyVariantConditions(variants, [...])` for fields listed in `variants.ts`
- Function-created fields (`icon()`, `linkGroup()`, `link()`) keep explicit conditions — they cannot go through `applyVariantConditions`

### `Component.tsx` must use `keyof typeof variants` not `.value` on the old array type

### Pattern A blocks can fetch collection data at render time

Most Pattern A blocks are purely presentational — they render static props from the page query. But when a block needs dynamic collection data (e.g. "latest N posts"), the `Component.tsx` can be an `async` React Server Component that calls `payload.find()` directly via the Local API, then passes the results as props to the variant component.

`Blog/Component.tsx` is the canonical example. `ArchiveBlock` (Pattern C) uses the same pattern and is the upstream source from Payload's website template.

```typescript
import configPromise from '@payload-config'
import { getPayload } from 'payload'

export const MyBlock: React.FC<MyBlockProps> = async (props) => {
  const payload = await getPayload({ config: configPromise })
  const { docs } = await payload.find({ collection: 'posts', limit: props.limit })
  const MyVariant = variants[props.designVersion]
  return <MyVariant {...props} posts={docs} />
}
```

This is standard Payload Local API + Next.js RSC usage, not a codebase-specific hack.

---

## Adding a new variant to an existing block

1. Create the variant `.tsx` file
2. Add one entry to `variants.ts` with `fields[]` listing its conditional fields
3. Register in `Component.tsx`
4. Add preview image to `public/admin/previews/<block>/`

---

## Adding a new Pattern A block (full checklist)

- [ ] `src/blocks/MyBlock/variants.ts`
- [ ] `src/blocks/MyBlock/config.ts` — slug, interfaceName, fields
- [ ] `src/blocks/MyBlock/Component.tsx`
- [ ] `src/blocks/MyBlock/myblock1.tsx` (at least one variant)
- [ ] `public/admin/previews/myblock/myblock1.webp`
- [ ] Add block config to `src/collections/Pages/index.ts` blocks array
- [ ] Add component to `src/blocks/RenderBlocks.tsx` component map
- [ ] Run `pnpm generate:types`

---

## Adding a new blog post template (Pattern B)

1. Create `src/blocks/BlogPost/blogpost6.tsx`
2. Add `BLOGPOST6` to `allPostDesignVersions` in `src/collections/Posts/index.ts`
3. Register in `src/blocks/BlogPost/Component.tsx`

No `config.ts` or `variants.ts` needed.

---

## Utilities

- `src/blocks/utils.ts` — `VariantManifest`, `variantsToOptions()`, `applyVariantConditions()`
- `src/utilities/findParentFeatureVersion.ts` — `createBlockItemCondition()` for conditions on fields inside arrays
