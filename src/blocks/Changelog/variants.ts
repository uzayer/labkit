import type { VariantManifest } from '@/blocks/utils'

// githubSettings condition is on fetchFromGithub (checkbox), not designVersion — always pass-through.
export const variants: VariantManifest = {
  CHANGELOG1: {
    label: 'Changelog 1',
    fields: [],
  },
}
