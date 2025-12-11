# Unregistered Blocks with Breaking Changes

**Date:** November 29, 2025  
**Status:** For Reference Only  
**Related Document:** [shadcn-breaking-updates.md](./shadcn-breaking-updates.md)

---

## Overview

This document lists breaking changes found in **unregistered** Payload CMS block variants. These variants exist in the codebase but are **not currently registered** in their respective config files (commented out), meaning they are **not available** in the Payload CMS admin panel.

**Important:** These blocks do **not** need to be fixed unless you plan to register them in the future. They are documented here for reference.

---

## Card Component Padding Issues

The following unregistered variants have direct padding on the `Card` component, which breaks with the new Card structure:

### StatBlock

- **`stat2`** - 6 instances
  - Lines: 13, 22, 31, 40, 49, 58
  - File: `src/blocks/Stat/stat2.tsx`
  - Status: Commented out in `src/blocks/Stat/config.ts` (line 10: `// 'STAT2'`)

### FeatureBlock

- **`feature5`** - 2 instances
  - Lines: 11, 28
  - File: `src/blocks/Feature/feature5.tsx`
  - Status: Commented out in `src/blocks/Feature/config.tsx`

- **`feature8`** - 2 instances
  - Lines: 19, 56
  - File: `src/blocks/Feature/feature8.tsx`
  - Status: Commented out in `src/blocks/Feature/config.tsx`

- **`feature21`** - 5 instances
  - Lines: 27, 48, 55, 82, 89
  - File: `src/blocks/Feature/feature21.tsx`
  - Status: Commented out in `src/blocks/Feature/config.tsx`

- **`feature36`** - 3 instances
  - Lines: 10, 28, 41
  - File: `src/blocks/Feature/feature36.tsx`
  - Status: Commented out in `src/blocks/Feature/config.tsx`

- **`feature44`** - 1 instance
  - Line: 57
  - File: `src/blocks/Feature/feature44.tsx`
  - Status: Commented out in `src/blocks/Feature/config.tsx`

### TestimonialBlock

- **`testimonial7`** - 2 instances
  - Lines: 155, 181
  - File: `src/blocks/Testimonial/testimonial7.tsx`
  - Status: Commented out in `src/blocks/Testimonial/config.ts` (line 28: `// "TESTIMONIAL7"`)

- **`testimonial9`** - 1 instance
  - Line: 83
  - File: `src/blocks/Testimonial/testimonial9.tsx`
  - Status: Commented out in `src/blocks/Testimonial/config.ts` (line 30: `// "TESTIMONIAL9"`)

- **`testimonial19`** - 1 instance
  - Line: 114
  - File: `src/blocks/Testimonial/testimonial19.tsx`
  - Status: Commented out in `src/blocks/Testimonial/config.ts` (line 40: `// "TESTIMONIAL19"`)

### CtaBlock

- **`cta3`** - 2 instances
  - Lines: 30, 44
  - File: `src/blocks/Cta/cta3.tsx`
  - Status: Commented out in `src/blocks/Cta/config.ts` (line 18: `// 'CTA3'`)

- **`cta1`** - Potential issue
  - File: `src/blocks/Cta/cta1.tsx`
  - Note: Uses nested div instead of CardContent (line 27: `<div className="p-6 md:max-w-96">`)
  - Status: **Actually registered** - but uses nested div pattern, not direct Card padding

---

## Summary

**Total Unregistered Variants with Issues:**
- **Card padding issues:** 10 variants (24 total instances)
- **AvatarImage asChild issues:** 0 variants (0 instances)
- **Potential Card issues:** 1 variant (cta1 - actually registered but uses nested div)

**Note:** `cta1` is actually registered, but it uses a nested div pattern for padding rather than CardContent. This may work but doesn't follow the new Card structure pattern.

---

## How to Register These Blocks

If you want to make any of these blocks available in Payload CMS:

1. **Uncomment the variant** in the respective config file:
   - `src/blocks/Stat/config.ts` for stat2
   - `src/blocks/Feature/config.tsx` for feature variants
   - `src/blocks/Testimonial/config.ts` for testimonial variants
   - `src/blocks/Cta/config.ts` for cta3

2. **Fix the breaking changes** before registering:
   - Move padding from `Card` to `CardContent`
   - Remove `asChild` prop from `AvatarImage`

3. **Test the block** in the CMS admin panel

---

## Fix Patterns

### Card Padding Fix

```tsx
// ❌ Before (unregistered blocks)
<Card className="p-6">Content</Card>

// ✅ After (when registering)
<Card>
  <CardContent className="pt-6">Content</CardContent>
</Card>
```

### AvatarImage asChild Fix

```tsx
// ❌ Before (unregistered blocks)
<AvatarImage asChild src={avatar.url!}>
  <Media resource={avatar} />
</AvatarImage>

// ✅ After (when registering)
<AvatarImage src={avatar.url!} />
// Or use Media component separately if needed
```

---

## Related Documentation

- [Main Breaking Updates Report](./shadcn-breaking-updates.md) - Verified issues in registered blocks
- [Card Component Changes](./shadcn-breaking-updates.md#card-component-srccomponentsuicardtsx) - Details on Card structure changes
- [Avatar Component Changes](./shadcn-breaking-updates.md#avatar-component-srccomponentsuiavatarstsx) - Details on AvatarImage changes

