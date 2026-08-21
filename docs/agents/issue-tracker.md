# Issue tracker: Linear (via linear-autana MCP)

Issues and PRDs for this repo live in Linear, in the **autana systems** workspace/team, under the **LabKit** project. Use the `linear-autana` MCP tools for all operations — not `gh`, not a REST call.

## Identifiers

- **Team**: `autana systems` — id `5cd13fae-4044-4aa0-9f21-57285a381879`. This is the only team in the workspace, so every issue's key is `AUT-<number>`.
- **Project**: `LabKit` — id `b403a15b-02e1-4091-b5b3-96238b5d1d26`. Scope list/search operations to this project (`project: "LabKit"`) so results don't pull in unrelated work filed against the same team.

## Conventions

- **Create an issue**: `mcp__linear-autana__save_issue` with no `id`, `title` + `team: "autana systems"` (or the team id above) required. Set `project: "LabKit"`.
- **Read an issue**: `mcp__linear-autana__get_issue` with the identifier (e.g. `AUT-131`), or `list_issues` with `fields` including `description`, `labels`, `status`.
- **List issues**: `mcp__linear-autana__list_issues`, filtered by `project: "LabKit"` plus `label`, `state`, `assignee` as needed. Request only the `fields` you need — the default response is large (full description, all timestamps, etc.).
- **Comment on an issue**: `mcp__linear-autana__save_comment` with the issue id and body (plain Markdown, literal newlines — do not escape).
- **Apply / remove labels**: `mcp__linear-autana__save_issue` with `labels: [...]` — this **replaces the full label set**, it does not append. Always fetch the issue's current labels first (`fields: ["labels"]`) if you need to add one without dropping the others.
- **Move state / close**: `mcp__linear-autana__save_issue` with `state: "<state name>"`. Six states, one per real state (2026-08-20): `Backlog`, `Todo`, `In Progress`, `Deployed`, `Canceled`, `Duplicate` — verify with `mcp__linear-autana__list_issue_statuses`. There is no single "close" verb: use `Deployed` if it shipped, `Canceled` if it will not be actioned (leave a comment saying why — there is no `wontfix` label anymore, the state carries it), or `Duplicate` plus `duplicateOf` if another issue covers it.
- **Create a label**: `mcp__linear-autana__create_issue_label` with `teamId` (not `team` — the tool's param name is `teamId`).

## Pull requests as a triage surface

**PRs as a request surface: no.** This repo's PRs are on GitHub (`git@github.com:uzayer/labkit.git`), while issues are on Linear — they are not the same system, so PR-as-issue triage doesn't apply here regardless of this flag. Leave as-is.

## When a skill says "publish to the issue tracker"

Create a Linear issue via `save_issue`, team `autana systems`, project `LabKit`.

## When a skill says "fetch the relevant ticket"

Run `mcp__linear-autana__get_issue` with the `AUT-<number>` identifier.

## Wayfinding operations

Not yet in use in this repo. If `/wayfinder` is invoked, use a Linear issue as the map (labeled or titled to indicate its role) with Linear's native `parentId` sub-issue relationship for children, and `blockedBy`/`blocks` on `save_issue` for blocking edges — Linear supports these natively, unlike GitHub's bolt-on dependency API.
