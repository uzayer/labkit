# Home (`/`)

Tone: Clean, minimal. Every section earns its place. No news section — homepage is evergreen.

**Primary flows:**

- Student → Hero (credibility) → Research Themes (depth) → Featured Publications (proof) → Ending CTA → `/join-us`
- Collaborator → Hero → Research Themes → Featured Publications (proof) → Ending CTA → `/research`

---

## 1. Hero

**Block: Custom `hero-dial` — adapted from `src/components/hero171.tsx`**
Two-column layout. Left: headline, tagline, dual CTAs, stats row. Right: collage grid (see below).

- Headline + tagline: TBD with Nova
- CTA 1: "Explore our research" → /research
- CTA 2: "Join the lab" → /join-us

**Stats row** — hero171's bottom row is replaced with 3 inline stats. Each stat: large number, short label, one-line description. Candidates: total publications, years active, team size — **one stat must be awards-focused** (e.g. "10+ awards at top venues" or "Best Paper CHI · SOUPS Impact Award"). This is the homepage's primary awards credibility signal and should appear first impression, before anything else on the page. Stats confirmed with Nova.

**Collage grid** (right column):
Content for the image/card tiles is TBD — candidates include Bengali project name typography (Jyoti, Shathi, Mon Bina, Poisha), **venue/award badges (CHI, CSCW, Best Paper — a second awards touchpoint, visual)**, and team fragments. Research themes ruled out — they have their own section immediately below and repeating them here dilutes both.

---

## 2. Collaborators Strip

**Block: adapted from `src/components/logos12.tsx`**

"In collaboration with" label above an auto-scrolling carousel of partner logos. Logos rendered in greyscale. Fade masks on left/right edges (already in logos12).

Data source: Organizations collection (manually curated by lab admin)

---

## 3. Mission / About

**Block: `about6`** — downloaded to `src/components/about6.tsx`; convert to Payload page-builder block when wiring Home.

Two-column layout: mission copy plus a **photo grid** (real people, real contexts — team moments, lab, field/project shots where available). Locks in the "small lab, real work" story; not generic startup placeholder copy.

- **Left column:** headline (e.g. "About DIAL" / "Our mission"); 2–3 sentences — what problems DIAL tackles and for whom; plain language, not jargon-heavy. Example tone: "Ensure inclusivity and access for marginal ones using minimalist and explainable technology." Below: three-image collage.
- **Right column:** three-image collage; subheading (reframe the template's "Our Workplace" — e.g. field + lab, how research happens in Bangladesh); one or two short supporting paragraphs.
- **Imagery:** 3–4 of the 6 slots are lab life moments — Iftar, field visits, July Movement solidarity, conference trips. These carry the "small lab, real work" story. The remaining slots can be more formal (team photo, research context). Prefer distinct shots across different events/contexts. Meaningful alt text; consent/ethics for anyone beyond core team if identifiable.
- **Copy:** replace all default shadcnblocks strings; avoid corporate "innovators / cutting-edge / global remote team" tone.

**Data source:** LabInfo global (headings + body fields as needed); Media for up to six images (or repeater).

**Note:** `about1` is skipped entirely — not used anywhere on the site.

---

## 4. Research Themes

**Primary block: `feature122`** (`@shadcnblocks/feature122`)

- **Large highlighted block (not a theme):** "Explore our research" (or equivalent) + CTA → `/research`, with a **team photo** as the visual anchor. Fixed copy/media fields in the block — not a `ResearchTheme` row.
- **Smaller grid:** **3–4 equal theme tiles** (broader research areas). Each tile: theme name, `shortDescription`, link → `/research/[theme-slug]`. Data: `ResearchTheme` where `featured = true` (or ordered slice).

**Fallback block: `feature277`** (`@shadcnblocks/feature277`) — use if we drop the hub + team tile and only need a **four-column equal** icon + text + link grid (no prominent `/research` panel in-section).

**Data source:** ResearchThemes collection for theme tiles; hub section: LabInfo and/or page-level block fields + Media for team image.

---

## 5. Featured Publications

**Block: TBD** — manually curated strip of 3 featured papers. Evergreen (not a live feed); Nova selects which publications surface here.

Each card: venue badge (CHI, CSCW, UIST, etc.), paper title (links to DOI), year, award badge if applicable (Best Paper, Honorable Mention). No authors, no abstract — keep it scannable.

Purpose: converts the hero's awards stat into tangible proof. Bridges "what we research" (Themes) into "that we publish at top venues" before asking the visitor to act.

**Data source:** Publications collection; `featuredOnHome = true` flag (or ordered manual selection). Max 3.

---

## 6. Ending CTA

**Block: `cta12`** (`src/components/cta12.tsx`)

Centered accent-background card. Headline + description + two buttons side by side.

- CTA 1 (primary): "Join the lab" → `/join-us`
- CTA 2 (outline): "Explore our research" → `/research`

Copy TBD with Nova. Description line serves as the universal pitch for both audiences.
