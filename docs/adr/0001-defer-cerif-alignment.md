---
status: accepted
date: 2026-08-18
---

# Defer CERIF alignment; keep LabKit's schema bespoke for now

LabKit's research-domain collections were designed from scratch, which looks like an oversight because a mature standard for exactly this domain already exists: **CERIF** (Common European Research Information Format), maintained by euroCRIS, recommended by the EU to member states for recording research activity, and implemented by ~200 institutional and national systems — including the commercial CRIS products Pure (Elsevier), Symplectic Elements, and Converis (Clarivate). Aligning to it was considered and deliberately deferred.

## Why

- **No MVP user needs it.** CERIF's value is interchange with an institutional CRIS. DIAL has no CRIS; NSU almost certainly has none. The first several pilot Labs will have none either.
- **The target is moving.** CERIF 1.6.1 is frozen and CERIF 2.0 is mid-refactor under euroCRIS's TCIS. Building to 1.6.1 today buys rework.
- **It is an export mapping, not a schema constraint.** CERIF-XML can be emitted later from whatever schema exists, provided the entities aren't wildly divergent — and LabKit's (Publications, Team, Venues, Organizations, Grants, Awards, Projects, Research Themes) already converge closely on CERIF's core entities, having been derived independently from real publication data.
- **The scale is wrong, not the model.** Every CERIF implementation is institution-scale. LabKit's thesis is that the Lab is the level nobody has built for; adopting an institution-scale interchange format early would pull the design back toward the scale it is trying to escape.

## Considered and rejected

- **Adopt CERIF now, model collections directly on it.** Rejected: months of remodelling for zero user-visible value, against a spec being revised.
- **Never align.** Rejected: CERIF is the lingua franca all three commercial CRIS products speak, so being CERIF-expressible later is what makes a Lab's data *ingestible by* the institution — a reason for an Institution to tolerate LabKit rather than fight it. This is explicitly not an anti-Elsevier stance; Elsevier's own product implements CERIF.

## Tripwire for revisiting

Whichever comes first:

1. A Lab's Institution asks for a data export.
2. Sitting down to write the JOSS paper — where CERIF alignment is a credibility argument to reviewers, in a way it never is to a Lab.

Until then, no schema decision should be justified by "CERIF wants it this way."
