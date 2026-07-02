# DIAL Site — Site-Wide Features

Last updated: 2026-04-09

These aren't page-specific — they apply globally and are what separates a nice academic website from a brochure.

---

## Dotted background pattern

The radial-gradient dot pattern from `hero197` is the site's ambient background texture — used as a subtle depth layer on hero/header sections across multiple pages.

```css
background: radial-gradient(var(--primary) 1px, transparent 1px);
background-size: 20px 20px;
opacity: 0.25;
```

Applied as an absolutely-positioned full-bleed `<div>` with `-z-10` behind the hero content. Does not extend into body sections.

**Use on:** all page-level hero/header sections (Home hero, Research hero, Join Us header, and any future page headers). Do not use inside body content sections — it should read as "top of page" only.

---

## ⌘K Global Search

Keyboard shortcut (⌘K / Ctrl+K) opens a command-palette style search modal. The most important UX feature on the site — makes the entire data model navigable in one interaction.

**Search scope:** Publications, Projects, Team members, Research Themes

**Result format:** grouped by type, each with a type icon

- Publications → title, venue badge, year
- Projects → Bengali name + English title, status badge
- Team → avatar, name, role
- Research Themes → name, shortDescription snippet

**Behavior:**

- Keyboard navigable (arrow keys, Enter to go, Esc to close)
- Results appear as you type (debounced)
- Empty state: "Try searching for a topic, person, or project"
- Opens from navbar search icon + keyboard shortcut

**Implementation note:** Use shadcn's `cmdk` component (already in the stack) for the modal UI, backed by Payload's `@payloadcms/plugin-search` for the flattened index. Do not query each collection individually.

---

## Publication Entry — Standard Format

Used consistently across Publications page, Project detail, Research Theme detail, and Team member bio. Never deviate from this format — consistency is the point.

**OpenAlex (Phase 2):** Not integrated yet. Implementation path: a sync route handler hits the OpenAlex API by DOI (no auth required), writes back to `Publications.citationCount` and `Publications.isOpenAccess`. Run on save hook or scheduled cron. Moderate effort — not a blocker for launch.

**Custom component (WIP):** No shadcnblocks equivalent exists. Early version built — needs revision before use.

- Title (linked to detail / DOI)
- Authors — lab members linked to their bio page via TeamMemberHoverCard on hover; Nova Ahmed bolded; co-first author * notation
- Venue badge + year
- **Citation count** — "↗ 42 citations" pulled from `Publications.citationCount` (OpenAlex). Small but a real credibility signal.
- **Open access badge** — green lock icon if `Publications.isOpenAccess = true`. Values statement for a lab working on marginalized communities.
- Award badge — visually distinct for Best Paper vs Honorable Mention (different colors/weight, not just a label)
- Action buttons: PDF, Cite (BibTeX popover), Project link

---

## Award Visual Treatment

Best Paper at CHI is a significant achievement. Treat it accordingly — not just a small badge. Exact accent colors TBD — finalize with Nova before implementation.

- **Best Paper** — gold accent, slightly elevated card treatment
- **Honorable Mention** — silver accent
- **Other** — neutral badge

Applied wherever awards appear: publication entries, project sidebars, homepage stats context.

---

## Bengali Project Names

DIAL's signature. Every project has a Bengali name (Jyoti, Shathi, Mon Bina, Poisha). These names tell the story of who the lab designs for — they're not a subtitle, they're the identity.

- Typeset with care — larger, use a Bengali-appropriate font stack
- Shown on: project cards everywhere, project detail page header, Research page sections
- Data source: `Projects.localName` (field to be added to Projects collection)

---

## TeamMemberHoverCard

Already built. Wire it everywhere a team member name appears:

- Author lists on publication entries (across all pages)
- Project team lists
- Collaborators section on Research Theme detail
- Search results
