import type { CollectionAfterReadHook } from 'payload'
import type { Team } from '../../../types'

export const populateRoleLabel: CollectionAfterReadHook<Team> = async ({ doc }) => {
  if (!doc.role) return doc

  // Map role values to their display labels from the Team collection field options
  const roleLabelMap: Record<string, string> = {
    director: 'Director',
    faculty: 'Faculty Member',
    'research-staff': 'Research Staff',
    'graduate-ra': 'Graduate RA',
    'undergraduate-ra': 'Undergraduate RA',
    alumni: 'Alumni',
    'interdisciplinary-collaborator': 'Interdisciplinary Collaborator',
    'external-collaborator': 'External Collaborator',
  }

  const roleLabel = roleLabelMap[doc.role] || doc.role

  return {
    ...doc,
    roleLabel,
  }
}
