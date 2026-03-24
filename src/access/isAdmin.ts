import { checkRole } from '@/utilities/checkRole'
import { Access, ClientUser, FieldAccess } from 'payload'
import { User } from '@/payload-types'

export const isAdmin: Access = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

export const isAdminFieldLevel: FieldAccess = ({ req: { user } }) => {
  return checkRole(['admin'], user)
}

// For Payload admin UI and frontend components
export const isAdminHidden = ({ user }: { user: ClientUser | User }): boolean => {
  // for isAdminHidden, payload suddendly shows a different type (ClientUser), but the
  // data is actually the same..
  const typedUser = user as unknown as User
  return !checkRole(['admin'], typedUser)
}
