# Pages Collection Schema

> **Note:** This document describes the `Pages` collection, which is the primary website builder component of the DIAL Lab platform. It is documented separately from the core data schema (`SCHEMA.md`) as it focuses on presentation and layout rather than structured research data.

## Overview

The **Pages** collection allows for the creation of flexible, block-based landing pages. It uses a "Hero + Layout" architecture.

**Collection Name:** `pages`
**Endpoint:** `/api/pages`

## Schema

```typescript
{
  // Core
  title: string              // Required, used as page title
  slug: string               // Auto-generated, URL path
  publishedAt: Date          // Schedule publication
  enableBreadcrumbs: boolean // Toggle breadcrumb display

  // Tabs
  // 1. Hero
  hero: Hero                 // Configurable hero section (see below)

  // 2. Content
  layout: Block[]            // Array of content blocks (see below)

  // 3. SEO
  meta: {
    title: string
    description: string
    image: Media
  }
}
```

## Hero Configuration

The `hero` field supports multiple design variants.

- **Type:** Group (conditional fields based on `type`)
- **Common Fields:**
    - `type`: Select (e.g., `home`, `page`, `project`, etc.)
    - `richText`: Heading and subtext
    - `links`: Call-to-action buttons
    - `media`: Background or featured image

## Layout Blocks

The `layout` field is a flexible array of the following block types:

| Block Name | Description |
| :--- | :--- |
| **FeatureBlock** | Highlight key features or benefits |
| **Archive** | List items from other collections (e.g., latest posts) |
| **FormBlock** | Embed forms (contact, newsletter) |
| **CtaBlock** | Call-to-action sections |
| **LogosBlock** | Grid of partner/client logos |
| **AboutBlock** | Company/Lab introduction sections |
| **ContactBlock** | Contact information and maps |
| **Gallery** | Image galleries |
| **TestimonialBlock** | User/Partner testimonials |
| **FaqBlock** | Frequently Asked Questions accordion |
| **StatBlock** | Numerical statistics and counters |
| **SplitViewBlock** | Side-by-side text and media |
| **TextBlock** | Simple rich text content |
| **MediaBlock** | Full-width or contained images/video |
| **CustomBlock** | Developer-defined custom components |
| **ChangelogBlock** | Product updates list |
| **Blog** | Blog post feed |
| **BannerBlock** | Alert or promotional banners |
| **CasestudiesBlock** | Grid of case studies/projects |
| **TimelineBlock** | Chronological events |
| **LoginBlock** | Authentication forms |
| **SignupBlock** | Registration forms |
| **TeamBlock** | Grid of team members |
| **AwardsBlock** | List of awards |
| **ProjectsBlock** | Featured projects grid |
| **ResourcesBlock** | Downloadable resources |
| **PublicationsBlock** | List of academic publications |
