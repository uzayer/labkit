## Archived Workflows

This directory stores workflows that are intentionally disabled.

Release automation (`release.yml`, `validate-changesets.yml`) was re-enabled and moved back to `.github/workflows/` when the repo was renamed to labkit. Releases are managed with changesets: run `pnpm changeset` to record a change, and the release workflow opens a version PR on push to main; merging it tags and publishes a GitHub Release.

## Demo cleanup (still archived)

To re-enable the demo cleanup workflow for LabKit:

1. Move `cleanup-demo.yml` back to `.github/workflows/`.
2. Update the restore endpoint and request payload for your current demo environment.
3. Configure these repository secrets:
   - `DEMO_RESTORE_TOKEN`
   - `DEMO_RESTORE_URL`
4. Trigger manually with `workflow_dispatch` and verify logs.

The workflow is archived (not deleted) so it can be reused when the LabKit demo is live.
