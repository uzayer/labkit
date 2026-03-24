import type { Metadata } from 'next'
import type { Page, Post, Project } from '../payload-types'
import { mergeOpenGraph } from './mergeOpenGraph'
import { serverUrl as NEXT_PUBLIC_SERVER_URL } from '@/config/server'

export const generateMeta = async (args: {
  doc: Page | Post | Project
  url: string
  locale?: string
}): Promise<Metadata> => {
  const { doc, url, locale } = args || {}

  const customOGImage =
    typeof doc?.meta?.image === 'object' &&
    doc.meta.image !== null &&
    'url' in doc.meta.image &&
    `${NEXT_PUBLIC_SERVER_URL}${doc.meta.image.url}`

  const title = doc?.meta?.title || doc?.title || 'LabKit'
  const description = doc?.meta?.description || ''

  const defaultOGImage = `${NEXT_PUBLIC_SERVER_URL}/next/og?title=${title}&locale=${locale}`

  return {
    title: `${title}`,
    description,
    openGraph: mergeOpenGraph({
      title,
      description,
      url,
      images: customOGImage
        ? [
            {
              url: customOGImage,
            },
          ]
        : defaultOGImage,
    }),
  }
}
