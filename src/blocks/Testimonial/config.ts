import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { link } from '@/fields/link'
import { Page, TestimonialBlock as TestimonialBlockType } from '@/payload-types'
import { parentLayoutCondition } from '@/utilities/parentLayoutCondition'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { variants } from './variants'

export type TestimonialDesignVersion = keyof typeof variants

function designVersionMatches(parent: Page, id: string | undefined, allowed: string[]): boolean {
  const design = parentLayoutCondition<TestimonialBlockType>(
    parent,
    id ?? '',
    'testimonial',
  )?.designVersion
  return design !== undefined && allowed.includes(design)
}

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
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
            HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
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
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['TESTIMONIAL2', 'TESTIMONIAL7', 'TESTIMONIAL19'].includes(designVersion),
        },
      },
    }),

    // Always-visible: testimonial array (nested conditions use parentLayoutCondition — stay explicit)
    {
      name: 'testimonial',
      label: {
        singular: 'Testimonial',
        plural: 'Testimonials',
      },
      type: 'array',
      fields: [
        {
          name: 'authorName',
          type: 'text',
          localized: true,
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ]),
          },
        },
        {
          name: 'authorDescription',
          type: 'text',
          localized: true,
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ]),
          },
        },
        {
          name: 'authorAvatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, [
                'TESTIMONIAL2',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL13',
                'TESTIMONIAL10',
                'TESTIMONIAL16',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ]),
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, ['TESTIMONIAL3', 'TESTIMONIAL17']),
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, ['TESTIMONIAL18', 'TESTIMONIAL19']),
          },
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
          admin: {
            condition: (parent: Page, { id }) =>
              designVersionMatches(parent, id, [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL16',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ]),
          },
          editor: lexicalEditor({
            features: ({ rootFeatures }) => [
              ...rootFeatures,
              HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3'] }),
            ],
          }),
        },
        link({
          overrides: {
            admin: {
              condition: (parent: Page, { id }) =>
                designVersionMatches(parent, id, ['TESTIMONIAL19']),
            },
          },
        }),
      ],
    },
  ],
}
