# DIAL review manifest

`review-manifest.json` indexes the existing schema-shaped records in `../dial-test-full-data/`. The `id` points to an object in that module; `sourceNote` says which raw capture, proposal section, or ORCID-derived source was used. Every row starts `unverified`. This is an Operator review queue, not approved Payload seed data. The prototype data may contain inferred relationships, editorial copy, or stale facts, so review the raw capture and the relevant `../organized-from-scrapes/` document before changing a row to `confirmed`.

The first snapshot has 404 rows: 192 Publications, 64 Team Members, 35 Projects, 35 News Items, 27 Organizations, 22 Awards, 20 Grants, and 9 Research Themes. Thirty-two Publication notes refer to Nova Ahmed's ORCID rather than a raw site capture; those works are absent from the NSUHCI catalogue and especially need a DIAL inclusion decision.

Generate the initial file once with `bun run payload -- run scripts/ingestion/init-dial-review-manifest.ts`. The script refuses to overwrite decisions. Venues are omitted because their prototype records have no per-record source notes; DOI hydration handles Venues separately. LabInfo is a global and must be reviewed against `../identity.md` separately.

`confirmed` means the PI or Lab Editor has approved the record **and its fields and website visibility**, not merely that the record appears on a public page. Use `rejected` for a false or out-of-scope claim and `conflict` when sources disagree; put the rationale in `decisionNote`. Publication rows are comparison evidence for the ORCID/BibTeX selection and should not be bulk seeded from this manifest. The real Publication field values come from the shared ingestion pipeline.

The manifest is deliberately an index rather than a copy of hundreds of records. It preserves one place to correct candidate field values and one place to record the inclusion decision. It does not currently have an automatic writer to Payload; the first live seed must be built from confirmed rows after review.
