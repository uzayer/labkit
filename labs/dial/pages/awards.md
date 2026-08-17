# Awards (`/awards`)

DIAL's award record is a primary credibility signal — Best Paper CHI 2019, 10-year Impact Award SOUPS 2024, Best Journal Paper ACM COMPASS 2023, Google South and Southeast Asia Research Award 2022, among others. Too strong to bury as badges only.

**Blocks:** `hero262` (§1) · `awards3` adapted (§2) · `awards4` adapted (§3)

---

## 1. Page hero — `hero262`

**Block:** `hero262` — two-column layout: heading + subheading left; vertical stats list (dashed separator) right. Same block as `/research`; consistent interior-page hero pattern.

Content:
- Heading: "Awards"
- Subheading: one sentence — "Recognition for DIAL's work at international academic venues."
- **Stats list** (right column, derived from collection at build time):
  - `X Best Paper Awards` — count of `category: best-paper` entries with `scope: lab`
  - `Y Research Grants` — count of `category: research-grant` entries with `scope: lab`
  - `YYYY–present` — year span derived from min/max `year` across `scope: lab` entries

---

## 2. Featured awards — `awards3` (adapted)

**Block:** `awards3` — hover list with a colored square indicator, award title, category labels, and year. Driven by `isFeatured: true`; renders only the 4 qualifying entries. All indicators gold (overrides the per-category color used in §3). No card grid — editorial list treatment, not SaaS-style feature cards.

**Editorial rule — what qualifies as Featured:**
- Competitive best-paper wins at tier-1 venues (CHI, COMPASS, USENIX SOUPS)
- Retrospective impact / lifetime-category awards
- Highly competitive industry research grants (Google Research Award)

**Current featured set (driven by `isFeatured: true` on the collection record — do not hard-code):**
- Best Paper Award (Best of CHI) — ACM CHI 2019
- 10-Year Impact Award — USENIX SOUPS 2024
- Best Journal Paper Award — ACM COMPASS 2023
- Google South and Southeast Asia Research Award — 2022

Each entry: gold indicator · award title · organization as venue badge · year · linked paper/project if applicable · **recipients** (DIAL members linked to `/people/[slug]` via `TeamMemberHoverCard`; external co-recipients as plain text).

---

## 3. Full awards list — `awards4` (adapted)

**Block:** `awards4` — table layout with a large "Awards" heading and date-range subtitle. Columns: organization (text badge, not logo image — DIAL has no venue logos), award name (links to DOI / venue page where `linkedPublication` is set), linked publication or project, year. Add a category column with interactive badge filter strip above the table (custom addition — no block). All `scope: lab` entries, newest first, grouped by year via `<tbody>` sections with year headers.

**Each row:**
- Organization — rendered as a styled text badge (e.g. `ACM CHI`, `USENIX SOUPS`)
- Award name — plain text; if `linkedPublication` is set, the linked paper title appears in the next column
- Category badge — interactive, filterable (see filter strip below)
- **Recipients** — DIAL lab members linked via `TeamMemberHoverCard`; external co-recipients as plain text
- Linked paper or project if applicable
- Year
- Gold/silver visual treatment on `best-paper` / `honorable-mention` rows per the [Award Visual Treatment](../site-wide-features.md#award-visual-treatment) spec

**Category taxonomy** (maps `Awards.category` to display labels and visual treatment):

| Collection value    | Display label      | Visual treatment  |
| ------------------- | ------------------ | ----------------- |
| `best-paper`        | Best Paper         | Gold accent       |
| `best-poster`       | Best Poster        | Light gold        |
| `honorable-mention` | Honorable Mention  | Silver accent     |
| `impact`            | Impact Award       | Gold accent       |
| `research-grant`    | Research Grant     | Neutral badge     |
| `fellowship`        | Fellowship         | Neutral badge     |
| `recognition`       | Recognition        | Neutral badge     |
| `competition`       | Competition        | Neutral badge     |
| `scholarship`       | Scholarship        | Neutral badge     |

**Filtering:** Category badges in the list header are interactive — clicking filters the list client-side. All categories shown by default. No pagination — list renders in full.

**Newest-first default + prestige:** Accepted by design. The Featured section (§2) carries the prestige signal; the full list is the record. No pinning logic needed.

---

## 4. Award scope — lab vs. personal

Nova's full personal academic history (Dean's Honour 2002, ACM ICPC 1998–1999, NSF travel grants, early ACM-W scholarships) is valuable context for her bio but not appropriate for a lab credibility page.

Field `scope` on each Awards record:
- `lab` — appears on `/awards` and as award chips on the People page (PI profile and team member bios)
- `personal` — appears only on `/people/nova-ahmed` (CV section, if added later)

The `/awards` page queries `scope: 'lab'` only. No runtime editorial filter needed — set at data-entry time.

---

## Data model — Awards collection fields

| Field                | Type                           | Notes                                                                                   |
| -------------------- | ------------------------------ | --------------------------------------------------------------------------------------- |
| `title`              | Text                           | Award name                                                                              |
| `year`               | Number                         | Year received                                                                           |
| `endYear`            | Number (optional)              | For multi-year awards                                                                   |
| `category`           | Select                         | `best-paper`, `best-poster`, `honorable-mention`, `impact`, `research-grant`, `fellowship`, `recognition`, `competition`, `scholarship` |
| `organization`       | Text                           | Awarding body                                                                           |
| `linkedPublication`  | Relationship → Publications    | Optional                                                                                |
| `linkedProject`      | Relationship → Projects        | Optional                                                                                |
| `recipients`         | hasMany Relationship → TeamMembers | DIAL lab members who received the award                                             |
| `externalRecipients` | Text (optional)                | Free-text for co-recipients not in the TeamMembers collection                           |
| `isFeatured`         | Boolean                        | Promotes to Featured Awards section (§2). Rule: tier-1 best-paper + impact + competitive industry grants |
| `scope`              | Select                         | `lab` or `personal` — controls which pages the award appears on                        |

**Schema.org:** Inject `schema.org/ItemList` (or award-type markup, TBD) JSON-LD for `scope: lab` entries on the `/awards` page. Mirrors the `ScholarlyArticle` injection pattern on publication pages.
