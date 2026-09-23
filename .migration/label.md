# label

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/label.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/field.tsx`, `src/components/ui/form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/filters.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-deactivate-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/plan-detail.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/delete-actions.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/import/import-wizard.tsx`, `src/globals/Footer/footer/footer3.tsx`, `src/globals/Footer/footer/footer8.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/label.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
