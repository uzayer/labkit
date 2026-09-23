# tabs

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/tabs.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/heros/PageHero/hero195.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/route-view.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/referrers.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/analytics/components/traffic-source-card.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/analytics/components/sales-card.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/analytics/components/visitors-card.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/[id]/page.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/review/review-table.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/people/people-table.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/tabs.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Base UI keyboard activation may differ from Radix; verify arrow-key selection.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
