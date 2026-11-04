import Link from 'next/link'

import type { Site } from '@/lib/site'
import { label } from '@/lib/site/typography'

const SOCIAL_LABELS: Record<string, string> = {
  x: 'X',
  github: 'GitHub',
  linkedin: 'LinkedIn',
  facebook: 'Facebook',
  'google-scholar': 'Google Scholar',
  youtube: 'YouTube',
  researchgate: 'ResearchGate',
}

export function SiteFooter({ site }: { site: Site }) {
  const { labInfo, features } = site
  const columns = [
    {
      title: 'Research',
      links: [
        features.researchThemes && { href: '/research', label: 'Research themes' },
        features.projects && { href: '/projects', label: 'Projects' },
        { href: '/publications', label: 'Publications' },
        features.grants && { href: '/grants', label: 'Grants' },
        features.awards && { href: '/awards', label: 'Awards' },
      ],
    },
    {
      title: 'Lab',
      links: [
        { href: '/about', label: 'About' },
        { href: '/people', label: 'People' },
        features.newsItems && { href: '/news', label: 'News' },
        { href: '/join-us', label: 'Join us' },
        { href: '/contact', label: 'Contact' },
      ],
    },
  ]
  const institution = [labInfo.parentOrganization?.department, labInfo.parentOrganization?.name]
    .filter(Boolean)
    .join(', ')
  const place = [labInfo.location?.city, labInfo.location?.country].filter(Boolean).join(', ')

  return (
    <footer className="container mt-16 border-t border-border pt-12 pb-16">
      <div className="flex flex-col gap-10 lg:flex-row lg:justify-between">
        <div className="flex max-w-sm flex-col gap-3">
          <Link href="/" className="font-display w-fit text-2xl">
            {site.labName}
          </Link>
          {(institution || place) && (
            <p className="text-sm leading-relaxed text-muted-foreground">
              {institution}
              {institution && place && <br />}
              {place}
            </p>
          )}
          {labInfo.email && (
            <a
              href={`mailto:${labInfo.email}`}
              className="w-fit text-sm text-muted-foreground underline decoration-border underline-offset-4 hover:text-foreground"
            >
              {labInfo.email}
            </a>
          )}
        </div>
        <nav aria-label="Footer" className="grid grid-cols-2 gap-8 sm:grid-cols-3">
          {columns.map((column) => (
            <div key={column.title}>
              <p className={label}>{column.title}</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {column.links.map(
                  (link) =>
                    link && (
                      <li key={link.href}>
                        <Link
                          href={link.href}
                          className="text-muted-foreground transition-colors hover:text-foreground"
                        >
                          {link.label}
                        </Link>
                      </li>
                    ),
                )}
              </ul>
            </div>
          ))}
          {(labInfo.socials?.length ?? 0) > 0 && (
            <div>
              <p className={label}>Elsewhere</p>
              <ul className="mt-3 flex flex-col gap-2 text-sm">
                {labInfo.socials?.map((social) => (
                  <li key={social.id ?? social.url}>
                    <a
                      href={social.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {SOCIAL_LABELS[social.platform] ?? social.platform}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </nav>
      </div>
    </footer>
  )
}
