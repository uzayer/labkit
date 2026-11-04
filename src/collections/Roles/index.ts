import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { authenticated } from '@/access/authenticated'

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    description: {
      en: 'Manage user roles and their permissions',
    },
  },
  access: {
    create: isAdmin,
    read: authenticated,
    update: isAdmin,
    delete: isAdmin,
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'The name of the role (e.g., Admin, Editor)',
        },
      },
    },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description: {
          en: 'The identifier for the role (e.g., admin, editor)',
        },
      },
      hooks: {
        beforeValidate: [
          ({ value, data }) => {
            if (!value && data?.name) {
              return data.name
                .toLowerCase()
                .replace(/\s+/g, '-')
                .replace(/[^a-z0-9-]/g, '')
            }
            return value
          },
        ],
      },
    },
    {
      name: 'description',
      type: 'textarea',
      admin: {
        description: {
          en: 'A description of what this role can do',
        },
      },
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        description: {
          en: 'Role permissions',
        },
      },
      fields: [
        {
          name: 'canManageContent',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: {
              en: 'Can create and edit content',
            },
          },
        },
        {
          name: 'canPublish',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: {
              en: 'Can publish content',
            },
          },
        },
        {
          name: 'canManageUsers',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: {
              en: 'Can manage users',
            },
          },
        },
        {
          /**
           * Redirects can be misused, so we adding a separate permission for it.
           */
          name: 'canManageRedirects',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description: {
              en: 'Can manage redirects',
            },
          },
        },
      ],
    },
  ],
  timestamps: true,
  versions: false,
  authorship: false,
}

export default Roles
