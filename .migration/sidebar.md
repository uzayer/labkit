# sidebar

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/sidebar.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/custom-sidebar-trigger.tsx`, `src/components/layout/team-switcher.tsx`, `src/components/layout/nav-user.tsx`, `src/components/layout/app-sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/layout/nav-group.tsx`, `src/components/dashboard/nav-user.tsx`, `src/components/dashboard/app-sidebar.tsx`, `src/components/dashboard/header.tsx`, `src/components/dashboard/nav-group.tsx`, `src/app/_dashboard-kit/dashboard/(app)/layout.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/layout.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/sidebar.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
