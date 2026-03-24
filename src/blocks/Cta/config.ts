import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type CtaDesignVersion = keyof typeof variants

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'tagline',
        type: 'text',
        localized: true,
      },
      {
        name: 'richText',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            ParagraphFeature(),
            OrderedListFeature(),
            UnorderedListFeature(),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ],
        }),
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
        required: false,
      },
    ]),

    // Explicit: function-created fields
    icon({
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['CTA1', 'CTA6', 'CTA7', 'CTA13', 'CTA15'].includes(designVersion),
      },
    }),
    linkGroup(), // all variants use links — no condition needed
  ],
}
