# Join Us (`/join-us`)

Permanent home for recruitment. Nova updates once a semester.

---

## 1. Page header

Slim custom hero — no block, minimal markup.

- Page title + one-line pitch
- **Recruitment status badge:** "Applications open · Jan 1 – Jan 30, 2026" or "Applications closed · Next window: Spring 2027"

This is the single highest-value element on the page. It must be visible before anything else so a cold-landing visitor can immediately orient and decide whether to read on or come back later. Nova updates the badge once a semester alongside the openings copy.

---

## 2. Why DIAL

**Block: `feature10`** (icon grid "Why Us?" style, already in project)

- Short pitch — what it's like to be part of the lab, who they're looking for
- No prerequisites. Passionate about HCI. Field studies across Bangladesh.

---

## 3. Life at DIAL

Photo section — 6 lab moments: Iftar, field visits, July Movement solidarity, conference trips, lab sessions. These are the photos that answer "what is it actually like to work here?" for a prospective student evaluating whether to apply. Captions kept short — one line each.

**Block: `feature37`** (5-col bento grid, 6 cards in alternating 2/3 → 3/2 → 2/3 column widths; each card: photo + bold title + one-sentence caption). Section heading ("Life at DIAL") lives inside the component. Downloaded → `src/components/feature37.tsx`.

`gallery33` trialled and rejected — e-commerce feel (heart icon, arrow button, price field). `feature37` reads as editorial.

Data source: placeholder picsum.photos seeds for now. Replace with real lab photos before launch.

---

## 4. Current openings

**Block: `careers3`** (job listings, downloaded → `src/components/careers3.tsx`)

- Static copy — Nova updates this section once a semester via rich text
- No structured collection. If nothing is open: "No open positions currently — check back next semester."
- Recruitment window example: January 1 – January 30, 2026

---

## 5. How to apply

Closing CTA — framed as an invitation, not a checklist. Tone: direct and welcoming.

**Block: `cta4`** (2-col card on `bg-muted`). Left column: heading + short pitch + "Apply now" button → `mailto:nsuhci.research@gmail.com`. Right column: 6-item checklist (subject format, CV, research interest statement, program/year, skills/experience, open questions). Downloaded → `src/components/cta4.tsx`.

`feature280` trialled and rejected — icon grid checklist + testimonial CardStack reads as SaaS product marketing, wrong register for a research lab.

**Note:** No contact section here — general contact info lives on `/contact`. Join Us is purely about recruitment. When a recruitment system is built, replace `cta4` with the relevant form/portal block.
