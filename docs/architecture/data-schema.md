# Research Collections: Ownership & Relationships

This document explains the relationship architecture across LabKit's research collections (Projects, Publications, Team, Grants, Awards, Research Themes, Venues, Organizations) — specifically, which collection owns each relationship and which side just shows a read-only reverse lookup.

For field-level schema (what fields exist on each collection), read the collection config in `src/collections/` directly — that's the source of truth and this doc won't try to duplicate it.

---

## Filing Cabinet Philosophy

The relationship architecture follows a **filing cabinet model** where:

- **Relationships** (editable) = The collection that conceptually "owns" the data defines the link
- **Joins** (read-only) = Reverse lookups that show related items without data duplication

### Why This Matters

In academia, a **Project** owns its team members, publications, and funding sources. You don't go to a person's profile to add them to a project—you go to the project and add the person. This reflects how research labs actually operate:

- Principal Investigators manage project teams
- Publications are outputs of funded projects
- Awards are given to specific papers or projects
- Grants fund specific research initiatives

---

## Collection Overview

| Collection | Purpose | Schema.org Type | OpenAlex Type |
|------------|---------|-----------------|---------------|
| **Projects** | Research projects and case studies | `ResearchProject` | — |
| **Publications** | Academic papers, articles, chapters | `ScholarlyArticle` | `Work` |
| **Team** | Lab members, collaborators, alumni | `Person` | `Author` |
| **Grants** | Research funding | `Grant` / `MonetaryGrant` | `Funder` (relationship) |
| **Awards** | Recognition (Best Paper, etc.) | `Award` (property) | — |
| **Research Themes** | Research areas/topics | `Thing` (with `about`) | — |
| **Venues** | Conferences, journals | `Periodical` / `Event` | `Source` |
| **Organizations** | Institutions, funders, publishers | `Organization` subtypes | `Institution` |
| **Lab Info** | Global lab configuration | `ResearchOrganization` | `Institution` |

---

## Relationship Map

**Ownership: Projects as the hub**

```mermaid
flowchart LR
  classDef collection fill:#EEF2FF,stroke:#4F46E5,stroke-width:1px,color:#111827;

  Projects:::collection
  Team:::collection
  Publications:::collection
  Grants:::collection
  Awards:::collection
  Themes:::collection

  Projects -->|teamMembers| Team
  Projects -->|publications| Publications
  Projects -->|grants| Grants
  Projects -->|awards| Awards
  Projects -->|themes| Themes
```

**Ownership: Publication-centric**

```mermaid
flowchart LR
  classDef collection fill:#EEF2FF,stroke:#4F46E5,stroke-width:1px,color:#111827;

  Publications:::collection
  Team:::collection
  Venues:::collection
  Themes:::collection
  Awards:::collection

  Publications -->|authors| Team
  Publications -->|venue| Venues
  Publications -->|themes| Themes
  Publications -->|awards| Awards
```

`keywords` is a free-text tag array on Publications (`type: 'text', hasMany: true`), not a relationship to another collection.

**Ownership: Grants, Team, and Organizations**

```mermaid
flowchart LR
  classDef collection fill:#EEF2FF,stroke:#4F46E5,stroke-width:1px,color:#111827;

  Grants:::collection
  Team:::collection
  Organizations:::collection
  Awards:::collection
  Venues:::collection

  Grants -->|funder| Organizations
  Grants -->|investigators| Team
  Grants -->|themes| Themes

  Team -->|affiliation| Organizations

  Awards -->|organization| Organizations
  Venues -->|publisher| Organizations
```

`researchInterests` is a free-text array on Team (`type: 'text', hasMany: true`), not a relationship.

**Joins: What you see on each collection from others**

```mermaid
flowchart LR
  classDef collection fill:#F9FAFB,stroke:#9CA3AF,stroke-width:1px,color:#111827,stroke-dasharray: 3 3;

  Projects:::collection
  Publications:::collection
  Grants:::collection
  Team:::collection
  Awards:::collection
  Themes:::collection
  Venues:::collection
  Organizations:::collection

  Publications -. projects .-> Projects

  Team -. projects .-> Projects
  Team -. publications .-> Publications
  Team -. grants .-> Grants

  Grants -. projects .-> Projects

  Awards -. projects .-> Projects
  Awards -. publications .-> Publications

  Themes -. projects .-> Projects
  Themes -. publications .-> Publications
  Themes -. grants .-> Grants

  Venues -. publications .-> Publications

  Organizations -. grants .-> Grants
  Organizations -. teamMembers .-> Team
  Organizations -. awards .-> Awards
  Organizations -. venues .-> Venues
```

Legend: The **ownership diagrams** show where relationships are edited in the admin; the **joins diagram** shows which collections expose reverse lookups for convenience.

### Ownership Summary

| Collection | Owns (Editable Relationships) | Shows (Read-only Joins) |
|------------|-------------------------------|-------------------------|
| **Projects** | teamMembers, publications, grants, awards, themes | — |
| **Publications** | authors, venue, themes, awards | projects |
| **Grants** | funder, investigators, themes | projects |
| **Team** | affiliation | projects, publications, grants |
| **Awards** | organization | projects, publications |
| **Research Themes** | icon | projects, publications, grants |
| **Venues** | publisher | publications |
| **Organizations** | — | grants, teamMembers, awards, venues |


