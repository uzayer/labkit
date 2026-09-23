# toast

2026-09-23; engine; migrated to Base UI.

## Changed

- `src/components/ui/toast.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/toaster.tsx`, `src/app/_dashboard-kit/layout.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/toast.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Toast state now uses Base UI toast manager through the existing compatibility hook.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
