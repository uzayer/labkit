import { cache } from 'react'
import { draftMode, headers } from 'next/headers'
import { Config, Page, Post, Project, User } from '@/payload-types'
import { createPayloadRequest, LocalizationConfig, Payload } from 'payload'
import { getPayload } from 'payload'
import configPromise from '@payload-config'

type CollectionReturnTypeMap = {
  pages: Page & { type: 'page' }
  posts: Post & { type: 'post' }
  projects: Project & { type: 'project' }
}

interface DraftAccess {
  draft: boolean
  user?: User
}

interface QueryBySlugArgs {
  cleanSlugs: string[]
  locale: string
  draft: boolean
  payload: Payload
  user?: User
}

async function getDraftAccess(payload: Payload): Promise<DraftAccess> {
  const { isEnabled: draft } = await draftMode()

  if (!draft) {
    return { draft: false }
  }

  try {
    const requestHeaders = new Headers(await headers())
    const req = await createPayloadRequest({ payload, req: { headers: requestHeaders } })
    const { user } = await payload.auth({ headers: requestHeaders, req })

    if (!user) {
      payload.logger.warn('Blocked unauthenticated draft-mode content request')
      return { draft: false }
    }

    return { draft: true, user: user as User }
  } catch (error) {
    payload.logger.warn({
      err: error,
      msg: 'Blocked draft-mode content request after auth failure',
    })
    return { draft: false }
  }
}

/**
 * Select, in which collection we should search. Currently supported is 'pages', 'posts', and 'projects'
 * For slugs with /posts/XX we should search in 'posts'
 * For slugs with /projects/XX we should search in 'projects'
 * For every other slug we should search in 'pages'.
 *
 * We call queryPageBySlug if we search in 'pages', queryPostBySlug if we search in 'posts', and queryProjectBySlug if we search in 'projects'
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
  const payload = await getPayload({ config: configPromise })
  const { draft, user } = await getDraftAccess(payload)

  if (draft && user) {
    payload.logger.info(`Authorized draft-mode ${collection} read for user ${user.id}`)
  }

  // Check if locale is supported
  const { locales } = payload.config.localization as LocalizationConfig
  if (!locales.map((locale) => locale.code).includes(locale)) {
    // locale is not supported
    return null
  }

  let result: Page | Post | Project | null = null

  if (collection === 'pages') {
    result = await queryPageBySlug({ cleanSlugs, locale, draft, payload, user })
  } else if (collection === 'posts') {
    result = await queryPostBySlug({ cleanSlugs, locale, draft, payload, user })
  } else if (collection === 'projects') {
    result = await queryProjectBySlug({ cleanSlugs, locale, draft, payload, user })
  }

  return result as CollectionReturnTypeMap[T] | null
}

export const queryPostBySlug = cache(
  async ({ cleanSlugs, locale, draft, payload, user }: QueryBySlugArgs) => {
    const result = await payload.find({
      collection: 'posts',
      draft,
      limit: 1,
      overrideAccess: false,
      user,
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

export const queryProjectBySlug = cache(
  async ({ cleanSlugs, locale, draft, payload, user }: QueryBySlugArgs) => {
    const result = await payload.find({
      collection: 'projects',
      draft,
      limit: 1,
      depth: 2,
      overrideAccess: false,
      user,
      locale: locale as Config['locale'],
      where: {
        slug: {
          // We query the project by the last slug as this is always unique.
          // Even for different parent routes it would be unique
          equals: cleanSlugs[cleanSlugs.length - 1],
        },
      },
    })

    if (result.docs?.[0]) {
      return { ...result.docs?.[0], type: 'project' }
    }
    return null
  },
)

export const queryPageBySlug = cache(
  async ({ cleanSlugs, locale, draft, payload, user }: QueryBySlugArgs) => {
    const result = await payload.find({
      collection: 'pages',
      draft,
      limit: 1,
      overrideAccess: false,
      user,
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
