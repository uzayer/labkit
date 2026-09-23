# sheet

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/sheet.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/search/Component.tsx`, `src/components/ui/sidebar.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/components/mutate-webhook.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-mutate-drawer.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/subscribe-drawer.tsx`, `src/globals/Header/navbar/navbar1.tsx`, `src/globals/Header/navbar/navbar5.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/sheet.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
