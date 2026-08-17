# Projects (`/projects`)

Parallel to `/publications` — the full, browsable, filterable directory of all DIAL projects. `/research` carries editorial spotlights; this page is where you go to find and browse the complete body of work.

Two audiences: (1) prospective students scanning for interesting work to join, (2) peer researchers/collaborators looking for a specific project.

---

## 1. Page header

Light — no full hero block. Section heading + one-sentence purpose line. Stats inline: `X projects · Y ongoing`.

---

## 2. Filter bar + Projects grid

**Block TBD** — adapt `feature295` (already planned for `/research/[theme-slug]`), unscoped.

Filter bar:

- **Research Theme** — chips or dropdown, sourced from ResearchThemes collection
- **Status** — All / Ongoing / Completed
- **Keywords** — sourced from Keywords collection

Each project card:

- Bengali project name as the visual headline (`Project.localName`) — English title as subtitle
- `Project.abstract` — one line
- Theme tag(s)
- Status badge: Ongoing / Completed
- Award badge if applicable
- Lead researcher name
- Link → `/projects/[slug]`

Default sort: Ongoing first, then Completed; recency descending within each group. Award-winning projects surfaced within their status group.

Data source: Projects collection, all records.

> **⚠️ Schema dependency:** Requires `localName`, `leadResearcher`, and `featured` fields on Projects collection — same fields noted in [research.md §5](research.md#5-spotlight-projects).

---

## 3. CTA

**Block TBD.**

Exit paths from this page differ from `/research`:

- Student who found an interesting project → `/join-us`
- Peer who wants the associated papers → `/publications`

---

## Data sources summary

| Section             | Source                                             |
| ------------------- | -------------------------------------------------- |
| Stats (header)      | Live counts: Projects collection                   |
| Projects grid       | Projects collection, all records                   |
| Filter: Theme chips | ResearchThemes collection                          |
| Filter: Keywords    | Keywords collection                                |
| Award badges        | Awards collection, filtered by `associatedProject` |
| Lead researcher     | Team collection, via `Project.leadResearcher`      |

---

## Deferred

- Sort/group by year (like `/publications`) — decide at build time whether status grouping or year grouping is more useful
- Search within projects — candidates: project name, abstract, keywords; decide alongside ⌘K global search
- Featured/pinned projects at top of grid — low priority; spotlights on `/research` already serve this
