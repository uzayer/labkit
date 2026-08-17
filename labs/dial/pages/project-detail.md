# Project Detail (`/projects/[slug]`)

Block: ProjectPost1 — largely built. Do not rewrite.

---

## Existing sidebar

- Awards (aggregated from Project.awards + Project.publications[].awards)
- Overview + research theme badges
- Timeline (start/end date)
- Project team with TeamMemberHoverCard, collapsible for >4 members
- Social share

---

## Existing main content

- Problem / Approach / Outcomes grid
- Rich text body
- Table of contents
- Append layout blocks (extensible)

---

## Gaps to address for DIAL

- **Publications** — surface Project.publications join below main content, same entry format as Publications page (see [site-wide-features.md](../site-wide-features.md#publication-entry--standard-format))
- **Grants** — small funding acknowledgment in sidebar: "Supported by Gates Foundation, NSU CTRG" using Project.grants → Grant.funder
- **Bengali project name** — add `localName: string` field to Projects collection; display as subtitle under English title on all cards + detail page header
