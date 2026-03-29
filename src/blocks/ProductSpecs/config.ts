import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'

export type ProductSpecsDesignVersion = keyof typeof variants

// Condition for fields inside specCategories[].specs[] (doubly nested).
// createBlockItemCondition only traverses one level deep, so we need a manual
// two-level traversal: layout → product-specs block → specCategories[] → specs[].
const highlightCondition = (data: any, siblingData: any) => {
  if (!data?.layout || !siblingData?.id) return false
  for (const block of data.layout) {
    if (block.blockType !== 'product-specs') continue
    for (const category of block.specCategories || []) {
      if (
        Array.isArray(category.specs) &&
        category.specs.some((s: any) => s.id === siblingData.id)
      ) {
        return block.designVersion === 'PRODUCTSPECS2'
      }
    }
  }
  return false
}

export const ProductSpecsBlock: Block = {
  slug: 'product-specs',
  interfaceName: 'ProductSpecsBlock',
  labels: {
    singular: 'Product Specs',
    plural: 'Product Specs',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      // Section heading
      {
        name: 'title',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
          ],
        }),
      },
      // Unified spec categories array (shared by both variants)
      {
        name: 'specCategories',
        type: 'array',
        labels: { singular: 'Spec Category', plural: 'Spec Categories' },
        fields: [
          { name: 'name', type: 'text', required: true, localized: true },
          // Icon — one level deep in specCategories, createBlockItemCondition works here
          icon({
            admin: {
              description: 'Lucide icon name (e.g. "Monitor", "Cpu", "Battery")',
              condition: createBlockItemCondition(['PRODUCTSPECS1']),
            },
          }),
          {
            name: 'specs',
            type: 'array',
            labels: { singular: 'Spec', plural: 'Specs' },
            fields: [
              { name: 'label', type: 'text', required: true, localized: true },
              {
                name: 'value',
                type: 'text',
                required: true,
                localized: true,
                admin: {
                  description:
                    'Text value (e.g. "512GB SSD") or "true"/"false" for checkmark/X icon (PRODUCTSPECS2 only)',
                },
              },
              // Highlight — doubly nested (specs inside specCategories), needs manual traversal
              {
                name: 'highlight',
                type: 'checkbox',
                defaultValue: false,
                admin: {
                  description: 'Highlight this spec as a key feature',
                  condition: highlightCondition,
                },
              },
            ],
          },
        ],
      },
      // PRODUCTSPECS2 — "Key Highlights" section heading
      {
        name: 'highlightsHeading',
        type: 'text',
        localized: true,
      },
    ]),
  ],
}
