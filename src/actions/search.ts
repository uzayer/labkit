'use server'

import { getPayload, PaginatedDocs } from 'payload'
import config from '@payload-config'
import { Search } from '@/payload-types'

const configPromise = config

export interface SearchResult {
  id: string
  title: string
  description?: string
  slug: string
  url: string
  type: string
  meta?: {
    title?: string
    description?: string
    image?: string | number
  }
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

export async function search(query?: string, limit: number = 10): Promise<SearchResponse> {
  try {
    // If no query, return recent items (initial results)
    if (!query || query.trim().length === 0) {
      const payload = await getPayload({ config: configPromise })

      try {
        const recentResults = await payload.find({
          collection: 'search',
          limit: 5,
          sort: '-updatedAt',
        })

        const results: SearchResult[] = recentResults.docs.map((doc: any) => {
          const collection = doc.doc?.relationTo || 'pages'
          const slug = doc.slug || ''
          const url = collection === 'posts' ? `/posts/${slug}` : `/${slug}`

          return {
            id: doc.id,
            title: doc.title || doc.meta?.title || '',
            description: doc.meta?.description || doc.excerpt || '',
            slug,
            url,
            type: collection,
            meta: doc.meta,
            categories: doc.categories || [],
            updatedAt: doc.updatedAt,
          }
        })

        return {
          results,
          totalDocs: recentResults.totalDocs,
        }
      } catch (error) {
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
        limit: 1,
      })
    } catch (testError) {
      console.error('Cannot access search collection:', testError)
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
      // If title query fails, try without where clause and filter in memory
      console.warn('Title query failed, trying fallback:', queryError)
      const allResults = await payload.find({
        collection: 'search',
        limit: 100,
        sort: ['-updatedAt'],
      })

      // Filter in memory
      const queryLower = query.toLowerCase()
      searchResults = {
        ...allResults,
        docs: allResults.docs
          .filter((doc) => {
            const title = (doc.title || '').toLowerCase()
            const excerpt = (doc.meta?.extractedText || '').toLowerCase()
            const metaTitle = (doc.meta?.title || '').toLowerCase()
            const metaDesc = (doc.meta?.description || '').toLowerCase()

            return (
              title.includes(queryLower) ||
              excerpt.includes(queryLower) ||
              metaTitle.includes(queryLower) ||
              metaDesc.includes(queryLower)
            )
          })
          .slice(0, limit),
        totalDocs: allResults.docs.filter((doc: any) => {
          const queryLower = query.toLowerCase()
          const title = (doc.title || '').toLowerCase()
          const excerpt = (doc.excerpt || '').toLowerCase()
          const metaTitle = (doc.meta?.title || '').toLowerCase()
          const metaDesc = (doc.meta?.description || '').toLowerCase()

          return (
            title.includes(queryLower) ||
            excerpt.includes(queryLower) ||
            metaTitle.includes(queryLower) ||
            metaDesc.includes(queryLower)
          )
        }).length,
      }
    }

    // Transform results to include collection type and URL
    const results: SearchResult[] = searchResults.docs.map((doc: any) => {
      const collection = doc.doc?.relationTo || 'pages'
      const slug = doc.slug || ''
      const url = collection === 'posts' ? `/posts/${slug}` : `/${slug}`

      return {
        id: doc.id,
        title: doc.title || doc.meta?.title || '',
        description: doc.meta?.description || doc.excerpt || '',
        slug,
        url,
        type: collection,
        meta: doc.meta,
        categories: doc.categories || [],
        updatedAt: doc.updatedAt,
      }
    })

    return {
      results,
      totalDocs: searchResults.totalDocs,
    }
  } catch (error) {
    console.error('Search API error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Unknown error'

    return {
      error: 'Failed to perform search',
      message: errorMessage,
      results: [],
      totalDocs: 0,
    }
  }
}
