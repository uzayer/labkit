# LabKit

A content platform for research lab websites: the lab's publications, people, grants, projects, awards, and collaborators modelled as structured records, with the public site as one output of that data.

This file is the project's glossary — the canonical name for each domain concept and the words to avoid. It is not a spec and holds no implementation detail. For those, read `packages/core/src/collections/` and `packages/core/src/ingestion/`. For strategy and sequencing, read `docs/product/ROADMAP.md`.

## Scale

**Lab**:
A research group organised around a PI — LabKit's unit of adoption. Deliberately smaller than any level institutional software operates at: a library models the university's publications and a research office models its awards, but nothing models the lab.
_Avoid_: group, team, organization, tenant

**Institution**:
The university or research body a Lab sits inside. Never a LabKit user; relevant only as the source of reporting obligations and as the operator of systems a Lab's data may eventually flow into.
_Avoid_: university, org, customer

## People

**PI**:
The principal investigator who owns a Lab and decides whether it adopts LabKit. Never a hands-on user of the system — they delegate the work.
_Avoid_: user, customer, admin

**Lab Editor**:
The Lab member who maintains the Lab's records after setup — the actual day-to-day user of the admin panel.
_Avoid_: user, admin, content editor

**Operator**:
Whoever performs a Lab's initial setup and bulk import. Currently always Uzayer, working by hand (concierge onboarding); the role is deliberately separate from Lab Editor because it uses different tools and assumes different expertise.
_Avoid_: admin, importer

**Team Member**:
A person record in the Lab's publication graph. Includes co-authors from other institutions, not only Lab members — being _in_ the graph and being _shown on the website_ are two separate decisions.
_Avoid_: person, author, staff

**Custom Author**:
A named author on a Publication who has no Team Member record — a structured free-text identity (name, ORCID, affiliation) rather than a relationship.
_Avoid_: external author, unmatched author

## Records

**Publication**:
A single citable research output — a paper, article or proceedings entry, but also a thesis, book, report, poster, presentation, dataset or software release. The only record type with a reliable external source of truth (a DOI), though the long tail often has none. A preprint and its published version are two Publications, linked rather than merged.
_Avoid_: paper, article, work, output

**Venue**:
The journal, conference, or proceedings a Publication appeared in.
_Avoid_: journal, conference, publisher

**Organization**:
An external institution — either a co-author's affiliation or a Grant's funder. The two roles behave differently: affiliations are discoverable from publication metadata, funders are not.
_Avoid_: institution (reserved above), affiliation, company

**Research Theme**:
A Lab's own topical grouping, used to organise Publications and Projects. A small hand-curated taxonomy, not a controlled vocabulary from any external source.
_Avoid_: tag, topic, category, keyword

**Project**:
A named body of work a Lab groups records under. An optional organising concept — some Labs do not think this way, and the concept can be switched off.
_Avoid_: initiative, program, study

**Grant**:
A funding award made to the Lab. Always entered by hand; no external source tracks these reliably.
_Avoid_: funding, award (reserved below)

**Award**:
A recognition received by a person or a Publication. Always entered by hand.
_Avoid_: prize, honour, grant

**News Item**:
A dated announcement from the Lab — a paper accepted, an event held, community work. Carries how precisely its date is known, because sources often give only a month or a year.
_Avoid_: post, event, update, announcement

**Feature**:
A module of LabKit that a Lab can switch on or off — Projects, Grants, Awards, News Items, Research Themes. Switching one off hides it in the admin and on the website; its data and schema stay.
_Avoid_: module, plugin, toggle

## Ingestion

**Front Door**:
One way of getting a Lab's Publications into LabKit — an ORCID iD, a BibTeX file, a pasted citation list. Every Front Door resolves to the same internal shape, so adding one is not adding a pipeline.
_Avoid_: importer, source, adapter

**Candidate**:
One prospective Publication identified by a Front Door, before any external lookup has happened. Candidates are what a Lab reviews and selects from.
_Avoid_: item, entry, record

**Staging**:
The phase that turns a Front Door's input into Candidates. Fetches and parses only — it never consults enrichment sources and never writes.
_Avoid_: parsing, scanning

**Hydration**:
The phase that turns a selected Candidate into a real Publication by looking it up in external sources and resolving its Venue, Organizations, and people.
_Avoid_: enrichment, import, fetching

**Import Run**:
The immutable record of one ingestion attempt — its inputs, its Candidates, and its outcome. History; never edited after the fact.
_Avoid_: job, batch, session

**Review Item**:
A single thing an Import Run could not decide safely and has handed to a human. A mutable work queue, worked down over time and outliving the Run that created it.
_Avoid_: warning, error, flag, todo

**Safe Match**:
An identity match trusted enough to apply automatically. For people this means an exact external identifier or an exact full name and nothing weaker — a wrong person match corrupts a real human's public profile, so name-similarity is only ever surfaced as a Review Item.
_Avoid_: fuzzy match, confident match, auto-link
