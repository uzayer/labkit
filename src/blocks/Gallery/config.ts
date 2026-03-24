import { Block } from 'payload'
import { HeadingFeature, ParagraphFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { link } from '@/fields/link'
import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { createBlockItemCondition } from '@/utilities/findParentFeatureVersion'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type GalleryDesignVersion = keyof typeof variants

/** @deprecated use variants instead */
export const allGalleryDesignVersions = variantsToOptions(variants)

export const Gallery: Block = {
  slug: 'gallery',
  interfaceName: 'GalleryBlock',
  labels: {
    singular: 'Gallery',
    plural: 'Gallery Blocks',
  },
  fields: [
    backgroundColor,
    designVersionPreview(variantsToOptions(variants)),

    ...applyVariantConditions(variants, [
      {
        name: 'richText',
        type: 'richText',
        localized: true,
        admin: {
          description: 'Optional heading and description for the gallery',
        },
        editor: lexicalEditor({
          features: ({ defaultFeatures }) => [
            ...defaultFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
            ParagraphFeature(),
          ],
        }),
      },
      {
        name: 'tagline',
        type: 'text',
        localized: true,
      },
    ]),

    // Explicit: function-created field with condition
    link({
      appearances: false,
      overrides: {
        admin: {
          description: 'Single link for this gallery. Might look best with arrowRight icon',
          condition: (_, { designVersion }: any) => ['GALLERY6'].includes(designVersion),
        },
      },
    }),

    // Always-visible: elements array (nested conditions use createBlockItemCondition — stay explicit)
    {
      name: 'elements',
      label: 'Gallery Items',
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description: 'Add images to the gallery',
      },
      fields: [
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'label',
          type: 'text',
          localized: true,
          admin: {
            description: 'Badge label displayed above title (GALLERY3 only)',
            condition: createBlockItemCondition(['GALLERY3']),
          },
        },
        {
          name: 'title',
          type: 'text',
          required: true,
          localized: true,
          admin: {
            description: 'Card title (GALLERY3 only)',
            condition: createBlockItemCondition(['GALLERY3']),
          },
        },
        {
          name: 'description',
          type: 'textarea',
          localized: true,
          admin: {
            description: 'Card description (GALLERY3 only)',
            condition: createBlockItemCondition(['GALLERY3']),
          },
        },
        {
          name: 'imageHeight',
          type: 'select',
          options: [
            '12rem',
            '13rem',
            '14rem',
            '15rem',
            '16rem',
            '17rem',
            '18rem',
            '19rem',
            '20rem',
            '21rem',
            '22rem',
            '23rem',
            '24rem',
            '25rem',
            '26rem',
            '27rem',
            '28rem',
            '29rem',
            '30rem',
            '31rem',
            '32rem',
          ],
          defaultValue: '21rem',
          admin: {
            description: 'Select the height of the image. This is only applicable to Gallery 25.',
            condition: createBlockItemCondition(['GALLERY25']),
          },
        },
        {
          name: 'icon',
          type: 'text',
          admin: {
            description: 'Select an icon to display with this item',
            condition: createBlockItemCondition(['GALLERY4', 'GALLERY5', 'GALLERY6']),
            components: {
              Field: {
                path: '@/components/AdminDashboard/IconSelect',
              },
            },
          },
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          admin: {
            condition: createBlockItemCondition(['GALLERY4', 'GALLERY5', 'GALLERY6']),
          },
          editor: lexicalEditor({
            features: ({ defaultFeatures }) => [
              ...defaultFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
              ParagraphFeature(),
            ],
          }),
        },
        link({
          appearances: false,
          overrides: {
            admin: {
              condition: createBlockItemCondition(['GALLERY3', 'GALLERY4', 'GALLERY5', 'GALLERY6']),
            },
          },
        }),
      ],
    },
  ],
}
