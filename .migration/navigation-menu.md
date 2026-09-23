# navigation-menu

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/navigation-menu.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/LanguageSwitcher/index.tsx`, `src/globals/Header/navbar/navbar1.tsx`, `src/globals/Header/navbar/navbar3.tsx`, `src/globals/Header/navbar/navbar5.tsx`, `src/globals/Header/navbar/navbar4.tsx`, `src/globals/Header/navbar/blocks/CategoryGrid.tsx`, `src/globals/Header/navbar/blocks/SimpleLinks.tsx`, `src/globals/Header/navbar/blocks/CardGrid.tsx`, `src/globals/Header/navbar/blocks/FeatureList.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/navigation-menu.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

- Base UI uses its own open-state timing and panel positioning; check hover and click transitions. DIAL keeps the prototype’s instant panel motion.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
