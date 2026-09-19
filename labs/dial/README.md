# DIAL delivery workspace

DIAL—the Design Inclusion and Access Lab at North South University—is LabKit's first Lab and the current MVP. This directory holds the Lab-specific material needed to port its prototype, populate Payload, and launch its public website.

This is an active delivery workspace, not part of the future Fumadocs content tree. Repeatable onboarding knowledge belongs in [`docs/operator/onboard-a-lab.md`](../../docs/operator/onboard-a-lab.md).

## Start here

- [`identity.md`](./identity.md) — confirmed identity and the facts that still require Lab approval
- [`frontend.md`](./frontend.md) — canonical route, composition, data-mapping, and launch contract
- [`design-principles.md`](./design-principles.md) — DIAL-specific editorial and visual principles
- [`organized-from-scrapes/`](./organized-from-scrapes/) — unverified candidate records, mapped to LabKit's collection fields, derived from the captures
- [`scraped-data/`](./scraped-data/) — raw source captures (Firecrawl, 2026-09-12) and provenance notes

The standalone prototype lives in [`dial-test/`](../../dial-test/). It is authoritative for layout and interaction, not for factual content. The production frontend belongs in `src/app/(frontend)/` and must read real Payload records for data-driven routes.

## Authority order

1. `dial-test/` for implemented composition and interaction.
2. `src/collections/` and `src/lib/ingestion/` for the current data contract.
3. Raw captures plus direct confirmation from DIAL for factual claims.
4. `organized-from-scrapes/` and `dial-test/src/data/` as useful but unverified working material.
5. This workspace's open decisions where neither implementation nor source material settles the question.

## Working rules

- Never promote scraped or curated material to public copy merely because it looks plausible.
- Preserve uncertain data when it helps build and test realistic UI; label it instead of laundering it into fact.
- Derived counts come from Payload records. Do not maintain the same number in several page files.
- Placeholder links and media cannot survive launch.
- Record real import and review actions in the shared onboarding runbook.
- Move lessons that apply to the next Lab into `docs/`; keep DIAL content here.
