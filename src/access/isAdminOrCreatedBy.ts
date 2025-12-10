import type { Access } from 'payload'
import { checkRole } from '../utilities/checkRole'

/**
 * Allow admins and the user themselves to access documents
 * For collections with createdBy field
 * @param param0
 * @returns
 */
export const isAdminOrCreatedBy: Access = ({ req: { user } }) => {
  // If no user, deny access
  if (!user) return false

  // Return true if user has role of 'admin'
  if (checkRole(['admin'], user)) {
    return true
  }

  // Otherwise, only provide access to documents created by the user
  return {
    createdBy: {
      equals: user.id,
    },
  }
}

/**
 * Allow admins and users to access their own user records
 * For the Users collection (auth collection) which doesn't have createdBy field
 * @param param0
 * @returns
 */
export const isAdminOrSelf: Access = ({ req: { user } }) => {
  // If no user, deny access
  if (!user) return false

  // Return true if user has role of 'admin'
  if (checkRole(['admin'], user)) {
    return true
  }

  // Otherwise, only provide access to the user's own record
  return {
    id: {
      equals: user.id,
    },
  }
}

// Field level access control
export const isAdminOrCreatedByFieldLevel = ({ req: { user } }) => {
  if (!user) return false
  return checkRole(['admin'], user) || Boolean(user.id)
}
