import { GlobalConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { revalidatePageConfig } from './hooks/revalidatePageConfig'

export const PageConfig: GlobalConfig = {
  slug: 'page-config',
  access: {
    read: () => true,
    update: isAdmin,
  },
  hooks: {
    afterChange: [revalidatePageConfig],
  },
  versions: {
    drafts: false,
  },
  fields: [
    {
      name: 'defaultMeta',
      type: 'group',
      label: 'Default Meta Information',
      localized: true,
      admin: {
        description: {
          en: 'Default meta information used as fallback when no specific meta is provided',
          de: 'Standardmetainformationen, die als Fallback verwendet werden, wenn keine spezifische Meta-Informationen vorhanden sind.',
        },
      },
      fields: [
        {
          name: 'title',
          type: 'text',
          label: 'Default Page Title',
          required: true,
        },
        {
          name: 'description',
          type: 'textarea',
          label: 'Default Meta Description',
          required: true,
        },
      ],
    },
    {
      name: 'openGraph',
      type: 'group',
      label: 'OpenGraph Settings',
      fields: [
        {
          name: 'backgroundImage',
          type: 'upload',
          localized: true,
          label: 'OpenGraph Background Image',
          relationTo: 'media',
          admin: {
            description: {
              en: 'This background image will be used to render OpenGraph images for every page. Use the aspect ratio 1200x630.',
              de: 'Dieses Hintergrundbild wird für die Generierung von OpenGraph-Images für jede Seite verwendet. Am besten mit 1200x630 Pixeln.',
            },
          },
          validate: (value) => {
            if (!value) return true
            const { width, height } = value
            if (width < 1200 || height < 630) {
              return 'Image must be at least 1200x630 pixels'
            }
            return true
          },
        },

        {
          type: 'text',
          name: 'textColor',
          admin: {
            description: {
              en: 'Choose a color for the overlay text of the OpenGraph image (HEX)',
              de: 'Wählen Sie eine Farbe für den Text des OpenGraph-Images',
            },
          },
          defaultValue: '#000000',
        },
        {
          name: 'textPosition',
          type: 'select',
          label: 'Text Position',
          defaultValue: 'center',
          options: [
            {
              label: 'Top',
              value: 'top',
            },
            {
              label: 'Center',
              value: 'center',
            },
            {
              label: 'Bottom',
              value: 'bottom',
            },
            {
              label: 'Left',
              value: 'left',
            },
            {
              label: 'Right',
              value: 'right',
            },
          ],
        },
      ],
    },
  ],
}
