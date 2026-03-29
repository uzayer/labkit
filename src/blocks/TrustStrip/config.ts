import { Block } from 'payload'

import { backgroundColor } from '@/fields/color'
import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type TrustStripDesignVersion = keyof typeof variants

export const TrustStripBlock: Block = {
  slug: 'trust-strip',
  interfaceName: 'TrustStripBlock',
  imageURL: '/admin/previews/trust-strip/trust-strip1.webp',
  labels: {
    singular: 'Trust Strip',
    plural: 'Trust Strips',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),
    ...applyVariantConditions(variants, [
      // TRUSTSTRIP1 fields
      {
        type: 'array',
        name: 'items',
        label: 'Items',
        minRows: 1,
        maxRows: 6,
        fields: [
          icon({
            name: 'icon',
            label: 'Icon',
            required: true,
          }),
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            required: true,
            localized: true,
          },
          {
            type: 'text',
            name: 'description',
            label: 'Description',
            localized: true,
          },
        ],
      },

      // TRUSTSTRIP2 fields
      {
        type: 'text',
        name: 'rating',
        label: 'Rating',
        defaultValue: '4.9',
        admin: {
          description: 'Numeric rating (e.g., 4.9)',
        },
      },
      {
        type: 'text',
        name: 'reviewCount',
        label: 'Review Count',
        defaultValue: '12500',
        admin: {
          description: 'Number of reviews',
        },
      },
      {
        type: 'text',
        name: 'customerCount',
        label: 'Customer Count',
        defaultValue: '1M+',
        localized: true,
        admin: {
          description: 'Customer count display (e.g., 1M+)',
        },
      },
      {
        type: 'text',
        name: 'customerCountLabel',
        label: 'Customer Count Label',
        defaultValue: 'Trusted by',
        localized: true,
        admin: {
          description: 'Label before customer count',
        },
      },
      {
        type: 'text',
        name: 'pressLogosLabel',
        label: 'Press Logos Label',
        defaultValue: 'As seen in:',
        localized: true,
      },
      {
        type: 'array',
        name: 'pressLogos',
        label: 'Press Logos',
        minRows: 1,
        maxRows: 10,
        fields: [
          {
            type: 'text',
            name: 'name',
            label: 'Name',
            required: true,
            localized: true,
          },
          {
            type: 'upload',
            name: 'logo',
            label: 'Logo Image',
            relationTo: 'media',
            admin: {
              description: 'Optional logo image. If not provided, name will be displayed as text.',
            },
          },
        ],
      },

      // TRUSTSTRIP3 fields
      {
        type: 'array',
        name: 'certifications',
        label: 'Certifications',
        minRows: 1,
        maxRows: 8,
        fields: [
          icon({
            name: 'icon',
            label: 'Icon',
            required: true,
          }),
          {
            type: 'text',
            name: 'name',
            label: 'Name',
            required: true,
            localized: true,
          },
        ],
      },
      {
        type: 'array',
        name: 'guarantees',
        label: 'Guarantees',
        minRows: 1,
        maxRows: 6,
        fields: [
          {
            type: 'text',
            name: 'text',
            label: 'Text',
            required: true,
            localized: true,
          },
        ],
      },

      // TRUSTSTRIP4 fields (rating and reviewCount reused from TRUSTSTRIP2 names)
      {
        type: 'text',
        name: 'reviewCountLabel',
        label: 'Review Count Label',
        defaultValue: 'verified reviews',
        localized: true,
        admin: {
          description: 'Suffix text after review count (e.g., "verified reviews")',
        },
      },
      {
        type: 'array',
        name: 'features',
        label: 'Features',
        minRows: 1,
        maxRows: 8,
        fields: [
          icon({
            name: 'icon',
            label: 'Icon',
            required: true,
          }),
          {
            type: 'text',
            name: 'text',
            label: 'Text',
            required: true,
            localized: true,
          },
        ],
      },
      {
        type: 'text',
        name: 'badgeText',
        label: 'Badge Text',
        defaultValue: 'Verified Seller',
        localized: true,
      },
      icon({
        name: 'badgeIcon',
        label: 'Badge Icon',
        defaultValue: 'BadgeCheck',
      }),
    ]),
  ],
}
