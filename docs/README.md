# Documentation

This is the documentation for the LabKit codebase — a PayloadCMS content platform for research lab websites, originally forked from the shadcnblocks Payload template (the page-builder block system has since been removed; see root `CLAUDE.md` for the fork lineage).

## Navigation

### Getting Started
New to the project? Start here to get your development environment running.
- [Installation](./getting-started/installation.md) - Set up the project locally
- [Database Setup](./getting-started/database-setup.md) - Configure MongoDB
- [First Steps](./getting-started/first-steps.md) - Seed the database and explore

### Guides
Task-oriented how-tos for common operations.
- [Deploying](./guides/deploying.md) - Deploy to Vercel or other platforms
- [Authentication](./guides/authentication.md) - Set up Google OAuth and authentication
- [Email Configuration](./guides/email-configuration.md) - Configure email providers
- [Roles and Permissions](./guides/roles-and-permissions.md) - Manage user access control
- [Forms](./guides/forms.md) - Form submissions, Turnstile, and wiring standalone forms to Payload

### Architecture
Understanding-oriented explanations of how the system works.
- [Strategy](./architecture/STRATEGY.md) - Upstream waterfall architecture & business model
- [Data Schema](./architecture/data-schema.md) - Research collection ownership & relationships
- [Access Control](./architecture/access-control.md) - Custom RBAC extension and permissions system
- [Theming System](./architecture/theming-system.md) - CMS-driven theming architecture

### Product
- [Vision](./product/VISION.md) - Product vision and target user
- [Roadmap](./product/ROADMAP.md) - Product decisions and sequencing
- [Problem Analysis](./product/problem-analysis.md) - Why academic lab sites stay stale; constraints on building for labs
- [Idea Evolution](./product/idea-evolution.md) - How the product pivoted from page-builder to data-centric CMS
- [OpenAlex Automation Notes](./product/automation-notes.md) - Raw notes on what OpenAlex sync can and can't automate

### Clients
Per-client working material: specs, content data, and reference scrapes.
- [DIAL](./clients/dial/) - DIAL Lab (North South University) — the first LabKit instance
  - [Sitemap](./clients/dial/sitemap.md) - Page-by-page block and data source mapping
  - [Product Context](./clients/dial/product-context.md) - Client background and goals
  - [Site-wide Features](./clients/dial/site-wide-features.md) / [Global Layout](./clients/dial/global-layout.md) - Cross-page requirements
  - `pages/` - Per-page content specs (home, research, publications, people, ...)
  - `dial-data/` - Structured lab data (projects, publications, grants, team, awards) for CMS entry
  - `scraped-data/` - Scrapes of the existing NSU HCI site and the PI's personal site (also future test fixtures for the ingestion pipeline)

## Documentation Philosophy

- **Guides** answer "How do I...?" questions with step-by-step instructions
- **Architecture** answers "Why does it work this way?" with explanations and context
- **Development** answers "How do I extend this?" with patterns and examples

Documentation should explain decisions, not just describe code. If you're reading this 6 months from now, you should understand not just what the code does, but why it was designed that way.
