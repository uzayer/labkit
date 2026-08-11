# Triage Labels

The skills speak in terms of five canonical triage **state** roles plus two **category** roles. This file maps those roles to the actual label strings used in this repo's issue tracker (Linear, `autana systems` team).

## State roles

| Role in mattpocock/skills | Label in our tracker | Meaning                                  |
| -------------------------- | -------------------- | ---------------------------------------- |
| `needs-triage`             | `needs-triage`        | Maintainer needs to evaluate this issue  |
| `needs-info`                | `needs-info`           | Waiting on reporter for more information |
| `ready-for-agent`           | `ready-for-agent`      | Fully specified, ready for an AFK agent  |
| `ready-for-human`           | `ready-for-human`      | Requires human implementation            |
| `wontfix`                   | `wontfix`              | Will not be actioned                     |

These five were created fresh on the `autana systems` team — nothing pre-existing collided with them. Plain names, no repo-specific renaming.

## Category roles

| Role in mattpocock/skills | Label in our tracker | Meaning                          |
| -------------------------- | --------------------- | --------------------------------- |
| `bug`                       | `Bug`                  | Something is broken                |
| `enhancement`                | `Feature`              | New functionality or improvement — this team has no separate "enhancement"/"improvement" label; `Feature` is the closest existing match and is what all non-bug work was consolidated into |

## Background

This team previously had 11 labels (5 "Area" labels — DevOps, Data, Admin, Blocks, Frontend — plus 6 "Type" labels — Deprecated, Design, Chore, Improvement, Feature, Bug). As part of setting up this skill (2026-08-12), the Area labels were dropped from every issue and Improvement/Design/Chore were folded into `Feature`, leaving just `Bug` + `Feature` as category labels, on top of which the 5 state labels above were added.

The `linear-autana` MCP has no label-delete tool, so the old label *definitions* (DevOps, Data, Admin, Blocks, Frontend, Deprecated, Design, Chore, Improvement) still exist in Linear's team settings with 0 issues on them — delete them manually in Linear's UI if you want them gone for good.

When a skill mentions a role (e.g. "apply the AFK-ready triage label"), use the corresponding label string from these tables.
