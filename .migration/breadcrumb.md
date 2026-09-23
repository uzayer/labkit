# breadcrumb

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/breadcrumb.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/Breadcrumbs/index.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/overview/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/[id]/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/[id]/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/[id]/page.tsx`, `src/blocks/CaseStudy/casestudy3.tsx`, `src/blocks/BlogPost/blogpost5.tsx`, `src/blocks/BlogPost/blogpost4.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/breadcrumb.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
