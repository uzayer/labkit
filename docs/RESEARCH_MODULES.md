# Research Modules Manifest

> **Purpose:** When extracting the generic base template, remove everything listed here. What remains should be a clean, domain-agnostic CMS + UI kit.
>
> **Last audited:** 2026-03-13

---

## Collections (`src/collections/`)

All research collections are tagged with the `research` admin group so they appear under "Research" in the Payload admin panel.

| Collection | Path | Notes |
|------------|------|-------|
| Publications | `src/collections/Publications/` | Academic papers; ScholarlyArticle schema.org |
| Team | `src/collections/Team/` | Lab members, alumni, collaborators |
| Grants | `src/collections/Grants/` | Research funding; MonetaryGrant |
| Awards | `src/collections/Awards/` | Best Paper etc.; used as `award` property |
| ResearchThemes | `src/collections/ResearchThemes/` | High-level research areas |
| Keywords | `src/collections/Keywords/` | Reusable tags; DefinedTerm / OpenAlex Concept |
| Venues | `src/collections/Venues/` | Conferences, journals; Periodical / Source |
| Organizations | `src/collections/Organizations/` | Institutions, funders, publishers |
| Projects | `src/collections/Projects/` | Research projects hub (owns team, grants, pubs, awards) |

**Base template collections to keep:** `Pages`, `Posts`, `Media`, `Categories`, `Users`, `Roles`

---

## Blocks (`src/blocks/`)

### Fully research-specific (remove entirely)

| Block | Path | What it renders |
|-------|------|----------------|
| PublicationsBlock | `src/blocks/PublicationsBlock/` | Pulls from Publications collection; filterable list + dynamic client |
| Awards | `src/blocks/Awards/` | Pulls from Awards collection; 5 design variants |
| Team | `src/blocks/Team/` | Pulls from Team collection; 3 design variants |
| Projects | `src/blocks/Projects/` | Pulls from Projects collection; 2 design variants |
| ProjectPost | `src/blocks/ProjectPost/` | Project detail body renderer (used on project pages) |
| RenderProjectDetailPage | `src/blocks/RenderProjectDetailPage.tsx` | Orchestrates project detail page layout |

### Partially research-specific (contains research-specific variants)

| Block | Path | Research-specific variant(s) | Keep variant(s) |
|-------|------|------------------------------|-----------------|
| CustomBlock | `src/blocks/CustomBlock/` | `team-dial.tsx`, `team-dial-client.tsx` (Team query), `ProjectPost1`-style case study fields | `TableOfContents.tsx` (generic) |
| About | `src/blocks/About/` | `about1.tsx` references Team collection | `about2–5.tsx` (generic) |

### Blocks to keep entirely (base template)

ArchiveBlock, Banner, Blog, BlogContent, BlogPost, Casestudies, CaseStudy, Changelog, Code, Contact, Cta, Faq, Feature, Form, Gallery, LexicalBlocks, Login, Logos, MediaBlock, RelatedPosts, Resources, Signup, SplitView, Stats, Testimonial, TextBlock, Timeline

> Note: `Careers` folder exists but is empty.

---

## Globals (`src/globals/`)

| Global | Path | Notes |
|--------|------|-------|
| LabInfo | `src/globals/LabInfo/` | Lab identity, parent org, location, social links; ResearchOrganization schema.org |

**Base template globals to keep:** `Header`, `Footer`, `ThemeConfig`, `PageConfig`

---

## Utilities (`src/utilities/`)

| File | Purpose |
|------|---------|
| `aggregateProjectAwards.ts` | Merges award data across projects |
| `formatAuthorsACM.ts` | Formats author lists in ACM citation style |
| `authorUtils.ts` | Author name parsing / disambiguation helpers |

All other utilities are generic and belong in the base template.

---

## Checklist for base template extraction

- [ ] Remove all 9 research collections from `src/collections/`
- [ ] Remove research-specific blocks: PublicationsBlock, Awards, Team, Projects, ProjectPost, RenderProjectDetailPage
- [ ] Remove research variants from CustomBlock and About
- [ ] Remove `LabInfo` global
- [ ] Remove `aggregateProjectAwards.ts`, `formatAuthorsACM.ts`, `authorUtils.ts`
- [ ] Remove research collections from `src/collections/Pages/index.ts` blocks array
- [ ] Remove research blocks from `src/blocks/RenderBlocks.tsx`
- [ ] Remove research routes from `src/payload.config.ts`
- [ ] Remove research-specific types from `src/payload-types.ts` (regenerate after)
