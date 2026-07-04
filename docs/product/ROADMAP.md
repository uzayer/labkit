# LabKit Roadmap

> Living doc. Captures product decisions and sequencing. Last updated: 2026-07-02.

## DIAL Launch Plan

The blocker chain was: frontend churn was really a symptom of an unfrozen schema, and the schema was unfrozen because nobody had pushed real data through it yet. The fix was to probe real APIs (Crossref + OpenAlex, 21 of DIAL's actual DOIs) to see the data shape and freeze the schema against that. A one-time hydrate script (`scripts/ingestion/hydrate-dial.ts`) over hand-curated markdown did that job and is done — it does **not** become DIAL's ongoing data source. This is still a greenfield project; there's no reason to carry a stepping-stone script forward as permanent infrastructure. DIAL's actual launch data comes from the general ingestion pipeline (below) once it exists, run against DIAL's own ORCIDs and citation lists like any other lab would be.

Sequence: **probe real APIs to see the data shape → freeze schema against that shape → build the general ingestion pipeline → run DIAL's real data through it → wire dial-test to the frozen schema → launch + get the testimonial.** The first two steps are done as of 2026-07-02; the pipeline is next.

**Why this mattered, concretely:** the DOI probe (21 real DIAL papers against Crossref + OpenAlex) settled several design questions that would otherwise have been guesses — Crossref abstracts are missing more often than not (OpenAlex's `abstract_inverted_index` reconstruction is load-bearing, not a nice-to-have), ACM/IEEE proceedings don't carry ISSNs so venue matching has to key on curated `shortName` rather than API data, and `funder` is null across the board so grant↔publication auto-linking isn't happening for this corpus. Running the hydrate script against the real 250+ records (not sample data) is what surfaced the schema gaps that mattered: Awards had no way to represent multiple recipients, Grants' investigators couldn't represent a non-team-member PI, and several fields (`doi`, `orcid`, `openalex_id`, `ror_id`) had no uniqueness enforced at all, which would have let duplicate imports silently corrupt the data on a re-run.

**Decisions worth remembering:**
- No `linkedPublication` field on Awards — the filing-cabinet ownership model holds even under real-data pressure. Publications own the `awards` relationship; the hydrate script resolves an award's `linkedPublication` title (which is often truncated in the source) against real publication titles and writes the link onto the Publication.
- DOI/ORCID/OpenAlex-ID uniqueness is real but sparse — empty string is a distinct value from "field absent" in a Mongo unique index, so every collection with an optional unique field normalizes `''` → `undefined` before save. This isn't optional defensive coding; two DOI-less publications would otherwise collide on first save.
- `payload run` has a sharp edge worth remembering: it parses argv through minimist before handing off to the script, which silently drops flags like `--dry-run` (they're captured as named options, not positional args, and never forwarded). Scripts in `scripts/ingestion/` accept a bare `dry-run` positional instead.
- The hydrate run's unmatched-relations report is the honest state of DIAL's data, not a bug list: informal award-granting-org names that don't match any Organization record, one award (`Supporting Missing Daughters`) whose linked publication genuinely isn't in the curated corpus, and a handful of project→publication links using paraphrased titles. These are DIAL data-entry follow-ups, not ingestion-code fixes.

## Current Strategy (decided 2026-07-02)

**Users over revenue.** Do things that don't scale:

- Open source the software; give it away
- Concierge onboarding — Uzayer sets up each lab's instance personally
- Payoff: testimonials, real usage data, referrals, academic networking
- Scalable product (hosted/multi-tenant, pricing) comes later, informed by real usage. Don't bake in its impossibility, but don't build it now.

**The real competitor is "do nothing."** Existing lab sites are ugly but functional; PIs won't seek out a replacement. The pitch has to arrive pre-filled (see scrape-to-demo below) so the switch costs the lab nearly zero effort.

**Distribution (decided 2026-07-02): NSU network, referral-driven.** The DIAL PI is a strong champion and will refer other labs inside (and beyond) North South University. No cold outreach needed for the first cohort. Everything is sequenced behind one milestone: **get DIAL live first** — it's the proof artifact every referral conversation points at.

**Concierge discipline:** keep a runbook of every manual step performed per lab (automation spec + fixture corpus + future self-serve docs). Ask for the testimonial at launch day, not later. Publish LabKit as a JOSS software paper once the ingestion pipeline is demonstrable — citable artifact, academic credit, distribution to exactly the right audience.

## Committed Features

### 1. Data ingestion pipeline (the moat)

One shared engine (`src/lib/ingestion/`: Crossref/OpenAlex field mapping, fuzzy title/name matching, idempotent upsert-by-key, import reporting) with multiple front doors. Every front door resolves down to the same shape — a DOI, or a title good enough to resolve one — then hydrates through the same pipeline. Front doors, in build-priority order:

1. **ORCID pull** — **built** (`scripts/ingestion/import-orcid.ts`). Paste a team member's ORCID iD → `pub.orcid.org/v3.0/{orcid}/works` → DOI per work → `hydratePublicationFromDoi`. Author→work linkage comes from ORCID directly, never from OpenAlex author-search (see below). **Caveat confirmed against real data:** an ORCID record is a person's whole career, not a lab's output — review is required even on this rung, not deferred to later ones (verified live: 72 works on a real record, several irrelevant/pre-lab).
2. **Citation wall paste** — **built** (`scripts/ingestion/import-citations.ts`). The actual median artifact most labs have (a docx/PDF export, citations grouped by year), not a fallback. Segmentation is mostly free: splits on blank lines (docx paragraphs are already citation boundaries). Regex-extracts embedded DOIs first (`extractDois`, `10.\d{4,9}/\S+`); for the rest, falls back to Crossref's `query.bibliographic` reverse lookup (`resolveCrossrefTitle`) with its own score threshold — never silently accepts a low-confidence guess. A chunk containing more than one DOI is flagged as an ambiguous-segmentation case rather than guessed at. LLM segmentation remains a later enhancement for genuinely unstructured pasted text, not a prerequisite.
3. **BibTeX upload** — **built** (`scripts/ingestion/import-bibtex.ts`), using `@retorquere/bibtex-parser` (not citation-js — its structured `{firstName, lastName}` author output and built-in field typing fit this pipeline directly). Entries with a `doi` field resolve through the same Crossref/OpenAlex path as the other rungs; DOI-less entries fall back to a Crossref title lookup, and failing that, are written directly from BibTeX fields alone with no enrichment, explicitly flagged for review. Useful for labs already on Zotero/Mendeley/EndNote, or exporting from a Google Scholar profile.
4. **DOI list paste** — effectively built as a degenerate case of rung 2 (`import-citations.ts`'s per-chunk DOI regex extraction handles a bare DOI list with no extra work) — no separate script needed.
5. **Old-site URL scrape** — stays a manual/concierge process for now (what DIAL got), not a repeatable feature.

**OpenAlex's role is narrow, and this is load-bearing:** per-DOI enrichment only (abstract via inverted-index reconstruction — 81% coverage vs. Crossref's 38% on DIAL's real 21-DOI corpus; open-access status; `authorships` → co-author institutional affiliation, for Organizations partner-matching). **Never** OpenAlex author-search/identity resolution — without a claimed profile its author disambiguation is an algorithmic guess, and DIAL has no claimed OpenAlex profiles. ORCID auto-populated by Crossref/Scopus DOI-anchored pushes (confirmed on a real record) is a materially more trustworthy author→work link than an OpenAlex author-ID match.

**Future enrichment sources (not yet built):**
- **Semantic Scholar API** — free (API key optional, raises rate limits), own author-ID graph, TLDR summaries, and citation counts that are often more complete than OpenAlex's. Natural third per-DOI enrichment source alongside Crossref/OpenAlex — same `fetch.ts` retry/backoff pattern, slots into `hydratePublicationFromDoi`'s merge step.
- **arXiv API** — preprints. Useful as an earlier-than-Crossref pull for CS/physics/math papers that don't have a publisher DOI yet, or whose only DOI is the arXiv one.
- **PubMed/NCBI E-utilities** — biomed/health-sciences metadata. Relevant for labs publishing in medical-informatics venues (JMIR-type venues already appear in DIAL's real corpus).

**Which collections ingestion actually touches** (confirmed against real DIAL data, not assumed). Two different axes matter here and were previously conflated under one "ingestible?" column: whether the engine ever **writes** a record to the collection, versus whether it **reads/matches against** an existing collection while writing somewhere else. A collection can be a match target without ever being a write target — that's Team's situation, and it's worth keeping separate so "ingestible" doesn't quietly come to mean "the engine touches it in some way."

| Collection | Write target? | Read/match target? | How |
|---|---|---|---|
| Publications | Yes — primary | — | ORCID/citation-wall/DOI/BibTeX → Crossref (primary) + OpenAlex (enrichment), via `hydratePublicationFromDoi`/`hydratePublicationFromFields` |
| Venues | Yes, gated | Yes (during Publications writes) | Auto-creates only when OpenAlex gives a Source ID or ISSN and nothing existing matches — a bare `container-title` string is never enough to auto-create (mirrors the Organizations gate below). No safe identifier → flagged for review, `venueLabel` free-text fallback. Conference proceedings routinely lack both (~35 flagged per real ORCID-driven run) |
| Organizations — partner institutions | Yes, gated | Yes (during Team/Publications writes) | Co-author affiliations via OpenAlex `authorships` (paper-scoped, doesn't inherit the author-search risk). Auto-creates only when OpenAlex supplies a ROR ID and nothing existing matches it by ROR; no ROR → flagged for review, never guessed from the bare name |
| Organizations — funders | No | No | Confirmed dead on DIAL's real corpus: Crossref `funder` 2/21, OpenAlex `grants` 0/21 |
| **Team** | **No, never** | **Yes (during Publications writes)** | See "Team's shared surface" below — this is the collection most likely to be misread as ingestible |
| Grants, Awards | No | No | No external bibliographic source tracks either; always manual |
| Research Themes | No, but low-cost | No | Small, one-time taxonomy setup (5-10 entries typically), not an ongoing ingestion problem; per-publication tagging happens at review time |
| Projects | No, and optional | No | LabKit-internal organizing concept some labs won't use — should be toggleable on/off, including on the frontend |

**Team's shared surface, precisely:** the engine never creates or updates a Team record. What it does is *consult* Team while resolving `Publications.authors[]` — for each author on an ingested work, decide whether the name matches an existing Team record (link `teamMember`) or falls through to a structured `customAuthor` (`src/lib/ingestion/people.ts`'s `matchPersonToTeam`: ORCID-exact or exact-full-name-only, never fuzzy — homonym risk against a real person's public profile). That match step is the only place Team and the ingestion engine touch. `customAuthor` is no longer a dead end: it's a group (`name`/`orcid`/`affiliation`), and `dedupeCustomAuthor` recognizes the same non-Team co-author across multiple ingested papers — ORCID-exact reuses the identity automatically, a fuzzy name match is surfaced as a review suggestion, never auto-applied. The reverse direction — surfacing existing `customAuthor` entries as suggestions when a human creates a new Team record — is still the distinct, not-yet-built AUT-133 feature (see Open Questions); this pipeline only feeds it better-structured raw material.

Cross-cutting:

- **Review step from rung 1, not just citation-wall.** Can start as a CLI dry-run report (extend `ImportReport`'s created/updated/skipped + unmatched-relations pattern) rather than a full UI — acceptable while the operator is the concierge, not yet the PI self-serving. The UI becomes necessary once this is PI-facing.
- **Provenance on imported records** — original citation string, match source, confidence. Bad matches must be auditable.
- **External IDs as dedup anchors** — Venues store OpenAlex Source ID + ISSN (+ `alternateNames`, `acronym`); Organizations store ROR ID; Team stores ORCID. Dedup by ID equality, not string matching.
- **Idempotent re-import** — DOI as unique key; fuzzy-title dedup for DOI-less works; import report ("42 matched, 38 skipped, 4 need review").
- **Test corpus** — real citation walls (DIAL docx, scraped lab pages) as fixtures, plus synthetic ground truth: render OpenAlex records through citeproc-js in many CSL styles, assert the pipeline recovers the source DOI.

### 2. Scrape-to-demo growth motion (committed 2026-07-02)

Scrape a lab's existing website → run it through the ingestion pipeline → generate a filled LabKit site in a hosted demo environment → send the PI a link to *their own site, but better*, before first contact.

- Costs ~an hour per demo (concierge-compatible), nearly unanswerable as a pitch
- Doubles as fixture collection for the ingestion test corpus
- Needs: hosted demo environment, demo-instance seeding flow, some expiry/cleanup story

### 3. OpenAlex sync (retention mechanism, pull earlier than "future moat")

Weekly poll by team ORCIDs → "N new papers found" email → PI approves/rejects. Turns site maintenance into approve/reject and gives labs a recurring reason to stay.

## Open Questions

- ~~External co-authors: Team docs with an `isExternal` flag vs. hybrid authors field (relationship + free-text)?~~ **Resolved** — hybrid pattern (relationship + free-text fallback) shipped on `Publications.authors`, `Awards.recipients`, `Grants.investigators`.
- ~~Team `customAuthor` → `teamMember` promotion UX~~ **Tracked** — [AUT-133](https://linear.app/autana-systems/issue/AUT-133/team-promotion-flow-suggest-linking-customauthor-entries-to-new-team), blocked by AUT-131. Needs a new matcher (structurally like `resolveByName`, but for people) and a "promote" admin action. Not built.
- LabKit CLI / MCP server / Claude Code skill — undecided which shape the manual-entry tooling (Projects, Awards, Grants, Themes) takes. Whichever it is, it wraps the Payload Local API the same way `hydrate-dial.ts` already does; the admin dashboard is reserved for surgical single-record edits, not primary data entry.
- Pricing/packaging — deferred until real usage data exists
- Fork-per-client (upstream waterfall) vs. eventual hosted multi-tenant — deferred, but avoid schema decisions that assume one-lab-per-database forever
- DOI-less long tail (workshop papers, theses, regional venues, arXiv-only) — manual entry must stay pleasant; matters especially for Global South labs like DIAL
