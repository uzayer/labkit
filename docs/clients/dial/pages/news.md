# News (`/news`)

Lab activity chronicle — academic presence, hosted events, and community work. Renamed from `/events`; navbar label changed from "Events" to "News".

---

## Content scope — what qualifies

Three types, each with different description depth:

| Type | What it covers | Description |
|---|---|---|
| **Academic** | Conference presentations, conference trips (students attending conferences, summer schools, winter schools — with or without a paper), invited talks / keynotes | 1 sentence; link optional, photo optional |
| **Organised** | Events DIAL hosted or co-organised (SIGCHI Summer Schools, DIAL HCI Research Symposium, workshops) | 2–3 sentences; photo encouraged |
| **Community** | Civic and societal engagement (BanglaCHI organising, SIGCHI Dhaka chapter, Flood Relief 2024, July Movement support) — needs context for international visitors | 2–3 sentences; photo encouraged |

## What does not go here

- Recruitment announcements → `/join-us`
- Publications → `/publications`
- Awards → `/awards` — no cross-posting. The full record lives on `/awards` and the "announcement moment" doesn't justify duplication.
- Media appearances — absorbed as a note on an Academic entry if it ever happens; not a separate type.

---

## Page structure

### §0 Page header (minimal)

`<h1>News</h1>` + one-sentence descriptor. No hero block — the feed is the page.

### §1 Feed

**Filter strip** (above feed)
- Pill buttons: **All** | **Academic** | **Organised** | **Community**
- Single-select; "All" is the default
- Same pill pattern as `/awards` filter strip

**Feed layout**
- Single chronological list, **year-grouped** (year label as a horizontal-rule separator)
- Within each year: newest date first
- **Upcoming entries** (date > today): float to top of the current-year group; carry an "Upcoming" badge on the card; soonest upcoming shown first
- When nothing is upcoming: no badge, no empty state — the feed reads cleanly as a pure archive

**Entry card** (one template for all types)
- Type badge (Academic / Organised / Community)
- "Upcoming" badge when applicable (alongside type badge, not replacing it)
- Title (linked to external URL if present, with ExternalLink icon)
- Date (Month YYYY)
- Description (1 sentence for Academic; 2–3 sentences for Organised / Community)
- Photo thumbnail — right-aligned, optional; no placeholder slot if absent
- Content density does the visual differentiation across types — no separate card templates

---

## Data model

`News` collection — new, lightweight, separate from Posts.

| Field | Type | Notes |
|---|---|---|
| title | text | — |
| type | select | `academic` / `organised` / `community` |
| date | date | Future date = upcoming; computed at render, no stored flag |
| description | richText (short) | — |
| photo | media | optional |
| url | text | optional external link |

---

## Blocks

- **§0 Page header** — inline markup (no shadcnblocks block; minimal heading + one-liner)
- **§1 Feed** — `NewsFeed` custom client RSC (`src/components/news-feed.tsx`), following the same pattern as `AwardsFilterTable`
