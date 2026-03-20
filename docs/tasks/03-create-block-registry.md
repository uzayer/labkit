# Create Block Registry

**Priority:** Medium — helps track progress on block conversion
**Area:** Blocks

## Context

Blocks are being downloaded from shadcnblocks.com and converted into registered Payload blocks. There's no single place tracking which blocks exist, their status, and which pages they're planned for.

## Tasks

- [ ] Audit `src/blocks/` — list every registered block with its design versions
- [ ] Audit `src/heros/` — list every hero variant
- [ ] Note which blocks are downloaded but not yet registered
- [ ] Note which blocks are planned (from Obsidian page planning)
- [ ] Create `docs/BLOCK_REGISTRY.md` with columns: block name, status (registered/downloaded/planned), design versions, research-specific (yes/no)

## Done when

You can look at one file and know the full state of the block library.
