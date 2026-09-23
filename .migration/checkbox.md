# checkbox

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/checkbox.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/components/mutate-webhook.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/filters.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-columns.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/payments.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-columns.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/notifications/notifications-form.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/settings/settings-form.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/import/[runId]/run-detail.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/checkbox.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
