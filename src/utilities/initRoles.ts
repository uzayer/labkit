import { Payload } from 'payload'

const defaultRoles = [
  {
    name: 'Admin',
    slug: 'admin',
    description: 'Full access to all features',
    permissions: {
      canManageContent: true,
      canPublish: true,
      canManageUsers: true,
      canManageRedirects: true,
    },
  },
  {
    name: 'Editor',
    slug: 'editor',
    description: 'Can create and edit content',
    permissions: {
      canManageContent: true,
      canPublish: false,
      canManageUsers: false,
      canManageRedirects: false,
    },
  },
]

const initRoleCreation = async (payload: Payload) => {
  for (const role of defaultRoles) {
    try {
      await payload.create({
        collection: 'roles',
        data: role,
      })
    } catch (error) {
      payload.logger.error(`Error creating role ${role.name}: ${error}`)
    }
  }

  // Verify roles were created
  const { docs: createdRoles } = await payload.find({
    collection: 'roles',
    limit: 10,
  })
  payload.logger.info(`Created roles: ${createdRoles.map((r) => r.name)}`)
}

export async function initializeRoles(payload: Payload): Promise<void> {
  try {
    // Check if any roles exist
    const { totalDocs } = await payload.find({
      collection: 'roles',
      limit: 0,
    })

    // Create default roles if they are not yet created
    if (totalDocs < defaultRoles.length) {
      payload.logger.info('No roles found, creating defaults...')
      // we wait a bit to make sure, that we dont run into mongoDB "Unable to write to collection 'XX.roles' due to catalog changes;"
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Create roles. Retry one time if it fails
      try {
        await initRoleCreation(payload)
      } catch (error) {
        payload.logger.error(`Error creating roles, retrying one time: ${error}`)
        await new Promise((resolve) => setTimeout(resolve, 4000))
        await initRoleCreation(payload)
      }
    }
  } catch (error) {
    payload.logger.error(`Error initializing roles: ${error}`)
    // When the role creation fails, we should fail the entire process,
    // as the first user has no permissions otherwise
    throw error
  }
}
