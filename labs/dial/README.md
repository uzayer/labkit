# DIAL workspace

DIAL at North South University is LabKit's first Lab and the current MVP. This directory contains the Lab-specific material used to ingest its research record and build its public website.

This is an active delivery workspace, not part of the future Fumadocs content tree. Repeatable onboarding lessons belong in [`docs/operator/onboard-a-lab.md`](../../docs/operator/onboard-a-lab.md).

## Contents

- [`product-context.md`](./product-context.md) — DIAL's goals and background
- [`sitemap.md`](./sitemap.md) — route and component map
- [`global-layout.md`](./global-layout.md) and [`site-wide-features.md`](./site-wide-features.md) — shared frontend requirements
- [`pages/`](./pages/) — page-level content and implementation specs
- [`dial-data/`](./dial-data/) — structured Publications, Team, Projects, Grants, Awards, and reference data used by ingestion
- [`scraped-data/`](./scraped-data/) — source captures from the existing Lab and PI websites
- [`notes.md`](./notes.md) — unresolved working notes; promote durable decisions to `LOG.md` or the relevant spec

The standalone design prototype lives in [`dial-test/`](../../dial-test/). The production frontend is being ported into `src/app/(frontend)/` and must read real Payload data.

## Working rules

- Treat scraped files as evidence, not automatically approved public copy.
- Preserve source attribution and distinguish source material from edited content.
- Keep credentials and non-public personal data out of this directory.
- Record import and review actions in the shared onboarding runbook while they happen.
- When a lesson applies to the next Lab, move the lesson—not DIAL's content—into `docs/`.
