# separator

2026-09-23; golden pair via CLI; migrated to Base UI.

## Changed

- `src/components/ui/separator.tsx`: replaced the Radix primitive with the Base UI implementation while retaining the component export.
- Consumer sweep: `src/components/ui/field.tsx`, `src/components/ui/hover-card-profile-5.tsx`, `src/components/ui/popover-standard-14.tsx`, `src/components/ui/sidebar.tsx`, `src/components/layout/header.tsx`, `src/components/dashboard/header.tsx`, `src/components/TeamMemberHoverCard/index.tsx`, `src/components/dashboard/data-table/faceted-filter.tsx`, `src/heros/PageHero/hero45.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/api-keys/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/overview/page.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/import-dialog.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/route-view.tsx`, `src/app/_dashboard-kit/dashboard/(app)/developers/events-&-logs/components/referrers.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/users/[id]/components/user-detail-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/tasks/components/data-table-faceted-filter.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/plan-detail.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/content-section.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/components/general-form.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/plans/components/subscribe-drawer.tsx`, `src/app/_dashboard-kit/dashboard/(app)/settings/connected-apps/components/connect-app-form.tsx`, `src/globals/Footer/footer/footer1.tsx`, `src/globals/Footer/footer/footer4.tsx`, `src/blocks/CaseStudy/casestudy3.tsx`, `src/blocks/BlogPost/blogpost5.tsx`, `src/blocks/BlogPost/blogpost4.tsx`; updated composition props and link semantics where needed.
- Leftover scan: `rg "radix-ui|@radix-ui" src/components/ui/separator.tsx` returns no matches.

## Left alone

cmdk, Vaul, Sonner, React Day Picker, and charts are independent libraries and were left in place.

## Behavior changes

None identified.

## Verify by hand

Open a page using this component; exercise click, keyboard focus, Escape or selection where relevant, and inspect the visual state.
