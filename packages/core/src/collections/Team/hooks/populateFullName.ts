import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../types'

type NameParts = { firstName?: unknown; middleName?: unknown; lastName?: unknown }

export const composeFullName = (data: NameParts): string | undefined => {
  const parts = [data.firstName, data.middleName, data.lastName].filter(
    (part): part is string => typeof part === 'string' && part.trim() !== '',
  )
  return parts.length ? parts.join(' ').trim() : undefined
}

export const populateFullName: CollectionBeforeChangeHook<Team> = ({ data }) => {
  const name = composeFullName(data)
  if (name) data.name = name
  return data
}
