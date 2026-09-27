import { withPayload } from '@payloadcms/next/withPayload'
import type { NextConfig } from 'next'
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
  // Lets the dev server accept HMR and dev-resource requests from this Mac's LAN hostname.
  allowedDevOrigins: ['m4-pro.local'],
  experimental: {
    staticGenerationRetryCount: 1,
    staticGenerationMaxConcurrency: 8,
    staticGenerationMinPagesPerWorker: 25,
  },
  images: {
    qualities: [100, 90],
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
