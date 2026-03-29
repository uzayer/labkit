# Config Template for New Blocks (Scenario B)

Use these templates when creating a brand-new block family from scratch.

---

## variants.ts

```ts
import type { VariantManifest } from '@/blocks/utils'

export const variants: VariantManifest = {
  FOOBAR1: {
    label: 'FOOBAR1',
    previewImage: '/admin/previews/foobar/foobar1.webp',
    fields: ['headline', 'text1', 'items', 'links'],
  },
}
```

---

## config.ts

```ts
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'

export type FoobarDesignVersion = keyof typeof variants

export const FoobarBlock: Block = {
  slug: 'foobar',
  interfaceName: 'FoobarBlock',
  labels: {
    singular: 'Foobar',
    plural: 'Foobars',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      // richText field example
      {
        name: 'headline',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          ],
        }),
      },
      // plain text field example
      {
        name: 'label1',
        type: 'text',
        localized: true,
      },
      // upload field example (single)
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      // upload field example (multiple, ordered)
      {
        name: 'images',
        type: 'upload',
        relationTo: 'media',
        hasMany: true,
        admin: {
          description: 'FOOBAR1 — [0] hero image, [1] background',
        },
      },
      // array field with icon + text sub-fields
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Item', plural: 'Items' },
        fields: [
          icon({ admin: { description: 'Lucide icon name (e.g. "Truck", "Shield")' } }),
          { name: 'title', type: 'text', required: true, localized: true },
          { name: 'description', type: 'text', localized: true },
          { name: 'url', type: 'text' },
        ],
      },
    ]),

    // linkGroup: always outside applyVariantConditions because it's a function-created field
    // Add a manual condition if it should only show for specific variants:
    // linkGroup({
    //   overrides: {
    //     admin: {
    //       condition: (_, { designVersion = '' } = {}) => ['FOOBAR1'].includes(designVersion),
    //     },
    //   },
    // }),
  ],
}
```

**Key rules:**

- Always include `backgroundColor` and `designVersionPreview(variantsToOptions(variants))` as the first two fields
- Function-created fields (`link()`, `linkGroup()`, `icon()` at the top level) cannot go inside `applyVariantConditions` — add them after with explicit `admin.condition`
- `icon()` inside an array's `fields[]` is fine
- `localized: true` on text and richText fields for content editors

---

## Component.tsx

```tsx
import { FoobarDesignVersion } from './config'
import Foobar1 from '@/blocks/Foobar/foobar1'

type Foobar<T extends string = string> = Required<Record<FoobarDesignVersion, React.FC<any>>> &
  Record<T, React.FC<any>>

const foobar: Foobar = {
  FOOBAR1: Foobar1,
}

export const FoobarBlock: React.FC<any> = (props) => {
  if (props.blockType !== 'foobar') return null

  const { designVersion } = props || {}

  if (!designVersion) return null

  const FoobarToRender = foobar[designVersion as FoobarDesignVersion]

  if (!FoobarToRender) return null

  return <FoobarToRender {...props} />
}

export default FoobarBlock
```

The `blockType` string must match the `slug` in config.ts exactly.

---

## Registration in Pages/index.ts

Add after the last import block:

```ts
import { FoobarBlock } from '@/blocks/Foobar/config'
```

Add to `PageBlocks[]` array:

```ts
FoobarBlock,
```

## Registration in RenderBlocks.tsx

Add after the last import block:

```ts
import { FoobarBlock } from './Foobar/Component'
```

Add to `blockComponents` map:

```ts
foobar: FoobarBlock,
```
