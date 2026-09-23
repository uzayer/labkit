# accordion

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/accordion.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/LanguageSwitcher/index.tsx`, `src/heros/PageHero/hero20.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/connected-apps/components/connect-app-form.tsx`, `src/globals/Header/navbar/navbar1.tsx`, `src/globals/Header/navbar/navbar5.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/accordion.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
