# form

2026-09-23; engine; migrated to Base UI.

## Changed

- `src/components/ui/form.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/select-dropdown.tsx`, `src/app/_dashboard-kit/dashboard/(auth)/login/components/user-auth-form.tsx`, `src/app/_dashboard-kit/dashboard/(auth)/forgot-password/components/forgot-password-form.tsx`, `src/app/_dashboard-kit/dashboard/(auth)/register/components/register-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/webhooks/components/mutate-webhook.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/components/create-api-key-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-action-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/users-invite-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/[id]/components/user-detail-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/tasks-mutate-drawer.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/general-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/profile/profile-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/notifications/notifications-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/billing/billing-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/subscribe-drawer.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/add-new-card.tsx`, `src/app/_dashboard-legacy/dashboard/(auth)/login/page.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/settings/settings-form.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/form.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
