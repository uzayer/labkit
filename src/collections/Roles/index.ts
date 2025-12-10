import type { CollectionConfig } from 'payload'
import { isAdmin } from '@/access/isAdmin'
import { authenticated } from '@/access/authenticated'

const Roles: CollectionConfig = {
  slug: 'roles',
  admin: {
    useAsTitle: 'name',
    description: {
      en: 'Manage user roles and their permissions',
      de: 'Verwalten Sie Benutzerrollen und deren Berechtigungen',
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
          de: 'Der Name der Rolle (z.B. Admin, Editor)',
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
          de: 'Die Kennung für die Rolle (z.B. admin, editor)',
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
          de: 'Eine Beschreibung der Berechtigungen dieser Rolle',
        },
      },
    },
    {
      name: 'permissions',
      type: 'group',
      admin: {
        description: {
          en: 'Role permissions',
          de: 'Rollenberechtigungen',
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
              de: 'Kann Inhalte erstellen und bearbeiten',
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
              de: 'Kann Inhalte veröffentlichen',
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
              de: 'Kann Benutzer verwalten',
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
              de: 'Kann Redirects verwalten.',
            },
          },
        },
      ],
    },
  ],
  timestamps: true,
}

export default Roles
