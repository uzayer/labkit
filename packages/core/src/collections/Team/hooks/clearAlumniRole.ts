import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../types'

/**
 * `alumniRole` only means something while `role` is `alumni`. Clearing it
 * otherwise keeps ADR-0002's rule simple: `role` alone decides the group, and
 * a returning member can't carry a stale "former role" next to a current one.
 */
export const clearAlumniRole: CollectionBeforeChangeHook<Team> = ({ data, originalDoc }) => {
  const role = data.role ?? originalDoc?.role
  if (role !== 'alumni' && (data.alumniRole || originalDoc?.alumniRole)) {
    data.alumniRole = null
  }
  return data
}
