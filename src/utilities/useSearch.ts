import { useState, useEffect, useCallback } from 'react'
import { search, type SearchResult } from '@/actions/search'

export type { SearchResult }

const CACHE_SIZE = 5

// Simple in-memory cache for top results
const searchCache = new Map<string, SearchResult[]>()

export function useSearch(query: string, enabled = true) {
  const [results, setResults] = useState<SearchResult[]>([])
  const [initialResults, setInitialResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [cachedResults, setCachedResults] = useState<SearchResult[]>([])

  // Fetch initial results when dialog opens (no query)
  useEffect(() => {
    if (!enabled) return

    const fetchInitial = async () => {
      try {
        const data = await search(undefined, 5)
        if (data.results) {
          setInitialResults(data.results)
        }
      } catch (err) {
        // Silently fail for initial results
        console.warn('Failed to fetch initial results:', err)
      }
    }

    if (!query || query.trim().length === 0) {
      fetchInitial()
      setCachedResults([])
      setResults([])
      return
    }

    const cacheKey = query.toLowerCase().trim()
    const cached = searchCache.get(cacheKey)

    if (cached && cached.length > 0) {
      setCachedResults(cached.slice(0, CACHE_SIZE))
    } else {
      setCachedResults([])
    }
  }, [query, enabled])

  // Fetch from server action
  const fetchSearchResults = useCallback(async (searchQuery: string) => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setResults([])
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const data = await search(searchQuery, 20)

      if (data.error) {
        throw new Error(data.message || data.error)
      }

      // Update cache with new results
      const cacheKey = searchQuery.toLowerCase().trim()
      searchCache.set(cacheKey, data.results)

      // Keep cache size manageable
      if (searchCache.size > 50) {
        const firstKey = searchCache.keys().next().value
        searchCache.delete(firstKey)
      }

      setResults(data.results)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred')
      setResults([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!enabled) return

    const timeoutId = setTimeout(() => {
      fetchSearchResults(query)
    }, 300) // Debounce API calls

    return () => clearTimeout(timeoutId)
  }, [query, enabled, fetchSearchResults])

  return {
    results,
    cachedResults,
    initialResults,
    isLoading,
    error,
    refetch: () => fetchSearchResults(query),
  }
}
