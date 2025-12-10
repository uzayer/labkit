import { cache } from 'react'
import { draftMode } from 'next/headers'
import { Config, Page, Post } from '@/payload-types'
import { LocalizationConfig, Payload } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type CollectionReturnTypeMap = {
  pages: Page & { type: 'page' }
  posts: Post & { type: 'post' }
}
/**
 * Select, in which collection we should search. Currently supported is 'pages' and 'posts'
 * For slugs with /posts/XX we should search in 'posts'
 * For every other slug we should search in 'pages'.
 * This could be enhanced in the future to support for example also case studies seperately.
 *
 * We call queryPageBySlug if we search in 'pages' and queryPostBySlug if we search in 'posts'
 */
export const queryCollectionData = async <T extends keyof CollectionReturnTypeMap>({
  cleanSlugs,
  locale,
  collection,
}: {
  cleanSlugs: string[]
  locale: string
  collection: T
}): Promise<CollectionReturnTypeMap[T] | null> => {
  const { isEnabled: draft } = await draftMode()

  const payload = await getPayload({ config: configPromise })

  // Check if locale is supported
  const { locales } = payload.config.localization as LocalizationConfig
  if (!locales.map((locale) => locale.code).includes(locale)) {
    // locale is not supported
    return null
  }

  let result: Page | Post | null = null

  if (collection === 'pages') {
    result = await queryPageBySlug({ cleanSlugs, locale, draft, payload })
  } else {
    result = await queryPostBySlug({ cleanSlugs, locale, draft, payload })
  }

  return result as CollectionReturnTypeMap[T] | null
}

export const queryPostBySlug = cache(
  async ({
    cleanSlugs,
    locale,
    draft,
    payload,
  }: {
    cleanSlugs: string[]
    locale: string
    draft: boolean
    payload: Payload
  }) => {
    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      overrideAccess: draft,
      locale: locale as Config['locale'],
      where: {
        slug: {
          // We query the page by the last slug as this is always unique.
          // Even for different parent routes it would be unique
          equals: cleanSlugs[cleanSlugs.length - 1],
        },
      },
    })

    if (result.docs?.[0]) {
      return { ...result.docs?.[0], type: 'post' }
    }
    return null
  },
)

export const queryPageBySlug = cache(
  async ({
    cleanSlugs,
    locale,
    draft,
    payload,
  }: {
    cleanSlugs: string[]
    locale: string
    draft: boolean
    payload: Payload
  }) => {
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: draft,
      locale: locale as Config['locale'],
      where: {
        slug: {
          // We query the page by the last slug as this is always unique.
          // Even for different parent routes it would be unique
          equals: cleanSlugs[cleanSlugs.length - 1],
        },
      },
    })

    const parentPath =
      result.docs?.[0]?.breadcrumbs?.map((item) => item.url?.split('/').pop()) || []

    // Check if URL path matches the actual parent structure
    // We remove the last item from cleanSlugs as it's the current page slug
    // Don't check that for missing results, as we want to first check our redirects in that case
    if (result.docs.length > 0 && JSON.stringify(parentPath) !== JSON.stringify(cleanSlugs)) {
      // parent path does not match
      return null
    }

    if (!result.docs?.[0]) {
      return null
    }

    return { ...result.docs?.[0], type: 'page' }
  },
)
