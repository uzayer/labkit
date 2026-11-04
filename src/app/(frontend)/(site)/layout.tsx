import type { Metadata } from 'next'
import { Fraunces, Geist } from 'next/font/google'

import { labJsonLd } from '@labkit/core/seo'

import { JsonLd } from '@/components/site/json-ld'
import { SiteFooter } from '@/components/site/site-footer'
import { SiteHeader } from '@/components/site/site-header'
import { serverUrl } from '@/config/server'
import { getSite } from '@/lib/site'

import './globals.css'

const geist = Geist({ subsets: ['latin'], variable: '--font-geist-sans' })

// Display serif for page and section titles. SOFT rounds its terminals a little.
const fraunces = Fraunces({
  subsets: ['latin'],
  variable: '--font-fraunces',
  axes: ['SOFT', 'opsz'],
})

// Pages are rendered once and cached (ISR) until the records they read change:
// Payload's change hooks expire the records' cache tag, which expires these
// pages with it (src/lib/site/index.ts, src/plugins/revalidateSite.ts). The
// hour is a backstop for writes no hook sees. Pages whose first paint depends
// on the query string opt into per-request rendering themselves.
export const revalidate = 3600

export async function generateMetadata(): Promise<Metadata> {
  const { labInfo, labName, labShortName, mediaUrl } = await getSite()
  const logo = mediaUrl(labInfo.logo)
  return {
    metadataBase: new URL(serverUrl),
    title: { default: labName, template: `%s | ${labShortName}` },
    description: labInfo.description || undefined,
    openGraph: { siteName: labName, type: 'website' },
    twitter: { card: 'summary_large_image' },
    icons: logo ? [{ url: logo }] : undefined,
  }
}

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  return (
    <html lang="en" className={`${geist.variable} ${fraunces.variable}`}>
      <body className="flex min-h-screen flex-col">
        {/* First in the tab order, invisible until focused. tabIndex on <main>
            lets every browser move focus there, not just scroll. */}
        <a
          href="#main"
          className="sr-only z-50 rounded-full bg-foreground px-4 py-2 text-sm font-medium text-background focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
        >
          Skip to content
        </a>
        <SiteHeader site={site} />
        <main id="main" tabIndex={-1} data-focus-target className="flex-1 outline-none">
          {children}
        </main>
        <SiteFooter site={site} />
        <JsonLd data={labJsonLd(site.populatedLabInfo(), { siteUrl: serverUrl })} />
      </body>
    </html>
  )
}
