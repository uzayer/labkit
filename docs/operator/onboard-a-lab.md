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

For a new Lab, the setup wizard at `/admin/onboarding` replaces the manual first steps. The first admin lands in it on a fresh database, and it:

- reads the PI's public ORCID record and creates the PI as a Team Member with role Director and their ORCID set, so the "roster first" rule below is met (an existing Team Member with that exact ORCID is linked instead and set to Director; it never links by name);
- prefills LabInfo's institution, department and location from the PI's chosen ORCID employment, and saves the Lab's name, short name, headline, description, email and logo;
- saves the Features switches (Grants and Awards start off);
- stages the PI's ORCID works as an Import Run with nothing selected, takes the selection and a since-year filter in the UI instead of a selection JSON, and hydrates the chosen DOI works batch by batch while the page is open. Unselected works are left out of the run, as in the CLI. Its Import Runs carry `params.via: "onboarding"`.

The wizard has no dry run. Use it for a first import small enough to check by eye, and the CLI below when the Lab's selection needs a rehearsal, a reviewed selection file, or a source other than ORCID. Record which path you used in the execution log.

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
2. Check every `preprint-link`: the preprint was hidden automatically. Resolve every `possible-duplicate` by hand. Both kinds are described below.
3. Fix a missing or visibly wrong venue label. A correct free-text venue is acceptable when a Venue record cannot be matched safely.
4. Inspect no-DOI and failed-DOI works individually. Give each `unmapped-type` work a real type; ingestion stored it as `other`.
5. Defer non-visible normalization work when it does not affect the launch, but record the reason and owner.
6. Record queue counts before and after, the decisions by kind, and elapsed time.

Do not use fuzzy identity matching as an automatic decision. LabKit intentionally auto-links people only on ORCID, DBLP ID, or an unambiguous exact full name.

Ingestion takes only the ORCIDs a paper itself asserts (Crossref, or OpenAlex's per-paper `raw_orcid`), never OpenAlex's author-profile ORCID, which is what spread one swap to 17 papers in DIAL's import. An ORCID or DBLP ID match whose printed name contradicts the Team Member's name does not link. A contradiction is a different family name, or a given name that differs; an initial still fits the full name it starts, so "N. Ahmed" fits "Nova Ahmed" but "Saiful Islam" does not fit "Salekul Islam". It becomes an `identifier-name-conflict` Review Item naming both records. Work these first, and still check imported people by who owns each ORCID on any database imported before November 2026.

A new co-author whose name is an accent or middle-name variant of an existing Team Member ("Laura S. Gaytán-Lugo" and "Laura Sanely Gaytan-Lugo", "Susan Dray" and "Susan M. Dray") is still created as a new record. It also raises a person-merge suggestion with `data.reason: "name-variant"`. Merge it, then add the spelling to `alternateNames` so the next import links it exactly.

A preprint is linked to its published version only by an identifier. That means a Crossref or DataCite version relation, or OpenAlex filing both DOIs under one work. When both versions are in the Lab, in either import order, the preprint gets `versionOf` and is hidden, and a `preprint-link` Review Item records the evidence. Re-importing a DOI that is already in the Lab still links it. A title match alone never links: it raises a `possible-duplicate` Review Item instead. Possible duplicates are the same normalized title, years at most one apart and a shared family name and first initial, across Front Doors. An arXiv DOI whose DataCite record names a published DOI imports that published version too and links the arXiv record to it.

DOIs that Crossref doesn't hold (arXiv, Zenodo, figshare) are read from DataCite (provenance source `datacite`) instead of ending as failed DOIs. Every work type maps onto a Publication type. One with no counterpart is stored as `other`, and its raw source type is kept in the provenance note. An Organization created from a ROR ID takes its type from ROR (education, healthcare, facility, government, nonprofit, company).

A DOI-less BibTeX entry or citation line is auto-matched to a Crossref record only when the title and at least two of year, first author, and venue agree, and never to a preprint copy of a work cited from a journal or conference. Everything else becomes a Review Item listing the top Crossref candidates (`data.crossrefCandidates`) to pick from.

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
