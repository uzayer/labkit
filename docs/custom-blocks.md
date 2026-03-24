# Custom Blocks
Learn how to add and modify blocks in LabKit to match your specific needs.

LabKit can be customized to your specific needs, while still maintaining the flexibility to upgrade. The following approaches are possible:

Take an existing block of an existing category (like FEATURE or ABOUT), copy it and rename it (e.g. feature53-custom-1), then extend it. (see Editing Existing Blocks)
Use our already prepared CustomBlock category and add your own blocks here (src/blocks/CustomBlock/). They will be later in the page builder grouped under CustomBlocks.
Add your own block category and have full control over data schema and react component. (src/blocks/MyNewCategory/)
## Updates
LabKit is now maintained as your own product codebase. If you still want to track upstream template updates, fork and sync carefully. Otherwise, treat this repository as the source of truth and customize blocks directly.

## Code Structure
All block components can be modified to meet specific needs:

- Hero Blocks: `src/heros/PageHero/`
- Layout Blocks: `src/blocks/`
- Header: `src/globals/Header/navbar`
- Footer: `src/globals/Footer/footer`
For easy upgrades, consider duplication before modification (see Editing Existing Blocks).

## Block Components Structure
```text
src/blocks/
├── CustomBlock/           # Prepared CustomBlock category
│   ├── config.ts            # Config for all CustomBlocks
│   ├── index.tsx            # Main rendering component for the custom block category
│   ├── customService1.tsx
│   └── customService2.tsx
│    
├── Cta/                  # Example existing block
│   ├── Component.tsx     # Main component
│   ├── config.ts        # Block configuration
│   ├── cta1.tsx         # Variant 1
│   ├── cta2.tsx         # Variant 2
│   └── cta-custom.tsx   # Your custom variant
└── RenderBlocks.tsx     # Main rendering component. All block category rendering components are imported here
```

## Editing Existing Blocks
To maintain upgradeability, duplicate the block before modifying. As an example we want to edit the `FEATURE53` block:

1. Duplicate the file `src/blocks/Feature/feature53.tsx` to `src/blocks/Feature/feature53-custom-1.tsx`.
2. Extend the const `allFeatureDesignVersions` in `src/blocks/Feature/config.tsx` with the new design version `FEATURE53-CUSTOM-1`.
3. Open `src/blocks/Feature/Component.tsx`, import your new block, and extend the features design version to the React component mapping:

```ts
...
import Feature53Custom1 from '@/blocks/Feature/feature53-custom-1'
...

const features: Feature = {
  ...
  FEATURE52: Feature52,
  FEATURE53: Feature53,
  FEATURE53-CUSTOM-1: Feature53Custom1,
  FEATURE54: Feature54,
  ...
}
```

By following this approach and suffixing your design versions with `-CUSTOM-1`, `-CUSTOM-2`, etc., you will avoid naming conflicts and reduce merge conflicts if you later decide to bring in upstream template updates. Make sure that Payload is running in dev mode, as new types need to be generated after adding the new design version.

## Adding a new block to CustomBlocks
The existing `CustomBlock` category is an easy way to add a new block. We recommend this approach when you have just a few blocks to add, because they will all be grouped together in the page builder. That can be a bit confusing for users when you have a large number of blocks. This is an alternative to grouping your own blocks under a real category like `FEATURE`, `ABOUT`, `HERO`, or your own custom category.

- Modify the existing `src/blocks/CustomBlock/config.ts` with the payload config for your block.
- Create a new file in `src/blocks/CustomBlock/serviceBlockCustom1.tsx` with the React component for your block.
- Add the new block to the `index.tsx` file under the `CustomBlock` category so that it gets rendered:

```ts
import ServiceBlockCustom1 from './serviceBlockCustom1'

const customBlocks: { [key: string]: React.FC<any> } = {
  SERVICEBLOCKCUSTOM1: ServiceBlockCustom1,
}

export default customBlocks
```

## Create a new block category (Advanced)
Approach 3 is for users with more experience in Next.js and Payload. We can not provide support for React or Payload config in this approach. Best starting point would be to look at the existing blocks and check out the payload docs.

The files you need to create or modify are:
- Create a new folder in `src/blocks/` with your block type.
- Create a new file in `src/blocks/<BlockCategory>/config.ts` with the payload config for your block type.
- Create a new file in `src/blocks/<BlockCategory>/Component.tsx` with the React component for your block.
- Extend the layout blocks in `src/collections/Pages/index.ts` with your new payload block type config.
- Extend the `blockComponents` in `src/blocks/RenderBlocks.tsx` with your new React component. Make sure to use the slug of your block as the key of your component in the `blockComponents` mapping object.
