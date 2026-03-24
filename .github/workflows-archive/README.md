## Archived Workflows

This directory stores workflows that are intentionally disabled.

To re-enable the demo cleanup workflow for LabKit:

1. Move `cleanup-demo.yml` back to `.github/workflows/`.
2. Update the restore endpoint and request payload for your current demo environment.
3. Configure these repository secrets:
   - `DEMO_RESTORE_TOKEN`
   - `DEMO_RESTORE_URL`
4. Trigger manually with `workflow_dispatch` and verify logs.

The workflow is archived (not deleted) so it can be reused when the LabKit demo is live.
