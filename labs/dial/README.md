# DIAL delivery workspace

DIAL—the Design Inclusion and Access Lab at North South University—is LabKit's first Lab and the current MVP. This directory holds the Lab-specific material needed to port its prototype, populate Payload, and launch its public website.

This is an active delivery workspace, not part of the future Fumadocs content tree. Repeatable onboarding knowledge belongs in [`docs/operator/onboard-a-lab.md`](../../docs/operator/onboard-a-lab.md).

## Start here

- [`identity.md`](./identity.md) — confirmed identity and the facts that still require Lab approval
- [`frontend.md`](./frontend.md) — canonical route, composition, data-mapping, and launch contract
- [`design-principles.md`](./design-principles.md) — DIAL-specific editorial and visual principles
- [`working-data/`](./working-data/) — the BibTeX files imported into the launch database, and where each record type came from
- [`scraped-data/`](./scraped-data/) — raw source captures (Firecrawl, 2026-09-12) and provenance notes

The frontend is `src/app/(frontend)/(dial)/`, and it reads real Payload records for data-driven routes. The `dial-test/` prototype it was ported from was deleted on 2026-09-28.

The launch database (`labkit.db`) is built. The review manifest, the prototype's TypeScript data, the model benchmarks and the scrape-derived candidate records that fed it were deleted on 2026-09-28; they are in Git history if it ever has to be rebuilt.

## Authority order

1. `src/app/(frontend)/(dial)/` and `src/components/dial/` for implemented composition and interaction.
2. `packages/core/src/collections/` and `packages/core/src/ingestion/` for the current data contract.
3. Raw captures plus direct confirmation from DIAL for factual claims.
4. This workspace's open decisions where neither implementation nor source material settles the question.

## Working rules

- Never promote scraped or curated material to public copy merely because it looks plausible.
- Preserve uncertain data when it helps build and test realistic UI; label it instead of laundering it into fact.
- Derived counts come from Payload records. Do not maintain the same number in several page files.
- Placeholder links and media cannot survive launch.
- Record real import and review actions in the shared onboarding runbook.
- Move lessons that apply to the next Lab into `docs/`; keep DIAL content here.
