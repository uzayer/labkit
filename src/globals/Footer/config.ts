import type { GlobalConfig } from 'payload'

import { link } from '@/fields/link'
import { revalidateFooter } from './hooks/revalidateFooter'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { socialIcon } from '@/components/SocialIcon/config'
import { backgroundColor } from '@/fields/color'
import { authenticated } from '@/access/authenticated'

export const Footer: GlobalConfig = {
  slug: 'footer',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    description: 'Theme configuration (For live preview config has to be saved)',
    livePreview: {
      url: ({ req }) => {
        const path = generatePreviewPath({
          slug: 'home',
          breadcrumbs: undefined,
          collection: 'pages',
          locale: 'en',
          req,
        })

        return `${NEXT_PUBLIC_SERVER_URL}${path}`
      },
    },
    preview: () => {
      const path = generatePreviewPath({
        slug: 'home',
        breadcrumbs: undefined,
        collection: 'pages',
        locale: 'en',
      })

      return `${NEXT_PUBLIC_SERVER_URL}${path}`
    },
  },
  fields: [
    backgroundColor,
    {
      name: 'designVersion',
      type: 'select',
      options: ['1', '2', '3', '4', '5', '6', '7', '8'],
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
    },
    {
      name: 'copyright',
      type: 'text',
      localized: true,
      label: 'Copyright',
      defaultValue: 'Company Name. All rights reserved.',
    },
    /**
     * A subline to display under the logo. Only design options 6,7,8 have this field.
     */
    {
      name: 'subline',
      type: 'text',
      localized: true,
      label: 'Subline',
      defaultValue:
        'Components made easy. This cool starter template will help you get started with your next project.',
      admin: {
        condition: (_, siblingData) =>
          siblingData.designVersion === '2' ||
          siblingData.designVersion === '6' ||
          siblingData.designVersion === '7' ||
          siblingData.designVersion === '8',
      },
    },
    /**
     * Legal links like imprint, privacy policy, etc. that are displayed at the bottom of the footer.
     */
    {
      name: 'legalLinks',
      label: {
        de: 'Rechtliches',
        en: 'Legal Links',
      },
      admin: {
        description: {
          de: 'Legale Links wie Impressum, Datenschutzerklärung, etc.',
          en: 'Legal links like imprint, privacy policy, etc.',
        },
        condition: (_, siblingData) => {
          const version = siblingData?.designVersion
          return (
            version === '1' ||
            version === '2' ||
            version === '3' ||
            version === '4' ||
            version === '6' ||
            version === '7'
          )
        },
      },
      type: 'array',
      fields: [
        link({
          appearances: false,
          disableIcon: true,
        }),
      ],
      maxRows: 3,
    },
    /**
     * Social media links that are displayed in the footer
     */
    {
      name: 'socialLinks',
      type: 'array',
      label: {
        en: 'Social Media Links',
        de: 'Social Media Links',
      },
      admin: {
        description: {
          en: 'Add social media links with icons',
          de: 'Fügen Sie Social Media Links mit Icons hinzu',
        },
        condition: (_, siblingData) => {
          const version = siblingData?.designVersion
          return (
            version === '1' ||
            version === '3' ||
            version === '4' ||
            version === '5' ||
            version === '6' ||
            version === '7' ||
            version === '8'
          )
        },
      },
      fields: [
        {
          type: 'row',
          fields: [
            socialIcon,
            {
              name: 'url',
              type: 'text',
              localized: true,
              required: true,
              admin: {
                placeholder: 'https://...',
              },
            },
          ],
        },
      ],
    },
    {
      name: 'navItems',
      type: 'array',
      fields: [
        {
          name: 'title',
          type: 'text',
          localized: true,
          required: true,
        },
        {
          name: 'subNavItems',
          type: 'array',
          fields: [
            link({
              appearances: false,
            }),
          ],
          maxRows: 6,
        },
      ],
      maxRows: 3,
    },
  ],
  hooks: {
    afterChange: [revalidateFooter],
  },
}
