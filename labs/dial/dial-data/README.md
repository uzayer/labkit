# DIAL structured data (pre-CMS)

YAML-frontmatter markdown organized to mirror Payload research collections (Publications, Team, Projects, Grants, Awards, Organizations, Venues, Keywords, ResearchThemes).

## Sources

Raw scrapes live under `../scraped-data/`:

- `nsu-hci-current-website/` — NSU HCI / DIAL lab site (people, publications, awards, research themes)
- `nova-ahmed-personal-site/` — richer grant, award, and project narrative

When the two disagree, the personal site’s detail is preferred for funding and awards; the lab site augments team listings.

## Layout

| Path            | Purpose                                                                                                 |
| --------------- | ------------------------------------------------------------------------------------------------------- |
| `_reference/`   | Lookup tables: organizations, venues, keywords, research-themes                                         |
| `team/`         | Faculty profiles, named researchers, RA lists, alumni, collaborators                                    |
| `grants/`       | One file per major grant or funding line                                                                |
| `awards/`       | Consolidated award list                                                                                 |
| `projects/`     | One file per research project (stubs flagged `needs-research: true` where only a Bengali name is known) |
| `publications/` | Papers grouped by year (`2019-and-earlier.md` bundles older work)                                       |

## Verification (manual)

- Team `affiliation` strings should match an organization `name` in `_reference/organizations.md`.
- Publication `venue` values should match a `shortName` in `_reference/venues.md` (expand that file when adding new outlets).
- Grant `funder` should match an organization `name` (or common short form like `Google` / `Bill & Melinda Gates Foundation`).
- Cross-links (`teamMembers`, `projects`, `themes`) use slugs consistent across this tree.

Full bibliographic exhaust for some years still lives in `../scraped-data/nsu-hci-current-website/publications.md`; year files here prioritize structured import fields over duplicating every co-author line.
