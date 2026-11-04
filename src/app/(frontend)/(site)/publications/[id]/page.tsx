import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import { citationMetaToOther, publicationCitationMeta, publicationJsonLd } from '@labkit/core/seo'

import { Credits } from '@/components/site/credits'
import { JsonLd } from '@/components/site/json-ld'
import { OutLink } from '@/components/site/links'
import { readingLinks } from '@/components/site/publication-list'
import { ProjectList } from '@/components/site/record-lists'
import { Section } from '@/components/site/section'
import { serverUrl } from '@/config/server'
import { getSite } from '@/lib/site'
import {
  AWARD_CATEGORY_LABELS,
  PUBLICATION_STATUS_LABELS,
  publicationTypeLabel,
  slugOf,
} from '@/lib/site/format'
import { label, pageTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

type Props = { params: Promise<{ id: string }> }

// None at build: each page renders on its first request and is then cached.
export function generateStaticParams() {
  return []
}

const LINK_LABELS: Record<string, string> = {
  code: 'Code',
  data: 'Data',
  slides: 'Slides',
  video: 'Video',
  poster: 'Poster',
  supplement: 'Supplement',
  other: 'Link',
}

/**
 * The Publication's page carries its Google Scholar `citation_*` tags, which
 * Scholar reads as describing this page's paper (so they go on no other page).
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const site = await getSite()
  const pub = site.findPublication((await params).id)
  if (!pub) return {}
  return {
    title: pub.title,
    description: pub.abstract?.slice(0, 300) || undefined,
    other: citationMetaToOther(
      publicationCitationMeta(site.populatedPublication(pub), { siteUrl: serverUrl }),
    ),
  }
}

export default async function PublicationPage({ params }: Props) {
  const site = await getSite()
  const pub = site.findPublication((await params).id)
  if (!pub) notFound()

  const venue = site.venueName(pub)
  const status = PUBLICATION_STATUS_LABELS[pub.status]
  const pages = [pub.pageStart, pub.pageEnd].filter(Boolean).join('–')
  const date = pub.publicationDate
    ? new Date(pub.publicationDate).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        timeZone: 'UTC',
      })
    : String(pub.year)
  const facts = [
    { term: 'Venue', value: venue },
    { term: 'Published', value: date },
    { term: 'Location', value: pub.location },
    {
      term: 'Volume',
      value: [pub.volume, pub.issue && `issue ${pub.issue}`].filter(Boolean).join(', '),
    },
    { term: 'Pages', value: pages },
    { term: 'Publisher', value: pub.publisher },
    { term: 'DOI', value: pub.doi },
  ].filter((fact) => fact.value)
  const links = [
    ...readingLinks(site, pub),
    ...(pub.links ?? []).map((link) => ({
      href: link.url,
      text: link.label || LINK_LABELS[link.type],
    })),
  ]
  const themes = site.themes(pub.themes)
  const awards = site.awardsIn(pub.awards)
  const projects = site.projectsForPublication(pub.id)
  // A preprint links to its published version, and the published version lists its preprints.
  const publishedVersion = site.publicationsIn([pub.versionOf])[0]
  const preprints = site.preprintsOf(pub.id)

  return (
    <>
      <article>
        <header className="container pt-16 pb-12 md:pt-28 md:pb-16">
          <p className={label}>
            <Link href="/publications" className="hover:text-foreground">
              Publications
            </Link>
            <span aria-hidden> / </span>
            {[publicationTypeLabel(pub.type), pub.year].filter(Boolean).join(' · ')}
          </p>
          <h1 className={cn(pageTitle, 'mt-4 max-w-5xl text-4xl md:text-6xl')}>{pub.title}</h1>
          <p className="mt-8 max-w-4xl border-t border-border pt-6 text-lg text-pretty text-muted-foreground">
            <Credits people={site.authorsOf(pub)} />
          </p>
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
            {status && (
              <span className="rounded-full border border-border px-2.5 py-0.5 text-xs">
                {status}
              </span>
            )}
            {pub.isOpenAccess && <span className="text-xs text-muted-foreground">Open access</span>}
            {links.map((link) => (
              <OutLink key={link.href} href={link.href}>
                {link.text}
              </OutLink>
            ))}
          </div>
          {awards.length > 0 && (
            <ul className="text-brand mt-6 flex flex-col gap-1 text-sm">
              {awards.map((award) => (
                <li key={award.id}>
                  {award.title}
                  {award.category && ` (${AWARD_CATEGORY_LABELS[award.category]})`}
                </li>
              ))}
            </ul>
          )}
        </header>

        {pub.abstract && (
          <Section first title="Abstract">
            <p className="max-w-prose text-lg leading-relaxed text-pretty whitespace-pre-line">
              {pub.abstract}
            </p>
            {(pub.keywords?.length ?? 0) > 0 && (
              <p className="mt-6 max-w-prose text-sm text-muted-foreground">
                Keywords: {pub.keywords?.join(', ')}
              </p>
            )}
          </Section>
        )}

        <Section first={!pub.abstract} title="Details">
          <dl className="max-w-3xl text-sm">
            {facts.map((fact) => (
              <div
                key={fact.term}
                className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3"
              >
                <dt className="text-muted-foreground">{fact.term}</dt>
                <dd className="text-pretty">{fact.value}</dd>
              </div>
            ))}
            {publishedVersion && (
              <div className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3">
                <dt className="text-muted-foreground">Published as</dt>
                <dd>
                  <Link
                    href={`/publications/${publishedVersion.id}`}
                    className="underline underline-offset-4"
                  >
                    {publishedVersion.title}
                  </Link>
                </dd>
              </div>
            )}
            {preprints.map((preprint) => (
              <div
                key={preprint.id}
                className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3"
              >
                <dt className="text-muted-foreground">Preprint</dt>
                <dd>
                  <Link
                    href={`/publications/${preprint.id}`}
                    className="underline underline-offset-4"
                  >
                    {preprint.title}
                  </Link>
                </dd>
              </div>
            ))}
            {themes.length > 0 && (
              <div className="grid grid-cols-[8rem_1fr] gap-4 border-t border-border py-3">
                <dt className="text-muted-foreground">Research themes</dt>
                <dd className="flex flex-wrap gap-x-4 gap-y-1">
                  {themes.map((theme) => (
                    <Link
                      key={theme.id}
                      href={`/research/${slugOf(theme)}`}
                      className="underline underline-offset-4"
                    >
                      {theme.title}
                    </Link>
                  ))}
                </dd>
              </div>
            )}
          </dl>
          {pub.bibtex && (
            <details className="mt-8 max-w-3xl">
              <summary className="cursor-pointer text-sm font-medium">BibTeX</summary>
              <pre className="mt-3 overflow-x-auto rounded-md bg-muted p-4 text-xs leading-relaxed">
                {pub.bibtex}
              </pre>
            </details>
          )}
        </Section>

        {projects.length > 0 && (
          <Section title="Projects">
            <ProjectList projects={projects} />
          </Section>
        )}
      </article>

      <JsonLd
        data={publicationJsonLd(site.populatedPublication(pub), {
          siteUrl: serverUrl,
          url: `${serverUrl}/publications/${pub.id}`,
        })}
      />
    </>
  )
}
