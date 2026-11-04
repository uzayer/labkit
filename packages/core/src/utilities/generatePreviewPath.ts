import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'
import { PayloadRequest } from 'payload'
import { generateDocumentPath, PublicDocumentCollection } from './generateDocumentPath'

type Props = {
  collection: PublicDocumentCollection
  slug: string
  locale: string
  breadcrumbs: Breadcrumb[] | undefined
  req?: PayloadRequest
}

export const generatePreviewPath = ({ collection, slug, locale, breadcrumbs }: Props) => {
  const path = generateDocumentPath({ breadcrumbs, collection, locale, slug })

  const params = {
    slug,
    collection,
    path,
    locale,
  }

  const encodedParams = new URLSearchParams()

  Object.entries(params).forEach(([key, value]) => {
    encodedParams.append(key, value)
  })

  return `/next/preview?${encodedParams.toString()}`
}
