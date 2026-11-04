// Parked with the rest of the template pages. At src/app/(frontend)/ it sat above
// DIAL's root layout, so every DIAL route bundled its client graph (the
// template Header, cmdk, zod, Lucide's dynamic icon map) for a 404 that
// (dial)/not-found.tsx always overrides. DIAL's catch-all owns every unmatched URL.
import { Geist_Mono, Geist } from 'next/font/google'
import React from 'react'
import { cn } from '@/utils'
import { Footer } from '@/globals/Footer/Component'
import { Header } from '@/globals/Header/Component'
import { Providers } from '@/providers'
import { InitTheme } from '@/providers/Theme/InitTheme'
import { Analytics } from '@vercel/analytics/react'

import { ThemeConfig } from '@/globals/ThemeConfig/Component'
import localization from '@labkit/core/localization'
import { PublicContextProps } from '@/utilities/publicContextProps'
import './globals.css'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

// Change fonts by changing class Geist_Mono or Geist.
// No change in tailwind.config.mjs needed (Because it's already synced via --font-mono and --font-sans variables). Just make sure, that these variables stay.
const mono = Geist_Mono({ subsets: ['latin'], variable: '--font-mono' })
const sans = Geist({ subsets: ['latin'], variable: '--font-sans' })

export default function NotFound() {
  const publicContext: PublicContextProps = {
    isNotFound: true,
    locale: localization.defaultLocale,
    cleanSlugs: [],
  }
  return (
    <html
      className={cn(mono.variable, sans.variable)}
      lang={localization.defaultLocale}
      suppressHydrationWarning
    >
      <head>
        <ThemeConfig publicContext={publicContext} />
        <link href="/favicon.ico" rel="icon" sizes="32x32" />
        <link href="/favicon.svg" rel="icon" type="image/svg+xml" />
      </head>
      <body>
        <InitTheme />
        <Providers>
          <Analytics />
          <Header publicContext={publicContext} />
          <div className="container py-28" key="not-found">
            <div className="prose max-w-none">
              <h1 className="mb-0">404</h1>
              <p className="mb-4">This page could not be found.</p>
            </div>
            <Button render={<Link href="/" />} variant="default" nativeButton={false} role="link">
              Go home
            </Button>
          </div>
          <Footer publicContext={publicContext} />
        </Providers>
      </body>
    </html>
  )
}
