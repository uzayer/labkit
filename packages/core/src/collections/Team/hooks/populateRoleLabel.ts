import type { CollectionAfterReadHook } from 'payload'
import type { Team } from '../../../types'
import { TEAM_ROLE_LABELS } from '../roles'

export const populateRoleLabel: CollectionAfterReadHook<Team> = async ({ doc }) => {
  if (!doc.role) return doc

  return {
    ...doc,
    roleLabel: TEAM_ROLE_LABELS[doc.role] || doc.role,
  }
}
