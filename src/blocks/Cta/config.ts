import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
// import { link } from '@/fields/link'
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
import { backgroundColor /* , color */ } from '@/fields/color'

export const allCtaDesignVersions = [
  { label: 'CTA1', value: 'CTA1', image: '/admin/previews/cta/cta1.webp' },
  { label: 'CTA3', value: 'CTA3', image: '/admin/previews/cta/cta3.webp' },
  { label: 'CTA4', value: 'CTA4', image: '/admin/previews/cta/cta4.webp' },
  { label: 'CTA5', value: 'CTA5', image: '/admin/previews/cta/cta5.webp' },
  { label: 'CTA6', value: 'CTA6', image: '/admin/previews/cta/cta6.webp' },
  { label: 'CTA7', value: 'CTA7', image: '/admin/previews/cta/cta7.webp' },
  { label: 'CTA10', value: 'CTA10', image: '/admin/previews/cta/cta10.webp' },
  { label: 'CTA11', value: 'CTA11', image: '/admin/previews/cta/cta11.webp' },
  { label: 'CTA12', value: 'CTA12', image: '/admin/previews/cta/cta12.webp' },
  { label: 'CTA13', value: 'CTA13', image: '/admin/previews/cta/cta13.webp' },
  // { label: 'CTA14', value: 'CTA14', image: '/admin/previews/cta/cta14.webp' },
  { label: 'CTA15', value: 'CTA15', image: '/admin/previews/cta/cta15.webp' },
  { label: 'CTA16', value: 'CTA16', image: '/admin/previews/cta/cta16.webp' },
  { label: 'CTA17', value: 'CTA17', image: '/admin/previews/cta/cta17.webp' },
  // { label: 'CTA18', value: 'CTA18', image: '/admin/previews/cta/cta18.webp' },
  // { label: 'CTA19', value: 'CTA19', image: '/admin/previews/cta/cta19.webp' },
  // { label: 'CTA20', value: 'CTA20', image: '/admin/previews/cta/cta20.webp' },
  // { label: 'CTA21', value: 'CTA21', image: '/admin/previews/cta/cta21.webp' },
  // { label: 'CTA22', value: 'CTA22', image: '/admin/previews/cta/cta22.webp' },
  // { label: 'CTA23', value: 'CTA23', image: '/admin/previews/cta/cta23.webp' },
  // { label: 'CTA26', value: 'CTA26', image: '/admin/previews/cta/cta26.webp' },
  // { label: 'CTA27', value: 'CTA27', image: '/admin/previews/cta/cta27.webp' },
  // { label: 'CTA28', value: 'CTA28', image: '/admin/previews/cta/cta28.webp' },
  // { label: 'CTA30', value: 'CTA30', image: '/admin/previews/cta/cta30.webp' },
  // { label: 'CTA31', value: 'CTA31', image: '/admin/previews/cta/cta31.webp' },
  // { label: 'CTA32', value: 'CTA32', image: '/admin/previews/cta/cta32.webp' },
] as const

export type CtaDesignVersion = (typeof allCtaDesignVersions)[number]['value']

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
          condition: (_, { designVersion = '' } = {}) =>
            allCtaDesignVersions.includes(designVersion), // All CTAs use links
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
