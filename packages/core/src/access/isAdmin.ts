import { checkRole } from '../utilities/checkRole'
import { Access, AuthenticatedUser, FieldAccess } from 'payload'
import { User } from '../types'

export const isAdmin: Access = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

// For Payload admin UI and frontend components
export const isAdminHidden = ({ user }: { user: AuthenticatedUser | User | null }): boolean => {
  // for isAdminHidden, payload suddendly shows a different type (AuthenticatedUser), but the
  // data is actually the same..
  const typedUser = user as unknown as User
  return !checkRole(['admin'], typedUser)
}
