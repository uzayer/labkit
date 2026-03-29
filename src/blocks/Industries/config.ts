import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'

export type IndustriesDesignVersion = keyof typeof variants

export const IndustriesBlock: Block = {
  slug: 'industries',
  interfaceName: 'IndustriesBlock',
  labels: {
    singular: 'Industries',
    plural: 'Industries',
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
        name: 'tagline',
        type: 'text',
        localized: true,
      },
      {
        name: 'columnLabel1',
        type: 'text',
        localized: true,
        label: 'Column Label 1',
      },
      {
        name: 'columnLabel2',
        type: 'text',
        localized: true,
        label: 'Column Label 2',
      },
      {
        name: 'columnLabel3',
        type: 'text',
        localized: true,
        label: 'Column Label 3',
      },
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Item', plural: 'Items' },
        fields: [
          { name: 'title', type: 'text', required: true, localized: true },
          { name: 'description', type: 'text', localized: true },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'year',
            type: 'text',
            localized: true,
            admin: {
              condition: createBlockItemCondition(['INDUSTRIES3']),
            },
          },
          link({
            disableLabel: true,
            appearances: false,
            disableIcon: true,
            overrides: {
              admin: {
                condition: createBlockItemCondition(['INDUSTRIES1', 'INDUSTRIES3', 'INDUSTRIES4']),
              },
            },
          }),
        ],
      },
    ]),
  ],
}
