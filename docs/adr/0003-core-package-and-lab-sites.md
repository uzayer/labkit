---
status: accepted
date: 2026-11-04
---

# Ship LabKit as a core package; each Lab's site is code the Lab owns

LabKit is the canonical, open-source repo for lab websites, but until now it held DIAL's implementation, with DIAL's data hardcoded into the frontend. This ADR settles where the line between LabKit and a Lab sits.

## Decision

**What every Lab shares is a dependency.** `packages/core` (npm name `@labkit/core`) is a Payload plugin, `labkitPlugin()`. It holds:

- the research collections and the `LabInfo` global
- ingestion: Front Doors, Staging, Hydration, Safe Match
- access, roles, and the jobs task
- **the migrations**

Fixes and schema changes reach every Lab through it.

**What differs between Labs is code the Lab owns.** A Lab's website is an app that imports `@labkit/core`. The default site in this repo is a starter that gets copied, not a theme that gets overridden. This is the shadcn model: frontends drift apart, so the thing that's shared is data, loaders and primitives, not whole pages.

**DIAL lives in its own repo** (`dial-site`). It consumes LabKit through a git submodule and a bun workspace (`labkit/packages/*`). A LabKit change reaches DIAL when the submodule pointer is bumped, with no versioning or publishing. Anything DIAL needs that core doesn't export shows up as a missing export, and that's how core's API gets designed. When a third Lab exists, swap the submodule for published `@labkit/*` packages. Vercel only clones public submodules, so LabKit has to be public before DIAL deploys from `dial-site`.

**Features are switched at runtime, and the schema stays fixed.** Every Lab's database has every table. A `Features` global hides switched-off modules in the admin and removes their routes and nav from the site. Switching modules in config instead would give every Lab its own schema and migration history.

**Labs don't add collections.** Core owns the migrations, so a Lab-specific collection would fork the migration history. Under concierge onboarding a missing module gets added to core, behind a Feature switch.

## Rejected

- **Fork the template per Lab.** It's cheapest on day one, then every core change becomes a merge conflict forever. The parked dashboards show what that drift looks like.
- **DIAL in this repo as `apps/dial`.** Atomic changes and no release overhead, but a single Lab's code would sit in the canonical product repo and blur what LabKit is.
- **Publish `@labkit/*` to npm now.** It would freeze an API before a second Lab has tested it.
- **Hosted multi-tenancy.** Out of scope (ROADMAP, "Current Strategy"): each Lab gets its own deployment and database.
