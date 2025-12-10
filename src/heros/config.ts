import type { Field } from 'payload'

import {
  BlocksFeature,
  FixedToolbarFeature,
  HeadingFeature,
  InlineToolbarFeature,
  lexicalEditor,
} from '@payloadcms/richtext-lexical'

import { linkGroup } from '@/fields/linkGroup'
import { link } from '@/fields/link'
import { icon } from '@/components/Icon/config'
import { customHeroFields } from './CustomHero/config'
import { backgroundColor } from '@/fields/color'
import { designVersionDescription } from '@/components/AdminDashboard/DesignVersionDescription'
import { designVersionPreview } from '@/components/AdminDashboard/DesignVersionPreview/config'
import { MotionText } from '@/blocks/LexicalBlocks/MotionText/config'

/* TODO:
13 -> X
30 -> X
16 -> X




29 -> rating
31 -> 3 images
37 -> 3 images
38 -> 3 images
15 -> rating
27 -> tagline
26 -> tagline, badge-link
55 -> tagline, badge-link
21 -> tagline, badge-link (+ dritter button checken ob neues feld oder array aufteilen?)
53 -> headline aus richtext rauslösen, icons (faces mit textinfo), tagline
28 -> 5 icons
32 -> 14 icons
12 -> 1 - 5 icons, tagline
51 -> 4 icons, tagline
57 -> 4 icons, tagline
50 -> 2 icons, badge-link
24 -> icon, 4 USPs: icon, headline, description
25 -> icon, 3-4 USPs: icon, headline
20 -> 2-5 USPs: icon, headline, description, time
45 -> badge, 3 USPs: icon, headline, description

33 -> pricing: headline, price, description


What should happen with the two big boxes? Image or Tex?
18 -> 2 images + 14 icons

*/

export const allHeroDesignVersions = [
  { label: 'no Hero', value: 'none' },
  { label: 'HERO1', value: '1', image: '/admin/previews/hero/hero1.jpeg' },
  { label: 'HERO2', value: '2', image: '/admin/previews/hero/hero2.jpeg' },
  { label: 'HERO3', value: '3', image: '/admin/previews/hero/hero3.jpeg' },
  { label: 'HERO4', value: '4', image: '/admin/previews/hero/hero4.jpeg' },
  { label: 'HERO5', value: '5', image: '/admin/previews/hero/hero5.jpeg' },
  { label: 'HERO6', value: '6', image: '/admin/previews/hero/hero6.jpeg' },
  { label: 'HERO12', value: '12', image: '/admin/previews/hero/hero12.jpeg' },
  { label: 'HERO101', value: '101', image: '/admin/previews/hero/hero101.webp' },
  { label: 'HERO112', value: '112', image: '/admin/previews/hero/hero112.jpeg' },
  { label: 'HERO195', value: '195', image: '/admin/previews/hero/hero195.webp' },
  { label: 'HERO220', value: '220', image: '/admin/previews/hero/hero220.jpeg' },
  { label: 'HERO214', value: '214', image: '/admin/previews/hero/hero214.webp' },
  { label: 'HERO219', value: '219', image: '/admin/previews/hero/hero219.webp' },
] as const

export type HeroDesignVersion = (typeof allHeroDesignVersions)[number]

export const hero: Field = {
  name: 'hero',
  type: 'group',
  interfaceName: 'Hero',
  fields: [
    backgroundColor,
    designVersionPreview(allHeroDesignVersions),
    {
      name: 'badge',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['1', '2', '3', '4', '5', '6', '12', '112'].includes(designVersion),
      },
    },
    icon({
      name: 'badgeIcon',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['1', '2', '3', '4', '5', '6'].includes(designVersion),
      },
    }),
    {
      name: 'tagline',
      type: 'text',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['3', '27', '26', '55', '21', '53', '12', '51', '57', '112', '220'].includes(
            designVersion,
          ),
      },
    },
    link({
      appearances: false,
      disableLabel: true,
      overrides: {
        name: 'badgeLink',
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['26', '55', '21', '50'].includes(designVersion),
        },
      },
    }),
    link({
      appearances: false,
      disableIcon: true,
      overrides: {
        name: 'buttonLink',
        label: 'Button Link',
        admin: {
          condition: (_, { designVersion } = { designVersion: '' }) =>
            ['214'].includes(designVersion),
        },
      },
    }),
    {
      name: 'richText',
      type: 'richText',
      localized: true,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['1', '2', '3', '4', '5', '6', '12', '101', '112', '195', '214', '219'].includes(
            designVersion,
          ),
      },
      editor: lexicalEditor({
        features: ({ rootFeatures }) => {
          return [
            ...rootFeatures,
            HeadingFeature({ enabledHeadingSizes: ['h1'] }),
            BlocksFeature({
              blocks: [MotionText],
            }),
            FixedToolbarFeature(),
            InlineToolbarFeature(),
          ]
        },
      }),
      label: false,
    },
    linkGroup({
      overrides: {
        maxRows: 2,
        admin: {
          condition: (_, { designVersion = '' } = {}) =>
            ['1', '2', '3', '4', '5', '6', '12', '101', '112', '195'].includes(designVersion),
        },
      },
    }),
    {
      name: 'images',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          [
            '1',
            '2',
            '3',
            '4',
            '5',
            '6',
            '12',
            '31',
            '37',
            '38',
            '18',
            '112',
            '220',
            '214',
          ].includes(designVersion),
      },
      relationTo: 'media',
      hasMany: true,
      maxRows: 3,
    },
    designVersionDescription(
      'description112',
      (_, { designVersion } = {}) => ['112'].includes(designVersion),
      {
        en: 'Just use a single image here as background image',
        de: 'Nur ein Bild hier als Hintergrund-Bild verwenden',
      },
    ),
    {
      name: 'icons',
      type: 'upload',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['3', '53', '28', '32', '12', '51', '57', '50', '18', '112', '101', '219'].includes(
            designVersion,
          ),
      },
      relationTo: 'media',
      hasMany: true,
      maxRows: 14,
    },
    designVersionDescription(
      'description219',
      (_, { designVersion } = {}) => ['219'].includes(designVersion),
      {
        en: 'Use 14 logo images here',
        de: 'Verwende hier 14 Logo-Bilder',
      },
    ),
    {
      name: 'USPs',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['24', '25', '20', '45'].includes(designVersion),
      },
      fields: [
        {
          name: 'icon',
          type: 'upload',
          relationTo: 'media',
        },
        {
          name: 'richText',
          type: 'richText',
          localized: true,
          editor: lexicalEditor({
            features: ({ rootFeatures }) => {
              return [
                ...rootFeatures,
                HeadingFeature({ enabledHeadingSizes: ['h2', 'h3', 'h4'] }),
                FixedToolbarFeature(),
                InlineToolbarFeature(),
              ]
            },
          }),
          label: false,
        },
      ],
    },
    {
      name: 'statsItems',
      label: 'Stats Items',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['112'].includes(designVersion),
      },
      maxRows: 3,
      defaultValue: [
        {
          title: 'Courses by Experts',
          value: '87',
        },
        {
          title: 'Hours of Content',
          value: '200+',
        },
        {
          title: 'User Satisfaction Rating',
          value: '100%',
        },
      ],
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
        },
        {
          name: 'value',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'pricing',
      type: 'group',
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['33'].includes(designVersion),
      },
      fields: [
        {
          name: 'headline',
          type: 'text',
          localized: true,
        },
        {
          name: 'price',
          type: 'text',
          localized: true,
        },
        {
          name: 'description',
          type: 'text',
          localized: true,
        },
      ],
    },
    {
      name: 'rating',
      type: 'number',
      max: 5,
      min: 1,
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['3', '4', '7', '15'].includes(designVersion),
      },
    },
    ...customHeroFields,
    {
      name: 'presentationVideo',
      type: 'group',
      admin: {
        condition: (_, { designVersion = '' } = {}) =>
          ['112', '220', '101'].includes(designVersion),
      },
      fields: [
        {
          name: 'label',
          type: 'text',
          localized: true,
          defaultValue: 'Presentation Video',
        },
        {
          name: 'videoDuration',
          type: 'text',
          localized: true,
          defaultValue: '2 min',
        },
        {
          name: 'videoUrl',
          type: 'text',
          localized: true,
          defaultValue: 'https://library.shadcnblocks.com/videos/block/landscape.mp4',
        },
      ],
    },
    {
      name: 'tabs',
      type: 'array',
      admin: {
        condition: (_, { designVersion = '' } = {}) => ['195'].includes(designVersion),
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'icon',
          type: 'select',
          options: [
            { label: 'Square Kanban', value: 'SquareKanban' },
            { label: 'Bar Chart', value: 'BarChart' },
            { label: 'Pie Chart', value: 'PieChart' },
            { label: 'Database', value: 'Database' },
            { label: 'Layers', value: 'Layers' },
          ],
          required: true,
        },
        {
          name: 'image',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
      ],
      maxRows: 5,
    },
  ],
  label: false,
}
