## Archived Workflows

This directory stores workflows that are intentionally disabled.

## Paused Release Automation (LabKit)

LabKit release automation is intentionally paused until the first major release is ready.

The following workflows are archived here and therefore do not run in GitHub Actions:

- `release.yml`
- `validate-changesets.yml`

### Re-enable release automation

1. Move `release.yml` back to `.github/workflows/`.
2. Move `validate-changesets.yml` back to `.github/workflows/`.
3. If branch protection enforces old checks, update required checks in GitHub settings.
4. Create or update `.changeset/*.md` entries and open a release PR.

### Pause again later

Move those workflow files back into `.github/workflows-archive/`.

To re-enable the demo cleanup workflow for LabKit:

1. Move `cleanup-demo.yml` back to `.github/workflows/`.
2. Update the restore endpoint and request payload for your current demo environment.
3. Configure these repository secrets:
   - `DEMO_RESTORE_TOKEN`
   - `DEMO_RESTORE_URL`
4. Trigger manually with `workflow_dispatch` and verify logs.

The workflow is archived (not deleted) so it can be reused when the LabKit demo is live.
