import type { CollectionBeforeChangeHook } from 'payload'
import type { Publication } from '../../../payload-types'
import { isValidUrl } from '../../../utilities/validation'

const MIN_YEAR = 1900
const MAX_FUTURE_OFFSET = 5

// DOI format validation regex
const DOI_REGEX = /^10\.\d{4,}\/[-._;()\/:a-zA-Z0-9]+$/

export const validatePublications: CollectionBeforeChangeHook<Publication> = ({ data, req }) => {
  const errors: string[] = []

  // Mongo's unique index treats "" as a value, so two DOI-less publications
  // would collide on a shared empty string. Normalize to undefined so the
  // sparse unique index only applies to publications that actually have one.
  if (data?.doi === '') {
    data.doi = undefined
  }
  if (data?.openalex_id === '') {
    data.openalex_id = undefined
  }

  if (data?.externalUrl && !isValidUrl(data.externalUrl)) {
    errors.push('The External URL must be a valid URL.')
  }

  if (typeof data?.year === 'number') {
    const currentYear = new Date().getFullYear()
    const maxYear = currentYear + MAX_FUTURE_OFFSET

    if (data.year < MIN_YEAR || data.year > maxYear) {
      errors.push(`Year must be between ${MIN_YEAR} and ${maxYear}.`)
    }
  }

  // Validate publicationDate if provided
  if (data?.publicationDate) {
    const publicationDate = new Date(data.publicationDate)
    const currentDate = new Date()
    const maxDate = new Date()
    maxDate.setFullYear(currentDate.getFullYear() + MAX_FUTURE_OFFSET)
    const minDate = new Date(`${MIN_YEAR}-01-01`)

    if (isNaN(publicationDate.getTime())) {
      errors.push('Publication date must be a valid date.')
    } else if (publicationDate < minDate || publicationDate > maxDate) {
      errors.push(`Publication date must be between ${MIN_YEAR} and ${maxDate.getFullYear()}.`)
    }
  }

  // Validate DOI format if provided
  if (data?.doi && typeof data.doi === 'string' && data.doi.trim() !== '') {
    if (!DOI_REGEX.test(data.doi.trim())) {
      errors.push('DOI must be in valid format (e.g., 10.1000/182). Expected format: 10.XXXX/...')
    }
  }

  if (errors.length > 0) {
    throw new Error(errors.join(' \n'))
  }

  return data
}
