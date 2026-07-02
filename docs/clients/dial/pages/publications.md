# Publications (`/publications`)

---

## 1. Scholar Links

No block needed — render inline in the section header. Two or three text links: Nova's Google Scholar + key members' profiles. Academics live in Scholar; worth surfacing directly.

---

## 2. Publication List

**Design intent:** This is the flagship UX differentiator on the site. Most academic lab publication pages are unstyled lists. The goal is a new-age shadcn reading experience applied to traditional academic content — timeline14 as the layout shell, a custom publication card as the content unit.

**Build phases:**

1. **QA `publications1`** — audit the existing variant aggressively. Fix display bugs, author formatting, award badges, action buttons. Do not build new features until this is tight.
2. **Custom publication card** — standalone component implementing the entry format defined in [site-wide-features.md](../site-wide-features.md#publication-entry--standard-format). This is the atomic unit reused everywhere publications appear (Research Theme detail, Team Member bio, Project detail).
3. **Timeline14 adaptation** — adapt `timeline14` to use the custom publication card as its item renderer. Year = `dateLabel`. Card replaces the current `image + tagline + richText` slot structure. Add filter bar (Year | Venue | Research Theme), search, collapsible overflow for older years.

**Entry format per card** — see [site-wide-features.md → Publication Entry](../site-wide-features.md#publication-entry--standard-format):

- Title (linked to detail / DOI)
- Authors — Nova Ahmed bolded, co-first author * notation, Team members linked via TeamMemberHoverCard
- Venue badge + year
- Award badge if applicable (Award.category label, gold/silver/neutral treatment)
- Citation count (OpenAlex Phase 2 — deferred)
- Open access badge (deferred)
- Action buttons: PDF, Cite (BibTeX popover), Project link

**Sort order within each year:** award-winning papers pinned to top, then by publication date descending.

**Filters:** Year | Venue | Research Theme — filter options sourced from Venues collection and ResearchThemes collection respectively.

Data source: Publications collection
