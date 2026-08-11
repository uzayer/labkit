# Ingestion Engine — Feature Checklist

Snapshot as of 2026-07-19, branch `feat/ingestion-v2-dashboard`. Every line below was checked
against the actual code (`src/lib/ingestion/`, `src/collections/`, both dashboard trees), not
recalled from memory — file references included so it can be re-verified as the branch moves.
Companion to @docs/product/ROADMAP.md (sequencing/why) and @LOG.md (decision history) — this doc
is just "what's actually there right now," for planning what's left.

Legend: `[x]` built and verified · `[~]` built but incomplete/half-fixed · `[ ]` not built

## Core engine (`src/lib/ingestion/`)

- [x] Shared DOI-anchored core — `hydratePublicationFromDoi` / `hydratePublicationFromFields`
      (`publications.ts`), every front door funnels into one engine
- [x] Two-phase pipeline — staging (fetch/parse, zero DB writes) → hydration/persistence
      (`staging.ts` vs. `publications.ts` + `run-persistence.ts`)
- [x] Idempotent re-import — existing-record check before write on both the DOI and no-DOI
      paths, never clobbers a human's post-import edits
- [x] Crossref — canonical DOI metadata (`crossref.ts`)
- [x] OpenAlex — per-DOI enrichment only: abstract reconstruction, OA status, author
      institutions. Deliberately never author-search (`openalex.ts`)
- [x] ORCID — author's own work list, front door #1 (`orcid.ts`)
- [x] DBLP — third structural author-matching tier, CS/ACM/IEEE-only coverage (`dblp.ts`)
- [ ] Semantic Scholar / arXiv / PubMed enrichment — listed in ROADMAP as future, not started

## Front doors (`scripts/ingestion/`)

- [x] ORCID pull — `import-orcid.ts`
- [x] Citation-wall paste — `import-citations.ts`, Gemini-assisted segmentation with a
      deterministic blank-line-split fallback if `GEMINI_API_KEY` is unset or the call fails
- [x] BibTeX upload — `import-bibtex.ts`
- [x] DOI list paste — degenerate case of citation-wall's per-chunk DOI regex, no separate script
- [ ] Old-site URL scrape — intentionally stays a manual/concierge process, not a repeatable rung

## Author / person disambiguation

This is the piece you asked about directly — it's further along than it looked from the outside.

- [x] Parse merged author list per paper — `mergeAuthors` (Crossref+OpenAlex by array position)
      + `attachDblpPids` (DBLP by name similarity, since DBLP's author count/order can drift)
- [x] Check if author is already on Team — `matchPersonToTeam`: ORCID-exact, DBLP-pid-exact, or
      exact-full-name **only if it's a single match**. Ambiguous or zero matches fall through to
      `none` — never guessed (`people.ts:55`)
- [x] Link paper to a matched Team member — implicit; `teamMember` relationship on
      `Publications.authors[]`, no separate "add to work" step needed
- [x] Unmatched co-author → real Team record auto-created — `resolveOrCreateTeamMember`
      ("Option A"), tagged `source: 'import'`, `displayInWebsite: false`. Replaced the old
      free-text `customAuthor` dead-end for Publications specifically (`people.ts:234`)
- [x] Fuzzy near-duplicate detection against existing Team — dice-coefficient ≥ 0.9, computed
      alongside every new-record creation, **never auto-merged**
- [x] Fuzzy duplicate surfaced as a review item — `kind: 'person-merge-suggestion'` row with
      structured `{newTeamId, existingTeamId, score}` written into `data`
      (`run-persistence.ts:123-126`)
- [x] Merge action is real, not a stub — `mergePersonSuggestion`
      (`_dashboard-legacy/dashboard/actions/review.ts`): re-points every affected publication's
      `authors[].teamMember` from the duplicate onto the survivor, deletes the duplicate, records
      the resolution. Leaves the item `open` on any failure rather than faking success.
- [ ] **"Pending people" queue with accept/deny + role picker** — this is the real gap, and it's
      narrower than "author disambiguation is unbuilt." Import-created Team records aren't a
      queue at all — they're ordinary Team docs, distinguishable only by filtering on
      `source: 'import'` + `displayInWebsite: false`. The legacy people page has a 3-tab UI
      (`members` / `everyone` / `needs-review`), but `needs-review` only surfaces open
      merge-suggestion candidates — there's no "review the N brand-new people this run created
      and assign their role" batch flow. Role is a plain field, edited one record at a time in
      the ordinary Payload admin.
- [ ] Generic review-item "Accept" action for non-merge kinds — placeholder only.
      `acceptReviewItem` marks `status: 'accepted'` with a note ("no automated create+link action
      wired up yet") rather than performing a real action. Applies to: `unmatched-venue`,
      `unmatched-org`, `no-doi-work`, `unparsed-citation`, `unmapped-type`, `failed-doi` — six of
      the seven `ReviewItems.kind` options have no accept behavior beyond acknowledgment.
- [~] `review-items` id-passing is half-fixed — the **write** side already persists structured
      `newTeamId`/`existingTeamId`/`score` (`run-persistence.ts:123-126`), but the **read** side
      (`review.ts`'s `extractTeamId`, `people/page.tsx`'s `loadNeedsReviewTeamIds`) still
      regex-parses ids out of the `value`/`data.suggestedMatch` display strings instead of
      reading the structured fields directly. Small, mechanical cleanup — LOG.md flagged the
      write-side fix but the read side wasn't updated to match.

## Organization / Venue write gating

- [x] Venues auto-create only on OpenAlex Source ID or ISSN match; no identifier → flagged for
      review, never guessed from a bare `container-title` (`issn` is `hasMany`, merges
      Crossref+OpenAlex arrays)
- [x] Organizations (partner institutions) auto-create only on ROR match via OpenAlex
      `authorships`; no ROR → flagged
- [x] Organizations (funders) — confirmed dead on real data (Crossref `funder` 2/21, OpenAlex
      `grants` 0/21), correctly not attempted
- [x] Grants, Awards, Research Themes, Projects — correctly never touched by ingestion; no
      external bibliographic source tracks any of them, permanently manual by design

## Persistence & crash safety

- [x] `ImportRuns` (immutable history) + `ReviewItems` (mutable work queue) as two collections
      with different lifecycles
- [x] Checkpointing after every candidate, not per-batch
- [x] Lease-lock + heartbeat via Mongo compare-and-swap, stale lease reclaimed after 5 min
- [x] Watchdog job queued on every invocation — maintains "a non-terminal run always has ≥1
      queued job"
- [x] `finalizeRun` idempotent (safe to re-run), releases the lease
- [x] `queueImportRun` as the sanctioned queue-first-then-mark-running helper (the parked legacy
      dashboard action still does the unsafe mark-then-queue order — don't copy that path)
- [x] Verified live against real MongoDB — 13-check regression script
      (`scripts/ingestion/verify-jobs-queue.ts`)

## Dashboard UI

- [x] Import wizard, review queue table, runs table, people table (3-tab) — all built, but only
      in `src/app/_dashboard-legacy/` (a Next.js private folder: compiles, but has no route)
- [ ] Any of the above reachable from the new Admin-Kit shell (`src/app/(dashboard)`) — zero
      links found. `sidebar-data.tsx` is still 100% template placeholder: fake user
      (`ausrobdev`), fake team switcher ("Acme Inc"), generic SaaS nav (Billing, Plans, Connected
      Apps, Webhooks, Dashboard 1/2/3, generic Users) with nothing LabKit-specific
- [x] Payload auth wired into the new shell — real login, `requireAdminUser` guard
- [ ] Register / forgot-password in the new shell — still dead template UI (may be intentional
      scope; worth confirming)

## Net read

The disambiguation logic itself — parse author list → match against Team → link → auto-create →
fuzzy-suggest → merge — is essentially done and live-verified against a real 122-work ORCID
record. It is arguably the most mature part of this codebase. What's actually missing is
narrower than "build author disambiguation":

1. A batch review surface for newly-created import people (accept/deny + assign role), not just
   the merge-suggestion sub-case that already has one
2. A real accept action for the other six `review-items` kinds (currently acknowledge-only)
3. Porting the legacy dashboard pages into the new Admin-Kit shell (pure wiring, not logic)
4. The `review-items` read-side regex-parsing cleanup (mechanical, low-risk)
