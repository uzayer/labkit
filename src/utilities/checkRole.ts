import type { User } from '@/payload-types'

export const checkRole = (allRoles: string[] = [], user?: User | null): boolean => {
  if (!user?.roles) return false

  const userRoles = user.roles
    .map((role) => {
      if (typeof role === 'string') {
        return role
      }
      // Handle both direct slug access and relationship format
      return role.slug || role
    })
    .filter(Boolean)

  return allRoles.some((role) => userRoles.includes(role))
}
