# dropdown-menu

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/dropdown-menu.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/theme-switch.tsx`, `src/components/layout/team-switcher.tsx`, `src/components/layout/nav-user.tsx`, `src/components/dashboard/nav-user.tsx`, `src/components/dashboard/data-table/view-options.tsx`, `src/components/dashboard/data-table/column-header.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/components/data-table-column-header.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/[id]/components/webhook-detail-actions.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/route-view.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/logs-actions.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-row-actions.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-column-header.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-view-options.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/payments.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-row-actions.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-column-header.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-view-options.tsx`, `src/globals/Footer/footer/footer18.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/dropdown-menu.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
