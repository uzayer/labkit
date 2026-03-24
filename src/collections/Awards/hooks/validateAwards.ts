import type { CollectionBeforeChangeHook } from 'payload'

import type { Award } from '../../../payload-types'
import { isValidUrl } from '../../../utilities/validation'

const MIN_YEAR = 1900
const MAX_FUTURE_OFFSET = 5

export const validateAwards: CollectionBeforeChangeHook<Award> = ({ data }) => {
  const errors: string[] = []

  if (data?.url && !isValidUrl(data.url)) {
    errors.push('The award URL must be a valid HTTP/HTTPS link.')
  }

  if (typeof data?.year === 'number') {
    const currentYear = new Date().getFullYear()
    const maxYear = currentYear + MAX_FUTURE_OFFSET

    if (data.year < MIN_YEAR || data.year > maxYear) {
      errors.push(`Year must be between ${MIN_YEAR} and ${maxYear}.`)
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join('\n'))
  }

  return data
}
