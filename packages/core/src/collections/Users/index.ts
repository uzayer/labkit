import type { CollectionConfig } from 'payload'
import { authenticated } from '../../access/authenticated'
import { isAdmin, isAdminFieldLevel } from '../../access/isAdmin'
import { isAdminOrSelf } from '../../access/isAdminOrCreatedBy'
import { checkRole } from '../../utilities/checkRole'

const SKIP_USER_ROLE_SYNC = 'skipUserRoleSync'

async function findRole(payload: any, slug: string) {
  const { docs } = await payload.find({
    collection: 'roles',
    limit: 1,
    overrideAccess: true,
    where: {
      slug: {
        equals: slug,
      },
    },
  })
  return docs[0] || null
}

function hasAdminRole(user: { roles?: unknown[] | null }) {
  return checkRole(['admin'], user as any)
}

function getCreatedAtTimestamp(user: { createdAt?: string | null }) {
  return user.createdAt ? new Date(user.createdAt).getTime() : 0
}

function getOldestUser<T extends { createdAt?: string | null; id: number | string }>(users: T[]) {
  return [...users].sort((a, b) => {
    const timestampDifference = getCreatedAtTimestamp(a) - getCreatedAtTimestamp(b)

    if (timestampDifference !== 0) {
      return timestampDifference
    }

    return String(a.id).localeCompare(String(b.id))
  })[0]
}

async function listUsersForAdminChecks(req: any) {
  const { docs } = await req.payload.find({
    collection: 'users',
    depth: 1,
    limit: 1000,
    overrideAccess: true,
  })

  return docs
}

const Users: CollectionConfig = {
  slug: 'users',
  auth: {
    // Payload 4 defaults this to 0. hasPermission() needs req.user's roles populated,
    // so keep 3.x's behaviour of loading the user at the default depth.
    depth: 2,
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
  },
  admin: {
    defaultColumns: ['name', 'email'],
    useAsTitle: 'name',
  },
  access: {
    create: isAdmin,
    read: authenticated,
    update: isAdminOrSelf,
    delete: isAdmin,
    /**
     * Limit the access to the admin dashboard here
     */
    admin: ({ req: { user } }) => checkRole(['admin', 'editor'], user),
  },
  hooks: {
    beforeValidate: [
      async ({ context, req, data = {}, operation }) => {
        if (context[SKIP_USER_ROLE_SYNC]) {
          return data
        }

        if (operation === 'create') {
          try {
            const requesterIsAdmin = checkRole(['admin'], req.user as any)

            // Allow explicit role assignment only for admins creating users intentionally.
            if (
              requesterIsAdmin &&
              data.roles &&
              Array.isArray(data.roles) &&
              data.roles.length > 0
            ) {
              req.payload.logger.info('User already has roles assigned, keeping existing roles')
              return data
            }

            const role = await findRole(req.payload, 'editor')

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
    beforeChange: [
      async ({ context, data, operation, originalDoc, req }) => {
        if (context[SKIP_USER_ROLE_SYNC] || operation !== 'update' || !originalDoc) {
          return data
        }

        if (!hasAdminRole(originalDoc)) {
          return data
        }

        const nextRoles = Array.isArray(data.roles) ? data.roles : originalDoc.roles

        if (hasAdminRole({ roles: nextRoles as unknown[] })) {
          return data
        }

        const users = await listUsersForAdminChecks(req)
        const hasOtherAdmin = users.some(
          (user: any) => user.id !== originalDoc.id && hasAdminRole(user),
        )

        if (!hasOtherAdmin) {
          throw new Error('Cannot remove the admin role from the last admin user.')
        }

        return data
      },
    ],
    afterChange: [
      async ({ context, doc, operation, req }) => {
        if (context[SKIP_USER_ROLE_SYNC] || operation !== 'create') {
          return doc
        }

        const users = await listUsersForAdminChecks(req)

        if (users.some((user: any) => hasAdminRole(user))) {
          return doc
        }

        const oldestUser = getOldestUser(users)

        if (!oldestUser || oldestUser.id !== doc.id) {
          return doc
        }

        const adminRole = await findRole(req.payload, 'admin')

        if (!adminRole?.id) {
          throw new Error('No admin role found for initial user bootstrap.')
        }

        await req.payload.update({
          collection: 'users',
          id: doc.id,
          data: {
            roles: [adminRole.id],
          },
          depth: 0,
          overrideAccess: true,
          context: {
            ...context,
            [SKIP_USER_ROLE_SYNC]: true,
          },
        })

        return doc
      },
    ],
    beforeDelete: [
      async ({ id, req }) => {
        if (req.user?.id === id) {
          throw new Error('Users cannot delete their own account.')
        }

        const targetUser = await req.payload.findByID({
          collection: 'users',
          id,
          depth: 1,
          overrideAccess: true,
        })

        if (!hasAdminRole(targetUser)) {
          return
        }

        const users = await listUsersForAdminChecks(req)
        const hasOtherAdmin = users.some((user: any) => user.id !== id && hasAdminRole(user))

        if (!hasOtherAdmin) {
          throw new Error('Cannot delete the last admin user.')
        }
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
        create: ({ req: { user } }) => !user || checkRole(['admin'], user as any),
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
  versions: false,
  authorship: false,
}

export default Users
