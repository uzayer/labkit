# Component Patterns Reference

## Standard import block for a converted variant

```tsx
import { Icon } from '@/components/Icon'
import { CMSLink } from '@/components/Link'
import { Media } from '@/components/Media'
import RichText from '@/components/RichText'
import type { FooBlock } from '@/payload-types'
import { PublicContextProps } from '@/utilities/publicContextProps'
```

Omit any import you don't use. Add `"use client"` at the top (before imports) if the original component had it.

## Component signature

```tsx
const FooN: React.FC<FooBlock & { publicContext: PublicContextProps }> = ({
  headline,
  text1,
  label1,
  images,
  items,
  links,
  publicContext,
}) => {
  return <section className="py-32">...</section>
}

export default FooN
```

## RichText usage

```tsx
{
  headline && (
    <RichText
      publicContext={publicContext}
      content={headline}
      withWrapper={false}
      overrideStyle={{
        h1: 'text-4xl font-semibold lg:text-7xl',
        h2: 'text-3xl font-semibold md:text-5xl',
        p: 'text-lg text-muted-foreground',
      }}
    />
  )
}
```

Copy the Tailwind classes from the original hardcoded element into the matching overrideStyle key.
Available keys: `h1`, `h2`, `h3`, `h4`, `p`, `ul`, `li`, `a`.

## Media (image) usage

Single image:

```tsx
{
  typeof images?.[0] === 'object' && (
    <Media resource={images[0]} imgClassName="size-full max-h-96 rounded-2xl object-cover" />
  )
}
```

Background image (keep parent div, add Media inside):

```tsx
<div className="relative overflow-hidden rounded-2xl">
  {typeof images?.[0] === 'object' && (
    <Media resource={images[0]} imgClassName="absolute inset-0 size-full object-cover" />
  )}
  <div className="relative ...">{/* foreground content */}</div>
</div>
```

## Icon usage (per-item in array)

```tsx
{
  item.icon && (
    <div className="bg-accent flex size-12 items-center justify-center rounded-2xl">
      <Icon icon={item.icon} size={20} />
    </div>
  )
}
```

## CMSLink usage

Single button:

```tsx
{
  links?.[0]?.link && <CMSLink {...links[0].link} size="lg" />
}
```

Multiple buttons:

```tsx
{
  Array.isArray(links) && links.length > 0 && (
    <div className="flex gap-4">
      {links.map((item) => (
        <CMSLink key={item.id} {...item.link} />
      ))}
    </div>
  )
}
```

## Plain text field

```tsx
{
  label1 && <p className="text-sm font-semibold">{label1}</p>
}
```

## Array field

```tsx
{
  Array.isArray(items) && items.length > 0 && (
    <div className="grid gap-6 md:grid-cols-3">
      {items.map((item) => (
        <div key={item.id} className="flex flex-col gap-2">
          {item.icon && <Icon icon={item.icon} size={20} />}
          {item.title && <h3 className="font-semibold">{item.title}</h3>}
          {item.description && <p className="text-muted-foreground">{item.description}</p>}
        </div>
      ))}
    </div>
  )
}
```

Note: Payload array items have an auto-generated `id` field — use that as the React key.
