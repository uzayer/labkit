# LabKit

LabKit is a powerful website builder that combines the best of two worlds: PayloadCMS's robust content management capabilities and shadcnblocks' extensive UI component library. The name "LabKit" reflects this fusion - "Pay" from PayloadCMS and "Blocks" from shadcnblocks.

This project transforms the traditional PayloadCMS starter into a feature-rich website builder with a beautiful, modern UI and an extensive collection of pre-built components. Whether you're building a corporate website, a portfolio, or a complex web application, LabKit provides all the building blocks you need.

The docs for this repo are located here: [LabKit Docs](https://docs.shadcnblocks.com/payload/getting-started/)

## ✨ Key Features

- 🎨 **Rich Component Library**
  - Extensive collection of pre-built blocks from shadcnblocks
  - Multiple variants for each component type:
    - 5+ FAQ layouts
    - 15+ CTA designs
    - 6+ Gallery layouts
    - Various form components
  - All components are fully customizable and responsive

- 🔒 **Enhanced Security**
  - Cloudflare Turnstile integration for form protection
  - Secure authentication system
  - Login with Google
  - Role-based access control

- 🚀 **Advanced Features**
  - Layout Builder with drag-and-drop functionality
  - Live Preview for real-time content editing
  - Draft Preview system
  - SEO optimization tools
  - Redirects management
  - Advanced form builder with various field types

- 💻 **Developer Experience**
  - Built with Next.js and TypeScript
  - Shadcn/ui integration for consistent UI components
  - MongoDB/PostgreSQL database support
  - Email integration with Nodemailer
  - Cloud storage with Vercel Blob

## Quick Start

To spin up this project locally, follow these steps from our [Shadcnblocks Payload CMS boilerplate docs](https://docs.shadcnblocks.com/payload/getting-started/)

If you are stuck, feel free to open a Issue in this repo for things that are related especially to this boilerplate. For general payload CMS problems we recommend to consult the [official Payload CMS](https://payloadcms.com/docs/getting-started/what-is-payload) docs or search/open a issue in the [Payload CMS repo](https://github.com/payloadcms/payload/issues).

## Release Automation Status

Changesets and release workflows are currently paused while LabKit is prepared for its first major release.

- Archived workflows live in `.github/workflows-archive/`.
- To re-enable, move `release.yml` and `validate-changesets.yml` back to `.github/workflows/`.
