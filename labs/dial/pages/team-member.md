# Team Member Bio (`/people/[slug]`)

Mix of academic CV and human profile. Page auto-populates almost entirely from data model joins — no manual page editing needed per member.

**Gating:**

- Controlled by `Team.displayInWebsite` toggle. Nova decides per member.
- **Alumni:** no detail pages — cards only on `/people` with `currentPosition` shown.
- **Undergraduate RAs:** card only on `/people`, no detail page. Full profile for Graduate RAs and above.

---

## 1. Profile Header

Two-column layout. Portrait left, content right.

- **Photo** — large portrait/square crop. Fallback: initials avatar in lab accent colour.
- **Name + title** — e.g. `Dr. Nova Ahmed` / `Professor, ECE, North South University`
- **Role badge** — small chip: `Director` / `Faculty` / `Research Staff` / `Graduate RA` etc.
- **Affiliation** — institution name from `affiliation` relationship (Organizations). Links out if org has a URL.
- **Research interests** — keyword tags from `Team.researchInterests`. Clickable (deferred routing to V2).
- **Bio** — `Team.bio` richText. 2–5 sentences for most members; fuller for PI/faculty.
- **Links row** — icon + label for each `Team.socials` entry (Google Scholar, LinkedIn, GitHub, personal site, X) + `mailto:` from `Team.email` + ORCID badge if `Team.orcid` is set (prefix `https://orcid.org/`).
- **Award badges** — small gold-accented chips for any Awards linked via `Awards.associatedPerson`. Only rendered if non-empty. Matches treatment on PI bio section on `/people`.

**Data source:** `Team` doc by slug; `Awards` collection filtered by `associatedPerson`.

---

## 2. Publications

Primary utility for peer researchers.

- **Data source:** `Team.publications` join → Publications collection.
- **Sort:** year descending, grouped by year.
- **Their name bolded** in each paper's author list.
- **Award-winning papers pinned to top** within their year group. Award badge on card.
- **Entry format:** same standard format as `/publications` — see [site-wide-features.md](../site-wide-features.md#publication-entry--standard-format).
- **Overflow:** show 5 per year group, "Show more" expands inline.
- **Escape hatch:** "View all on Google Scholar →" link below the list if `socials` contains a `google-scholar` entry. Useful when the db isn't fully populated.
- **Empty state:** "Publications coming soon." — section stays visible (signals the field exists).

---

## 3. Projects

- **Data source:** `Team.projects` join → Projects collection.
- **Layout:** card grid — reuse existing Projects block card component.
- **Card fields:** project name, status badge (active/completed), brief description, research theme tags.
- **Links to:** `/projects/[slug]`.
- **Empty state:** hide section entirely if no projects.

---

## 4. Grants

Only shown for members with an investigator role on at least one grant.

- **Data source:** `Team.grants` join → Grants collection (`investigators.teamMember`).
- **Layout:** compact list. Per entry: grant title, funder, year range, role (`Principal Investigator` / `Co-Investigator`).
- **Visibility:** section collapses entirely if `Team.grants` is empty — no placeholder.

---

## 5. Footer CTA

- **Current members:** soft "Work with us" CTA → `/join-us`.
- **Alumni:** no CTA — profile is archival read-only.

---

## Data sources summary

| Section        | Source                                                |
| -------------- | ----------------------------------------------------- |
| Profile header | `Team` doc (by slug)                                  |
| Award badges   | `Awards` collection, `associatedPerson = this member` |
| Publications   | `Team.publications` join                              |
| Projects       | `Team.projects` join                                  |
| Grants         | `Team.grants` join                                    |

---

## Schema gaps to address before building

| Gap                                         | Action                                                                                                                                                                          |
| ------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `research-staff` role missing               | Add `{ label: 'Research Staff', value: 'research-staff' }` to `Team.role` select in `src/collections/Team/index.ts`. Run `pnpm generate:types`. Already flagged in `people.md`. |
| ORCID is plain text                         | Prefix `https://orcid.org/` at render time. No schema change needed.                                                                                                            |
| NSU faculty page not in `socials` platforms | Add `{ label: 'NSU Faculty Page', value: 'nsu-faculty' }` to `Team.socials.platform` select options.                                                                            |
| `Awards.associatedPerson` relationship      | Verify the Awards collection has this field pointing to Team before building the header badge. Check `src/collections/Awards/`.                                                 |

---

## Open questions

- **Awards `associatedPerson` field:** confirm it exists and is correctly indexed in Awards collection before building badge render.
- **Google Scholar escape hatch:** only show if `socials` has a `google-scholar` entry — make sure that platform value is consistent across all Team records.
