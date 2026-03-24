import type { CollectionBeforeChangeHook } from 'payload'
import type { ResearchTheme } from '../../../payload-types'

export const validateResearchThemes: CollectionBeforeChangeHook<ResearchTheme> = ({ data }) => {
  if (typeof data?.shortDescription === 'string' && data.shortDescription.length > 500) {
    throw new Error('The short description cannot exceed 500 characters.')
  }
  return data
}
