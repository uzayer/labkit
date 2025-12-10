import { BeforeSync, DocToSync } from '@payloadcms/plugin-search/types'
import { extractTextFromDocument, extractSearchKeywords } from '@/utilities/extractTextFromDocument'
import { Page, Post } from '@/payload-types'

export const beforeSyncWithSearch: BeforeSync = async ({ originalDoc, searchDoc }) => {
  const {
    doc: { relationTo: collection },
  } = searchDoc

  if (collection === 'pages') {
    const { slug, id, title, meta } = originalDoc as Page

    // Extract full text content from the document for search indexing
    const extractedText = extractTextFromDocument(originalDoc, {
      maxLength: 5000, // Limit to 5000 characters for search index
      includeMetadata: true,
      includeHero: true,
      includeLayout: true,
    })

    // Extract keywords for better search relevance
    const searchKeywords = extractSearchKeywords(originalDoc, {
      minLength: 3,
      maxKeywords: 30,
    })

    const modifiedDoc: DocToSync = {
      ...searchDoc,
      slug,
      meta: {
        ...meta,
        title: meta?.title || title,
        description: meta?.description,
        extractedText,
        // Add extracted content for search indexing
        searchKeywords: searchKeywords.join(' '), // Join keywords as a searchable string
      },
    }

    return modifiedDoc
  }
  if (collection === 'posts') {
    const { slug, title, meta } = originalDoc as Post

    // Extract full text content from the document for search indexing
    const extractedText = extractTextFromDocument(originalDoc, {
      maxLength: 5000, // Limit to 5000 characters for search index
      includeMetadata: true,
      includeHero: true,
      includeLayout: true,
    })

    // Extract keywords for better search relevance
    const searchKeywords = extractSearchKeywords(originalDoc, {
      minLength: 3,
      maxKeywords: 30,
    })

    const modifiedDoc: DocToSync = {
      ...searchDoc,
      slug,
      meta: {
        ...meta,
        title: meta?.title || title,
        description: meta?.description,
        extractedText,
      },
      // Add extracted content for search indexing
      searchKeywords: searchKeywords.join(' '), // Join keywords as a searchable string
    }

    return modifiedDoc
  }
  return searchDoc
}
