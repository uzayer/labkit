# LabKit Vision

> This doc is for the durable product thesis. Use [ROADMAP.md](./ROADMAP.md) for sequencing and current execution decisions.

## Core thesis

The website is the wedge, not the moat.

Labs will say yes to a better website because it is visible, easy to understand, and immediately valuable. But the deeper product is a lab-level research information system: structured records for publications, people, grants, projects, awards, organizations, and research themes that can later power reporting, automation, and institutional workflows.

**Sharper form of the same thesis (2026-08-18):** the lab is the only place the data is actually known, and it is the only level nobody has built for. Institutional research systems have chronically poor data quality for a structural reason — they are populated either by administrators who don't know the work, or by faculty who resent the data entry. The knowledge lives in the lab; the software lives at the institution; nothing connects them. LabKit builds at the layer where the information is true.

**Standing caution.** "The website is the wedge, not the moat" is a correct long-term thesis that has, in practice, functioned as permission to keep building moat no user could test. For the next 12 months the operating inversion is: **ship the wedge, stay quiet about the moat.** Let labs #2 and #3 tell us what the moat actually is.

## Why this space is viable

Academic lab sites survive while being ugly because they are good enough at the real jobs:

- proving credibility
- listing publications
- helping students and collaborators find the lab
- satisfying institutional expectations with minimal maintenance

That means "make it prettier" is not enough. The product only wins if it also reduces the labor of keeping the lab's information current.

## Product direction

LabKit should treat research data as the primary asset and the public site as one output of that asset.

Short term:

- ship strong lab websites
- model the domain the way labs already think about it
- reduce manual website upkeep through ingestion and better admin flows

Long term:

- support lab-level RIMS workflows
- reuse the same data for CVs, grant reporting, and institutional submissions
- make grant and research administration less manual

## Product positioning

Generic site builders are optimized for marketing sites, blogs, and small business pages. Labs do not think in those terms. They think in publications, grants, team rosters, collaborations, and outputs.

LabKit is for PIs and lab operators who want:

- a credible public-facing site
- a structured internal source of truth
- less repetitive admin work over time

### Two claims, two audiences

Do not look for one sentence that serves both. The reason the ambitious claim kept feeling unearned is that it was being justified to labs, who do not care about it.

**Wedge claim — to PIs and Lab Editors:**

> Paste your ORCID. Get your lab's website.

Mechanism-specific, demo-able in thirty seconds, already substantially built. "Easy to maintain" is what every CMS claims; this is what only LabKit does.

**Category claim — to research offices, JOSS reviewers, and eventual Western institutions:**

> A research information system small enough for one lab to run.

Puts LabKit in a category these audiences already understand, and makes the *scale* the innovation rather than the model.

Nothing is oversold, because the category claim lives in the architecture rather than the marketing. The lab experiences the wedge and never needs to know it is using a CRIS.

## Competitive landscape

Corrected 2026-08-18 after checking, having previously assumed nobody had modelled this domain. They have — repeatedly, and well. What nobody has done is build it at a scale a single lab can adopt.

| System | Kind | Why it isn't a competitor |
| --- | --- | --- |
| **CERIF** (euroCRIS) | Standard data model; EU-recommended; ~200 institutional/national systems | A schema, not a product. See [ADR-0001](../adr/0001-defer-cerif-alignment.md) |
| **VIVO** | Open source, actively maintained (v1.16.0) | Institution-scale; profile/discovery-first, not a lab's website |
| **DSpace-CRIS** | Open source CRIS + repository | Requires JDK 17, Maven, Ant, PostgreSQL, **Solr 9**, Tomcat, Node, PM2 — a university IT project. No lab installs this |
| **Pure / Symplectic Elements / Converis** | Commercial, proprietary schemas that all implement CERIF | Six figures, procured by a research office, populated by administrators |

The pattern: **all of them are bought by an institution and run by IT, and none of them produce the lab's own website.** A lab has neither the authority to procure them nor anyone to operate them. This is a different unit of adoption, not a weaker or stronger version of the same product.

The real competitors are elsewhere, and should be treated as the actual threats:

1. **Doing nothing** — a Google Scholar link plus a free theme is genuinely good enough for most labs.
2. **Solo-maintainer risk** — VIVO has LYRASIS and DSpace-CRIS has 4Science behind them.
3. **Our own scope creep** — historically the most expensive of the three.

## Non-goal

LabKit should not drift back toward "page builder for anything." Generic website-builder concerns belong upstream with the template it was forked from. LabKit stays focused on research-domain structure and the workflows that come from it.
