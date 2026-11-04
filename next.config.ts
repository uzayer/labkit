import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
import { blobBaseUrl } from './src/config/blob'
import { serverUrl } from './src/config/server'
import bundleAnalyzer from '@next/bundle-analyzer'

/**
 * Set NEXT_PUBLIC_SERVER_URL to the URL of the server.
 * If NEXT_PUBLIC_SERVER_URL is not set, it will default to the URL of the Vercel deployment.
 * If Vercel URL is not set, it will default to http://localhost:3000.
 */
export const NEXT_PUBLIC_SERVER_URL = serverUrl

const securityHeaders = [
  {
    key: 'X-Frame-Options',
    value: 'SAMEORIGIN',
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff',
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin',
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), browsing-topics=()',
  },
  {
    key: 'Content-Security-Policy-Report-Only',
    value: [
      "default-src 'self'",
      "base-uri 'self'",
      "form-action 'self'",
      "frame-ancestors 'self'",
      "object-src 'none'",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https:",
      "media-src 'self' blob: https:",
      "connect-src 'self' https: ws: wss:",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https:",
      "style-src 'self' 'unsafe-inline' https:",
      "frame-src 'self' https://www.youtube.com https://youtube.com https://player.vimeo.com https://vimeo.com",
    ].join('; '),
  },
]

const nextConfig: NextConfig = {
  output: 'standalone',
  reactCompiler: true,
  // @labkit/core ships TypeScript source, not a build.
  transpilePackages: ['@labkit/core'],
  // Lets the dev server accept HMR and dev-resource requests from this Mac's LAN hostname.
  allowedDevOrigins: ['m4-pro.local'],
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
  images: {
    // 80 is the DIAL frontend's resized Media (OptionalImage), matching the originals.
    qualities: [100, 90, 80],
    remotePatterns: [
      (() => {
        const url = new URL(serverUrl)

        return {
          hostname: url.hostname,
          pathname: '/**',
          port: url.port,
          protocol: url.protocol.replace(':', '') as 'http' | 'https',
        }
      })(),
      // DIAL's pages load Media straight from its Blob store, not through
      // Payload (src/lib/dial/data/load.ts), so the optimizer resizes from there.
      // Only this store: a wildcard would resize any public Blob on our bill.
      ...(blobBaseUrl
        ? [
            {
              hostname: new URL(blobBaseUrl).hostname,
              pathname: '/**',
              protocol: new URL(blobBaseUrl).protocol.replace(':', '') as 'http' | 'https',
            },
          ]
        : []),
    ],
  },
  reactStrictMode: true,
  poweredByHeader: false,
  async headers() {
    const headers = [
      {
        source: '/:path*',
        headers: [...securityHeaders],
      },
      {
        // Self-hosted fonts carry a version in the file name (`.v1`), bumped on
        // regeneration, so they can be cached for good. Without this, public/
        // files go out with max-age=0 and every page revalidates them.
        source: '/fonts/:path*',
        headers: [{ key: 'Cache-Control', value: 'public, max-age=31536000, immutable' }],
      },
    ]

    if (process.env.NODE_ENV === 'production') {
      headers[0]?.headers.push({
        key: 'Strict-Transport-Security',
        value: 'max-age=31536000; includeSubDomains',
      })
    }

    return headers
  },
}

const withBundleAnalyzer = bundleAnalyzer({
  enabled: process.env.ANALYZE === 'true',
})

export default withPayload(withBundleAnalyzer(nextConfig))
