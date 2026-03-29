# Forms and Form Submissions

How forms work in this project, and how to wire standalone form components to Payload's form-submissions system.

## How CMS-backed forms work

This project uses [`@payloadcms/plugin-form-builder`](https://payloadcms.com/docs/plugins/form-builder) which auto-creates two collections:

- **`forms`** — admins build form schemas in the Admin Panel (fields, validation, confirmation behavior, email notifications)
- **`form-submissions`** — every frontend submission is stored here, viewable in the Admin Panel

The data flow:

```
Admin Panel → creates form schema in `forms` collection
                      ↓
Page layout includes a Form block (relationship → forms)
                      ↓
FormBlock component renders fields from schema using react-hook-form
                      ↓
User submits → POST /api/form-submissions { form: id, submissionData: [...] }
                      ↓
Turnstile middleware verifies token (if configured)
                      ↓
Payload REST handler stores the submission in `form-submissions`
                      ↓
Confirmation message shown or redirect triggered
```

## Key files

| File | Purpose |
|------|---------|
| `src/payload.config.ts` (lines ~240–274) | Plugin registration, custom fields, overrides |
| `src/blocks/Form/config.ts` | Block schema — relationship to `forms` collection |
| `src/blocks/Form/Component.tsx` | Client component — renders form, handles submission |
| `src/blocks/Form/fields.tsx` | Maps `blockType` → React field component |
| `src/blocks/Form/buildInitialFormState.tsx` | Generates react-hook-form defaults from schema |
| `src/fields/formBuilder/telephone.ts` | Custom telephone field type for the form builder |
| `src/app/(payload)/api/[...slug]/route.ts` | Turnstile middleware on POST to `form-submissions` |

### Available field types

The form builder supports these field types (mapped in `src/blocks/Form/fields.tsx`):

`checkbox`, `country`, `email`, `message`, `number`, `select`, `state`, `text`, `textarea`, `telephone`

Payment is disabled in `payload.config.ts`.

## How forms appear on pages

The Form block is a **Pattern C utility block** (no design variants). It can be used:

1. **Standalone** — add a `formBlock` directly in the page layout
2. **Inside Contact block** — `ContactBlock` config has a `form` field (blocks array, max 1 row) that accepts a `formBlock`. The Contact variant renders it via `RenderBlocks`.
3. **Inside SplitView block** — `SplitViewBlock` can include a `formBlock` in its layout

## Turnstile bot protection

When `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set:

1. The `FormBlock` component renders a Cloudflare Turnstile widget and collects a token
2. The token is sent as a `cf-turnstile-token` header on the POST request
3. The catch-all API route (`src/app/(payload)/api/[...slug]/route.ts`) intercepts POSTs to `form-submissions` and verifies the token server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` using `NEXT_PRIVATE_TURNSTILE_SECRET_KEY`
4. If verification fails, the request is rejected with 400 before reaching Payload

**Required env vars:**
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (public, used on frontend)
- `NEXT_PRIVATE_TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server-side verification)

If neither is set, Turnstile is fully disabled and forms submit without bot protection.

## Standalone form components (not wired to Payload)

Several components in `src/components/` look like forms but are **not** connected to Payload:

- `contact10.tsx` — react-hook-form + Zod, submits to `console.log`
- `waitlist1.tsx`, `waitlist2.tsx`, `waitlist3.tsx` — plain HTML forms
- `wishlist1.tsx`, `wishlist2.tsx` — plain HTML forms

These are downloaded shadcnblocks UI components. They have their own hardcoded fields and validation but discard submissions by default.

## Wiring a standalone component to Payload form-submissions

There are two approaches to make a standalone form component store submissions in Payload:

### Approach A: Replace the component's form with a CMS-backed Form block

This is the standard approach. The standalone component becomes a Payload block variant, and its form fields are defined in the Admin Panel instead of hardcoded.

1. Convert the component to a Payload block (see `src/blocks/CLAUDE.md` and the payload-block-converter skill)
2. In the block's `config.ts`, add a `form` field with `type: 'blocks'` referencing `FormBlock`:
   ```typescript
   import { FormBlock } from '../Form/config'

   // inside the block's fields array:
   {
     name: 'form',
     type: 'blocks',
     blocks: [FormBlock],
     maxRows: 1,
   }
   ```
3. In the variant component, render the form via `RenderBlocks`:
   ```typescript
   import { RenderBlocks } from '@/blocks/RenderBlocks'

   // inside the component's JSX:
   {form && form[0]?.form && (
     <RenderBlocks blocks={form} publicContext={publicContext} disableContainer />
   )}
   ```
4. Create the form schema in the Admin Panel (Admin → Forms → Create)
5. Add the form to the page by selecting it in the block's form field

**Pros:** Fields are CMS-managed, confirmation behavior is configurable, emails can be sent on submission, Turnstile is automatic.

**Cons:** The form's visual style comes from `src/blocks/Form/Component.tsx` field components, not the original standalone component's design.

### Approach B: POST directly to `/api/form-submissions` from the component

Keep the component's hardcoded fields and visual design, but wire the submit handler to Payload.

1. Create a form in the Admin Panel that matches the component's fields (same field names)
2. Note the form's ID from the Admin Panel
3. In the component, replace the submit handler to POST to Payload:
   ```typescript
   const handleFormSubmit = async (data: FormData) => {
     const submissionData = Object.entries(data).map(([name, value]) => ({
       field: name,
       value,
     }))

     const res = await fetch('/api/form-submissions', {
       method: 'POST',
       headers: { 'Content-Type': 'application/json' },
       body: JSON.stringify({
         form: 'THE_FORM_ID',  // from Admin Panel
         submissionData,
       }),
     })

     if (!res.ok) {
       const error = await res.json()
       throw new Error(error.errors?.[0]?.message || 'Submission failed')
     }
   }
   ```
4. If Turnstile is enabled, you must also add the `react-turnstile` widget and send the `cf-turnstile-token` header (see `src/blocks/Form/Component.tsx` for the pattern)

**Pros:** Preserves the component's original visual design.

**Cons:** Field names are hardcoded — if someone renames a field in the Admin Panel form, submissions break silently. No CMS-managed confirmation behavior. Must manually handle Turnstile.

### Which approach to use

- **Approach A** when the form's visual style doesn't need to match a specific design, or when you want full CMS control over fields and behavior
- **Approach B** when the component has a specific visual design that must be preserved and you just need the data stored in Payload

## Adding a new field type to the form builder

To add a custom field type (like the existing `telephone` field):

1. Create the Payload Block definition in `src/fields/formBuilder/` (see `telephone.ts` for the pattern — define `name`, `label`, `width`, `defaultValue`, `required` fields)
2. Register it in `src/payload.config.ts` under `formBuilderPlugin({ fields: { myField: MyField } })`
3. Create a React field component in `src/blocks/Form/` (see existing field components for the pattern)
4. Register the component in `src/blocks/Form/fields.tsx`
5. Add initial state handling in `src/blocks/Form/buildInitialFormState.tsx`
6. Run `pnpm generate:types`

## Further reading

- [Payload Form Builder Plugin docs](https://payloadcms.com/docs/plugins/form-builder) — full upstream reference
- [Payload form builder example repo](https://github.com/payloadcms/payload/tree/main/examples/form-builder) — official example
- `src/blocks/CLAUDE.md` — block pattern conventions (Form block is Pattern C)
