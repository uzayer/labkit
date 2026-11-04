import type { User } from 'payload'

interface RolePermissions {
  canManageContent?: boolean
  canPublish?: boolean
  canManageUsers?: boolean
  canManageRedirects?: boolean
  [key: string]: boolean | undefined
}

interface Role {
  id?: string
  name?: string
  slug?: string
  permissions?: RolePermissions
}

/**
 * Checks if a user has a specific permission by examining all roles assigned to the user
 * and merging their permissions.
 *
 * @param permissionKey The permission key to check (e.g., 'canManageRedirects')
 * @param user The user object from the request
 * @returns Boolean indicating if the user has the specified permission
 */
export const checkPermission = (permissionKey: string, user?: User | null): boolean => {
  // If no user or no roles, deny access
  if (!user?.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return false
  }

  // Check each role for the permission
  return user.roles.some((role) => {
    // Handle both string IDs and populated role objects
    if (typeof role === 'string') {
      // Cannot check permissions on string IDs since we don't have the role data
      // This should be avoided by using proper population in access control functions
      console.warn(
        'Role ID provided as string, cannot check permissions. Use populated roles instead.',
      )
      return false
    }

    // Check if the role has the specified permission
    return role.permissions && role.permissions[permissionKey] === true
  })
}

/**
 * Creates a function that checks if a user has the specified permission.
 * This is designed to be used directly in Payload's access control configuration.
 *
 * @param permissionKey The permission key to check
 * @returns A function that can be used in Payload's access control
 */
export const hasPermission = (permissionKey: string) => {
  return ({ req }) => {
    if (!req.user) return false
    return checkPermission(permissionKey, req.user)
  }
}

/**
 * Checks if a user has any of the specified permissions by examining all roles
 * assigned to the user and merging their permissions.
 *
 * @param permissionKeys Array of permission keys to check
 * @param user The user object from the request
 * @returns Boolean indicating if the user has any of the specified permissions
 */
export const checkAnyPermission = (permissionKeys: string[], user?: User | null): boolean => {
  return permissionKeys.some((key) => checkPermission(key, user))
}

/**
 * Checks if a user has all of the specified permissions by examining all roles
 * assigned to the user and merging their permissions.
 *
 * @param permissionKeys Array of permission keys to check
 * @param user The user object from the request
 * @returns Boolean indicating if the user has all of the specified permissions
 */
export const checkAllPermissions = (permissionKeys: string[], user?: User | null): boolean => {
  return permissionKeys.every((key) => checkPermission(key, user))
}
