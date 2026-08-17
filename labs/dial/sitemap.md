# DIAL Site — Sitemap & IA Spec

Last updated: 2026-04-22

---

# Sitemap

| Route                    | Description                                     | IA decided | Blocks decided |
| ------------------------ | ----------------------------------------------- | ---------- | -------------- |
| `/`                      | Home                                            | ✅         | ✅             |
| `/people`                | People                                          | ✅         | ✅             |
| `/people/[slug]`         | Team Member bio                                 | ✅         | ✅             |
| `/research`              | Research — theme directory + spotlight projects | ✅         | ✅             |
| `/research/[theme-slug]` | Research Theme detail                           | ✅         | ✅             |
| `/projects`              | Projects — full filterable directory            | ✅         | ✅             |
| `/projects/[slug]`       | Project detail                                  | ✅         | ✅             |
| `/publications`          | Publications                                    | ✅         | ✅             |
| `/awards`                | Awards                                          | ✅         | ✅             |
| `/news`                  | News                                            | ✅         | ✅             |
| `/join-us`               | Join Us                                         | ✅         | ✅             |
| `/contact`               | Contact                                         | ✅         | ✅             |

**IA decided = sections and content structure locked. Blocks decided = specific shadcnblocks components chosen.**

**Notes (routes):**

- `/projects` is the full project directory — parallel to `/publications`. `/research` carries editorial spotlights only; the filterable grid lives at `/projects`.
- No `/publications/[slug]` detail route — dropped by design (titles link to DOI / venue).

## Blocks by Page (current decisions)

| Route                    | Blocks / key components                                                                                                                                                                                                                                                                                                                                                                                                                         |                                                                                                                                                  |
| ------------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `/`                      | Custom `hero-dial` (adapted from `src/components/hero171.tsx`); collaborators strip adapted from `src/components/logos12.tsx`; `about6`; Research Themes: `**feature122`** (hub "Explore our research" + team photo → `/research`; theme grid → `/research/[theme-slug]`); fallback `**feature277`** if the split layout is dropped; Dual CTA (custom layout, no download); closing CTA: `**cta12`**                                            |                                                                                                                                                  |
| `/people`                | `PeopleStats` (custom RSC, 4 collection-derived counters, thin strip); `PIProfile` (custom RSC, 2-col portrait + bio + awards chips + links); `Team5_9` (rewritten as RSC with `payload.find()`; section headings not tabs: Faculty & Research Staff · Graduate RAs · Undergraduate RAs · Collaborators; Elsevier-style horizontal cards); `AlumniGrid` (custom RSC, institution-forward compact grid, alumni as section not tab); CTA: `cta32` |                                                                                                                                                  |
| `/people/[slug]`         | IA decided — see [team-member.md](pages/team-member.md). Sections: Profile Header; Publications (year-grouped); Projects (card grid); Grants (conditional). Specific blocks/components TBD.                                                                                                                                                                                                                                                     |                                                                                                                                                  |
| `/publications`          | Layout shell direction: `timeline14` adaptation + **custom publication card** (WIP)                                                                                                                                                                                                                                                                                                                                                             |                                                                                                                                                  |
| `/research`              | `hero262`; `logos1` (venue strip); stats bar (inline); `feature199` (Research Areas grid); `feature138` (Spotlight Projects); multi-path CTA (block **TBD**)                                                                                                                                                                                                                                                                                    |                                                                                                                                                  |
| `/research/[theme-slug]` | Blocks **TBD** (mostly data renders)                                                                                                                                                                                                                                                                                                                                                                                                            |                                                                                                                                                  |
| `/projects`              | Blocks **TBD** — see [projects.md](pages/projects.md)                                                                                                                                                                                                                                                                                                                                                                                           |                                                                                                                                                  |
| `/projects/[slug]`       | **ProjectPost1** (already built; extend with publications + grants + Bengali `localName`)                                                                                                                                                                                                                                                                                                                                                       |                                                                                                                                                  |
| `/news`                  | §0 Minimal page header (inline markup, no hero block); §1 `NewsFeed` custom client component (`src/components/news-feed.tsx`) — year-grouped, type-filtered (Academic / Organised / Community), upcoming badge, same pill-filter pattern as `/awards`                                                                                                                                                                                           |                                                                                                                                                  |
| `/awards`                | `hero262` (page hero — two-col, heading + stats list); `awards3` adapted (§2 Featured — hover list, 4 `isFeatured` entries, all gold indicators); `awards4` adapted (§3 Full list — table, org text badge, name, linked pub, year, category; custom filter badge strip above table)                                                                                                                                                             |                                                                                                                                                  |
| `/join-us`               | `hero197` (page header, dotted bg pattern, recruitment status badge); `feature10` ("Why DIAL"); `feature37` (Life at DIAL — 5-col bento photo grid, 6 cards, alternating 2/3 col widths); `careers3` (openings); `cta4` ("Ready to join?" — 2-col card, mailto button + application checklist)                                                                                                                                                  |                                                                                                                                                  |
| `/contact`               | `contact1`: split `[info sidebar                                                                                                                                                                                                                                                                                                                                                                                                                | form]`; no map; sidebar: Nova's email + address + Scholar + socials +` /join-us`signpost; form wired to Payload`form-submissions` with Turnstile |

---

# Pages (Navbar)

- Home
- People
- Research
- Projects
- Publications
- Awards
- News
- Join Us
- Contact

Detail Pages:

- Project detail (`/projects/[slug]`)
- Research Theme detail (`/research/[theme-slug]`)
- Team Member bio (`/people/[slug]`)

## Deferred / Decided Against

- Resources → deferred (no datasets/code to share yet)
- Alumni page → Alumni tab on People page; cards only, no detail pages
- Current openings as structured collection → dropped in favor of static copy (Nova updates once a semester)
- `/publications/[slug]` detail pages → dropped. Publication titles link to external DOI. The venue (ACM DL, JMIR, etc.) is the authoritative source; Scholar indexes via DOI. Schema.org JSON-LD (`ScholarlyArticle`) is injected on any page that renders publications — `/publications`, `/research/[theme-slug]`, `/projects/[slug]`.
- "In the Media" → dropped. DIAL doesn't have enough media coverage to justify a section. If coverage happens, an entry on `/news` suffices.

**Pages from the current DIAL site (nsuhci) — what changed:**

| Old page               | Decision                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| ---------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| DIAL Research          | → `/research` (renamed)                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| Awards                 | → `/awards` (kept as standalone — record is too strong to bury as badges only)                                                                                                                                                                                                                                                                                                                                                                                      |
| Events                 | → `/news` (renamed; navbar "Events" → "News"; scope redefined — 3 types: Academic / Organised / Community; no awards cross-posting; year-grouped feed — see [news.md](pages/news.md))                                                                                                                                                                                                                                                                               |
| Research Collaboration | → Dropped as standalone page. Partner/funder information is distributed contextually: spotlight cards on `/research` carry per-project attribution; full scoped picture (collaborators + funding) lives on each `/research/[theme-slug]` detail page; site-wide first-impression signal is the home collaborators strip. Interdisciplinary collaborators also surface via the Collaborators tab on `/people`. Dhaka ACM SIGCHI Chapter → Nova's bio on People page. |
| Contact Us             | → `/contact` (renamed, separated from Join Us)                                                                                                                                                                                                                                                                                                                                                                                                                      |

---

> **Further reading:**
>
> - [Product Context](product-context.md) — audiences, IA principles, content hierarchy, metrics
> - [Site-Wide Features](site-wide-features.md) — ⌘K search, publication entry format, award visual treatment
> - [Global Layout](global-layout.md) — header and footer specs
> - [Page specs](pages/) — per-page IA breakdown
