# alert-dialog

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/alert-dialog.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/confirm-dialog.tsx`, `src/components/dashboard/confirm-dialog.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/alert-dialog.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Focus movement, dismissal, and positioning now follow Base UI behavior; verify the relevant overlay in context.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
