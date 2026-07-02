# Research (`/research`)

Two audiences: (1) collaborators/funders skimming for scope, (2) students/peers looking for a specific project.

Progressive disclosure across three layers — each adds depth without repeating the previous:

| Layer | URL | Job |
| ----- | --- | --- |
| Teaser | `/` | 3–4 theme cards, very light; routes visitors to /research |
| Overview | `/research` | Full theme directory (all 9 themes) + editorially curated project spotlights; browse all projects → `/projects` |
| Detail | `/research/[theme-slug]` | One theme, exhaustive — full project list, all publications, grants, collaborators |

The overview page does two distinct jobs with two distinct sections: **directory** (Research Areas grid — all themes, links to detail pages) and **editorial** (Spotlight Projects — curated projects that make the work concrete). These are kept separate because DIAL has 9 themes and projects frequently span multiple themes — a "per-theme sections with inline projects" approach would either repeat projects across sections or arbitrarily assign multi-theme projects to one theme.

---

## 1. Page hero

**Block — `hero262`**

Split layout: narrative column (title, subheading, short body) + supporting column (stacked stats with dashed rule). **Must be adapted:** Nova-written copy (not `LabInfo.description`); stats live in the hero only — no separate strip below; show intro body on mobile (the stock component hides long description below `md` — adjust if 2–3 sentences should always show). Props: `heading`, `subheading`, `description`, `stats`.

2–3 sentences in the description (or subheading + description split per design). Two jobs: (a) name the intellectual territory (privacy, accessibility, financial inclusion, mental health, HCI for the Global South), and (b) establish *how* DIAL works — participatory, field-based, embedded in Bangladesh.

**Hero stats column:** one stat must be awards-focused — e.g. "X best paper awards · CHI, CSCW, UIST." This is the page-level awards signal; it cascades down through award badges on spotlight cards (§5) and award-pinned publications on theme detail pages. Mirrors the same pattern as the home hero stats row.

Example register: "DIAL designs with communities that existing technology largely ignores — garment workers, stroke patients, Rohingya refugees, university students navigating mental health without support. We use participatory design and fieldwork to understand these problems from the inside, then build and evaluate technology interventions with the people who'll use them."

Copy should be written with them, not generated from a field.

---

## 2. Venue strip (where we publish)

**Block — `logos1`**

Directly under the hero. Venue logos only — no awards row on this page.

Complementary to [home §2](home.md#2-collaborators-strip) partner logos; **partner** institutions are not listed here — they surface contextually on spotlight cards (§5) and in full on `/research/[theme-slug]` detail pages.

**Label (Nova):** e.g. **“Published at”** / **“Where we publish”** — not “In collaboration with.”

**Data:** Curated **venue/journal logo** assets (required `logos` array — **min 5** in schema today; relax in config if needed). Representative set; optional future: **Venues** collection / publication-derived list.

---

## 3. Research Areas

**Block — `feature199`**

The directory layer. All 9 research themes shown as cards; each card links to its `/research/[theme-slug]` detail page. This is where a visitor understands the full shape of DIAL's intellectual territory.

Two tiers based on the `featured` flag on ResearchThemes:
- **Featured themes** (5, `featured: true`): Accessibility & Inclusion, Gender & Feminist HCI, Mental Health & Wellbeing, Explainable AI & ML, ICTD — displayed as full cards with expanded description
- **Secondary themes** (4, `featured: false`): Safety & Security, IoT & Low-cost Hardware, Infodemic & Misinformation, Computing Education & Community — displayed as lighter entries (name + one-line description only, or a smaller visual treatment)

Each featured theme card:
- Theme name + icon
- `ResearchTheme.shortDescription` — one to two sentences
- Quiet stats: X projects · Y publications
- Link → `/research/[theme-slug]`

This section does not show project cards. Projects are handled editorially in Section 5.

Data source: ResearchThemes collection, ordered by `featured: true` first.

---

## 4. Spotlight Projects

**Block — `feature138`**

The editorial layer. 3–4 curated projects chosen by Nova to make DIAL's research concrete — not a filtered subset of the theme grid above, but an intentional selection that shows the range and character of DIAL's work. Projects are selected on the basis of distinctiveness to DIAL specifically: work that could not have come from any other HCI lab.

Each spotlight card must include:
- **Bengali project name as the visual headline** (জ্যোতি, প্রতিবাদী, মন মাঝি…) — load-bearing IA decision. English title is the subtitle.
- `Project.abstract` — one line
- Lead researcher name — links to their `/people/[slug]` page
- Status badge: Ongoing / Completed
- Award badge if applicable — gold-accented, links to award record
- Research theme tag(s) — creates visual echo back to the Research Areas grid above
- Funder / collaborating institution attribution where applicable (e.g. "Funded by Gates Foundation", "with Cardiff University") — contextual, not a dedicated section
- Link → `/projects/[slug]`

**No dedicated Research Network section on this page.** Partner and funder information is distributed contextually: spotlight cards carry per-project attribution (via `Project.grants → Grant.funder` and `Project.teamMembers` filtered to external affiliations); the full picture per theme lives on the `/research/[theme-slug]` detail pages (Collaborators, Funding acknowledgment sections). The home collaborators strip already handles the site-wide first-impression signal.

**Curatorial note:** Current fleshed-out projects available for spotlight: Protibadi, Aparajita, Monmajhi, Alor Akash, Shonabondhu. Stub projects (Jyoti, Shathi, Poisha, Tuntuni) are not spotlight-ready until data is populated. Nova to decide final selection.

> **⚠️ Schema:** Projects collection needs three new fields before importing project data:
> - `localName` (text) — Bengali project name
> - `leadResearcher` (relationship → Team, has-one) — lead researcher inside DIAL
> - `featured` (boolean) — marks a project for spotlight display
>
> Run `pnpm generate:types` after adding all three.

> **⚠️ Architecture:** Spotlight project cards must query the Projects collection directly (`featured = true`), not be manually entered in the page editor.

A "Browse all projects →" link pointing to `/projects` sits below the spotlight strips — the natural exit from editorial into directory.

Data source: Projects collection, `featured = true`.

---

## 5. CTA

**Block — `cta12`**

By the time a visitor reaches here they've self-identified by behaviour. Three exit paths:

- Peer researcher / collaborator → `/publications`
- Prospective student → `/join-us`
- Potential collaborator → `/contact`

---

## Data sources summary

| Section | Source |
| ------- | ------ |
| Page hero copy | Written fresh — not from a collection field; `hero262` props |
| Hero stats column | Live counts: Projects, Publications collections + "Active since 2017" constant |
| Venue strip | `Logos` → `LOGOS1` (`logos1.tsx`) — curated Media logos + `richText` label |
| Research Areas grid | `FeatureSpecial` → `feature199` + ResearchThemes collection, `featured` first |
| Theme stats per card | Live counts: Projects, Publications filtered by theme |
| Spotlight projects | `feature138` layout + Projects collection, `featured = true` |
| Bengali project name | `Project.localName` (field to be added) |
| Lead researcher per card | Team collection, via `Project.leadResearcher` (field to be added) |
| Award badges on cards | Awards collection, filtered by `associatedProject` |
| Funder / collaborator attribution on cards | `Project.grants → Grant.funder`; external `Project.teamMembers` |

---

## Deferred

- Visual treatment of Bengali names relative to English titles — decision at build time, but Bengali must be the typographic headline
- Tie §2 venue row to **Venues** collection or pub counts — optional; curated Logos block is the MVP
