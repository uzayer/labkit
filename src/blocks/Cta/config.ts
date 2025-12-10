import { icon } from '@/components/Icon/config'
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
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'

export const allCtaDesignVersions = [
  {
    label: 'CTA1',
    value: 'CTA1',
    image: '/admin/previews/cta/cta1.webp',
  },
  // 'CTA3',
  // 'CTA4',
  // 'CTA5',
  {
    label: 'CTA6',
    value: 'CTA6',
    image: '/admin/previews/cta/cta6.webp',
  },
  // 'CTA7',
  {
    label: 'CTA10',
    value: 'CTA10',
    image: '/admin/previews/cta/cta10.webp',
  },
  // 'CTA11',
  {
    label: 'CTA12',
    value: 'CTA12',
    image: '/admin/previews/cta/cta12.webp',
  },
  // 'CTA13',
  // 'CTA15',
  // 'CTA16',
  // 'CTA17',
] as const

const ctaDesignVersions: string[] = allCtaDesignVersions.map((item) => item.value)

export type CtaDesignVersion = (typeof allCtaDesignVersions)[number]

export const CtaBlock: Block = {
  slug: 'cta',
  interfaceName: 'CtaBlock',
  labels: {
    singular: 'Call to Action',
    plural: 'Call to Actions',
  },
  fields: [
    backgroundColor,
    designVersionPreview(allCtaDesignVersions),
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['CTA3', 'CTA4', 'CTA7', 'CTA13', 'CTA15'].includes(designVersion),
      },
    },
    icon({
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['CTA1', 'CTA6', 'CTA7', 'CTA13', 'CTA15'].includes(designVersion),
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          [
            'CTA1',
            'CTA3',
            'CTA4',
            'CTA5',
            'CTA6',
            'CTA7',
            'CTA10',
            'CTA11',
            'CTA12',
            'CTA13',
            'CTA15',
            'CTA16',
          ].includes(designVersion),
      },
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
    linkGroup({
      overrides: {
        admin: {
          condition: (_, { designVersion = '' } = {}) => ctaDesignVersions.includes(designVersion), // All CTAs use links
        },
      },
    }),
    {
      name: 'image',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['CTA1', 'CTA4', 'CTA6', 'CTA7', 'CTA13', 'CTA15', 'CTA16'].includes(designVersion),
      },
      relationTo: 'media',
      required: false,
    },
  ],
}
