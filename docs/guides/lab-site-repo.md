# A Lab's site repo

Each Lab's website is its own git repo. LabKit sits inside it as a **git submodule**: a folder that is really the LabKit repo, frozen at one exact commit. DIAL's site, [`dial-site`](https://github.com/uzayer/dial-site), is the working example. The architecture and its reasons are in [ADR-0003](../adr/0003-core-package-and-lab-sites.md).

## How it fits together

```
lab-site/                         ← the Lab's repo
├── src/app/(frontend)/(site)/    ← the Lab's pages (copied from LabKit's default site, then edited)
├── src/payload.config.ts         ← thin: labkitPlugin(), labkitDb(), labkitMediaStorage(), email, branding
├── package.json                  ← "workspaces": ["labkit/packages/*"], "@labkit/core": "workspace:*"
└── labkit/                       ← submodule: the LabKit repo at one pinned commit
    └── packages/core/            ← @labkit/core
```

The Lab's repo doesn't store LabKit's files. It stores a pointer, "`labkit/` is LabKit commit `abc123`", and `git clone --recurse-submodules` fetches that commit. Bun workspaces turn `labkit/packages/core` into the package `@labkit/core`, so the Lab's code imports it as if it came from npm:

```ts
import { labkitDb, labkitMediaStorage, labkitPlugin } from '@labkit/core'
```

| From LabKit (`@labkit/core`) | The Lab's own |
|---|---|
| Schema, migrations, access rules | Pages, components, design |
| Ingestion: ORCID, BibTeX, citations | Copy, fonts, logos, admin branding |
| Admin, onboarding wizard, Features | Vercel project and environment variables |
| SEO helpers, publication types | Production Turso database and Blob store |

What's shared is data, loaders and primitives. LabKit's default site (`src/app/(frontend)/(site)/`, `src/components/site/`, `src/lib/site/`, `src/plugins/revalidateSite.ts`) is not imported: a new Lab copies it into its own repo and changes it freely.

## Why a submodule

- **The Lab decides when to update.** Merging to LabKit's main changes nothing on a Lab's site until someone moves the pointer, so a bad LabKit commit can't break a live site on its own.
- **No publishing.** No npm releases or version numbers, just a commit. That's enough while there are only a handful of Labs.
- **Missing exports show up as import errors**, and that's how core's API gets designed.
- **Temporary.** ADR-0003 replaces the submodule with published `@labkit/*` packages once a third Lab needs them.

The costs: clone with `--recurse-submodules` (or run `git submodule update --init`), LabKit must stay public for Vercel to clone it, and nobody edits files inside `labkit/`. A change to LabKit is made in LabKit's repo, merged there, then pulled in by moving the pointer.

## Updating a Lab to a newer LabKit

```bash
git -C labkit pull origin main
bun install                 # core's dependencies may have changed
bun run generate:importmap && bun run generate:types && bun run tsc && bun run build
git add labkit bun.lock
git commit -m "chore: bump labkit"
git push                    # deploys the Lab's site
```

**If the new commits add files in `labkit/packages/core/src/migrations/`, migrate the Lab's production database before the push.** The build doesn't migrate, and the order matters both ways: migrate too early and the live site runs old code against the new layout; push first and new code meets the old layout. Take a Turso branch for rollback, rehearse on an exported copy, migrate production, then push straight away. dial-site's README has the exact commands.

A Vercel rollback can't undo a migration. Rolling back means pointing the deployment at the Turso branch taken before it.

## Starting a new Lab's repo

1. Create the repo and add LabKit: `git submodule add https://github.com/uzayer/labkit.git labkit`.
2. Copy dial-site's skeleton: `package.json` (with the workspace and `"@labkit/core": "workspace:*"`), `bunfig.toml`, `tsconfig.json` (with `labkit` in `exclude`), `next.config.ts`, `vercel.json` (`regions` set to the Turso database's region), `src/payload.config.ts` and `src/app/(payload)/`.
3. Copy LabKit's default site in: `labkit/src/app/(frontend)/(site)/`, `labkit/src/components/site/`, `labkit/src/lib/site/` and `labkit/src/plugins/revalidateSite.ts`. Register the plugin after `labkitPlugin()`.
4. Never add collections, globals or fields in the Lab's `payload.config.ts`, and never run `migrate:create` there. A missing module goes into core behind a Feature switch.
5. Create the Lab's Turso database and Vercel project, apply the migrations, create the first admin with the Operator's email **before the URL is public** (until then anyone can claim it at `/admin/create-first-user`), then push. [`onboard-a-lab.md`](../operator/onboard-a-lab.md) covers the data side.

## LabKit's own deployment

LabKit's repo is also deployed, as a demo of the default site: [trylabkit.vercel.app](https://trylabkit.vercel.app), on Turso `labkit-demo`, seeded with `scripts/seed-demo.ts`. It's the one deployment that follows LabKit's main directly, so a migration merged to LabKit must be applied to `labkit-demo` first, like any Lab's.
