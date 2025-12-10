import type { GlobalConfig } from 'payload'

import { revalidateHeader } from './hooks/revalidateHeader'
import { navbar } from './navbar/navbar.config'
import { generatePreviewPath } from '@/utilities/generatePreviewPath'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'
import { backgroundColor } from '@/fields/color'
import { authenticated } from '@/access/authenticated'

export const Header: GlobalConfig = {
  slug: 'header',
  access: {
    read: () => true,
    update: authenticated,
  },
  admin: {
    description: 'Theme configuration (For live preview config has to be saved)',
    livePreview: {
      url: () => {
        const path = generatePreviewPath({
          slug: 'home',
          breadcrumbs: undefined,
          collection: 'pages',
          locale: 'en',
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
      options: [
        {
          label: '1 (left aligned)',
          value: '1',
        },

        // '3' is not implemented yet because of the complex mobile menu
        // {
        //   label: "3 (centered)",
        //   value: "3"
        // },

        {
          label: '4 (multi block submenus)',
          value: '4',
        },

        {
          label: '5 (simple)',
          value: '5',
        },
      ],
      defaultValue: '1',
      required: true,
    },
    {
      name: 'isSearchEnabled',
      type: 'checkbox',
      defaultValue: false,
    },
    {
      name: 'logo',
      type: 'upload',
      relationTo: 'media',
      required: true,
    },
    ...navbar,
  ],
  hooks: {
    afterChange: [revalidateHeader],
  },
}
