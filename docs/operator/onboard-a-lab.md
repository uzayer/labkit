# Onboard a Lab

This is the Operator runbook for turning a Lab's existing sources into a reviewed LabKit dataset and a launchable public website. It is both the current concierge procedure and the evidence base for future automation.

The rule is simple: append each manual step, result, exception, and elapsed time while doing the work. Do not reconstruct an onboarding from memory afterward.

## Scope and ownership

The **Operator** executes the import, records evidence, and coordinates launch. The **PI** decides what belongs to the Lab. The **Lab Editor** reviews and maintains content in Payload.

Each Lab gets a workspace outside this documentation tree:

```text
labs/<lab-slug>/
  README.md
  identity.md
  frontend.md
  scraped-data/
  working-data/
```

The exact files and folders may follow the source material. The invariant is that the workspace separates identity, the frontend delivery contract, raw source captures, and unverified working data. Lab-specific material stays in `labs/<lab-slug>/`; this runbook keeps only the reusable procedure and execution log.

## Definition of done

A Lab is onboarded when:

- the PI-approved publication set and the supporting Team, Venue, and Organization records exist in Payload;
- import-created records are hidden from the public site until reviewed;
- person-merge suggestions have been explicitly confirmed or rejected;
- unresolved Review Items are consciously deferred with a reason;
- manual collections and media required by the launch scope are present;
- the Lab Editor can sign in and perform the agreed maintenance tasks;
- the public routes have been checked against the reviewed data; and
- domain, deployment, ownership, and handover are recorded.

## 1. Open the execution log

Before collecting or importing anything, add an entry under [Execution log](#execution-log) with:

- Lab name and workspace path;
- Operator and decision-making PI;
- intended public domain;
- start date;
- relevant issue links;
- source owners and access constraints; and
- a running elapsed-time total.

Never put credentials, tokens, private connection strings, or personal data that is not intended for publication in this file.

## 2. Inventory the sources

Record which sources exist and who decides conflicts between them.

| Content | Preferred source | Fallback or manual source |
| --- | --- | --- |
| Publications | PI ORCID record | Google Scholar export as BibTeX, DOI list, citation text |
| Team | Lab-approved roster | Existing site and PI confirmation |
| Venues | DOI enrichment | Human review of the publication's venue label |
| Organizations | ROR-backed author affiliations | Manual entry |
| Projects, Grants, Awards, Research Themes | Lab-provided material | Existing site, proposals, and PI confirmation |
| Images | Lab-provided originals | Explicitly licensed assets |

An ORCID record represents a person's career, not automatically a Lab's output. Record the rule used to include or exclude works before the real import.

## 3. Prepare and rehearse the import

1. Confirm the environment points to the intended database.
2. Back up an existing database before any non-dry-run import.
3. Confirm the Admin and Editor roles exist.
4. Save source exports inside the Lab workspace.
5. Run the relevant importer in `dry-run` mode and attach or link its report from the execution log.
6. Compare totals and samples against the source before authorizing writes.

Ingestion scripts run through Payload's runner. The runner forwards positional arguments but swallows flags, so `dry-run` is a bare positional word:

```bash
bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> dry-run
bun run payload -- run scripts/ingestion/import-bibtex.ts <file.bib> dry-run
bun run payload -- run scripts/ingestion/import-citations.ts <file.txt> dry-run
```

Before the ORCID import: the Lab roster must already be in Team (the ORCID owner with their `orcid` set — a live run refuses otherwise), and recurring Venues should be seeded (`bun run payload -- run scripts/ingestion/seed-venues.ts`). Scope career-spanning ORCID records with a bare `since=YYYY` positional. Each Lab's range is decided with its PI and is separate from `LabInfo.foundingDate`: DIAL is imported with `since=2017` (its NSUHCI lineage) even though its founding date is 2020. To make a selection inventory without database writes, run `bun run payload -- run scripts/ingestion/prepare-orcid-selection.ts <orcid-id> since=2017`; an unselected import dry run also writes one. The `ingestion-previews/orcid-<id>-since-<year>-selection.template.json` inventory starts with all Candidates excluded and is never overwritten by a later run. Move every approved DOI key into `includeKeys`, leave all other keys in `excludeKeys`, and keep the two arrays collectively exhaustive. Use `selection=<reviewed-path.json>` in a second dry run and the live run. The live CLI refuses to run without it. A no-DOI Candidate cannot be included in this CLI; route it through BibTeX or citation review.

For each rehearsal, record candidates, selected and deselected works, created/updated/skipped projections, Review Item counts by kind, errors, and elapsed time.

## 4. Select the Lab's publication set

Review career-spanning sources with the PI or their explicit inclusion rule. Deselect pre-Lab work, work from unrelated appointments, duplicates, and anything the Lab does not claim as its output.

Record the rule and any borderline decisions. A future Operator must be able to explain why a work was included without repeating the whole review.

## 5. Run the real import

Remove the `dry-run` positional argument only after the rehearsal has been checked. Use the same source artifact and selection rule that were rehearsed.

After the run:

1. Record the terminal Import Run status and `reportSummary`.
2. Record counts for Publications, Team Members, Venues, Organizations, and Review Items.
3. Confirm imported supporting records carry `source: 'import'` and `displayInWebsite: false` where that field applies.
4. Spot-check several Publications against the source.
5. Stop and investigate if the observed totals differ materially from the rehearsal.

Do not report a write as complete merely because the command returned. The persisted Import Run and sampled records are the evidence.

## 6. Work the review queue to presentable

Use Payload's admin collections at `/admin`; the custom dashboards are parked and are not part of the current workflow.

The launch bar is **presentable**, not a perfectly normalized research graph:

1. Confirm or reject every person-merge suggestion deliberately. A wrong match corrupts a real person's public profile.
2. Fix a missing or visibly wrong venue label. A correct free-text venue is acceptable when a Venue record cannot be matched safely.
3. Inspect no-DOI and failed-DOI works individually.
4. Defer non-visible normalization work when it does not affect the launch, but record the reason and owner.
5. Record queue counts before and after, the decisions by kind, and elapsed time.

Do not use fuzzy identity matching as an automatic decision. LabKit intentionally auto-links people only on ORCID, DBLP ID, or an unambiguous exact full name.

Check imported people by who owns each ORCID, not only by name. An ORCID taken from an OpenAlex authorship can be attached to the wrong author: in DIAL's import, one swap spread to 17 papers.

## 7. Add manual content and media

The bibliographic pipeline does not create Projects, Grants, Awards, Research Themes, or launch-ready images. Enter and review the items required by the Lab's launch scope, then record which source supported each batch.

Collect team portraits and project images early. Record consent or licensing, attribution requirements, crop/original locations, and any missing assets that affect launch.

What DIAL's frontend reads, beyond the imported records:

- **Research Themes** with exactly the nine slugs the `/research/<slug>` routes use (`accessibility-inclusion`, `computing-education-community`, `explainable-ai-ml`, `gender-feminist-hci`, `ictd`, `infodemic-misinformation`, `iot-low-cost-hardware`, `mental-health-wellbeing`, `safety-security`). A missing slug makes that route 404.
- **LabInfo**: email, address, socials, founding date, recruitment window, and `homePartners`, which drives the home page's "In collaboration with" strip. `collaborators` is loaded but no page shows it yet. Partner logos go on each Organization's `logo`. Prefer SVG when the partner has one. Payload rejects an SVG that contains scripts or other active content, so if an upload fails, check the file or rasterise it to PNG at 2×.
- **Team**: `role`, `emerging`, and `displayInWebsite` place each person on `/people`. Use the slugs in `SCHOLAR_ORDER` (`src/app/(frontend)/(dial)/publications/page.tsx`) for the Scholar links on `/publications`.
- **Projects** must be *published* to appear. Drafts stay hidden.
- **Forms**: create a Form titled exactly `Contact` with `name`, `email`, and `message` fields. `/contact` submits to it; without it, every submission fails with a message pointing people to the Lab's email address. Production also needs both Turnstile keys (`docs/guides/forms.md`).

## 8. Verify the public site

Check every in-scope route against Payload data rather than fixtures. At minimum:

- no fabricated or placeholder research content remains;
- hidden import-created records do not appear publicly;
- names, publication titles, venues, years, links, and images render correctly;
- prose routes use the approved Lab copy; and
- forms, navigation, metadata, empty states, and responsive layouts behave as expected.

Record defects in the issue tracker and link them from the Lab's execution entry.

## 9. Launch and hand over

Record the final domain decision, DNS owner, deployment target, production environment owner, backup owner, Lab Editor accounts, handover date, and any deferred work. Never copy secrets into the runbook.

Walk the Lab Editor through the actual tasks they own. Capture the gaps they encounter; those are inputs to the next revision of this runbook.

## Execution log

Append new entries. Do not rewrite older results to match later behavior.

### DIAL — rehearsal evidence

**Workspace:** `labs/dial/`  
**Issues:** AUT-140, AUT-141, AUT-142  
**Status on 2026-08-18:** source preparation and dry-run evidence exist; the first real non-dry-run ingestion and its review pass have not happened.

- **2026-07-05 — real ORCID rehearsal:** a dry run over a 122-work ORCID record produced 108 publication candidates, 261 people, 94 organizations, and 23 venues. This established that the ingestion path works against real source data; it did not write DIAL's production records.
- **2026-07-05 — review fallout observed:** the rehearsal produced 77 Review Items: 68 unmatched venues, 5 no-DOI works, and 4 person-merge suggestions. The result established the review priority used above: identity decisions first, visible venue correctness second, graph cleanup only when it affects launch.
- **2026-07-05 — DOI coverage probe:** a 21-DOI DIAL sample confirmed strong Publication and Venue coverage. Partner affiliations were sometimes recoverable through OpenAlex/ROR, while funder coverage was too sparse to automate. Grants, Awards, Research Themes, Projects, and media remain manual.
- **2026-08-18 — real import queued:** AUT-141 defines ORCID first and Google Scholar BibTeX second, with career-spanning works explicitly deselected. No production-write counts are recorded yet because the run has not occurred.
- **2026-08-18 — review pass queued:** AUT-142 timeboxes cleanup to one day and requires every person-merge suggestion to be decided. Remaining items may be deferred only with a recorded reason. No elapsed review time is recorded yet because the pass has not occurred.
- **2026-09-24 — source inventory and ORCID selection staging:** Indexed 404 source-noted prototype Candidates in `labs/dial/working-data/review-manifest.json`, all unverified; recorded conversion gaps in `SCHEMA-CHECK.md`. Staged Nova Ahmed's ORCID `0000-0002-7715-1742` with `since=2017` through `prepare-orcid-selection.ts`: 138 works total, 96 in range, 95 with DOIs. The all-excluded selection template is `ingestion-previews/orcid-0000-0002-7715-1742-since-2017-selection.template.json` (local, ignored by Git). This step made no Payload or MongoDB writes and created no Review Items. No works were approved for live import, and no manual content was approved for seed. Next: DIAL decides inclusion and the nine-theme taxonomy; Operator then rehearses the reviewed selection and seed. Elapsed time was not captured.
- **2026-09-27 — Jev triage and confirmed-row writer:** Benchmarked TypeSafe's Jev on the 12 claim cases: kind 12/12; scope 3/12 as a three-way Choice, 12/12 once decomposed into one Noul plus a rule in code (fitted on those same cases). Ran `triage-dial-manifest.ts` over all 404 rows (≈212k input tokens, under one cent): 32 `dial`, 323 `review`, 1 `outside`, 48 `no-excerpt` hints, written as `triage` only. Status is still `unverified` everywhere. Added Nova Ahmed's ORCID to her full-data record so the live ORCID owner check can pass. Rehearsed `write-dial-confirmed.ts` on a throwaway migration-only database with every non-Publication row treated as confirmed: 212 records plus the Contact Form, idempotent on re-run, and Project links filled after a one-DOI import. 87 scraped Google Sites images returned HTTP 403, so Media is still manual. No launch or production database was written. Next: DIAL confirms rows (starting with the `dial` hints and the ORCID selection), then the Operator builds the launch database per `turso-cutover.md`.
- **2026-09-27 — DIAL launch database built locally (`labkit.db`):** Operator review stood in for DIAL's row-by-row confirmation, per the Operator's instruction; `write-dial-confirmed.ts local-media include-unverified` wrote 212 non-Publication records, LabInfo, the Contact Form and 93 Media (images from the re-scrape via `fetch-images.py`, stored on local disk — upload `public/media/` to Blob before deploy). ORCID `0000-0002-7715-1742`, `since=2017`, reviewed selection: 83 of 96 works included; 9 JMIR and 3 SSRN preprints superseded by an included version were excluded, plus iFreephony (no DOI in ORCID). Created 83 Publications, 200 hidden co-authors, 20 Venues, 91 Organizations. The NSU HCI publications page (re-scraped 2026-09-27) had 70 2017+ works ORCID lacks; transcribed to `labs/dial/working-data/nsu-publications-since-2017.bib` with roster spellings for lab members, and imported: 70 Publications, 36 bibtex-only (Review Items). Left out: Burton et al. 2018 (a different N. Ahmed) and one COMPASS poster duplicating an imported CSCW paper. Hand fixes: 4 duplicate Organizations (NSU, BRAC, Cardiff, LUMS) merged into the manual records with the ROR ID moved across; 5 paper Awards linked to their Publications; Anik Saha's ORCID moved off a wrongly named hidden record (OpenAlex swapped two authors on JMIR preprint 105485), restoring 17 authorships; on the Operator's confirmation, merged "N. Ahmed" into Nova Ahmed, "Md. Majedur Rahman" and "M. M. Rahman" into Majedur Rahman and "Lamia Amin Tisha" into Lamia Amin (ORCIDs moved to the roster records, the variants kept as alternate names); a repeated author block on SSRN 6429402 removed; truncated titles restored. Pipeline fixes found by this run: BibTeX titles were sentence-cased ("bangladesh"), Crossref subtitles were dropped. Result: 153 Publications, 64 roster + 313 hidden Team, 18 Projects linked to Publications; 63 open Review Items (27 unmatched Venue, 36 bibtex-only). Every public route renders. Elapsed time was not captured. Same day, on the Operator's rule "if DIAL's site lists it, it goes in": imported the NSU page's 2012–2016 works from `nsu-publications-before-2017.bib` (38 Publications; left out 3 works by a different N. Ahmed, 2 with no DIAL author, and the page's own repeats), which restored the 11 pre-2017 Project links and the 2013 New Investigators Award link. The Operator assigned Research Themes to every Publication by hand (260 links; 6 infrastructure papers fit none). Total: 191 Publications. The 8 visible Team Members without a photo have no portrait on either scraped site.

### Entry template

```markdown
### <Lab> — <stage> — <YYYY-MM-DD>

- Operator:
- Issues:
- Source artifact and checksum or stable path:
- Environment (no secrets):
- Command or manual action:
- Selection rule:
- Result and persisted evidence:
- Review Items before/after:
- Decisions and deferrals:
- Elapsed time:
- Next action and owner:
```
