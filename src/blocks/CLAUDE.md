# Blocks Directory

This directory contains two distinct patterns. Read carefully before adding or modifying anything.

---

## Pattern A — Design variant blocks (shadcnblocks)

These are the page builder blocks. Each maps to one or more visual variants from [shadcnblocks.com](https://shadcnblocks.com). The editor picks a block, then picks a variant (design version) inside it.

**Required files:**

```
src/blocks/MyBlock/
├── variants.ts       ← single source of truth for variant membership
├── config.ts         ← Payload Block schema
├── Component.tsx     ← dispatches to the right variant component
├── myblock1.tsx      ← variant component (one file per variant)
└── myblock2.tsx
```

### `variants.ts`

Every design-variant block **must** have this file. It is the authoritative list of which variants exist and which fields each one uses.

```typescript
import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  MYBLOCK1: {
    label: 'My Block 1',
    previewImage: '/admin/previews/myblock/myblock1.webp',
    fields: ['badge', 'richText'],   // fields visible only for this variant
  },
  MYBLOCK2: {
    label: 'My Block 2',
    previewImage: '/admin/previews/myblock/myblock2.webp',
    fields: ['image'],
  },
}
```

`fields[]` lists field **names** that are conditional on this variant. Fields not listed in any variant's `fields[]` are always visible (pass-through). Fields with complex conditions (negations, `createBlockItemCondition`, compound logic) are left out of `fields[]` and handled explicitly in `config.ts`.

### `config.ts`

```typescript
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type MyBlockDesignVersion = keyof typeof variants

export const MyBlock: Block = {
  slug: 'my-block',
  interfaceName: 'MyBlock',
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),  // always first after backgroundColor

    ...applyVariantConditions(variants, [
      { name: 'badge', type: 'text' },
      { name: 'richText', type: 'richText', ... },
      { name: 'image', type: 'upload', ... },
    ]),

    // Explicit: function-created fields (icon, linkGroup, link) keep their own conditions
    icon({ admin: { condition: (_, { designVersion = '' } = {}) => ['MYBLOCK1'].includes(designVersion) } }),
    linkGroup({ appearances: false }),

    // Explicit: nested array item conditions using createBlockItemCondition
    // Explicit: compound conditions (e.g. Boolean(enableCta) && designVersion !== 'X')
  ],
}
```

`designVersionPreview` sets `defaultValue` to the first entry in the options array and `required: true` automatically.

### `Component.tsx`

Dispatches on `designVersion`. Use `dynamic()` for large blocks.

```typescript
import dynamic from 'next/dynamic'
import { variants } from './variants'

export type MyBlockDesignVersion = keyof typeof variants  // re-export if needed

const components: Record<MyBlockDesignVersion, React.FC<any>> = {
  MYBLOCK1: dynamic(() => import('./myblock1')),
  MYBLOCK2: dynamic(() => import('./myblock2')),
}

export const MyBlockComponent: React.FC<any> = (props) => {
  const C = components[props.designVersion as MyBlockDesignVersion]
  return C ? <C {...props} /> : null
}
```

**Adding a new variant** (the only operation that should touch this directory regularly):
1. Create `myblockN.tsx`
2. Add one entry to `variants.ts` (with `fields[]` listing its conditional fields)
3. Register in `Component.tsx`
4. Add preview image to `public/admin/previews/myblock/`
5. Register block in `src/collections/Pages/index.ts` and `src/blocks/RenderBlocks.tsx` (first time only)

---

## Pattern B — Collection template renderers

These have **no Payload Block schema** (`config.ts`). They render a collection document (Post, Project) as a full page. The `designVersion` select lives on the collection itself, not on a block.

```
src/blocks/BlogPost/       ← renders a Post detail page (BLOGPOST4, BLOGPOST5, CASESTUDY3)
src/blocks/BlogContent/    ← DEAD CODE — unwired, superseded by BlogPost
src/blocks/ProjectPost/    ← renders a Project detail page
src/blocks/CaseStudy/      ← variant component used by BlogPost
```

Entry points: `src/blocks/RenderPostDetailPage.tsx`, `src/blocks/RenderProjectDetailPage.tsx`

**Adding a new blog post template:**
1. Create `src/blocks/BlogPost/blogpost6.tsx`
2. Add `BLOGPOST6` to `allPostDesignVersions` in `src/collections/Posts/index.ts`
3. Register in `src/blocks/BlogPost/Component.tsx`

No `config.ts`, no `variants.ts` — the schema is owned by the collection.

---

## Pattern C — Payload/shadcnblocks utility blocks

These blocks have a `config.ts` but **no `designVersion`** and no `variants.ts`. They are single-template utility blocks inherited from the Payload website template or shadcnblocks base. Their select fields configure behavior or content, not visual design variants.

| Block | Origin | Select field purpose |
|-------|--------|---------------------|
| `ArchiveBlock` | Payload template | `populateBy` — collection vs manual selection |
| `Code` | Payload template | `language` — syntax highlighting language |
| `Form` | Payload template | none |
| `MediaBlock` | Payload template | `aspectRatio` — display ratio |
| `RelatedPosts` | Payload template | none |
| `TextBlock` | shadcnblocks base | none |
| `SplitView` | shadcnblocks base | `size` — column width per column |

Do **not** add `variants.ts` to these. If you need multiple visual layouts for one of these, convert it to Pattern A (add `designVersion`, `variants.ts`, split `Component.tsx`).

---

## Pattern D — Legacy / in decommission

```
src/blocks/Feature/    ← 19-variant monolith, being replaced by FeatureHero/List/Media/Special
src/blocks/Careers/    ← empty directory
```

`Feature/` still serves existing pages with `blockType: 'feature'`. Do not delete it until all pages are migrated to the new split blocks. Do not add new variants here.

---

## Utilities

**`src/blocks/utils.ts`** — shared helpers used by all Pattern A blocks:
- `VariantManifest` — the type for `variants.ts` exports
- `variantsToOptions(variants)` — converts manifest to the array `designVersionPreview()` expects
- `applyVariantConditions(variants, fieldDefs)` — inverts the manifest and attaches `admin.condition` to each matched field

**`src/utilities/findParentFeatureVersion.ts`** — `createBlockItemCondition()` for conditions on fields inside arrays (looks up the parent block's `designVersion`). Used when the variant check needs to happen from inside an array item.

---

## Registration checklist (new Pattern A block)

- [ ] `src/blocks/MyBlock/variants.ts`
- [ ] `src/blocks/MyBlock/config.ts`
- [ ] `src/blocks/MyBlock/Component.tsx`
- [ ] `src/blocks/MyBlock/myblock1.tsx` (at least one variant)
- [ ] `public/admin/previews/myblock/myblock1.webp`
- [ ] Add to `src/collections/Pages/index.ts` blocks array
- [ ] Add to `src/blocks/RenderBlocks.tsx` component map
- [ ] Run `pnpm generate:types` to regenerate `src/payload-types.ts`
