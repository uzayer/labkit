import type { CollectionConfig } from 'payload'
import { authenticated } from '@/access/authenticated'
import { isAdmin, isAdminFieldLevel } from '@/access/isAdmin'
import { isAdminOrSelf } from '@/access/isAdminOrCreatedBy'
import { checkRole } from '@/utilities/checkRole'

async function findRole(payload: any, slug: string) {
  const { docs } = await payload.find({
    collection: 'roles',
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return docs[0] || null
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  access: {
    create: isAdmin,
    read: authenticated,
    update: isAdminOrSelf,
    delete: isAdminOrSelf,
    /**
     * Limit the access to the admin dashboard here
     */
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  hooks: {
    beforeValidate: [
      async ({ req, data = {}, operation }) => {
        if (operation === 'create') {
          try {
            // If roles are already set in the data (e.g., from admin dashboard), don't override them
            if (data.roles && Array.isArray(data.roles) && data.roles.length > 0) {
              req.payload.logger.info('User already has roles assigned, keeping existing roles')
              return data
            }

            const { totalDocs } = await req.payload.find({
              collection: 'users',
              limit: 0,
            })

            // Determine which role to assign. First user should be admin. Emails with domain
            // in ALLOWED_EMAIL_DOMAINS will be assigned admin as well
            const isAdmin =
              totalDocs === 0 ||
              (data.email &&
                process.env.ALLOWED_EMAIL_DOMAINS?.split(',').includes(data.email.split('@')[1]))

            // Find the appropriate role
            const role = await findRole(req.payload, isAdmin ? 'admin' : 'editor')

            if (role?.id) {
              req.payload.logger.info(`Assigning ${role.name}, id: ${role.id} role to new user`)
              return {
                ...data,
                roles: [role.id],
              }
            } else {
              req.payload.logger.error('No suitable role found for user')
            }
          } catch (error) {
            req.payload.logger.error(`Error in beforeValidate hook: ${error}`)
          }
        }
        return data
      },
    ],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
    },
    {
      name: 'roles',
      type: 'relationship',
      relationTo: 'roles',
      hasMany: true,
      required: false,
      saveToJWT: true,
      access: {
        create: () => true,
        update: isAdminFieldLevel,
        read: () => true,
      },
      admin: {
        position: 'sidebar',
        description: {
          en: 'User roles. Admin has full access. Editor is the most common role, with limited access. First user is always admin.',
          de: 'Benutzerrollen. Admin hat vollständigen Zugriff. Editor ist der allgemeine Benutzer, mit begrenztem Zugriff. Erster Benutzer ist immer Admin.',
        },
        // This field will be hidden in the create first user dialog
        // but visible when editing users or creating subsequent users
        condition: (_, __, ctx) => !!ctx.user?.id,
      },
    },
    {
      name: 'sub',
      type: 'text',
      admin: {
        description: 'This is the Oauth2 sub field',
        hidden: true,
      },
      index: true,
      access: {
        update: isAdminFieldLevel,
      },
    },
  ],
  timestamps: true,
}

export default Users
