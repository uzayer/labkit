# tooltip

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/tooltip.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/copy-button.tsx`, `src/components/custom-sidebar-trigger.tsx`, `src/components/long-text.tsx`, `src/components/ui/sidebar.tsx`, `src/components/dashboard/long-text.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/filters.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/logs-toolbar.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-stats.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/analytics/components/stats-card.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/stats.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/tooltip.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
