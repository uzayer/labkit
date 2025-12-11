# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Payblocks is a PayloadCMS-based website builder that integrates shadcn/ui components and shadcnblocks UI library. It combines PayloadCMS's content management with an extensive collection of pre-built, customizable blocks for building modern websites.

**Tech Stack:**

- Next.js 15.4.6 (App Router with Turbopack in dev)
- PayloadCMS 3.52.0
- TypeScript
- React 19.1.1
- MongoDB (primary) / PostgreSQL (supported)
- Tailwind CSS 4.x
- pnpm package manager

**Documentation:** <https://docs.shadcnblocks.com/payload/getting-started/>

## Common Commands

### Development

```bash
pnpm dev                    # Start dev server with Turbopack
pnpm dev:debug              # Start dev server with Node inspector
pnpm dev:prod               # Clean build + production start locally
```

### Building & Type Checking

```bash
pnpm build                  # Generate Payload types + build Next.js
pnpm tsc                    # Type check without emitting files
pnpm generate:types         # Generate Payload types only
pnpm generate:importmap     # Generate Payload admin import map
```

### Linting & Formatting

```bash
pnpm lint                   # Run Next.js linter
pnpm lint:fix               # Auto-fix linting issues
pnpm format                 # Format all files with Prettier
pnpm format:check           # Check formatting without changes
```

### Database Operations

```bash
pnpm backup                 # Export MongoDB pages collection to backup/pages.json
pnpm backup:apply           # Import backup/pages.json to MongoDB
```

### Other

```bash
pnpm analyze                # Build with bundle analyzer
pnpm start                  # Start production server
pnpm payload                # Access Payload CLI
```

## Architecture

### PayloadCMS Configuration (`src/payload.config.ts`)

The core configuration defines:

- **Database:** MongoDB adapter (PostgreSQL supported but commented out)
- **Collections:** Pages, Posts, Media, Categories, Users, Roles
- **Globals:** ThemeConfig, Header, Footer, PageConfig
- **Plugins:**
  - `redirectsPlugin` - URL redirects with permission checks
  - `nestedDocsPlugin` - Hierarchical pages/categories with auto-generated URLs
  - `seoPlugin` - SEO meta fields
  - `formBuilderPlugin` - Dynamic forms (Cloudflare Turnstile for protection)
  - `searchPlugin` - Content search
  - `vercelBlobStorage` - Media storage on Vercel
  - `OAuth2Plugin` - Google OAuth login (configurable via env vars)
- **Email:** Resend adapter
- **Localization:** English and German support (both admin + content)
- **Live Preview:** Configured with mobile/tablet/desktop breakpoints

### Content Architecture

#### Pages Collection (`src/collections/Pages/index.ts`)

Pages use a **Hero + Layout Builder** pattern:

1. **Hero Field** (`src/heros/config.ts`): 70+ hero variants with conditional fields based on design version (badge, tagline, rich text, images, icons, USPs, stats, pricing, videos, tabs)
2. **Layout Field**: Array of blocks that compose page content

Available blocks:

- FeatureBlock, Archive, FormBlock, CtaBlock, LogosBlock
- AboutBlock, ContactBlock, Gallery, TestimonialBlock, FaqBlock
- StatBlock, SplitViewBlock, TextBlock, MediaBlock
- CustomBlock, ChangelogBlock, Blog, BannerBlock
- CasestudiesBlock, TimelineBlock, LoginBlock, SignupBlock

#### Blocks System

- **Config files:** `src/blocks/*/config.ts` define Payload field schemas
- **Component files:** `src/blocks/*/Component.tsx` render blocks
- **Variant files:** Multiple design variants per block type (e.g., `cta1.tsx`, `cta3.tsx`, etc.)
- **RenderBlocks:** `src/blocks/RenderBlocks.tsx` maps block types to components and handles background colors

Each block typically has:

- A `designVersion` select field to choose variant
- A `backgroundColor` field for theming
- Block-specific fields (conditional based on design version)

#### Heros System

Similar structure to blocks:

- **Config:** `src/heros/config.ts` with 70+ variants
- **Components:** `src/heros/PageHero/*.tsx` for each variant
- **Renderer:** `src/heros/RenderHero.tsx` maps design versions to components

### Access Control & Permissions

Payblocks uses a **role-based permission system**:

**Collections:**

- `Users` - user accounts with `roles` relationship field (many-to-many)
- `Roles` - role definitions with permission flags

**Permission Flags:**

- `canManageContent` - create/edit content
- `canPublish` - publish content
- `canManageUsers` - manage users
- `canManageRedirects` - manage redirects (security-sensitive)

**Access Control Utilities:**

- `src/access/isAdmin.ts` - Check if user has admin role
- `src/access/authenticated.ts` - Require authentication
- `src/access/authenticatedOrPublished.ts` - Auth OR published content
- `src/utilities/checkPermission.ts` - Check role permissions
- `hasPermission()` - Factory for Payload access control functions

**Important:** Roles must be **populated** (not just string IDs) for permission checks to work. The system warns if string IDs are encountered.

#### Access Control Patterns

PayloadCMS access control functions can return two types of values:

1. **Boolean** - Simple allow/deny:

```typescript
access: {
  read: ({ req: { user } }) => Boolean(user) // Allow if authenticated
}
```

2. **Query Constraint** - Filter accessible documents:

```typescript
access: {
  read: ({ req: { user } }) => {
    if (user) return true // Authenticated users see all
    return { _status: { equals: 'published' } } // Guests see only published
  }
}
```

**Field-Level Access Control:**
Individual fields can have their own access control:

```typescript
fields: [
  {
    name: 'sensitiveData',
    type: 'text',
    access: {
      read: ({ req: { user } }) => user?.role === 'admin',
      update: ({ req: { user } }) => user?.role === 'admin',
    },
  },
]
```

**Collection-Level Operations:**

- `create` - Control who can create documents
- `read` - Control who can read documents (supports query constraints)
- `update` - Control who can update documents (supports query constraints)
- `delete` - Control who can delete documents
- `admin` - Control who can access collection in admin panel
- `readVersions` - Control access to version history (if versions enabled)

### Routing & Rendering

**Dynamic Routes:**

- `src/app/(frontend)/[[...slugs]]/page.tsx` - Catch-all route for CMS pages
- Uses nested docs plugin to generate hierarchical URLs (e.g., `/parent/child/grandchild`)

**Frontend Architecture:**

1. Server component fetches page data via `src/app/(frontend)/[[...slugs]]/data.tsx`
2. `generatePreviewPath()` utility (`src/utilities/generatePreviewPath.ts`) constructs URLs from breadcrumbs
3. Page renders Hero via `RenderHero` component
4. Page renders Layout blocks via `RenderBlocks` component
5. Client-side hydration handled by `page.client.tsx`

**Draft Preview:**

- Live preview in admin panel
- Draft secrets configured via env vars
- Preview paths generated from page slugs + breadcrumbs

### Field Utilities

Reusable field generators in `src/fields/`:

- `link.ts` - Link field with internal/external options, appearances, icons
- `linkGroup.ts` - Array of links (for button groups)
- `slug/` - Auto-generated slugs from titles
- `color.ts` - Background color select with all theme colors

### Hooks & Revalidation

PayloadCMS provides a comprehensive hook system for collections and globals.

**Collection Hook Lifecycle:**

```typescript
hooks: {
  beforeOperation: [(args) => {...}],  // Before any operation starts
  beforeValidate: [(args) => {...}],   // Before validation runs
  beforeChange: [(args) => {...}],     // Before document is saved
  afterChange: [(args) => {...}],      // After document is saved
  beforeRead: [(args) => {...}],       // Before document is read
  afterRead: [(args) => {...}],        // After document is read (last step)
  beforeDelete: [(args) => {...}],     // Before document is deleted
  afterDelete: [(args) => {...}],      // After document is deleted
  afterOperation: [(args) => {...}],   // After any operation completes
  afterError: [(args) => {...}],       // When an error occurs

  // Auth-enabled collections only:
  beforeLogin: [(args) => {...}],
  afterLogin: [(args) => {...}],
  afterLogout: [(args) => {...}],
  afterRefresh: [(args) => {...}],
  afterForgotPassword: [(args) => {...}],
}
```

**Revalidation Pattern:**

- Collection/global hooks trigger revalidation after changes
- `revalidatePage`, `revalidatePost`, `revalidateHeader`, `revalidateFooter`, `revalidateThemeConfig`, `revalidatePageConfig`
- `revalidateRedirects` - Special handling for redirect plugin

**Other Hooks:**

- `populatePublishedAt` - Auto-set publish date
- `populateAuthors` - Handle post authors
- `calculateReadTime` - Estimate reading time for posts

**Transaction Support:**
Hooks automatically participate in database transactions when `req` is passed:

```typescript
const afterChange = async ({ req }) => {
  // This operation is part of the same transaction
  await req.payload.create({
    req, // Pass req to ensure transactional behavior
    collection: 'audit-log',
    data: {
      /* ... */
    },
  })
}
```

### Local API Operations

PayloadCMS Local API provides server-side access to collections and globals with fine-grained control.

**Common Operations:**

```typescript
// Create
await payload.create({
  collection: 'pages',
  data: { title: 'New Page' },
  locale: 'en',
  user: req.user, // For access control
})

// Find
const result = await payload.find({
  collection: 'pages',
  where: { _status: { equals: 'published' } },
  depth: 2, // Auto-populate relationships
  limit: 10,
})

// Update
await payload.update({
  collection: 'pages',
  id: '123',
  data: { title: 'Updated' },
})

// Delete
await payload.delete({
  collection: 'pages',
  id: '123',
})
```

**Important Options:**

- `overrideAccess: boolean` - Defaults to `true` in Local API (bypasses access control). Set to `false` to enforce access control.
- `depth: number` - Controls relationship population depth (0 = no population, higher = deeper nesting)
- `locale: string` - Specify locale for localized content
- `user: User` - Pass user object when `overrideAccess: false` for access control checks
- `req: PayloadRequest` - Pass req for transactional operations
- `select: object` - Control which fields to return
- `populate: object` - Control which populated fields to include

**Example with Access Control:**

```typescript
const pages = await payload.find({
  collection: 'pages',
  overrideAccess: false, // Enforce access control
  user: req.user, // Use this user for permission checks
  where: { category: { equals: 'news' } },
})
```

### TypeScript Paths

```json
{
  "@payload-config": "./src/payload.config.ts",
  "@/*": "./src/*"
}
```

Use `@/` imports throughout the codebase.

### Environment Variables

Required variables (see `.env.example`):

- `MONGODB_URI` - MongoDB connection string
- `PAYLOAD_SECRET` - Payload encryption secret
- `PAYLOAD_PUBLIC_DRAFT_SECRET` - Public draft preview secret
- `NEXT_PRIVATE_DRAFT_SECRET` - Next.js private draft secret
- `REVALIDATION_KEY` - ISR revalidation key
- `NEXT_PRIVATE_REVALIDATION_KEY` - Next.js private revalidation
- `CRON_SECRET` - Cron job authentication
- `BLOB_READ_WRITE_TOKEN` - Vercel Blob storage (optional)
- `RESEND_API_KEY` - Email service (optional)
- `EMAIL_FROM_ADDRESS` - Default sender email
- `GOOGLE_LOGIN_CLIENT_ID` / `GOOGLE_LOGIN_CLIENT_SECRET` - OAuth (optional)
- `ALLOWED_EMAIL_DOMAINS` - Comma-separated allowed domains for OAuth

`NEXT_PUBLIC_SERVER_URL` is derived from Vercel deployment URL or defaults to `http://localhost:3000`.

## Plugin Architecture

PayloadCMS uses a plugin system to extend functionality. Plugins are functions that modify the config:

```typescript
const myPlugin = (pluginOptions) => (incomingConfig) => {
  let config = { ...incomingConfig }

  // Add collections
  config.collections = [...(config.collections || []), newCollection]

  // Add globals
  config.globals = [...(config.globals || []), newGlobal]

  // Extend onInit
  config.onInit = async (payload) => {
    if (incomingConfig.onInit) await incomingConfig.onInit(payload)
    // Add custom initialization
  }

  return config
}
```

**Installed Plugins:**

- `redirectsPlugin` - `/redirects` collection with from/to/type fields
- `nestedDocsPlugin` - Hierarchical URL generation for pages/categories
- `seoPlugin` - Meta title/description/image fields
- `formBuilderPlugin` - Dynamic form builder with submissions
- `searchPlugin` - Full-text search across collections
- `vercelBlobStorage` - Cloud file storage for media
- `OAuth2Plugin` - Google OAuth integration

**Important:** Always use spread syntax when modifying config arrays/objects to prevent data loss.

## Lexical Rich Text Editor

This project uses PayloadCMS's Lexical editor for rich text fields.

**Features Enabled:**

- Headings (h1-h4)
- Bold, Italic, Underline
- Paragraphs
- Links (internal to pages/posts, external URLs)
- Fixed toolbar and inline toolbar
- Blocks feature (for custom embedded content)

**Custom Lexical Blocks:**

- `MotionText` - Animated text block in hero rich text fields
- `Banner` - Inline banner blocks

**HTML Conversion:**
Use `lexicalHTMLField()` to auto-generate HTML from Lexical content:

```typescript
lexicalHTMLField({
  htmlFieldName: 'content_html',
  lexicalFieldName: 'content',
  converters: ({ defaultConverters }) => ({
    ...defaultConverters,
    blocks: {
      customBlock: ({ node }) => `<div>${node.fields.text}</div>`,
    },
  }),
})
```

## Development Patterns

### Adding New Blocks

1. Create block folder: `src/blocks/NewBlock/`
2. Add `config.ts` with Payload field schema (include `designVersion` select)
3. Add variant components: `newblock1.tsx`, `newblock2.tsx`, etc.
4. Add main `Component.tsx` that switches on `designVersion`
5. Register in `src/collections/Pages/index.ts` blocks array
6. Register in `src/blocks/RenderBlocks.tsx` component map
7. Add preview images to `public/admin/previews/`

### Adding Hero Variants

1. Create component: `src/heros/PageHero/hero-{name}.tsx`
2. Add to `allHeroDesignVersions` in `src/heros/config.ts`
3. Add conditional fields if needed in `hero` field definition
4. Update `RenderHero.tsx` to handle new variant
5. Add preview image: `public/admin/previews/hero/hero-{name}.jpeg`

### Adding Custom Fields to Existing Blocks

Blocks use **conditional fields** based on `designVersion`:

```typescript
admin: {
  condition: (_, { designVersion = '' } = {}) => ['1', '2', '3'].includes(designVersion)
}
```

This pattern hides/shows fields in admin UI based on selected variant.

### Styling & Theming

- Tailwind CSS with `@tailwindcss/postcss` plugin
- Theme colors defined in globals (managed via ThemeConfig)
- Background colors for blocks/heros use `backgroundColor` field
- **Important:** RenderBlocks uses switch statement to enumerate all `bg-*` classes so Tailwind includes them in output (see lines 74-166)
- Google Fonts loaded via `src/utilities/loadGoogleFont.ts`

### Type Generation

PayloadCMS auto-generates TypeScript types:

```bash
pnpm generate:types  # Creates src/payload-types.ts
```

Import types from `@/payload-types` or `src/payload-types`.

### MongoDB Collections

Direct MongoDB access available for backup/restore:

- Collections: `pages`, `posts`, `media`, `categories`, `users`, `roles`, `redirects`, `forms`, `form-submissions`, `search`
- Use `mongoexport` / `mongoimport` (see backup scripts in package.json)

## PayloadCMS Admin Panel Customization

The admin panel is highly customizable via collection/global `admin` config:

**Key Options:**

- `useAsTitle: string` - Field to use as document title (defaults to ID)
- `defaultColumns: string[]` - Columns to show in list view
- `group: string | false` - Group collections in navigation (false hides from nav)
- `hidden: boolean | function` - Hide collection from admin panel
- `description: string` - Help text below collection label
- `livePreview: object` - Enable real-time preview
- `preview: function` - Generate preview URLs
- `disableCopyToLocale: boolean` - Disable locale copying
- `hideAPIURL: boolean` - Hide API URL field
- `enableRichTextLink: boolean` - Enable rich text link element
- `enableRichTextRelationship: boolean` - Enable rich text relationship element

**Custom Components:**
Collections/globals can override admin UI components via `admin.components` (see `src/payload.config.ts` for examples of `beforeLogin`, `afterDashboard`, etc.)

## Drafts & Versions

Pages and Posts collections have draft/version support enabled:

**Drafts:**

- Enable via `versions.drafts` in collection config
- Autosave interval set to 100ms for live preview
- Draft preview accessible via secret tokens (env vars)
- `_status` field tracks 'draft' vs 'published' state

**Versions:**

- Max 50 versions per document (`versions.maxPerDoc: 50`)
- Access via `readVersions` permission
- Version history tracked automatically
- Can restore previous versions from admin panel

**Access Control:**
Use `authenticatedOrPublished` pattern to show published content to public and all content to authenticated users.

## Important Notes

- **Node Version:** Requires Node.js ^18.20.2 || ^20.9.0 || ^22.0.0 || ^23.6.0
- **Package Manager:** pnpm 9.15.9 (enforced)
- **Dev Server:** Uses Turbopack for faster builds
- **Type Safety:** `strict: false` but `strictNullChecks: true` in tsconfig
- **Deprecation Warnings:** `NODE_OPTIONS=--no-deprecation` suppresses noisy warnings
- **Imports:** Use ES modules (`type: "module"` in package.json)
- **Image Optimization:** Sharp 0.32.6 for image processing
- **Admin Access:** Admin panel at `/admin` route
- **GraphQL Playground:** Available at `/api/graphql` for testing queries
- **Role Initialization:** Default roles created on system startup via `onInit` hook
- **Document Locking:** Enabled by default to prevent concurrent edits

## Testing & Debugging

No test framework currently configured. For debugging:

- Use `pnpm dev:debug` for Node inspector
- Check browser console for client errors
- Check server logs for API/rendering errors
- Use Payload's built-in GraphQL playground at `/api/graphql`

## Performance Considerations

- Static generation retry/concurrency configured in `next.config.ts`
- Payload autosave interval set to 100ms for live preview
- Version history limited to 50 per doc
- Image remote patterns configured for Vercel deployments
- Bundle analyzer available via `pnpm analyze`

## Context7

Always use context7 when I need code generation, setup or configuration steps, or
library/API documentation. This means you should automatically use the Context7 MCP
tools to resolve library id and get library docs without me having to explicitly ask.

### Context7 Library IDs (

- PayloadCMS: /payloadcms/payload
- Next.js: /vercel/next.js
- React: /facebook/react
- TypeScript: /microsoft/typescript
- Tailwind CSS: /websites/tailwindcss
- Vercel: /vercel/vercel
- MongoDB: /mongodb/mongo
- PostgreSQL: /websites/postgresql
- Resend: /websites/resend
- Cloudflare: /cloudflare/cloudflare-docs

---

## alwaysApply: true

    You are an expert in Fullstack TypeScript development with deep knowledge of Payload CMS, MongoDB, and Node.js.
    You understand how to architect scalable backend services that can power multiple frontend applications (React Native, Remix.js, Next.js).
    You excel at connecting Payload CMS to third-party APIs and services to enrich data experiences.

    Technologies:
    - Backend: Payload CMS, MongoDB, Node.js, Express, TypeScript
    - Frontend: Next.js, React, React Native, Remix.js, TypeScript
    - Database: MongoDB, Mongoose, MongoDB Atlas, MongoDB aggregation pipelines
    - APIs: RESTful APIs, GraphQL, Webhook integrations

    Payload CMS Patterns:
    - Structure collections with clear relationships and field validation
    - Implement proper access control with field-level permissions
    - Create reusable field groups and blocks for content modeling
    - Follow the Payload hooks pattern for extending functionality
    - Implement custom endpoints when necessary instead of overriding core functionality
    - Use migrations for database schema changes
    - Organize collections by domain or feature
    - Implement proper upload handling and image processing

    File Structure:
    - Collections: src/collections/{feature}.ts
    - Globals: src/globals/{feature}.ts
    - Fields: src/fields/{type}.ts
    - Hooks: src/hooks/{collection}/{operation}.ts
    - Endpoints: src/endpoints/{feature}.ts
    - Utilities: src/utilities/{function}.ts

    MongoDB Patterns:
    - Design schemas with proper indexing for performance
    - Use MongoDB aggregation pipelines for complex data transformations
    - Implement proper error handling for database operations
    - Follow data validation patterns at both application and database levels
    - Consider document size limits when designing schemas
    - Use MongoDB transactions for operations that require atomicity
    - Implement pagination for large datasets

    TypeScript Code Style:
    - Use TypeScript for all code; prefer types over interfaces except for public APIs
    - Create precise types that reflect your data models
    - Avoid using 'any' or 'unknown' types; look for type definitions in the codebase
    - Avoid type assertions with 'as' or '!' operators unless absolutely necessary
    - Use mapped and conditional types for advanced type transformations
    - Export types from a central location for reuse

    Code Structure:
    - Write concise, technical TypeScript code
    - Use functional and declarative programming patterns; avoid classes
    - Prefer iteration and modularization over code duplication
    - Use descriptive variable names with auxiliary verbs (e.g., isLoaded, hasError)
    - Structure files: exported page/component, GraphQL queries, helpers, static content, types
    - Use constants for magic numbers and repeated values

    Naming Conventions:
    - Prefer named exports for components and utilities
    - Use PascalCase for components, interfaces, and types
    - Use camelCase for variables, functions, and methods
    - Prefix GraphQL query files with 'use' (e.g., useSiteMetadata.ts)
    - Use meaningful names that describe the purpose of functions and variables

    Syntax Preferences:
    - Use the 'function' keyword for pure functions
    - Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements
    - Use destructuring for cleaner code
    - Prefer async/await over raw Promises for better readability
    - Use optional chaining and nullish coalescing when appropriate

    Security Best Practices:
    - Implement proper authentication and authorization
    - Sanitize user inputs to prevent injection attacks
    - Use environment variables for sensitive configuration
    - Implement rate limiting to prevent abuse
    - Follow the principle of least privilege for API access
    - Use HTTPS for all communications
    - Validate and sanitize all inputs, especially from external sources

    Performance Optimization:
    - Optimize database queries with proper indexing
    - Implement caching strategies for frequently accessed data
    - Use lazy loading and pagination for large datasets
    - Optimize image and asset delivery
    - Use server-side rendering or static generation when appropriate
    - Monitor and optimize API response times

    Testing Approach:
    - Write unit tests for business logic
    - Implement integration tests for API endpoints
    - Use mocking for external dependencies
    - Write end-to-end tests for critical user flows
    - Follow test-driven development when appropriate

    AI Reasoning:
    - Ask clarifying questions when multiple implementation paths are available and the best choice isn't obvious
    - Present trade-offs between different approaches with their pros and cons
    - Confirm understanding of requirements before implementing complex features
    - Suggest alternatives when a requested approach might lead to performance or security issues
    - Request context about existing patterns in the codebase when implementing new features
    - Prioritize consistency with existing codebase patterns
    - Consider scalability implications for database schema design
    - Balance between performance optimization and code maintainability
    - Evaluate security implications of implementation choices
    - Consider Payload CMS best practices when designing content models
