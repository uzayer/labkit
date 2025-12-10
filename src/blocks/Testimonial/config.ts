import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { linkGroup } from '@/fields/linkGroup'
import { Page, TestimonialBlock as TestimonialBlockType } from '@/payload-types'
import { parentLayoutCondition } from '@/utilities/parentLayoutCondition'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

// Testimonal 2: headline, link, testimonials: { authorAvatar }
// Testimonal 3: testimonials: { icon, richText, authorName, authorDescription }
// Testimonal 4: testimonials: { richText, authorName, authorAvatar, authorDescription }
// Testimonal 6: headline richText, testimonials: { richText, authorName, authorAvatar, authorDescription }
// Testimonal 7: headline richText, link, testimonials: { richText, authorName, authorAvatar, authorDescription }

// Testimonal 13: headline, tagline, testimonials: { authorAvatar }
// Testimonal 10: { richText, authorName, authorAvatar, authorDescription }

// Testimonal 16: headline richText, tagline string, testimonials: { richText, authorAvatar }
// Testimonal 17: headline richText, tagline string, testimonials: { icon, richText, authorName, authorAvatar, authorDescription }
// Testimonal 18: headline richText, tagline string, testimonials: { richText, authorName, authorAvatar, authorDescription, stars }
// Testimonal 19: headline richText, tagline string, link, testimonials: { link, richText, authorName, authorAvatar, authorDescription, stars }

export const allTestimonialDesignVersions = [
  // "TESTIMONIAL1",
  {
    label: 'TESTIMONIAL2',
    value: 'TESTIMONIAL2',
    image: '/admin/previews/testimonial/testimonial2.webp',
  },
  {
    label: 'TESTIMONIAL3',
    value: 'TESTIMONIAL3',
    image: '/admin/previews/testimonial/testimonial3.webp',
  },
  {
    label: 'TESTIMONIAL4',
    value: 'TESTIMONIAL4',
    image: '/admin/previews/testimonial/testimonial4.webp',
  },
  // "TESTIMONIAL6",
  {
    label: 'TESTIMONIAL7',
    value: 'TESTIMONIAL7',
    image: '/admin/previews/testimonial/testimonial7.webp',
  },
  // "TESTIMONIAL8",
  // "TESTIMONIAL9",
  // "TESTIMONIAL10",
  // "TESTIMONIAL11",
  // "TESTIMONIAL12",
  // "TESTIMONIAL13",
  {
    label: 'TESTIMONIAL14',
    value: 'TESTIMONIAL14',
    image: '/admin/previews/testimonial/testimonial14.webp',
  },
  // "TESTIMONIAL15",
  // "TESTIMONIAL16",
  // "TESTIMONIAL17",
  // "TESTIMONIAL18",
  // "TESTIMONIAL19",
] as const

export type TestimonialDesignVersion = (typeof allTestimonialDesignVersions)[number]

export const TestimonialBlock: Block = {
  slug: 'testimonial',
  interfaceName: 'TestimonialBlock',
  labels: {
    singular: 'Testimonial',
    plural: 'Testimonials',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allTestimonialDesignVersions),
    {
      name: 'headline',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          [
            'TESTIMONIAL2',
            'TESTIMONIAL6',
            'TESTIMONIAL7',
            'TESTIMONIAL13',
            'TESTIMONIAL16',
            'TESTIMONIAL17',
            'TESTIMONIAL18',
            'TESTIMONIAL19',
          ].includes(designVersion),
      },
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
      admin: {
        condition: (_, { designVersion } = { designVersion: '' }) =>
          [
            'TESTIMONIAL13',
            'TESTIMONIAL16',
            'TESTIMONIAL17',
            'TESTIMONIAL18',
            'TESTIMONIAL19',
          ].includes(designVersion),
      },
    },

    linkGroup({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['TESTIMONIAL7'].includes(designVersion),
        },
      },
    }),

    link({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['TESTIMONIAL2', 'TESTIMONIAL19'].includes(designVersion),
        },
      },
    }),

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
              [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL14',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
          },
        },
        {
          name: 'authorDescription',
          type: 'text',
          localized: true,
          admin: {
            condition: (parent: Page, { id }) =>
              [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
          },
        },
        {
          name: 'authorAvatar',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (parent: Page, { id }) =>
              [
                'TESTIMONIAL2',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL13',
                'TESTIMONIAL10',
                'TESTIMONIAL14',
                'TESTIMONIAL16',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
          },
        },
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
          admin: {
            condition: (parent: Page, { id }) =>
              ['TESTIMONIAL3', 'TESTIMONIAL17'].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
          },
        },
        {
          name: 'rating',
          type: 'number',
          min: 1,
          max: 5,
          admin: {
            condition: (parent: Page, { id }) =>
              ['TESTIMONIAL18', 'TESTIMONIAL19'].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
          },
        },
        {
          name: 'text',
          type: 'richText',
          localized: true,
          admin: {
            condition: (parent: Page, { id }) =>
              [
                'TESTIMONIAL3',
                'TESTIMONIAL4',
                'TESTIMONIAL6',
                'TESTIMONIAL7',
                'TESTIMONIAL10',
                'TESTIMONIAL14',
                'TESTIMONIAL16',
                'TESTIMONIAL17',
                'TESTIMONIAL18',
                'TESTIMONIAL19',
              ].includes(
                parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                  ?.designVersion ?? '',
              ),
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
                ['TESTIMONIAL19'].includes(
                  parentLayoutCondition<TestimonialBlockType>(parent, id, 'testimonial')
                    ?.designVersion || '',
                ),
            },
          },
        }),
      ],
    },
  ],
}
