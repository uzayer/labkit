# DIAL candidate records from public-source captures

This directory is a schema-shaped, evidence-preserving working layer derived from `../scraped-data/`. It is not a Payload export and it is not approved public copy. It stands on its own: every claim here traces to a raw capture, not to any other curated layer.

## Provenance rule

Each candidate retains a source capture filename and source heading (and, where useful, line numbers in that file). Image URLs remain linked to the source record rather than being downloaded or silently repurposed. Fields absent from public material are explicitly marked unknown. Conflicting facts remain visible for a Lab Editor to resolve.

## Source

The Firecrawl capture of 2026-09-12, stored unmodified in `../scraped-data/`:

- `nsu-hci-current-website/` — eight pages from the current NSU HCI / DIAL public site (home, DIAL Research, People, Publications, Awards, Events, Research Collaboration, Contact Us), plus `map.json` and `home.json`.
- `nova-ahmed-personal-site/` — 19 pages from Dr. Nova Ahmed's public site: the root (`home.md`) and its `/home` alias (`home-alias.md`), Awards, Collaborations, four home sub-pages, Research, and ten research-project pages, plus `map.json` and `home.json`.
- `DIAL Proposal.md` — the Lab proposal, unchanged.

Line numbers and image URLs in these documents refer to that capture. It replaced an older capture; each document ends with a short note on what changed.

## Documents

- `people-projects-themes.md` — Team, Project, and Research Theme candidates.
- `publications-reference.md` — Publication, Venue, and Organization candidates.
- `grants-awards-lab-info.md` — Grant, Award, Organization, and LabInfo candidates.
