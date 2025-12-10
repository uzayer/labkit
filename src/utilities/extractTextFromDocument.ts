import type { Page, Post } from '@/payload-types'
import { extractPlainText } from './richtext'

/**
 * Configuration options for text extraction
 */
export interface TextExtractionOptions {
  /** Maximum length of extracted text (default: unlimited) */
  maxLength?: number
  /** Whether to include metadata in extraction (default: true) */
  includeMetadata?: boolean
  /** Whether to include hero content (default: true) */
  includeHero?: boolean
  /** Whether to include layout blocks (default: true) */
  includeLayout?: boolean
  /** Separator between different text sections (default: ' ') */
  separator?: string
}

/**
 * Extracts plain text content from rich text fields
 */
function extractRichTextContent(richText: any): string {
  if (!richText) return ''
  return extractPlainText(richText, Infinity)
}

/**
 * Extracts text from link objects
 */
function extractLinkText(link: any): string {
  if (!link) return ''
  let text = ''
  
  // Only include the label, not the URL (URLs are not useful for search)
  if (link.label) {
    text += link.label
  }
  
  return text
}

/**
 * Extracts text from an array of links
 */
function extractLinksText(links: any[]): string {
  if (!Array.isArray(links)) return ''
  return links.map(linkItem => extractLinkText(linkItem.link)).join(' ')
}

/**
 * Extracts text from media objects (alt text, captions, etc.)
 */
function extractMediaText(media: any): string {
  if (!media || typeof media === 'string') return ''
  
  let text = ''
  if (media.alt) text += media.alt
  if (media.caption) text += ` ${media.caption}`
  if (media.description) text += ` ${media.description}`
  
  return text
}

/**
 * Extracts text from hero sections
 */
function extractHeroText(hero: any): string {
  if (!hero) return ''
  
  let text = ''
  
  // Extract basic text fields
  if (hero.badge) text += hero.badge + ' '
  if (hero.tagline) text += hero.tagline + ' '
  if (hero.title) text += hero.title + ' '
  if (hero.subtitle) text += hero.subtitle + ' '
  if (hero.description) text += hero.description + ' '
  
  // Extract rich text content
  if (hero.richText) {
    text += extractRichTextContent(hero.richText) + ' '
  }
  
  // Extract links
  if (hero.links) {
    text += extractLinksText(hero.links) + ' '
  }
  
  // Extract media text
  if (hero.image) {
    text += extractMediaText(hero.image) + ' '
  }
  
  if (hero.images && Array.isArray(hero.images)) {
    text += hero.images.map(extractMediaText).join(' ') + ' '
  }
  
  return text.trim()
}

/**
 * Checks if a string looks like unwanted metadata
 */
function isUnwantedMetadata(text: string): boolean {
  if (!text || typeof text !== 'string') return false
  
  const unwantedPatterns = [
    /^\/api\/media\//, // Media API paths
    /^\d+(\.\d+)?(px|rem|em|vh|vw|%)$/, // CSS units
    /^[a-f0-9]{24}$/, // MongoDB ObjectIds
    /^https?:\/\//, // URLs (we handle these separately in links)
    /^\d{4}-\d{2}-\d{2}/, // Dates
    /^image\/\w+$/, // MIME types
    /^\d+x\d+$/, // Dimensions like "1920x1080"
    /^#[a-f0-9]{3,6}$/i, // Hex colors
    /^(left|right|center|top|bottom|middle)$/i, // Alignment values
    /^(true|false)$/i, // Boolean strings
    /^\d+$/, // Pure numbers as strings
  ]
  
  return unwantedPatterns.some(pattern => pattern.test(text.trim()))
}

/**
 * Recursively extracts text from any object or array
 */
function extractTextFromValue(value: any, visited = new Set()): string {
  if (value === null || value === undefined) return ''
  
  // Prevent infinite recursion
  if (typeof value === 'object' && visited.has(value)) return ''
  if (typeof value === 'object') visited.add(value)
  
  // Handle primitive types
  if (typeof value === 'string') {
    // Filter out unwanted metadata
    if (isUnwantedMetadata(value)) return ''
    return value
  }
  if (typeof value === 'number') return value.toString()
  if (typeof value === 'boolean') return value.toString()
  
  // Handle arrays
  if (Array.isArray(value)) {
    return value.map(item => extractTextFromValue(item, visited)).join(' ')
  }
  
  // Handle objects
  if (typeof value === 'object') {
    // Special handling for rich text objects
    if (value.root && value.root.children) {
      return extractRichTextContent(value)
    }
    
    // Special handling for media objects
    if (value.alt || value.caption || value.description) {
      return extractMediaText(value)
    }
    
    // Special handling for link objects
    if (value.label || value.url) {
      return extractLinkText(value)
    }
    
    // Generic object traversal
    let text = ''
    for (const [key, val] of Object.entries(value)) {
      // Skip certain fields that don't contain meaningful text
      if ([
        'id', 'createdAt', 'updatedAt', 'blockType', 'blockName', 'designVersion', 
        'backgroundColor', 'width', 'height', 'size', 'mimeType', 'filename', 
        'filesize', 'url', 'thumbnailURL', 'focalX', 'focalY', 'sizes'
      ].includes(key)) {
        continue
      }
      
      const extracted = extractTextFromValue(val, visited)
      if (extracted) {
        text += extracted + ' '
      }
    }
    return text.trim()
  }
  
  return ''
}

/**
 * Extracts text from layout blocks
 */
function extractLayoutText(layout: any[]): string {
  if (!Array.isArray(layout)) return ''
  
  return layout.map(block => {
    if (!block) return ''
    
    let blockText = ''
    
    // Extract text from all fields in the block
    blockText += extractTextFromValue(block)
    
    return blockText
  }).join(' ')
}

/**
 * Extracts text from metadata
 */
function extractMetaText(meta: any): string {
  if (!meta) return ''
  
  let text = ''
  if (meta.title) text += meta.title + ' '
  if (meta.description) text += meta.description + ' '
  
  return text.trim()
}

/**
 * Main function to extract all text content from a document (Page or Post)
 */
export function extractTextFromDocument(
  doc: Page | Post | any,
  options: TextExtractionOptions = {}
): string {
  const {
    maxLength,
    includeMetadata = true,
    includeHero = true,
    includeLayout = true,
    separator = ' '
  } = options
  
  if (!doc) return ''
  
  const textParts: string[] = []
  
  // Extract basic fields
  if (doc.title) textParts.push(doc.title)
  if (doc.excerpt) textParts.push(doc.excerpt)
  if (doc.tagline) textParts.push(doc.tagline)
  if (doc.description) textParts.push(doc.description)
  
  // Extract metadata
  if (includeMetadata && doc.meta) {
    const metaText = extractMetaText(doc.meta)
    if (metaText) textParts.push(metaText)
  }
  
  // Extract hero content
  if (includeHero && doc.hero) {
    const heroText = extractHeroText(doc.hero)
    if (heroText) textParts.push(heroText)
  }
  
  // Extract layout blocks
  if (includeLayout && doc.layout) {
    const layoutText = extractLayoutText(doc.layout)
    if (layoutText) textParts.push(layoutText)
  }
  
  // Extract rich text content (for posts or other content with richText field)
  if (doc.richText) {
    const richTextContent = extractRichTextContent(doc.richText)
    if (richTextContent) textParts.push(richTextContent)
  }
  
  // Extract content field (common in posts)
  if (doc.content) {
    const contentText = extractTextFromValue(doc.content)
    if (contentText) textParts.push(contentText)
  }
  
  // Join all text parts
  let fullText = textParts.join(separator).trim()
  
  // Remove extra whitespace
  fullText = fullText.replace(/\s+/g, ' ')
  
  // Remove common technical terms that might have slipped through
  const technicalTermsToRemove = [
    'reference', 'url', 'mehr erfahren', 'read more', 'learn more',
    'click here', 'undefined', 'null', 'true', 'false'
  ]
  
  technicalTermsToRemove.forEach(term => {
    const regex = new RegExp(`\\b${term}\\b`, 'gi')
    fullText = fullText.replace(regex, ' ')
  })
  
  // Clean up extra spaces again after removal
  fullText = fullText.replace(/\s+/g, ' ').trim()
  
  // Apply length limit if specified
  if (maxLength && fullText.length > maxLength) {
    fullText = fullText.substring(0, maxLength).trim()
    // Try to end at a word boundary
    const lastSpaceIndex = fullText.lastIndexOf(' ')
    if (lastSpaceIndex > maxLength * 0.8) {
      fullText = fullText.substring(0, lastSpaceIndex)
    }
    fullText += '...'
  }
  
  return fullText
}

/**
 * Extracts searchable keywords from a document
 * This is useful for creating search tags or keywords for better search relevance
 */
export function extractSearchKeywords(
  doc: Page | Post | any,
  options: { minLength?: number; maxKeywords?: number } = {}
): string[] {
  const { minLength = 3, maxKeywords = 50 } = options
  
  const fullText = extractTextFromDocument(doc)
  if (!fullText) return []
  
  // Extract words, filter by length, and remove duplicates
  const words = fullText
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // Replace punctuation with spaces
    .split(/\s+/)
    .filter(word => word.length >= minLength)
    .filter(word => !isCommonWord(word))
  
  // Remove duplicates and limit count
  const uniqueWords = [...new Set(words)]
  return uniqueWords.slice(0, maxKeywords)
}

/**
 * Helper function to filter out common words that don't add search value
 */
function isCommonWord(word: string): boolean {
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by',
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that', 'these',
    'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they', 'me', 'him', 'her', 'us', 'them',
    'my', 'your', 'his', 'her', 'its', 'our', 'their', 'all', 'some', 'any', 'no', 'not'
  ])
  
  return commonWords.has(word)
}
