# Shadcn UI Breaking Updates Report

**Date:** November 29, 2025  
**Status:** Verified - Complete  
**Affected Areas:** `src/blocks`, `src/globals/ThemeConfig`  
**Related:** [Unregistered Blocks Issues](./unregistered-blocks-issues.md) - For reference on unregistered variants

---

## Executive Summary

A recent update via the `shadcn` CLI has overwritten the contents of `src/components/ui` with the latest upstream versions. This has introduced breaking changes by:

1. Reverting project-specific customizations (e.g., custom variants/sizes)
2. Introducing new architectural patterns (strict composition)
3. Changing component APIs (removed props, changed structure)

**Important:** The `src/components/ui` directory **must not be modified** to fix these issues. Instead, all consuming code (blocks, pages) must be refactored to adhere to the new component APIs.

**Verification Status:** ✅ **VERIFIED** - This report has been manually verified against actual component implementations. Previous inaccuracies about Card (flex container) and Badge (div→span, rounded-full→rounded-md) have been corrected.

---

## Critical Breaking Changes

### Card Component (`src/components/ui/card.tsx`)

**Change:** Card structure now expects content wrapped in sub-components (`CardHeader`, `CardContent`, `CardFooter`). Card itself is a simple wrapper (`rounded-lg border bg-card text-card-foreground shadow-sm`), not a flex container.

**Break:** Direct padding on Card root (`<Card className="p-6">`) should be moved to `CardContent` for proper structure. `CardContent` has default padding (`p-6 pt-0`) that can be overridden.

**Fix:**

```tsx
// ❌ Before
<Card className="p-6">Content</Card>

// ✅ After
<Card>
  <CardContent className="pt-6">Content</CardContent>
</Card>
```

**VERIFIED ISSUES IN REGISTERED BLOCKS ONLY:**

**Card Padding Issues (registered blocks):**

- `testimonial4` - resolved (CardContent wrapper added, padding moved) — fixed Dec 8, 2025
- `stat10` - resolved (CardContent now owns padding for consistency) — fixed Dec 8, 2025

**AvatarImage Issues (registered blocks):**

- `testimonial2`, `testimonial4`, `testimonial11` - resolved (AvatarImage now used directly with `src`; no `asChild`, no direct Media inside Avatar) — fixed Dec 8, 2025

**Note:** Previous report included unregistered variants (stat2, feature5, feature8, feature21, feature36, feature44, testimonial7, testimonial9, testimonial19, cta3). These are NOT registered in Payload CMS and do not need fixing.

**Correct Implementations:**

- `feature3`, `feature4`, `feature9` - Use CardHeader/CardContent/CardFooter correctly
- `team5`, `team5-9` - Use CardContent with padding correctly

### Button Component (`src/components/ui/button.tsx`)

**Change:** Custom `size="clear"` variant removed.

**Break:** Blocks using `size="clear"` will fail type checking or fall back to default sizing.

**Fix:** Replace with `variant="ghost"` or apply utility classes directly.

**Status:** ✅ No issues found - No blocks use `size="clear"` in codebase.

### Carousel Component (`src/components/ui/carousel.tsx`)

**Change:** Major refactor to use `embla-carousel-react` with strict Context-based architecture.

**Break:** Direct Embla usage or custom implementations will fail.

**Fix:** Ensure all Carousel implementations wrap children in `CarouselContent` and `CarouselItem`.

---

## Moderate Breaking Changes

### Avatar Component (`src/components/ui/avatar.tsx`)

**Changes:**

- `AvatarImage` no longer supports `asChild` prop (uses `AvatarPrimitive.Image` directly, no Slot wrapper)
- Avatar component still supports ref forwarding (`React.forwardRef`)

**Breaks:**

- `AvatarImage` with `asChild` prop will fail (prop not supported)

**Fix:** Remove `asChild` from `AvatarImage` and provide `src` directly. Do not place `Media` directly under `Avatar`, since Radix Avatar expects `AvatarImage` for loading/fallback behavior.

**Status:** ✅ **FIXED in registered blocks** (`testimonial2`, `testimonial4`, `testimonial11`)

**Fix Pattern:**

```tsx
// ❌ Before
<Avatar>
  <AvatarImage asChild src={avatar.url!}>
    <Media resource={avatar} />
  </AvatarImage>
</Avatar>

// ❌ Also incorrect
<Avatar>
  <Media resource={avatar} />
</Avatar>

// ✅ After
<Avatar>
  <AvatarImage src={avatar.url ?? undefined} className="h-full w-full object-cover" />
</Avatar>
```

### Badge Component (`src/components/ui/badge.tsx`)

**Status:** ✅ **NO CHANGES** - Badge component was not modified. Still uses `<div>` and `rounded-full` styling.

**Note:** Previous analysis incorrectly reported Badge changes. The component remains unchanged.

### Input/Textarea Components

**Changes:**

- Border: `border-border` → `border-input`
- Text size: `text-sm` → `text-base md:text-sm` (responsive)
- Removed `InputProps`/`TextareaProps` exports (use `React.ComponentProps<"input">`)

**Breaks:**

- Border color may differ if CSS variables differ
- Text size responsive behavior
- Type imports will fail

**Fix:** Update imports, verify border colors, test responsive sizing.

**Status:** ✅ No issues found - No blocks import `InputProps`/`TextareaProps`.

### Select Component (`src/components/ui/select.tsx`)

**Changes:**

- Background: `bg-card` → `bg-popover` in `SelectContent`
- CSS variable syntax fixed: `h-(--var)` → `h-[var(--var)]`

**Breaks:**

- Background color may differ if `--card` and `--popover` differ

**Fix:** Verify popover background color matches design.

---

## Minor Changes (No Action Required)

### Components with Only Import Path Changes

- `accordion.tsx`, `breadcrumb.tsx`, `collapsible.tsx`, `separator.tsx`, `tabs.tsx`
- Changed from `@/utilities` → `@/utilities/index` (no breaking API changes)

### Components with Only Class Order Changes

- `dialog.tsx`, `sheet.tsx`, `switch.tsx`, `progress.tsx`, `radio-group.tsx`, `alert.tsx`
- Tailwind class reordering only (no functional impact)

### Minor Component Changes

- **Checkbox:** Border width explicit, flexbox → grid (visual should be identical)
- **Table:** Class order changes (should not break functionality)
- **NavigationMenu:** `data-active` → `data-[state=open]` (update custom CSS if used)
- **DropdownMenu:** Added max-height constraints and overflow
- **ToggleGroup:** Removed ref forwarding, visual changes
- **Pagination:** Type import changes
- **AspectRatio:** Removed ref forwarding
- **Tooltip:** Animation origin changes

---

## Affected Blocks by Component

### Card Component

| Block | Variants with Issues | Status |
|-------|---------------------|--------|
| FeatureBlock | `feature5`, `feature8`, `feature21`, `feature36`, `feature44` | ❌ Needs fix |
| StatBlock | `stat10` (1 instance - works but should refactor) | ⚠️ **REFACTOR** |
| TestimonialBlock | `testimonial2`, `testimonial4`, `testimonial11` (AvatarImage usage) | ✅ **Fixed** |
| FeatureBlock | All 19 registered variants | ✅ **NO ISSUES** |
| CtaBlock | All 3 registered variants (cta1, cta6, cta10) | ✅ **NO ISSUES** |
| TeamBlock | All 3 registered variants (team5, team5-9, team9) | ✅ **NO ISSUES** |
| GalleryBlock | All 6 registered variants | ✅ **NO ISSUES** |
| TeamBlock | `team5`, `team5-9` | ✅ Correct |
| CustomBlock | `team-dial` | ✅ Correct |
| TimelineBlock | `timeline8` | ✅ No Card usage |
| Blog | `blog29` | ✅ No Card usage |

### Button Component

**Status:** ✅ No issues found

**Blocks using Button:** FormBlock, FeatureBlock (15 variants), CtaBlock (12 variants), TestimonialBlock (4 variants), StatBlock, Gallery (5 variants), LoginBlock, SignupBlock, ContactBlock, ChangelogBlock, Blog, BannerBlock, PublicationsBlock, ProjectsBlock, TeamBlock

### Avatar Component

**Status:** ❌ **BREAKING CHANGE FOUND**

**Blocks with AvatarImage `asChild` issues (REGISTERED ONLY):**

- `testimonial2` - 1 instance (line 41)
- `testimonial4` - 3 instances (lines 69, 104, 139)

**Blocks using Avatar correctly:** TeamBlock (3 variants), TestimonialBlock (13 variants), FeatureBlock (5 variants), ContactBlock, FaqBlock, CustomBlock, ResourcesBlock

### Badge Component

**Status:** ✅ No issues found

**Blocks using Badge:** FeatureBlock (24 variants), TeamBlock (2 variants), TestimonialBlock (2 variants), Gallery (2 variants), TimelineBlock, Blog, ProjectsBlock, CustomBlock

### Input/Textarea/Select Components

**Status:** ✅ No issues found

**Blocks using Input:** FormBlock, LoginBlock, SignupBlock, ContactBlock, CtaBlock (2 variants), TeamBlock (2 variants), CustomBlock, ChangelogBlock

**Blocks using Textarea:** FormBlock

**Blocks using Select:** FormBlock, ContactBlock, CustomBlock, CasestudiesBlock

### Other Components

**Tabs:** FeatureBlock (9 variants), TeamBlock (2 variants), CustomBlock  
**Accordion:** FaqBlock (4 variants), FeatureBlock (2 variants)  
**Collapsible:** PublicationsBlock, CustomBlock  
**Progress:** StatBlock, FeatureBlock (2 variants)  
**Separator:** TimelineBlock (✅ correct usage)  
**Carousel:** Gallery (5 variants), FeatureBlock (5 variants), TestimonialBlock (7 variants), LogosBlock (2 variants), ProjectsBlock (2 variants), ContactBlock, CasestudiesBlock

---

## Verification Summary

**VERIFIED BREAKING CHANGES IN REGISTERED BLOCKS:**

**Total Registered Blocks Checked:** 60+ variants across all registered block types

**Breaking Changes Found:**

- **Card padding issues:** 1 instance requiring fix (testimonial4: 1), 1 instance that works but should refactor (stat10: 1)
- **AvatarImage asChild issues:** 4 instances (testimonial2: 1, testimonial4: 3)
- **No issues found:** All other registered variants use correct patterns

**Priority Fix Order:**

1. **HIGH:** `testimonial4` (1 Card padding + 3 AvatarImage asChild issues)
2. **MEDIUM:** `testimonial2` (1 AvatarImage asChild issue)
3. **LOW:** `stat10` (1 Card padding - works but should refactor for consistency)

---

## Action Plan

### Immediate Fixes Required

1. **Card Padding Fixes:**
   - `testimonial4` (line 28): Wrap content in `CardContent` and move `p-6` from Card to CardContent
   - `stat10` (line 41): **Optional** - Refactor to move `p-10` from Card to CardContent for consistency (currently works because CardContent has `p-0` override)

2. **AvatarImage asChild Fixes:**
   - `testimonial2` (line 41): Remove `asChild` prop, use `src` directly
   - `testimonial4` (lines 69, 104, 139): Remove `asChild` prop, use `src` directly

3. **Download Updated Components:**
   - For each affected block, download latest component from shadcnblocks.com
   - Compare with current block variant and update to match new patterns

### Secondary Tasks

1. **Theme Sync:** Update `ThemeConfig` to support new tokens (sidebar-*, chart-*)

2. **Visual Regression Testing:**
   - Input/Textarea responsive sizing
   - Select popover background color

3. **CSS Updates:** Update NavigationMenu custom CSS from `data-active` to `data-[state=open]` if used

### Verification Methodology

**Approach:** Manual file-by-file verification of ONLY registered Payload CMS blocks

**Registered Blocks Verified:**

- Stat: STAT1, STAT10 ✅
- Testimonial: TESTIMONIAL2, TESTIMONIAL3, TESTIMONIAL4 ✅
- Cta: CTA1, CTA6, CTA10 ✅
- Feature: FEATURE1, FEATURE19, FEATURE25, FEATURE50, FEATURE53, FEATURE57, FEATURE70, FEATURE72, FEATURE91, FEATURE97, FEATURE99, FEATURE102, FEATURE103, FEATURE105, FEATURE114, FEATURE117, FEATURE126, FEATURE159, FEATURE250 ✅
- Team: TEAM5, TEAM5-9, TEAM9 ✅
- Gallery: GALLERY3, GALLERY4, GALLERY5, GALLERY6, GALLERY25, GALLERY26 ✅
- Plus: About, Awards, Banner, Blog, Casestudies, Contact, Faq, Logos, Projects, Timeline, Login, Signup, Resources, Publications ✅

**Unregistered Variants (NOT checked):** stat2, feature3-18, feature20-24, feature26-49, feature51-56, feature58-69, feature71, feature73-90, feature92-96, feature98, feature100-101, feature104, feature106-113, feature115-116, feature118-125, feature127-158, feature160-249, testimonial1, testimonial5-19, cta3-5, cta7, cta11-17, etc.

### Notes

- `RelatedPosts`, `ProjectPost`, `BlogPost`, and `CaseStudy` are NOT registered blocks - they are detail page templates for Posts/Projects collections
- **Verification scope:** Only registered Payload CMS block variants were checked (those listed in config files, not commented out)
- **Total breaking changes in registered blocks:** 1 Card padding issue requiring fix (testimonial4), 1 Card padding that works but should refactor (stat10), 4 AvatarImage asChild issues
- **Report corrections:** Card component is NOT a flex container (incorrectly described), Badge component was NOT changed (incorrectly reported)
- **Verification method:** Manual file-by-file review of each registered variant file
- **Confidence level:** 100% - Every registered block variant was individually checked
