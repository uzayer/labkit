# Documentation

This is the documentation for the LabKit codebase, which is built on top of the PayBlocks template (a PayloadCMS + shadcn/ui website builder).

## Navigation

### Getting Started
New to the project? Start here to get your development environment running.
- [Installation](./getting-started/installation.md) - Set up the project locally
- [Database Setup](./getting-started/database-setup.md) - Configure MongoDB
- [Environment Variables](./getting-started/environment-variables.md) - Required configuration
- [First Steps](./getting-started/first-steps.md) - Seed the database and explore

### Guides
Task-oriented how-tos for common operations.
- [Deploying](./guides/deploying.md) - Deploy to Vercel or other platforms
- [Authentication](./guides/authentication.md) - Set up Google OAuth and authentication
- [Email Configuration](./guides/email-configuration.md) - Configure email providers
- [Editing Pages](./guides/editing-pages.md) - Use the page builder and theme customization
- [Roles and Permissions](./guides/roles-and-permissions.md) - Manage user access control
- [Forms](./guides/forms.md) - Form submissions, Turnstile, and wiring standalone forms to Payload

### Architecture
Understanding-oriented explanations of how the system works.
- [Data Schema](./architecture/data-schema.md) - Research collections, relationships, and data model
- [Access Control](./architecture/access-control.md) - Custom RBAC extension and permissions system
- [Theming System](./architecture/theming-system.md) - CMS-driven theming architecture
- [Blocks and Heroes](./architecture/blocks-and-heroes.md) - Hero+Layout pattern and block system *(coming soon)*
- [Overview](./architecture/overview.md) - System design and key patterns *(coming soon)*

### Development
For contributors extending or modifying the system.
- [Custom Blocks](./development/custom-blocks.md) - Add and modify blocks
- [Code Smells](./development/code-smells.md) - Learn common smells in this codebase and refactoring approaches
- [Block Registry](./development/block-registry.md) - Reference of all available blocks *(coming soon)*
- [Contributing](./development/contributing.md) - Code style and contribution guidelines *(coming soon)*
- [Troubleshooting](./development/troubleshooting.md) - Common development issues *(coming soon)*

### Operations
Keeping the system running safely and efficiently.
- *(Section reserved for future operational guides)*

### Product
Product vision and positioning (for evaluators and contributors).
- *(Section reserved for future product documentation)*

## About This Repo

This repository contains:
- **PayBlocks**: A block-based website builder using PayloadCMS and shadcn/ui blocks
- **LabKit**: Research-specific extensions (collections, templates) for academic lab websites

The research-specific features are built as add-ons on top of the base template. Eventually these may split into separate repositories.

## Documentation Philosophy

- **Guides** answer "How do I...?" questions with step-by-step instructions
- **Architecture** answers "Why does it work this way?" with explanations and context
- **Development** answers "How do I extend this?" with patterns and examples

Documentation should explain decisions, not just describe code. If you're reading this 6 months from now, you should understand not just what the code does, but why it was designed that way.
