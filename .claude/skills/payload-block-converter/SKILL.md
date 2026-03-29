---
name: payload-block-converter
description: >
  Convert a downloaded shadcnblocks.com component into a fully registered PayloadCMS block in this repo. Use this skill whenever the user provides a path to a raw downloaded component (in src/components/) and wants to add it as a Payload block — e.g. "convert this block", "register this component", "turn this into a Payload block", "wire this into the CMS", or points at a file like src/components/industries1.tsx and asks to add it. Trigger even if the user just says "add this to Payload" while pointing at a component file. This skill handles both adding a new variant to an existing block family AND creating an entirely new block from scratch.
---

# Payload Block Converter

Converts a raw shadcnblocks component (e.g. `src/components/industries1.tsx`) into a
fully-registered PayloadCMS block following the patterns in `src/blocks/`.

**Reference files** (read when needed):

- `references/component-patterns.md` — import block, wrapper pattern, CMS component usage
- `references/config-template.md` — boilerplate for brand-new blocks (config.ts, variants.ts, Component.tsx)

---

## Step 1: Parse the Input

The user provides a component path or name (e.g. `src/components/about19.tsx` or just `about19`).
Normalize to `src/components/<name>.tsx`.

Extract:

- **Block family name** — everything before the trailing number:
  - `about19` → `About` (dir), `about` (slug)
  - `trust-strip1` → `TrustStrip` (dir), `trust-strip` (slug)
  - `industries1` → `Industries` (dir), `industries` (slug)
  - PascalCase for directory, kebab-case for Payload slug
- **Variant number** — trailing digits: `19`, `1`
- **Variant key** — uppercase, no hyphen: `ABOUT19`, `TRUSTSTRIP1`, `INDUSTRIES1`

---

## Step 2: Detect Scenario

Check whether `src/blocks/<FamilyDir>/` exists.

**Scenario A — new variant on existing block:** Directory exists. Read before proceeding:

- `src/blocks/<Family>/config.ts` — to see which fields already exist
- `src/blocks/<Family>/variants.ts` — to see existing variant keys
- `src/blocks/<Family>/Component.tsx` — to match the import/dispatch pattern

**Scenario B — brand new block (single component):** Directory does not exist and only one component
is provided. You will create all four files plus register in two places. Read
`references/config-template.md` now.

**Scenario B-multi — brand new block from multiple components:** Directory does not exist and 2+
components are provided for the same block family (e.g. `product-specs1` and `product-specs2`).
Read all provided component files and `references/config-template.md`, then go to **Step 2b** before
doing anything else. Do not write any files until Step 2b is complete.

Then read the raw component(s): `src/components/<name>.tsx`

---

## Step 2b: Cross-Shape Analysis (Scenario B-multi only)

For each component, extract its data shape:

- Every **array prop**: its name, and the shape of each item (sub-field names + types)
- Every **scalar prop**: name and type

Then compare across all components:

**Structurally equivalent arrays** — same nesting depth and same sub-field pattern, even if the
array or field names differ and even if one variant has extra optional sub-fields the other lacks.
These represent the same logical entity and **must become a single shared array field.**

- Choose a neutral name that isn't biased toward either component's naming (e.g. if one calls it
  `categories` and the other `specGroups`, pick a name like `specCategories` that describes the
  concept)
- Extra sub-fields that only appear in one variant (e.g. `icon`, `highlight`) become
  variant-conditional sub-fields within that shared array — **not** a second parallel array

**Truly unique scalar fields** — no structural equivalent in any other component. These remain as
variant-conditional top-level fields.

**Admin UX invariant — state this rule to yourself before writing anything:**

> If a content editor fills out data in variant N and switches `designVersion` to variant M, their
> data must survive intact. Any two variants that represent the same conceptual list must share one
> array field, not use separate named arrays.

**When data shapes are too divergent to unify:**
Some block families have variants with fundamentally different data shapes — an image-heavy card
layout vs. a plain text timeline, for example — where forcing a shared array would produce a
bloated, confusing schema. If the arrays differ in nesting depth, item structure, or conceptual
purpose (not just naming or optional sub-fields), **stop and ask the user** before proceeding:

> "Variant X uses [shape A] and variant Y uses [shape B]. These are structurally different enough
> that sharing a single array may not make sense. Should I unify them anyway, keep them as separate
> fields, or handle one variant first and revisit the schema when the second is added?"

Err toward unification when possible — the question is only warranted when the shapes are genuinely
incompatible, not just slightly different.

---

## Step 3: Analyze the Component

Walk through the raw component and identify its **data props** — everything that should be editable
in the CMS. The hardcoded default values in the component are your best guide to what each field is for.

**Default rule: if a content editor would ever want to change it, it's a field.** When in doubt, make
it a field — an unused field costs nothing, a missing field requires a code change. Don't leave
content hardcoded just because it looks small or "static" — short labels, badge text, counter values,
section titles, and button labels all belong in the CMS.

**Extract:**

- Text content (headings, paragraphs, labels/badges, counter values, section titles)
- Images (`<img src="...">` — including `imageAlt`)
- Icons (lucide-react imports used per-item in arrays)
- Array data (`.map()` over a list)
- Links / buttons (href attributes, `<Button>` with CTA text)

**Only keep hardcoded in JSX:** CSS class names, Tailwind layout classes, animation variant objects,
Framer Motion easing constants, structural divs with no content, purely decorative SVG paths.
If you're unsure whether something is "layout" or "content", make it a field.

---

## Step 4: Assign CMS Field Types

| What you see in the raw component                   | CMS field                                                                                                                                 |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------- |
| `<h1>` / `<h2>` / `<h3>` section heading            | `richText` — **always**, even if the text is short. Headings are `richText` for formatting consistency with the rest of the block system. |
| `<p>` with body copy                                | `richText`                                                                                                                                |
| Short label / badge / tagline / button label        | `text` (plain, localized)                                                                                                                 |
| Array item `title` or `description` (inside a card) | `text` (plain, localized) — these are per-item labels, not section headings                                                               |
| Counter value / stat number                         | `text` (plain)                                                                                                                            |
| `<img src="...">`                                   | `upload` → `media` (hasMany if multiple)                                                                                                  |
| Per-item icon in an array                           | `icon()` from `@/components/Icon/config`                                                                                                  |
| Single `<a href>` or `<Button>`                     | `link()` from `@/fields/link`                                                                                                             |
| Multiple links / button group                       | `linkGroup()` from `@/fields/linkGroup`                                                                                                   |
| `.map()` over items array                           | `array` field with sub-fields                                                                                                             |
| `imageAlt` string                                   | **Don't add** — Media reads alt from the media document                                                                                   |

**For Scenario A:** Before creating any new field, check if the same data can map to an existing field
in `config.ts`. Reuse existing fields when the meaning matches — only add truly new ones.

**For Scenario B-multi:** Cross-shape analysis (Step 2b) must be complete before you assign any field
types. Work from the unified field list produced in Step 2b, not from each component individually.

---

## Step 5: Field Visibility in variants.ts

Fields that should only appear in the admin panel for this specific variant go in `fields[]` in the
variant's entry.

Fields that are shared across all variants of this block (already always-visible in config.ts) do
NOT go in `fields[]` — leave them out of the entry entirely.

For a brand-new block (Scenario B), put all fields in `fields[]` for the first variant.

**Shared arrays from Scenario B-multi:** A unified array field (shared by multiple variants) goes in
`fields[]` for **every** variant that uses it. Variant-conditional sub-fields within that array
(e.g. `icon` only visible in variant 1, `highlight` only visible in variant 2) are handled via
`admin.condition` inside the array's field definitions in `config.ts` — they do NOT appear in
`fields[]` in `variants.ts`, because `fields[]` only controls top-level field visibility, not
nested field visibility.

**⚠️ Nested array condition pattern — critical:** The standard top-level condition pattern
`(_, { designVersion = '' } = {}) => designVersion === 'VARIANT'` **does NOT work inside array
sub-fields.** At the array item level, `siblingData` is the row's own data — it does not contain
`designVersion`. The condition always evaluates to `undefined`, and the field is permanently hidden.

**One level deep** (field inside `topArray[]`): use `createBlockItemCondition` from
`@/utilities/findParentFeatureVersion`. It searches `data.layout` for a block that contains the
item (by `siblingData.id`) in any of the block's top-level array fields:

```typescript
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

// Inside the array's `fields` list:
{ name: 'icon', ..., admin: { condition: createBlockItemCondition(['VARIANT1']) } }
// Multiple allowed versions:  createBlockItemCondition(['VARIANT1', 'VARIANT2'])
// Exclusion:                   createBlockItemCondition(['NOT VARIANT1'])
```

**Two levels deep** (field inside `outerArray[].innerArray[]`): `createBlockItemCondition` **does
not work** — it only traverses the block's top-level arrays, so it will never find an item that
is nested two levels down. Write a manual traversal instead:

```typescript
const myCondition = (data: any, siblingData: any) => {
  if (!data?.layout || !siblingData?.id) return false
  for (const block of data.layout) {
    if (block.blockType !== 'my-block-slug') continue
    for (const outerItem of block.outerArray || []) {
      if (
        Array.isArray(outerItem.innerArray) &&
        outerItem.innerArray.some((s: any) => s.id === siblingData.id)
      ) {
        return block.designVersion === 'VARIANT2'
      }
    }
  }
  return false
}
// Then: admin: { condition: myCondition }
```

These conditions must stay explicit in `config.ts` — they cannot go through `applyVariantConditions`.

---

## Step 6: Write the Files

### 6a — Converted variant: `src/blocks/<Family>/<name>.tsx`

Read `references/component-patterns.md` for the exact import block and component signature.

Transform the raw component:

1. **Props**: Replace `interface FooNProps { ... }` with `React.FC<FooBlock & { publicContext: PublicContextProps }>` and destructure the CMS fields
2. **className / cn()**: Remove the `className` prop and the `cn()` wrapper on `<section>` — Payload blocks don't accept external className
3. **Images**: Replace `<img src="...">` with `<Media resource={field} imgClassName="..." />`; drop `imageAlt` props
4. **Text/headings**: Wrap richText fields in `<RichText content={field} ... />` with `overrideStyle` to preserve the original Tailwind classes; wrap plain text in `{field && <Tag>{field}</Tag>}`
5. **Icons in arrays**: Replace `<LucideIcon className="size-5" />` with `<Icon icon={item.icon} size={20} />`; remove the lucide import
6. **Links/buttons**: Replace `<a href>` / `<Button>` with `<CMSLink>` using the link field
7. **Arrays**: Replace the hardcoded default array with the CMS array field, keeping the `.map()` structure identical — only the data source changes
8. **Animations**: Keep ALL Framer Motion code, `"use client"` directives, easing constants, and variant objects unchanged

Add conditional guards around every CMS field: `{field && <div>...</div>}` and `{Array.isArray(field) && field.length > 0 && ...}`.

### 6b — `variants.ts`: add the new entry

```ts
VARIANTKEY: {
  label: 'VARIANTKEY',
  previewImage: '/admin/previews/<family>/<name>.webp',
  fields: ['fieldName1', 'fieldName2'],  // only fields specific to this variant
},
```

For Scenario B, create the full file with a single entry.

### 6c — `config.ts`: add new fields only

For Scenario A: Add only fields that don't already exist in the file. Insert them inside
`applyVariantConditions(variants, [...])`. Fields with complex conditions (negation, compound
`createBlockItemCondition`) stay as explicit fields with manual `admin.condition`.

For Scenario B: Create the full file. See `references/config-template.md`.

**Variant-conditional sub-fields inside arrays:** Write them explicitly in the array's `fields`
list with `admin: { condition: createBlockItemCondition(['VARIANT']) }`. Do NOT use the
`(_, { designVersion })` shorthand — it silently fails in nested scope. Do NOT list these in
`applyVariantConditions`. Import: `import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'`.

### 6d — `Component.tsx`: register the variant

For Scenario A: Add one import line and one key to the dispatch object.

For Scenario B: Create the full file. See `references/config-template.md`.

---

## Step 7: Register the New Block (Scenario B only)

Scenario A blocks are already registered — skip this step.

**`src/collections/Pages/index.ts`**

- Add: `import { <Family>Block } from '@/blocks/<Family>/config'`
- Add to `PageBlocks[]` array

**`src/blocks/RenderBlocks.tsx`**

- Add: `import { <Family>Block } from './<Family>/Component'`
- Add to `blockComponents` map: `'<slug>': <Family>Block,`

---

## Step 8: Finish Up

### 8a — Download preview image(s)

For each converted component, download its preview image from the shadcnblocks CDN and place it
at the path referenced in `variants.ts`.

URL format:

```
https://deifkwefumgah.cloudfront.net/shadcnblocks/screenshots/block/<component-name>-4x3.webp
```

Where `<component-name>` is the raw filename without extension (e.g. `product-specs1`,
`trust-strip2`). Destination: `public/admin/previews/<family>/<name>.webp`.

```bash
curl -L "https://deifkwefumgah.cloudfront.net/shadcnblocks/screenshots/block/<name>-4x3.webp" \
  -o "public/admin/previews/<family>/<name>.webp"
```

Note the `-4x3` suffix in the CDN filename — strip it in the output path so the file is saved as
`<name>.webp`, not `<name>-4x3.webp`.

If `public/admin/previews/<family>/` does not exist, create it first with `mkdir -p`.

If the download fails (non-200, file is empty, or curl errors), tell the user:

```
Preview image download failed for <name>. Add it manually:
  Source: https://deifkwefumgah.cloudfront.net/shadcnblocks/screenshots/block/<name>-4x3.webp
  Destination: public/admin/previews/<family>/<name>.webp
```

### 8b — Generate types

```bash
pnpm generate:types
```

Tell the user which files were created/modified and what the variant key(s) are.

---

## Edge Cases

**`framer-motion` / `"use client"`**: Keep `"use client"` at the top if the original had it. Preserve all Framer Motion code exactly — only the data layer changes.

**URL fields inside arrays**: Use `text` (named `url`) for simple always-external URLs. Use `link()` from `@/fields/link` if you want type/newTab/internal-page support.

**Hardcoded decorative icons** (same icon in all items, not per-item): Keep them as JSX imports — they're not data.

**No `.map()` / single instance**: Model as flat fields, not an array.

**`imageAlt` in the raw props**: Don't add an `imageAlt` field. The `<Media>` component reads alt text from the media document in Payload — `imageAlt` from the raw component gets dropped.

**Field already exists in Scenario A**: Map the component data to the existing field even if the name is slightly different (e.g. the component uses `tagline` but the block already has `tagline` — just use it).

**Variant-conditional field inside an array silently disappears**: The condition `(_, { designVersion })` receives `siblingData` = the row's own data at the array item level — `designVersion` is never found, the condition returns `undefined` (falsy), and the field is permanently invisible. This is a silent failure with no error. Use `createBlockItemCondition(['VARIANT'])` for fields one level deep. For fields **two levels deep** (inside an array that is itself inside another array), `createBlockItemCondition` also silently fails — it only traverses the block's top-level arrays. Write a manual two-level traversal (see Step 5). The same applies to `icon()`, `link()`, and `linkGroup()` calls inside nested arrays.
