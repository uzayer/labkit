import type { Metadata } from 'next'

import { PayloadRedirects } from '@/components/PayloadRedirects'
import configPromise from '@payload-config'
import { getPayload } from 'payload'
import React from 'react'


import { RenderBlocks } from '@/blocks/RenderBlocks'
import { RenderHero } from '@/heros/RenderHero'
import { generateMeta } from '@/utilities/generateMeta'
import PageClient from './page.client'
import { notFound } from 'next/navigation'
import { resolveSlugs } from '@/utilities/resolveSlugs'
import localization, { locales } from '@/localization.config'
import { queryCollectionData } from './data'
import { PublicContextProps } from '@/utilities/publicContextProps'
import { Breadcrumbs } from '@/components/Breadcrumbs'
import { Breadcrumb } from '@payloadcms/plugin-nested-docs/types'
import { RenderPostDetailPage } from '@/blocks/RenderPostDetailPage'

type Params = {
  slugs?: Array<string>
}

export type Args = {
  params: Promise<Params>
}

function generateUrl(locale: string, cleanSlugs: string[]) {
  return locale !== localization.defaultLocale ? `/${locale}/` : '/' + cleanSlugs.join('/')
}

export async function generateStaticParams(): Promise<Array<Params>> {
  const payload = await getPayload({ config: configPromise })
  const pages = await payload.find({
    collection: 'pages',
    draft: false,
    /**
     * More pages increase the build time.
     */
    limit: 100,
    locale: 'all',
    overrideAccess: false,
    select: {
      slug: true,
      breadcrumbs: true,
    },
  })

  if (pages.docs.length === 0) {
    return []
  }

  const slugArrays = pages.docs.flatMap(({ slug, breadcrumbs }) => {
    return locales.map((locale) => {
      // order of array pushes matters here so be careful restructuring it
      let slugs: string[] = []
      if (locale !== localization.defaultLocale) {
        slugs.push(locale)
      }

      if (slug !== 'home' && slug) {
        // breadcrumb type is wrong here because it is not fetched localized. We therefore need to cast it to the correct type
        const localBreadcrumb: Breadcrumb[] =
          breadcrumbs?.[locale] || breadcrumbs?.[localization.defaultLocale]
        if (localBreadcrumb) {
          slugs = slugs.concat(
            localBreadcrumb[localBreadcrumb.length - 1].url?.split('/').filter(Boolean) || [],
          )
        } else {
          slugs.push(slug)
        }
      }
      return { slugs }
    })
  })
  return slugArrays
}

export default async function Page(props: Args) {
  const { slugs } = await props.params
  const res = resolveSlugs(slugs || [])
  if (res.isNotFound) {
    notFound()
  }
  const { locale, cleanSlugs } = res

  const publicContext: PublicContextProps = {
    ...res,
  }

  const url = generateUrl(locale, cleanSlugs)

  const collection = cleanSlugs[0] === 'posts' ? 'posts' : 'pages'

  const page = await queryCollectionData({
    cleanSlugs,
    locale,
    collection,
  })

  if (!page) {
    return <PayloadRedirects url={url} />
  }

  if (page.type === 'page') {
    const { hero, layout, breadcrumbs: breadcrumbData, enableBreadcrumbs } = page

    return (
      <article className="">
        <PageClient />
        {/* Allows redirects for valid pages too */}
        <PayloadRedirects disableNotFound url={url} />
        <RenderHero {...hero} publicContext={publicContext} />
        {enableBreadcrumbs && breadcrumbData && (
          <Breadcrumbs items={breadcrumbData} publicContext={publicContext} />
        )}
        <RenderBlocks blocks={layout} publicContext={publicContext} />
      </article>
    )
  } else if (page.type === 'post') {
    const { designVersion } = page

    // Dynamically render the blog post based on its design version
    return (
      <article className="blog-post">
        <PayloadRedirects disableNotFound url={url} />

        {/* Render the appropriate blog post layout based on design version */}
        <RenderPostDetailPage post={page} publicContext={publicContext} />
      </article>
    )
  }
}

export async function generateMetadata(props: Args): Promise<Metadata> {
  const { slugs } = await props.params
  const res = resolveSlugs(slugs || [])
  if (res.isNotFound) {
    notFound()
  }
  const { locale, cleanSlugs } = res

  const page = await queryCollectionData({
    cleanSlugs,
    locale,
    collection: 'pages',
  })
  const url = generateUrl(locale, cleanSlugs)
  if (page) {
    return generateMeta({ doc: page, url, locale })
  }
  return {}
}
