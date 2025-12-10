# payblocks

## 2.10.0

### Minor Changes

- 2e78b09: Adding frontend search functionality, that can be enabled or disabled via the header settings. Improving the hooks to sync more content from pages and posts to the search plugin collection to improve search results

## 2.9.0

### Minor Changes

- 877bada: Upgrading Next.js and Payload CMS to 3.59.1
- d949e39: Adding clean selection of OpenGraph image for different languages. Improving types with a typeguard
- 9a01a7f: Moving to the more recent admin bar package from payload. Disable admin bar when draft mode is not active. This prevents API calls on regular page loads.

### Patch Changes

- d814444: Improving the SectionSelect component by just conditionally fetching the selected page to get the sections. No longer fetching ALL pages on the server component part. Adding typescript types as well

## 2.8.0

### Minor Changes

- af144fc: Upgrade Payload CMS to 3.57 and Next.js to 15.5.4

### Patch Changes

- af144fc: Fixing the preview secret, removing not needed env variables. Make sure, that you have the NEXT_PRIVATE_DRAFT_SECRET set now
- af144fc: Improving the slug field, making it more stable to use, as we prevent the auto-overwrite of existing slugs

## 2.7.0

### Minor Changes

- 99caf6c: Added Gallery 7 block.
- b7e6b11: added testimonial block 7 and 14

### Patch Changes

- 99caf6c: changed image with icon and added icon color select options
- da56546: Fixing the getGlobals function (for header, footer, page-config) to respect the locale flag. Adding Open Graph image with localization.

## 2.6.0

### Minor Changes

- 9bd3a78: Added phone input field to the form builder and color text state plugin for richtext
- 6e02394: added CTA 12 block

### Patch Changes

- b9261d2: adding support for cloud media plugin with absolute URLs
- a2b1cf3: fixing permissions no longer working for editor after upgrade
- db65c28: Adding custom props to disable icon and label to link group

## 2.5.1

### Patch Changes

- 785519a: version bump to 3.52 and minor cleanups

## 2.5.0

### Minor Changes

- 0f57b37: added new block - logos9
- 63b8ccb: added new block - feature250
- 97a0845: added new block - hero219

### Patch Changes

- 04a1f33: running prettier on all files and adding prettierrule for tailwind

## 2.4.0

### Minor Changes

- 662af2f: added new block - feature105
- 767da45: richtext: support image upload and media block with more settings
- 222615f: added new block - banner 1
- 4049440: added new block - hero101
- 91b7dda: Login3 and Signup4 added. Support for authentication with payload. This change is adding full support to login and signup directly with payload as auth provider. We support login with Google as well. We offer a very flexible way to add a signup block to the login block as well.
- d1250e9: added new block - feature 159
- 02abea1: Improving the icon render component to allow code splitting and only load icons actually used. Improve the bundle size of first load js
- 9a6cc13: added new block - logos 1

### Patch Changes

- 91b7dda: deleting the no longer needed, old upstream folder of shadcnblocks.com

## 2.3.0

### Minor Changes

- 70ceeae: adding hero220
- 5011580: Added new blocks Hero214, Gallery25 and Gallery26. Supporting descriptions for blocks to add more context to the design version.

### Patch Changes

- 4577110: Fix the drawer for design preview when multiple blocks are on the same page

## 2.2.0

### Minor Changes

- 3cd77dd: adding our new logo for payblocks. Showing also admin panel customisation in that way.
- 4e72c3e: Added new blocks:- Hero195, Banner5, Casestudies5, Timeline2 and Timeline8

## 2.1.0

### Minor Changes

- b51a0fb: integrated cta6 and feature57 with payload cms
- 23a2d4c: Adding blog29 with dynamic data fetching

### Patch Changes

- 062a94f: Version bump nextjs and payload cms

## 2.0.0

### Major Changes

- df2e714: Upgraded Tailwind to v4.1.6

### Minor Changes

- 97c3148: Adding blogContent 20+18 and dynamic rendering structure to support posts. This is the first of several updates coming for blogs

## 1.10.0

### Minor Changes

- 3153929: Adding a fully dynamic navbar4 component that can be configured with a dynamic block structure

## 1.9.0

### Minor Changes

- 28b9ea5: Feature114 added

### Patch Changes

- 920ab7c: upgrade payload to 3.34.0 and nextjs to 15.3.0

## 1.8.0

### Minor Changes

- 74d3634: Adding hero112 and the new design version preview for all existing heros

### Patch Changes

- fbb2aeb: Fixing the language switcher sizing by allowing it to be set similar to the button sizes
- 70dc4c6: version bump to payload 3.32

## 1.7.0

### Minor Changes

- 2fb41fc: A new custom component to select the block design version in a visual way in a modal
- 3ef049b: Adding Gallery5
- d55d305: Moving design version preview to a drawer + using more official payload CSS classes to better support dark mode

## 1.6.0

### Minor Changes

- 31f7132: Adding functionality to the permissions system. This allows fine-granular access to certain payload functionality on group level.

### Patch Changes

- 1df4fcb: Hide the roles field in the create user screen
- 59c5706: Version bump of all packages
- 1fdbf1e: upgrading all packages, next, payload and deps to the most recent version

## 1.5.0

### Minor Changes

- df51984: Move dump file to public folder and adapt to new backup version. Also add media seeding.
- 4f859d5: update seed description and remove NEXT_PUBLIC_DEMO_DASHBOARD_CREDENTIALS from .env.example
- 9db5bfa: Add functionality to backup media files

### Patch Changes

- 1040aef: patching static params for more efficient fetching and fixing split view item positioning to be centered

## 1.4.0

### Minor Changes

- b5f7bb4: Minor cleanup for users collection / access functions and making sure, that editor users can't edit other users.
- 8509792: Adding changelog1 including functionality to fetch changelog items from github.
- c305e1e: Adding FAQ5 and fixing the selection of faqs in the admin ui
- 0be7bd1: Remove not implemented blocks from dropdown
- df2be8a: Add language switcher to mobile navi 1 and 5
- d301083: Add demo login user credentials

### Patch Changes

- a221118: Fix backups: move from json to bson. Sorting backups by uploadedAt.
- d4b3feb: make the initial user / role creation more solid, printing the error logs better and giving payload more time to initialise the database before role creation and retry one time on failure
- 26918cb: improve docs and move them to the shadcndocs project
- 7d51afd: Fix icon usage and making it more safe to use for the future

## 1.3.0

### Minor Changes

- f8617b1: Adding contact2 with real contact form data adding the support for newlines in lexical editor, fixing font issue for faq1
- 0e0bb7f: Move Seeding from Backups into own custom header
- b2e98c5: upgrading pacakges and adding resend email adapter

### Patch Changes

- de04d5f: Updating nextjs and packages
- 3187c97: Fix the redirect loop on 404 page by moving the not-found page to the root of the app.
- d5c644d: The redirects where not used as we did throw a notFound before that. Redirects got some more explanation to improve the user UX as well

## 1.2.0

### Minor Changes

- b2edb25: Adding support for the form builder to be added to a splitview (changing withoutWrapper to existing property disableContainer).
  Adding asterisks to required fields in form fields.
- c3f3770: Adding multi-slug routing like /a/b/c with nested doc support.

  In detail this adds the following features & fixes:
  Feat: multi-slug app routing
  Feat: multi-slug support in CMSLink
  Feat: multi-slug support in Breadcrumb Link
  Feat: multi-slug support in revalidatePage
  Fix: locales in revalidatePage
  Fix: breadcrumb locale
  Fix: breadcrumb next/link usage
  Feat: multi-slug support in lang switcher
  Feat: multi-slug support in generate static props
  Feat: multi-slug support in preview mode

### Patch Changes

- 0555e7a: moving the NEXT_PUBLIC_SERVER_URL generation out of next conf as this is not working reliably on vercel and is not so clean.
  Making sure, that the URL works both client and server side. Moving form submission to relative path.

## 1.1.0

### Minor Changes

- acd1f7e: Adding the nested docs plugin to pages collection + breadcrumb component + automatic breadcrumb generation + enable or disable breadcrumb on page level
