---
name: Research Collections Data Layer Optimization
overview: ''
todos:
  - id: 21bc968f-a859-4a39-a4f0-796fde6b52d8
    content: 'Add MongoDB indexes to Projects collection: status, featured, date fields'
    status: pending
  - id: 80c64341-0acd-4efb-9e45-b84c0c3714a6
    content: Add URL validation and year range validation (1900 to currentYear+5) to Awards collection
    status: pending
  - id: b325d7c9-88c9-4b33-a554-8ad5a2f3cec0
    content: 'Add MongoDB indexes to People collection: role, level, displayInWebsite fields'
    status: pending
  - id: a5b967fc-d3d6-4b31-bdf0-cb9f3a975fe6
    content: Remove outdated googleScholarUrl validation reference from validatePeople hook
    status: pending
  - id: eff3db68-183d-4b0a-acca-26de6984015c
    content: Add year range validation (1900 to currentYear+5) to Publications collection
    status: pending
  - id: fc97d5dc-3196-41c0-9bf3-9b27d04c8d22
    content: 'Add MongoDB index to Research Themes collection: featured field'
    status: pending
---

# Research Collections Data Layer Optimization

## Goals

- Add MongoDB indexes for common filtering/sorting patterns in blocks
- Add validation rules for data integrity (URLs, year ranges)
- Ensure relationships are structured optimally for block queries
- Remove outdated validation references
- Keep collections optimized for manual selection in blocks (filtering happens in block rendering logic)

## Step 1: Projects Collection (`src/collections/Projects/index.ts`)

### Indexes

- Add `index: true` to `status` field (line 204) - supports filtering by ongoing/completed
- Add `index: true` to `featured` field (line 229) - supports homepage/landing highlighting
- Add `index: true` to `date` field (line 221) - supports sorting and date-range queries

### Relationships

- Keep existing relationships (themes, awards, publications, people) as-is
- Relationships are sufficient for block rendering; no changes needed

### Notes

- Projects already has SEO/live preview and slug fields (correct for page-style collection)
- Keep existing hooks (revalidateProject, populateAuthors, calculateReadTime)

## Step 2: Awards Collection (`src/collections/Awards/index.ts`)

### Validation

- Add URL validation to `url` field (line 39) using `isValidUrl` utility from `@/utilities/validation`
- Add year range validation in a new hook: validate years between 1900 and currentYear+5
- Create validation hook file: `src/collections/Awards/hooks/validateAwards.ts`

### Indexes

- `year` field already has `index: true` (line 36) - no change needed
- No `featured` or `type` fields currently - skip per requirements

### Relationships

- Decide on reverse relationship to projects:
- If adding: Add `projects` relationship field to Awards for bidirectional queries
- If not: Keep one-way (Projects → Awards only)
- Note: This decision affects whether blocks can query projects from an award context

### Notes

- No slug/SEO/live preview needed (data-only collection)
- Treat as data-only rendered via blocks

## Step 3: People Collection (`src/collections/People/index.ts`)

### Indexes

- Add `index: true` to `role` field (line 29) - supports filtering by role (pi, undergraduate-ra, etc.)
- Add `index: true` to `level` field (line 59) - supports filtering by level (undergraduate, graduate, postdoc)
- Add `index: true` to `displayInWebsite` field (line 146) - supports filtering active profiles

### Validation

- Remove `googleScholarUrl` validation reference from `validatePeople` hook (`src/collections/People/hooks/validatePeople.ts`, line 12-14)
- Social links are handled via `socials` array which already has URL validation in the hook

### Relationships

- Keep existing `projects` relationship (already has reverse relationship)
- Relationships are sufficient for block rendering

### Notes

- No slug/SEO needed (data-only collection)
- Blocks will handle filtering by role/department at render time

## Step 4: Publications Collection (`src/collections/Publications/index.ts`)

### Indexes

- `year` already has `index: true` (line 30) - no change needed
- `featured` already has `index: true` (line 106) - no change needed
- `type` already has `index: true` (line 115) - no change needed

### Validation

- Add year range validation in existing `validatePublications` hook: validate years between 1900 and currentYear+5
- Update `src/collections/Publications/hooks/validatePublications.ts`

### Relationships

- Keep existing `projects` relationship (already has reverse relationship)
- Keep existing `themes` and `awards` relationships
- Relationships are sufficient for block rendering

### Notes

- No slug/SEO/live preview needed (data-only collection)
- Separate publications block will handle rendering (to be created later)

## Step 5: Research Themes Collection (`src/collections/ResearchThemes/index.ts`)

### Indexes

- Add `index: true` to `featured` field (line 36) - supports homepage/landing highlighting

### Relationships

- Decide on reverse relationship to projects:
- If adding: Add `projects` relationship field to Research Themes
- If not: Keep one-way (Projects → Research Themes only)
- Note: Affects whether blocks can query projects by theme from a theme context

### Notes

- Keep slug field (line 27) - may be useful for filtered views even without dedicated pages
- No SEO/live preview needed (data-only collection)
- Relationships from projects/publications are sufficient for filtered views

## Overengineering Assessment

**Essential (not overengineered):**

- MongoDB indexes on frequently-queried fields - standard performance optimization
- URL validation - basic data integrity
- Removing outdated validation reference - cleanup

**Potentially strict but reasonable:**

- Year range validation (1900 to currentYear+5) - conservative but prevents obvious errors
- Reverse relationships - requested feature, standard pattern in codebase (People/Publications already have them)

**What we're NOT doing (avoiding overengineering):**

- No auto-sync hooks for relationships (manual maintenance is fine)
- No computed/aggregated fields
- No additional validation beyond URLs and year ranges
- No changes to block rendering logic
- No changes to frontend views

**Verdict**: The plan is minimal and focused on data-layer optimizations. Indexes and validation are standard best practices. Reverse relationships match existing patterns and enable flexible block queries.

## Implementation Notes

### Validation Utilities

- Use existing `isValidUrl` from `@/utilities/validation` for URL validation
- Create year validation helper or inline logic in hooks

### Relationship Decision Required

- **Awards → Projects**: Should Awards have a `projects` relationship for reverse queries?
- **Research Themes → Projects**: Should Research Themes have a `projects` relationship?

These affect query patterns but don't break functionality either way. One-way relationships work if blocks query from the Projects side.

### Testing Considerations

- Verify indexes are created in MongoDB after deployment
- Test validation rules reject invalid years/URLs
- Confirm relationships populate correctly when querying with depth
