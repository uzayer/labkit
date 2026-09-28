# LabKit documentation

This directory is the content source for LabKit documentation. It stays as plain Markdown until the Fumadocs work in AUT-120 and AUT-121 begins.

Keep durable, reusable LabKit knowledge here: product intent, Operator and Lab Editor workflows, and architecture that a contributor must understand. The code remains the source of truth for mechanics.

## Start here

- [Product vision](./product/VISION.md) — the product thesis and the two audiences LabKit serves
- [Roadmap](./product/ROADMAP.md) — current scope, sequencing, and explicit non-goals
- [Lab onboarding runbook](./operator/onboard-a-lab.md) — the evolving Operator procedure for taking a Lab from source material to a live site

## Operate LabKit

- [Authentication](./guides/authentication.md) — email/password login, optional Google login, and domain allowlisting
- [Roles and permissions](./guides/roles-and-permissions.md) — the effective Admin and Editor policy
- [Forms and submissions](./guides/forms.md) — CMS-backed forms, Turnstile, and standalone form wiring

## Understand the architecture

- [Data schema](./architecture/data-schema.md) — the research-domain collections and their boundaries
- [Access control](./architecture/access-control.md) — role documents, permission checks, user lifecycle rules, and known gaps
- [Theming system](./architecture/theming-system.md) — the current theming approach and its limits
- [Why LabKit is data-first](./product/idea-evolution.md) — why the inherited page-builder model was removed

Standing architecture decisions live in [`adr/`](./adr/). ADR-0001 records why CERIF alignment is deferred.

## Repository operations

The files in [`agents/`](./agents/) document this repository's issue-tracker and triage conventions. They are operational inputs for contributors and coding agents, not Lab Editor guidance.

## What lives elsewhere

- [`../README.md`](../README.md) is the current developer setup and command reference. Do not duplicate it here.
- [`../CONTEXT.md`](../CONTEXT.md) is the canonical domain glossary; [`../LOG.md`](../LOG.md) is the chronological decision record.
- [`../labs/dial/`](../labs/dial/) contains DIAL's identity and frontend delivery contract, unverified working data, raw source captures, and ingestion fixtures. It is an active Lab workspace, not reusable documentation.

## Content rules

- Use the domain terms in `CONTEXT.md`, including **Lab**, **Lab Editor**, and **Operator**.
- Prefer a missing page over copied template documentation that does not describe LabKit.
- Write task steps from a real execution. Mark unverified instructions as a plan, not as established procedure.
- Keep Lab-specific evidence in that Lab's workspace. Promote only the repeatable lesson into this directory.
- Delete obsolete snapshots; git history is the archive. Use `LOG.md` when the reasoning must remain visible.
