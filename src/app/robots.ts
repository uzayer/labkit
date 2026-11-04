import type { MetadataRoute } from 'next'

import { serverUrl } from '@/config/server'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: '*', allow: '/', disallow: ['/admin', '/api', '/next'] },
    sitemap: `${serverUrl}/sitemap.xml`,
  }
}
