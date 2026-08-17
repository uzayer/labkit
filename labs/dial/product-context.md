# DIAL Site — Product Context

Last updated: 2026-04-09

---

## Audiences

| Audience                                        | Primary goal                                                     | Key pages                       |
| ----------------------------------------------- | ---------------------------------------------------------------- | ------------------------------- |
| **Prospective students** (NSU undergrads/grads) | Is this lab legit? What would I work on? How do I apply?         | Home, People, Research, Join Us |
| **Peer researchers / collaborators**            | What are you working on? Who are the people? How do I cite this? | Research, Publications, People  |
| **Funders / grant committees**                  | Outputs, impact, accountability                                  | Home, Research, Publications    |
| **Media / journalists**                         | Plain-language story, contact                                    | Home, People, Contact           |
| **Lab staff admins**                            | Maintain content with low bandwidth                              | (Admin Panel TBD)               |

---

## Information Architecture Principles

- **Homepage = credibility + routing.** Every section either builds trust or sends someone to the right place. No sections that serve one niche audience only.
- **Research page = depth.** Where collaborators and funders actually understand DIAL's scope. Earns its place by going beyond homepage cards.
- **Publications page = academic utility.** Built for peers. BibTeX, filters, Google Scholar links — what academics actually need.
- **People page = Nova's credibility first, then team.** Her lab, her vision, her track record anchors the page.
- **Join Us = evergreen recruitment.** Lab staff update once a semester. No structured openings collection — just email + timing context. (Future: per-semester structured openings collection, deferred.)
- **Events = scoped activity log.** Typed entries only — conference trips, presentations, organised events, awards, community engagement. No blog, no long-form.

---

## Content Hierarchy — Research

Four layers, each with a distinct job. None duplicate each other.

| Layer                      | URL                      | Unique job                                                                                                                                                                      |
| -------------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Homepage § Research Themes | `/`                      | 3–4 cards — surface DIAL's intellectual areas, route visitors onward                                                                                                            |
| Research overview          | `/research`              | Full scope — all themes with expanded descriptions + all projects in a filterable grid                                                                                          |
| Research Theme detail      | `/research/[theme-slug]` | One theme, everything — scoped publications, scoped collaborators, scoped grants. This is the page for a collaborator or funder who wants the full picture on one specific area |
| Project detail             | `/projects/[slug]`       | One project — problem, approach, outcomes, team, publications from this project                                                                                                 |

`/publications` is separate — it's the full bibliography, not scoped to any theme. A funder reading the theme detail page gets "here are the 8 Mental Health papers"; a peer on `/publications` gets the full 40-paper list with filters.

---

## Metrics to Track (Draft — not finalized)

- `/join-us` page visits + email click rate — primary operational metric for Nova
- `/publications` filter usage, PDF clicks, BibTeX cite clicks — signals academic utility
- `/people` — likely high organic traffic from name searches; track individual team member page visits
- Homepage bounce rate — are people finding their path or leaving
- `/research/[theme-slug]` — signals collaborator/funder interest
- Time on `/research` — correlates with collaborator depth of engagement
- ⌘K search query terms — reveals what people are actually looking for; informs content gaps
