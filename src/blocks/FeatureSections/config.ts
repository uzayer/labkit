import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type FeatureSectionsDesignVersion = keyof typeof variants

export const FeatureSectionsBlock: Block = {
  slug: 'feature-sections',
  interfaceName: 'FeatureSectionsBlock',
  labels: {
    singular: 'Feature Sections',
    plural: 'Feature Sections',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    // Variants are currently hardcoded display-only components.
    // Add conditional fields here as individual variants get wired up.
  ],
}
