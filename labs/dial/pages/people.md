# People (`/people`)

**Design reference:** Elsevier/ScienceDirect author profile pages — dense but organised, typography-driven hierarchy, metadata visible at a glance. No decorative chrome. Academic readers trust structure over aesthetics.

**Tone:** Nova's credibility anchors the page. Team depth and alumni placement tell the recruitment story.

**Primary flows:**
- Prospective student → stats strip (scale) → PI section (credibility) → team grid (culture) → CTA → /join-us
- Peer researcher / collaborator → PI section → team grid (find a person) → /people/[slug]
- Name-search visitor (organic) → lands directly on team grid; search finds person fast

---

## 0. Stats Strip — `PeopleStats`

**Component:** Custom `PeopleStats` RSC inline in the page. Not a Payload block — data is collection-derived, not editor-managed.

**Layout:** Thin horizontal strip (`py-10`), 4 counters in a row separated by vertical dividers. No heading. Compact — not a full stats1 section.

| Counter | Value | Source |
| ------- | ----- | ------ |
| Researchers mentored | 50+ | `payload.count()` Team collection (all non-alumni roles) |
| Alumni placed | [X] | `payload.count()` Team `role = alumni` |
| Active projects | [X] | Projects collection count |
| Years of research | [X] | Derived from founding year (2017) |

Numbers: `text-3xl font-semibold`. Labels: `text-sm text-muted-foreground` below each counter. Separated by `border-l border-border` on desktop, stacked on mobile.

---

## 1. Meet the PI — `PIProfile`

**Component:** Custom `PIProfile` RSC. No shadcnblocks block fits — the awards row, academic link types (Scholar, ORCID), and portrait layout make this a purpose-built component.

**Layout:** 2-column grid on desktop, `40/60` split. Left: portrait. Right: content stack. Single column on mobile (portrait above content).

**Left column — portrait**
- `Media` component, full column height on desktop
- Square crop, `rounded-lg object-cover`
- Source: Nova's Team record `photo` field

**Right column — content stack**
- Name: `h1 text-3xl font-bold` — "Dr. Nova Ahmed"
- Title: `p text-muted-foreground` — "Professor, ECE, North South University"
- Bio: 3–4 sentences. Beats in order: founded NSUHCI in 2017 through Google collaboration → leads DIAL's focus on technology design, inclusion, and access → Chair, Dhaka ACM SIGCHI Chapter (BanglaCHI) — community leadership signal, distinct from research collaborations → research focus: privacy, accessibility, financial inclusion, HCI for the Global South. Scale line woven in: "has mentored 50+ researchers since 2017, many now at PhD programmes at Cardiff, UMass Amherst, Ohio State, and beyond." *Copy to be written with Nova; avoid jargon and corporate superlatives.*
- Awards row: 4 `Badge` components, `variant="outline"`, `border-amber-400/60 text-amber-700 dark:text-amber-400`. Positioned directly below bio:
  - Best of CHI 2019
  - IAPP Distinguished Privacy Award, SOUPS 2018
  - COMPASS Best Paper 2023
  - Google Research Award 2023
- Links row: `flex gap-4 flex-wrap`, icon-prefixed text links (`text-sm`). Source: `socials` array on Nova's Team record:
  - Google Scholar
  - Email (mailto:)
  - ORCID
  - NSU Faculty Page
- Profile link: `→ /people/nova-ahmed` small text link, below links row

**Data source:** `payload.find({ collection: 'team', where: { role: { equals: 'director' } } })`. Awards from Awards collection filtered by `associatedPerson = Nova`.

---

## 2. The Team — `Team5_9` (rewritten as RSC)

**Component:** `src/blocks/Team/team5-9.tsx` — gutted and rewritten as `async` React Server Component. Same file and export name for continuity.

### ⚠️ Architecture change (required before this page ships)

Current Team5_9 is a `'use client'` tab component driven by static `categories[].teamMembers[]` block data. New version:
- `async` RSC — `payload.find()` queries per role group
- No `categories` prop on block config — sections driven by role values in the collection
- Block config stores only display options (`heading`, `description`, `initialCount`)
- Search requires a small `'use client'` island (`StickySearchBar`) for input state; the grid itself stays server-rendered
- Same pattern as `src/blocks/Blog/Component.tsx`

### Layout: Section headings, not tabs

**Decision: section headings replace tabs.** 50 members across 4 groups does not justify hiding content behind tabs. Section headings keep everything visible and scannable; the search bar handles the name-lookup case without needing to know which tab to open.

```
<section>
  <StickySearchBar />                          ← 'use client' island, covers all sections

  <h3>Faculty & Research Staff</h3>
  <TeamCardGrid roles={['director','faculty','research-staff']} />

  <h3>Graduate Research Assistants</h3>
  <TeamCardGrid roles={['graduate-ra']} />

  <h3>Undergraduate Research Assistants</h3>
  <TeamCardGrid roles={['undergraduate-ra']} initialCount={6} />

  <h3>Collaborators</h3>
  <TeamCardGrid roles={['interdisciplinary-collaborator']} />
</section>
```

When `searchQuery` is non-empty: section headings hide and a flat filtered list renders across all roles (name + title fields searched).

### Card design (Elsevier-inspired — horizontal, left-aligned)

Replaces the centred-avatar style from the current Team5_9.

```
┌─────────────────────────────────────────┐
│ [Photo]  Name                           │
│  80px    Title                          │
│  sq      [NSU] [On Leave?]              │
│          [tag] [tag] [tag]              │
│          [Scholar ↗] [site ↗]           │
└─────────────────────────────────────────┘
```

- `Card` with `p-4 border border-border` — no shadow, no backdrop-blur, no gradient
- Photo: `rounded-md object-cover` square, not circular, 80px
- All text left-aligned
- Affiliation badge: `variant="outline"` — "NSU" for NSU members, institution name for external collaborators, freeform `badge` field value if populated (e.g. "Currently on leave")
- Research interest tags: `variant="secondary" text-xs`, max 3 visible (no overflow)
- External links: ghost icon buttons, 16px icons — Google Scholar and/or personal site if present
- Full card is a link to `/people/[slug]`

### Overflow on Undergraduate RAs

Default: 6 cards shown. `"Show all [X] →"` text link expands inline. No page reload. Built into `TeamCardGrid` as `initialCount` prop. Not present in current Team5_9 — needs to be added.

### Search

`StickySearchBar` — controlled input. Filters on `name` and `title` fields. Covers all role groups simultaneously. Section headings hide when query is non-empty.

V2: research interest keyword search.

### ⚠️ Schema changes required

**Add `research-staff` role** to Team collection `role` select in `src/collections/Team/index.ts`:
```ts
{ label: 'Research Staff', value: 'research-staff' }
```

**Add `badge` text field** to Team record (freeform, optional). Renders as an additional affiliation badge on the card if populated. Replaces any need for a formal `status` enum — covers "Currently on leave", "Visiting", future edge cases.

Run `pnpm generate:types` after both changes.

---

## 3. Alumni — "Where our people go" — `AlumniGrid`

**Component:** Custom `AlumniGrid` RSC. No suitable shadcnblocks block — institution-forward cards with a year badge are distinct from team member cards.

**Layout:** Section heading "Where our people go" + compact grid, `grid-cols-2 md:grid-cols-3 lg:grid-cols-4`.

**Card design:**
```
┌──────────────────────────┬──────┐
│ currentPosition          │ year │
│ Name                     │      │
└──────────────────────────┴──────┘
```

- `currentPosition`: `text-base font-semibold` — e.g. "PhD · UMass Amherst"
- Name: `text-sm text-muted-foreground`
- `alumniYear`: `Badge variant="outline"` top-right corner
- Card: `p-4 rounded-md border border-border`, compact — no photo, no links
- Records with no `currentPosition`: name only in `text-muted-foreground`, position line omitted — no special treatment, same grid position

**Ordering:** `alumniYear` desc (most recent first). No year-grouping headers — the year badge on each card is sufficient and the data would yield uneven groups. Flat ordered grid reads more cleanly.

**Data source:** `payload.find({ collection: 'team', where: { role: { equals: 'alumni' } }, sort: '-alumniYear' })`

**Data tasks before build:**
- Infer `alumniYear` per record from publication co-authorship dates (import task)
- Remove Rahat Jahangir Rony from alumni.md — now Core Team research staff post-PhD
- Records with no `currentPosition` (Mohammad Rayed, Md. Tamjid Hosain, Md. Tamjid Hosain): will render name-only cards

**Institution logos:** Deferred to V2.

---

## 4. CTA — Join the Lab

**Block: `cta32`**

- "No prerequisites. Passionate about HCI. Ready to do fieldwork in Bangladesh."
- Apply button → /join-us

---

## Awards on this page

**Two placements only:**
1. Nova's PI section — 4 gold-accented badge chips (see Section 1)
2. Team cards — **cut from V1.** Award badge on cards requires an Award→Team relationship and join logic at render time with too little payoff at the card level. Awards surface more legibly on `/publications` (paper cards) and `/awards` (canonical). Revisit in V2.

Full site awards touchpoint map:
- `/` Hero stats + collage ✓ already planned
- `/people` PI bio badges only (this page)
- `/publications` award badge on winning paper cards — add when speccing
- `/projects/[slug]` award badge in project header if applicable — add when speccing
- `/research/[theme-slug]` aggregate count in theme sidebar — add when speccing
- `/awards` canonical record, full citations

---

## Data sources summary

| Section | Source |
| ------- | ------ |
| Stats strip | `payload.count()` queries — Team by role groups, Projects collection |
| PI bio | Team collection, `role = director` |
| Awards row | Awards collection filtered by `associatedPerson = Nova` |
| Social links | `socials` array on Nova's Team record |
| Team grid | Team collection queried by role group (4 groups) |
| Research interest tags | Keywords collection via `researchInterests` relationship on Team record |
| Alumni grid | Team collection, `role = alumni`, sorted `-alumniYear` |

---

## Schema changes summary

| Change | File | Prerequisite for |
| ------ | ---- | ---------------- |
| Add `research-staff` to role select | `src/collections/Team/index.ts` | Importing Rahat, Ifti, Anik Sinha, Anik Saha |
| Add `badge` text field (freeform, optional) | `src/collections/Team/index.ts` | On-leave and other affiliation notes on cards |

Run `pnpm generate:types` after both.

---

## Deferred

- Institution logos on alumni cards — V2
- Research interest keyword search — V2
- Award badge on team cards — V2

---

> `/people/[slug]` detail page spec: [team-member.md](team-member.md)
