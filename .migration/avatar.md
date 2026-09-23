# avatar

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/avatar.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/hover-card-profile-5.tsx`, `src/components/ui/hover-card-profile-3.tsx`, `src/components/layout/nav-user.tsx`, `src/components/dashboard/nav-user.tsx`, `src/components/TeamMemberHoverCard/index.tsx`, `src/components/shadcnblocks/user-profile1.tsx`, `src/heros/PageHero/hero53.tsx`, `src/heros/PageHero/hero171.tsx`, `src/heros/PageHero/hero3.tsx`, `src/heros/PageHero/hero112.tsx`, `src/heros/PageHero/hero4.tsx`, `src/heros/PageHero/hero7.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/overview/components/recent-activity.tsx`, `src/app/_dashboard-kit/dashboard/(app)/(dashboard-1)/boards/overview/components/team-members.tsx`, `src/app/_dashboard-kit/dashboard/(app)/dashboard-2/components/recent-activity.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/[id]/page.tsx`, `src/app/_dashboard-legacy/dashboard/(app)/people/people-table.tsx`, `src/blocks/BlogPost/blogpost5.tsx`, `src/blocks/BlogPost/blogpost4.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/avatar.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
