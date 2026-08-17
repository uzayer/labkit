# Research Theme Detail (`/research/[theme-slug]`)

**What this page uniquely provides:** `/research` gives the overview of all themes + projects. `/publications` gives the full bibliography. This page is the only place that shows everything for *one specific theme* in one view — scoped publications, scoped collaborators, scoped grants. It exists for collaborators and funders who care about one area deeply (e.g. a potential Cardiff partner interested specifically in DIAL's accessibility work).

Visual prototype built at `src/app/research/accessibility-inclusion/page.tsx` (dial-test). Renders almost entirely from data. Minimal manual content entry beyond description and icon.

---

## 0. Breadcrumb

`Research → [Theme Name]` — sits above the header in a thin `border-b border-border` strip. Built with `Link` + `ChevronRight` (lucide). No heading level; purely navigational.

---

## 1. Header

**Block: `Hero262`** (`src/components/hero262.tsx`) with `className="py-16 lg:py-20"` (reduced from its default `py-28 lg:py-32` to bring projects up sooner).

- Theme name as main heading, no subheading
- `shortDescription` expanded into a full paragraph (description prop)
- Key stats row auto-pulled: X projects, Y publications, Z grants
- Data source: ResearchTheme collection

---

## 2. Projects in this theme

**Block: `Feature295`** (`src/components/feature295.tsx`) — adapted as follows:

| Feature295 original | DIAL adaptation |
| ------------------- | --------------- |
| Category filter chips (React, TailwindCSS…) | Research keyword filters — from `Project.keywords` (Keywords collection). Chips are scrollable, "All" selected by default. |
| Role dropdown (Author / Contributor) | Status dropdown: All / Ongoing / Completed |
| Stars stat | Publication count for this project |
| Pull requests stat | Team member count |
| Role badge on card | Status badge: Ongoing / Completed |
| Card title | Bengali project name (localName) as headline, English title as subtitle |
| Card description | `Project.abstract` (one line) |
| Card link | `/projects/[slug]` |
| "View All Projects" expand | "Show all X projects" — triggers when project count exceeds 9 |

Default sort: Ongoing first, then Completed, ordered by `updatedAt` desc within each group. Filter chips default to "All" — selecting a keyword filters to projects tagged with that keyword.

Award badge: if a project has an associated award, show a small gold indicator on the card (same pattern as research overview spotlight cards).

Data source: Projects collection, filtered by `themes` contains this theme slug.

---

## 3. Publications in this theme

**Block: `ResearchThemePublications`** (`src/components/research-theme-publications.tsx`) — standalone client component (no Payload dependency in dial-test; wired to Payload in production).

- Same entry format as Publications page — see [site-wide-features.md](../site-wide-features.md#publication-entry--standard-format)
- Sorted newest-year-first; within each year, award-winning papers first
- "View all publications" button links to `/publications`
- Each entry: title (text-primary, text-xl), authors (muted, sm), venue badge (bg-black text-white), award badge (bg-amber-500), PDF link, Cite popover (clipboard copy), Project link
- No collapsible overflow on theme pages — themes have few enough publications to show all
- Data source: ResearchTheme.publications join

---

## 4. Collaborators on this theme

- **External collaborators only** — not DIAL members (they're already on the People page). Following ResearchTheme → projects → teamMembers would pull in every grad RA who touched the theme; this section should filter to people whose affiliation is not DIAL/NSU (i.e., Cardiff, Google, Microsoft Research India, etc.)
- Grouped by institution: institution name as uppercase tracking-widest xs label, then collaborators listed below
- Each collaborator: Avatar with initials fallback (size-9), name (sm font-medium), role (xs muted)
- Grid: 1 col → 2 col (md) → 3 col (lg), gap-x-16 gap-y-10
- Data source: ResearchTheme → projects → teamMembers (filter: affiliation ≠ DIAL)

---

## 5. Funding acknowledgment

- "This research has been supported by..." — inline prose, funder names as small pill badges (`rounded border border-border px-2 py-0.5 text-xs font-medium text-foreground`)
- No dollar amounts
- Data source: ResearchTheme.grants join → Grant.funder → Organization.name

---

## 6. Related themes

- Small link cards: theme name (font-medium, hover:text-primary) + one-line description (sm muted)
- Card style: `rounded-lg border border-border p-4 hover:border-primary/30 hover:bg-accent/50`
- Grid: 1 col → 2 col (sm) → 3 col (lg), gap-4
- Primary match: themes sharing CCS concepts / keywords
- Secondary fallback: themes that share at least one project
- Data source: ResearchTheme.keywords → find themes with overlapping keywords
- Schema: `keywords: Keyword[]` already added to ResearchTheme in data-schema.md
