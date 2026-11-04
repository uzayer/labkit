# LabKit Roadmap

> Living doc. Overwrite it when it goes stale, because git history is the archive. Last updated: 2026-11-04.

## Current phase: LabKit for any Lab

DIAL's site has been live since 2026-09-28. The goal now is that a Lab that isn't DIAL can get a working website out of LabKit. Architecture: [ADR-0003](../adr/0003-core-package-and-lab-sites.md). In order:

1. **Payload 4 in production.** Done 2026-11-04.
2. **`@labkit/core` package.** Move the research collections, ingestion, migrations and access into `packages/core`, a Payload plugin. Behaviour doesn't change.
3. **DIAL moves out.** Done 2026-11-04: DIAL's site and its `labs/dial/` workspace live in the `dial-site` repo, which consumes LabKit through a git submodule. Core now owns the whole schema. LabKit goes public so Vercel can clone the submodule.
4. **Features and Lab content as data.** A `Features` global switches Features (Projects, Grants, Awards, News Items…) on and off. The content DIAL hardcodes (Research Theme routes, about/contact copy, branding) moves into `LabInfo`. This takes one migration; until it lands, the schema stays frozen (ADR-0002).
5. **Default Lab site.** A generic site built from DIAL's design and driven entirely by data and Features.
6. **Onboarding.** For Lab Editors: a first-run wizard in `/admin` (Lab info → PI's ORCID → Features → first Import Run). For developers: a README and seed path. A `create-labkit` CLI comes later.

Added after a reference study (lab-site templates such as al-folio, greenelab and Hugo Blox; Crossref matching research; S2AND; Zotero; Manubot; Publish or Perish):

7. **Schema batch.** Done 2026-11-04: Team roles and alumni, typed links on Publications, wider Publication types mapped to CSL and DataCite in code, a preprint `versionOf` link, ISO currencies, Google Scholar meta tags and JSON-LD helpers.
8. **Ingestion identity hardening.**
   - Per-paper ORCIDs only: never OpenAlex's clustered `author.orcid`, which caused the 17-paper swap.
   - Crossref and OpenAlex authors paired by name, not position.
   - A name check after an ID match.
   - Title searches validated Crossref-style.
   - A fixture corpus to test against.
9. **Ingestion, second pass.** Link preprints to their published version, map the wider types, add a DataCite fallback, flag duplicates across Front Doors (Review Items only), and fill Organization types from ROR.

Deferred until Lab #2 shows the gap: a multi-source search Front Door modelled on Publish or Perish.

Out of scope: the dashboard port, CERIF and compliance work ([ADR-0001](../adr/0001-defer-cerif-alignment.md)), scrape-to-demo automation, OpenAlex sync, extra enrichment sources, and one hosted deployment serving many Labs. Each Lab gets its own deployment and database.

## Next: Lab #2

Lab #2 defines the product, not Lab #1. DIAL was hand-built by someone who knows its data, so it proves little about generality. The pilot pool, all hand-onboarded: **DIAL → MI Lab (NSU) → BRAC**. Get to Lab #2 quickly instead of polishing Lab #1. Lab #2 is where the line between DIAL-specific and LabKit gets tested.

The Bangladesh pool can't validate a compliance thesis. What transfers to a Western pitch:
- the website and maintenance value
- an ingestion engine proven on hard data (DOI-less regional venues, proceedings without ISSNs, non-Latin names)
- open-source adoption
- the JOSS paper

The cheapest compliance lead: ask BRAC's IQAC what they collect from Labs for the UGC-mandated AQAR. That's an hour and no code.

## Strategy

- **Users over revenue.** LabKit is open source and onboarding is concierge: the Operator sets up each Lab by hand and keeps a runbook ([onboard-a-lab](../operator/onboard-a-lab.md)). Ask for the testimonial on launch day. Hosting and pricing come later, informed by real usage. Don't make them impossible, but don't build them now.
- **The competitor is "do nothing".** The pitch has to arrive pre-filled, so a Lab can switch at almost no cost.
- **Distribution is referrals through the NSU network**, with DIAL's PI as the champion. DIAL's live site is the proof every referral points at.
- **Publish a JOSS paper** once ingestion is demonstrable.

## Ingestion (the moat)

There is one engine in `packages/core/src/ingestion/`, with several Front Doors that all resolve to the same shape: a DOI, or fields good enough to look one up.

| Front Door | Status | Use |
|---|---|---|
| ORCID (`import-orcid.ts`) | built | Cold demos: public API, DOI-anchored. A record covers a career, not a Lab, so the selection always needs review. |
| BibTeX (`import-bibtex.ts`) | built | Warm onboarding. Google Scholar's "Export → BibTeX" is the Scholar Front Door; there's no scraping. |
| Citation paste (`import-citations.ts`) | built | The citation wall most Labs actually have. It also handles a bare list of DOIs. |
| Old-site scrape | manual | Concierge only. |

The rules that hold everything up:
- **OpenAlex is only for per-DOI enrichment:** abstracts, open-access status, affiliations. Never use it for author search or identity.
- Supporting records are auto-created only from an identifier: a ROR ID for Organizations, an OpenAlex Source ID or ISSN for Venues.
- People are matched with a Safe Match only. Unmatched co-authors become hidden Team Members.
- Grants and Awards are always entered by hand. Funder data is effectively absent from the sources.

## Later

- **Scrape-to-demo.** Scrape a Lab's old site, ingest it, and send the PI *their own site, but better*, before first contact.
- **OpenAlex sync.** A weekly poll by the team's ORCIDs, then an email: "N new papers, approve?" This gives a Lab a reason to stay.
- **More enrichment sources:** Semantic Scholar, arXiv, PubMed.

## Open questions

- **Reviewing imported people:** there's no batch flow to accept or reject them or assign roles; the Operator edits them one at a time.
- **Tooling for manual entry** (Projects, Awards, Grants): a CLI, an MCP server, or a skill.
- **The DOI-less long tail** (workshops, theses, regional venues): manual entry has to stay pleasant.
- **When to look for a Western design partner:** probably after Lab #3.
