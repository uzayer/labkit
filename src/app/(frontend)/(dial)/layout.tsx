import type { Metadata } from 'next'
import { Caveat, Geist, Geist_Mono, Mina } from 'next/font/google'
import { preload } from 'react-dom'
import './globals.css'
import { Navbar4 } from '@/components/dial/navbar4'
import { Footer18 } from '@/components/dial/footer18'
import { RevealObserver } from '@/components/dial/reveal-observer'
import { serverUrl } from '@/config/server'
import { getDial } from '@/lib/dial/data/get'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

// Fonts that never appear in the first viewport skip preload, so they do not
// compete with the hero's Fraunces and Geist for bandwidth on first load.
const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  preload: false,
})

// Display serif for page and section titles, self-hosted with SOFT pinned at
// 50 (see the @font-face rules in globals.css). Only the latin files are
// preloaded; the hero's first paint uses both styles. Bengali project names
// fall through to the Bengali face, so Project names like "স্যন্ধি" are set on
// purpose rather than in whatever the OS happens to have.
const frauncesPreloads = [
  '/fonts/fraunces-soft50-roman-latin.v1.woff2',
  '/fonts/fraunces-soft50-italic-latin.v1.woff2',
]

// Margin notes and annotations only, never body copy.
const caveat = Caveat({
  variable: '--font-caveat',
  subsets: ['latin'],
  preload: false,
})

// Bengali in one face, Mina, behind every stack. Bengali subset only: the
// file loads only when Bengali glyphs are on the page, and Latin text never
// falls through to it.
const bengali = Mina({
  variable: '--font-bengali',
  weight: ['400', '700'],
  subsets: ['bengali'],
  preload: false,
})

// Runs before first paint so a stored dark preference never flashes light
// (navbar4's toggle writes the same key), and flags that JavaScript runs, so
// scroll reveals only hide content when something will reveal it.
const themeScript = `document.documentElement.classList.add("js");try{var t=localStorage.getItem("dial-theme");if(t==="dark"||(!t&&matchMedia("(prefers-color-scheme: dark)").matches))document.documentElement.classList.add("dark")}catch(e){}`

export const metadata: Metadata = {
  metadataBase: new URL(serverUrl),
  title: {
    default: 'DIAL — Design Inclusion and Access Lab',
    template: '%s | DIAL',
  },
  description:
    'Human-computer interaction research from the Design Inclusion and Access Lab at North South University, Dhaka.',
}

// Every DIAL route renders live Payload records.
export const dynamic = 'force-dynamic'

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const { getNavData } = await getDial()
  for (const href of frauncesPreloads) {
    preload(href, { as: 'font', type: 'font/woff2', crossOrigin: 'anonymous' })
  }

  return (
    <html
      lang="en"
      // The theme script adds `dark` before hydration.
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} ${caveat.variable} ${bengali.variable} h-full antialiased`}
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body className="flex min-h-full flex-col">
        <div data-site-nav-scope className="text-foreground">
          <Navbar4 nav={getNavData()} className="sticky" />
        </div>
        <main className="flex-1">{children}</main>
        <Footer18 />
        <RevealObserver />
      </body>
    </html>
  )
}
