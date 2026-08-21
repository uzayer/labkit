# Triage Labels

The skills speak in terms of five canonical triage **state** roles plus two **category** roles. This file maps those roles to the actual label strings used in this repo's issue tracker (Linear, `autana systems` team).

**This is a solo tracker.** Three of the five state roles assume a maintainer/reporter split that does not exist here — there is nobody to triage *from* and nobody to request info *from*. Those roles map to no label. Do not create them; they were deleted deliberately.

## State roles

| Role in mattpocock/skills | Label in our tracker | Meaning                                 |
| ------------------------- | -------------------- | --------------------------------------- |
| `ready-for-agent`         | `ready-for-agent`    | Fully specified, ready for an AFK agent |
| `ready-for-human`         | `ready-for-human`    | Requires human implementation           |
| `needs-triage`            | — none —             | See below                               |
| `needs-info`              | — none —             | See below                               |
| `wontfix`                 | — none —             | See below                               |

The agent/human split is the one that earns its keep: it is how the MVP issues are sorted, and it is the signal for whether a ticket can be handed to a background agent or needs Uzayer at a keyboard.

For the three unmapped roles, use workflow **state** instead of a label:

| Role           | Do this instead                                                                                                                                  |
| -------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `needs-triage` | Leave the issue in `Backlog`. An unsorted issue in a solo tracker is just an issue that has not been read yet — no label communicates that to anyone. |
| `needs-info`   | Nothing. There is no reporter to wait on. If a ticket is underspecified, either specify it or leave it in `Backlog`.                              |
| `wontfix`      | Set state `Canceled`, and leave a comment saying why. The state already carries the meaning; a label on top of it was pure duplication.           |

## Category roles

| Role in mattpocock/skills | Label in our tracker | Meaning                                                                                                                                                       |
| ------------------------- | -------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `bug`                     | `Bug`                | Something is broken                                                                                                                                           |
| `enhancement`             | `Feature`            | New functionality or improvement — this team has no separate "enhancement"/"improvement" label; `Feature` is the closest existing match and is what all non-bug work was consolidated into |

## Workflow states

Six, one per real state. Anything finer was describing a review/deploy pipeline this repo does not have — commits go straight to `main`, there is no PR flow.

`Backlog` · `Todo` · `In Progress` · `Deployed` · `Canceled` · `Duplicate`

The completed state is named `Deployed`, not `Done` — pass that exact string to `save_issue`.

When a skill wants to "close" an issue: `Deployed` if it shipped, `Canceled` if it will not be actioned, `Duplicate` if another issue covers it (set `duplicateOf` too).

## Background

This team previously had 11 labels (5 "Area" labels — DevOps, Data, Admin, Blocks, Frontend — plus 6 "Type" labels — Deprecated, Design, Chore, Improvement, Feature, Bug). As part of setting up this skill (2026-08-12), the Area labels were dropped from every issue and Improvement/Design/Chore were folded into `Feature`, leaving just `Bug` + `Feature` as category labels, on top of which 5 state labels were added.

A second pass (2026-08-20) cut that to the four labels above and the six workflow states above. The `linear-autana` MCP has no label-delete or state-delete tool, so both passes left dead *definitions* behind in Linear's team settings that had to be removed by hand in the UI.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from these tables — or the workflow state, where the table says there is no label.
