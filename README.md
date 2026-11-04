<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="public/brand/labkit-wordmark-dark.svg">
  <img src="public/brand/labkit-wordmark.svg" alt="LabKit" width="280">
</picture>

<br><br>

[![Payload](https://img.shields.io/badge/Payload-4.0_beta-000000.svg?style=for-the-badge&logo=payloadcms&logoColor=white)](https://payloadcms.com)
[![Next.js](https://img.shields.io/badge/Next.js-16-000000.svg?style=for-the-badge&logo=nextdotjs&logoColor=white)](https://nextjs.org)
[![Turso](https://img.shields.io/badge/Turso-4FF8D2.svg?style=for-the-badge)](https://turso.tech)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg?style=for-the-badge)](#license)
[![Status: pre-release](https://img.shields.io/badge/Status-pre--release-orange.svg?style=for-the-badge)](#status)

**[Live demo](https://trylabkit.vercel.app)** · **[Vision](docs/product/VISION.md)** · **[Roadmap](docs/product/ROADMAP.md)** · **[Glossary](CONTEXT.md)** · **[Agent guide](CLAUDE.md)** · **[ADRs](docs/adr/)**

</div>

# LabKit

LabKit is a research information system small enough for one lab to run. It models a lab's publications, people, grants, projects, awards, venues, and collaborators as structured records, pulls most of that data in automatically from ORCID and DOI metadata, and renders the lab's public website as one output of it. Built on [PayloadCMS](https://payloadcms.com) and SQLite/Turso.

- **Paste an ORCID iD, get a populated lab.** One command resolves a researcher's works to DOIs, hydrates each through Crossref and OpenAlex, and creates the Publications, Venues, Organizations, and people they reference.
- **Every front door lands in the same engine.** ORCID, BibTeX (including a Google Scholar export), a pasted citation wall, or a bare DOI list all resolve to one internal shape — adding a source is not adding a pipeline.
- **Identity matching is conservative on purpose.** A person is auto-linked only on an exact ORCID, an exact DBLP author ID, or an exact full name. Anything weaker becomes a Review Item for a human, because a wrong match corrupts a real person's public profile.
- **Nothing is decided silently.** Every import writes an immutable Import Run, and everything the run could not decide safely lands in a mutable review queue that outlives it.
- **The domain is modelled the way labs think.** Not blog posts with renamed fields — Publications own their authors, venue, and themes; Projects own the work they group; Grants own their funder and investigators.

> **Status:** pre-release. The first pilot Lab, DIAL, has been live since 2026-09-28; its site now lives in its own repo, built on LabKit. The ingestion engine is built and verified against real data, and the default Lab site renders a Lab's records out of the box. See [Status](#status).

## Table of contents

- [Why LabKit](#why-labkit)
- [How ingestion works](#how-ingestion-works)
- [Front doors](#front-doors)
- [The data model](#the-data-model)
- [Start a new Lab](#start-a-new-lab)
- [Commands](#commands)
- [Project layout](#project-layout)
- [Status](#status)
- [Roadmap](#roadmap)
- [Working in this repo](#working-in-this-repo)
- [Links](#links)
- [License](#license)

## Why LabKit

The research information domain is heavily modelled and well served — at institution scale. CERIF, VIVO, DSpace-CRIS, Pure, Symplectic Elements, and Converis all exist and all work. Every one of them is procured by a university and run by IT, and none of them produce the lab's own website. Nobody has built for the lab.

- **The knowledge lives in the lab; the software lives at the institution.** Institutional systems have chronically poor data quality for a structural reason — they are populated by administrators who don't know the work, or by faculty who resent the data entry. LabKit builds at the layer where the information is true.
- **Lab websites are ugly because maintenance is a chore, not because nobody cares.** A site that requires manual data entry decays the moment the student who maintained it graduates. The fix is ingestion, not a nicer theme.
- **A lab cannot adopt a CRIS.** DSpace-CRIS needs JDK 17, Maven, Ant, PostgreSQL, Solr 9, Tomcat, Node, and PM2 across two separately deployed applications. That is a university IT project. LabKit is `bun run dev` and a local SQLite file.
- **Structured beats scraped.** Once the data is modelled properly, the website is only the first thing you can build from it — CVs, annual reports, and funder submissions read from the same records.
- **The real competitor is doing nothing.** A Google Scholar link and a free theme is genuinely good enough for most labs, so the switching cost has to be near zero. That constraint is why the pitch is a command, not an onboarding flow.

See [`docs/product/VISION.md`](docs/product/VISION.md) for the full thesis and competitive landscape, and [ADR-0001](docs/adr/0001-defer-cerif-alignment.md) for why CERIF alignment is deliberately deferred.

## How ingestion works

Ingestion is two phases, deliberately separated. **Staging** turns a front door's input into Candidates — it fetches and parses only, consults no enrichment source, and writes nothing. **Hydration** turns a selected Candidate into a real Publication, resolving its Venue, Organizations, and people along the way.

| Stage          | What happens                                                                                                                                                                                      | Writes?          |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- |
| **Staging**    | The front door's input is parsed into Candidates. DOIs are regex-extracted; DOI-less entries keep their raw text                                                                                  | No               |
| **Resolution** | A Candidate without a DOI is reverse-looked-up against Crossref by bibliographic query, above a score threshold. Below it, the item is flagged rather than guessed                                | No               |
| **Hydration**  | Crossref is primary. OpenAlex supplies the abstract (reconstructed from its inverted index), open-access status, and co-author affiliations. DBLP supplies disambiguated author IDs for CS venues | Yes              |
| **Matching**   | Venues match on ISSN or OpenAlex Source ID; Organizations on ROR; people on exact ORCID, exact DBLP author ID, or exact full name. A bare name never auto-creates anything                        | Yes, gated       |
| **Review**     | Anything undecidable becomes a Review Item — an unmatched venue, a DOI-less work, a possible person duplicate                                                                                     | Bookkeeping only |

Re-running an import never overwrites an existing Publication. These scripts are meant to be run repeatedly as a lab publishes, so a second run must not clobber a human's edits.

The async path runs as a Payload job with a lease-lock and a watchdog rather than Payload's default retry, because a crashed job otherwise stays `processing` forever and is never re-picked. Progress is checkpointed after every candidate, so a worker dying mid-batch loses nothing.

## Front doors

| Front door        | Command                          | Best for                                                                                                                                                        |
| ----------------- | -------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **ORCID**         | `import-orcid.ts <orcid-id>`     | Cold start. The only source with a legitimate public API, so nothing is needed from the lab. DOI-anchored and materially cleaner than the alternatives          |
| **BibTeX**        | `import-bibtex.ts <file.bib>`    | Warm onboarding. Covers Zotero, Mendeley, EndNote, and Google Scholar's native **Export → BibTeX → All my articles** — better researcher coverage, noisier data |
| **Citation list** | `import-citations.ts <file.txt>` | The median artifact a lab actually has: a docx or PDF of citations grouped by year. Splits on blank lines, extracts embedded DOIs, reverse-looks-up the rest    |
| **DOI list**      | `import-citations.ts`            | A degenerate case of the above — no separate script needed                                                                                                      |

Google Scholar has no API and scraping it is ToS-risky and bot-detected; the BibTeX export is the supported path.

Citation segmentation optionally uses Gemini when `GEMINI_API_KEY` is set, and **fails closed** — a missing key, a network error, a non-JSON response, or a hallucinated DOI all fall back to the deterministic blank-line split. The LLM never touches person matching.

## The data model

Collections are grouped so the Payload admin reads as a deliberate dashboard rather than an alphabetical dump.

| Group              | Collections                                                  | Written by ingestion?                                                       |
| ------------------ | ------------------------------------------------------------ | --------------------------------------------------------------------------- |
| **Research**       | Publications, Projects, Team, Grants, Awards, ResearchThemes | Publications yes; Team read-and-create-only for co-authors; the rest manual |
| **Reference Data** | Venues, Organizations                                        | Yes, gated on a safe external identifier (ISSN / OpenAlex Source ID / ROR)  |
| **Import**         | ImportRuns, ReviewItems                                      | Bookkeeping, written even on a dry run                                      |

Globals: **ThemeConfig**, **Header**, **Footer**, **PageConfig**, **LabInfo**.

Two properties are load-bearing:

- **Being in the publication graph and being shown on the website are separate decisions.** Every importer-created person gets `source: 'import'` and `displayInWebsite: false`.
- **Relationships are edited from the record that owns them.** You add a person to a project from the project. Reverse lookups exist for navigation, never as a second source of truth.

[`CONTEXT.md`](CONTEXT.md) is the canonical glossary — what each term means and which synonyms to avoid.

## Start a new Lab

This runs LabKit's own repo with its default site, which is the way to try it or work on LabKit itself. A real Lab gets its own site repo with LabKit pinned inside it as a git submodule, so the Lab owns its pages and decides when to take LabKit updates: see [A Lab's site repo](docs/guides/lab-site-repo.md).

Requires **Node ≥ 24** and **Bun 1.4.2**. Local development uses an ignored SQLite file; production uses Turso. Bun installs dependencies; Node runs the application.

```bash
git clone git@github.com:uzayer/labkit.git
cd labkit
bun install                # install the locked dependency set
cp .env.example .env       # works as is locally; set a strong PAYLOAD_SECRET before deploying
bun run payload migrate    # creates labkit.db from the committed migrations
bun run dev                # http://localhost:3000, admin at /admin
```

`bun install` is the sanctioned install. Bun is pinned through `packageManager`, resolves dependencies from `bun.lock`, and native build scripts are allowlisted in `package.json`'s `trustedDependencies`.

Open `/admin` and create the first user, who is always an admin. LabKit then opens the setup wizard at `/admin/onboarding`:

1. **The PI's ORCID iD.** LabKit reads the public ORCID record, prefills the Lab's institution, department and location, and adds the PI as the Lab's Director.
2. **Lab info:** name, short name, headline, description, contact email, location and logo.
3. **Features:** which modules the site shows. Grants and Awards start off.
4. **The first Import Run**, from the PI's ORCID record. Nothing is preselected, because an ORCID record covers a career, not a Lab. Filter by year, tick the Lab's works, and the page shows progress while LabKit hydrates them.
5. **Done:** view the site, built from the Lab's records, Lab Info and Features. The dashboard then keeps a checklist of what's left (Team photos, Research Themes, the review queue), which empties as the work gets done.

### Demo data

To see the site with records in it, seed a fictional Example Lab into a fresh database:

```bash
bun run payload -- run scripts/seed-demo.ts
```

Everything it adds is invented: people, publications without DOIs, Research Themes, Projects, Grants, Awards and News Items, plus Lab Info copy and the Contact form the contact page submits to. It switches every Feature on. It does nothing if the Lab already has Team Members or Publications. Seed before starting the server: the site caches its records for up to an hour, and a script's writes don't expire that cache (delete `.next/cache` to see them at once).

### Deploy to Vercel

Each Lab deploys its own site repo ([A Lab's site repo](docs/guides/lab-site-repo.md)) and gets its own Vercel project, Turso database and Vercel Blob store for Media. In the Vercel project, set the variables from `.env.example` with `TURSO_DATABASE_URL=libsql://…`, `TURSO_AUTH_TOKEN`, `BLOB_READ_WRITE_TOKEN`, strong secrets and both Turnstile keys, apply the migrations to Turso before the first deploy, create the first admin before the URL is shared (until then anyone can claim it at `/admin/create-first-user`), and pin the Vercel functions to the region nearest the Turso database (`"regions"` in `vercel.json`). [`docs/operator/turso-cutover.md`](docs/operator/turso-cutover.md) has the full sequence: environment variables, migrations, backups and Media.

Vercel has no jobs cron, so the wizard drives its import from the browser, one batch per request. Larger imports can also go through the CLI, which an Operator runs against the Lab's database:

```bash
bun run payload -- run scripts/ingestion/import-orcid.ts 0000-0002-1825-0097 dry-run
```

Drop `dry-run` to commit. A dry run writes the Import Run and a preview report, so you can see exactly what would happen before it touches content.

> `payload run` parses argv through minimist and forwards only _positional_ args, so `--dry-run` silently vanishes. Every script takes the bare word `dry-run` instead.

## Commands

```bash
bun run dev               # dev server (Turbopack)
bun run build             # generate types + Next.js build
bun run tsc               # type check
bun run lint              # oxlint
bun run format            # oxfmt
bun run generate:types    # regenerate src/payload-types.ts
bun run backup            # consistent local SQLite backup; prints the file path
bun run backup:apply -- <backup-file>  # restore to a new SQLite file only
bun run payload migrate   # apply committed SQL migrations (required before production startup)
```

Ingestion and migration scripts run through Payload's own runner, never `tsx` or `node`:

```bash
bun run payload -- run scripts/ingestion/import-orcid.ts <orcid-id> [dry-run]
bun run payload -- run scripts/ingestion/import-bibtex.ts <file.bib> [dry-run]
bun run payload -- run scripts/ingestion/import-citations.ts <file.txt> [dry-run]
bun run payload -- run scripts/ingestion/probe-doi.ts <doi>...     # onboarding diagnostic
bun run payload -- run scripts/ingestion/verify-jobs-queue.ts      # jobs-queue regression check
```

There is no test framework. `verify-jobs-queue.ts` is the closest thing — 13 live checks against a throwaway SQLite database covering lock contention, stale-lease takeover, mid-run checkpoint visibility, and watchdog drain. Run it whenever you touch the job path.

Note that `bun run tsc` does **not** cover `scripts/` — use `bun run tsc -- -p scripts/tsconfig.json` for those.

## Project layout

```
packages/core/      @labkit/core: labkitPlugin(), shared by every Lab's site
  src/collections/  research-domain collections, Media, Users, Roles,
                    ingestion bookkeeping
  src/globals/      LabInfo, Features
  src/template/     the old page-builder template's schema (Pages, Posts,
                    Header, Footer…), kept because its tables exist
  src/ingestion/    the engine: crossref, openalex, dblp, orcid, matching,
                    staging, hydration, run persistence, jobs
  src/access/       access functions, roles and permissions
  src/migrations/   every migration (the app's migrationDir points here)
src/
  payload.config.ts labkitDb(), labkitMediaStorage(), email, admin branding,
                    labkitPlugin() (which brings the whole schema)
  heros/            70+ hero variants, dispatched by RenderHero
  blocks/           richText embeds + post/project detail renderers
  app/(frontend)/(site)/  the default Lab site: a starter to copy and edit (ADR-0003)
  components/site/  its components
  lib/site/         its data: one cached load of every record, and formatting
  plugins/          revalidateSite: expires the site's cache when a record changes
  app/(payload)/    Payload admin
scripts/ingestion/  CLI front doors, run via `bun run payload -- run`
docs/
  product/          VISION, ROADMAP
  adr/              standing architectural decisions
  architecture/     data model intent, theming
  guides/           forms
```

## Status

Honest about what is and isn't built:

| Area                 | State                                                                                                                                                                                                                                                                                                                                                                                        |
| -------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Ingestion engine** | Built and verified end-to-end against a real career-wide ORCID record — a 122-work profile resolved to 108 publications, 261 people, 94 organizations, and 23 venues, with 77 items correctly routed to review                                                                                                                                                                               |
| **Data model**       | Shaped by real data, not designed in the abstract. The schema gaps that mattered were found by pushing an actual lab's corpus through it                                                                                                                                                                                                                                                     |
| **Payload admin**    | The working admin surface, grouped into a deliberate v1 dashboard                                                                                                                                                                                                                                                                                                                            |
| **Public frontend**  | DIAL's site is live from its own repo, `dial-site`, which consumes LabKit as a git submodule. This repo ships the default Lab site, a starter a Lab copies and edits                                                                                                                                                                                                                         |
| **Custom dashboard** | Parked. Two prototypes live in `src/app/_dashboard-kit/` and `src/app/_dashboard-legacy/` as Next.js private folders — they compile and are importable, but generate no routes                                                                                                                                                                                                               |
| **Multi-lab**        | Each Lab gets its own deployment and database; every Lab has the same schema. Features switch modules (Projects, Grants, Awards, News Items, Research Themes) per Lab, and each Lab restyles its own copy of the site. Not yet tested beyond DIAL; Lab #2 will test it. A demo of the default site with a fictional Example Lab runs at [trylabkit.vercel.app](https://trylabkit.vercel.app) |

## Roadmap

- **The second lab.** The product-defining moment — the first time the engine and frontend meet a lab that wasn't designed around. What is lab-specific and what is LabKit gets discovered there, not before.
- **Scrape to demo.** Run a lab's existing site through the pipeline and send the PI a link to their own site, already filled, before first contact.
- **Recurring sync.** A weekly OpenAlex poll by team ORCID turns site maintenance into approve/reject.
- **More enrichment sources.** Semantic Scholar for citation counts and TLDRs, arXiv for preprints, PubMed for medical-informatics venues.
- **Export and reporting.** CVs, annual activity reports, and eventually a CERIF export — the point at which a lab's data becomes ingestible _by_ its institution.

Full sequencing, including what is explicitly out of scope, is in [`docs/product/ROADMAP.md`](docs/product/ROADMAP.md).

## Working in this repo

Read these before non-trivial work:

- [`CLAUDE.md`](CLAUDE.md) (also `AGENTS.md`) — scope, verification, and the non-obvious gotchas that cost real debugging time.
- [`CONTEXT.md`](CONTEXT.md) — the glossary. It is opinionated about which words to avoid; use its terms exactly.
- [`docs/adr/`](docs/adr/) — standing architectural decisions.

Conventions: `@/` maps to `src/*`. Functional components, named exports, server components by default. ES modules throughout. A Husky pre-commit hook runs `oxlint --fix` and `oxfmt` on staged files, and `commit-msg` enforces Conventional Commits — a non-conforming message is rejected, not warned about.

LabKit originated from the [shadcnblocks Payload template](https://docs.shadcnblocks.com/payload/getting-started/). That template's general-purpose page-builder block library has been removed in favour of a fixed Hero + SEO page shape. Keep generic site-builder concerns upstream — this repo stays on the research domain.

## Links

- **Payload CMS docs:** [payloadcms.com/docs](https://payloadcms.com/docs/getting-started/what-is-payload)
- **shadcnblocks Payload boilerplate:** [docs.shadcnblocks.com/payload](https://docs.shadcnblocks.com/payload/getting-started/)
- **ORCID public API:** [info.orcid.org/documentation](https://info.orcid.org/documentation/)
- **Crossref REST API:** [api.crossref.org](https://api.crossref.org)
- **OpenAlex:** [docs.openalex.org](https://docs.openalex.org)

## License

MIT, per `package.json`.
