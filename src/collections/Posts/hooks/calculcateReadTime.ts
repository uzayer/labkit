import { Post } from '@/payload-types'
import { CollectionBeforeChangeHook } from 'payload'

/**
 * This hook calculates the average read time of a post based on the number of words and the average reading speed.
 * For rich text content, we extract text from the content object and count words.
 *
 * Using beforeChange hook ensures the readTime is saved to the database.
 */
export const calculateReadTime: CollectionBeforeChangeHook<Post> = ({
  data, // Use data instead of doc for beforeChange hook
}) => {
  // Extract text content from rich text field
  let textContent = ''

  if (data.content) {
    // Convert the rich text content to a string representation
    // This is a simplified approach - for more accurate word counting,
    // you might need a more sophisticated parser based on your rich text structure
    textContent = JSON.stringify(data.content)
      .replace(/[{\[\]},":]/g, ' ') // Remove JSON syntax
      .replace(/\s+/g, ' ') // Normalize whitespace
  }

  const words = textContent.split(' ').length

  // Average reading speed: 200 words per minute
  const readTime = Math.max(1, Math.ceil(words / 200))

  // Update the data object with the calculated readTime
  return {
    ...data,
    readTime,
  }
}
