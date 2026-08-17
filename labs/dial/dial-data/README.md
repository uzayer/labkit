# DIAL unverified working data

This tree is a normalized, real-world working dataset derived from DIAL's current site, Dr. Nova Ahmed's personal site, the DIAL proposal, and bibliographic lookups. It exists to make development and manual import realistic before the Lab has verified every record.

It is not an approved source of public facts. “Structured” means easier to process, not more trustworthy.

## Intended use

- Populate realistic prototypes and dry runs.
- Supply manual records that bibliographic APIs cannot discover: Projects, Grants, Awards, Research Themes, and Lab membership.
- Compare the reviewed ORCID/BibTeX import against a narrower, DIAL-shaped corpus.
- Preserve uncertain leads instead of inventing generic placeholder content.

Every record remains subject to Operator review. A Team Member in this tree is not automatically an active or publicly visible Lab member. A polished Project description is not approved merely because it parses.

## Provenance

Raw captures live in [`../scraped-data/`](../scraped-data/). When sources disagree, preserve the disagreement until a primary record or DIAL resolves it. Do not silently prefer the more detailed or more recent-looking page.

Generated API responses in `_fixtures/` record what external services returned during ingestion work. They are reproducible diagnostics, not curated Lab content.

## Layout

| Path | Purpose | Current consumer |
| --- | --- | --- |
| `_reference/` | Working Organizations, Venues, Keywords, and Research Themes | `hydrate-dial.ts`, except Keywords |
| `team/` | Faculty profiles, named researchers, RA lists, alumni, and collaborators | `hydrate-dial.ts` |
| `grants/` | One file per suspected Grant or funding line | `hydrate-dial.ts` |
| `awards/` | Consolidated personal and Lab Award candidates | `hydrate-dial.ts` |
| `projects/` | Project candidates; name-only stubs use `needs-research: true` | `hydrate-dial.ts` |
| `publications/` | DIAL-shaped Publication candidates grouped by year | `probe-doi.ts` and legacy hydration |
| `_fixtures/` | Crossref/OpenAlex responses and generated reports | ingestion diagnostics and legacy hydration |

## Known limitations

- Publications are incomplete and partly superseded by the ORCID/BibTeX pipeline.
- The PI's personal record may include work outside DIAL.
- Project names, statuses, descriptions, and relationships contain unresolved conflicts.
- Team rosters may conflate active members, alumni, collaborators, and co-authors.
- The Keywords file has no Payload collection or importer consumer today.
- `coverage-report.json` is overwritten by each probe and may not represent the full fixture set.
- Some fields in this tree predate the current Payload schema and are ignored or normalized by `hydrate-dial.ts`.

## Manual checks

- Match Team affiliations, Grant funders, and Award issuers against Organizations.
- Match Publication Venue labels against Venues or retain a reviewed free-text label.
- Confirm every `displayInWebsite` decision with DIAL.
- Confirm Project status and narrative, especially records marked `needs-research`.
- Distinguish personal Awards and Grants from Lab records.
- Validate cross-links (`teamMembers`, `projects`, `themes`) against real slugs.

## Formatting warning

Several files contain executable YAML inside Markdown bodies. General Markdown formatters can change indentation and corrupt the importer. This tree is excluded from automatic formatting; validate it with the same `gray-matter` parsing pattern used by `src/lib/ingestion/frontmatter.ts`.
