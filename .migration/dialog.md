# dialog

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/dialog.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/command.tsx`, `src/heros/PageHero/hero171.tsx`, `src/heros/PageHero/hero101.tsx`, `src/heros/PageHero/hero112.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/view-all-routes.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/view-all-referrers.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/components/create-api-key-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-action-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-invite-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-detail-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/add-new-card.tsx`, `src/globals/Footer/footer/footer18.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/dialog.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
