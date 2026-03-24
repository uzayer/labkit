import type { CollectionBeforeChangeHook } from 'payload'
import type { Team } from '../../../payload-types'
import { isValidUrl } from '../../../utilities/validation'

export const validateTeamMembers: CollectionBeforeChangeHook<Team> = ({ data }) => {
  const errors: string[] = []

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
