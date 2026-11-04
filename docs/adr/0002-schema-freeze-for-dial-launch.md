---
status: accepted
date: 2026-09-22
updated: 2026-11-04
---

# Schema rules that stand from DIAL's launch

The schema was frozen for DIAL's launch against real ORCID → Crossref + OpenAlex data. The freeze ends with the Features migration (ADR-0003, roadmap step 4). These rules, which came out of it, still hold:

- **Hide, don't delete.** Publications and Team carry `displayInWebsite`. The DOI path skips existing DOIs, so a *deleted* paper is re-created by the next import, while a *hidden* one stays hidden. The frontend filters on `displayInWebsite !== false`.
- **Publications own `awards`** (the filing-cabinet rule). Awards have no `linkedPublication`, and `Award.title` is only the award's name. The frontend reads an Award's paper through the `publications` join.
- **`role` alone decides a Team Member's group on the site.** There's no stored roster section, so the two can't disagree.
- **`datePrecision`** (day | month | year) on News Items. The site never prints a day it doesn't know.
- **Labels next to relationships.** `venueLabel`, `funderLabel`, `organizationLabel`, `affiliationLabel` and `amountLabel` render when there's no linked record or exact value. A free-text label renders the same way a linked record does.
- **Custom people** (Publication `customAuthor`, Grant `customInvestigator`, Award `customRecipient`) are structured free text with name, ORCID and `affiliationLabel`, not Team Members.
- **`alternateNames` on Team** are hand-curated spellings that count as a Safe Match. They're still exact and never fuzzy.
- **Optional unique IDs** (`doi`, `orcid`, `openalex_id`, `ror_id`) normalize `''` to `undefined` before saving, so two records without the ID don't collide.
- **Re-imports never overwrite.** Existing DOIs are skipped before any network call, so hand fixes survive. Ownership of individual fields only becomes an issue once something *updates* records (OpenAlex sync).
