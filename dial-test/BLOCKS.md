# DIAL site block inventory

Audit of all **21 App Router routes** (`src/app/**/page.tsx`), plus **global layout chrome** (noted once). `public/design-system.html` is excluded. **@tailark-pro** is configured in `components.json` but **no Tailark blocks are installed or referenced** in this repo.

**How to read this doc**

- **Registry** — `@shadcnblocks` = block filename matches a shadcnblocks registry ID (e.g. `hero262.tsx` → `hero262`), possibly edited. **Custom** = hand-built for DIAL or a composition wrapper; may still use block CDN assets in places.
- **Expanded trees** — top-to-bottom render order; indentation = composition (parent → child).
- **Heatmap** — `█` = route uses that block (directly or via a child); layout-only blocks have their own row.

---

## Global chrome (all routes)

Rendered from `src/app/layout.tsx` on every page:

| Order | Block / component | Registry | Notes |
|------:|-------------------|----------|-------|
| 1 | `navbar4` | @shadcnblocks | DIAL nav labels, links, and structure; mega-menu imagery still uses block CDN assets. |
| — | `<main>{children}</main>` | — | Page content |
| 2 | `footer18` | @shadcnblocks | DIAL footer copy, link groups, and copyright. |

---

## §0 Master registry (unique blocks)

### Used on site

| Block ID | Component | Registry | Route count | Used on |
|----------|-----------|----------|------------:|---------|
| `navbar4` | `Navbar4` | @shadcnblocks | 21 (+layout) | Global |
| `footer18` | `Footer18` | @shadcnblocks | 21 (+layout) | Global |
| `hero262` | `Hero262` | @shadcnblocks | 12 | `/research`, `/projects`, `/awards`, all 9 `/research/*` theme pages |
| `hero171` | `Hero171` | @shadcnblocks | 1 | `/` |
| `hero197` | `Hero197` | @shadcnblocks | 1 | `/join-us` |
| `about6` | `About6` | @shadcnblocks | 1 | `/` |
| `logos12` | `Logos12` | @shadcnblocks | 1 | `/` |
| `logos1` | `Logos1` | @shadcnblocks | 2 | `/research`, `/about` |
| `feature199` | `Feature199` | @shadcnblocks | 1 | `/research` |
| `feature295` | `Feature295` | @shadcnblocks | 9 | All 9 theme pages under `/research/…` |
| `feature10` | `Feature10` | @shadcnblocks | 1 | `/join-us` |
| `feature37` | `Feature37` | @shadcnblocks | 1 | `/join-us` |
| `careers3` | `Careers3` | @shadcnblocks | 1 | `/join-us` |
| `cta12` | `Cta12` | @shadcnblocks | 3 | `/about`, `/projects`, `/people/[slug]` |
| `cta32` | `Cta32` | @shadcnblocks | 1 | `/people` |
| `cta4` | `Cta4` | @shadcnblocks | 1 | `/join-us` |
| `contact1` | `Contact1` | @shadcnblocks | 1 | `/contact` |
| `team5-9` | `Team5_9` | @shadcnblocks | 1 | `/people` |
| — | `home-sections` | Custom | 1 | `/` — `HomeImpactStats`, `HomeResearchAreas`, `HomeLabInvitation` |
| — | `research-sections` | Custom | 1 | `/research` — stats, method, bento, invitation sections |
| — | `publications1` | Custom | 11 | `/`, `/publications`, 9 theme pages — hand-built publication UI |
| — | `featured-publications` | Custom | 1 | `/research` — thin wrapper → `FlatPublicationList` |
| — | `news-feed` | Custom | 1 | `/news` |
| — | `projects-grid` | Custom | 2 | `/projects`, `/people/[slug]` (`ProjectCard`) |
| — | `project-post` | Custom | 1 | `/projects/[slug]` |
| — | `theme-page-sections` | Custom | 9 | All theme pages — collaborators + related areas |
| — | `awards-filter-table` | Custom | 1 | `/awards` |
| — | `people-stats` | Custom | 1 | `/people` |
| — | `pi-profile` | Custom | 1 | `/people` |
| — | `alumni-grid` | Custom | 1 | `/people` |
| — | `member-profile` | Custom | 1 | `/people/[slug]` |
| — | `member-publications` | Custom | 1 | `/people/[slug]` |

### Installed but unused (orphans)

| Block ID | Component | Registry | Notes |
|----------|-----------|----------|-------|
| `about28` | `About28` | @shadcnblocks | Not imported anywhere (new/unwired). |
| `awards3` | `Awards3` | @shadcnblocks | `/awards` inlines this pattern in the page file instead. |
| `awards4` | `Awards4` | @shadcnblocks | Replaced by `awards-filter-table` on `/awards`. |
| `blog1` | `Blog1` | @shadcnblocks | — |
| `blog17` | `Blog17` | @shadcnblocks | — |
| `blog22` | `Blog22` | @shadcnblocks | — |
| `changelog3` | `Changelog3` | @shadcnblocks | Shares types with `news-feed`; `/news` uses custom `NewsFeed` instead. |
| `contact22` | `Contact22` | @shadcnblocks | `/contact` uses `contact1`. |
| `feature101` | `Feature101` | @shadcnblocks | — |
| `feature122` | `Feature122` | @shadcnblocks | — |
| `feature138` | `Feature138` | @shadcnblocks | — |
| `feature280` | `Feature280` | @shadcnblocks | Uses `ui/card-stack`; never wired to a route. |
| `gallery33` | `Gallery33` | @shadcnblocks | — |
| `hero10` | `Hero10` | @shadcnblocks | — |
| `team-section` | `TeamSection` | @shadcnblocks | `/people` uses `team5-9` instead. |
| — | `shadcnblocks/pattern-placeholder` | @shadcnblocks | Helper only; not used on routes. |

**Dead code note:** `home-sections` exports `HomeHero` but `/` uses `Hero171` instead — `HomeHero` is never mounted.

---

## Reuse highlights & heatmap

### Most reused (site blocks only, excluding layout)

| Block / component | Routes | Where |
|-------------------|-------:|-------|
| `hero262` | **12** | Research hub, projects, awards, 9 theme pages |
| `publications1` | **11** | Home + publications index + 9 theme pages |
| `theme-page-sections` | **9** | All research theme pages |
| `feature295` | **9** | All research theme pages |
| `cta12` | **3** | About, projects, people detail |
| `logos1` | **2** | Research, about |
| `projects-grid` | **2** | Projects index, people detail |

### Heatmap (█ = used)

Legend: `Hm` home · `Ab` about · `Rs` research · `Th` theme×9 · `Pr` projects · `Pd` project detail · `Pb` publications · `Nw` news · `Pe` people · `Pm` person · `Aw` awards · `Jn` join-us · `Co` contact · `Ly` layout

| Block | Hm | Ab | Rs | Th | Pr | Pd | Pb | Nw | Pe | Pm | Aw | Jn | Co | Ly |
|-------|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|:--:|
| `navbar4` | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ |
| `footer18` | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ | █ |
| `hero262` | | | █ | █ | █ | | | | | | █ | | | |
| `hero171` | █ | | | | | | | | | | | | | |
| `publications1` | █ | | | █ | | | █ | | | | | | | |
| `feature295` | | | | █ | | | | | | | | | | |
| `theme-page-sections` | | | | █ | | | | | | | | | | |
| `logos1` | | █ | █ | | | | | | | | | | | |
| `cta12` | | █ | | | █ | | | | | █ | | | | |
| `logos12` | █ | | | | | | | | | | | | | |
| `about6` | █ | | | | | | | | | | | | | |
| `home-sections` | █ | | | | | | | | | | | | | |
| `research-sections` | | | █ | | | | | | | | | | | |
| `feature199` | | | █ | | | | | | | | | | | |
| `news-feed` | | | | | | | | █ | | | | | | |
| `projects-grid` | | | | | █ | | | | | █ | | | | |
| `team5-9` | | | | | | | | | █ | | | | | |
| `cta32` | | | | | | | | | █ | | | | | |
| `hero197` | | | | | | | | | | | | █ | | |
| `contact1` | | | | | | | | | | | | | █ | |

---

## Per-route breakdown (expanded)

Theme pages share one template; only the slug and copy differ. Listed once as **Research theme template** (applies to all nine routes below).

**Theme routes:**  
`/research/accessibility-inclusion` · `/research/gender-feminist-hci` · `/research/ictd` · `/research/mental-health-wellbeing` · `/research/explainable-ai-ml` · `/research/safety-security` · `/research/infodemic-misinformation` · `/research/computing-education-community` · `/research/iot-low-cost-hardware`

---

### `/` — Home

1. `hero171` — @shadcnblocks · DIAL headline, CTAs, and imagery (block placeholders partially retained).
2. `home-sections` → `HomeImpactStats` — Custom · three stat cards.
3. `logos12` — @shadcnblocks · partner logo carousel (fictional logos still in data).
4. `about6` — @shadcnblocks · photo grid + mission copy customized for DIAL.
5. `home-sections` → `HomeResearchAreas` — Custom · research area cards + feature image (block CDN photos).
6. `publications1` → `PublicationsSection` — Custom · “Selected Publications” + `SAMPLE_PUBLICATIONS`.
7. `home-sections` → `HomeLabInvitation` — Custom · join/collaborate CTA panel.

---

### `/about` — About

1. **Inline page hero** — Custom · badge, H1, intro, quote card (shadcn `Card` only).
2. **Inline stats strip** — Custom · four-up metrics grid.
3. **Inline “What we do”** — Custom · values cards.
4. **Inline “How the work happens”** — Custom · three-step methods.
5. **Inline timeline** — Custom · milestone list with separators.
6. `logos1` — @shadcnblocks · partner strip; logo URLs still default block assets.
7. `cta12` — @shadcnblocks · props wired to DIAL links (“Explore research”, “Contact us”).

---

### `/research` — Research hub

1. `hero262` — @shadcnblocks · props-driven stats/headline; default SaaS copy removed via props.
2. `logos1` — @shadcnblocks · same as about.
3. `research-sections` → `ResearchStats` — Custom · three research metrics.
4. `feature199` — @shadcnblocks · theme area cards/dialogs; DIAL theme list and links.
5. `research-sections` → `ResearchMethod` — Custom · three-column method (block placeholder images in data).
6. `research-sections` → `ResearchSpotlightBento` — Custom · bento grid of themes.
7. `featured-publications` — Custom wrapper → `publications1` → `FlatPublicationList`.
8. `research-sections` → `ResearchInvitation` — Custom · closing CTA section.

---

### Research theme template (×9 routes)

1. **Inline breadcrumb** — Custom · Research → theme name.
2. `hero262` — @shadcnblocks · per-theme heading, description, stats.
3. `feature295` — @shadcnblocks · heavily adapted project directory/cards for DIAL `ResearchProject` model.
4. `publications1` → `PublicationsSection` — Custom · theme-filtered publication years.
5. `theme-page-sections` → `ThemeCollaborators` — Custom · institution-grouped collaborator list.
6. **Inline funding section** — Custom · funder chips (not a separate component).
7. `theme-page-sections` → `ThemeRelatedAreas` — Custom · related theme cards with icons.

---

### `/projects` — Projects index

1. `hero262` — @shadcnblocks · project counts in stats.
2. `projects-grid` → `ProjectsGrid` — Custom · filterable project card grid (URL-driven filters).
3. `cta12` — @shadcnblocks · “Join us” / “Browse publications”.

---

### `/projects/[slug]` — Project detail

1. `project-post` → `ProjectPost` — Custom · breadcrumbs, metadata, collapsible sections, dummy `DUMMY_PROJECT` data.

---

### `/publications` — Publications

1. `publications1` → `PublicationsSectionWithUrl` — Custom · full bibliography with URL-synced year/type/theme filters.

---

### `/news` — News

1. **Inline page hero** — Custom · uses block `grid1.svg` pattern as background; type legend.
2. `news-feed` → `NewsFeed` — Custom · upcoming cards + changelog-style past feed (replaces unused `changelog3` block).

---

### `/people` — People

1. `people-stats` — Custom · four-up lab metrics.
2. `pi-profile` — Custom · PI bio card (one block CDN photo).
3. `team5-9` — @shadcnblocks · faculty/staff/PhD/undergrad sections; DIAL member data.
4. `alumni-grid` — Custom · alumni name grid.
5. `cta32` — @shadcnblocks · join CTA with stats props.

---

### `/people/[slug]` — Person profile

1. `member-profile` → `MemberProfile` — Custom · photo, bio, interests, socials.
2. `member-publications` → `MemberPublications` — Custom · publication list + scholar link.
3. `projects-grid` → `ProjectCard` (×N) — Custom · project cards in a grid.
4. **Inline grants list** — Custom · in `page.tsx`.
5. `cta12` — @shadcnblocks · “Work with us”.

---

### `/awards` — Awards

1. `hero262` — @shadcnblocks · award summary stats.
2. **Inline featured awards list** — Custom in `page.tsx` · visual pattern from `awards3` (gold bar + hover row); **not** the `Awards3` component.
3. `awards-filter-table` → `AwardsFilterTable` — Custom · category filter table; supersedes `awards4` block.

---

### `/join-us` — Join us

1. `hero197` — @shadcnblocks · DIAL recruitment hero.
2. `feature10` — @shadcnblocks · “Why DIAL?” four-column features.
3. `feature37` — @shadcnblocks · expectations/requirements section (DIAL copy).
4. `careers3` — @shadcnblocks · open roles list (mail-to apply).
5. `cta4` — @shadcnblocks · application checklist + mailto CTA.

---

### `/contact` — Contact

1. `contact1` — @shadcnblocks · form + lab address sidebar; react-hook-form + zod.

---

## Custom vs registry summary

| Kind | Count | Examples |
|------|------:|---------|
| @shadcnblocks (used) | 18 | `hero262`, `navbar4`, `team5-9` |
| @shadcnblocks (orphan) | 16 | `about28`, `changelog3`, `awards4` |
| Custom compositions | 6 | `home-sections`, `research-sections`, `theme-page-sections`, `featured-publications`, `news-feed`, `awards-filter-table` |
| Custom domain UI | 7 | `publications1`, `projects-grid`, `project-post`, `member-*`, `people-stats`, `alumni-grid`, `pi-profile` |
| Inline-only (no component file) | 4 routes | `/about` (most sections), `/news` hero, `/awards` featured list, theme funding + breadcrumb |

---

## Quick reference: page → top-level imports

| Route | Top-level building blocks |
|-------|---------------------------|
| `/` | `hero171`, `home-sections`, `logos12`, `about6`, `publications1` |
| `/about` | inline sections, `logos1`, `cta12` |
| `/research` | `hero262`, `logos1`, `research-sections`, `feature199`, `featured-publications` |
| `/research/*` (×9) | inline breadcrumb, `hero262`, `feature295`, `publications1`, `theme-page-sections`, inline funding |
| `/projects` | `hero262`, `projects-grid`, `cta12` |
| `/projects/[slug]` | `project-post` |
| `/publications` | `publications1` |
| `/news` | inline hero, `news-feed` |
| `/people` | `people-stats`, `pi-profile`, `team5-9`, `alumni-grid`, `cta32` |
| `/people/[slug]` | `member-profile`, `member-publications`, `projects-grid`, inline grants, `cta12` |
| `/awards` | `hero262`, inline featured, `awards-filter-table` |
| `/join-us` | `hero197`, `feature10`, `feature37`, `careers3`, `cta4` |
| `/contact` | `contact1` |

---

*Generated from static analysis of `src/app/**/page.tsx`, `src/app/layout.tsx`, and `src/components/*.tsx` (excluding `src/components/ui/`).*
