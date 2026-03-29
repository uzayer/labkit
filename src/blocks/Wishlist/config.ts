import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

export type WishlistDesignVersion = keyof typeof variants

export const WishlistBlock: Block = {
  slug: 'wishlist',
  interfaceName: 'WishlistBlock',
  labels: {
    singular: 'Wishlist',
    plural: 'Wishlists',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'headline',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          ],
        }),
      },
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Item', plural: 'Items' },
        fields: [
          { name: 'title', type: 'text', required: true, localized: true },
          { name: 'image', type: 'upload', relationTo: 'media' },
          { name: 'price', type: 'number' },
          { name: 'originalPrice', type: 'number' },
          { name: 'inStock', type: 'checkbox', defaultValue: true },
          {
            name: 'priceDrop',
            type: 'checkbox',
            admin: { condition: createBlockItemCondition(['WISHLIST1']) },
          },
          {
            name: 'dateAdded',
            type: 'text',
            admin: { condition: createBlockItemCondition(['WISHLIST2']) },
          },
          {
            name: 'category',
            type: 'text',
            localized: true,
            admin: { condition: createBlockItemCondition(['WISHLIST2']) },
          },
        ],
      },
    ]),
  ],
}
