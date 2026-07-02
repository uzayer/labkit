'use server'

import { getPayload, PaginatedDocs } from 'payload'
import config from '@payload-config'
import { Search } from '@/payload-types'

const configPromise = config

function logSearchEvent(
  level: 'warn' | 'error',
  event: string,
  metadata?: Record<string, unknown>,
) {
  console[level](`[search] ${event}`, metadata ?? {})
}

function matchesSearchQuery(doc: Search, query: string): boolean {
  const queryLower = query.toLowerCase()
  const title = (doc.title || '').toLowerCase()
  const extractedText = (doc.meta?.extractedText || '').toLowerCase()
  const metaTitle = (doc.meta?.title || '').toLowerCase()
  const metaDescription = (doc.meta?.description || '').toLowerCase()

  return (
    title.includes(queryLower) ||
    extractedText.includes(queryLower) ||
    metaTitle.includes(queryLower) ||
    metaDescription.includes(queryLower)
  )
}

function toSearchResult(doc: Search): SearchResult {
  const collection = doc.doc?.relationTo || 'pages'
  const slug = doc.slug || ''
  const url = collection === 'posts' ? `/posts/${slug}` : `/${slug}`
  const categories =
    doc.categories
      ?.filter(
        (
          category,
        ): category is { relationTo?: string | null; id?: string | null; title?: string | null } =>
          Boolean(category?.relationTo && category?.id && category?.title),
      )
      .map((category) => ({
        relationTo: category.relationTo!,
        id: category.id!,
        title: category.title!,
      })) || undefined

  return {
    id: doc.id,
    title: doc.title || doc.meta?.title || '',
    description: doc.meta?.description || '',
    slug,
    url,
    type: collection,
    meta: doc.meta,
    categories,
    updatedAt: doc.updatedAt,
  }
}

export interface SearchResult {
  id: string
  title: string
  description?: string
  slug: string
  url: string
  type: string
  meta?: Search['meta']
  categories?: Array<{
    relationTo: string
    id: string
    title: string
  }>
  updatedAt?: string
}

export interface SearchResponse {
  results: SearchResult[]
  totalDocs: number
  error?: string
  message?: string
}

function getFallbackFetchLimit(limit: number): number {
  return Math.min(Math.max(limit * 3, limit), 50)
}

function shouldUseInMemoryFallback(error: unknown): boolean {
  const message = error instanceof Error ? error.message.toLowerCase() : ''

  return ['contains', 'field', 'operator', 'path', 'query', 'where', 'search'].some((term) =>
    message.includes(term),
  )
}

export async function search(query?: string, limit: number = 10): Promise<SearchResponse> {
  try {
    // If no query, return recent items (initial results)
    if (!query || query.trim().length === 0) {
      const payload = await getPayload({ config: configPromise })

      try {
        const recentResults = await payload.find({
          collection: 'search',
          overrideAccess: false,
          limit: 5,
          sort: '-updatedAt',
        })

        const results: SearchResult[] = recentResults.docs.map(toSearchResult)

        return {
          results,
          totalDocs: recentResults.totalDocs,
        }
      } catch (error) {
        logSearchEvent('error', 'recent_results_failed', { error })
        return {
          results: [],
          totalDocs: 0,
        }
      }
    }

    const payload = await getPayload({ config: configPromise })

    // Check if search collection exists
    const collections = payload.config.collections.map((col) => col.slug)
    if (!collections.includes('search')) {
      return {
        error: 'Search collection not found',
        message: 'The search plugin may not be properly configured',
        results: [],
        totalDocs: 0,
      }
    }

    // Try to get a count first to verify the collection is accessible
    try {
      await payload.find({
        collection: 'search',
        overrideAccess: false,
        limit: 1,
      })
    } catch (testError) {
      logSearchEvent('error', 'collection_access_failed', { error: testError })
      return {
        error: 'Cannot access search collection',
        message: testError instanceof Error ? testError.message : 'Unknown error',
        results: [],
        totalDocs: 0,
      }
    }

    // Search in the search collection
    // First, try a simple query on the title field
    // If that works, we can expand to other fields
    let searchResults: PaginatedDocs<Search>
    try {
      searchResults = await payload.find({
        collection: 'search',
        overrideAccess: false,
        limit: limit * 2, // Get more results to filter in memory
        where: {
          or: [
            {
              title: {
                contains: query,
              },
            },
            {
              'meta.extractedText': {
                contains: query,
              },
            },
            {
              'meta.description': {
                contains: query,
              },
            },
          ],
        },
        sort: ['-priority', '-updatedAt'],
      })
    } catch (queryError) {
      if (!shouldUseInMemoryFallback(queryError)) {
        throw queryError
      }

      const fallbackLimit = getFallbackFetchLimit(limit)
      logSearchEvent('warn', 'using_in_memory_fallback', {
        fallbackLimit,
        query,
        queryError,
      })

      const allResults = await payload.find({
        collection: 'search',
        overrideAccess: false,
        limit: fallbackLimit,
        sort: ['-updatedAt'],
      })

      const matchingDocs = allResults.docs.filter((doc) => matchesSearchQuery(doc, query))
      searchResults = {
        ...allResults,
        docs: matchingDocs.slice(0, limit),
        totalDocs: matchingDocs.length,
      }
    }

    // Transform results to include collection type and URL
    const results: SearchResult[] = searchResults.docs.map(toSearchResult)

    return {
      results,
      totalDocs: searchResults.totalDocs,
    }
  } catch (error) {
    logSearchEvent('error', 'search_failed', { error, query, limit })
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      error: 'Failed to perform search',
      message: errorMessage,
      results: [],
      totalDocs: 0,
    }
  }
}
