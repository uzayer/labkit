# DIAL Site — Global Layout

Last updated: 2026-04-09

---

## Header — navbar4

**Block: `navbar4`** — in-project at `src/globals/Header/navbar/navbar4.tsx`

Nav links: Home | People | Research | Publications | Awards | Events | Join Us | Contact

**Note: navbar structure not yet decided.** 8 top-level links is a lot — needs a decision on whether some items collapse into a dropdown or secondary nav before implementation.

- Search icon in nav → triggers ⌘K modal (AUT-116)
- Mobile: navbar4's built-in mobile treatment
- Sticky behaviour: TBD — confirm once navbar4 is rendering on DIAL pages

Data source: Header global (`src/globals/Header/config.ts`) — nav links managed in admin

---

## Footer — footer18 (global only)

**Block: `footer18`** — downloaded to `src/components/`, needs converting into Footer global variant system

Single global footer used on all pages. `footer24` is dropped — it's a CTA block, not a footer. A repeated "Let's work together" heading on every page (after Publications, after Research, etc.) would feel forced. A quiet navigational footer is more appropriate for an academic site.

Layout: logo + social icons (left column, 1/4 width) · multi-column nav grid (right, 3/4 width) · copyright bar below

Strip on conversion: cookie consent drawer, language selector dropdown, privacy dialog — none apply to a research lab site.

DIAL-specific content:

- Left: DIAL wordmark + social links (Google Scholar, ResearchGate — icon buttons)
- Right nav grid (3 columns): Research (Publications, Themes, Awards) · Lab (People, Events) · Connect (Join Us, Contact)
- Bottom bar: © DIAL · North South University

Data source: Footer global (`src/globals/Footer/config.ts`)
