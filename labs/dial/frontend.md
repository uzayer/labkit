# DIAL frontend contract

This is the canonical content and porting contract for DIAL's public frontend. It records three things separately: what the prototype already establishes, where production data comes from, and what remains a decision.

The prototype in `dial-test/` is visual and behavioral ground truth. Its data lives in `dial-test/src/data/`: records shaped like the LabKit collections, built from the 2026-09-12 captures and Nova Ahmed's ORCID. They are realistic but unverified, not factual ground truth. Porting a page means replacing those imports with Payload queries while keeping the page's view-model mappers.

## Global layout

The current prototype establishes:

- a sticky header;
- five desktop/mobile mega-menu groups: Research, Projects, Publications, People, and Lab;
- a separate Contact CTA;
- persistent light/dark mode;
- a shared footer with Research, Work, and Lab link groups.

Production should preserve the interaction model while replacing inline arrays and placeholder links. Header and Footer may be backed by Payload globals, but DIAL's launch navigation is not an editor-designed page-builder concern.

There is no `/events` route. Lab activity lives at `/news`. `/design-system` is a development endpoint and is not public navigation.

## Route contracts

| Route                    | Prototype composition                                                                                                                   | Production mapping and launch requirement                                                                                                                                                                                                |
| ------------------------ | --------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `/`                      | Scroll hero, band with PageHeader (derived facts, collaborator names), About, Research Theme index, selected Publications, invitation   | Prose remains hardcoded. Derive counts from Payload; query featured Research Themes, Publications, and Organizations. Replace all placeholder media.                                                                                     |
| `/about`                 | PageHeader with Venue names, Lab description, values, method, milestones, closing note                                                  | Hardcoded prose reviewed by DIAL; Payload Media and selected Venues/Organizations where useful. Confirm founding story before launch.                                                                                                    |
| `/people`                | PageHeader, Director feature, searchable ruled roster by role, alumni table, closing note                                               | Query public Team Members only. Derive groups from current roles and `displayInWebsite`; query Projects and Awards where relationships exist. Do not copy prototype people.                                                              |
| `/people/[slug]`         | Profile, Publications, Projects, Grants, CTA                                                                                            | Resolve the requested Team Member and return 404 when absent or hidden. Use Team joins for Publications, Projects, and Grants. Decide whether alumni and undergraduate profiles route publicly.                                          |
| `/research`              | PageHeader with Venue names, nine-theme index, method, featured Projects (shared Project row), award-winning Publications, closing note | Hardcode narrative/method copy; query Research Themes, featured Projects, Publications, and representative Venues. Avoid duplicate stat sections unless deliberately retained.                                                           |
| `/research/[theme-slug]` | Breadcrumb, theme header/stats, filterable Projects, Publications, collaborators, funders, related themes                               | DIAL launches with nine explicit theme routes. Map each route to its Research Theme record; query related records and use shared Project/Publication components. Return 404 for unknown slugs.                                           |
| `/projects`              | PageHeader, URL-backed Theme/status filters, ruled Project index, closing note                                                          | Query all publishable Projects. Preserve URL-backed filtering. `localName`, `abstract`, `status`, `themes`, `teamMembers`, `grants`, `publications`, `awards`, and `featured` exist; keyword filtering needs an explicit model decision. |
| `/projects/[slug]`       | Case-study header, sidebar, problem/approach/outcomes, rich content, Team, timeline                                                     | Resolve the requested Project; never use the prototype's `MobileVoice` dummy record. Render `localName`, relationships, rich content, media, and optional append blocks. Return 404 when absent.                                         |
| `/publications`          | Header, Scholar links, URL-backed grouping and filters, reusable Publication entries, citation dialog                                   | Query Publications and populated Venue, author, Award, Theme, and Project relationships. Link titles to DOI/publisher URLs. Remove `#` actions and render only available actions.                                                        |
| `/awards`                | Derived hero stats, featured Awards, category-filtered complete table                                                                   | Query Lab-scoped Awards. Use current `featured` field, recipient rows, Organization label/relationship, and reverse Project/Publication joins. Personal Awards belong on the relevant Team Member profile.                               |
| `/news`                  | PageHeader, date-derived upcoming list, typed/filterable archive grouped by year                                                        | A News collection does not exist yet. Decide whether to add the lightweight collection or launch with reviewed hardcoded entries. Canonical type values remain open: prototype uses `academic`, `event`, `community`.                    |
| `/join-us`               | PageHeader with recruitment status, reasons to join, openings, Lab-life captions (photos pending), how to apply                         | Hardcoded, DIAL-reviewed copy and Media. Recruitment dates and openings require an owner and expiry check before every launch. No new collection is required for MVP.                                                                    |
| `/contact`               | Contact details, social/profile links, Join Us signpost, three-field form                                                               | Use reviewed Lab contact details. Submit to Payload Forms and include Turnstile token when configured. Verify the actual Form record and success/error path in production.                                                               |

## Production data rules

### Data-driven routes

Publications, People, Projects, Awards, Research Themes, Grants, Venues, and Organizations read from Payload. These records change, relate to one another, and are the reason LabKit exists.

The port should use small page-specific mapping functions to convert populated Payload documents into the prototype's flat view models. DIAL-shaped mappings are acceptable for Lab #1; do not turn the port into a frontend generalization project.

### Hardcoded prose

Home, About, Contact, Join Us, the Research introduction, and method copy may remain in React components. The Operator can update this infrequent prose by hand. Do not restore a generic page-builder body field for it.

### Unverified working data

`organized-from-scrapes/` and the prototype's `dial-test/src/data/` may seed realistic development and manual import even when it has not been approved. A record sourced from it must retain provenance and remain subject to Operator review. Imported co-authorship does not make someone publicly visible.

### Derived values

Counts, year ranges, active/completed totals, and per-theme totals are computed from the same records being rendered. Never repeat a numeric claim independently across Home, About, Research, navigation, and detail pages.

## Shared presentation contracts

### Publication

- title linked to DOI, publisher URL, or another real destination;
- authors in source order, with linked Team Members where available;
- Venue label and year;
- optional Award, open-access, PDF, citation, and Project actions;
- no empty button and no `#` destination;
- consistent rendering on Publication, Project, Research Theme, Team Member, Home, and Research pages.

### Project

- Bengali/local name where supplied, then English title;
- abstract, status, Research Themes, and optional lead/Team context;
- real relationship counts rather than authored statistics;
- link to its own slug;
- no narrative inferred from a name-only stub.

### Team Member

- display only when `displayInWebsite` permits it;
- role, title, Organization, research interests, reviewed bio, photo, and available professional links;
- imported co-authors remain hidden by default;
- publications and other relationships come from joins, not duplicate arrays.

## Launch gates

- Resolve the official count and founding-year claims in [`identity.md`](./identity.md).
- Replace every shadcnblocks, Unsplash, and Picsum placeholder with approved DIAL Media or an honest fallback.
- Remove or implement every `#` link.
- Make Project and Team Member detail routes use their slug and return 404 correctly.
- Reconcile the Project directory with the unverified curated Project set and DIAL's confirmation.
- Replace fabricated Publications with the reviewed Payload corpus.
- Confirm active Team Members and `displayInWebsite` before exposing any roster.
- Expire recruitment and upcoming-News dates deliberately.
- Add route-specific metadata and consistent DIAL naming.
- Verify the contact Form and Turnstile end to end.

## Open decisions

- Whether the six-card Home Research Theme treatment is better than the earlier three-card editorial treatment.
- Whether Awards tables show recipients inline.
- Whether Project keywords deserve a field or Theme/status filtering is sufficient for MVP.
- Whether News warrants a collection before launch.
- Which Team Member roles receive detail pages.

Global search, Team Member hover cards, citation-count refresh, and generalized theme routing are deferred. They are not DIAL launch requirements.
