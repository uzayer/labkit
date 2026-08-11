# LabKit

LabKit is a [PayloadCMS](https://payloadcms.com) content platform for research lab websites. It models the domain the way academic labs actually think about their work — Publications, Grants, Awards, Team, Projects, Organizations, Venues, Research Themes — instead of treating a lab site as generic marketing pages. The public site is one output of that data, not the reason the data exists. See [`docs/product/VISION.md`](docs/product/VISION.md) for the product thesis.

Originally built on the [shadcnblocks Payload template](https://docs.shadcnblocks.com/payload/getting-started/); the general-purpose page-builder block library from that template has since been removed in favor of a fixed Hero + SEO page shape, with Posts/Projects rendering as full detail pages. That upstream page-builder work now lives on in the `payblocks-autana` fork (Autana Systems' agency website-builder) — this repo stays focused on the research-domain product.

## What's here

- **Research-domain collections** — Publications, Grants, Awards, Team, Projects, Organizations, Venues, Research Themes, plus the base Payload template (Pages, Posts, Media, Users, Roles).
- **An ingestion pipeline** (`src/lib/ingestion/`) that pulls Publications and their related records from ORCID, DOI/Crossref/OpenAlex, DBLP, BibTeX, and citation-list paste, with a review queue for anything that needs a human decision.
- **A shadcn/ui frontend** — Hero + SEO pages, plus richText embed blocks (Code, MediaBlock, Banner, MotionText) rather than a full drag-and-drop layout builder.
- **Role-based access control**, form submissions via `@payloadcms/plugin-form-builder`, and CMS-driven theming.

See [`CLAUDE.md`](CLAUDE.md) for architecture notes and commands, and [`LOG.md`](LOG.md) for the running decision log — why non-obvious choices were made, not just what changed.

## Quick start

```bash
pnpm ii              # install (--ignore-workspace)
cp .env.example .env # fill in MONGODB_URI, PAYLOAD_SECRET, etc.
pnpm dev             # dev server on http://localhost:3000
```

For general Payload CMS setup questions not specific to LabKit, see the [shadcnblocks Payload boilerplate docs](https://docs.shadcnblocks.com/payload/getting-started/) this project originated from, or the [official Payload CMS docs](https://payloadcms.com/docs/getting-started/what-is-payload).

## Release automation status

Release automation (changesets → versioned GitHub Releases) is paused while LabKit is in alpha — keep recording changes with `pnpm changeset` as you work; entries accumulate in `.changeset/` and will roll into the first automated release.

- Archived workflows live in `.github/workflows-archive/` (see that directory's `README.md` for what they do and how to re-enable them).
- Nothing in `.github/workflows/` is currently active.
