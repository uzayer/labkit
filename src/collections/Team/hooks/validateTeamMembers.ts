import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../payload-types'
import { isValidUrl } from '../../../utilities/validation'

export const validateTeamMembers: CollectionBeforeChangeHook<Team> = ({ data }) => {
  const errors: string[] = []

  // Empty string is a real value on a sparse unique index and would collide
  // across every team member without one — normalize to undefined instead.
  if (data?.orcid === '') {
    data.orcid = undefined
  }
  if (data?.openalex_id === '') {
    data.openalex_id = undefined
  }

  if (Array.isArray(data?.socials)) {
    data.socials.forEach((social) => {
      if (social?.url && !isValidUrl(social.url)) {
        errors.push(`The URL for ${social?.platform || 'social link'} is not a valid URL.`)
      }
    })
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' \n'))
  }

  return data
}
