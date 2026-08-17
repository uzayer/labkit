# Why LabKit is data-first

LabKit began as a research-lab website assembled from a general-purpose Payload page-builder template. That was useful for exploring visual directions, but it put the wrong decision in front of a Lab Editor: choose and configure page blocks instead of maintaining the Lab's research record.

The product pivot was to treat Publications, Team Members, Projects, Grants, Awards, Research Themes, Venues, and Organizations as first-class domain data. Public pages render those records through deliberate templates.

## What changed

- The general page-builder block library was removed.
- Pages were reduced to a narrow Hero and SEO shape.
- Research collections became the primary content model.
- Publication ingestion and a review queue became core workflows.
- The public frontend became a projection of reviewed research data, not a collection of editor-arranged sections.

Rich-text embeds and a small number of explicitly supported layout blocks remain where they serve a specific content need. They are not a return to a generic site builder.

## Why this boundary matters

A structured research record can support more than one page and, eventually, more than one output. The same reviewed Publication can appear in a publication index, a Team Member profile, a Project page, an export, or a future reporting workflow without being copied into each page.

This also makes onboarding measurable. An Operator can record which sources produced which records, what needed human review, and how much manual work remained. Lab #2 can then test whether the model and runbook generalize.

## Current product boundary

LabKit is not trying to become a generic CMS template. Generic website-builder documentation and features belong upstream. The current MVP is narrower: launch DIAL's public website using real Payload data, learn from that onboarding, and preserve the repeatable procedure for the next Lab.

See [Product vision](./VISION.md), [Roadmap](./ROADMAP.md), and [Onboard a Lab](../operator/onboard-a-lab.md).
