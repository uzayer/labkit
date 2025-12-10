import localization from '@/localization.config'
import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'
import { CollectionSlug, PayloadRequest } from 'payload'

const collectionPrefixMap: Partial<Record<CollectionSlug, string>> = {
  posts: '/posts',
  pages: '',
}

type Props = {
  collection: keyof typeof collectionPrefixMap
  slug: string
  locale: string
  breadcrumbs: Breadcrumb[] | undefined
  req?: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, locale, breadcrumbs }: Props) => {
  const path = `${locale !== localization.defaultLocale ? `/${locale}` : ''}${collectionPrefixMap[collection]}${slug === 'home' ? '/' : breadcrumbs?.[breadcrumbs.length - 1]?.url || `/${slug}`}`

  const params = {
    slug,
    collection,
    path,
    locale,
    previewSecret: process.env.NEXT_PRIVATE_DRAFT_SECRET || '',
  }

  const encodedParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value)
  })

  return `/next/preview?${encodedParams.toString()}`
}
