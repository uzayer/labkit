# LabKit Product Vision

> Distilled from braindump. Last updated: 2026-03-13. Edit freely — this is a living doc.

## The Problem

Academic lab websites are either stuck in 2004 or custom-built by well-funded institutions. PIs and lab staff don't invest in web dev because their outdated sites still serve their core purposes. The highly structured, predictable nature of academic websites means even ugly HTML gets the job done.

**Why existing sites persist despite bad UX:**

- Research dissemination still works (simple HTML is scraper-friendly)
- Publications/awards establish credibility regardless of design
- Collaborators and prospective RAs find what they need
- Google Scholar and indexers love simple HTML; modern CSR can hurt discoverability if not optimized

**Why they stay stale:**

- Data entry and migration is tedious
- Website builders don't understand academic contexts
- fPIs manage research, not websites — updating is low priority busywork

## The Insight

Academic websites follow a remarkably consistent structure: Home, Research/Projects, Publications, Team, Awards, News. Very few labs deviate. The data behind these pages is **already structured in researchers' heads** — from grant applications, CVs, and institutional reporting. The problem isn't information architecture; it's the gap between how researchers think about their data and how website builders expect them to enter it.

## What LabKit Does

A CMS for research labs where the **data model mirrors the researcher's mental model**:

- **Collections match academic concepts:** Projects, Publications, Team, Grants, Awards, Research Themes, Keywords, Venues, Organizations
- **Filing cabinet philosophy:** Projects own their team members, publications, and grants — just like in reality
- **Interconnected by default:** A project page shows its grants, team, publications, and awards. Click through to any of them. No manual cross-linking needed
- **Template-driven, not block-driven:** Researchers update data, not layouts. Pages render from predefined templates that pull from collections
- **Schema.org + OpenAlex compatible:** Proper structured data for SEO, academic discoverability, and future API integrations

## Who It's For

**Primary:** Principal Investigators and lab managers at universities who:

- Have an outdated or no website
- Maintain publication lists, team rosters, and grant info in scattered docs
- Want credibility and discoverability without hiring a web dev

**First customer:** DIAL Lab (Design and Inclusion Access Lab) at North South University, Dhaka.

## The Moat

The website is an expression of the data, not the product itself. Once a lab's data is structured in LabKit, expansion opportunities include:

- Automatic CV generation from the same data
- OpenAlex sync (auto-discover new papers, PI confirms and publishes)
- Grant compliance reporting
- Publication metrics dashboards

## Current State (as of 2026-03-13)

- Data schema designed and implemented (10 collections + LabInfo global)
- Admin panel functional for data entry
- Several template pages in progress (team, publications, projects)
- Block library being built out (shadcnblocks → registered Payload blocks)
- MVP needs: finish templates, polish data entry UX, deploy for DIAL

## What's Not Decided Yet

- Pricing model (SaaS vs. one-time setup + hosting fee?)
- Open source strategy (core open, hosted service paid?)
- Template customization depth (how much layout control do labs get?)
- OpenAlex integration timeline and scope

