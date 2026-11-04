# Data Model Intent

This doc exists to explain intent, not field-level schema. If you need exact fields or validation rules, read `packages/core/src/collections/` (research collections), `packages/core/src/template/collections/` (site pages) and core's `globals/` and `template/globals/` folders directly.

## Why LabKit has research-domain collections

LabKit is not a generic website builder with renamed blog posts. The product assumes a lab is operating on a stable set of academic entities:

- publications
- people
- grants
- projects
- awards
- venues
- organizations
- research themes

Those entities matter because they already exist in the lab's reporting and decision-making workflow. The site is one output of that data, not the reason the data exists.

## The operating model

The model follows a filing-cabinet rule:

- edit relationships from the record that conceptually owns them
- expose reverse lookups for navigation, not as duplicate sources of truth

Examples:

- projects own their linked people, grants, publications, awards, and themes
- publications own their authors, venue, themes, and awards
- grants own their funder, investigators, and themes

This keeps the admin aligned with how labs actually think. You add a person to a project from the project, not by editing a person's page and scattering links outward.

## What this doc should and should not do

This doc should:

- justify why these collections exist at all
- explain the ownership philosophy behind relationships
- help decide whether a new concept deserves its own collection

This doc should not:

- mirror every field already visible in code
- become a second schema reference that drifts
- document temporary DIAL-specific workarounds

## Scope test for future schema additions

A new concept probably deserves a first-class collection only if most of the following are true:

- labs already think about it as a durable thing, not page copy
- it participates in real relationships with other records
- it may appear in ingestion, reporting, or automation later
- it would be painful to model as free-text forever

If not, prefer a simpler field.
