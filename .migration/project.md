# LabKit root Base UI migration

2026-09-23; complete project migration to shadcn `base-nova`.

## Changed

- `components.json`: set `base-nova` so future shadcn downloads use Base UI.
- `package.json` and lockfile: added `@base-ui/react`, removed direct Radix dependencies.
- Replaced stock shadcn wrappers and migrated their consumers, including composition props (`asChild` to `render`) and link semantics.
- Removed unused stock shadcn components rather than carrying dead wrappers forward.
- Direct Radix wrapper scan: 0 remain.

- Verification: `bun run tsc`, `bun run lint`, and `bun run build` passed in the original directory. The root build used temporary generated secrets because local demo values do not meet production length checks.

## Left alone

- Independent libraries (where present): cmdk, Vaul, Sonner, React Day Picker, and charts.
- The parked root dashboard folders remain intact; DIAL fixture data remains a prototype.

## Behavior changes

- Overlay focus, menu selection, and navigation-menu timing follow Base UI. DIAL navigation timing was adjusted to preserve its existing interaction.
- The root app adopts the requested `base-nova` stock styling.

## Verify by hand

- Test menu keyboard navigation, dialogs, selects, and sidebar expansion on their pages.
- Review the root app’s new stock component appearance before launching the DIAL route port.
