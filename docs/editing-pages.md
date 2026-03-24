# Editing Pages

The LabKit page builder and theme customizations

LabKit leverages Shadcnblocks to enable a flexible and composable page-building experience. By combining Shadcnblocks with Payload CMS in LabKit, you can rapidly build and manage pages without writing code, then fine-tune the design and functionality through CMS theme customization or by editing the code directly. This streamlined approach ensures a flexible yet maintainable workflow for evolving your site’s UI.

> [i copied this from the web, it's supposed to be a photo of the admin panel called Admin Panel Demo right here]

Add and order any number of Shadcnblocks into the pages content. Each block has editable fields that provide data to the component props in Nextjs.

## Pages Collection

Each page in the CMS consists of multiple content/layout blocks and a single hero block. The rendering process in Next.js follows a structured order:

1. The hero block is rendered first.
2. Layout blocks are then rendered in the order defined in the admin panel.

## Page Structure

- Each page can have a unique hero block.
- Layout blocks are selected from available Shadcn Blocks.
- Users can add layout blocks via “Content” > “Add Layout,” selecting a block type (e.g., “Feature”) and a design version (e.g., “FEATURE53”).
- Changing the design version updates the CMS form fields dynamically.
- Available block types and design versions align with the Shadcnblocks Overview.

## Page Configuration

- Define the slug used for the page URL.
- For nested URLs (e.g., `/parent-slug/current-slug/`), assign a parent page.
- Configure SEO settings under the “SEO” tab for meta tags and Open Graph data.
- Start creating a page by launching the project in dev mode and visiting:
  - `http://localhost:3000/admin/collections/pages/create`

## Global Header & Footer

The header and footer are globally configured and persist across all pages.

- The header is always visible and can be edited at:
  - `http://localhost:3000/admin/globals/header`
- The footer is always visible and can be edited at:
  - `http://localhost:3000/admin/globals/footer`

## Limitations & Workarounds

Not all Shadcn Blocks are currently available in the CMS page builder, and can therefore be selected under design version. However, their code is available in `src/blocks/` for manual implementation. Refer to the Custom Blocks section for instructions on adding them.

## Customization

### Theming

Shadcn UI provides extensive theme customization options:

- Modify CSS variables via CMS at:
  - `http://localhost:3000/admin/globals/themeConfig`
- Use predefined Shadcn UI themes or define custom colors.
- Utilize preview mode with the Theme Editor checkbox enabled to adjust colors in real-time.
- After making changes, manually copy values from the preview to CMS inputs.

### Fonts

Open the layout file in `src/app/(frontend)/[[...slugs]]/layout.tsx` and change the mono and sans font variable. Import the new desired font in the `next/font/google` import.

For example, a change to `Fira_Mono` and `Roboto` fonts would look like this:

```ts
import { Roboto, Fira_Mono } from 'next/font/google'

...

const mono = Fira_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500', '700'],
})
const sans = Roboto({
  subsets: ['latin'],
  variable: '--font-sans',
  weight: ['400', '500', '700'],
})
```

## Resources

- Shadcn Blocks
- Shadcn UI
- Payload CMS
- Shadcn UI Themes