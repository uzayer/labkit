import { User } from '@/payload-types'

/**
 * Check if the author is a User object and return the full user object
 * Returns the user object if it's a valid User, otherwise undefined
 */
export const getAuthorObject = (author: string | User | undefined): User | undefined => {
  if (typeof author === 'object' && author !== null && 'name' in author) {
    return author
  }
  return undefined
}

/**
 * Get author name based on author data
 */
export const getAuthorName = (author: string | User | undefined): string => {
  const authorObj = getAuthorObject(author)

  if (authorObj) {
    return authorObj.name || ''
  }

  if (typeof author === 'string') {
    return author
  }

  return ''
}
