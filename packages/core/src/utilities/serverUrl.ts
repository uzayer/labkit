/**
 * The site's public origin, for admin preview links and SEO URLs: NEXT_PUBLIC_SERVER_URL,
 * else the Vercel deployment URL, else localhost. A Lab's app resolves the same value for
 * its own frontend; this copy exists because core can't import the app.
 */
const vercelUrl = process.env.VERCEL_BRANCH_URL || process.env.VERCEL_URL

export const serverUrl =
  process.env.NEXT_PUBLIC_SERVER_URL ||
  (vercelUrl ? `https://${vercelUrl}` : 'http://localhost:3000')
