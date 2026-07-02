# Ingestion Architecture

Why LabKit has an ingestion layer, what shape it's in today, and what it needs to become. For field-level mechanics (what each module does, what each script accepts), read the code — `src/lib/ingestion/` and `scripts/ingestion/` — rather than this doc; that's the source of truth and it will drift less than prose describing it would.

## Why this exists

The core bet of LabKit (see @docs/product/VISION.md) is that a lab's data is already structured in the PI's head — from grant applications, CVs, institutional reporting — and the product's job is to meet that structure, not demand a new one. Ingestion is the part of the product that actually makes that bet true. A CMS that just has good field names but still requires a PI to retype 50 publications by hand hasn't solved the actual problem.

See @docs/product/ROADMAP.md's "Data ingestion pipeline" section for the ladder of ingestion paths (ORCID pull → DOI paste → BibTeX/RIS → citation wall → old-site scrape) and the "DIAL Launch Plan" section for how DIAL specifically got hydrated.

## Two tracks, deliberately

**Track 1 — one-time hydrate scripts** (`scripts/ingestion/hydrate-dial.ts`): for a lab whose data has already been manually curated into structured markdown/YAML (DIAL's case), writing a script that reads that specific shape and upserts it via the Local API is far cheaper than building a general parser, and it's what actually stress-tests the schema against real data before launch. This is not meant to be reusable across labs as-is — the parsing logic is intentionally coupled to DIAL's specific file layout.

**Track 2 — the general pipeline** (not yet built): for lab #2 onward, where data won't already be hand-curated into a known shape. This is the ORCID-pull / DOI-paste / citation-wall ladder from the roadmap, with a review queue as the core UI (confidence-scored matches, accept/edit/reject, never a silent auto-link below threshold).

**What's shared between them**, and lives in `src/lib/ingestion/` specifically so track 2 doesn't start from zero: title normalization and fuzzy matching, Crossref/OpenAlex response mapping, the idempotent upsert-by-key pattern, and the unmatched-relations report shape. When building the general pipeline, start by reading what's already in that directory rather than re-deriving it — the hard parts (JATS-stripped abstracts, OpenAlex inverted-index reconstruction, trigram-based fuzzy title matching, sparse-unique-index gotchas) were solved once against DIAL's real data and should carry forward.

## Why "don't parse, match"

The temptation with citation strings is to parse them — regex out the year, split on the last comma for the venue, etc. This breaks constantly and confidently produces wrong metadata with no signal that it's wrong. The pattern used here instead: use the citation string only to *find* the DOI (Crossref's `query.bibliographic` reverse lookup), then hydrate every field from the API response, which is authoritative. An LLM's only job in this pipeline, when a citation wall shows up, is segmenting a wall of text into individual citation strings — never extracting structured fields itself.

## Provenance as a first-class concern

Every collection that can be ingested (`Publications`, `Grants`, `Awards`) carries a `provenance` group (`src/fields/provenance.ts`): source, import timestamp, and the original source string/note. This exists because "where did this data come from and can I trust it" is a real question a PI will ask when they see a field populated they didn't type in themselves — the review queue (track 2) and any future audit trail depend on this being there from the start, not bolted on later.

## What DIAL's hydrate run actually taught us

Running `hydrate-dial.ts` against ~250 real records (not a sample) is what surfaced the schema gaps worth fixing now rather than after lab #2: Awards needed a recipients array (a single award can honor a whole team plus external co-authors), Grants' investigators needed a non-team-member fallback (a co-PI from another institution isn't a Team record), and every external-ID field needed real uniqueness enforcement — without it, a second import run would silently create duplicates instead of updating existing records.

The run's unmatched-relations report is itself useful output, not just a debugging aid: it's the authoritative list of DIAL data-entry gaps (informal award-granting-org names, one award whose linked publication isn't in the curated corpus, a few project→publication links using paraphrased titles) that need a human decision, not a code fix. That report gets regenerated on every hydrate run at `docs/clients/dial/dial-data/_fixtures/hydrate-report.json`.

## Test corpus

`docs/clients/dial/dial-data/_fixtures/` (Crossref + OpenAlex JSON for DIAL's 21 DOIs, plus reverse-lookup results for 5 DOI-less titles) is real API response data, committed as fixtures. It's the first piece of what should grow into a proper test corpus for track 2: real citation walls as fixtures, plus synthetic ground truth (render OpenAlex records through citeproc-js in a range of CSL styles, assert the pipeline recovers the source DOI) to catch citation-format regressions before they ship.
