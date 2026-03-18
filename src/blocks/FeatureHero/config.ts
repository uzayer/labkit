import { icon } from '@/components/Icon/config'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { linkGroup } from '@/fields/linkGroup'
import {
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { backgroundColor } from '@/fields/color'

const featureHeroOptions = [
  { label: 'FEATURE1', value: 'FEATURE1', image: '/admin/previews/feature/feature1.webp' },
] as const

export const FeatureHeroBlock: Block = {
  slug: 'feature-hero',
  interfaceName: 'FeatureHeroBlock',
  labels: {
    singular: 'Feature Hero',
    plural: 'Feature Heroes',
  },
  fields: [
    backgroundColor,
    designVersionPreview(featureHeroOptions),

    // All fields always visible — only 1 variant
    {
      name: 'badge',
      type: 'text',
      localized: true,
    },
    icon(),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      editor: lexicalEditor({
        features: ({ rootFeatures }) => [
          ...rootFeatures,
          HeadingFeature({ enabledHeadingSizes: ['h1', 'h2', 'h3', 'h4'] }),
          FixedToolbarFeature(),
          InlineToolbarFeature(),
        ],
      }),
      label: false,
    },
    {
      name: 'image',
      type: 'upload',
      relationTo: 'media',
      hasMany: false,
    },
    linkGroup({ overrides: { maxRows: 2 } }),
  ],
}
