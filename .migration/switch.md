# switch

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/switch.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/app/_dashboard-kit/dashboard/(app)/users/[id]/components/user-detail-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/notifications/notifications-form.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/people/people-table.tsx`, `src/globals/Footer/footer/footer18.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/switch.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
