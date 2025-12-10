import { backgroundColor } from '@/fields/color'
import { Block } from 'payload'

/**
 * We define here just additional config fields for the custom blocks
 */
export const CustomBlock: Block = {
  slug: 'customblock', // This will be the base slug for all custom blocks
  interfaceName: 'CustomBlock',
  labels: {
    singular: 'Custom Block',
    plural: 'Custom Blocks',
  },
  fields: [
    backgroundColor,
    {
      name: 'customBlockType', // Changed from blockType to avoid conflict
      type: 'select',
      required: true,
      options: [
        // Add your custom block types here
        // { label: 'Example Block', value: 'example' },
      ],
    },
  ],
}
