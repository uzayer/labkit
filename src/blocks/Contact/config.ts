import { Block } from 'payload'
import {
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
  OrderedListFeature,
  ParagraphFeature,
  UnorderedListFeature,
} from '@payloadcms/richtext-lexical'
import { FormBlock } from '../Form/config'
import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type ContactDesignVersion = keyof typeof variants

export const ContactBlock: Block = {
  slug: 'contact',
  interfaceName: 'ContactBlock',
  labels: {
    singular: 'Contact',
    plural: 'Contacts',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    // All fields are always visible across all Contact variants
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          InlineToolbarFeature(),
          ParagraphFeature(),
          OrderedListFeature(),
          UnorderedListFeature(),
        ],
      }),
    },
    {
      name: 'contactBlocks',
      type: 'array',
      fields: [
        icon(),
        {
          name: 'description',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => rootFeatures,
          }),
        },
      ],
    },
    {
      name: 'maps',
      type: 'array',
      fields: [
        {
          name: 'iframe',
          type: 'text',
        },
      ],
    },
    {
      name: 'form',
      label: 'Form',
      type: 'blocks',
      blocks: [FormBlock],
      maxRows: 1,
    },

    ...applyVariantConditions(variants, [
      {
        name: 'label1',
        type: 'text',
        localized: true,
      },
    ]),
  ],
}
