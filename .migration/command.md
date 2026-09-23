# command

2026-09-23; engine; migrated to Base UI.

## Changed

- `src/components/ui/command.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/search/Component.tsx`, `src/components/command-menu.tsx`, `src/components/dashboard/command-menu.tsx`, `src/components/dashboard/data-table/faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/team-members.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/profile/profile-form.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/command.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
