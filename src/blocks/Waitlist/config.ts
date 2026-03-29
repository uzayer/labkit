import { backgroundColor } from '@/fields/color'
import { link } from '@/fields/link'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { applyVariantConditions, variantsToOptions } from '@/blocks/utils'
import { HeadingFeature, lexicalEditor } from '@payloadcms/richtext-lexical'
import { Block } from 'payload'
import { variants } from './variants'
import { FormBlock } from '../Form/config'

export type WaitlistDesignVersion = keyof typeof variants

export const WaitlistBlock: Block = {
  slug: 'waitlist',
  interfaceName: 'WaitlistBlock',
  labels: {
    singular: 'Waitlist',
    plural: 'Waitlists',
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
        name: 'text1',
        type: 'richText',
        localized: true,
        editor: lexicalEditor({
          features: ({ rootFeatures }) => rootFeatures,
        }),
      },
      {
        name: 'label1',
        type: 'text',
        localized: true,
        admin: {
          description: 'Social proof text (e.g. "+1,000 people already joined")',
        },
      },
      {
        name: 'label2',
        type: 'text',
        localized: true,
        admin: {
          description: 'Badge text (e.g. "COMING SOON IN 2027")',
        },
      },
      {
        name: 'label3',
        type: 'date',
        admin: {
          description: 'Countdown target date',
        },
      },
      {
        name: 'images',
        type: 'upload',
        relationTo: 'media',
        hasMany: true,
        admin: {
          description:
            'WAITLIST1 — avatars; WAITLIST2 — [0] logo, [1+] avatars; WAITLIST3 — [0] company logo, [1] feature image, [2+] avatars',
        },
      },
      {
        name: 'form',
        label: 'Form',
        type: 'blocks',
        blocks: [FormBlock],
        maxRows: 1,
      },
    ]),

    link({
      overrides: {
        admin: {
          condition: (_: any, { designVersion = '' }: any = {}) => designVersion === 'WAITLIST3',
          description: 'Footer company link',
        },
      },
    }),
  ],
}
