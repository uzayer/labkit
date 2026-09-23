# popover

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/popover.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/date-picker.tsx`, `src/components/calendar-date-picker.tsx`, `src/components/long-text.tsx`, `src/components/ui/popover-standard-14.tsx`, `src/components/dashboard/long-text.tsx`, `src/components/dashboard/data-table/faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/team-members.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/profile/profile-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/add-new-card.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/popover.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
