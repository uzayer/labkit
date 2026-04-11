import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { icon } from '@/components/Icon/config'
import { variants } from './variants'

export type AboutDesignVersion = keyof typeof variants

export const AboutBlock: Block = {
  slug: 'about',
  interfaceName: 'AboutBlock',
  labels: {
    singular: 'About',
    plural: 'multiple About',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    // Always-visible fields
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
      name: 'text1',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'text2',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
        ],
      }),
    },
    {
      name: 'images',
      type: 'upload',
      relationTo: 'media',
      hasMany: true,
      admin: {
        description:
          'Images are used in order: ABOUT1 — [0] full-cover photo (left card), [1] background image behind text (right card); ABOUT2 — [0–2] top row (5/4/3 cols), [3–5] lower section; ABOUT3 — [0] hero, [1] card logo, [2] side; ABOUT4 — all images in grid; ABOUT18 — [0] left (desaturated), [1] right',
      },
    },

    // Explicit: function-created field with condition
    link({
      overrides: {
        admin: {
          condition: (_, { designVersion = '' } = {}) =>
            ['ABOUT3', 'ABOUT4'].includes(designVersion),
        },
      },
    }),

    ...applyVariantConditions(variants, [
      {
        name: 'text3',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          ],
        }),
      },
      {
        name: 'label1',
        type: 'text',
        localized: true,
      },
      {
        name: 'label2',
        type: 'text',
        localized: true,
      },
      {
        name: 'logos',
        type: 'upload',
        relationTo: 'media',
        hasMany: true,
      },
      {
        name: 'counter',
        type: 'array',
        fields: [
          { name: 'value', type: 'text', required: true },
          { name: 'title', type: 'text', required: true },
          { name: 'description', type: 'text', required: false },
        ],
      },
      {
        name: 'cards',
        type: 'array',
        labels: { singular: 'Card', plural: 'Cards' },
        fields: [
          icon({ admin: { description: 'Lucide icon name (e.g. "Files", "CircleArrowRight")' } }),
          { name: 'title', type: 'text', required: true, localized: true },
          { name: 'description', type: 'text', localized: true },
        ],
      },
    ]),
  ],
}
