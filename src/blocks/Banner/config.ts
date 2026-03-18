import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { icon } from '@/components/Icon/config'
import { backgroundColor } from '@/fields/color'
import { linkGroup } from '@/fields/linkGroup'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { Block } from 'payload'
import { variants } from './variants'

export type BannerDesignVersion = keyof typeof variants

export const allBannerPositions = ['TOP', 'BOTTOM'] as const
export type BannerPosition = (typeof allBannerPositions)[number]

export const BannerBlock: Block = {
  slug: 'banner',
  interfaceName: 'BannerBlockV2',
  labels: {
    singular: 'Banner',
    plural: 'Banners',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'position',
        type: 'select',
        defaultValue: 'TOP',
        options: allBannerPositions.map((position) => ({ label: position, value: position })),
      },
    ]),

    // Always-visible fields
    {
      name: 'defaultVisible',
      type: 'checkbox',
      defaultValue: true,
      label: 'Show by default',
    },
    {
      name: 'title',
      type: 'text',
      localized: true,
    },
    {
      name: 'description',
      type: 'text',
      localized: true,
    },

    // Explicit: function-created fields with their own conditions
    icon({
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['BANNER5'].includes(designVersion),
      },
    }),
    linkGroup({
      appearances: false,
    }),
  ],
}
