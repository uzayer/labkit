# collapsible

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/collapsible.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/collapsible-standard-3.tsx`, `src/components/ui/collapsible-sidebar-3.tsx`, `src/components/layout/nav-group.tsx`, `src/components/dashboard/nav-group.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/filters.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/collapsible.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
