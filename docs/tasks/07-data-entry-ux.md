# Polish Data Entry UX

**Priority:** High — directly affects whether DIAL actually uses this
**Area:** Admin

## Context

The schema is designed but the admin panel experience needs to be smooth enough that a PI or lab manager can enter data without hand-holding. This is the "adoption" barrier.

## Tasks

- [ ] Test the full data entry flow: create an org → create team members → create a project → add publications → link grants
- [ ] Identify friction points (too many clicks, confusing field labels, missing defaults)
- [ ] Ensure auto-population hooks work (team name from parts, venue labels, funder labels, author positions)
- [ ] Verify conditional fields show/hide correctly (alumni fields, conference location, etc.)
- [ ] Add helpful description text to non-obvious fields in the admin
- [ ] Test the join fields — do reverse lookups display correctly?
- [ ] Consider: is there a bulk import path for publications? (CSV, BibTeX, or OpenAlex?)

## Done when

You can hand the admin panel to someone at DIAL and they can enter real data with minimal guidance.
