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
Frontend integration renders fields from a form schema
                      ↓
User submits → POST /api/form-submissions { form: id, submissionData: [...] }
                      ↓
Rate limit, honeypot, and Turnstile middleware verify the request
                      ↓
Payload REST handler stores the submission in `form-submissions`
                      ↓
Confirmation message shown or redirect triggered
```

## Key files

| File | Purpose |
|------|---------|
| `src/payload.config.ts` (lines ~240–274) | Plugin registration, custom fields, overrides |
| `src/fields/formBuilder/telephone.ts` | Custom telephone field type for the form builder |
| `src/app/(payload)/api/[...slug]/route.ts` | Bot-protection middleware on POST to `form-submissions` |

### Available field types

The form builder supports these field types; a future frontend renderer must map them to its own inputs:

`checkbox`, `country`, `email`, `message`, `number`, `select`, `state`, `text`, `textarea`, `telephone`

Payment is disabled in `payload.config.ts`.

## Rendering forms on pages

The former page-builder `FormBlock` was removed. There is no shipped public form renderer today; a future frontend integration must render the form schema and submit to the protected endpoint described below.

## Form bot protection

Production form submissions require both Turnstile variables:

1. The frontend renders a Cloudflare Turnstile widget and collects a token.
2. The token is sent as a `cf-turnstile-token` header on the POST request.
3. The catch-all API route (`src/app/(payload)/api/[...slug]/route.ts`) intercepts POSTs to `form-submissions` and verifies the token server-side against `https://challenges.cloudflare.com/turnstile/v0/siteverify` using `NEXT_PRIVATE_TURNSTILE_SECRET_KEY`.
4. If verification fails, the request is rejected with 400 before reaching Payload.

**Required env vars:**
- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare Turnstile site key (public, used on frontend)
- `NEXT_PRIVATE_TURNSTILE_SECRET_KEY` — Cloudflare Turnstile secret key (server-side verification)

If either is missing, the application logs a startup warning and the public form-submissions endpoint returns `503` in production. Development submissions remain available so local integrations can be built without Cloudflare credentials.

Every request is also limited to five submissions per minute per client IP. This is an in-process safeguard, so Turnstile remains the required protection for horizontally scaled production deployments.

For direct integrations, send a hidden `website` field as an empty value in `submissionData`. A non-empty value is treated as a honeypot hit and rejected. The former page-builder `FormBlock` no longer exists; any new form UI must render this field itself.

### Deployment checklist

- Configure both Turnstile keys in every production environment; missing keys intentionally disable public form submissions.
- Keep the `website` honeypot visually and programmatically hidden from people, but do not use `display: none` alone when building a renderer because many bots skip it.
- Treat the built-in rate limit as burst protection only. If submissions are ever served by multiple instances without Turnstile, add a shared rate-limit store before accepting public traffic.

## Standalone form components (not wired to Payload)

Several components in `src/components/` look like forms but are **not** connected to Payload:

- `contact10.tsx` — react-hook-form + Zod, submits to `console.log`
- `waitlist1.tsx`, `waitlist2.tsx`, `waitlist3.tsx` — plain HTML forms
- `wishlist1.tsx`, `wishlist2.tsx` — plain HTML forms

These are downloaded shadcnblocks UI components. They have their own hardcoded fields and validation but discard submissions by default.

## Wiring a standalone component to Payload form-submissions

There are two approaches to make a standalone form component store submissions in Payload:

### Approach A: Build a CMS-backed frontend renderer

This is the standard approach. The standalone component becomes a Payload block variant, and its form fields are defined in the Admin Panel instead of hardcoded.

1. Create the form schema in the Admin Panel (Admin → Forms → Create).
2. Build a frontend renderer for that schema and submit its values to `/api/form-submissions`.
3. Render Turnstile and the empty `website` honeypot field as described above.

**Pros:** Fields remain CMS-managed and confirmation behavior is configurable.

**Cons:** A renderer has to be built for the desired visual design.

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
4. In production, add a `react-turnstile` widget and send its token in the `cf-turnstile-token` header. Also include an invisible `website` input and send it as an empty `submissionData` value.

**Pros:** Preserves the component's original visual design.

**Cons:** Field names are hardcoded — if someone renames a field in the Admin Panel form, submissions break silently. No CMS-managed confirmation behavior. Must manually handle Turnstile.

### Which approach to use

- **Approach A** when the form's visual style doesn't need to match a specific design, or when you want full CMS control over fields and behavior
- **Approach B** when the component has a specific visual design that must be preserved and you just need the data stored in Payload

## Adding a new field type to the form builder

To add a custom field type (like the existing `telephone` field):

1. Create the Payload Block definition in `src/fields/formBuilder/` (see `telephone.ts` for the pattern — define `name`, `label`, `width`, `defaultValue`, `required` fields)
2. Register it in `src/payload.config.ts` under `formBuilderPlugin({ fields: { myField: MyField } })`
3. Update the frontend form renderer when one exists.
4. Run `pnpm generate:types`.

## Further reading

- [Payload Form Builder Plugin docs](https://payloadcms.com/docs/plugins/form-builder) — full upstream reference
- [Payload form builder example repo](https://github.com/payloadcms/payload/tree/main/examples/form-builder) — official example
