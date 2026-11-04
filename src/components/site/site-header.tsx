import Link from 'next/link'

import type { Site } from '@/lib/site'

import { SiteNav, type NavItem } from './site-nav'

/**
 * The pages the header links to. A switched-off Feature's link is left out
 * along with its route. Grants, Awards and Join Us are in the footer, to keep
 * the header to one line.
 */
export function mainNav(site: Site): NavItem[] {
  const { features } = site
  return [
    features.researchThemes && { href: '/research', label: 'Research' },
    features.projects && { href: '/projects', label: 'Projects' },
    { href: '/publications', label: 'Publications' },
    { href: '/people', label: 'People' },
    features.newsItems && { href: '/news', label: 'News' },
    { href: '/about', label: 'About' },
    { href: '/contact', label: 'Contact' },
  ].filter((item): item is NavItem => Boolean(item))
}

export function SiteHeader({ site }: { site: Site }) {
  const logo = site.mediaUrl(site.labInfo.logo)
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur supports-[backdrop-filter]:bg-background/75">
      <div className="relative container flex h-16 items-center justify-between gap-6">
        <Link href="/" className="flex items-center gap-3 font-medium">
          {logo && (
            // The name beside it says who this is, so the logo's alt is empty.
            <img src={logo} alt="" className="h-8 w-auto" />
          )}
          <span className="font-display text-xl">{site.labShortName}</span>
          <span className="sr-only">, home</span>
        </Link>
        <SiteNav items={mainNav(site)} />
      </div>
    </header>
  )
}
