import type { Metadata } from 'next'
import { Inter } from 'next/font/google'

import { Toaster } from '@/components/ui/toaster'
import { Toaster as SonnerToaster } from '@/components/ui/sonner'

import './dashboard.css'
import { Providers } from './providers'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-sans',
})

export const metadata: Metadata = {
  title: {
    default: 'LabKit Dashboard',
    template: '%s | LabKit Dashboard',
  },
  description: 'Administrative dashboard for LabKit.',
}

interface DashboardRootLayoutProps {
  children: React.ReactNode
}

export default function DashboardRootLayout({ children }: DashboardRootLayoutProps) {
  return (
    <html className={inter.variable} lang="en" suppressHydrationWarning>
      <body className="group/body min-h-svh bg-background text-foreground antialiased">
        <Providers>{children}</Providers>
        <Toaster />
        <SonnerToaster closeButton richColors />
      </body>
    </html>
  )
}
