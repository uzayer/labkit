'use client'

import { useMemo, useState } from 'react'
import Link from 'next/link'
import { ArrowRight, ArrowUpRight } from 'lucide-react'

import { SectionHeader, sectionSpacing } from '@/components/dial/editorial'
import { SegmentedControl } from '@/components/dial/segmented-control'
import { OptionalImage } from '@/components/dial/optional-image'
import {
  TYPE_INK,
  TYPE_LABELS,
  formatFull,
  formatInYear,
  getYear,
  isUpcoming,
  type NewsEntry,
  type NewsType,
} from '@/lib/dial/news'
import { listEnter, listStagger } from '@/lib/dial/motion'
import { displaySectionTitle } from '@/lib/dial/typography'
import { cn } from '@/lib/utils'
import { Tape } from '@/components/dial/marks'

// The vocabulary moved to @/lib/news so the entry page can share it; these
// re-exports keep the component's existing importers working.
export type { NewsEntry, NewsType }

/**
 * An entry's title, linking to its own page. An entry that also has an external
 * record carries that as a separate mark beside the title rather than on it —
 * one title, one destination, so a click is never a guess about where it goes.
 */
function EntryTitle({ entry, className }: { entry: NewsEntry; className?: string }) {
  return (
    <h3 className={cn('font-display text-2xl leading-snug text-balance', className)}>
      <Link
        href={`/news/${entry.slug}`}
        className="decoration-border underline-offset-4 hover:underline"
      >
        {entry.title}
      </Link>
      {entry.url && (
        <a
          href={entry.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${entry.title} — external announcement`}
          className="ml-1.5 inline-block align-baseline text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowUpRight className="inline size-4" />
        </a>
      )}
    </h3>
  )
}

const FILTERS: { value: NewsType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'academic', label: TYPE_LABELS.academic },
  { value: 'event', label: TYPE_LABELS.event },
  { value: 'community', label: TYPE_LABELS.community },
]

export function NewsFeed({ entries }: { entries: NewsEntry[] }) {
  const [activeType, setActiveType] = useState<NewsType | 'all'>('all')

  const upcoming = useMemo(
    () =>
      entries
        .filter((e) => isUpcoming(e.date))
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()),
    [entries],
  )

  const past = useMemo(() => entries.filter((e) => !isUpcoming(e.date)), [entries])
  const archive = useMemo(
    () =>
      past
        .filter((e) => activeType === 'all' || e.type === activeType)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    [past, activeType],
  )

  const years = [...new Set(archive.map((e) => getYear(e.date)))]

  return (
    <>
      {/* §1 Upcoming */}
      {upcoming.length > 0 && (
        <section className={cn('container', sectionSpacing, 'pt-0 md:pt-0')}>
          <SectionHeader label="Upcoming" title="Coming up" className="mb-6" />
          <ul className="grid gap-x-8 md:grid-cols-2">
            {upcoming.map((entry) => (
              <li key={entry.slug} className="border-t border-border py-6">
                <p className="text-brand text-sm">
                  {formatFull(entry.date, entry.datePrecision)} · {TYPE_LABELS[entry.type]}
                </p>
                <EntryTitle entry={entry} className="mt-2" />
                <p className="mt-2 text-pretty text-muted-foreground">{entry.description}</p>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* §2 Archive */}
      <section className={cn('container', sectionSpacing, upcoming.length === 0 && 'pt-0 md:pt-0')}>
        <div className="flex flex-col gap-4 border-t border-border pt-6 md:flex-row md:items-end md:justify-between">
          <h2 className={displaySectionTitle}>Archive</h2>
          <SegmentedControl<NewsType | 'all'>
            label="Filter by type"
            options={FILTERS.map((f) => ({
              ...f,
              count:
                f.value === 'all' ? past.length : past.filter((e) => e.type === f.value).length,
            }))}
            value={activeType}
            onChange={setActiveType}
          />
        </div>

        {years.map((year) => (
          <div key={year} className={cn('mt-12 grid gap-x-8 md:grid-cols-[8rem_1fr]', listEnter)}>
            <h3 className="font-display text-3xl tabular-nums md:sticky md:top-24 md:h-fit">
              {year}
            </h3>
            <ol className="divide-y divide-border">
              {archive
                .filter((e) => getYear(e.date) === year)
                .map((entry, i) => (
                  <li key={entry.slug} className={cn('news-row', listEnter)} style={listStagger(i)}>
                    {/* The row's index line. On a phone it runs across the top of
                        the entry — date on the left, kind on the right — so the
                        kinds form one column down the right edge and can be
                        scanned without reading the titles. From lg it is the
                        margin column beside the entry, as before. */}
                    <div className="flex items-center justify-between gap-4 text-sm text-muted-foreground lg:block">
                      <time dateTime={entry.date} className="tabular-nums">
                        {formatInYear(entry.date, entry.datePrecision)}
                      </time>
                      <span className={cn('news-row-kind', TYPE_INK[entry.type])}>
                        <span className="size-1.5 rounded-full bg-current" />
                        {TYPE_LABELS[entry.type]}
                      </span>
                    </div>
                    <div className="max-w-prose">
                      <EntryTitle entry={entry} />
                      <p className="mt-2 text-pretty text-muted-foreground">{entry.description}</p>
                      {entry.photo && (
                        <Link
                          href={`/news/${entry.slug}`}
                          // The frame is as wide as the photo, up to the column.
                          // `w-fit` got that from the image itself; a resized copy
                          // would shrink it, so the width is stated instead. (A
                          // fixed `width` would widen the column on a phone.)
                          style={entry.photoWidth ? { maxWidth: entry.photoWidth } : undefined}
                          className={cn(
                            'group relative mt-6 block',
                            entry.photoWidth ? 'w-full' : 'w-fit',
                          )}
                        >
                          {/* Tape rides with the photograph (see OptionalImage);
                              as a sibling it outlived a failed load and left a
                              strip of tape stuck to nothing. */}
                          <OptionalImage
                            src={entry.photo}
                            alt={entry.photoAlt ?? entry.title}
                            overlay={<Tape />}
                            frameClassName="sticker-alt rounded-sm shadow-[0_12px_28px_-20px_rgba(0,0,0,0.6)]"
                            // The column is max-w-prose, 690px at this type size.
                            sizes={
                              entry.photoWidth
                                ? `(max-width: 767px) 100vw, ${Math.min(entry.photoWidth, 690)}px`
                                : undefined
                            }
                            className="aspect-video"
                          />
                        </Link>
                      )}
                      <Link
                        href={`/news/${entry.slug}`}
                        className="group mt-4 inline-flex items-center gap-1.5 text-sm font-medium"
                      >
                        Read the entry
                        <ArrowRight className="arrow-ne size-4" />
                      </Link>
                    </div>
                  </li>
                ))}
            </ol>
          </div>
        ))}

        {archive.length === 0 && (
          <p className="mt-12 text-muted-foreground">Nothing recorded for this type yet.</p>
        )}
      </section>
    </>
  )
}
