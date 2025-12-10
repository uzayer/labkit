import type { Field, Block } from 'payload'
import { link } from '@/fields/link'
import { icon } from '@/components/Icon/config'

// Block types for navigation submenus (only for navbar4)
const navSubmenuBlocks: Block[] = [
  // Featured Banner Block
  {
    slug: 'featuredBanner',
    imageURL: '/admin/previews/header/navbar4/featuredBanner.jpeg',
    labels: {
      plural: 'Featured Banners',
      singular: 'Featured Banner',
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'text',
        name: 'subtitle',
        label: 'Subtitle',
        localized: true,
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
        localized: true,
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'backgroundColor',
        type: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Accent', value: 'accent' },
          { label: 'Muted', value: 'muted' },
        ],
        defaultValue: 'primary',
      },
      link({
        appearances: ['default', 'outline', 'ghost', 'secondary'],
      }),
    ],
  },
  // Category Grid Block
  {
    slug: 'categoryGrid',
    labels: {
      plural: 'Category Grids',
      singular: 'Category Grid',
    },
    imageURL: '/admin/previews/header/navbar4/categoryGrid.jpeg',

    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'array',
        name: 'items',
        label: 'Items',
        fields: [
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            localized: true,
          },
          {
            type: 'text',
            name: 'description',
            label: 'Description',
            localized: true,
          },
          icon(),
          link({
            appearances: false,
          }),
        ],
      },
    ],
  },
  // Card Grid Block
  {
    slug: 'cardGrid',
    labels: {
      plural: 'Card Grids',
      singular: 'Card Grid',
    },
    imageURL: '/admin/previews/header/navbar4/cardGrid.jpeg',
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'array',
        name: 'cards',
        label: 'Cards',
        fields: [
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            localized: true,
          },
          {
            type: 'text',
            name: 'description',
            label: 'Description',
            localized: true,
          },
          {
            type: 'array',
            name: 'links',
            label: 'Links',
            fields: [
              link({
                appearances: false,
              }),
              icon(),
            ],
          },
        ],
      },
    ],
  },
  // Feature List Block
  {
    slug: 'featureList',
    labels: {
      plural: 'Feature Lists',
      singular: 'Feature List',
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'array',
        name: 'features',
        label: 'Features',
        fields: [
          {
            type: 'text',
            name: 'title',
            label: 'Title',
            localized: true,
          },
          {
            type: 'text',
            name: 'description',
            label: 'Description',
            localized: true,
          },
          icon(),
          link({
            appearances: false,
          }),
        ],
      },
    ],
  },
  // Simple Links Block
  {
    slug: 'simpleLinks',
    labels: {
      plural: 'Simple Links',
      singular: 'Simple Links',
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'array',
        name: 'links',
        label: 'Links',
        fields: [
          link({
            appearances: false,
            disableIcon: true,
          }),
          icon(),
          {
            type: 'text',
            name: 'description',
            label: 'Description',
            localized: true,
          },
        ],
      },
    ],
  },
  // Featured Image Block
  {
    slug: 'featuredImage',
    imageURL: '/admin/previews/header/navbar4/featuredImage.jpeg',
    labels: {
      plural: 'Featured Images',
      singular: 'Featured Image',
    },
    fields: [
      {
        type: 'text',
        name: 'title',
        label: 'Title',
        localized: true,
      },
      {
        type: 'text',
        name: 'subtitle',
        label: 'Subtitle',
        localized: true,
      },
      {
        type: 'text',
        name: 'description',
        label: 'Description',
        localized: true,
      },
      {
        name: 'image',
        type: 'upload',
        relationTo: 'media',
      },
      {
        name: 'backgroundColor',
        type: 'select',
        options: [
          { label: 'Primary', value: 'primary' },
          { label: 'Secondary', value: 'secondary' },
          { label: 'Accent', value: 'accent' },
          { label: 'Muted', value: 'muted' },
        ],
        defaultValue: 'primary',
      },

      link({
        appearances: false,
        disableIcon: true,
        disableLabel: true,
      }),
    ],
  },
]

export const navbar: Field[] = [
  {
    /**
     * Simple sub navigation block structure for navbars 1, 3, and 5
     */
    type: 'blocks',
    name: 'items',
    admin: {
      condition: (_, { designVersion = '' } = {}) => ['1', '3', '5'].includes(designVersion),
      description: 'Navigation structure for navbar designs 1, 3, and 5',
    },
    blocks: [
      {
        slug: 'sub',
        labels: {
          plural: 'Sub Navigation Menus',
          singular: 'Sub Navigation Menu',
        },
        fields: [
          icon(),
          {
            type: 'text',
            name: 'label',
            localized: true,
            required: true,
          },
          {
            type: 'array',
            name: 'subitems',
            label: 'Sub Navigation Items',
            required: true,
            minRows: 2,
            maxRows: 10,
            fields: [
              link({
                appearances: false,
              }),
              {
                type: 'text',
                localized: true,
                name: 'Description',
              },
            ],
          },
        ],
      },
      {
        slug: 'link',
        labels: {
          plural: 'Links',
          singular: 'Link',
        },
        fields: [
          link({
            appearances: false,
          }),
        ],
      },
    ],
  },
  {
    /**
     * Block-based navigation structure for navbar4
     */
    type: 'blocks',
    name: 'richItems',
    label: 'Items',
    admin: {
      condition: (_, { designVersion = '' } = {}) => designVersion === '4',
      description: {
        de: 'Navigationselemente',
        en: 'Navigation elements',
      },
    },
    blocks: [
      {
        slug: 'link',
        labels: {
          plural: 'Links',
          singular: 'Link',
        },
        fields: [
          link({
            appearances: false,
          }),
        ],
      },
      {
        slug: 'submenu',
        labels: {
          plural: 'Submenu Blocks',
          singular: 'Submenu Block',
        },
        fields: [
          icon(),
          {
            type: 'text',
            name: 'label',
            label: 'Menu Label',
            localized: true,
            required: true,
          },
          {
            type: 'blocks',
            name: 'blocks',
            label: 'Submenu Blocks',
            blocks: navSubmenuBlocks,
            required: true,
            minRows: 1,
          },
        ],
      },
    ],
  },
  {
    type: 'array',
    name: 'buttons',
    fields: [link()],
  },
  {
    type: 'text',
    name: 'copyright',
    label: 'Copyright',
    localized: true,
    defaultValue: 'Copyright © All Rights Reserved.',
    admin: {
      condition: (_, { designVersion = '' } = {}) => designVersion === '4',
    },
  },
]
