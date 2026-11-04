import type { MetadataRoute } from 'next'

import { serverUrl } from '@/config/server'
import { slugOf } from '@/lib/site/format'
import { getSite } from '@/lib/site'

export const revalidate = 3600

/** Every public page, with switched-off Features left out along with their routes. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite()
  const { features } = site
  const url = (path: string) => `${serverUrl}${path}`

  const pages = [
    '/',
    '/publications',
    '/people',
    '/about',
    '/join-us',
    '/contact',
    features.researchThemes && '/research',
    features.projects && '/projects',
    features.grants && '/grants',
    features.awards && '/awards',
    features.newsItems && '/news',
  ].filter((path): path is string => Boolean(path))

  return [
    ...pages.map((path) => ({ url: url(path) })),
    ...site.publications.map((pub) => ({
      url: url(`/publications/${pub.id}`),
      lastModified: pub.updatedAt,
    })),
    ...site.listedTeam.map((person) => ({
      url: url(`/people/${slugOf(person)}`),
      lastModified: person.updatedAt,
    })),
    ...site.researchThemes.map((theme) => ({
      url: url(`/research/${slugOf(theme)}`),
      lastModified: theme.updatedAt,
    })),
    ...site.projects.map((project) => ({
      url: url(`/projects/${slugOf(project)}`),
      lastModified: project.updatedAt,
    })),
    ...site.news.map((item) => ({
      url: url(`/news/${slugOf(item)}`),
      lastModified: item.updatedAt,
    })),
  ]
}
