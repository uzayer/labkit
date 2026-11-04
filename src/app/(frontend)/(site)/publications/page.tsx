import type { Metadata } from 'next'
import Link from 'next/link'

import { PageHeader } from '@/components/site/page-header'
import { PublicationList } from '@/components/site/publication-list'
import { EmptyState, Section } from '@/components/site/section'
import { getSite } from '@/lib/site'
import { groupByYear, publicationTypeLabel } from '@/lib/site/format'
import { label, sectionTitle } from '@/lib/site/typography'
import { cn } from '@/utils'

// Rendered per request, not cached like the other pages: the filters are read
// from the query string. The records it reads are still cached.
export const dynamic = 'force-dynamic'

export const metadata: Metadata = { title: 'Publications' }

type Props = { searchParams: Promise<{ year?: string; type?: string }> }

/** A filter link: the current query with one value set (or cleared). */
const filterHref = (
  current: { year?: string; type?: string },
  change: Record<string, string | undefined>,
) => {
  const query = new URLSearchParams()
  for (const [key, value] of Object.entries({ ...current, ...change })) {
    if (value) query.set(key, value)
  }
  const qs = query.toString()
  return qs ? `/publications?${qs}` : '/publications'
}

export default async function PublicationsPage({ searchParams }: Props) {
  const site = await getSite()
  const params = await searchParams
  const { publications } = site
  const filters = { year: params.year, type: params.type }

  const years = [...new Set(publications.map((p) => p.year))].sort((a, b) => b - a)
  const types = [...new Set(publications.flatMap((p) => (p.type ? [p.type] : [])))]
  const shown = publications.filter(
    (pub) =>
      (!filters.year || String(pub.year) === filters.year) &&
      (!filters.type || pub.type === filters.type),
  )
  const groups = groupByYear(shown, (pub) => pub.year)
  const span =
    years.length > 1 ? `${years.at(-1)}–${years[0]}` : years.length === 1 ? String(years[0]) : ''

  return (
    <>
      <PageHeader
        eyebrow="Research"
        title="Publications"
        description={`Papers, articles and other work from ${site.labName}, newest first.`}
        facts={[
          { value: String(publications.length), label: 'Publications' },
          { value: span, label: 'Years' },
        ]}
      />

      {publications.length === 0 ? (
        <Section first title="All publications">
          <EmptyState>
            No publications yet. They appear here once imported from an ORCID record, a BibTeX file
            or a citation list, or added by hand in the admin panel.
          </EmptyState>
        </Section>
      ) : (
        <section className="container pb-12 md:pb-16">
          <nav
            aria-label="Filter publications"
            className="flex flex-col gap-4 border-t border-border pt-6"
          >
            <FilterRow
              title="Year"
              options={[
                {
                  text: 'All',
                  href: filterHref(filters, { year: undefined }),
                  current: !filters.year,
                },
                ...years.map((year) => ({
                  text: String(year),
                  href: filterHref(filters, { year: String(year) }),
                  current: filters.year === String(year),
                })),
              ]}
            />
            {types.length > 1 && (
              <FilterRow
                title="Type"
                options={[
                  {
                    text: 'All',
                    href: filterHref(filters, { type: undefined }),
                    current: !filters.type,
                  },
                  ...types.map((type) => ({
                    text: publicationTypeLabel(type) ?? type,
                    href: filterHref(filters, { type }),
                    current: filters.type === type,
                  })),
                ]}
              />
            )}
          </nav>

          {/* Announced, so a screen reader hears what a filter changed. */}
          <p role="status" className="mt-6 text-sm text-muted-foreground">
            {shown.length === publications.length
              ? `Showing all ${shown.length}`
              : `Showing ${shown.length} of ${publications.length}`}
          </p>

          {groups.length === 0 && (
            <div className="mt-8">
              <EmptyState>
                Nothing matches these filters.{' '}
                <Link href="/publications" className="underline underline-offset-4">
                  Show all publications
                </Link>
                .
              </EmptyState>
            </div>
          )}

          {groups.map((group) => (
            <section key={group.year} aria-labelledby={`year-${group.year}`} className="mt-12">
              <h2 id={`year-${group.year}`} className={cn(sectionTitle, 'mb-4 tabular-nums')}>
                {group.year}
              </h2>
              <PublicationList site={site} publications={group.items} />
            </section>
          ))}
        </section>
      )}
    </>
  )
}

function FilterRow({
  title,
  options,
}: {
  title: string
  options: { text: string; href: string; current: boolean }[]
}) {
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:items-baseline sm:gap-6">
      <p className={cn(label, 'w-12 shrink-0')}>{title}</p>
      <ul className="flex flex-wrap gap-2">
        {options.map((option) => (
          <li key={option.href}>
            <Link
              href={option.href}
              aria-current={option.current ? 'true' : undefined}
              scroll={false}
              className="inline-block rounded-full border border-border px-3 py-1 text-sm tabular-nums transition-colors hover:border-foreground aria-[current=true]:border-foreground aria-[current=true]:bg-foreground aria-[current=true]:text-background"
            >
              {option.text}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
