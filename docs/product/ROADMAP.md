# LabKit Roadmap

> Living doc. Captures product decisions and sequencing. Last updated: 2026-07-02.

## DIAL Launch Plan

The blocker chain was: frontend churn was really a symptom of an unfrozen schema, and the schema was unfrozen because nobody had pushed real data through it yet. Rather than build the general-purpose ingestion pipeline first, DIAL gets a one-time hydrate script over its already-curated data (`docs/clients/dial/dial-data/`) — cheap to write, and running it against the schema is what actually exposes the gaps (see below). The reusable pipeline for lab #2 comes later, informed by what this run found.

Sequence: **probe real APIs to see the data shape → freeze schema against that shape → hydrate DIAL's data → wire dial-test to the frozen schema → launch + get the testimonial → generalize the pipeline for lab #2.** The first three steps are done as of 2026-07-02; dial-test wiring is next.

**Why this mattered, concretely:** the DOI probe (21 real DIAL papers against Crossref + OpenAlex) settled several design questions that would otherwise have been guesses — Crossref abstracts are missing more often than not (OpenAlex's `abstract_inverted_index` reconstruction is load-bearing, not a nice-to-have), ACM/IEEE proceedings don't carry ISSNs so venue matching has to key on curated `shortName` rather than API data, and `funder` is null across the board so grant↔publication auto-linking isn't happening for this corpus. Running the hydrate script against the real 250+ records (not sample data) is what surfaced the schema gaps that mattered: Awards had no way to represent multiple recipients, Grants' investigators couldn't represent a non-team-member PI, and several fields (`doi`, `orcid`, `openalex_id`, `ror_id`) had no uniqueness enforced at all, which would have let duplicate imports silently corrupt the data on a re-run.

**Decisions worth remembering:**
- No `linkedPublication` field on Awards — the filing-cabinet ownership model holds even under real-data pressure. Publications own the `awards` relationship; the hydrate script resolves an award's `linkedPublication` title (which is often truncated in the source) against real publication titles and writes the link onto the Publication.
- DOI/ORCID/OpenAlex-ID uniqueness is real but sparse — empty string is a distinct value from "field absent" in a Mongo unique index, so every collection with an optional unique field normalizes `''` → `undefined` before save. This isn't optional defensive coding; two DOI-less publications would otherwise collide on first save.
- `payload run` has a sharp edge worth remembering: it parses argv through minimist before handing off to the script, which silently drops flags like `--dry-run` (they're captured as named options, not positional args, and never forwarded). Scripts in `scripts/ingestion/` accept a bare `dry-run` positional instead.
- The hydrate run's unmatched-relations report is the honest state of DIAL's data, not a bug list: informal award-granting-org names that don't match any Organization record, one award (`Supporting Missing Daughters`) whose linked publication genuinely isn't in the curated corpus, and a handful of project→publication links using paraphrased titles. These are DIAL data-entry follow-ups, not ingestion-code fixes.

## Current Strategy (decided 2026-07-02)

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

The ingestion ladder, in fidelity order — build top-down:

1. **ORCID / OpenAlex author ID pull** — paste PI's ORCID → publications import → cluster frequent co-authors sharing the PI's institution → suggested Team roster ("we think these 9 people are your lab — confirm?")
2. **DOI list paste** — Crossref content negotiation / `api.crossref.org/works/{doi}` hydrates Publication + Venue (ISSN) + author links + funder hints from one identifier
3. **BibTeX / RIS upload** — citation-js parses both
4. **Citation wall paste** — segment (LLM) → match via Crossref `query.bibliographic` → verify title/year/first-author → review queue. Don't parse citations; recover the DOI and hydrate.
5. **Old-site URL scrape** — path 4 with a scraping step in front

Cross-cutting:

- **Review queue UI** — side-by-side original string vs. matched record, confidence badge, accept/edit/reject. Auto-accept only above high confidence. This is the core product surface.
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

- External co-authors: Team docs with an `isExternal` flag vs. hybrid authors field (relationship + free-text)? Decide before import tooling bakes in an answer.
- Pricing/packaging — deferred until real usage data exists
- Fork-per-client (upstream waterfall) vs. eventual hosted multi-tenant — deferred, but avoid schema decisions that assume one-lab-per-database forever
- DOI-less long tail (workshop papers, theses, regional venues, arXiv-only) — manual entry must stay pleasant; matters especially for Global South labs like DIAL
