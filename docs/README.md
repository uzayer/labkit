# Documentation

This is the documentation for the LabKit codebase: a PayloadCMS product for research lab websites and, later, lab-level research information workflows.

Docs in this repo should explain LabKit-specific intent, constraints, and operating decisions. Generic website-builder or template documentation belongs upstream in Payblocks Autana, not here.

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
- [Data Schema](./architecture/data-schema.md) - Why the research-domain collections exist and how they should be used
- [Access Control](./architecture/access-control.md) - Custom RBAC extension and permissions system
- [Theming System](./architecture/theming-system.md) - Current theming approach and known limits

### Product
- [Vision](./product/VISION.md) - Current product thesis and long-term direction
- [Roadmap](./product/ROADMAP.md) - Product decisions and sequencing
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

Documentation should explain decisions, not just describe code. The code is the source of truth for mechanics; docs should justify intent, scope, and tradeoffs.
