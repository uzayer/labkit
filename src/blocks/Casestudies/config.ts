import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { variants } from './variants'

export type CasestudiesDesignVersion = keyof typeof variants

export const logoSizeOptions = [
  {
    label: 'Small (16px and 24px)',
    value: 'h-4 md:h-6',
  },
  {
    label: 'Medium (24px and 32px)',
    value: 'h-6 md:h-8',
  },
  {
    label: 'Large (32px and 40px)',
    value: 'h-8 md:h-10',
  },
  {
    label: 'Extra Large (40px and 48px)',
    value: 'h-10 md:h-12',
  },
]

export const CasestudiesBlock: Block = {
  slug: 'casestudies',
  interfaceName: 'CasestudiesBlock',
  labels: {
    singular: 'Casestudies',
    plural: 'Casestudies',
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
        name: 'label1',
        type: 'text',
        localized: true,
      },
      {
        name: 'items',
        type: 'array',
        labels: { singular: 'Case Study', plural: 'Case Studies' },
        fields: [
          { name: 'title', type: 'text', localized: true },
          { name: 'description', type: 'text', localized: true },
          {
            name: 'image',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
          },
          {
            name: 'company',
            type: 'text',
            localized: true,
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES3', 'CASESTUDIES4']),
            },
          },
          {
            name: 'tags',
            type: 'text',
            localized: true,
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES3']),
            },
          },
          {
            name: 'authorName',
            type: 'text',
            localized: true,
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES2', 'CASESTUDIES4']),
            },
          },
          {
            name: 'authorRole',
            type: 'text',
            localized: true,
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES2', 'CASESTUDIES4']),
            },
          },
          {
            name: 'authorImage',
            type: 'upload',
            relationTo: 'media',
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES4']),
            },
          },
          link({
            disableLabel: true,
            appearances: false,
            disableIcon: true,
            overrides: {
              admin: {
                condition: createBlockItemCondition([
                  'CASESTUDIES1',
                  'CASESTUDIES3',
                  'CASESTUDIES4',
                ]),
              },
            },
          }),
          {
            name: 'stats',
            type: 'array',
            labels: { singular: 'Stat', plural: 'Stats' },
            admin: {
              condition: createBlockItemCondition(['CASESTUDIES2', 'CASESTUDIES4']),
            },
            fields: [
              { name: 'value', type: 'text' },
              { name: 'label', type: 'text', localized: true },
              { name: 'statDescription', type: 'text', localized: true },
            ],
          },
        ],
      },
      {
        name: 'slides',
        type: 'array',
        required: true,
        minRows: 1,
        fields: [
          {
            name: 'name',
            type: 'text',
            required: true,
            label: 'Name',
          },
          {
            name: 'content',
            type: 'textarea',
            required: true,
            label: 'Content',
          },
          {
            name: 'logo',
            type: 'upload',
            relationTo: 'media',
            required: true,
            label: 'Logo',
          },
          {
            name: 'logoClass',
            type: 'select',
            defaultValue: 'h-6 md:h-8',
            options: logoSizeOptions,
            label: 'Logo Size',
          },
          {
            name: 'images',
            type: 'array',
            required: true,
            minRows: 1,
            maxRows: 9,
            fields: [
              {
                name: 'src',
                type: 'upload',
                relationTo: 'media',
                required: true,
                label: 'Image',
              },
              {
                name: 'position',
                type: 'number',
                required: true,
                min: 0,
                max: 8,
                label: 'Grid Position (0-8)',
              },
            ],
          },
        ],
      },
    ]),
  ],
}
