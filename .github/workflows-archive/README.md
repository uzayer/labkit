## Archived Workflows

This directory stores workflows that are intentionally disabled. Nothing in `.github/workflows/` is active right now.

## Paused release automation (until LabKit exits alpha)

Release automation is intentionally paused while LabKit is in alpha. Keep recording changes with `pnpm changeset` as you work — entries accumulate in `.changeset/` and will all roll into the first automated release.

The workflows are already modernized (pnpm/action-setup@v4, Node 22) and ready to go:

- `release.yml` — on push to main, the changesets action opens a version PR; merging it bumps `package.json`, updates `CHANGELOG.md`, tags, and publishes a GitHub Release with a zip archive
- `validate-changesets.yml` — requires PRs against main to include a changeset (skippable with the `no-changeset` label)

### Re-enable when out of alpha

1. Move `release.yml` and `validate-changesets.yml` back to `.github/workflows/`.
2. In repo Settings → Actions → General → Workflow permissions: set "Read and write permissions" and check "Allow GitHub Actions to create and approve pull requests" (or run `gh api -X PUT repos/Uzayer/labkit/actions/permissions/workflow -f default_workflow_permissions=write -F can_approve_pull_request_reviews=true`). This was deliberately reverted to read-only while automation is paused.
3. Push to main; merge the release PR the action opens.

## Demo cleanup (still archived)

To re-enable the demo cleanup workflow for LabKit:

1. Move `cleanup-demo.yml` back to `.github/workflows/`.
2. Update the restore endpoint and request payload for your current demo environment.
3. Configure these repository secrets:
   - `DEMO_RESTORE_TOKEN`
   - `DEMO_RESTORE_URL`
4. Trigger manually with `workflow_dispatch` and verify logs.

The workflow is archived (not deleted) so it can be reused when the LabKit demo is live.
