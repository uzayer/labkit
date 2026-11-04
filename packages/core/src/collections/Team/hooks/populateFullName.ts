import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../types'

export const populateFullName: CollectionBeforeChangeHook<Team> = ({ data }) => {
  if (data.firstName || data.middleName || data.lastName) {
    const parts = [data.firstName, data.middleName, data.lastName].filter(Boolean)
    data.name = parts.join(' ').trim()
  }
  return data
}
