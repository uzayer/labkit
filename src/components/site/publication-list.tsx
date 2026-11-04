import Link from 'next/link'

import type { Publication } from '@/payload-types'
import type { Site } from '@/lib/site'
import { PUBLICATION_STATUS_LABELS, publicationTypeLabel } from '@/lib/site/format'
import { label } from '@/lib/site/typography'
import { cn } from '@/utils'

import { Credits } from './credits'
import { OutLink } from './links'

/** Where a Publication can be read: its DOI first, then its PDF, then any other URL. */
export function readingLinks(site: Site, pub: Publication) {
  const links: { href: string; text: string }[] = []
  if (pub.doi) links.push({ href: `https://doi.org/${pub.doi}`, text: 'DOI' })
  const pdf = pub.pdf?.type === 'upload' ? site.mediaUrl(pub.pdf.upload) : pub.pdf?.link
  if (pdf) links.push({ href: pdf, text: 'PDF' })
  if (pub.externalUrl && !pub.doi) links.push({ href: pub.externalUrl, text: 'Link' })
  return links
}

/**
 * Ruled rows of Publications: kind on the left, then title, authors, venue and
 * links. Only the title is a link to the Publication's page, so the authors
 * and outbound links inside the row stay separate links.
 */
export function PublicationList({
  site,
  publications,
  showYear = false,
  headingLevel = 'h3',
}: {
  site: Site
  publications: Publication[]
  /** For a list not already grouped under year headings. */
  showYear?: boolean
  headingLevel?: 'h2' | 'h3'
}) {
  const Title = headingLevel
  return (
    <ul className="divide-y divide-border border-y border-border">
      {publications.map((pub) => {
        const venue = site.venueName(pub)
        const status = PUBLICATION_STATUS_LABELS[pub.status]
        const links = readingLinks(site, pub)
        return (
          <li key={pub.id} className="py-6 md:grid md:grid-cols-[8rem_minmax(0,1fr)] md:gap-x-8">
            <p className={cn(label, 'mb-2 md:mt-2 md:mb-0')}>
              {[showYear ? pub.year : null, publicationTypeLabel(pub.type)]
                .filter(Boolean)
                .join(' · ')}
            </p>
            <div className="flex flex-col gap-2">
              <Title className="font-display max-w-4xl text-xl leading-snug text-pretty md:text-2xl">
                <Link
                  href={`/publications/${pub.id}`}
                  className="underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
                >
                  {pub.title}
                </Link>
              </Title>
              <p className="text-sm text-pretty text-muted-foreground">
                <Credits people={site.authorsOf(pub)} />
              </p>
              <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-muted-foreground">
                {venue && <span className="italic">{venue}</span>}
                {!showYear && <span>{pub.year}</span>}
                {status && (
                  <span className="rounded-full border border-border px-2 py-0.5 text-xs">
                    {status}
                  </span>
                )}
                {pub.isOpenAccess && <span className="text-xs">Open access</span>}
                {links.map((link) => (
                  <OutLink key={link.text} href={link.href}>
                    {link.text}
                  </OutLink>
                ))}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
