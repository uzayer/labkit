import { Inter, Roboto_Serif, Roboto_Mono, Playfair_Display, Caveat } from 'next/font/google'

import { Providers } from '@/providers'
import { cn } from '@/utils'

import '../[[...slugs]]/globals.css'

// This route shares frontend providers that can read live CMS configuration.
export const dynamic = 'force-dynamic'

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' })
const robotoSerif = Roboto_Serif({ subsets: ['latin'], variable: '--font-serif' })
const robotoMono = Roboto_Mono({ subsets: ['latin'], variable: '--font-mono' })
const playfair = Playfair_Display({ subsets: ['latin'], variable: '--font-playfair' })
const caveat = Caveat({ subsets: ['latin'], variable: '--font-caveat' })

interface EarlyAccessLayoutProps {
  children: React.ReactNode
}

export default function EarlyAccessLayout({ children }: EarlyAccessLayoutProps) {
  return (
    <html
      className={cn(
        inter.variable,
        robotoSerif.variable,
        robotoMono.variable,
        playfair.variable,
        caveat.variable,
      )}
      lang="en"
      suppressHydrationWarning
    >
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
