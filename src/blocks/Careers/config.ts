import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'

export type CareersDesignVersion = keyof typeof variants

export const CareersBlock: Block = {
  slug: 'careers',
  interfaceName: 'CareersBlock',
  labels: {
    singular: 'Careers',
    plural: 'Careers',
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
        name: 'jobCategories',
        type: 'array',
        labels: { singular: 'Job Category', plural: 'Job Categories' },
        fields: [
          {
            name: 'category',
            type: 'text',
            required: true,
            localized: true,
            label: 'Category Name',
            admin: { description: 'e.g. "Engineering", "Marketing"' },
          },
          {
            name: 'openings',
            type: 'array',
            labels: { singular: 'Opening', plural: 'Openings' },
            fields: [
              {
                name: 'title',
                type: 'text',
                required: true,
                localized: true,
                label: 'Job Title',
              },
              {
                name: 'description',
                type: 'text',
                localized: true,
                label: 'Description',
              },
              {
                name: 'location',
                type: 'text',
                localized: true,
                label: 'Location',
                admin: { description: 'e.g. "Remote" or "New York office or Remote"' },
              },
              link({ disableLabel: true, appearances: false, disableIcon: true }),
            ],
          },
        ],
      },
    ]),
  ],
}
