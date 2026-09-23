# select

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/select.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/select-dropdown.tsx`, `src/components/calendar-date-picker.tsx`, `src/components/dashboard/data-table/pagination.tsx`, `src/providers/Theme/ThemeSelector/index.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/overview/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/filters.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-pagination.tsx`, `src/app/_dashboard-kit/dashboard/(app)/dashboard-2/components/revenue-chart.tsx`, `src/app/_dashboard-kit/dashboard/(app)/dashboard-2/components/recent-activity.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-pagination.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/sidebar-nav.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/general-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/profile/profile-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/billing/billing-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/subscribe-drawer.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/select.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
