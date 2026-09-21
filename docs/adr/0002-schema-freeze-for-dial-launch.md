---
status: accepted
date: 2026-09-22
---

# Freeze the schema against dial-test's contract and the ORCID corpus

Two sources of truth disagreed about the shape of LabKit's records. The first is `dial-test/src/data/types.ts`, the finished prototype's record contract, which every route renders from through `views.ts`. The second is what DOI-anchored ORCID ingestion (ORCID → Crossref + OpenAlex) actually produces. This ADR settles each conflict. For every one it records who gives way: the **frontend**, the **corpus** (which would mean the schema carries a field ingestion can't fill), or neither, in which case the field is **optional with a fallback**. Tracked as AUT-153.

Google Scholar, search-engine sources and DOI-less ORCID works are out of scope. The freeze covers only what the DOI path writes.

## Method

`types.ts` was diffed field by field against `src/payload-types.ts`, and the derivations in `dial-test/src/data/index.ts` were read for anything that leans on a field that isn't in the type. On the corpus side, the check was what `hydratePublicationFromDoi` writes. Record data was deliberately not read. The question here is shape, and AUT-141 / AUT-142 will surface volume.

Most of the contract was already a strict subset of LabKit. The prototype's shapes were trimmed copies of the collections, so Venue, ResearchTheme, Publication, Project and Award needed no additive change. The conflicts are the gaps listed below.

## Resolutions

### New collection

**News.** `/news` and `/news/[slug]` get a lean `News` collection in the **Research** admin group: `type` (academic | event | community), `date`, `datePrecision` (day | month | year), `title`, `slug`, `description`, `photo` (upload), `url`, `provenance`. News is the highest-churn content on a lab site. By the ROADMAP's split-by-churn rule it is data-driven, and the Lab Editor has to be able to post an item without a code change. `Posts` was rejected because it carries template baggage and still lacks `datePrecision`. The Events collection (AUT-115, Canceled) is not revived. *Neither gives way. The schema grows.*

`datePrecision` is promoted with it. Captured items often state only a month or a year, and the feed must never print an invented day.

### Promoted fields (the corpus gives way; the schema carries fields ingestion can't fill)

| Field | Collection | Why |
| --- | --- | --- |
| `logo` (upload → Media) | Organizations | The home partner strip renders marks, and the intrinsic width/height it sizes by come from the Media record. |
| `amountLabel` (text) | Grants | Sources state amounts like "5 lac" that can't become `amountValue` without inventing precision. It renders when `amountValue` is empty. |
| `alternateNames` (text, hasMany) | Team | Replaces the prototype's `nameVariants`. It follows the naming Venues and Organizations already use. `people.ts` exact-matches against it, so curated spellings ("N. Ahmed") count as a **Safe Match**. It is still exact and never fuzzy, and it is filled in by hand, not inferred. This is the one change that improves ingestion as well as the frontend. |
| `affiliationLabel` (text) | shared person-ref group (Publication `customAuthor`, Grant `customInvestigator`, Award `customRecipient`) | Mirrors `Team.affiliationLabel`, `venueLabel`, `funderLabel` and `organizationLabel`, so a hand-entered or BibTeX custom person can carry an affiliation that has no Organization record. The DOI path does not use it: it resolves every co-author to a (hidden) Team record, and an affiliation without a ROR ID already survives there as `Team.affiliationLabel`. |
| `homePartners`, `collaborators` (relationship → Organizations, hasMany, ordered) | LabInfo | The prototype hand-orders both lists. An ordered relationship on the global keeps them editable in one place without a per-record flag that can't express order. |
| `recruitment` group (`opens`, `closes` dates) | LabInfo | `/join-us` is a prose route, but the window changes every cycle. That is exactly the kind of edit a Lab Editor makes. |
| `displayInWebsite` (checkbox, default true) | Publications | Mirrors `Team.displayInWebsite`. The review pass must be able to hide a paper that isn't the Lab's, or a preprint duplicate, without deleting it: the DOI path skips existing DOIs, so a *deleted* paper is re-created by the next import while a *hidden* one stays hidden. The frontend filters on `displayInWebsite !== false`. |

### Team roster (both give way)

`rosterSection` is **not** promoted. Storing DIAL's page layout as data would let `role` and section disagree. Instead:

- `role` gains `research-staff`, which the prototype's "Researchers" section maps to. `views.ts` already invents this value in `MEMBER_ROLE`, and the scraped-site importer's `researcher` role (`mapTeamRole`) now maps to it instead of `graduate-ra`.
- `onLeave`: optional select (`study` | `professional`).
- `emerging`: checkbox, shown only for undergraduate RAs. It drives the "Emerging" badge, and those people group with undergraduate RAs.

`role` remains the single thing that decides a person's group on the People page.

### Frontend gives way

- **`Provenance.source: 'orcid'` is dropped.** `provenance.source` records who supplied the field values (Crossref or OpenAlex). ORCID is the Front Door, and the Import Run already records the Front Door. Adding `'orcid'` would mix up those two axes.
- **Award titles stop encoding the paper** (`"Best Paper — <title>"` split on ` — `). Publications own `awards` (filing-cabinet rule, ROADMAP). The port reads an Award's paper through the existing `publications` join on Awards, and `Award.title` holds only the award's name.
- **LabInfo prototype fields map onto existing ones:** `foundedYear` ← year of `foundingDate`; `tagline` ← `description`; `institution` ← `parentOrganization.name`; `address` ← `location.address`.
- **`hciResearchSince` and `parentGroup` stay hardcoded.** They appear only in the prose routes (`/about`, `/research`), which ROADMAP keeps hardcoded, and no other Lab has an equivalent.
- **LabInfo `socials.platform`:** `twitter` becomes `x` and `facebook` is added, matching Team's vocabulary and DIAL's real links. No data exists yet, so the rename costs nothing.

### Stays derived, not stored

- **Home's three Research Themes** are ranked by `projects + publications` count at query time (LOG 2026-09-21). `ResearchTheme.featured` stays but home ignores it. One caveat: ingestion never tags themes, so the ranking only becomes meaningful once themes are tagged during the review pass. Until then it is driven by Projects alone.
- **Author→Team resolution.** The prototype falls back to matching `customAuthor.name` because its fixtures leave `teamMember` unset. Ingestion sets `teamMember` on a Safe Match, so the port reads the relationship and drops the name fallback.
- **Collaboration and stats helpers** (`isCollaboration`, `labStats`, `themeStats`) derive from relationships and need no stored field.

### Confirmed as-is

- **Venue expansion.** `Venue.shortName` and `Publication.venueLabel` both survive. Venues that ingestion auto-creates from OpenAlex have no `shortName`, so `venueFullName()` returns null and they render under their full name. The acronyms that matter (CHI, CSCW…) get `shortName` by hand in the review pass. A free-text `venueLabel` renders the same way and has nothing to expand.
- **FAQs are prose.** They're hardcoded per page in the frontend, with no collection.

### Pruned (dead template fields)

From **Projects**: `projectLayoutSettings`, `appendLayoutBlock`, `designVersion`, `pageAuthor`, `readTime`, `populatedAuthors`, `overview`, `bannerImage`. The frontend reads none of them. Together they give three competing hero images and a required `designVersion`, which a Lab Editor handed the admin (AUT-155) would have to ask about. With no data yet, removing them costs nothing. `heroImage`, `content` and `meta` stay. The template's case-study renderer that read them (`src/blocks/ProjectPost/`, plus the `Stats` and `Awards` project blocks and `RenderBlocks.tsx`) went with them; `RenderProjectDetailPage.tsx` is now a minimal stand-in that keeps `/projects/<slug>` and admin preview alive until the AUT-147 port replaces it.

### Deliberately not added

Several fields ingestion could fill, the frontend doesn't render, and MVP doesn't need. `citationCount` stays unpopulated. `keywords` and `license` stay unwritten. There is no ORCID put-code, because the DOI is the dedup key and DOI-less works are out of scope.

## Generated types

`src/payload-types.ts` is gitignored in this repo, so the frozen shape is recorded by the collection configs and this ADR, not by a committed types file; regenerate with `pnpm generate:types` after checkout.

## Re-import behaviour (checked, not a schema change)

The DOI path checks for an existing Publication by DOI *before* any network call and skips it (`skipped-existing`), so re-running an ORCID import never overwrites a Publication hand-fixed in the review pass. Co-authors are matched by ORCID first, so an existing Team record is linked rather than re-written. Field-level ownership between imported and curated values only becomes a problem once something *updates* existing records — the post-MVP OpenAlex sync.
