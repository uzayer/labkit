# Contact (`/contact`)

Evergreen — no time-sensitive content (recruitment and current openings live on `/join-us`). For collaborators, media, and general enquiries.

---

## 1. Contact — info + form

**Block: `contact1`** (install: `npx shadcn add @shadcnblocks/contact1`)

Split layout: info sidebar left, form right. No map — DIAL is not a walk-in location; the address is for institutional reference only.

### Info sidebar (left column)

- Section heading: "Get in touch"
- Brief line: "For collaboration, media, and general enquiries." (1 sentence, not a paragraph)
- Nova's email as a prominent `mailto:` link — primary contact method
- Office address as plain text: SAC 1060, North South University, Dhaka, Bangladesh
- Google Scholar profile link
- Relevant social links from LabInfo global (e.g. GitHub, ResearchGate if present)
- Signpost to `/join-us`: "Looking to join the lab? See open positions →" — plain text + link, not a button; sits below the social links

**Data source:** LabInfo global (email, address, social links).

### Form (right column)

Fields: Name, Email, Message. Submit button. No phone field — labs don't publish one.

Wired to Payload `form-submissions` collection. Frontend must send a `cf-turnstile-token` header when `NEXT_PUBLIC_TURNSTILE_SITE_KEY` is set — see the Turnstile middleware in `src/app/(payload)/api/[...slug]/route.ts`.

**Data source:** Payload Forms collection for submission handling; see `@docs/guides/forms.md`.

### Adaptations from `contact1`

- Remove any map or location-picker elements
- Remove phone number
- Left column content replaced entirely with DIAL info sidebar (above)
- `/join-us` signpost sits at the bottom of the left column — plain text + link only, no CTA block
