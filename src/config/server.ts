/**
 * Server configuration and environment variables
 * This file centralizes all server-related configuration
 */

const vercelUrl = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL

export const serverConfig = {
  /**
   * The server URL is determined in the following order:
   * 1. NEXT_PUBLIC_SERVER_URL environment variable
   * 2. The current Vercel deployment URL (if available)
   * 3. localhost:3000 (fallback for development)
   */
  serverUrl:
    process.env.NEXT_PUBLIC_SERVER_URL ||
    (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000'),

  /**
   * Returns true if the application is running in development mode
   */
  isDevelopment: process.env.NODE_ENV === 'development',

  /**
   * Returns true if the application is running in production mode
   */
  isProduction: process.env.NODE_ENV === 'production',

  /**
   * Returns true if the application is running on Vercel
   */
  isVercel: !!process.env.VERCEL,
} as const

export const { serverUrl } = serverConfig
