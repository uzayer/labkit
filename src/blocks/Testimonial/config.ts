import { backgroundColor } from '@/fields/color'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { link } from '@/fields/link'
import { Page, TestimonialBlock as TestimonialBlockType } from '@/payload-types'
import { parentLayoutCondition } from '@/utilities/parentLayoutCondition'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'

function designVersionMatches(parent: Page, id: string | undefined, allowed: string[]): boolean {
  const design = parentLayoutCondition<TestimonialBlockType>(
    parent,
    id ?? '',
    'testimonial',
  )?.designVersion
  return design !== undefined && allowed.includes(design)
}

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
  {
    label: 'TESTIMONIAL1',
    value: 'TESTIMONIAL1',
    image: '/admin/previews/testimonial/testimonial1.webp',
  },
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
  {
    label: 'TESTIMONIAL6',
    value: 'TESTIMONIAL6',
    image: '/admin/previews/testimonial/testimonial6.webp',
  },
  {
    label: 'TESTIMONIAL7',
    value: 'TESTIMONIAL7',
    image: '/admin/previews/testimonial/testimonial7.webp',
  },
  {
    label: 'TESTIMONIAL8',
    value: 'TESTIMONIAL8',
    image: '/admin/previews/testimonial/testimonial8.webp',
  },
  {
    label: 'TESTIMONIAL9',
    value: 'TESTIMONIAL9',
    image: '/admin/previews/testimonial/testimonial9.webp',
  },
  {
    label: 'TESTIMONIAL10',
    value: 'TESTIMONIAL10',
    image: '/admin/previews/testimonial/testimonial10.webp',
  },
  {
    label: 'TESTIMONIAL11',
    value: 'TESTIMONIAL11',
    image: '/admin/previews/testimonial/testimonial11.webp',
  },
  {
    label: 'TESTIMONIAL12',
    value: 'TESTIMONIAL12',
    image: '/admin/previews/testimonial/testimonial12.webp',
  },
  {
    label: 'TESTIMONIAL13',
    value: 'TESTIMONIAL13',
    image: '/admin/previews/testimonial/testimonial13.webp',
  },
  {
    label: 'TESTIMONIAL14',
    value: 'TESTIMONIAL14',
    image: '/admin/previews/testimonial/testimonial14.webp',
  },
  {
    label: 'TESTIMONIAL15',
    value: 'TESTIMONIAL15',
    image: '/admin/previews/testimonial/testimonial15.webp',
  },
  {
    label: 'TESTIMONIAL16',
    value: 'TESTIMONIAL16',
    image: '/admin/previews/testimonial/testimonial16.webp',
  },
  {
    label: 'TESTIMONIAL17',
    value: 'TESTIMONIAL17',
    image: '/admin/previews/testimonial/testimonial17.webp',
  },
  {
    label: 'TESTIMONIAL18',
    value: 'TESTIMONIAL18',
    image: '/admin/previews/testimonial/testimonial18.webp',
  },
  {
    label: 'TESTIMONIAL19',
    value: 'TESTIMONIAL19',
    image: '/admin/previews/testimonial/testimonial19.webp',
  },
  // { label: 'TESTIMONIAL20', value: 'TESTIMONIAL20', image: '/admin/previews/testimonial/testimonial20.webp' },
  // { label: 'TESTIMONIAL21', value: 'TESTIMONIAL21', image: '/admin/previews/testimonial/testimonial21.webp' },
  // { label: 'TESTIMONIAL23', value: 'TESTIMONIAL23', image: '/admin/previews/testimonial/testimonial23.webp' },
  // { label: 'TESTIMONIAL24', value: 'TESTIMONIAL24', image: '/admin/previews/testimonial/testimonial24.webp' },
  // { label: 'TESTIMONIAL25', value: 'TESTIMONIAL25', image: '/admin/previews/testimonial/testimonial25.webp' },
  // { label: 'TESTIMONIAL26', value: 'TESTIMONIAL26', image: '/admin/previews/testimonial/testimonial26.webp' },
  // { label: 'TESTIMONIAL27', value: 'TESTIMONIAL27', image: '/admin/previews/testimonial/testimonial27.webp' },
  // { label: 'TESTIMONIAL28', value: 'TESTIMONIAL28', image: '/admin/previews/testimonial/testimonial28.webp' },
  // { label: 'TESTIMONIAL29', value: 'TESTIMONIAL29', image: '/admin/previews/testimonial/testimonial29.webp' },
  // { label: 'TESTIMONIAL30', value: 'TESTIMONIAL30', image: '/admin/previews/testimonial/testimonial30.webp' },
] as const

export type TestimonialDesignVersion = (typeof allTestimonialDesignVersions)[number]['value']

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

    link({
      overrides: {
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['TESTIMONIAL2', 'TESTIMONIAL7', 'TESTIMONIAL19'].includes(designVersion),
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
